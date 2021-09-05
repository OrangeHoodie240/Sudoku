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
            solvedBoard: board
        }
    }

    // Keeping for reference 
    // do not use
    static depreciatedGeneratePuzzle(difficulty = 'level-one', lowerBlankCellBoundaryInclusive = 32, upperBlankCellBoundaryInclusive = 60) {
        let difficultySetting;
        if (typeof difficulty === 'string') {
            difficultySetting = difficultySettings[difficulty];
        }
        else {
            difficultySetting = difficulty;
        }


        while (true) {
            let fullBoard = Generator._generateFullBoard();
            let time = Date.now();

            function _generate(board, strategiesUsed=0) {
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


                const filledCells1 = Generator._getFilledCellsShuffled(board);
                const filledCells2 = [...filledCells1];
                while (filledCells2.length > 0) {
                    const cell = (filledCells1.length > 0) ? filledCells1.pop() : filledCells2.pop();
                    const [rowI, colI] = cell.indices;
                    let newBoard = Board.removeValue(board, rowI + 1, colI + 1);
                    const { difficultyMet, boardSolved, strategiesRequired } = Generator._applyDifficultySetting(newBoard, difficultySetting, time);
                    // console.log(newBoard.cellsMissing, strategiesRequired, boardSolved, Date.now() - time);

                    //If board meets requirements, return
                    if (difficultyMet && boardSolved && newBoard.cellsMissing > lowerBlankCellBoundaryInclusive) {
                        newBoard.isComplete = true;
                        return newBoard;
                    }

                    // if the board was solved but didn't meet the requirments BUT the board didn't reach its 
                    // limit on empty cells...
                    if (!difficultyMet && boardSolved && board.cellsMissing < upperBlankCellBoundaryInclusive) {

                        // continue to the next iteration of this board state if the move did not result in an increase in 
                        // strategies used to solve it (providing we have any more moves)
                        if (filledCells1.length > 0 && strategiesRequired <= strategiesUsed) {
                            continue;
                        }
                        // if the move did result in an increase to the number of strategies used, increment the total 
                        // and do not iterate to the next move on the state
                        else if (filledCells1.length > 0 && strategiesRequired > strategiesUsed) {
                            strategiesUsed++;
                        }

                        // make the recursive call 
                        newBoard = _generate(newBoard, strategiesUsed);
                        // if the board comes back to us broken continue to the next iteration on this board state
                        if (newBoard.break) {
                            continue;
                        }
                        // otherwise the board is solved 
                        else {
                            newBoard.isComplete = true;
                            return newBoard;
                        }
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
                return puzzle;
            }
        }

    }

    static generatePuzzle(difficulty = 'level-one', lowerBlankCellBoundaryInclusive = 32, upperBlankCellBoundaryInclusive = 60) {
        let difficultySetting;
        if (typeof difficulty === 'string') {
            difficultySetting = difficultySettings[difficulty];
        }
        else {
            difficultySetting = difficulty;
        }

        while (true) {
            let fullBoard = Generator._generateFullBoard();
            let time = Date.now();
            let fallBack = null; 
            function _generate(board, strategiesUsed=0) {
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

                const filledCells1 = Generator._getFilledCellsShuffled(board);
                const filledCells2 = [...filledCells1];
                if(!fallBack) {
                    fallBack = filledCells2;
                } 
                while (filledCells2.length > 0) {
                    if(filledCells1.length === 0 && board.cellsMissing >= 50){
                        board.fallBack = true;
                        return board;
                    }
                    const cell = (filledCells1.length > 0) ? filledCells1.pop() : filledCells2.pop();
                    const [rowI, colI] = cell.indices;
                    let newBoard = Board.removeValue(board, rowI + 1, colI + 1);
                    const { difficultyMet, boardSolved, strategiesRequired } = Generator._applyDifficultySetting(newBoard, difficultySetting, time);
                    // console.log(newBoard.cellsMissing, strategiesRequired, boardSolved, Date.now() - time);

                    //If board meets requirements, return
                    if (difficultyMet && boardSolved && newBoard.cellsMissing > lowerBlankCellBoundaryInclusive) {
                        newBoard.isComplete = true;
                        return newBoard;
                    }

                    // if the board was solved but didn't meet the requirments BUT the board didn't reach its 
                    // limit on empty cells...
                    if (!difficultyMet && boardSolved && board.cellsMissing < upperBlankCellBoundaryInclusive) {

                        // continue to the next iteration of this board state if the move did not result in an increase in 
                        // strategies used to solve it (providing we have any more moves)
                        if (filledCells1.length > 0 && strategiesRequired <= strategiesUsed) {
                            continue;
                        }
                        // if the move did result in an increase to the number of strategies used, increment the total 
                        // and do not iterate to the next move on the state
                        else if (filledCells1.length > 0 && strategiesRequired > strategiesUsed) {
                            strategiesUsed++;
                        }


                        // make the recursive call 
                        newBoard = _generate(newBoard, strategiesUsed);
                        // if the board comes back to us broken continue to the next iteration on this board state
                        
                        if(newBoard.fallBack && fallBack !== filledCells2){
                            return newBoard; 
                        } 
                        else if(newBoard.fallBack && filledCells2===fallBack && filledCells1.length === 0){
                            fallBack = null; 
                            continue; 
                        }
                        else if(newBoard.fallBack && filledCells2 === fallBack){
                            continue;
                        }

                        if (newBoard.break) {
                            continue;
                        }
                        // otherwise the board is solved 
                        else {
                            newBoard.isComplete = true;
                            return newBoard;
                        }
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
                return puzzle;
            }
        }

    }

}


// const board = Generator.generatePuzzle2('level-test');
// console.log(Board.toString(board));

// console.log(Generator._applyDifficultySetting(board, difficultySettings['level-test'], Date.now()));


module.exports = Generator;