const { Board } = require('../Board');
const {createPuzzles, createPuzzle} = require('./createPuzzles');

function getRandomLevel(){
    const n = Math.floor(Math.random() * 4);
    let levels = ['level-three-A', 'level-three-B', 'level-three-C']; 
    return levels[n];
}

const fs = require('fs');

const levels = ['level-one', 'level-two', 'level-three'];


let fileName = process.argv[2].trim();
if (!fileName) throw new Error('Must provide filename');

fileName = './puzzle_making/puzzles/' + fileName + '.json';


let level = process.argv[3].trim();


let step = 10;
let useMultipleLevles = null;
if(level === 'level-three'){
    useMultipleLevles = true;
    step = 1; 
} 


let getPuzzle; 
if(step === 1){
    getPuzzle = async function(level){
        return await createPuzzle(level, 10);
    } 
}
else{
    getPuzzle = async function(level, puzzleNumber){
        return await createPuzzles(level, puzzleNumber);
    }
}

if (!levels.includes(level)) {
    throw new Error("Must provide valid level");
}

let number = process.argv[4].trim();
if (!number || !Number(number) || Number(number) <= 0) throw new Error("Must provide valid number of puzzles");
number = Number(number);

let data = {};

async function makePuzzlesAsync() {
    let start = 1; 

    try{
        data = fs.readFileSync(fileName);
        data = JSON.parse(data);
        start = Number(data.length) + 1; 
    }
    catch(err){
        console.log('creating new file');
    }

    // iterate over every puzzle generation
    for (let i = start; i <= number;) {
        // if level three get a random level (A, B or C)
        if(useMultipleLevles) level = getRandomLevel();

        // if we have less puzzles to generate then the step, set the puzzleNumber to the remainder
        let puzzleNumber; 
        if(number - (i - 1) < step){
            puzzleNumber = number - (i - 1); 
        }
        else{
            puzzleNumber = step; 
        }
        

        let boards = await getPuzzle(level, puzzleNumber); 

        // if this is not the first iteration load the data 
        if (i > 1) {
            data = fs.readFileSync(fileName);
            data = JSON.parse(data);
        }


        if(step !== 1){
            for(let j = i, k=0; j < i + puzzleNumber; j++, k++){
                data[j] = boards[k];
                data['length'] = j;
            }
        }
        else{
            data[i] = boards; 
            data['length'] = i; 
        }
        
        
        data = JSON.stringify(data);
        fs.writeFileSync(fileName, data, 'utf-8');

        i+= puzzleNumber; 
        console.log(i-1, 'puzzles made so far');

    }
}

makePuzzlesAsync();