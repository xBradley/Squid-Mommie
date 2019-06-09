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
	init: function(_xpos, _ypos, _count, _theme, _theme2, _light){
		this.xpos = _xpos;
		this.ypos = _ypos;
		this.count = _count;
		this.theme = _theme;
		this.theme2 = _theme2;
		this.LIGHT_RADIUS = _light;
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
		if(squad[2][0])
			this.spawnBaby(975, 945, "deadBabbie", [2,0]);
		
		//add player character (mommie)
		this.mommie = new player(game, this.xpos, this.ypos, "MommieSheet", this.babbies, this.count, 2, this.LIGHT_RADIUS);
		game.add.existing(this.mommie);

		var followers = [];
		//add babbie followers
		for (var i = 0; i < this.count; i++) {
			var bb = this.spawnFollower(this.xpos + 50, this.ypos + 50, "deadBabbie");
			this.mommie.attachBaby(bb);
			followers.push(bb);
		}
		this.mommie.setFollowers(followers);

		//camera stuff
		game.camera.follow(this.mommie, Phaser.Camera.FOLLOW_TOPDOWN);

		//adding map forground above mommie
		this.foreground = this.map.createLayer('foreground');
		this.foreground2 = this.map.createLayer('foreground2');
	
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
			game.world.bringToTop(this.foreground);
			game.world.bringToTop(this.foreground2);
			game.world.bringToTop(this.lightSprite);
		}


		//switching theme the song for the final goodbye
		if(this.mommie.getCount() == 10 && this.theme2.volume < 0.35){
			console.log(this.theme2.volume);
			this.theme.volume -= .01;
			this.theme2.volume += .01;
		}
		if(this.mommie.body.y >= 1860){
			//console.log("Count: " + this.mommie.getCount());
			
			game.state.start('Level01', true, false, 1150, 90, this.mommie.getCount(), this.theme, this.theme2, this.mommie.getLightRadius());

			this.wallLayer.destroy();
			this.backgroundLayer.destroy();
			this.foreground.destroy();
			this.foreground2.destroy();
			this.mommie.destroy();
			this.babbies.destroy();
		}
		if (game.world.getTop().key == "deadBabbie") {
			console.log(game.world.getTop());
			game.world.bringToTop(this.foreground);
			game.world.bringToTop(this.foreground2);
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
	spawnBaby: function(_x, _y, _sprite, _arr, _size = 0.5, _alpha = 0.5) {
		var babbie = new babySquid(game, _x, _y, _sprite, _arr[0], _arr[1], _size, _alpha);
		game.add.existing(babbie);
		this.babbies.add(babbie);
	},

	//spawn baby, add to world, return baby
	spawnFollower: function(_x, _y, _sprite, _size = 0.5, _alpha = 0.5) {
		var babbie = new babySquid(game, _x, _y, _sprite, null, null, _size, _alpha);
		game.add.existing(babbie);
		
		return babbie;
	},	
}
//---------------------------------------------------------------------//