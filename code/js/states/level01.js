//---------------------------------------------------------------------//
//Squid Mommie - Final												   //
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
		//console.log("Level 01")

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
			this.spawnBaby(3680, 2560, "deadBabbie", [1,0]);
		if(squad[1][1])
			this.spawnBaby(1000, 3000, "deadBabbie", [1,1]);
		
		//add player character (mommie)
		this.mommie = new player(game, this.xpos, this.ypos, "MommieSheet", this.babbies, this.count, 1, this.LIGHT_RADIUS);
		game.add.existing(this.mommie);

		var followers = [];
		//add babbie followers
		for (var i = 0; i < this.count; i++) {
			var bb = this.spawnFollower(this.xpos + game.rnd.integerInRange(10, 50) * i, this.ypos + game.rnd.integerInRange(10, 50) * i, "deadBabbie");
			
			followers.push(bb);
			bb.setMommie(this.mommie);
			//console.log(bb.eaten);
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

		this.alive = [];
		this.wiggle = false;
		this.done = false;
		this.wiggleTime = 0;
		this.blackOut = game.add.sprite(3333 - 750, 3333 - 750, "black");
		this.blackOut.alpha = 0;
	},
	
	//Play update loop
	update: function() {
		this.LIGHT_RADIUS = this.mommie.getLightRadius();
		this.updateShadowTexture();

		if (game.world.getTop().key == "deadBabbie") {
			//console.log(game.world.getTop());
			game.world.bringToTop(this.lightSprite);
		}


		//switching theme the song for the final goodbye
		if(this.mommie.getCount() == 10 && this.theme2.volume < 0.35){
			//console.log(this.theme2.volume);
			this.theme.volume -= .01;
			this.theme2.volume += .01;
		}
		//Moving back to level 0
		if(this.mommie.body.x <= 60){ 
			this.wallLayer.destroy();
			this.backgroundLayer.destroy();
			this.mommie.destroy();
			this.babbies.destroy();

			game.state.start('Level00', true, false, 1680, 5150, this.mommie.getCount(), this.theme, this.theme2, this.mommie.getLightRadius());
		}
		//Moving to level 2
		else if(this.mommie.body.y <= 120 ){
			this.wallLayer.destroy();
			this.backgroundLayer.destroy();
			this.mommie.destroy();
			this.babbies.destroy();

			game.state.start('Level02', true, false, 576, 3020, this.mommie.getCount(), this.theme, this.theme2, this.mommie.getLightRadius());
		} 
		//moving to level 3
		else if(this.mommie.body.y >= 6300){ 
			this.wallLayer.destroy();
			this.grounLayer.destroy();
			this.backgroundLayer.destroy();
			this.mommie.destroy();
			this.babbies.destroy();

			game.state.start('Level03', true, false, 480, 130, this.mommie.getCount(), this.theme, this.theme2, this.mommie.getLightRadius());
		}

		if (game.world.getTop().key == "white" && 
		game.world.getTop().alpha == 1) {
			
			//middle
			if (this.alive.length == 0) {
				this.alive.push(this.spawnFollower(3333, 3333 - 400, "aliveBabbie", 1, 0, false));
				this.alive[0].body.angle = 90;
			

				game.add.tween(this.alive[0].body).to( {
					angle: 270, 
					y: 3333 - 200
				}, 2000, "Linear", true, 6000);

				game.add.tween(this.alive[0]).to( { alpha: 0.8 }, 1000, "Linear", true, 7000);
			}
			
			//top left
			if (this.alive.length == 1) {
				this.alive.push(this.spawnFollower(3333 - 400, 3333 - 350, "aliveBabbie", 1, 0, false));
				this.alive[1].body.angle = 45;

				game.add.tween(this.alive[1].body).to( {
					angle: 270, 
					x: 3333 - 150, 
					y: 3333 - 150, 
				}, 3000, "Linear", true, 6000);
  
				game.add.tween(this.alive[1]).to( { alpha: 0.8 }, 1000, "Linear", true, 7000);
			}
			
			//top right
			if (this.alive.length == 2) {
				this.alive.push(this.spawnFollower(3333 + 300, 3333 - 400, "aliveBabbie", 1, 0, false));
				this.alive[2].body.angle = 135;
				
				game.add.tween(this.alive[2].body).to( {
					angle: 270, 
					x: 3333 + 150, 
					y: 3333 - 150, 
				}, 3000, "Linear", true, 6000);

				game.add.tween(this.alive[2]).to( { alpha: 0.8 }, 1000, "Linear", true, 7000);
			}

			//bottom right
			if (this.alive.length == 3) {
				this.alive.push(this.spawnFollower(3333 + 300, 3333 + 450, "aliveBabbie", 1, 0, false));
				this.alive[3].body.angle = 225;
				
				game.add.tween(this.alive[3].body).to( {
					angle: 270, 
					x: 3333 + 100, 
					y: 3333 + 100, 
				}, 3000, "Linear", true, 6000);

				game.add.tween(this.alive[3]).to( { alpha: 0.8 }, 1000, "Linear", true, 7000);
			}
			
			//bottom left
			if (this.alive.length == 4) {
				this.alive.push(this.spawnFollower(3333 - 400, 3333 +  300, "aliveBabbie", 1, 0, false));
				this.alive[4].body.angle = 315;
				
				game.add.tween(this.alive[4].body).to( {
					angle: 270, 
					x: 3333 - 100, 
					y: 3333 + 100, 
				}, 3000, "Linear", true, 6000);

				game.add.tween(this.alive[4]).to( { alpha: 0.8 }, 1000, "Linear", true, 7000);
			}
			
		}

		if (this.alive.length == 5 && 
		this.wiggle == false && this.done == false &&
		this.alive[0].body.angle + 360 == 270 &&
		this.alive[1].body.angle + 360 == 270 &&
		this.alive[2].body.angle + 360 == 270 &&
		this.alive[3].body.angle + 360 == 270 &&
		this.alive[4].body.angle + 360 == 270) {
	
			
			this.wiggle = true;
			this.done = true;
			this.alive[0].body.rotateRight(25);
			this.alive[1].body.rotateLeft(15);
			this.alive[2].body.rotateRight(35);
			this.alive[3].body.rotateLeft(10);
			this.alive[4].body.rotateRight(20);
		}

		if (this.wiggle == true && this.wiggleTime != 181) {
			if (this.alive[0].body.angle + 360 >= 280) {
				this.alive[0].body.rotateLeft(25);
			}
			else if (this.alive[0].body.angle + 360 <= 260) {
				this.alive[0].body.rotateRight(25);
			}

			if (this.alive[1].body.angle + 360 >= 280) {
				this.alive[1].body.rotateLeft(25);
			}
			else if (this.alive[1].body.angle + 360 <= 260) {
				this.alive[1].body.rotateRight(25);
			}

			if (this.alive[2].body.angle + 360 >= 280) {
				this.alive[2].body.rotateLeft(25);
			}
			else if (this.alive[2].body.angle + 360 <= 260) {
				this.alive[2].body.rotateRight(25);
			}

			if (this.alive[3].body.angle + 360 >= 280) {
				this.alive[3].body.rotateLeft(25);
			}
			else if (this.alive[3].body.angle + 360 <= 260) {
				this.alive[3].body.rotateRight(25);
			}

			if (this.alive[4].body.angle + 360 >= 280) {
				this.alive[4].body.rotateLeft(25);
			}
			else if (this.alive[4].body.angle + 360 <= 260) {
				this.alive[4].body.rotateRight(25);
			}
			++this.wiggleTime;
		}

		if (this.wiggle == true && this.wiggleTime == 180) {

			this.alive[0].body.angularVelocity = 0;
			this.alive[0].body.angle = 270;
	
			this.alive[1].body.angularVelocity = 0;
			this.alive[1].body.angle = 270;

			this.alive[2].body.angularVelocity = 0;
			this.alive[2].body.angle = 270;

			this.alive[3].body.angularVelocity = 0;
			this.alive[3].body.angle = 270;

			this.alive[4].body.angularVelocity = 0;
			this.alive[4].body.angle = 270;

			if (this.alive[0].body.angle + 360 == 270 &&
			this.alive[1].body.angle + 360 == 270 &&
			this.alive[2].body.angle + 360 == 270 &&
			this.alive[3].body.angle + 360 == 270 &&
			this.alive[4].body.angle + 360 == 270) {
				

				for (let i = 0; i < this.alive.length; ++i) {
					this.alive[i].eat();
				}

				this.wiggle = false;
				this.mommie.die();
			}
		}
		
		if (this.mommie.alpha < 0.2) {
			game.world.bringToTop(this.blackOut);
			game.add.tween(this.blackOut).to( { alpha: 1}, 1000, "Linear", true);
		}

		if (this.blackOut.alpha >= 0.95) {
			game.input.enabled = true;
			game.state.start('Gameover', true, true);
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