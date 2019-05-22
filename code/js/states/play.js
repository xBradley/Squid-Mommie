//---------------------------------------------------------------------//
//Squid Mommie - Alpha												   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		play.js													   	   //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
var Play = function(game) {};
Play.prototype = {
	//Play screen
	create: function() {
		//console.log("Play");
		//playing main theme
		var theme;
		this.theme = game.add.audio('theme');
		this.theme.loopFull();

		//background
		game.stage.backgroundColor = "#000000";
		//game.add.sprite(0,0, "bg");
		
		game.world.setBounds(0,0, 1600, 1600);
		
		//p2 physics
		game.physics.startSystem(Phaser.Physics.P2JS);
	    game.physics.p2.setImpactEvents(true); //added in the desperate attempt to make the map work
		game.physics.p2.gravity.y = 0;

		//This is for the origional map I made that will probably work for testing.
		this.map = game.add.tilemap('globe');
		this.map.addTilesetImage('ForgottenDungeon', 'dungeon');
		this.map.addTilesetImage('construction_tileset', 'metal');
		this.backgroundLayer = this.map.createLayer('Background');
		this.wallLayer = this.map.createLayer('Walls');
		this.map.setCollisionByExclusion([], true, this.wallLayer);
		this.wallLayer.resizeWorld();

		//adding wall physics
        game.physics.p2.convertTilemap(this.map, this.wallLayer);
        this.wallCollisionsGroup = game.physics.p2.createCollisionGroup();
        var wallBodies = game.physics.p2.convertTilemap(this.map, this.wallLayer);
        
		//End of map creation -Matt
		
		// this.soundWaveEmitter = game.add.emitter(200,200);
		// this.soundWaveEmitter.makeParticles("soundWave", 0, 5);
		// this.soundWaveEmitter.start(false, 5000, 500);
		// this.soundWaveEmitter.gravity.y = 10;
		// let area = new Phaser.Rectangle(this.soundWaveEmitter.area.x, this.soundWaveEmitter.area.y, 0.3, 1);
		// this.soundWaveEmitter.area = area;
		// console.log(this.soundWaveEmitter.area);
		
		//spawn babbie and add to group (babbies) 
		this.babbies = game.add.group();
		this.spawnBaby(1030, 315);
		//this.spawnBaby(1135,1540);
		//this.spawnBaby(621,1530);
		//this.spawnBaby(412,1140);
		
		//add player character (mommie)
		this.mommie = new player(game, 300, 300, "squid", this.babbies);
		game.add.existing(this.mommie);

		//add arrow sprite for guidance 
		this.arrow = game.add.sprite(200, 200, "arrow");
		this.arrow.scale.setTo(0.1);
		this.arrow.kill();
		
		//arrow timer to be killed every 3 seconds
		this.arrowTimer = game.time.create(false);
		this.arrowTimer.loop(3000, function() {this.arrow.kill();}, this);
		this.arrowTimer.start();
		
		game.camera.follow(this.mommie, Phaser.Camera.FOLLOW_TOPDOWN);
		
	},
	
	//Play update loop
	update: function() {
		
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
}
//---------------------------------------------------------------------//