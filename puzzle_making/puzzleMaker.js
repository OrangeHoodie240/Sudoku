const { Board } = require('../Board');
const {createPuzzles} = require('./createPuzzles');

function getRandomLevel(){
    const n = Math.floor(Math.random() * 4);
    let levels = ['level-three-A', 'level-three-B', 'level-three-C', 'level-three-D']; 
    return levels[n];
}

const fs = require('fs');

const levels = ['level-one', 'level-two', 'level-three'];


let fileName = process.argv[2].trim();
if (!fileName) throw new Error('Must provide filename');

fileName = './puzzle_making/puzzles/' + fileName + '.json';


let level = process.argv[3].trim();

let useMultipleLevles = null;
if(level === 'level-three'){
    useMultipleLevles = true;
} 


if (!levels.includes(level)) {
    throw new Error("Must provide valid level");
}

let number = process.argv[4].trim();
if (!number || !Number(number) || Number(number) <= 0) throw new Error("Must provide valid number of puzzles");
number = Number(number);

let data = {};

async function makePuzzlesAsync() {
    for (let i = 1; i <= number;) {
        if(useMultipleLevles) level = getRandomLevel();
        let puzzleNumber; 
        if(number - (i - 1) < 10){
            puzzleNumber = number - (i - 1); 
        }
        else{
            puzzleNumber = 10; 
        }
        let boards = await createPuzzles(level, puzzleNumber); 
        // if this is not the first iteration load the data 
        if (i > 1) {
            data = fs.readFileSync(fileName);
            data = JSON.parse(data);
        }

        for(let j = i, k=0; j < i + puzzleNumber; j++, k++){
            data[j] = boards[k];
            data['length'] = j;
        }
        
        data = JSON.stringify(data);
        fs.writeFileSync(fileName, data, 'utf-8');

        i+= puzzleNumber; 
        console.log(i-1, 'puzzles made so far');

    }
}

makePuzzlesAsync();