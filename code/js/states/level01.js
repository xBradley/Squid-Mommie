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
	init: function(_xpos, _ypos, _count, _theme, _theme2, _light){
		this.xpos = _xpos;
		this.ypos = _ypos;
		this.count = _count;
		this.theme = _theme;
		this.theme2 = _theme2;
		this.LIGHT_RADIUS = _light;
	},

	create: function() {
		console.log("Level 01")

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
		this.babbies = game.add.group();
		if(squad[1][0])
			this.spawnBaby(520, 240, "deadBabbie", [1,0]);

		if(squad[1][1])
			this.spawnBaby(1528, 1608, "deadBabbie", [1,1]);

		if(squad[1][2])	
			this.spawnBaby(895, 2795, "deadBabbie", [1,2]);
			
		if(squad[1][3])	
			this.spawnBaby(224, 690, "deadBabbie", [1,3]);

		//I spawn the foreground here so that it covered up the babys
		this.foreground = this.map.createLayer('foreground');

		//add player character (mommie)
		this.mommie = new player(game, this.xpos, this.ypos, "MommieSheet", this.babbies, this.count, 1, this.LIGHT_RADIUS);
		game.add.existing(this.mommie);

		var followers = [];
		//add babbie followers
		for (var i = 0; i < this.count; i++) {
			var bb = this.spawnFollower(this.xpos + (i*20), this.ypos + (i*20), "deadBabbie");
			
			followers.push(bb);
			bb.setMommie(this.mommie);
			console.log(bb.eaten);
		}
		this.mommie.setFollowers(followers);
		
		//camera stuff
		game.camera.follow(this.mommie, Phaser.Camera.FOLLOW_TOPDOWN);
	
		// Create the shadow texture
		this.shadowTexture = this.game.add.bitmapData(game.width + 600, game.height + 600);
		
		// Create an object that will use the bitmap as a texture
		this.lightSprite = this.game.add.image(0, 0, this.shadowTexture);

		// Set the blend mode to MULTIPLY. This will darken the colors of
    	// everything below this sprite.
		this.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
		this.lightSprite.anchor.setTo(0.5);
	},
	
	//Play update loop
	update: function() {
		this.LIGHT_RADIUS = this.mommie.getLightRadius();
		this.updateShadowTexture();

		if (game.world.getTop().key == "deadBabbie") {
			console.log(game.world.getTop());
			game.world.bringToTop(this.lightSprite);
		}


		//switching theme the song for the final goodbye
		if(this.mommie.getCount() == 10 && this.theme2.volume < 0.35){
			console.log(this.theme2.volume);
			this.theme.volume -= .01;
			this.theme2.volume += .01;
		}
		//Moving back to level 0
		if(this.mommie.body.x <= 60){ 
			//console.log("Count: " + this.mommie.getCount());

			game.state.start('Level00', true, false, 1820, 200, this.mommie.getCount(), this.theme, this.theme2, this.mommie.getLightRadius());

		
			this.wallLayer.destroy();
			this.backgroundLayer.destroy();
			this.foreground.destroy();
			this.mommie.destroy();
			this.babbies.destroy();
		}
		//Moving to level 2
		else if(this.mommie.body.y <= 60){
			//console.log("Count: " + this.mommie.getCount());

			game.state.start('Level02', true, false, 1120, 1805, this.mommie.getCount(), this.theme, this.theme2, this.mommie.getLightRadius());

			this.wallLayer.destroy();
			this.backgroundLayer.destroy();
			this.foreground.destroy();
			this.mommie.destroy();
			this.babbies.destroy();
		}
		//moving to level 3
		else if(this.mommie.body.y >= 3110){ 
			//console.log("Count: " + this.mommie.getCount());

			game.state.start('Level03', true, false, 320, 90, this.mommie.getCount(), this.theme, this.theme2, this.mommie.getLightRadius());

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
		//game.debug.pointer(game.input.activePointer);
		
		//var zone = this.soundWaveEmitter.area;
		//game.context.fillStyle = "rgba(0,0,255,0.5)";
		//game.context.fillRect(zone.x, zone.y, zone.width, zone.height);
	},

	updateShadowTexture: function() {	
		// Draw shadow
		this.shadowTexture.context.fillStyle = 'rgb(50, 50, 50)';
		this.shadowTexture.context.fillRect(0, 0, game.width + 600, game.height + 600);
	
		// Draw circle of light with a soft edge
		var gradient = this.shadowTexture.context.createRadialGradient(
			game.width, game.height, this.LIGHT_RADIUS * 0.75, game.width, game.height, this.LIGHT_RADIUS);
		gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
		gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

		this.shadowTexture.context.beginPath();
		this.shadowTexture.context.fillStyle = gradient;
		this.shadowTexture.context.arc(game.width, game.height, this.LIGHT_RADIUS, 0, Math.PI*2);
		this.shadowTexture.context.fill();
	
		// This just tells the engine it should update the texture cache
		this.shadowTexture.dirty = true;
	   
		this.lightSprite.position.x = this.mommie.x;  
		this.lightSprite.position.y = this.mommie.y;
	},
	
	//spawn baby, add to world, add to group
	spawnBaby: function(_x, _y, _sprite, _arr, _size = 0.5, _alpha = 0.5, _eaten = false) {
		var babbie = new babySquid(game, _x, _y, _sprite, _arr[0], _arr[1], _size, _alpha, _eaten);
		game.add.existing(babbie);
		this.babbies.add(babbie);
	},

	//spawn baby, add to world, return baby
	spawnFollower: function(_x, _y, _sprite, _size = 0.5, _alpha = 0.5, _eaten = true) {
		var babbie = new babySquid(game, _x, _y, _sprite, null, null, _size, _alpha, _eaten);
		game.add.existing(babbie);
		
		return babbie;
	},
}
//---------------------------------------------------------------------//