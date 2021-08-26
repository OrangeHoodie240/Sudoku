
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

    /**  takes an array of characters where each number is a string value
     * 
     *   returns the cooresponding array of cells 
     */ 
    static buildCells(stringArray){
        return stringArray.map(char => {
            return new Cell(char); 
        });
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

    // calcuate is a boolean specifying whether or not the cells should have their possible values calculated
    // default value is false
    constructor(puzzleString, {calculate=false, rowI=null, colI=null, value=null}={}){
        this.puzzle = []; 
        this.blankCellsIndices = [];
        puzzleString = puzzleString.split(/\r?\n/); 
        for(let i = 0; i < 9; i++){
             let row = puzzleString[i]; 
             row = row.trim(); 
             row = row.split(','); 
             
            for(let j = 0; j < 9; j++){
                if(row[j] === '0'){
                    if(i === rowI && j === colI){
                        row[j] = value;
                    }
                    else{
                        this.blankCellsIndices.push([i,j]);
                    }
                } 
            }

             this.puzzle.push(Cell.buildCells(row)); 
        }

        // adds property missingCells to board
        Board.countMissingCells(this);
    }

    /**
     * row number will start at 1
     * returns a copy of the row as an array of Cell objects
     * @param {Board} board 
     * @param {Number} row 
     */
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

    /** 
     *  takes an array of cells and returns a string representing them comma delmited
     */
    static convertCellsToCharacters(cells){
        return cells.map(cell => cell.value).join(',');
    }

    static toString(board){
        let boardString = ''; 
        for(let row of board.puzzle){
            if(boardString){
                boardString += '\n';
            }
            row = Board.convertCellsToCharacters(row);
            boardString += row; 
        }
        return boardString; 
    }

    // returns A CLONED board with the value added to specified cell
    // returns undefined if new board is not valid
    // row and col start at 1
    // throw error cell is not blank
    static addValue(board, row, col, value, calculate=false){
        const cell = board.puzzle[row-1][col-1];
        if(cell.value !== '0'){
            throw new Error(`Error! Cell row:${row} col:${col} = ${cell.value}! Can't fill cell because it is not blank`);
        }

        if(!Board.isValidFor(board, row, col, value)){
            return undefined;
        }
        const clonedBoard = new Board(Board.toString(board), {calculate, rowI:row-1, colI:col-1, value}); 

        return clonedBoard; 
    }

    // check if a value would be valid on a board
    // returns boolean
    static isValidFor(board, rowNum, colNum, value){
        // get all related cells into the same array
        const cells = Board.getRow(board, rowNum); 
        cells.push(...Board.getCol(board, colNum)); 
        cells.push(...Board.getBox(board, Board.getBoxNum(rowNum, colNum)));

        // return false if the value is already taken 
        if(cells.find(cell => cell.value === value)){
            return false;
        }

        return true; 
    }

    /**
     * Takes row and col numbers (starting at 1) and returns the cooresponding box number
     * 
     * @param {Number} row 
     * @param {Number} col 
     * @returns {Number}
     */
    static getBoxNum(row, col){

        const boxes = []; 
        if(row < 4){
            boxes.push(1,2,3);
        }
        else if(row < 7){
            boxes.push(4,5,6);
        }
        else{
            boxes.push(7,8,9);
        }

        if(col < 4){
            return boxes[0];
        }
        else if(col < 7){
            return boxes[1]; 
        }
        else{
            return boxes[2];
        }
    }

    /**
     * Returns nested array of row numbers and col numbers (starting at 1)
     * 
     * Nested Array: [rowNumbers, colNumbers] 
     * 
     * @param {Number} boxNum 
     */
    static getRowAndColNums(boxNum){
        const rows = [];
        if(boxNum < 4){
            rows.push(1, 2, 3); 
        }
        else if(boxNum < 7){
            rows.push(4, 5, 6); 
        }
        else{
            rows.push(7, 8, 9);
        }

        const cols = [];
        if([1,4,7].includes(boxNum)){
            cols.push(1,2,3); 
        }
        else if([2,5,8].includes(boxNum)){
            cols.push(4,5,6); 
        }
        else{
            cols.push(7,8,9);
        }

        return [rows, cols];
    }


    static countMissingCells(board){
        board.cellsMissing = 0; 
        for(let row of board.puzzle){
            board.cellsMissing += row.reduce((sum, cell)=>{
                if(cell.value === '0'){
                    sum++; 
                }
                return sum;
            }, 0);
        }
    }

    static getMissingRowValues(board, rowNum){
        // gets blank values from row
        // rowNum is the row number starting at 1

        const row = Board.getRow(board, rowNum);
        return Board._findMissingValues(row); 
        
    }

    static getMissingColValues(board, colNum){
        const col = Board.getCol(board, colNum);
        return Board._findMissingValues(col);
    }

    static getMissingBoxValues(board, boxNum){
        const box = Board.getBox(board, boxNum); 
        return Board._findMissingValues(box);
    }

    // helper function that takes array of cells and returns set of missing values.
    static _findMissingValues(cells){
        return cells.reduce((values, cell)=>{
            values.delete(cell.value); 
            return values;
        },  new Set(['1','2','3','4','5','6','7','8','9']));
    }

    /**
     * Returns next index of next blank cell indice in property Board.blankCellsIndices
     * 
     * If we do not specify a cell, it will return the first blank cells indices index
     * 
     * If we do specify a cell, it will return the next blank cell's indices index AFTER that cell
     * 
     * 
     * Returns undefined if there is no such blank cell in that section of the board
     * 
     * @param {Board} board 
     * @param {Number} rowI optional
     * @param {Number} col optional
     * 
     */
    static getNextBlankCellIndicesIndex(board, rowI=null, colI=null){
        if(board.blankCellsIndices.length === 0){
            return undefined;
        }
        if(!rowI){
            return (board.blankCellsIndices.length > 0) ? 0 : undefined;
        }

        for(let i = 0; i < board.blankCellsIndices.length; i++){
            const indices = board.blankCellsIndices[i];

            if((indices[0] === rowI && indices[1] > colI) || (indices[0] > rowI)){
                return i; 
            }
        }
        return undefined; 
    }

}

module.exports = {Board, Cell}; 