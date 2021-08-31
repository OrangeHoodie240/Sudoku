const Strategy = require('./Strategy');
const {Board} = require('./Board');


// each strategy should take the board and return either false for unsuccefully
// attempting ot solve a single cell or AN OBJECT with the board property for the 
// board it recreated and made the changes to.

const difficultySettings = {
    'level-one': {
        strategies: [
            function (board) {
                return Strategy.applyStrategy(board, 'sole-candidate',
                    {
                        rowI: board.blankCellsIndices[0][0],
                        colI: board.blankCellsIndices[0][1]
                    });
            },

            function (board) {
                return Strategy.applyStrategy(board, 'unique-candidate',
                    {
                        rowI: board.blankCellsIndices[0][0],
                        colI: board.blankCellsIndices[0][1]
                    });
            }
        ],
        timeLimit: 500,
        strategyNames: ['sole-candidate', 'unique-candidate']
    },
    'level-two': {
        strategies: [
            function (board) {
                return Strategy.applyStrategy(board, 'sole-candidate',
                    {
                        rowI: board.blankCellsIndices[0][0],
                        colI: board.blankCellsIndices[0][1]
                    });
            },

            function (board) {
                return Strategy.applyStrategy(board, 'unique-candidate',
                    {
                        rowI: board.blankCellsIndices[0][0],
                        colI: board.blankCellsIndices[0][1]
                    });
            },

            function (board) {
                return Strategy.applyStrategy(board, 'naked-subset',
                    {
                        rowI: board.blankCellsIndices[0][0],
                        colI: board.blankCellsIndices[0][1],
                        structureType: 'all'
                    });
            }
        ],
        timeLimit: 1000,

        strategyNames: ['sole-candidate', 'unique-candidate', 'naked-subset{setSize-2}']
    },
    'level-final': {
        strategies: [
            function (board) {
                let results = Strategy._lastRemainingCell(board);
                if (results.board.cellsMissing === board.cellsMissing) {
                    return false;
                }
                else return results;
            },
            function (board) {
                for (let i = 0; i < 9; i++) {
                    for (let j = 0; j < 9; j++) {
                        let results = Strategy._soleCandidate(board, 0, 0);
                        if (results) {
                            board = Board.copy(board);
                            return { board: Board.addValue(board, i + 1, j + 1, results) };
                        }
                        else {
                            return false;
                        }
                    }
                }
            },
            function (board) {
                return Strategy.applyStrategy(board, 'unique-candidate',
                    {
                        rowI: board.blankCellsIndices[0][0],
                        colI: board.blankCellsIndices[0][1]
                    });
            },

            function (board) {
                return Strategy.applyStrategy(board, 'naked-subset',
                    {
                        rowI: board.blankCellsIndices[0][0],
                        colI: board.blankCellsIndices[0][1],
                        setSize: 3,
                        structureType: 'all'
                    });
            },
            // function(board){
            //     let results = Strategy._hiddenSubset(board, 0, 0, 3, 'all'); 
            //     if(results.board){ 
            //         return results; 
            //     }
            //     else{
            //         return false;
            //     }
            // }, 
            // function(board){
            //     let results = Strategy._pointingPairsAndTripples(board, true); 
            //     if(results.board.cellsMissing < board.cellsMissing){
            //         return results; 
            //     }
            //     else{
            //         return false;
            //     }
            // }, 
            // function(board){
            //     let results = Strategy._BoxLineReduction(board, true); 
            //     if(results.board.cellsMissing < board.cellsMissing){
            //         return results; 
            //     }
            //     else return false;
            // }
        ],
        timeLimit: 1000,
        strategyNames: ['last-remaining-cell', 'sole-candidate', 'unique-candidate', 'naked-subset{setSize-3}']
            //'hidden-subset{setSize-3}', 'pointing-pairs-and-tripples', 'box-line-reduction']
    }
}


module.exports = difficultySettings;