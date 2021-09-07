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
        timeLimit: 6000,
        strategyNames: ['sole-candidate', 'unique-candidate'],
        lowerBound: 30,
        upperBound: 40
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

        ],
        timeLimit: 10000,

        strategyNames: ['sole-candidate', 'unique-candidate'],
        upperBound: 55,
        lowerBound: 32
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
                let results = Strategy._pointingPairsAndTripples(board, true);
                if (results) {
                    if (results.board.cellsMissing < board.cellsMissing) {
                        return results;
                    }
                }
                return false;
            }
        ],
        timeLimit: 10000,
        lowerBound: 32, 
        upperBound: 55,
        strategyNames: ['sole-candidate', 'unique-candidate', 'pointing-pairs-and-tripples',]
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
                let results = Strategy._pointingPairsAndTripples(board, true);
                if (results) {
                    if (results.board.cellsMissing < board.cellsMissing) {
                        return results;
                    }
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
        timeLimit: 10000,
        lowerBound: 32, 
        upperBound: 55,
        strategyNames: ['sole-candidate', 'unique-candidate', 'pointing-pairs-and-tripples', 'naked-subset{setSize-2}',]
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
            function (board) {
                let results = Strategy._pointingPairsAndTripples(board, true);
                if (results) {
                    if (results.board.cellsMissing < board.cellsMissing) {
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
        timeLimit: 100000,
        lowerBound: 32, 
        upperBound: 50,
        strategyNames: ['sole-candidate', 'unique-candidate', 'pointing-pairs-and-tripples', 'box-line-reduction', 'naked-subset{setSize-2}', 'pointing-pairs-and-tripples-and-hidden-subset{setSize-2}']
    }
}


module.exports = difficultySettings;