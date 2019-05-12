//---------------------------------------------------------------------//
//Squid Mommie														   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		boot.js														   //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
var Boot = function(game) {};
Boot.prototype = {
	//Load all assets
	preload: function() {
		game.load.path = "assets/img/";
		game.load.image("bg", "waterBackground.jpg"); 
		game.load.image("squid", "squid.png");
		game.load.image("arrow", "arrow.png");
		game.load.physics("squidPhysics", "squid.json");

		//loading sounds -Matt
		game.load.path = "assets/audio/";
		game.load.audio('theme', ['byeWater.ogg']);
		game.load.audio('swim', ['squidSwim.ogg']);
		game.load.path = "assets/audio/Lullaby/";
		game.load.audio('sing', ['Song00.ogg']);
		//end sound loading

		//Adding map assets. Lemme know if you are curious about any of these parts -Matt
		//This is the map in progress
		/*
		game.load.path = 'assets/map/'; //I have this specific folder for map things
		game.load.tilemap('world', 'depths.json', null, Phaser.Tilemap.TILED_JSON); 
		game.load.spritesheet('caveTiles', 'underwaterCave.png', 16, 16);
		*/

		//This is loading in the origional map
		game.load.path = 'assets/map/';
		game.load.tilemap('globe', 'map01.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.spritesheet('dungeon', 'ForgottenDungeon.png', 16, 16);
		game.load.spritesheet('metal', 'construction_tileset.png', 16, 16);
		//end of map asset loading -Matt
	},
	
	//Boot-up screen
	create: function() {
		console.log("Boot");
		
		game.stage.backgroundColor = "#deface";
		game.state.start("Menu", true, false);
	},
}
//---------------------------------------------------------------------//