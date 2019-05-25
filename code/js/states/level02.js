//---------------------------------------------------------------------//
//Squid Mommie - Beta												   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		level02.js													   //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
var Level02 = function(game) {};
Level02.prototype = {
	//initialize variables for mommie
	init: function(_xpos, _ypos, _count){
		this.xpos = _xpos;
		this.ypos = _ypos;
		this.count = _count;
	},

	create: function() {
		console.log("Level 02");

		//background
		game.stage.backgroundColor = "#2F4F4F";
		game.world.setBounds(0,0, 1600, 1600);
		
		//p2 physics
		game.physics.startSystem(Phaser.Physics.P2JS);
		//added in the desperate attempt to make the map work
	    game.physics.p2.setImpactEvents(true); 
		game.physics.p2.gravity.y = 0;

		//This is for the origional map I made that will probably work for testing.
		this.map = game.add.tilemap('world02');
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
		this.babbies = game.add.group();
		this.spawnBaby(975, 945);
		
		//add player character (mommie)
		this.mommie = new player(game, this.xpos, this.ypos, "MommieSheet", this.babbies, this.count);
		game.add.existing(this.mommie);

		//add babbie followers
		for (var i = 0; i < this.count; i++) {
			this.mommie.attachBaby(this.spawnFollower(this.xpos + 50, this.ypos + 50));
		}

		//adding map forground above mommie
		this.foreground = this.map.createLayer('foreground');
		this.foreground2 = this.map.createLayer('foreground2');

		//camera stuff
		game.camera.follow(this.mommie, Phaser.Camera.FOLLOW_TOPDOWN);
	},
	
	//Play update loop
	update: function() {
		if(this.mommie.body.y >= 1860){
			//console.log("Count: " + this.mommie.getCount());
			
			game.state.start('Level01', true, false, 1150, 90, this.mommie.getCount());

			this.wallLayer.destroy();
			this.backgroundLayer.destroy();
			this.foreground.destroy();
			this.foreground2.destroy();
			this.mommie.destroy();
			this.babbies.destroy();
		}
	},
	
	render: function() {
		//game.debug.cameraInfo(game.camera, 32, 32);
		//game.debug.spriteCoords(this.mommie, 32, 500);
		//game.debug.pointer(game.input.activePointer);
		
		//var zone = this.soundWaveEmitter.area;
		//game.context.fillStyle = "rgba(0,0,255,0.5)";
		//game.context.fillRect(zone.x, zone.y, zone.width, zone.height);
	},
	
	//spawn baby, add to world, add to group
	spawnBaby: function(_x = game.world.centerX, _y = game.world.centerY) {
		var babbie = new babySquid(game, _x, _y, "squid");
		game.add.existing(babbie);
		this.babbies.add(babbie);
	},

	//spawn baby, add to world, return baby
	spawnFollower: function(_x = game.world.centerX, _y = game.world.centerY) {
		var babbie = new babySquid(game, _x, _y, "squid");
		game.add.existing(babbie);
		
		return babbie;
	},
}
//---------------------------------------------------------------------//