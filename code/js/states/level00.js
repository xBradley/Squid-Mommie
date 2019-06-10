//---------------------------------------------------------------------//
//Squid Mommie - Final												   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		level00.js													   //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
var Level00 = function(game) {};
Level00.prototype = {
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
		//console.log("Level 00");

		//background
		game.stage.backgroundColor = "#1d232f";	
		game.world.setBounds(0,0, 1600, 1600);
		
		//p2 physics
		game.physics.startSystem(Phaser.Physics.P2JS);
		//added in the desperate attempt to make the map work
	    game.physics.p2.setImpactEvents(true); 
		game.physics.p2.gravity.y = 0;
		game.physics.p2.TILE_BIAS = 500;


		//This is for the original map I made that will probably work for testing.
		this.map = game.add.tilemap('world00');
		this.map.addTilesetImage('slopes', 'slopes');
		this.map.addTilesetImage('ground', 'ground')
		this.groundLayer = this.map.createLayer('ground');
		this.backgroundLayer = this.map.createLayer('background');
		this.wallLayer = this.map.createLayer('Walls');
		this.map.setCollisionByExclusion([], true, this.wallLayer);
		this.wallLayer.resizeWorld();

		//adding wall physics
        game.physics.p2.convertTilemap(this.map, this.wallLayer);
        this.wallCollisionsGroup = game.physics.p2.createCollisionGroup();
        this.wallBodies = game.physics.p2.convertTilemap(this.map, this.wallLayer);

		//spawn babbie and add to group (babbies) 
		this.babbies = game.add.group();
		if(squad[0][0])
			this.spawnBaby(1552, 100, "deadBabbie", [0,0]);
		if(squad[0][1])
			this.spawnBaby(1700, 2200, "deadBabbie", [0,1]);
		if(squad[0][2])
			this.spawnBaby(1345, 3010, "deadBabbie", [0,2]);
		if(squad[0][3])
			this.spawnBaby(1600, 4800, "deadBabbie", [0,3]);

		//add player character (mommie)
		this.mommie = new player(game, this.xpos, this.ypos, "MommieSheet", this.babbies, this.count, 0, this.LIGHT_RADIUS);
		game.add.existing(this.mommie);
		
		var followers = [];
		//add babbie followers
		for (var i = 0; i < this.count; i++) {
			
			var bb = this.spawnFollower(this.xpos + game.rnd.integerInRange(10, 50) * i, this.ypos + game.rnd.integerInRange(10, 50) * i, "deadBabbie");
			
			followers.push(bb);
			bb.setMommie(this.mommie);
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

		//Move Tutorial Text
		this.moveTutorial = game.add.text(this.mommie.position.x - 85, this.mommie.position.y - 100, "Hold Left Mouse to move me", {
			fontSize: "14px", 
			fill: "#fff",
			font: "Courgette", 
			stroke: "#000",
			strokeThickness: 2,
			}
		);
		this.moveTutorial.alpha = 0;

		//Sing Tutorial Text
		this.singTutorial = game.add.text(this.mommie.position.x - 120, this.mommie.position.y - 100, "Press Spacebar to Sing to call my babbies", {
			fontSize: "14px", 
			fill: "#fff",
			font: "Courgette", 
			stroke: "#000",
			strokeThickness: 2,
			}
		);
		this.singTutorial.alpha = 0;
	},
	
	//Play update loop
	update: function() {
		this.LIGHT_RADIUS = this.mommie.getLightRadius();
		this.updateShadowTexture();

		if (game.world.getTop().key == "deadBabbie") {
			//console.log(game.world.getTop());
			game.world.bringToTop(this.lightSprite);
			game.world.bringToTop(this.moveTutorial);
			game.world.bringToTop(this.singTutorial);
		}

		//switching theme the song for the final goodbye
		if(this.mommie.getCount() == 10 && this.theme2.volume < 0.35){
			//console.log(this.theme2.volume);
			this.theme.volume -= .01;
			this.theme2.volume += .01;
		}

		//Move Tutorial Text
		//******************************************************//
		if (tutorial[0] == true) {
			//Fade in and Follow player
			if (this.moveTutorial.alive == true &&
			this.moveTutorial.alpha <= 0.9      && 
			this.moveTutorial.position.x <= 1000) {
			
				this.moveTutorial.position.x = this.mommie.position.x - 85;
				this.moveTutorial.position.y = this.mommie.position.y - 100;
				this.moveTutorial.alpha += 0.01;
			}
			//After fade, follow player
			else if (this.moveTutorial.alive == true &&
			this.moveTutorial.alpha > 0.9            && 
			this.moveTutorial.position.x <= 1000) {
			
				this.moveTutorial.position.x = this.mommie.position.x - 85;
				this.moveTutorial.position.y = this.mommie.position.y - 100;
			}
			//After moving so far, fade out text
			else if (this.moveTutorial.alive == true &&
			this.moveTutorial.position.x >= 1000      && 
			this.moveTutorial.alpha >= 0.1) {
			
				this.moveTutorial.alpha -= 0.01;
			}
			//After fade, kill text
			else if (this.moveTutorial.alive == true &&
			this.moveTutorial.position.x >= 1000      && 
			this.moveTutorial.alpha < 0.1) {
			
				this.moveTutorial.destroy();
				this.moveTutorial.alpha = 0;
				tutorial[0] = false;
			}
		}
		//******************************************************//

		//Sing Tutorial Text
		//******************************************************//
		if (tutorial[1] == true) {
			//Fade in text and follow player
			if (this.moveTutorial.alive == false &&
			this.singTutorial.alive == true      && 
			this.singTutorial.alpha <= 0.9       &&
			this.singTutorial.position.y <= 666) {
			
				this.singTutorial.position.x = this.mommie.position.x - 120;
				this.singTutorial.position.y = this.mommie.position.y - 100;
				this.singTutorial.alpha += 0.01
			}
			//After fade is done, just follow player
			else if (this.moveTutorial.alive == false &&
			this.singTutorial.alive == true           && 
			this.singTutorial.alpha > 0.9             &&
			this.singTutorial.position.y <= 666) {
			
				this.singTutorial.position.x = this.mommie.position.x - 120;
				this.singTutorial.position.y = this.mommie.position.y - 100;
			}
			//After moving so far, fade out text, stop following player
			else if (this.moveTutorial.alive == false &&
			this.singTutorial.alive == true           && 
			this.singTutorial.alpha >= 0.1            &&
			this.singTutorial.position.y > 666) {
				
				this.singTutorial.alpha -= 0.01;
			}
			//After Fade out, kill text
			else if (this.moveTutorial.alive == false &&
			this.singTutorial.alive == true           && 
			this.singTutorial.alpha < 0.1             &&
			this.singTutorial.position.y > 666) {
			
				this.singTutorial.alpha = 0;
				this.singTutorial.destroy();
				tutorial[1] = false;
			}
		}
		
		
		//******************************************************//
		
		//Path to Level 01
		if(this.mommie.body.x >= 1845){		
			this.wallLayer.destroy();
			this.groundLayer.destroy();
			this.backgroundLayer.destroy();
			this.mommie.destroy();
			this.babbies.destroy();

			game.state.start('Level01', true, false, 160, 350, this.mommie.getCount(), this.theme, this.theme2, this.mommie.getLightRadius());
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
		this.shadowTexture.context.fillStyle = 'rgb(25, 25, 25)';
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
		babbie.body.angle = 270;
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