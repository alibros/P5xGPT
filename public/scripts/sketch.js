//declare gameName variable with a value 
const gameName = 'Tic Tac Toe 2'; 

//initialize `grid` array of arrays 
let grid = Array(3).fill(0).map(x => Array(3).fill(''));

//initialize the `player` array with values 
let players = ['X', 'O'];

//initialize `currentPlayer` and `gameOver` as empty string and false respectively 
let currentPlayer = '';
let gameOver = false;
let resultText = '';

function setup() {
  createCanvas(600, 600).parent('p5canvas');
  //add a mousePressed event and  function to the canvas to evaluate mouse clicks
  mouseClicked = function(){
    //if the game is over, reset variables to start a new game
    if(gameOver) {
      grid = Array(3).fill(0).map(x => Array(3).fill(''));
      currentPlayer = players[Math.floor(Math.random()*players.length)];
      gameOver = false;
    }else if(!gameOver){
      // Otherwise, handle valid clicks to fill cells in the grid array with `currentPlayer` values and switch players
      let col;
      let row;

      if(mouseX < width/3) col = 0;
      else if(mouseX > width/3*2) col = 2;
      else col = 1;

      if(mouseY < height/3) row = 0;
      else if(mouseY > height/3*2) row = 2;
      else row = 1;

      if(grid[row][col] === ''){
        grid[row][col] = currentPlayer;
        currentPlayer = players[1 - players.indexOf(currentPlayer)];
      }
    }
  }

  //initialize `currentPlayer` to random player from `players` array
  currentPlayer = players[Math.floor(Math.random()*players.length)];
}

function draw() {
  background(220);
  drawGrid();
  drawPlayers();
  checkWinner();
  if(gameOver){
    textSize(40);
    textAlign(CENTER, CENTER);
    text(resultText, width/2, height/2);
  }
}

function drawGrid(){
  strokeWeight(4);
  line(width/3, 0, width/3, height);
  line(width/3*2, 0, width/3*2, height);
  line(0, height/3, width, height/3);
  line(0, height/3*2, width, height/3*2);
}

//draw the Xs and Os on the game grid
function drawPlayers(){
  textSize(60);
  textAlign(CENTER, CENTER);
  let offset = width/6;
  for(let i=0; i<3; i++){
    for(let j=0; j<3; j++){
      let x = j*width/3 + offset;
      let y = i*height/3 + offset;
      if(grid[i][j] === players[0]){
        fill(0);
        text(grid[i][j], x, y);
      } else if(grid[i][j] === players[1]){
        fill(255);
        text(grid[i][j], x, y);
      }
    }
  }
}

//evaluate if players have won or if there's a tie game
function checkWinner(){
  for (let i = 0; i < 3; i++) {
    if (grid[i][0] === grid[i][1] && grid[i][1] === grid[i][2]) {
      if(grid[i][0] !== ''){
        resultText = `${grid[i][0]} wins!`;
        gameOver = true;
        return;
      }
    }
    if (grid[0][i] === grid[1][i] && grid[1][i] === grid[2][i]) {
      if(grid[0][i] !== ''){
        resultText = `${grid[0][i]} wins!`;
        gameOver = true;
        return;
      }
    }
  }
  if (grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) {
    if(grid[0][0] !== ''){
      resultText = `${grid[0][0]} wins!`;
      gameOver = true;
      return;
    }
  }

  if (grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0]) {
    if(grid[0][2] !== ''){
      resultText = `${grid[0][2]} wins!`;
      gameOver = true;
      return;
    }
  }

  if(grid.every(row => row.every(cell => cell !== ''))){
    gameOver = true;
    resultText = 'Game over';
  }
}