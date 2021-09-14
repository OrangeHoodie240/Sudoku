const Strategy = require('./Strategy');
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
        while (true) {
            // console.log('new board');
            let fullBoard = Generator._generateFullBoard();
            let time = Date.now();

            // fallback is used to reset to unwind the recursion once it reaches the upper bound of blank cells
            // w/o meeting the requirments specified in difficultySettings
            let fallBack = null;

            let fallBackTo = null;

            // recursive call
            function _generate(board, strategiesUsed = 0) {
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
                // fallback is within the scope of all recursive calls
                // It is used to mark a particular call of _generate to fall back to once fall back occurs. 
                // if this code runs for first call of _generate or if fallBack was reset to null after it occurred and 
                // the possibilities depleted for the previous _generate call that was marked for fallBack, the current 
                // call will be marked by setting fallBack to its instance of filledCells2
                if (!fallBack && filledCells2.length < 60) {
                    fallBack = board;
                    fallBack.strategiesUsed = strategiesUsed;
                    fallBackTo = board.cellsMissing;
                    
                    // console.log('board fall back to ', fallBackTo);

                    
                    // if(strategiesUsed === 4){
                        // console.log(Generator.secondGenerate(board, difficultySetting, 4));
                    // }
                }
                while (filledCells2.length > 0) {
                    if (filledCells1.length === 0 && board.cellsMissing >= upperBlankCellBoundaryInclusive - 1) {
                        board.fallBack = true;
                        return board;
                    }
                    const cell = (filledCells1.length > 0) ? filledCells1.pop() : filledCells2.pop();

                    const [rowI, colI] = cell.indices;

                    // make a new board w/o the that cell's value
                    let newBoard = Board.removeValue(board, rowI + 1, colI + 1);

                    // test new board against the difficulty settings and to make sure it is still solvable
                    const { difficultyMet, boardSolved, strategiesRequired } = Generator._applyDifficultySetting(newBoard, difficultySetting, time);
                    // console.log(newBoard.cellsMissing, strategiesUsed, boardSolved, Date.now() - time, filledCells2.length, fallBackTo);

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
                        let closeToSolve = (difficultySetting.strategies.length - strategiesUsed) <= 1;

                        if (fallBack && filledCells1.length > 0 && strategiesRequired > fallBack.strategiesUsed) {
                            let distance1 = 81 - newBoard.cellsMissing;
                            let distance2 = 81 - fallBack.cellsMissing;
                            let acceptableLeap = 0;
                            switch (difficultySetting.strategies.length - strategiesUsed) {
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

                        // if(closeToSolve) console.log(closeToSolve);
                        // make the recursive call 
                        newBoard = _generate(newBoard, strategiesRequired);

                        // if the board comes back to us broken continue to the next iteration on this board state
                        if (newBoard.break) {
                            continue;
                        }

                        if (newBoard.fallBack && fallBack !== board) {
                            return newBoard;
                        }
                        else if (newBoard.fallBack && board === fallBack) {
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


    static secondGenerate(board, difficultySetting, strategiesUsed) {
        // get difficultySetting
        let time = Date.now(); 

        const lowerBlankCellBoundaryInclusive = difficultySetting['lowerBound'] || 32;
        const upperBlankCellBoundaryInclusive = difficultySetting['upperBound'] || 55;

        let boardIsComplete = false;
        let count = 0;
        let step = 1;
        while (!boardIsComplete) {
            if (Date.now() - time > 60000) return 'did not work';

            let filledCells = Generator._getFilledCellsShuffled(board);
            let numberOfCells = (upperBlankCellBoundaryInclusive - board.cellsMissing >= step) ? step : upperBlankCellBoundaryInclusive - board.cellsMissing;
            let newBoard = Board.copy(board);
            for (let i = 0; i < numberOfCells; i++) {
                let ind = Math.floor(Math.random() * filledCells.length);
                let cell = filledCells.splice(ind, 1)[0];
                let [rowI, colI] = cell.indices;

                newBoard = Board.removeValue(newBoard, rowI + 1, colI + 1, true);
            }
            let newState = Generator._applyDifficultySetting(newBoard, difficultySetting, Date.now());
            if (!newState.boardSolved) {
                continue;
            }

            if (newState.strategiesRequired > strategiesUsed) {
                strategiesUsed = newState.strategiesRequired;
                board = newBoard;
                count = 0;
                step = 1;
                console.log(newState);
            }

            if (newState.difficultyMet && board.cellsMissing >= lowerBlankCellBoundaryInclusive) {
                return board;
            }
            count++
            if (count > 80) {
                count = 0;
                step++;
            }
        }
    }

}

// for(let i=0;i < 10; i++){
// let now = Date.now(); 
const time = Date.now();
const board = Generator.generatePuzzle('level-test');
console.log(Date.now() - time);
// console.log(Date.now() - now, i + 1);
// console.log(Board.toString(board));

// }

console.log(Generator._applyDifficultySetting(board, difficultySettings['level-test'], Date.now()));


module.exports = Generator;