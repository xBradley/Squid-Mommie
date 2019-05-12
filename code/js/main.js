//---------------------------------------------------------------------//
//Squid Mommie														   //
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

//Add each state to the manager and start with MainMenu
window.onload = function() {
	game.state.add("Boot", Boot);
	game.state.add("Menu", Menu);
	game.state.add("Play", Play);
	game.state.start("Boot", true, true);
}
//---------------------------------------------------------------------//