const { Board, Cell } = require('../Board');


// preserve this whitespacing for testing board to string format conversion.
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

const solvedSudoku =
    `4,3,5,2,6,9,7,8,1
6,8,2,5,7,1,4,9,3
1,9,7,8,3,4,5,6,2
8,2,6,1,9,5,3,4,7
3,7,4,6,8,2,9,1,5
9,5,1,7,4,3,6,2,8
5,1,9,3,2,6,8,7,4
2,4,8,9,5,7,1,3,6
7,6,3,4,1,8,2,5,9`;

describe('test static getRow, getCol, getBox of Board class', () => {
    const board = new Board(unsolvedSudoku);
    test('Board.getRow gets rows', () => {
        const row1 = ['5', '3', '0', '0', '7', '0', '0', '0', '0'];
        const row5 = ['4', '0', '0', '8', '0', '3', '0', '0', '1'];
        const row9 = ['0', '0', '0', '0', '8', '0', '0', '7', '9'];

        expect(Board.convertCellsToCharacters(Board.getRow(board, 1)).split(',')).toEqual(row1);
        expect(Board.convertCellsToCharacters(Board.getRow(board, 5)).split(',')).toEqual(row5);
        expect(Board.convertCellsToCharacters(Board.getRow(board, 9)).split(',')).toEqual(row9);
    });

    test('Board.getCol gets columns', () => {
        const col1 = ['5', '6', '0', '8', '4', '7', '0', '0', '0'];
        const col5 = ['7', '9', '0', '6', '0', '2', '0', '1', '8'];
        const col9 = ['0', '0', '0', '3', '1', '6', '0', '5', '9'];

        expect(Board.convertCellsToCharacters(Board.getCol(board, 1)).split(',')).toEqual(col1);
        expect(Board.convertCellsToCharacters(Board.getCol(board, 5)).split(',')).toEqual(col5);
        expect(Board.convertCellsToCharacters(Board.getCol(board, 9)).split(',')).toEqual(col9);

    });

    test('Board.getBox gets boxes', () => {
        const boxes = [
            ['5', '3', '0', '6', '0', '0', '0', '9', '8'],
            ['0', '7', '0', '1', '9', '5', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '6', '0'],
            ['8', '0', '0', '4', '0', '0', '7', '0', '0'],
            ['0', '6', '0', '8', '0', '3', '0', '2', '0'],
            ['0', '0', '3', '0', '0', '1', '0', '0', '6'],
            ['0', '6', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '4', '1', '9', '0', '8', '0'],
            ['2', '8', '0', '0', '0', '5', '0', '7', '9']
        ];

        for (let i = 1; i < 10; i++) {
            let box = Board.getBox(board, i);
            box = Board.convertCellsToCharacters(box);
            box = box.split(',');
            expect(box).toEqual(boxes[i - 1]);
        }

    });
});


describe('test BoardtoString', () => {
    const board = new Board(unsolvedSudoku);
    test('should return valid board format', () => {
        expect(Board.toString(board)).toEqual(unsolvedSudoku);
    });
});

describe('test Board.addValue', () => {
    const board = new Board(unsolvedSudoku);

    test('throws Error when attempt to fill non-vacant cell', () => {
        expect(() => Board.addValue(board, 1, 1, 7)).toThrowError();
    });

    test('returns undefined when the value we attempt to fill is invalid', () => {
        expect(Board.addValue(board, 9, 1, '5')).toEqual(undefined);
    });

    test('returns a cloned board when the value we attempt fill is valid', () => {
        let clonedBoard = Board.addValue(board, 3, 1, '2');

        // returns a board object
        expect(clonedBoard).toBeInstanceOf(Board);
        // cloned board not same object as board
        expect(clonedBoard).not.toBe(board);
        // cloned board has the value we filled
        expect(clonedBoard.puzzle[2][0].value).toEqual('2');

        // cloned board is otherwise identical to board
        clonedBoard.puzzle[2][0].value = '0';
        expect(Board.toString(clonedBoard)).toEqual(Board.toString(board));
    });

});


describe('test Board.isValidFor', () => {
    const board = new Board(unsolvedSudoku);

    test('returns false when box has same value', () => {
        expect(Board.isValidFor(board, 4, 4, '2')).toEqual(false);
        expect(Board.isValidFor(board, 8, 8, '7')).toEqual(false);
    });

    test('returns false when row has same value', () => {
        expect(Board.isValidFor(board, 9, 1, '9')).toEqual(false);
    });

    test('returns false when col has the same value', () => {
        expect(Board.isValidFor(board, 9, 1, '5')).toEqual(false);
    });

    test('returns true when valid', () => {
        expect(Board.isValidFor(board, 3, 1, '2')).toEqual(true);
    });

});


describe('test Board.getBoxNum', () => {
    test('gets correct box', () => {
        expect(Board.getBoxNum(1, 1)).toEqual(1);
        expect(Board.getBoxNum(4, 4)).toEqual(5);
        expect(Board.getBoxNum(9, 9)).toEqual(9);
    });
});


describe('test Board.countMissingCells', () => {
    test('count correctly', () => {
        let board = new Board(solvedSudoku);

        expect(board.cellsMissing).toBe(0);

        for (let i = 5; i < 8; i++) {
            for (let j = 0; j < 9; j++) {
                board.puzzle[i][j].value = '0';
            }
        }

        Board.countMissingCells(board);
        expect(board.cellsMissing).toBe(27);

        board = new Board(solvedSudoku);
        board.puzzle[0][0].value = '0';
        Board.countMissingCells(board);
        expect(board.cellsMissing).toBe(1);
    });
});


describe('test Board.getMissingRowValues, Board.getMissingColValues & Board.getMissingBoxValues', () => {
    const board = new Board(unsolvedSudoku);
    test('Board.getMissingRowValues', () => {
        expect(Board.getMissingRowValues(board, 5)).toEqual(new Set(['2', '6', '5', '7', '9']));

    });

    test('Board.getMissingColValues', () => {
        expect(Board.getMissingColValues(board, 9)).toEqual(new Set(['2', '4', '7', '8']));
    });

    test('Board.getMissingBoxValues', () => {
        expect(Board.getMissingBoxValues(board, 9)).toEqual(new Set(['1', '3', '4', '6']));
    });
});

describe('test Board.getNextBlankCellIndicesIndex', () => {
    const board = new Board(unsolvedSudoku);

    test('returns expected values', () => {
        let nextIndex = Board.getNextBlankCellIndicesIndex(board, 5, 5);
        expect(board.blankCellsIndices[nextIndex])
            .toEqual([5, 6])

        nextIndex = Board.getNextBlankCellIndicesIndex(board);
        expect(board.blankCellsIndices[nextIndex])
            .toEqual([0, 2]);
    });

    test('returns undefined if no such cell', () => {
        expect(Board.getNextBlankCellIndicesIndex(board, 8, 7))
            .toBe(undefined);

        expect(Board.getNextBlankCellIndicesIndex(new Board(solvedSudoku)))
            .toBe(undefined);
    });
});

describe('test Board constructor', () => {

    /* 
        MAKE TESTS 
    */
});


describe('test Board.calculateMissingValues', () => {
    const boardString =
        `0,2,0,1,0,0,0,0,0
0,0,6,0,0,0,0,0,0
5,0,3,0,0,0,0,0,0
0,3,0,0,0,0,0,0,0
0,1,0,0,2,0,6,0,0
0,0,0,6,0,0,0,0,0
8,0,0,0,0,0,0,0,0
0,0,0,0,0,0,0,0,0
9,0,0,0,0,0,0,0,0`

    test('solves for the correct sets of missing values', () => {
        const board = new Board(boardString, { calculate: true });

        const expecting = [
            new Set(['4', '7']),
            new Set(['1', '4', '7']),
            new Set(['2', '4', '7', '6']),
            new Set(['4', '7']),
            new Set(['2', '4', '7']),
            new Set(['1', '2', '3', '4', '6', '7'])
        ];

        const firstCol = Board.getCol(board, 1);
        const blankCellValues = [];
        for (let i = 0; i < 9; i++) {
            const cell = firstCol[i];
            if (cell.value !== '0') continue;
            blankCellValues.push(cell.possibleValues);
        }

        for (let i = 0; i < blankCellValues.length; i++) {
            expect(blankCellValues[i]).toEqual(expecting[i]);
        }

    });



});

describe('test Board.areCompatible', () => {
    const boardString1 =
        `0,2,0,0,0,0,8,0,0
0,6,5,1,0,0,0,4,7
0,8,0,0,0,0,0,1,5
0,0,0,5,2,8,0,7,0
2,9,8,0,1,0,4,5,0
6,5,0,4,0,0,1,0,2
0,0,6,8,0,0,7,3,1
5,1,3,9,7,4,6,0,8
0,7,2,0,0,1,5,0,4`;

    const boardString2 =
        `1,7,2,4,5,8,6,9,3
4,8,5,6,3,9,1,2,7
6,3,9,1,2,7,4,8,5
5,1,3,2,9,6,7,4,8
2,4,6,7,8,3,9,5,1
8,9,7,5,1,4,2,3,6
3,5,1,0,4,2,8,6,9
9,6,4,8,7,5,3,1,2
7,2,8,9,6,1,5,0,4`;
    test('rejects incompatible boards', () => {
        const board1 = new Board(boardString1);
        const board2 = new Board(boardString2);
        expect(Board.areCompatible(board1, board2))
            .toEqual(false);
    });
});

/*
    Test:
        Board.constructor
        Board.getRowAndColNums
        Board.findPossibleCellValues
        Board.removeValue
        Board.getBoxRowsAndCols
        Board.copy
        Board.getBoxRow
        Board.getBoxCol
        Board.isCompatible
        Board.serialize
*/