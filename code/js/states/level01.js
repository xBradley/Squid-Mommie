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
	init: function(_xpos, _ypos, _count, _squad, _theme, _theme2){
		this.xpos = _xpos;
		this.ypos = _ypos;
		this.count = _count;
		this.squad = _squad;
		this.theme = _theme;
		this.theme2 = _theme2;
	},

	create: function() {

		//background
		game.stage.backgroundColor = "#2F4F4F";
		game.world.setBounds(0,0, 1600, 1600);
		
		//p2 physics
		game.physics.startSystem(Phaser.Physics.P2JS);
		//added in the desperate attempt to make the map work
	    game.physics.p2.setImpactEvents(true); 
		game.physics.p2.gravity.y = 0;

		//This is for the origional map I made that will probably work for testing.
		this.map = game.add.tilemap('world01');
		this.map.addTilesetImage('slopes', 'slopes');
		this.backgroundLayer = this.map.createLayer('background');
		this.wallLayer = this.map.createLayer('walls');
		this.map.setCollisionByExclusion([], true, this.wallLayer);
		this.wallLayer.resizeWorld();

		//adding wall physics
        game.physics.p2.convertTilemap(this.map, this.wallLayer);
        this.wallCollisionsGroup = game.physics.p2.createCollisionGroup();
        this.wallBodies = game.physics.p2.convertTilemap(this.map, this.wallLayer);
		
		//spawn babbie and add to group (babbies) 
		console.log(this.squad);
		this.babbies = game.add.group();
		if(this.squad[2])
			this.spawnBaby(520, 240);
		if(this.squad[3])
			this.spawnBaby(1528, 1608);
		if(this.squad[4])	
			this.spawnBaby(895, 2795);
			if(this.squad[5])	
			this.spawnBaby(224, 690);

		//I spawn the foreground here so that it covered up the babys
		this.foreground = this.map.createLayer('foreground');

		//add player character (mommie)
		this.mommie = new player(game, this.xpos, this.ypos, "MommieSheet", this.babbies, this.count);
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

			game.state.start('Level00', true, false, 1820, 200, this.mommie.getCount(), this.squad, this.theme, this.theme2);

			this.wallLayer.destroy();
			this.backgroundLayer.destroy();
			this.foreground.destroy();
			this.mommie.destroy();
			this.babbies.destroy();
		}
		//Moving to level 2
		else if(this.mommie.body.y <= 60){
			//console.log("Count: " + this.mommie.getCount());

			game.state.start('Level02', true, false, 1120, 1805, this.mommie.getCount(), this.squad, this.theme, this.theme2);

			this.wallLayer.destroy();
			this.backgroundLayer.destroy();
			this.foreground.destroy();
			this.mommie.destroy();
			this.babbies.destroy();
		}
		//moving to level 3
		else if(this.mommie.body.y >= 3110){ 
			//console.log("Count: " + this.mommie.getCount());

			game.state.start('Level03', true, false, 320, 90, this.mommie.getCount(), this.squad, this.theme, this.theme2);

			this.wallLayer.destroy();
			this.backgroundLayer.destroy();
			this.foreground.destroy();
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
	spawnBaby: function(_x = game.world.centerX, _y = game.world.centerY) {
		var babbie = new babySquid(game, _x, _y, "squid", 1);
		game.add.existing(babbie);
		this.babbies.add(babbie);
	},

	//spawn baby, add to world, return baby
	spawnFollower: function(_x = game.world.centerX, _y = game.world.centerY) {
		var babbie = new babySquid(game, _x, _y, "squid", 0);
		game.add.existing(babbie);
		
		return babbie;
	},
}
//---------------------------------------------------------------------//