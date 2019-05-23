//---------------------------------------------------------------------//
//Squid Mommie - Alpha												   //
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
		game.load.image("soundWave", "soundwave.png");
		game.load.image("radialWave", "radial.png");
		game.load.physics("squidPhysics", "squid.json");

		//loading sounds -Matt
		game.load.path = "assets/audio/";
		game.load.audio('theme', ['byeWater.ogg']);
		game.load.audio('swim', ['squidSwim.ogg']);
		game.load.path = "assets/audio/Lullaby/";
		//Loading squid mommie lullabys
		game.load.audio('sing00', ['Song00.ogg']);
		game.load.audio('sing01', ['Song01.ogg']);
		game.load.audio('sing02', ['Song02.ogg']);
		game.load.audio('sing03', ['Song03.ogg']);
		game.load.audio('sing04', ['Song04.ogg']);
		game.load.audio('sing05', ['Song05.ogg']);
		//Loading squid baby cries
		game.load.audio('cry00', ['baby00.ogg']);
		game.load.audio('cry01', ['baby01.ogg']);
		game.load.audio('cry02', ['baby02.ogg']);
		game.load.audio('cry03', ['baby03.ogg']);
		game.load.audio('cry04', ['baby04.ogg']);
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
		//console.log("Boot");
		
		game.stage.backgroundColor = "#deface";
		game.state.start("Menu", true, false);
	},
}
//---------------------------------------------------------------------//