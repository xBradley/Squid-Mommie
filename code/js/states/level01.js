//---------------------------------------------------------------------//
//Squid Mommie - Beta												   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		level01.js													   //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
var Level01 = function(game) {};
Level01.prototype = {
	//initialize variables for mommie
	init: function(_xpos, _ypos, _count, _theme, _theme2){
		this.xpos = _xpos;
		this.ypos = _ypos;
		this.count = _count;
		this.theme = _theme;
		this.theme2 = _theme2;
	},

	create: function() {
		console.log("Level 01")

		//background
		game.stage.backgroundColor = "#1d232f";	
		game.world.setBounds(0,0, 1600, 1600);
		
		//p2 physics
		game.physics.startSystem(Phaser.Physics.P2JS);
		//added in the desperate attempt to make the map work
	    game.physics.p2.setImpactEvents(true); 
		game.physics.p2.gravity.y = 0;
		game.physics.p2.TILE_BIAS = 500;


		//This is for the origional map I made that will probably work for testing.
		this.map = game.add.tilemap('world01');
		this.map.addTilesetImage('slopes', 'slopes');
		this.map.addTilesetImage('ground', 'ground');
		this.grounLayer = this.map.createLayer('ground');
		this.backgroundLayer = this.map.createLayer('background');
		this.wallLayer = this.map.createLayer('walls');
		this.map.setCollisionByExclusion([], true, this.wallLayer);
		this.wallLayer.resizeWorld();

		//adding wall physics
        game.physics.p2.convertTilemap(this.map, this.wallLayer);
        this.wallCollisionsGroup = game.physics.p2.createCollisionGroup();
        this.wallBodies = game.physics.p2.convertTilemap(this.map, this.wallLayer);
		
		//spawn babbie and add to group (babbies) 
		this.babbies = game.add.group();
		if(squad[1][0])
			this.spawnBaby(3680, 2560, [1,0]);

		//add player character (mommie)
		this.mommie = new player(game, this.xpos, this.ypos, "MommieSheet", this.babbies, this.count, 1);
		game.add.existing(this.mommie);

		//add babbie followers
		for (var i = 0; i < this.count; i++) {
			this.mommie.attachBaby(this.spawnFollower(this.xpos + 50, this.ypos + 50));
		}
		
		//camera stuff
		game.camera.follow(this.mommie, Phaser.Camera.FOLLOW_TOPDOWN);
	},
	
	//Play update loop
	update: function() {

		//switching theme the song for the final goodbye
		if(this.mommie.getCount() == 10 && this.theme2.volume < 0.35){
			console.log(this.theme2.volume);
			this.theme.volume -= .01;
			this.theme2.volume += .01;
		}
		//Moving back to level 0
		if(this.mommie.body.x <= 60){ 
			//console.log("Count: " + this.mommie.getCount());

			game.state.start('Level00', true, false, 1680, 5150, this.mommie.getCount(), this.theme, this.theme2);

			this.wallLayer.destroy();
			this.backgroundLayer.destroy();
			this.mommie.destroy();
			this.babbies.destroy();
		}
		//Moving to level 2
		else if(this.mommie.body.y <= 60){
			//console.log("Count: " + this.mommie.getCount());

			game.state.start('Level02', true, false, 1120, 1805, this.mommie.getCount(), this.theme, this.theme2);

			this.wallLayer.destroy();
			this.backgroundLayer.destroy();
			this.mommie.destroy();
			this.babbies.destroy();
		}
		//moving to level 3
		else if(this.mommie.body.y >= 6370){ 
			//console.log("Count: " + this.mommie.getCount());

			game.state.start('Level03', true, false, 320, 90, this.mommie.getCount(), this.theme, this.theme2);

			this.wallLayer.destroy();
			this.grounLayer.destroy();
			this.backgroundLayer.destroy();
			this.mommie.destroy();
			this.babbies.destroy();
		}
	},
	
	render: function() {
		//game.debug.cameraInfo(game.camera, 32, 32);
		//game.debug.spriteCoords(this.mommie, 32, 500);
		game.debug.pointer(game.input.activePointer);
		
		//var zone = this.soundWaveEmitter.area;
		//game.context.fillStyle = "rgba(0,0,255,0.5)";
		//game.context.fillRect(zone.x, zone.y, zone.width, zone.height);
	},
	
	//spawn baby, add to world, add to group
	spawnBaby: function(_x, _y, _arr) {
		var babbie = new babySquid(game, _x, _y, "deadBabbie",_arr[0],_arr[1]);
		game.add.existing(babbie);
		this.babbies.add(babbie);
	},

	//spawn baby, add to world, return baby
	spawnFollower: function(_x, _y) {
		var babbie = new babySquid(game, _x, _y, "deadBabbie", null, null);
		game.add.existing(babbie);
		
		return babbie;
	},
}
//---------------------------------------------------------------------//