const { Board } = require('./Board');

// list of strategies that require possible values to be marked for applyStrategy to reference
const requiresCalculate = new Set(['naked-subset', 'hidden-subset']);

const SetMethods = require('./SetMethods');

class Strategy {

    /**
     * takes strategy name and returns appropriate strategy function
     * @param {*} strategy 
     */
    static _getStrategy(strategy) {
        switch (strategy) {
            case 'sole-candidate':
                return Strategy._soleCandidate;
            case 'unique-candidate':
                return Strategy._uniqueCandidate;
            case 'naked-subset':
                return Strategy._nakedSubset;
        }
    }

    /**   
     * _soleCandidate attempts to solve the specified cell using the sole candidate strategy.
     * If the cell is solved it returns the value, otherwise it returns false.
     * It does NOT modify the board
     */
    static _soleCandidate(board, rowI, colI) {
        const row = Board.getRow(board, rowI + 1);
        const col = Board.getCol(board, colI + 1);
        const box = Board.getBox(board, Board.getBoxNum(rowI + 1, colI + 1));
        const relatedCells = new Set(Board.convertCellsToCharacters([...row, ...col, ...box]).split(','));

        // 9 because 0 makes for an extra value
        if (relatedCells.size !== 9) {
            return false;
        }

        for (let value of '123456789'.split('')) {
            if (!relatedCells.has(value)) {
                return value;
            }
        }

    }


    /**
     *  
    * - Solves using the specified strategy. 
    * 
    * - Strategy argument is lower-skewer case string
    * 
    * - Available strategy argments: 
    *   1. 'sole-candidate'
    *   2. 'unique-candidate'  
    *   3. 'naked-subset' 
    * 
    * - By default finds the first blank cell and moves left to right up to down until it solves a single cell. 
    *      
    * - Board is not modified
    *      
    * - Returns object with new board and solutions
    *      - {board, solutions}
    *      - solutions nested array of all values 
    *      - Nested arrays are of form [rowIndex, colIndex, 'value'] ([3, 5, '2'])
    *
    *  - Options allow us to: 
    *       - specify a cell to start with (rowI and colI)
    *       - choose to attempt to solve all cells in the board (trySolveAll)
    *       - choose to solve only the specific cell (onlySpecifiedCell)
    *       - if both trySolveAll and onlySpecifiedCell are true, an error is thrown
    *       - if a coordinate is NOT given and onlySpecifiedCell is true an error is thrown
    *       - additionalArgs will take an array of arguments that will be spread into the strategy after board, rowI, colI
    *   
    */

    static applyStrategy(board, strategy, { rowI = null, colI = null, trySolveAll = false, onlySpecifiedCell = false, additionalArgs = [] }) {
        if (requiresCalculate.has(strategy) && !board.isCalcuated) {
            Board.calculateMissingValues(board);
        }

        strategy = Strategy._getStrategy(strategy);
        // if additionalArgs, curry stategy into a function that adds it onto the end.
        if (additionalArgs.length) {
            let original = strategy;
            strategy = function (board, rowI, colI) {
                return original(board, rowI, colI, ...additionalArgs);
            };
        }

        if (trySolveAll && onlySpecifiedCell) {
            throw new Error('Error! Both trySolveAll and onlySpecifiedCell were both set true!');
        }

        if ((rowI === null || colI === null) && onlySpecifiedCell) {
            throw new Error("Error! onlySpecifiedCell=true requires both rowI and colI to be passed ")
        }

        const solutions = [];

        if (!rowI) {
            [rowI, colI] = board.blankCellsIndices[0];
        }

        if (onlySpecifiedCell) {
            const solution = strategy(board, rowI, colI);
            if (!solution) {
                return false;
            }

            board = Board.addValue(board, rowI + 1, colI + 1, solution, board.isCalcuated);
            solutions.push([rowI, colI, solution]);
            return { board, solutions };
        }

        // index for current cell within the blankCellsIndices property belonging to the Board object
        // presumes the cell coordinates passed are for a blank cell
        let initialBlankCellsIndicesIndex = Board.getNextBlankCellIndicesIndex(board, rowI, colI);
        initialBlankCellsIndicesIndex = (initialBlankCellsIndicesIndex === 0) ? 0 : initialBlankCellsIndicesIndex - 1;

        // save initial board's blankCellsIndices because we will be changing the board variable
        const blankCellsIndices = board.blankCellsIndices;

        for (let i = initialBlankCellsIndicesIndex; i < blankCellsIndices.length; i++) {
            let indices = blankCellsIndices[i];
            let solution = strategy(board, indices[0], indices[1]);
            if (solution) {
                solutions.push([indices[0], indices[1], solution]);
                board = Board.addValue(board, indices[0] + 1, indices[1] + 1, solution, board.isCalcuated);
            }
        }

        if (trySolveAll && initialBlankCellsIndicesIndex > 0) {
            for (let i = initialBlankCellsIndicesIndex - 1; i < initialBlankCellsIndicesIndex; i++) {
                let indices = blankCellsIndices[i];
                let solution = strategy(board, indices[0], indices[1]);
                if (solution) {
                    solutions.push([indices[0], indices[1], solution]);
                    board = Board.addValue(board, indices[0] + 1, indices[1] + 1, solution);
                }
            }
        }

        if (solutions.length === 0) return false;
        return { board, solutions };
    }

    /**
     * Attempts to solve cell using the unique candidate strategy
     * 
     * If successful returns solution value, otherwise false
     * 
     * The possibilities parameter is optional and will simply limit solving to that value. Otherwise all possible 
     * solutions are attempted.
     * 
     * @param {Board} board 
     * @param {Number} rowI 
     * @param {Number} colI 
     * @param {String} particularNumber 
     */
    static _uniqueCandidate(board, rowI, colI, ...possibilities) {
        const row = Board.convertCellsToCharacters(Board.getRow(board, rowI + 1)).split(',');
        const col = Board.convertCellsToCharacters(Board.getCol(board, colI + 1)).split(',');
        const boxNum = Board.getBoxNum(rowI + 1, colI + 1);

        const box = Board.convertCellsToCharacters(Board.getBox(board, boxNum)).split(',');

        if (possibilities.length === 0) {
            let cells = new Set([...row, ...col, ...box]);
            let digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
            for (let digit of digits) {
                if (!cells.has(digit)) {
                    possibilities.push(digit);
                }
            }
        }

        const [rows, cols] = Board.getRowAndColNums(boxNum);
        for (let i = 0; i < 3; i++) {
            if (rows[i] === rowI + 1) {
                rows.splice(i, 1, row);
            }
            else {
                rows[i] = Board.convertCellsToCharacters(Board.getRow(board, rows[i])).split(',');
            }

            if (cols[i] === colI + 1) {
                cols.splice(i, 1, col);
            }
            else {
                cols[i] = Board.convertCellsToCharacters(Board.getCol(board, cols[i])).split(',');
            }
        }

        // for each possible value make a small box to model the sudoku box, modelBox
        // set all the elements of each row and col that has the value to 'X'
        // if we have only one blank cell at the end of an iteration, we know we have the right value
        for (let value of possibilities) {
            let modelBox = [box.slice(0, 3), box.slice(3, 6), box.slice(6, 9)];
            for (let i = 0; i < 3; i++) {
                if (rows[i].includes(value)) {
                    modelBox[i] = ['X', 'X', 'X'];
                }

                if (cols[i].includes(value)) {
                    modelBox[0][i] = 'X';
                    modelBox[1][i] = 'X';
                    modelBox[2][i] = 'X';
                }
            }

            let blankCellCount = 0;
            for (let row of modelBox) {
                for (let rowValue of row) {
                    if (rowValue === '0') {
                        blankCellCount++;
                    }
                }
            }
            if (blankCellCount === 1) {
                return value;
            }
        }

        return false;
    }

    /**
     * Attempts to solve for the value of a cell or to decrease the number of possibile values for that cell with the naked subset
     * rule.
     * 
     * additionalArgs:
     *  -   setSize: the size of the set we are attempt to find as a naked set    
     *  -   structuretype: default sovles by the row struture, but can pass 'col' or 'box' to override.
     *  -   solveForPossibilities: default is false. When false we attempt to solve only to a single solution. We return 
     *      the solution string it self if successful or false. When solveForPossibilities is true, this will return 
     *      Set<string> with the updated possibleValues if we are able to succesfully decrease the number of possibilities. 
     *      Other wise returns false.
     * 
     * @param {Board} board 
     * @param {Number} rowI starts at 0
     * @param {Number} colI starts at 0 
     * @param  {Array<Number, String, Boolean>} param3 
     */
    static _nakedSubset(board, rowI, colI, ...[setSize = 2, structureType = 'row', solveForPossibilities = false]) {
        const targetCell = board.puzzle[rowI][colI];
        if (!solveForPossibilities && targetCell.possibleValues.size !== setSize + 1) {
            return false;
        }
        else if (solveForPossibilities && targetCell.possibleValues.size <= setSize) {
            return false;
        }

        let getStructures = null;
        let structureNums = null;
        if (structureType === 'row') {
            getStructures = [Board.getRow];
            structureNums = [rowI + 1];
        }
        else if (structureType === 'col') {
            getStructures = [Board.getCol];
            structureNums = [colI + 1];
        }
        else if (structureType === 'box') {
            getStructures = [Board.getBox];
            structureNums = [Board.getBoxNum(rowI + 1, colI + 1)];
        }
        else if (structureType === 'all') {
            getStructures = [
                Board.getRow,
                Board.getCol,
                Board.getBox
            ];
            structureNums = [rowI + 1, colI + 1, Board.getBoxNum(rowI + 1, colI + 1)];
        }

        // this will only be returned if solveForPossibilities was set 
        let possibleSolutions = [];

        for (let i = 0; i < getStructures.length; i++) {

            // find all sets of possibleValues for each cell in the structure that is of the correct set size
            let possibleMatchingSets = {};
            const structure = getStructures[i](board, structureNums[i]);
            for (let cell of structure) {
                if (cell.possibleValues.size === setSize) {
                    const set = cell.possibleValues;
                    const setString = set + '';
                    const occurences = (possibleMatchingSets[setString]) ? possibleMatchingSets[setString].occurences + 1 : 1;
                    possibleMatchingSets[setString] = { set, occurences };
                }
            }

            // remove any set from the possible matches that does not share its number of occurences with the 
            // set size. 
            possibleMatchingSets = Object.values(possibleMatchingSets).filter(match => match.occurences === setSize);

            for (let match of possibleMatchingSets) {
                let targetSet = new Set(targetCell.possibleValues);
                for (let element of match.set) {
                    targetSet.delete(element);
                }
                if (!solveForPossibilities && targetSet.size === 1) {
                    targetSet = Array.from(targetSet.values());
                    return targetSet[0];
                }
                else if (solveForPossibilities && targetSet.size < targetCell.possibleValues.size) {
                    possibleSolutions.push(targetSet);
                }
            }

        }
        if (possibleSolutions.length > 0) {
            let returnedSet = possibleSolutions[0];
            for (let i = 1; i < getStructures.length; i++) {
                returnedSet = SetMethods.intersection(returnedSet, possibleSolutions[i]);
            }
            return returnedSet;
        }

        return false;
    }










    // *******************************INCOMPLETE******************
    /* 
        Things to fix
            1. We need to allow to combine one or more of the sets that are naked.  
                - 3,7,8 and 7,8 will be hidden sets for 78
            2. We need to make sure there is not other 
    */



    /**
     * Solves using hidden subset
     * setSize will stand for hidden subset within the larger set.
     * @param {Board} board 
     * @param {Number} rowI 
     * @param {Number} colI 
     * @param  {Array<Number, String, Boolean>} param3 
     */
    static _hiddenSubset(board, rowI, colI, ...[setSize = 2, structureType = 'row', solveForPossibilities = false]) {
        const targetCell = board.puzzle[rowI][colI];

        let getStructures = null;
        let structureNums = null;
        if (structureType === 'row') {
            getStructures = [Board.getRow];
            structureNums = [rowI + 1];
        }
        else if (structureType === 'col') {
            getStructures = [Board.getCol];
            structureNums = [colI + 1];
        }
        else if (structureType === 'box') {
            getStructures = [Board.getBox];
            structureNums = [Board.getBoxNum(rowI + 1, colI + 1)];
        }
        else if (structureType === 'all') {
            getStructures = [
                Board.getRow,
                Board.getCol,
                Board.getBox
            ];
            structureNums = [rowI + 1, colI + 1, Board.getBoxNum(rowI + 1, colI + 1)];
        }

        const possibleSolutions = [];
        for (let i = 0; i < getStructures.length; i++) {
            let targetSet = targetCell.possibleValues;
            // get all possible matching sets
            let possibleSets = [];

            const structure = getStructures[i](board, structureNums[i]);
            for (let cell of structure) {
                if (cell === targetCell) continue;
                const set = cell.possibleValues;
                if (set.size >= setSize) {
                    for (let el of targetSet) {
                        if (set.has(el)) {
                            possibleSets.push(set);
                            break;
                        }
                    }
                }
            }

            // find all sets of possibleValues for each cell in the structure that is of the correct set size
            let possibleMatchingSets = {};
            for (let subSet of SetMethods.powerSet(targetSet)) {
                if (subSet.size < setSize || subSet.size === targetSet.size) continue;
                for (let set of possibleSets) {
                    if (SetMethods.isProperSubset(subSet, set)) {
                        const setString = [...subSet] + '';
                        const occurences = (possibleMatchingSets[setString]) ? possibleMatchingSets[setString].occurences + 1 : 1;
                        possibleMatchingSets[setString] = { set: subSet, occurences };
                    }

                }
            }
            possibleMatchingSets = Object.values(possibleMatchingSets).filter(match => match.occurences === setSize);

            for (let match of possibleMatchingSets) {
                let targetSet = new Set(targetCell.possibleValues);
                for (let element of match.set) {
                    targetSet.delete(element);
                }
                if (!solveForPossibilities && targetSet.size === 1) {
                    targetSet = Array.from(targetSet.values());
                    return targetSet[0];
                }
                else if (solveForPossibilities && targetSet.size < targetCell.possibleValues.size) {
                    possibleSolutions.push(targetSet);
                }
            }
        }
        if (possibleSolutions.length > 0) {
            let returnedSet = possibleSolutions[0];
            for (let i = 1; i < getStructures.length; i++) {
                returnedSet = SetMethods.intersection(returnedSet, possibleSolutions[i]);
            }
            return returnedSet;
        }

        return false;
    }

    static _pointingPairsAndTripples(board, solve = false) {
        board = new Board(Board.toString(board), { calculate: true });

        const structures = [{ 'get': Board.getRow }, { 'get': Board.getCol }];

        for (let i = 1; i < 10; i++) {
            const [boxRows, boxCols] = Board.getBoxRowsAndCols(board, i);
            structures[0].rowsOrCols = boxRows;
            structures[1].rowsOrCols = boxCols;
            const box = Board.getBox(board, i);
            const missingBoxValues = Board.getMissingBoxValues(board, i);
            for (let missingValue of missingBoxValues) {

                // possible cells is the number of cells in the entire box that have the missingValue in their set of 
                // possible values
                let possibleCells = 0;
                for (let cell of box) {
                    if (cell.possibleValues.has(missingValue)) possibleCells++;
                }

                for (let i = 0; i < 2; i++) {
                    for (let rowOrCol of structures[i].rowsOrCols) {
                        let cellsMissingTheValue = 0;

                        for (let cell of rowOrCol) {
                            if (cell.possibleValues.has(missingValue)) {
                                cellsMissingTheValue++;
                            }
                        }
                        if (cellsMissingTheValue === possibleCells) {
                            const relatedRowOrCol = structures[i].get(board, rowOrCol[0].indices[i] + 1);
                            for (let relatedCell of relatedRowOrCol) {
                                if (rowOrCol.includes(relatedCell)) continue;
                                if (relatedCell.value === '0') {
                                    let possibleValues = Array.from(relatedCell.possibleValues); 
                                    relatedCell.possibleValues.delete(missingValue);
                                    if(relatedCell.possibleValues.size === 0) console.log(possibleValues);
                                    if (solve) {
                                        if (relatedCell.possibleValues.size === 1) {
                                            let [rowI, colI] = relatedCell.indices;
                                            let solution = relatedCell.possibleValues.values().next();
                                            solution = solution.value;
                                            board = Board.addValue(board, rowI + 1, colI + 1, solution, true)
                                            solution = [rowI, colI, solution];
                                            return { board, solution };
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            }

        }


        return { board };
    }

}

module.exports = Strategy;