const {Board, Cell} = require('./Board');


class Strategy{

    /**
     * takes strategy name and returns appropriate strategy function
     * @param {*} strategy 
     */
    static _getStrategy(strategy){
        switch(strategy){
            case 'sole-candidate':
            return Strategy._soleCandidate; 
            case 'unique-candidate': 
            return Strategy._uniqueCandidate;
        }
    }

    /**   
     * _soleCandidate attempts to solve the specified cell using the sole candidate strategy.
     * If the cell is solved it returns the value, otherwise it returns false.
     * It does NOT modify the board
     */
    static _soleCandidate(board, rowI, colI){

        const row = Board.getRow(board, rowI + 1); 
        const col = Board.getCol(board, colI + 1); 
        const box = Board.getBox(board, Board.getBoxNum(rowI + 1, colI + 1));
        const relatedCells = new Set(Board.convertCellsToCharacters([...row, ...col, ...box]).split(','));

        // 9 because 0 makes for an extra value
        if(relatedCells.size !== 9){
            return false;
        }

        for(let value of '123456789'.split('')){
            if(!relatedCells.has(value)){
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
    
         static applyStrategy(board, strategy, {rowI=null, colI=null, trySolveAll=false, onlySpecifiedCell=false, additionalArgs=[]}){
            strategy = Strategy._getStrategy(strategy); 

            // if additionalArgs, curry stategy into a function that adds it onto the end.
            if(additionalArgs.length){
                let original = strategy; 
                strategy = function(board, rowI, colI){
                    return original(board, rowI, colI, ...additionalArgs);
                };
            }

            if(trySolveAll && onlySpecifiedCell){
                throw new Error('Error! Both trySolveAll and onlySpecifiedCell were both set true!'); 
            }
    
            if((rowI === null || colI === null) && onlySpecifiedCell){
                throw new Error("Error! onlySpecifiedCell=true requires both rowI and colI to be passed ")
            }
            if(additionalArgs[0] === '4') console.log('here');
    
            const solutions = []; 
    
            if(!rowI){
                [rowI, colI] = board.blankCellsIndices[0]; 
            }
            
            if(onlySpecifiedCell){
                const solution = strategy(board, rowI, colI);
                if(!solution){
                    return false; 
                }
    
                board = Board.addValue(board, rowI + 1, colI + 1, solution);
                solutions.push([rowI, colI, solution]);
                return {board, solutions};
            }

            // index for current cell within the blankCellsIndices property belonging to the Board object
            // presumes the cell coordinates passed are for a blank cell
            const initialBlankCellsIndicesIndex = Board.getNextBlankCellIndicesIndex(board, rowI, colI) - 1;
            
            // save initial board's blankCellsIndices because we will be changing the board variable
            const blankCellsIndices = board.blankCellsIndices; 
    
            for(let i = initialBlankCellsIndicesIndex; i < blankCellsIndices.length; i++){
                let indices = blankCellsIndices[i]; 
                let solution = strategy(board, indices[0], indices[1]); 
                if(solution){
                    solutions.push([indices[0], indices[1], solution]); 
                    board = Board.addValue(board, indices[0] + 1, indices[1] + 1, solution); 
                }
            }
    
            if(trySolveAll && initialBlankCellsIndicesIndex > 0){
                for(let i = initialBlankCellsIndicesIndex - 1; i < initialBlankCellsIndicesIndex; i++){
                    let indices = blankCellsIndices[i]; 
                    let solution = strategy(board, indices[0], indices[1]); 
                    if(solution){
                        solutions.push([indices[0], indices[1], solution]); 
                        board = Board.addValue(board, indices[0] + 1, indices[1] + 1, solution); 
                    }
                }
            }
    
            if(solutions.length === 0) return false;
            return {board, solutions};
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
        static _uniqueCandidate(board, rowI, colI, ...possibilities){
            const row = Board.convertCellsToCharacters(Board.getRow(board, rowI + 1)).split(',');
            const col = Board.convertCellsToCharacters(Board.getCol(board, colI + 1)).split(','); 
            const boxNum  = Board.getBoxNum(rowI + 1, colI + 1);

            const box = Board.convertCellsToCharacters(Board.getBox(board, boxNum)).split(','); 

            if(possibilities.length === 0){
                let cells = new Set([...row, ...col, ...box]); 
                let digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9']; 
                for(let digit of digits){
                    if(!cells.has(digit)){
                        possibilities.push(digit); 
                    }
                }
            }

            const [rows, cols] = Board.getRowAndColNums(boxNum);
            for(let i = 0; i < 3; i++){
                if(rows[i] === rowI + 1){
                    rows.splice(i, 1, row);
                }
                else{
                    rows[i] = Board.convertCellsToCharacters(Board.getRow(board, rows[i])).split(','); 
                }

                if(cols[i] === colI + 1){
                    cols.splice(i, 1, col);
                }
                else{
                    cols[i] = Board.convertCellsToCharacters(Board.getCol(board, cols[i])).split(',');
                }
            }

            // for each possible value make a small box to model the sudoku box, modelBox
            // set all the elements of each row and col that has the value to 'X'
            // if we have only one blank cell at the end of an iteration, we know we have the right value
            for(let value of possibilities){
                let modelBox = [box.slice(0, 3), box.slice(3, 6), box.slice(6, 9)]; 
                for(let i = 0; i < 3; i++){
                    if(rows[i].includes(value)){
                        modelBox[i] = ['X','X','X'];
                    }

                    if(cols[i].includes(value)){
                        modelBox[0][i] = 'X';
                        modelBox[1][i] = 'X'; 
                        modelBox[2][i] = 'X';
                    }
                }

                let blankCellCount = 0;
                for(let row of modelBox){
                    for(let rowValue of row){
                        if(rowValue === '0'){
                            blankCellCount++; 
                        }
                    }
                }
                if(blankCellCount === 1){
                    return value; 
                }
            }

            return false;
        }
}

module.exports = Strategy; 