//---------------------------------------------------------------------//
//Squid Mommie - Beta												   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		player.js													   //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
function player(_game, _x, _y, _key, _babbies, _count) {
	Phaser.Sprite.call(this, _game, _x, _y, _key);

	//Adding Audio Variables
	//quick fix variable to make the swim sfx play at the right time
	this.swish = false;
	this.swim = game.add.audio('swim');
	
	//making lullaby variables
	this.song00 = game.add.audio('sing00');
	this.song01 = game.add.audio('sing01');
	this.song02 = game.add.audio('sing02');
	this.song03 = game.add.audio('sing03');
	this.song04 = game.add.audio('sing04');
	this.song05 = game.add.audio('sing05');
	
	//making cry variables
	this.cry00 = game.add.audio('cry00');
	this.cry01 = game.add.audio('cry01');
	this.cry02 = game.add.audio('cry02');
	this.cry03 = game.add.audio('cry03');
	this.cry04 = game.add.audio('cry04');
	
	//This here is an array of squid mommie lullabys
	this.voices = [this.song00, this.song01, this.song02, this.song03, this.song04, this.song05]; 
	
	//This is an array of squid baby cries
	this.cries = [this.cry00, this.cry01, this.cry02, this.cry03, this.cry04]; 
	
	//set size and anchor
	this.anchor.setTo(0.5);
	this.scale.setTo(0.15);
	this.alpha = 0.50;
	this.animations.add("swim", Phaser.Animation.generateFrameNames("Mom", 1, 12,"", 3), 8, true);
	this.animations.add("float", Phaser.Animation.generateFrameNames("Mom", 1, 12,"", 3), 4, true);
	
	//p2 physics and collision stuff
	game.physics.p2.enable(this, false);
	this.body.collideWorldBounds = true;
	this.body.clearShapes();
	this.body.addCapsule(15, 30);
	this.body.mass = 6;
	this.body.inertia = 0;
	
	//mommie is dead ---- halo stuff
	this.halo = game.add.sprite(_x, _y - 50, "mommieHalo");
	game.physics.p2.enable(this.halo, false);
	this.halo.scale.setTo(0.3);
	this.halo.anchor.setTo(0.5);
	this.halo.alpha = 0.75;
	this.halo.body.clearShapes();
	this.halo.body.addRectangle(10, 30);
	this.halo.body.mass = 0.1;
	game.physics.p2.createLockConstraint(this,this.halo, [-50,-5], 0, 200);

	
	//Soundwave Particle Emitter
	var sLifespan = 2000;
	var sQuanity = 3;
	var sRate = 500;
	this.soundWaveEmitter = game.add.emitter(-300,300);
	this.soundWaveEmitter.makeParticles("soundWave", 0, sQuanity);
	this.soundWaveEmitter.gravity.y = 0;
	this.soundWaveEmitter.setRotation(0,0);
	this.soundWaveEmitter.setXSpeed(0,0);
	this.soundWaveEmitter.setYSpeed(-100,-100);
	this.soundWaveEmitter.setScale(0.5, 6, 0.5, 3, sLifespan);
	this.soundWaveEmitter.setAlpha(1, 0, sLifespan);

	//Radialwave Particle Emitter
	var rLifespan = 1000;
	var rQuanity = 1;
	var rMaxSize = 10;
	var rMinSize = 1;
	var rRate = 100;
	this.radialWaveEmitter = game.add.emitter(-300,300);
	this.radialWaveEmitter.makeParticles("radialWave", 0, rQuanity);
	this.radialWaveEmitter.gravity.y = 0;
	this.radialWaveEmitter.setRotation(0,0);
	this.radialWaveEmitter.setXSpeed(0,0);
	this.radialWaveEmitter.setYSpeed(0,0);
	this.radialWaveEmitter.setScale(rMinSize, rMaxSize, 
		                            rMinSize, rMaxSize, rLifespan);
	this.radialWaveEmitter.setAlpha(1, 0, rLifespan);
	
	//babbies eaten count
	var babbieCount = _count;
	
	//function to count eaten babbies
	this.incrementCount = function() {
		++babbieCount;
	}
	
	//getter function for eaten count 
	this.getCount = function() {
		return babbieCount;
	}

	//get closest baby from player
	this.findNearest = function() {
		return _babbies.getClosestTo(this); 
	}

	//eat baby, increment count, attach to mommie
	this.collectBaby = function(babbie) {
		this.incrementCount();
		_babbies.remove(babbie, false);
		game.add.existing(babbie);

		this.attachBaby(babbie);
	}

	//add constraints to mommie and babbies
	this.attachBaby = function(babbie) {
		//game.physics.p2.createLockConstraint(this,babbie, [50,0], 0, 150);
		game.physics.p2.createDistanceConstraint(this, babbie, 80, [0,0], [0,0],150);
		game.physics.p2.createGearConstraint(this, babbie, 1, 1);
	}

	//mouse controls 
	this.moveToPointerOnClick = function() {
		
		//get angles from mouse and player
		var deltaMouseRad = this.rotation - 
			game.physics.arcade.angleToPointer(this) - 2 * Math.PI;
	
		//clamp range to 2PI to -2PI
		deltaMouseRad %= Math.PI * 2;
		
		//offset by 2PI
		if (deltaMouseRad !=  deltaMouseRad % Math.PI) {
			deltaMouseRad = (deltaMouseRad < 0) 
			? deltaMouseRad + Math.PI * 2 
			: deltaMouseRad - Math.PI * 2;	
		}
		
		//On left mouse click, rotate, move to mouse
		if (game.input.activePointer.leftButton.isDown) {
			//play swim animation
			this.animations.play("swim");
	
			//rotate to mouse direction
			this.body.rotateLeft(50 * deltaMouseRad);
			
			//set world position values
			var mouseWorldPosX = game.input.activePointer.position.x + game.camera.position.x;
			var mouseWorldPosY = game.input.activePointer.position.y + game.camera.position.y;

			//get angle from mouse to player
			var angle = (Math.atan2(mouseWorldPosY - this.position.y, mouseWorldPosX - this.position.x));
		
			//noramlize angle
			angle = Phaser.Math.normalizeAngle(angle);
			
			//move to mouse
			this.body.velocity.x = Math.cos(angle) * 100;
			this.body.velocity.y = Math.sin(angle) * 100;

			//squid sound section
			if (game.input.activePointer.leftButton.justPressed && !this.swish && !this.swim.isPlaying) {
				this.swim.play();
				this.swish = true;
			}
		}
		//Off left mouse click, reset player angle
		else {
			//play float animation
			this.animations.play("float");
			this.swish = false //resetting the variable after the mouse is released
			
			//reset angle to up
			if (Math.floor(this.body.angle + 360) > 275)
				this.body.angle -= 0.5;
			else if (Math.floor(this.body.angle + 360) < 265)
				this.body.angle += 0.5;
			else if (Math.floor(this.body.angle + 360) >= 265 && 
					 Math.floor(this.body.angle + 360) <= 275)
				this.body.angle = 270;
		}
	}

	this.sing = function() {
		var nearest = this.findNearest();    		//finds nearest babbie
		var distance;								//distance variable

		//if nearest is defined, find distance from player to nearest
		//else distance is undefined
		(nearest != null) ? 
			distance = Phaser.Math.distance(this.position.x, 
											this.position.y,
										    nearest.position.x, 
											nearest.position.y)
			: distance = undefined;
		
		//sound arrays
		this.lullaby = this.voices[this.getCount()];
		this.cry = this.cries[this.getCount()];
		
		//Spacebar controls
		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
			//if the player collects all the babies they do their final sing
			if (babbieCount == 5)
				game.state.start("Gameover", true, false);

			//lullaby
			if(!this.lullaby.isPlaying)
				this.lullaby.play();
			
			//emit radialwave on mommie's position
			this.radialWaveEmitter.emitX = this.position.x;
			this.radialWaveEmitter.emitY = this.position.y;
			this.radialWaveEmitter.start(false, rLifespan, rRate, rQuanity);
			
			var angle;
			var far = 400;
			var near = 200;
			//if distance is greater than 400,
			//find angle between player to nearest and make far soundwave
			if (distance >= far) {
				//console.log("Far: " + distance);
				
				//find angle
				angle = Phaser.Math.angleBetweenPoints(this.position, 									  nearest.position);
				
				//convert to degrees and range to [0-360]
				angle = Phaser.Math.radToDeg(Phaser.Math.reverseAngle(angle));
				
				//set sound directions to mommie's position
				var soundDirX = this.position.x;
				var soundDirY = this.position.y;
				if (angle > 225 && angle < 315) {
					//console.log("below");
					
					//adjust y for being at top edge of the screen
					//else move y to bottom edge
					if (game.camera.atLimit.y == true &&
						game.camera.atLimit.x == false )
						soundDirY += 450;
					else
						soundDirY += 350;
					//set x to middle of screen
					soundDirX = game.camera.centerX;
					
					//set soundwave position and angle
					this.soundWaveEmitter.angle = 0;
					this.soundWaveEmitter.emitX = 1 * soundDirX;
					this.soundWaveEmitter.emitY = 1 * soundDirY;
				}
				else if (angle >= 315 && angle <= 360 || 
					     angle >= 0   && angle <= 45) {
					//console.log("left");
					
					//adjust x for being at right edge of the screen
					//else move x to left edge
					if (game.camera.atLimit.x == true)
						soundDirX -= 450;
					else
						soundDirX -= 350;
					//set y to middle of screen
					soundDirY = game.camera.centerY;

					//set soundwave position and angle
					this.soundWaveEmitter.angle = 90;
					this.soundWaveEmitter.emitX =  1 * soundDirY;
					this.soundWaveEmitter.emitY = -1 * soundDirX;
				}
				else if (angle > 45 && angle < 135) {
					//console.log("up");

					//adjust y for being at bottom edge of the screen
					//else move y to top edge
					if (game.camera.atLimit.y == true)
						soundDirY -= 600;
					else
						soundDirY -= 350;
					//set x to middle of screen
					soundDirX = game.camera.centerX;

					//set soundwave position and angle
					this.soundWaveEmitter.angle = 180;
					this.soundWaveEmitter.emitX = -1 * soundDirX;
					this.soundWaveEmitter.emitY = -1 * soundDirY;
				}
				else if (angle >= 135 && angle <= 225) {
					//console.log("right");

					//adjust x for being at left edge of the screen
					//else move x to right edge
					if (game.camera.atLimit.x == true)
						soundDirX += 450;
					else
						soundDirX += 350;
					soundDirY = game.camera.centerY;
					
					//set soundwave position and angle
					this.soundWaveEmitter.angle = 270;
					this.soundWaveEmitter.emitX = -1 * soundDirY;
					this.soundWaveEmitter.emitY =  1 * soundDirX;
				}
				//emit sound waves
				this.soundWaveEmitter.start(false, sLifespan, sRate, sQuanity);
			}
			//if distance is between 200 and 400,
			//find angle between player to nearest and make near soundwave
			else if (distance > near && distance < far) {
				//console.log("Mid: " + distance);

				//find angle
				angle = Phaser.Math.angleBetweenPoints(this.position, 									  nearest.position);
				
				//convert to degrees and range to [0-360]
				angle = Phaser.Math.radToDeg(Phaser.Math.reverseAngle(angle));
				
				//set sound directions to mommie's position
				var soundDirX = nearest.position.x;
				var soundDirY = nearest.position.y;
				if (angle > 225 && angle < 315) {
					//set soundwave position and angle
					this.soundWaveEmitter.angle = 0;
					this.soundWaveEmitter.emitX = 1 * soundDirX;
					this.soundWaveEmitter.emitY = 1 * soundDirY;
				}
				else if (angle >= 315 && angle <= 360 || 
					     angle >= 0   && angle <= 45) {
					//set soundwave position and angle
					this.soundWaveEmitter.angle = 90;
					this.soundWaveEmitter.emitX =  1 * soundDirY;
					this.soundWaveEmitter.emitY = -1 * soundDirX;
				}
				else if (angle > 45 && angle < 135) {
					//set soundwave position and angle
					this.soundWaveEmitter.angle = 180;
					this.soundWaveEmitter.emitX = -1 * soundDirX;
					this.soundWaveEmitter.emitY = -1 * soundDirY;
				}
				else if (angle >= 135 && angle <= 225) {
					//set soundwave position and angle
					this.soundWaveEmitter.angle = 270;
					this.soundWaveEmitter.emitX = -1 * soundDirY;
					this.soundWaveEmitter.emitY =  1 * soundDirX;
				}
				//emit sound waves
				this.soundWaveEmitter.start(false, sLifespan, sRate, sQuanity);
			}
			//if distance is less than 200,
			//find angle between nearest to players, rotate, move babby
			else if(distance <= near) {
				//console.log("Far: " + distance);

				//find angle
				angle = Phaser.Math.angleBetweenPoints(nearest.position, 									   this.position);
				
				//convert to degrees and range to [0-360]
				var direction = Phaser.Math.radToDeg(Phaser.Math.reverseAngle(angle));

				//reset spin and angle
				nearest.body.angularVelocity = 0;
				nearest.body.angle = 0;
				
				//8 way directional movement
				if (direction > 22.5 && direction < 67.5) {
					//console.log("rightDown");
					nearest.body.angle = nearest.body.angle - direction + 360;
				}
				else if (direction >= 67.5 && direction <= 112.5) {
					//console.log("down");
					nearest.body.angle = nearest.body.angle - direction + 90;
				}
				else if (direction > 112.5 && direction < 157.5) {
					//console.log("leftDown");
					nearest.body.angle = nearest.body.angle - direction + 180;
				}
				else if (direction >= 157.5 && direction <= 202.5) {
					//console.log("left");
					nearest.body.angle = nearest.body.angle - direction - 90;
				}
				else if (direction > 202.5 && direction < 247.5) {
					//console.log("leftUp");
					nearest.body.angle = nearest.body.angle - direction - 360
				}
				else if (direction >= 247.5 && direction <= 292.5) {
					//console.log("up");
					nearest.body.angle = nearest.body.angle - direction + 90;
				}
				else if (direction > 292.5 && direction < 337.5) {
					//console.log("rightUp");
					nearest.body.angle = nearest.body.angle - direction - 180
		  		}
				else if (direction >= 337.5 && direction <= 360 ||
						 direction >= 0     && direction <= 22.5) {
					//console.log("right");
					nearest.body.angle = nearest.body.angle - direction - 90;
				}
				
				//move towards player
				nearest.body.force.x = Math.cos(angle) * 1500;
				nearest.body.force.y = Math.sin(angle) * 1500;
			}
		}

		//adding the feedback sound from the babys
		if(this.lullaby.isPlaying && this.lullaby.currentTime >= (this.lullaby.durationMS - 300) && ! this.cry.isPlaying) {
			//console.log("beep beep");
			this.cry.play();	
			
			//eat babby if really close
			//BUG: only works after feedback sounds are done
			//     doesn't work outside of if
			if (distance != undefined && distance <= 125) {
				this.collectBaby(nearest);
			}
		}
	}
}

player.prototype = Object.create(Phaser.Sprite.prototype);
player.prototype.constructor = player;

player.prototype.update = function() {
	
	//player movement
	this.moveToPointerOnClick();

	//singing mechanic
	this.sing();	
}
//---------------------------------------------------------------------//