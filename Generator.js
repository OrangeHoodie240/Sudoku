const Strategy = require('./Strategy');
const difficultySettings = require('./difficultySettings');
const solve = require('./solve');
const {Board} = require('./Board'); 

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
    static _generateFullBoard(){
        while(true){
            let time = Date.now();
            let board = new Board(blankSudokuString);
            while(board.cellsMissing > 72){
                const blankCellIndicesIndex = Math.floor(Math.random() * board.blankCellsIndices.length);
                const blankCellIndices = board.blankCellsIndices[blankCellIndicesIndex];
                let randomValues = ['1','2','3','4','5','6','7','8','9'];
                let randomIndex = Math.floor(Math.random() * randomValues.length);
                let randomValue = randomValues.splice(randomIndex, 1)[0];
                let newBoard = Board.addValue(board, blankCellIndices[0] + 1, blankCellIndices[1] + 1, randomValue);
                while(!newBoard){
                    randomIndex = Math.floor(Math.random() * randomValues.length);
                    randomValue = randomValues.splice(randomIndex, 1)[0];
                    newBoard = Board.addValue(board, blankCellIndices[0] + 1, blankCellIndices[1] + 1, randomValue);
                }

                board = newBoard;
            }
        

            board = solve(board, time, 500);
            if(board === 'break'){
                continue; 
            }
            return board;
        }
    }

    static generatePuzzle(difficulty='level-one', lowerBlankCellBoundaryInclusive=32, upperBlankCellBoundaryInclusive=40){
        const difficultySetting = difficultySettings[difficulty];
        while(true){    
            let board = Generator._generateFullBoard(); 
            let time = Date.now(); 

            let difficultyMet = false; 
            let boardSolved = false; 
            while(!difficultyMet || !boardSolved || board.cellsMissing <= lowerBlankCellBoundaryInclusive){
                if(board.cellsMissing > upperBlankCellBoundaryInclusive) break;
                if(Date.now() - time > difficultySetting.timeLimit) break;

                let indices = Generator._getRandomFilledCellIndices(board);
                board = Board.removeValue(board, indices[0] + 1, indices[1] + 1);
                
                let results = Generator._applyDifficultySetting(board, difficultySetting); 
                difficultyMet = results.difficultyMet;
                boardSolved = results.boardSolved;  
            }
            if(boardSolved && difficultyMet && board.cellsMissing >= lowerBlankCellBoundaryInclusive){
                return board;
            }
        }

    }

    static newGenerate(difficulty='level-one', lowerBlankCellBoundaryInclusive=32, upperBlankCellBoundaryInclusive=40){
        let difficultySetting; 
        if(typeof difficulty === 'string'){
            difficultySetting = difficultySettings[difficulty];
        }
        else{
            difficultySetting = difficulty;
        }
        
        while(true){
            let fullBoard = Generator._generateFullBoard(); 
            let time = Date.now(); 
    
            function _generate(board){
                let difficultyMet = false; 
                let boardSolved = false; 
                let strategiesRequired = 0; 
                let fallBack = lowerBlankCellBoundaryInclusive; 
                while(!difficultyMet || !boardSolved || board.cellsMissing <= lowerBlankCellBoundaryInclusive){
                    if(board.cellsMissing > upperBlankCellBoundaryInclusive) break;
                    if(Date.now() - time > difficultySetting.timeLimit) {
                        return {break: true};
                    }
    
                    // remove cell 
                    let indices = Generator._getRandomFilledCellIndices(board);
                    let newBoard = Board.removeValue(board, indices[0] + 1, indices[1] + 1);
                    

                    // test new board state
                    let results = Generator._applyDifficultySetting(newBoard, difficultySetting); 
                    difficultyMet = results.difficultyMet;
                    boardSolved = results.boardSolved;  

                    // decide whether or not to keep new board state
                    if(boardSolved){
                        if(newBoard.cellsMissing < lowerBlankCellBoundaryInclusive){
                            strategiesRequired = results.strategiesRequired; 
                            board = newBoard; 
                        }
                        else if(newBoard.cellsMissing >= fallBack && strategiesRequired < results.strategiesRequired){
                            strategiesRequired = results.strategiesRequired; 
                            board = newBoard; 
                            fallBack = board.cellsMissing; 
                        }
                    }

                    // return if board done
                    if(boardSolved && difficultyMet && board.cellsMissing >= lowerBlankCellBoundaryInclusive){
                        return {board: newBoard };
                    }
                }
    
            }
    
            let puzzle = _generate(fullBoard); 
            if(puzzle.break) continue;
            else{
                return puzzle.board; 
            }
        }
        
    

    }

    /**
     * Finds a non-blank cell at random and returns its indices
     * @param {Board} board 
     * @returns {Array<Number, Number>}
     */
    static _getRandomFilledCellIndices(board){
        while(true){
            let i = Math.floor(Math.random() * 9); 
            let j = Math.floor(Math.random() * 9); 
            if(board.puzzle[i][j].value !== '0'){
                return [i,j];
            }
        }
    }

    static _applyDifficultySetting(board, difficultySetting, time){
        let strategyNames = new Set(difficultySetting.strategyNames);
        let cellsLeft = null;
        while(cellsLeft !== board.cellsMissing){
            if(Date.now() - time > difficultySetting.timeLimit) break;
            cellsLeft = board.cellsMissing; 
            for(let i = 0; i < difficultySetting.strategies.length; i++){

                if(board.cellsMissing === 0){
                    cellsLeft = board.cellsMissing;
                    break;
                }

                let strategy = difficultySetting.strategies[i];
                let strategyName = difficultySetting.strategyNames[i];
                let results = strategy(board); 
                if(results){
                    i = 0;
                    strategyNames.delete(strategyName);
                    board = results.board; 

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
}



module.exports = Generator;