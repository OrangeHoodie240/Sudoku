const {Board, Cell} = require('./Board');

const unsolvedSudoku = 

                        `5,3,0,0,7,0,0,0,0
                        6,0,0,1,9,5,0,0,0
                        0,9,8,0,0,0,0,6,0
                        8,0,0,0,6,0,0,0,3   
                        4,0,0,8,0,3,0,0,1
                        7,0,0,0,2,0,0,0,6
                        0,6,0,0,0,0,2,8,0
                        0,0,0,4,1,9,0,0,5
                        0,0,0,0,8,0,0,7,9`;

describe('test static getRow, getCol, getBox of Board class', ()=>{
    const board = new Board(unsolvedSudoku);
    test('Board.getRow gets rows', ()=>{
        const row1 = ['5','3','0','0','7','0','0','0','0'];
        const row5 = ['4','0','0','8','0','3','0','0','1'];
        const row9 = ['0','0','0','0','8','0','0','7','9'];

        expect(Board.getRow(board,1)).toEqual(row1);
        expect(Board.getRow(board,5)).toEqual(row5); 
        expect(Board.getRow(board,9)).toEqual(row9);
    });

    test('Board.getCol gets columns', ()=>{
        const col1 = ['5', '6', '0', '8', '4', '7', '0', '0', '0'];
        const col5 = ['7', '9', '0', '6', '0', '2', '0', '1', '8'];
        const col9 = ['0', '0', '0', '3','1', '6', '0', '5', '9'];
        expect(Board.getCol(board, 1)).toEqual(col1);
        expect(Board.getCol(board, 5)).toEqual(col5);
        expect(Board.getCol(board, 9)).toEqual(col9);
    });

    test('Board.getBox gets boxes', ()=>{
        const box1 = ['5','3','0','6','0','0','0','9','8'];
        const box2 = ['0', '7', '0', '1', '9', '5', '0', '0', '0'];
        const box3 = ['0', '0', '0', '0', '0', '0', '0', '6', '0'];
        const box4 = ['8', '0', '0', '4', '0', '0', '7', '0', '0'];
        const box5 = ['0', '6', '0', '8', '0', '3', '0', '2', '0'];
        const box6 = ['0','0','3','0','0','1','0','0','6'];
        const box7 = ['0','6','0','0','0','0','0','0','0'];
        const box8 = ['0','0','0','4','1','9','0','8','0'];
        const box9 = ['2','8','0','0','0','5','0','7','9'];


        expect(Board.getBox(board, 1)).toEqual(box1);
        expect(Board.getBox(board, 2)).toEqual(box2);
        expect(Board.getBox(board, 3)).toEqual(box3);
        expect(Board.getBox(board, 4)).toEqual(box4);
        expect(Board.getBox(board, 5)).toEqual(box5);
        expect(Board.getBox(board, 6)).toEqual(box6);
        expect(Board.getBox(board, 7)).toEqual(box7);
        expect(Board.getBox(board, 8)).toEqual(box8);
        expect(Board.getBox(board, 9)).toEqual(box9);

    });
});