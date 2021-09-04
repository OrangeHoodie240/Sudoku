const Strategy = require('./Strategy');
const { Board } = require('./Board');
const Analyzer = require('./Analyzer');

// each strategy should take the board and return either false for unsuccefully
// attempting ot solve a single cell or AN OBJECT with the board property for the 
// board it recreated and made the changes to.

const difficultySettings = {
    'level-one': {
        strategies: [
            function (board) {
                return results = Strategy._lastRemainingCell(board);
            },
            function (board) {
                const rowI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][0] : 0;
                const colI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][1] : 0;
                return Strategy.applyStrategy(board, 'sole-candidate',
                    {
                        rowI,
                        colI,
                        trySolveAll: true
                    });
            },

            function (board) {
                const rowI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][0] : 0;
                const colI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][1] : 0;
                return Strategy.applyStrategy(board, 'unique-candidate',
                    {
                        rowI,
                        colI,
                        trySolveAll: true
                    });
            }
        ],
        timeLimit: 1000,
        strategyNames: ['last-remaining-cell', 'sole-candidate', 'unique-candidate']
    },
    'level-two': {
        strategies: [
            function (board) {
                const rowI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][0] : 0;
                const colI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][1] : 0;
                return Strategy.applyStrategy(board, 'sole-candidate',
                    {
                        rowI,
                        colI,
                        trySolveAll: true
                    });
            },

            function (board) {
                const rowI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][0] : 0;
                const colI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][1] : 0;
                return Strategy.applyStrategy(board, 'unique-candidate',
                    {
                        rowI,
                        colI,
                        trySolveAll: true
                    });
            },

            function (board) {
                const rowI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][0] : 0;
                const colI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][1] : 0;
                return Strategy.applyStrategy(board, 'naked-subset',
                    {
                        rowI,
                        colI,
                        trySolveAll: true,
                        additionalArgs: [2, 'all'],
                    });
            }
        ],
        timeLimit: 1000,

        strategyNames: ['sole-candidate', 'unique-candidate', 'naked-subset{setSize-2}']
    },
    'level-three': {
        strategies: [
            function (board) {
                const rowI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][0] : 0;
                const colI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][1] : 0;
                return Strategy.applyStrategy(board, 'sole-candidate',
                    {
                        rowI,
                        colI,
                        trySolveAll: true
                    });
            },

            function (board) {
                const rowI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][0] : 0;
                const colI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][1] : 0;
                return Strategy.applyStrategy(board, 'unique-candidate',
                    {
                        rowI,
                        colI,
                        trySolveAll: true
                    });
            },

            function (board) {
                let results = Strategy._pointingPairsAndTripples(board);
                results = Strategy._BoxLineReduction(results.board, true);
                if (results.board.cellsMissing < board.cellsMissing) {
                    return results;
                }
                return false;
            },

        ],
        timeLimit: 10000,

        strategyNames: ['sole-candidate', 'unique-candidate', 'box-line-reduction',]
    },
    'level-four': {
        strategies: [
            function (board) {
                const rowI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][0] : 0;
                const colI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][1] : 0;
                return Strategy.applyStrategy(board, 'sole-candidate',
                    {
                        rowI,
                        colI,
                        trySolveAll: true
                    });
            },

            function (board) {
                const rowI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][0] : 0;
                const colI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][1] : 0;
                return Strategy.applyStrategy(board, 'unique-candidate',
                    {
                        rowI,
                        colI,
                        trySolveAll: true
                    });
            },
            function (board) {
                let results = Strategy._pointingPairsAndTripples(board);
                results = Strategy._BoxLineReduction(results.board, true);
                if (results.board.cellsMissing < board.cellsMissing) {
                    return results;
                }
                return false;
            },
            function (board) {
                const rowI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][0] : 0;
                const colI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][1] : 0;
                return Strategy.applyStrategy(board, 'naked-subset',
                    {
                        rowI,
                        colI,
                        trySolveAll: true,
                        additionalArgs: [2, 'all'],
                    });
            }
        ],
        timeLimit: 5000,

        strategyNames: ['sole-candidate', 'unique-candidate', 'block-line-reduction', 'naked-subset{setSize-2}',]
    },
    'level-five': {
        strategies: [

            function (board) {
                const rowI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][0] : 0;
                const colI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][1] : 0;
                return Strategy.applyStrategy(board, 'sole-candidate',
                    {
                        rowI,
                        colI,
                    });
            },

            function (board) {
                const rowI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][0] : 0;
                const colI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][1] : 0;
                return Strategy.applyStrategy(board, 'unique-candidate',
                    {
                        rowI,
                        colI,
                    });
            },
            function(board){
                let results = Strategy._pointingPairsAndTripples(board, true); 
                if(results){
                    if(results.board.cellsMissing < board.cellsMissing){
                        return results; 
                    }
                }
                return false;
            },
            function (board) {
                let results = Strategy._pointingPairsAndTripples(board);
                results = Strategy._BoxLineReduction(results.board, true);
                if (!results) {
                    return false;
                }
                if (results.board.cellsMissing < board.cellsMissing) {
                    return results;
                }
            },
            function (board) {
                const rowI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][0] : 0;
                const colI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][1] : 0;
                return Strategy.applyStrategy(board, 'naked-subset',
                    {
                        rowI,
                        colI,
                        trySolveAll: true,
                        additionalArgs: [2, 'all']
                    });
            },
            function (board) {
                let results = Strategy._pointingPairsAndTripples(board);
                const rowI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][0] : 0;
                const colI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][1] : 0;
                results = Strategy._hiddenSubset(results.board, rowI, colI, 2, 'all');
                return results;
            }

        ],
        timeLimit: 5000, // keep as 1000 was not working with this at all

        strategyNames: ['sole-candidate', 'unique-candidate', 'pointing-pairs-and-tripples', 'naked-subset{setSize-2}', 'box-line-reduction', 'hidden-subset{setSize-2}']
    },
    'level-test': {
        strategies: [

            function (board) {
                const rowI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][0] : 0;
                const colI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][1] : 0;
                return Strategy.applyStrategy(board, 'sole-candidate',
                    {
                        rowI,
                        colI,
                    });
            },

            function (board) {
                const rowI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][0] : 0;
                const colI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][1] : 0;
                return Strategy.applyStrategy(board, 'unique-candidate',
                    {
                        rowI,
                        colI,
                    });
            },
            function(board){
                let results = Strategy._pointingPairsAndTripples(board, true); 
                if(results){
                    if(results.board.cellsMissing < board.cellsMissing){
                        return results; 
                    }
                }
                return false;
            },
            function (board) {
                let results = Strategy._BoxLineReduction(board, true, true);
                if (!results) {
                    return false;
                }
                if (results.board.cellsMissing < board.cellsMissing) {
                    return results;
                }
            },
            function (board) {
                const rowI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][0] : 0;
                const colI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][1] : 0;
                return Strategy.applyStrategy(board, 'naked-subset',
                    {
                        rowI,
                        colI,
                        trySolveAll: true,
                        additionalArgs: [2, 'all']
                    });
            },
            function (board) {
                let results = Strategy._pointingPairsAndTripples(board);
                const rowI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][0] : 0;
                const colI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][1] : 0;
                results = Strategy._hiddenSubset(results.board, rowI, colI, 2, 'all');
                return results;
            }

        ],
        timeLimit: 5000, // keep as 1000 was not working with this at all

        strategyNames: ['sole-candidate', 'unique-candidate', 'pointing-pairs-and-tripples', 'box-line-reduction','naked-subset{setSize-2}', 'pointing-pairs-and-tripples-and-hidden-subset{setSize-2}']
    }
}


module.exports = difficultySettings;