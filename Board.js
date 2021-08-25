
class Cell{
    constructor(value=0){
        this._value = value; 
        this._possibleValues = new Set(); 
    }

    get value(){
        return this._value; 
    }

    set value(val){
        this._value = val; 
    }

    getPossibleValues(){
        return this._possibleValues; 
    }

    addPossibleValue(val){
        this._possibleValues.add(val); 
    }
}

class Board{

    // takes a string where the rows of the puzzle are line delimeted and the columns comma delimeted
    // 0 stands for an empty cell value
    /*
        example of first two rows
            1,3,4,9,0,5,7,6,0
            0,2,6,9,3,1,8,0,7
    */

    constructor(puzzleString){
        this.puzzle = []; 
        puzzleString = puzzleString.split(/\r?\n/); 
        for(let row of puzzleString){
             row = row.trim(); 
             this.puzzle.push(row.split(',')); 
        }
    }

    // row number will start at 1
    // returns a copy of the row
    static getRow(board, row){
        return [...board.puzzle[row - 1]]; 
    }

    // col number will start at 1
    // returns a copy of the col
    static getCol(board, col){
        const results = [];
        for(let row of board.puzzle){
            results.push(row[col - 1]); 
        }

        return results; 
    }

    // box number will start at 1 and counts move left to right and then up to down
    // returns a copy of the box

    static getBox(board, box){
        const results = [];
        
        // startRow will be the row index the box begins in. 
        // endRow will be the row index the box goes up to (exclusively).
        let startRow = null; 
        let endRow = null;
        if([1,2,3].includes(box)){
            startRow = 0; 
            endRow = 3; 
        }
        else if([4,5,6].includes(box)){
            startRow = 3; 
            endRow = 6;
        }
        else{
            startRow = 6; 
            endRow = 9; 
        }

        // startCol will be the column index the box starts at.
        // endCol will be the column index the box goes up to (exclusively).
        let startCol = null; 
        let endCol = null;
        if([1,4,7].includes(box)){
            startCol = 0; 
            endCol = 3; 
        }
        else if([2,5,8].includes(box)){
            startCol = 3; 
            endCol = 6; 
        }
        else{
            startCol = 6; 
            endCol = 9;
        }        

        for(let i = startRow; i < endRow; i++){
            let row = board.puzzle[i]; 
            results.push(...row.slice(startCol, endCol));
        }
        return results; 
    }
}

module.exports = {Board, Cell}; 