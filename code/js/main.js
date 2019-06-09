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
var squad = [level00Babbies, level01Babbies, level02Babbies, level03Babbies];

//Global tutorial checker
var tutorial = [true, true, true];


var level00Guide = { 1: new Phaser.Point(1895,210) };
var level01Guide = {
	0: new Phaser.Point(5,210),
	2: new Phaser.Point(1130,5), 
	3: new Phaser.Point(1530,3195),
};
var level02Guide = { 1: new Phaser.Point(1130,1895) };
var level03Guide = { 1: new Phaser.Point(320,5) };
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