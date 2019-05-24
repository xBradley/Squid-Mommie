//---------------------------------------------------------------------//
//Squid Mommie - Alpha												   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		play.js													   	   //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
var Level01 = function(game) {};
Level01.prototype = {
	init: function(_xpos, _ypos, _count){
		this.xpos = _xpos;
		this.ypos = _ypos;
		this.count = _count;
	},
	create: function() {

		//background
		game.stage.backgroundColor = "#2F4F4F";
		//game.add.sprite(0,0, "bg");
		
		game.world.setBounds(0,0, 1600, 1600);
		
		//p2 physics
		game.physics.startSystem(Phaser.Physics.P2JS);
	    game.physics.p2.setImpactEvents(true); //added in the desperate attempt to make the map work
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
        
		//End of map creation -Matt
		
		//spawn babbie and add to group (babbies) 
		this.babbies = game.add.group();
		this.spawnBaby(520, 240);
		this.spawnBaby(1528, 1608);
		this.spawnBaby(895, 2795);

		this.frontLayer = this.map.createLayer('foreground'); //I spawn the foreground here so that it covered up the babys

		
		//add player character (mommie)
		this.mommie = new player(game, 90, 205, "squid", this.babbies, this.count);
		game.add.existing(this.mommie);
		this.mommie.body.x = this.xpos;
		this.mommie.body.y = this.ypos;
		
		game.camera.follow(this.mommie, Phaser.Camera.FOLLOW_TOPDOWN);
		
	},
	
	//Play update loop
	update: function() {
		if(this.mommie.body.x <= 30){ //Moving back to level 0 This is kinda buggy rn
			game.state.start('Play', false, false, 1840, 200, this.mommie.getCount());
			this.wallLayer.destroy();
			this.backgroundLayer.destroy();
			this.foreground.destroy();
			this.mommie.destroy();
			this.babbies.destroy();
		}
		else if(this.mommie.body.y <= 30){ //Moving to level 2
			game.state.start('Level02', false, false, 1120, 1825, this.mommie.getCount());
			this.wallLayer.destroy();
			this.backgroundLayer.destroy();
			this.foreground.destroy();
			this.mommie.destroy();
			this.babbies.destroy();
		}
		else if(this.mommie.body.y >= 3170){ //moving to level 3
			game.state.start('Level03', false, false, 320, 70, this.mommie.getCount());
			this.wallLayer.destroy();
			this.backgroundLayer.destroy();
			this.foreground.destroy();
			this.mommie.destroy();
			this.babbies.destroy();
		}
	},
	
	render: function() {
		//game.debug.cameraInfo(game.camera, 32, 32);
		game.debug.spriteCoords(this.mommie, 32, 500);
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