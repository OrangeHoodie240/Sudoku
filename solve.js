const {Board} = require('./Board');

function solve(board){

    function _solve(board, rowI=0, colI=0){
        if(!board){
            return board; 
        }
        if(board.cellsMissing === 0){
            return board;
        }

        [rowI, colI] =  board.blankCellsIndices[0];
        const missingRowValues = Board.getMissingRowValues(board, rowI + 1); 
        for(let value of missingRowValues){
            const newBoard = _solve(Board.addValue(board, rowI + 1, colI + 1, value), rowI); 
            if(newBoard){
                return newBoard; 
            }
        }
    }
    return _solve(board);
}

module.exports = solve;