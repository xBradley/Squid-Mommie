 //---------------------------------------------------------------------//
//Squid Mommie - Beta					   						       //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		main.js														   //
//---------------------------------------------------------------------//

"use strict";
//-------------------------------- Game Setup -------------------------//
//Configuration parameters fo Phaser.Game Object
var config = {
	width: 600,
	height: 600,
	renderer: Phaser.CANVAS, 
}

//Create new instance of a game
var game = new Phaser.Game(config);

//Global 2D array to manage baby squid spawning
var level00Babbies = [true, true, true, true];
var level01Babbies = [true, true];
var level02Babbies = [true, true, true];
var level03Babbies = [true];
// var level00Babbies = [false, false, false, false];
// var level01Babbies = [false, false];
// var level02Babbies = [false, false, false];
// var level03Babbies = [false];
var squad = [level00Babbies, level01Babbies, level02Babbies, level03Babbies];

//Global tutorial checker
var tutorial = [true, true, true];


var level00Guide = { 1: new Phaser.Point(1888,5152) };
var level01Guide = {
	0: new Phaser.Point(5,320),
	2: new Phaser.Point(6624,5), 
	3: new Phaser.Point(1984,6368),
};
var level02Guide = { 1: new Phaser.Point(582,3150) };
var level03Guide = { 1: new Phaser.Point(480,5) };
var guide = [level00Guide, level01Guide, level02Guide, level03Guide];

//Global variable reset function
var resetGlobals = function() {
	for (var i = 0; i < squad.length; ++i) {
		for (var j = 0; j < squad[i].length; ++j) 
			squad[i][j] = true;
	}

	for (var i = 0; i < tutorial.length; ++i)
		tutorial[i] = true;
}

//Add each state to the manager and start with MainMenu
window.onload = function() {
	game.state.add("Boot", Boot);
	game.state.add("Menu", Menu);
	game.state.add("Level00", Level00);
	game.state.add("Level01", Level01);
	game.state.add("Level02", Level02);	
	game.state.add("Level03", Level03);
	game.state.add("Gameover", Gameover);
	game.state.start("Boot", true, true);
}

//---------------------------------------------------------------------//