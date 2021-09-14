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
                const result = Strategy._uniqueCandidateRowCol(board); 
                if(result.solution){
                    return result; 
                }
                else{
                    return false;
                }
            },
        ],
        timeLimit: 10000000,
        lowerBound: 32, 
        upperBound: 53,
        strategyNames: ['sole-candidate', 'unique-candidate', 'unique-candidate-row-col']
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
                const result = Strategy._uniqueCandidateRowCol(board); 
                if(result.solution){
                    return result; 
                }
                else{
                    return false;
                }
            },
        ],
        timeLimit: 10000000,
        lowerBound: 52, 
        upperBound: 53,
        strategyNames: ['sole-candidate', 'unique-candidate', 'unique-candidate-row-col']
    },
    'level-three-A': {
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
                const result = Strategy._uniqueCandidateRowCol(board); 
                if(result.solution){
                    return result; 
                }
                else{
                    return false;
                }
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
           
        ],
        timeLimit: 10000000,
        lowerBound: 50, 
        upperBound: 53,
        strategyNames: ['sole-candidate', 'unique-candidate', 'unique-candidate-row-col', 'pointing-pairs-and-triples']
    },
    'level-three-B': {
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
                const result = Strategy._uniqueCandidateRowCol(board); 
                if(result.solution){
                    return result; 
                }
                else{
                    return false;
                }
            },
            function (board) {
                let results = Strategy._pointingPairsAndTripples(board, false);
                const rowI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][0] : 0;
                const colI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][1] : 0;
                return Strategy.applyStrategy(results.board, 'naked-subset',
                    {
                        rowI,
                        colI,
                        trySolveAll: true,
                        additionalArgs: [2, 'all']
                    });
            }, 
        ],
        timeLimit: 10000000,
        lowerBound: 52, 
        upperBound: 53,
        strategyNames: ['sole-candidate', 'unique-candidate', 'unique-candidate-row-col', 'naked-subset{setSize-2}']
    }, 
    'level-three-C': {
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
                const result = Strategy._uniqueCandidateRowCol(board); 
                if(result.solution){
                    return result; 
                }
                else{
                    return false;
                }
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
                let results = Strategy._pointingPairsAndTripples(board, false);
                results = Strategy.solveForPossibilitiesNakedSubset(results.board); 
                results = Strategy._BoxLineReduction(results, true, false);
                if (!results) {
                    return false;
                }
                if (results.board.cellsMissing < board.cellsMissing) {
                    return results;
                }
            },
        ],
        timeLimit: 10000000,
        lowerBound: 52, 
        upperBound: 53,
        strategyNames: ['sole-candidate', 'unique-candidate', 'unique-candidate-row-col', 'box-line-reduction']
    },
    'level-three-D': {
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
                const result = Strategy._uniqueCandidateRowCol(board); 
                if(result.solution){
                    return result; 
                }
                else{
                    return false;
                }
            },
            function (board) {
                let results = Strategy._pointingPairsAndTripples(board, false);
                results = Strategy.solveForPossibilitiesNakedSubset(results.board); 
                results = Strategy._BoxLineReduction(results, false, false);
                const rowI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][0] : 0;
                const colI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][1] : 0;
                results = Strategy._hiddenSubset(results.board, rowI, colI, 2, 'all');
                return results;
            }
        ],
        timeLimit: 10000000,
        lowerBound: 52, 
        upperBound: 53,
        strategyNames: ['sole-candidate', 'unique-candidate', 'unique-candidate-row-col', 'hidden-subset{setSize-2}']
    }
}


module.exports = difficultySettings;