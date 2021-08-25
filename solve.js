const {Board} = require('./Board');

function solve(board){

    function _solve(board){
        if(!board){
            return board; 
        }
        if(board.cellsMissing === 0){
            return board;
        }

        const [rowI, colI] =  Board.getFirstBlankCellIndices(board);
        const missingRowValues = Board.getMissingRowValues(board, rowI + 1); 
        for(let value of missingRowValues){
            const newBoard = _solve(Board.addValue(board, rowI + 1, colI + 1, value)); 
            if(newBoard){
                return newBoard; 
            }
        }
    }
    return _solve(board);
}

module.exports = solve;