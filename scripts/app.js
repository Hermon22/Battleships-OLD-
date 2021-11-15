/*
*
*Created by Jose Abraham Hernandez Moreno PG10 23/03/2017
*/
'use strict';
//constants for the game
const MAX_COL = 10;
const MAX_ROW = 10;
	//array for the logic of the map
var map = [];
//global music varibles using buzz
var menuMus = new buzz.sound('../battleship/music/MUS_Menu.wav', {
	loop: true
});
var gameLoopMus = new buzz.sound('../battleship/music/MUS_GameplayLoop.wav', {
	loop: true
});
var waves = new buzz.sound('../battleship/music/GP_Background_Waves.wav', {
	loop: true
});
//array of ships, to determine how long are the ships, and how many
var ships = [2,3,4,4,5];
//variable to count the shots the player has
var shots = 40;
//variable to count how many ships the playes has shunk
let shipCount = 0;
//creating the class app for the game
class App{
	//constructor for the game
	constructor(){
		//the player wins
		this.winGame();
		//the player loses
		this.loseGame();
		//menu functionality
		this.menuHide();
		//map for the logic
		this.createTheMap();
		//place the ships on the map
		this.placeShips();
		//initialize screnn
		this.initScreen();
		//set up handlers
		this.setupHandlers();
  }

	//Function when the player loses
	loseGame(){
		document.querySelector("#loseButton")
			.addEventListener('click', (event) =>{
				//found the reload function here https://www.w3schools.com/jsref/met_loc_reload.asp
				location.reload();
				});
	}

	//Function when the player wins
	winGame(){
		document.querySelector("#WinButton")
			.addEventListener('click', (event) =>{
				//found the reload function here https://www.w3schools.com/jsref/met_loc_reload.asp
				location.reload();
				});
	}

	//Function to display the menu, and hide it when the button is pressed
	menuHide(){
		//playing the music for the menu using buzz
		menuMus.play();
		waves.load();
		waves.play();
		//Found the display Function here https://www.w3schools.com/css/css_display_visibility.asp
		document.querySelector("#nav").style.display = "none";
		document.querySelector("#tableGame").style.display = "none";
		document.querySelector("#dialogLose").className = "hide";
		document.querySelector("#dialogeWin").className = "hide";
		document.querySelector("#divShots").style.display = "none";
		document.querySelector("#shots").style.display = "none";
		document.querySelector("#tableShips").style.display = "none";
		document.querySelector("#dialogs").style.display = "none";
		document.querySelector("#foo").className = "hide";
		document.querySelector("#menu-Button")
			.addEventListener('click', (event) =>{
				document.querySelector("#menu").style.display = "none";
				document.querySelector("#nav").style.display = "block";
				document.querySelector("#tableGame").style.display = "block";
				document.querySelector("#divShots").style.display = "block";
				document.querySelector("#shots").style.display = "block";
				document.querySelector("#tableShips").style.display = "block";
				document.querySelector("#dialogs").style.display = "block";
				document.querySelector("#foo").className = "";
				menuMus.stop();
				gameLoopMus.play();
				});
	}

	//Function to create the table for the game
	initScreen(){
		//creating the markup for the table
		let gameAreaMarkup = '<table id="game-map" class = "table-game">';
		for (let r = 0; r < MAX_ROW; r++){
			gameAreaMarkup += '<tr>';
			for(let c= 0; c < MAX_COL; c++){
				//making sure that every cell has a way to identify itself
				gameAreaMarkup += `<td data-row="${r}" data-col="${c}"></td>`;
			}
			gameAreaMarkup += '</tr>';
		}
		gameAreaMarkup += '</table>';
		//creating the table into the div with id tableGame
		document.querySelector("#tableGame").innerHTML = gameAreaMarkup;
	}

	//Function to define what the user sees
	setupHandlers(){
		//variables for buzz music
		let hitSong = new buzz.sound('../battleship/music/GP_Ship_Hit2.wav');
		let missSong = new buzz.sound('../battleship/music/GP_Ship_Miss.wav');
		let desSong = new buzz.sound('../battleship/music/GP_Ship_Drestroy.wav');
		let lose = new buzz.sound('../battleship/music/GP_YouLose_Song.wav');
		let victory = new buzz.sound('../battleship/music/GP_Victory_Song.wav', {
			loop: true
		});
		//every time the button of the mouse is down inside the table of the game, this is going to happen
		document.querySelector("#game-map")
			.addEventListener('mousedown', (event) =>{
				//get the target of this event
				let theCellElement = event.target;
				//get the data-row and data-col from this cell
				let pos = {
					r: theCellElement.getAttribute('data-row'),
					c: theCellElement.getAttribute('data-col')
				}
				//found the classlist.contains here https://developer.mozilla.org/en/docs/Web/API/Element/classList
				//and I using it to see it the cell was already pressed before
				if(!theCellElement.classList.contains("mark-ship-miss") && !theCellElement.classList.contains("mark-ship-hit")){
					//this is the value inside the the internal map
					let hitValue = (map[pos.r][pos.c]);
					//lookup the r, c in the map to see if there is a ship there if the value of that cell in the internal map is
					//-1 the cell is empty, but if is something else that means there is a ship there
					if(hitValue == -1){
						//play the sound effect
						missSong.load();
						missSong.play();
						//indicate on screen what happened
						theCellElement.className = "mark-ship-miss";
						//reduce the number of ships left
						shots --;
						//Showing the user how many shots has left and a little message telling what happened
						document.querySelector("#shots").innerHTML = `<h2> ${shots} </h2>`;
						document.querySelector("#dialogs").innerHTML = "<h3>Miss!</h3>";
					} else {
						//Play sound effect
						hitSong.load();
						hitSong.play();
						//hitvalue is for example 4, so I look for the fourth value inside my ships array
						//so because I know that my ships are represented internally by the value of their position on the ships array
						//I just decrees that value overtime to see if a ship is destroyed
						ships[hitValue] --;
						//so if that value is 0 the ship of that value is destroyed
						if(ships[hitValue] == 0){
							//Play sound effect
							desSong.load();
							desSong.play();
							//Show which ship was destroyed
							let boatUI = document.querySelector(`#boat${hitValue}`);
							boatUI.className = `background-ship-${hitValue}`;
							//And I increase this to see if the player has destroyed all the ships
							shipCount++;
						}
						//indicate on screen what happened
						theCellElement.className = "mark-ship-hit";
						//reduce the number of ships left
						shots --;
						//Showing the user how many shots has left and a little message telling what happened
						document.querySelector("#shots").innerHTML = `<h2> ${shots} </h2>`;
						document.querySelector("#dialogs").innerHTML = "<h3>Hit!</h3>";
						//if the number inside the array on that position is equals 0
						if(ships[hitValue] == 0){
							//show the user what happend
							document.querySelector("#dialogs").innerHTML = "<h3>You destroyed a ship</h3>";
						}
					}
				}
				//if the number of shots is 0 the game hide everything except the
				//losing dialog, so game over
				if((shots == 0) && (shipCount != ships.length)){
					document.querySelector("#nav").style.display = "none";
					document.querySelector("#welcome").style.display = "none";
					document.querySelector("#tableGame").style.display = "none";
					document.querySelector("#dialogLose").className = "container";
					document.querySelector("#divShots").style.display = "none";
					document.querySelector("#shots").style.display = "none";
					document.querySelector("#tableShips").style.display = "none";
					document.querySelector("#dialogs").style.display = "none";
					document.querySelector("#foo").style.display = "none";
					//stop the gameplay loop music and play the lose song
					gameLoopMus.stop();
					lose.load();
					lose.play();
				}
				//if the number of ships destroyed is equals the length of the array
				//the player won
				if(shipCount == ships.length){
					document.querySelector("#nav").style.display = "none";
					document.querySelector("#welcome").style.display = "none";
					document.querySelector("#tableGame").style.display = "none";
					document.querySelector("#dialogeWin").className = "container";
					document.querySelector("#divShots").style.display = "none";
					document.querySelector("#shots").style.display = "none";
					document.querySelector("#tableShips").style.display = "none";
					document.querySelector("#dialogs").style.display = "none";
					document.querySelector("#foo").style.display = "none";
					//stop the gameplay loop music and play the victory song
					gameLoopMus.stop();
					victory.load();
					victory.play();
				}
		});
	}

	//function to create the internal map, so I can compare this positions to the positions in the DOM
	createTheMap(){
		//for for the rows of the map
		for (let row = 0; row < MAX_ROW; row++){
			//I create an array inside the array to create a multidimensional array or matrix for the map
			map[row]= [];
			//For for the columns of the map
			for(let col = 0; col < MAX_COL; col++){
				//fill the matrix with -1, this means that -1 is empty (no ship)
				map[row][col]=-1;
			}
		}
	}

	//function to place the ships on the internal map
	placeShips(){
		//index fo the ships array
		let index = 0;
		//this while is going through the ships array to place the ships
		while ((ships[index])) {
			//random for orientation of the ship, I found the function here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
			let orShip = Math.round(Math.random());
			//Creating the random point to begin the ships
			let colStart;
			let rowStart;
			//Check the orientation of the ship, if it is 0 the ship will be horizontal
			//so the random value for the beginning point will be a random number between 0 and the MAX_ROW
			//for the row location and between 0 and MAX_COL minus the length of the ship so the ship can't start
			//on a position in which the ship won’t be able to fit horizontally
			if(orShip == 0){
				colStart = Math.floor(Math.random() * (((MAX_COL - ships[index])) - 0)) + 0;
				rowStart = Math.floor(Math.random() * (((MAX_ROW)) - 0)) + 0;
			}
			else{
				//But if it is 0 the ship will be vertical
				//so the random value for the beginning point will be a random number between 0 and the MAX_COL
				//for the column location and between 0 and MAX_ROW minus the length of the ship so the ship can't start
				//on a position in which the ship won’t be able to fit vertically
				colStart = Math.floor(Math.random() * (((MAX_COL)) - 0)) + 0;
				rowStart = Math.floor(Math.random() * (((MAX_ROW - ships[index])) - 0)) + 0;
			}
			//temporal variable with the original position of the ship
			//so in case the ship is going to overlap, i can use the position as a reference
			let temp = colStart;
			let temp2 = rowStart;
			//for loop to place the ships
			for (let shipLenght = ships[index]; shipLenght > 0; shipLenght--)
			{
				//if the ship is horizontal
				if (orShip == 0)
				{
					//check if that position on the map is free
					if((map[rowStart][colStart]) == -1){
						//if it is change that value to the value of the current index
						map[rowStart][colStart] = index;
						//and go to the next column
						colStart++;
					//if the position is different than -1 there is a ship so
					}else {
						//Check your current position and compare it with the reference and do this while
						//your current is more than you reference
						while((temp < colStart) ){
							//go back one column
							colStart--;
							//make that an empty space
							map[rowStart][colStart] = -1;
							//give back to the ship, so the ship can be as long as it was before
							shipLenght++;
						}
						//find a new point to begin
						colStart = Math.floor(Math.random() * (((MAX_COL - ships[index])) - 0)) + 0;
						rowStart = Math.floor(Math.random() * (((MAX_ROW)) - 0)) + 0;
						//save that column as your new reference
						temp = colStart;
						//give back to the ship, so the ship can be as long as it was before
						shipLenght++;
					}
				}
				//if the ship is vertical
				if (orShip == 1)
				{
					//check if that position on the map is free
					if((map[rowStart][colStart]) == -1){
						//if it is change that value to the value of the current index
						map[rowStart][colStart] = index;
						//and go to the next row
						rowStart++;
					//if the position is different than -1 there is a ship so
					}else {
						//Check your current position and compare it with the reference and do this while
						//your current is more than you reference
						while((temp2 < rowStart)){
							//go back one row
							rowStart--;
							//make that an empty space
							map[rowStart][colStart] = -1;
							//give back to the ship, so the ship can be as long as it was before
							shipLenght++;
						}
						//find a new point to begin
						colStart = Math.floor(Math.random() * (((MAX_COL)) - 0)) + 0;
						rowStart = Math.floor(Math.random() * (((MAX_ROW - ships[index])) - 0)) + 0;
						//save that row as your new reference
						temp2 = rowStart;
						//give back to the ship, so the ship can be as long as it was before
						shipLenght++;
					}
				}
			}
			//increase the  index
			index++;
		}
	}

	//run function
	run(){
	}

}
//run the app
let a = new App();
a.run();
