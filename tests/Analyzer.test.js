const Analyzer = require('../Analyzer');
const { Board } = require("../Board");

describe('Analyzer', () => {

    const levelThreeA = `2,0,4,0,0,0,0,0,0
0,0,0,0,0,0,6,0,0
7,0,0,4,0,0,1,3,0
0,1,0,7,0,0,3,9,0
4,0,9,1,8,0,0,6,0
0,0,8,0,0,0,0,0,0
0,0,0,0,0,7,0,5,6
9,0,0,6,5,1,0,7,2
0,0,0,8,0,0,0,0,3`;

    const levelThreeASolved = `2,3,4,5,1,6,7,8,9
1,9,5,3,7,8,6,2,4
7,8,6,4,9,2,1,3,5
6,1,2,7,4,5,3,9,8
4,5,9,1,8,3,2,6,7
3,7,8,2,6,9,5,4,1
8,2,1,9,3,7,4,5,6
9,4,3,6,5,1,8,7,2
5,6,7,8,2,4,9,1,3`;

    const levelThreeB = `2,0,4,1,0,6,0,0,0
0,7,0,0,0,0,0,0,5
0,0,0,2,0,7,0,0,6
1,0,0,0,3,0,6,0,0
0,8,0,6,0,0,0,0,2
0,0,3,0,2,0,0,0,0
3,0,2,8,0,4,9,0,0
9,0,6,0,0,0,8,0,4
0,0,0,0,0,2,0,1,0`;

    const levelThreeBSolved = `2,3,4,1,5,6,7,8,9
6,7,1,3,8,9,2,4,5
8,9,5,2,4,7,1,3,6
1,2,9,4,3,5,6,7,8
4,8,7,6,9,1,3,5,2
5,6,3,7,2,8,4,9,1
3,5,2,8,1,4,9,6,7
9,1,6,5,7,3,8,2,4
7,4,8,9,6,2,5,1,3`;

    const levelThreeC = `0,2,0,0,6,0,8,0,5
0,0,0,0,0,0,0,0,0
0,0,8,0,0,0,0,4,6
2,0,4,9,0,0,6,0,3
0,0,0,6,1,0,9,5,2
5,0,0,0,7,0,0,0,0
8,0,0,0,0,3,0,0,9
9,3,0,0,0,0,0,0,0
0,0,5,0,8,0,3,0,1`;


    const levelThreeCSolved = `1,2,3,4,6,7,8,9,5
4,5,6,8,9,1,2,3,7
7,9,8,2,3,5,1,4,6
2,1,4,9,5,8,6,7,3
3,8,7,6,1,4,9,5,2
5,6,9,3,7,2,4,1,8
8,7,2,1,4,3,5,6,9
9,3,1,5,2,6,7,8,4
6,4,5,7,8,9,3,2,1`;

    const boardStrings = [levelThreeA, levelThreeB, levelThreeC];
    const solvedBoardStrings = [levelThreeASolved, levelThreeBSolved, levelThreeCSolved];

    const expectedDataList = [
        [
            ['sole-candidate'],
            ['sole-candidate'],
            ['unique-candidate'],
            ['unique-candidate'],
            ['unique-candidate'],
            ['unique-candidate'],
            ['last-remaining-cell'],
            ['unique-candidate'],
            ['unique-candidate-row-or-col'],
            ['unique-candidate'],
            ['unique-candidate-row-or-col'],
            ['naked-subset{setSize-2}'],
            ['unique-candidate'],
            ['unique-candidate-row-or-col'],
            ['pointing-pairs-and-tripples'],
            ['unique-candidate'],
            ['unique-candidate-row-or-col'],
            ['unique-candidate'],
            ['unique-candidate'],
            ['sole-candidate'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['sole-candidate'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['last-remaining-cell'],
            ['last-remaining-cell'],
            ['last-remaining-cell'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['sole-candidate'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['last-remaining-cell'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['last-remaining-cell'],
            ['last-remaining-cell'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['last-remaining-cell'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['last-remaining-cell'],
            ['last-remaining-cell']
        ],
        [
            ['sole-candidate'],
            ['sole-candidate'],
            ['sole-candidate'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['sole-candidate'],
            ['unique-candidate'],
            ['unique-candidate'],
            ['unique-candidate'],
            ['unique-candidate'],
            ['unique-candidate'],
            ['unique-candidate'],
            ['unique-candidate'],
            ['unique-candidate'],
            ['unique-candidate'],
            ['pointing-pairs-and-tripples'],
            ['last-remaining-cell'],
            ['sole-candidate'],
            ['unique-candidate'],
            ['unique-candidate-row-or-col'],
            ['sole-candidate'],
            ['pointing-pairs-and-tripples', 'box-line-reduction'],
            ['unique-candidate'],
            ['unique-candidate'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['unique-candidate'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['last-remaining-cell'],
            ['last-remaining-cell'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['last-remaining-cell'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['sole-candidate'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['last-remaining-cell'],
            ['last-remaining-cell'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['last-remaining-cell'],
            ['last-remaining-cell']
        ],
        [
            ['sole-candidate'],
            ['sole-candidate'],
            ['sole-candidate'],
            ['sole-candidate'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['unique-candidate'],
            ['unique-candidate'],
            ['last-remaining-cell'],
            ['unique-candidate'],
            ['unique-candidate'],
            ['unique-candidate-row-or-col'],
            ['pointing-pairs-and-tripples'],
            ['pointing-pairs-and-tripples'],
            ['sole-candidate'],
            ['sole-candidate'],
            ['sole-candidate'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['last-remaining-cell'],
            ['sole-candidate'],
            ['sole-candidate'],
            ['sole-candidate'],
            ['sole-candidate'],
            ['unique-candidate'],
            ['sole-candidate'],
            ['sole-candidate'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['last-remaining-cell'],
            ['last-remaining-cell'],
            ['last-remaining-cell'],
            ['last-remaining-cell'],
            ['naked-subset{setSize-2}'],
            ['sole-candidate'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['sole-candidate'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['last-remaining-cell'],
            ['sole-candidate'],
            ['sole-candidate'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['last-remaining-cell'],
            ['last-remaining-cell'],
            ['sole-candidate'],
            ['last-remaining-cell'],
            ['last-remaining-cell'],
            ['last-remaining-cell'],
            ['last-remaining-cell'],
            ['last-remaining-cell']
        ]
    ];

    test('works', () => {

        for (let i = 0; i < boardStrings.length; i++) {
            const expectedData = expectedDataList[i];
            const boardString = boardStrings[i];
            const solvedString = solvedBoardStrings[i];

            let board = new Board(boardString);
            const originalCellCount = board.cellsMissing;
            let data = [];
            while (board.cellsMissing > 0) {
                let analysis = Analyzer.analyze(board);
                const { position, solveWith, value } = analysis;
                data.push(solveWith);
                board = Board.addValue(board, position[0], position[1], value);
            }

            expect(Board.toString(board))
                .toEqual(solvedString);

            expect(data)
                .toEqual(expectedData);

            expect(data.length)
                .toEqual(originalCellCount);
        }

    });


});