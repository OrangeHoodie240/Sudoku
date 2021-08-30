const Strategy = require('./Strategy');
const Board = require('./Board'); 


const difficultySettings = {
    'level-one': {
        strategies: [
            function(board){
                return Strategy.applyStrategy(board, 'sole-candidate',
                 {
                    rowI: board.blankCellsIndices[0][0],
                    colI: board.blankCellsIndices[0][1]
                });
            }, 

            function(board){
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
            function(board){
                return Strategy.applyStrategy(board, 'sole-candidate',
                 {
                    rowI: board.blankCellsIndices[0][0],
                    colI: board.blankCellsIndices[0][1]
                });
            }, 

            function(board){
                return Strategy.applyStrategy(board, 'unique-candidate',
                 {
                     rowI: board.blankCellsIndices[0][0],
                    colI: board.blankCellsIndices[0][1]
                });
            }, 

            function(board){
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
    
}


module.exports = difficultySettings; 