const difficultySettings = require('./difficultySettings');
const solve = require('./solve');
const { Board } = require('./Board');


const blankSudokuString =
    `0,0,0,0,0,0,0,0,0
0,0,0,0,0,0,0,0,0
0,0,0,0,0,0,0,0,0
0,0,0,0,0,0,0,0,0
0,0,0,0,0,0,0,0,0
0,0,0,0,0,0,0,0,0
0,0,0,0,0,0,0,0,0
0,0,0,0,0,0,0,0,0
0,0,0,0,0,0,0,0,0
`;



class Generator {

    /**
     * creates and returns a randomized full sudoku board
     * @returns {Board}
     */
    static _generateFullBoard() {
        while (true) {
            let time = Date.now();
            let board = new Board(blankSudokuString);
            while (board.cellsMissing > 72) {
                const blankCellIndicesIndex = Math.floor(Math.random() * board.blankCellsIndices.length);
                const blankCellIndices = board.blankCellsIndices[blankCellIndicesIndex];
                let randomValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
                let randomIndex = Math.floor(Math.random() * randomValues.length);
                let randomValue = randomValues.splice(randomIndex, 1)[0];
                let newBoard = Board.addValue(board, blankCellIndices[0] + 1, blankCellIndices[1] + 1, randomValue);
                while (!newBoard) {
                    randomIndex = Math.floor(Math.random() * randomValues.length);
                    randomValue = randomValues.splice(randomIndex, 1)[0];
                    newBoard = Board.addValue(board, blankCellIndices[0] + 1, blankCellIndices[1] + 1, randomValue);
                }

                board = newBoard;
            }


            board = solve(board, time, 500);
            if (board === 'break') {
                continue;
            }
            return board;
        }
    }



    /**
     * Finds a non-blank cell at random and returns its indices
     * @param {Board} board 
     * @returns {Array<Number, Number>}
     */
    static _getRandomFilledCellIndices(board) {
        while (true) {
            let i = Math.floor(Math.random() * 9);
            let j = Math.floor(Math.random() * 9);
            if (board.puzzle[i][j].value !== '0') {
                return [i, j];
            }
        }
    }


    /**
     * Takes a board and returns an array of all the filled cells on the board with their order shuffled
     * @param {Board} board 
     * @returns {Array<Cell>}
     */
    static _getFilledCellsShuffled(board) {
        const filledCells = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board.puzzle[i][j].value !== '0') {
                    filledCells.push(board.puzzle[i][j]);
                }
            }
        }

        for (let i = filledCells.length - 1; i > 0; i--) {
            let cell1 = filledCells[i];
            let randomIndex = Math.floor(Math.random() * i);
            filledCells[i] = filledCells[randomIndex];
            filledCells[randomIndex] = cell1;
        }
        return filledCells;
    }


    /**
     * applies difficulty setting to the board and returns an object describing whether or not the board passed the difficulty 
     * settings and how close it got
     * 
     * @param {Board} board 
     * @param {object} difficultySetting 
     * @param {Date} time 
     * @returns {{boardSolved: Boolean, difficultyMet: Boolean, strategiesRequired: Number, solvedBoard: Board, strategiesUsed: Number}}
     */
    static _applyDifficultySetting(board, difficultySetting, time) {
        const strategyNames = new Set(difficultySetting.strategyNames);
        const strategiesLength = difficultySetting.strategies.length;
        let cellsLeft = 82;

        const strategiesUsed = new Set();
        outerLoop:
        while (cellsLeft > board.cellsMissing) {
            for (let i = 0; i < strategiesLength; i++) {
                if (Date.now() - time > difficultySetting.timeLimit) break outerLoop;
                cellsLeft = board.cellsMissing;

                if (board.cellsMissing === 0) {
                    cellsLeft = board.cellsMissing;
                    break;
                }

                let strategy = difficultySetting.strategies[i];
                let strategyName = difficultySetting.strategyNames[i];
                let results = strategy(board);
                if (results && results.board.cellsMissing < cellsLeft) {
                    strategiesUsed.add(strategyName);
                    strategyNames.delete(strategyName);
                    board = results.board;
                    continue outerLoop;
                }
            }
        }
        return {
            boardSolved: (board.cellsMissing === 0),
            difficultyMet: (strategyNames.size === 0),
            strategiesRequired: Math.abs(strategyNames.size - difficultySetting.strategyNames.length),
            solvedBoard: board,
            strategiesUsed
        }
    }


    /**
     * 
     * Takes a string specifying the difficulty.
     * Possible values are 'level-one', 'level-two', 'level-three-A', 'level-three-B', and 'level-three-C'. 
     * Returns a new board meeting the difficulty requirmenets.
     * 
     * @param {String} difficulty 
     * @returns {Board}
     */
    static generatePuzzle(difficulty = 'level-one') {

        // get difficultySetting
        let difficultySetting;
        if (typeof difficulty === 'string') {
            difficultySetting = difficultySettings[difficulty];
        }
        else {
            difficultySetting = difficulty;
        }

        // get upper and lower bounds
        const lowerBlankCellBoundaryInclusive = difficultySetting['lowerBound'] || 32;
        const upperBlankCellBoundaryInclusive = difficultySetting['upperBound'] || 55;

        // loop over the generation process until a board is returned
        // each iteration will create new randomized full board 
        // if the first attempt to creating a board fails, it automatically begins atempting the 
        // second and so on
        while (true) {
            let fullBoard = Generator._generateFullBoard();
            let time = Date.now();

            // fallback is used to unwind the recursion once it reaches the upper bound of blank cells
            // w/o meeting the requirments specified in difficultySettings
            let fallBack = null;

            // fallBackTo keeps track of the number of cells missing on the board at the state we are falling back 
            // to
            let fallBackTo = null;

            // recursive call
            function _generate(board, strategiesUsed = 0) {
                // if the board is broken, meaning it                 
                if (board.break) {
                    return board;
                }
                else if (board.isComplete) {
                    return board;
                }
                else if (Date.now() - time > difficultySetting.timeLimit) {
                    board.break = true;
                    return board;
                }

                // get list of filled cells for the board object
                // then make a duplicate (filledCells2)
                const filledCells1 = Generator._getFilledCellsShuffled(board);
                const filledCells2 = [...filledCells1];


                                /*filledCells1 And filledCells2 Explanation */
                // we iterate over filledCells1 removing a cell and determing if doing so will A. increase the number of 
                // strategies required to solve the board and B. still yield a solvable result. If so we make a recursive call
                // to examine that board state before continuing on if the recursive call comes back negative. 
                // if none of the cells from filledCells1 increase the strategies required or if they all come back from their 
                // recursive call as negative, we try either only the first cell in filledCells2 or we try them all. Whether
                // we try them all or only one is determined by how close the board is to solving.




                // fallback is within the scope of all recursive calls
                // It is used to mark a particular call of _generate to fall back to once fall back occurs. 
                // if this code runs for first call of _generate or if fallBack was reset to null after it occurred and 
                // the possibilities depleted for the previous _generate call that was marked for fallBack, the current 
                // call will be marked by setting fallBack to its instance of the Board
                if (!fallBack && filledCells2.length < 60) {
                    fallBack = board;
                    fallBack.strategiesUsed = strategiesUsed;
                    fallBackTo = board.cellsMissing;

                }

                // the break condition for this loop occurs when we have attempted recursive calls for removing each 
                // possible cell but have failed
                while (filledCells2.length > 0) {

                    // if we are out of cells from filledCells1 and taking any more cells would result in breakin our
                    // upper bound requirment, we fall back to our fall back board state
                    if (filledCells1.length === 0 && board.cellsMissing >= upperBlankCellBoundaryInclusive - 1) {
                        board.fallBack = true;
                        return board;
                    }

                    // get next cell and its indices
                    const cell = (filledCells1.length > 0) ? filledCells1.pop() : filledCells2.pop();
                    const [rowI, colI] = cell.indices;

                    // make a new board w/o the that cell's value
                    let newBoard = Board.removeValue(board, rowI + 1, colI + 1);

                    // test new board against the difficulty settings and to make sure it is still solvable
                    const { difficultyMet, boardSolved, strategiesRequired } = Generator._applyDifficultySetting(newBoard, difficultySetting, time);

                    //If board meets requirements, return
                    if (difficultyMet && boardSolved && newBoard.cellsMissing > lowerBlankCellBoundaryInclusive) {
                        newBoard.isComplete = true;
                        return newBoard;
                    }

                    // if the board was solved but didn't meet the requirments BUT the board didn't reach its 
                    // limit on empty cells...
                    if (!difficultyMet && boardSolved && newBoard.cellsMissing < upperBlankCellBoundaryInclusive) {


                        // continue to the next iteration of this board state if the move did not result in an increase in 
                        // strategies used to solve it (providing we have any more moves)
                        if (filledCells1.length > 0 && strategiesRequired === strategiesUsed) {
                            continue;
                        }

                        // test if board close to meeting its strategy requirments.
                        let closeToSolve = (difficultySetting.strategies.length - strategiesUsed) <= 1;

                        // if the board increased the number of strategies required, determine the distance it is from the 
                        // current fall back board, and relative to how close the board is to meeting its strategy requirments, 
                        // decide whether to set this board as the new fall back state
                        if (fallBack && filledCells1.length > 0 && strategiesRequired > fallBack.strategiesUsed) {
                            let distance1 = 81 - newBoard.cellsMissing;
                            let distance2 = 81 - fallBack.cellsMissing;
                            let acceptableLeap = 0;
                            switch (difficultySetting.strategies.length - strategiesUsed) {
                                case 1: 
                                    acceptableLeap = 81; 
                                    break;
                                case 2:
                                    acceptableLeap = 15;
                                    break;
                                default:
                                    acceptableLeap = 10;
                            }
                            if (Math.abs(distance1 - distance2) <= acceptableLeap) {
                                fallBack = null;
                            }
                        }

                        // make the recursive call 
                        newBoard = _generate(newBoard, strategiesRequired);

                        // if the board comes back to us broken continue to the next iteration on this board state
                        if (newBoard.break) {
                            continue;
                        }

                        // if the board reached a state that calls for us to go back to the fall back state, and if the 
                        // current board state is not the fall back state, return the board
                        if (newBoard.fallBack && fallBack !== board) {
                            return newBoard;
                        }
                        // if newBoard is marked to fall back and the current board is the fallback state...
                        else if (newBoard.fallBack && board === fallBack) {
                            // if A.) we are close to board completion but our out of cells to explore for this board state
                            // or if B.) we are not close to solving and have explored all of filledCell1 cells, set the next
                            // state from the next recursive call as the new fall back state
                            if (closeToSolve && filledCells2.length === 1 || !closeToSolve && filledCells1.length === 0) {
                                // when fallBack hits null the next call of _generate will set the call after as the next fall 
                                // back call
                                fallBack = null;
                            }
                        }

                        if (newBoard.isComplete) {
                            return newBoard;
                        }

                        continue;
                    }
                    // if the board was not solved but the number of empty cells are less than the maximum
                    // continue to the next iteration
                    else if (!boardSolved || (newBoard.cellsMissing > upperBlankCellBoundaryInclusive)) {
                        continue;
                    }
                }
                board.break = true;
                return board;
            }

            let puzzle = _generate(fullBoard);
            if (puzzle.break) continue;
            else {
                let results = Generator._applyDifficultySetting(puzzle, difficultySetting, Date.now());
                if (results.difficultyMet) {
                    return puzzle;
                }
                else {
                    console.log('difficulty failed');
                    continue;
                }
            }
        }

    }

}



module.exports = Generator;