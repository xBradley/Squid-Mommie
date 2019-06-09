//---------------------------------------------------------------------//
//Squid Mommie - Beta												   //
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
		game.load.image("white", "white.png"); 
		game.load.image("black", "black.png"); 
		game.load.image("soundWave", "soundwave.png");
		game.load.image("radialWave", "radial.png");
		game.load.image("aliveBabbie", "aliveBabbie.png");
		game.load.image("deadBabbie", "deadBabbie.png");
		game.load.image("mommieHalo", "halo.png");
		game.load.physics("squidPhysics", "squid.json");
		game.load.atlas("MommieSheet", "SquidMomSheet.png", "SquidMomSheet.json");

		//Loading fonts
		game.load.path == "assets/fonts/";
		game.load.script('titleFont', 'https://fonts.googleapis.com/css?family=Black+And+White+Picture&display=swap');

		//loading sounds -Matt
		game.load.path = "assets/audio/";
		game.load.audio('theme', ['byeWater.ogg']);
		game.load.audio('theme2', ['bye.ogg']);
		game.load.audio('swim', ['squidSwim.ogg']);
		
		//Loading squid mommie lullabys
		game.load.path = "assets/audio/lullaby/";
		game.load.audio('sing00', ['Song00.ogg']);
		game.load.audio('sing01', ['Song01.ogg']);
		game.load.audio('sing02', ['Song02.ogg']);
		game.load.audio('sing03', ['Song03.ogg']);
		game.load.audio('sing04', ['Song04.ogg']);
		game.load.audio('sing05', ['Song05.ogg']);
		game.load.audio('sing06', ['Song06.ogg']);
		game.load.audio('sing07', ['Song07.ogg']);
		game.load.audio('sing08', ['Song08.ogg']);
		game.load.audio('sing09', ['Song09.ogg']);
		game.load.audio('sing10', ['Song10.ogg']);
		
		//Loading squid baby cries
		game.load.audio('cry00', ['baby00.ogg']);
		game.load.audio('cry01', ['baby01.ogg']);
		game.load.audio('cry02', ['baby02.ogg']);
		game.load.audio('cry03', ['baby03.ogg']);
		game.load.audio('cry04', ['baby04.ogg']);
		game.load.audio('cry05', ['baby05.ogg']);
		game.load.audio('cry06', ['baby06.ogg']);
		game.load.audio('cry07', ['baby07.ogg']);
		game.load.audio('cry08', ['baby08.ogg']);
		game.load.audio('cry09', ['baby09.ogg']);
		game.load.audio('cry10', ['baby10.ogg']);

		//end sound loading

		//Adding map assets. Lemme know if you are curious about any of these parts -Matt
		//This is the map in progress
		/*
		game.load.path = 'assets/map/'; //I have this specific folder for map things
		game.load.tilemap('world', 'depths.json', null, Phaser.Tilemap.TILED_JSON); 
		game.load.spritesheet('caveTiles', 'underwaterCave.png', 16, 16);
		*/

		//This is loading in the original map
		game.load.path = 'assets/map/';
		game.load.tilemap('world00', 'level00.json', null, Phaser.Tilemap.TILED_JSON);
		//game.load.tilemap('world00', 'section00.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('world01', 'level01.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('world02', 'level02.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('world03', 'level03.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.spritesheet('slopes', 'slope1.png', 32, 32);
		game.load.spritesheet('ground', 'ground.png', 32, 32);
		game.load.spritesheet('door', 'door.png', 32, 32);
		game.load.spritesheet('rockWall', 'rockWall.png', 32, 32);
		game.load.spritesheet('background', 'background.png', 32, 32);
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