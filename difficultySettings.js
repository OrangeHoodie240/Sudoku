const Strategy = require('./Strategy');
const {Board} = require('./Board.js');
const getFirstEmptyCellIndicesOrOrigin = Board.getFirstEmptyCellIndicesOrOrigin; 

// each strategy should take the board and return either false for unsuccefully
// attempting ot solve a single cell or AN OBJECT with the board property for the 
// board it recreated and made the changes to.

const difficultySettings = {
    'level-one': {
        strategies: [

            function (board) {
                const {rowI, colI} = getFirstEmptyCellIndicesOrOrigin(board);
                return Strategy.applyStrategy(board, 'sole-candidate',
                    {
                        rowI,
                        colI,
                    });
            },

            function (board) {
                const {rowI, colI} = getFirstEmptyCellIndicesOrOrigin(board);
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
                const {rowI, colI} = getFirstEmptyCellIndicesOrOrigin(board);
                return Strategy.applyStrategy(board, 'sole-candidate',
                    {
                        rowI,
                        colI,
                    });
            },

            function (board) {
                const {rowI, colI} = getFirstEmptyCellIndicesOrOrigin(board);
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
    'level-three-A': {
        strategies: [

            function (board) {
                const {rowI, colI} = getFirstEmptyCellIndicesOrOrigin(board);
                return Strategy.applyStrategy(board, 'sole-candidate',
                    {
                        rowI,
                        colI,
                    });
            },

            function (board) {
                const {rowI, colI} = getFirstEmptyCellIndicesOrOrigin(board);
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
                const {rowI, colI} = getFirstEmptyCellIndicesOrOrigin(board);
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
        strategyNames: ['sole-candidate', 'unique-candidate', 'unique-candidate-row-col', 'pointing-pairs-and-triples', 'naked-subset{setSize-2}']
    }, 
    'level-three-B': {
        strategies: [

            function (board) {
                const {rowI, colI} = getFirstEmptyCellIndicesOrOrigin(board);
                return Strategy.applyStrategy(board, 'sole-candidate',
                    {
                        rowI,
                        colI,
                    });
            },

            function (board) {
                const {rowI, colI} = getFirstEmptyCellIndicesOrOrigin(board);
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
                results = Strategy._BoxLineReduction(results.board, true, false);
                if (!results) {
                    return false;
                }
                if (results.board.cellsMissing < board.cellsMissing) {
                    return results;
                }
            }
        ],
        timeLimit: 10000000,
        lowerBound: 52, 
        upperBound: 53,
        strategyNames: ['sole-candidate', 'unique-candidate', 'unique-candidate-row-col', 'pointing-pairs-and-triples', 'box-line-reduction']
    },
    'level-three-C': {
        strategies: [

            function (board) {
                const {rowI, colI} = getFirstEmptyCellIndicesOrOrigin(board);
                return Strategy.applyStrategy(board, 'sole-candidate',
                    {
                        rowI,
                        colI,
                    });
            },

            function (board) {
                const {rowI, colI} = getFirstEmptyCellIndicesOrOrigin(board);
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
                const {rowI, colI} = getFirstEmptyCellIndicesOrOrigin(board);
                results = Strategy._hiddenSubset(results.board, rowI, colI, 2, 'all');
                return results;
            }
        ],
        timeLimit: 40000,
        lowerBound: 52, 
        upperBound: 53,
        strategyNames: ['sole-candidate', 'unique-candidate', 'unique-candidate-row-col', 'pointing-pairs-and-triples', 'hidden-subset{setSize-2}']
    }
}


module.exports = difficultySettings;