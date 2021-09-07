const Generator = require('./Generator');
const {Board} = require('./Board');

const fs = require('fs'); 

const levels = ['level-one', 'level-two', 'level-three', 'level-four', 'level-five', 'level-test']; 


let fileName = process.argv[2].trim(); 
if(!fileName) throw new Error('Must provide filename'); 

fileName = './puzzles/' + fileName + '.json'; 


const level = process.argv[3].trim(); 



if(!levels.includes(level)) {
    throw new Error("Must provide valid level");
}

let number = process.argv[4].trim() ;
if(!number || !Number(number) || Number(number) <= 0) throw new Error("Must provide valid number of puzzles"); 
number = Number(number);

let data = {};
for(let i = 1; i <= number; i++){
    let board = Generator.generatePuzzle(level);
    board = Board.serialize(board);
    if(i > 1){
        data = fs.readFileSync(fileName); 
        data = JSON.parse(data); 
    }
    data[i] = board;
    data['length'] = i;  
    data = JSON.stringify(data); 
    fs.writeFileSync(fileName, data, 'utf-8');
    console.log(i, 'puzzles made so far'); 
}

