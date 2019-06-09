//---------------------------------------------------------------------//
//Squid Mommie - Beta												   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		player.js													   //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
function player(_game, _x, _y, _key, _babbies, _count, _lvl, _light) {
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
	this.song06 = game.add.audio('sing06');
	this.song07 = game.add.audio('sing07');
	this.song08 = game.add.audio('sing08');
	this.song09 = game.add.audio('sing09');
	this.song10 = game.add.audio('sing10');	

	//making cry variables
	this.cry00 = game.add.audio('cry00');
	this.cry01 = game.add.audio('cry01');
	this.cry02 = game.add.audio('cry02');
	this.cry03 = game.add.audio('cry03');
	this.cry04 = game.add.audio('cry04');
	this.cry05 = game.add.audio('cry05');
	this.cry06 = game.add.audio('cry06');
	this.cry07 = game.add.audio('cry07');
	this.cry08 = game.add.audio('cry08');
	this.cry09 = game.add.audio('cry09');
	this.cry10 = game.add.audio('cry10');

	
	//This here is an array of squid mommie lullabys
	this.voices = [this.song00, this.song01, this.song02, this.song03, this.song04, this.song05, this.song06, this.song07, this.song08, this.song09, this.song10]; 
	
	//This is an array of squid baby cries
	this.cries = [this.cry00, this.cry01, this.cry02, this.cry03, this.cry04, this.cry05, this.cry06, this.cry07, this.cry08, this.cry09, this.cry10]; 
	
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


	var bLifespan = 3000;
	var bQuanity = 100;
	var bSizeX = 0.5;
	var bSizeY = 0.5;
	var bRate = 25;
	this.bubbleEmitter = game.add.emitter(-300,300);
	this.bubbleEmitter.makeParticles("radialWave", 0, bQuanity);
	this.bubbleEmitter.gravity.y = -10;
	this.bubbleEmitter.setSize(bSizeX, bSizeY);
	this.bubbleEmitter.alpha = 1;
	
	//babbies eaten count
	var babbieCount = _count;
	var levelNumber = _lvl;
	var lightRadius = _light;
	var followers = [];
	this.dying = false;


	this.getFollowers = function() {
		return followers;
	}

	this.setFollowers = function(bb) {
		followers = bb; 
	}

	this.getLightRadius = function() {
		return lightRadius;
	}

	this.incrementLight = function() {
		lightRadius += 25;
	}
	
	this.die = function() {
		
		this.bubbleEmitter.emitX = this.position.x;
		this.bubbleEmitter.emitY = this.position.y;
		this.bubbleEmitter.start(false, bLifespan, bRate, bQuanity);

		game.add.tween(this).to( {
			alpha: 0, 
		}, 2000, "Linear", true, 1000);

		game.add.tween(this.halo).to( {
			alpha: 0, 
		}, 2000, "Linear", true, 1000);
		
		for (var i = 0; i < followers.length; ++i) {
			followers[i].die();
			game.add.tween(followers[i]).to( {
				alpha: 0, 
			}, 2000, "Linear", true, 1000);
		}
	}


	//function to count eaten babbies
	this.incrementCount = function() {
		++babbieCount;
	}
	
	//getter function for eaten count 
	this.getCount = function() {
		return babbieCount;
	}

	//getter function for which level mommie is in 
	this.getLevel = function() {
		return levelNumber;
	}

	this.checkLevelBabbie = function(level) {
		for (var i = 0; i < level.length; ++i) {
			if (level[i] == true)
				return true;
		}

	}

	//get closest baby from player
	this.findNearest = function() {
		var nearestBabbie = _babbies.getClosestTo(this); 
		var nearestArea = { 
			position: new Phaser.Point(), 
			body: null,
		};

		
		if (nearestBabbie == null) {
			
			var possibleLevels = [];
			for (var i = 0; i < squad.length; ++i) {
				if (this.checkLevelBabbie(squad[i]))
					possibleLevels.push(i);
			}

			//console.log(possibleLevels);

			if (this.getLevel() == 0) {
				nearestArea.position = guide[0][1];
			}
			else if (this.getLevel() == 1) {
				if (possibleLevels.length > 0) {
					nearestArea.position = guide[1][possibleLevels[0]];
					var min = Phaser.Math.distance(this.position.x,
											this.position.y,
											nearestArea.position.x,
											nearestArea.position.y);
				
				
					for (var i = 1; i < possibleLevels.length; ++i) {
						let temp = Phaser.Math.distance(this.position.x,
												this.position.y,
												guide[1][possibleLevels[i]].x,
												guide[1][possibleLevels[i]].y)
						if (min > temp) {
							min = temp;
							nearestArea.position = guide[1][possibleLevels[i]];
						}
					}
				}
				else
					nearestArea.position = guide[1][3];
			}
			else if (this.getLevel() == 2) {
				nearestArea.position = guide[2][1];
			}
			else if (this.getLevel() == 3) {
				if (possibleLevels.length > 0)
					nearestArea.position = guide[3][1];
				else {
					nearestArea.position.x = 2420;
					nearestArea.position.y = 666;
				}
			}
			return nearestArea;
		}
		return nearestBabbie;
	}

	//eat baby, increment count, attach to mommie
	this.collectBaby = function(babbie) {
		this.incrementCount();
		_babbies.remove(babbie, false);
		squad[babbie.getLevel()][babbie.getId()] = false;
		
		game.add.existing(babbie);
		babbie.setMommie(this);
		babbie.eat();
		
		
		this.incrementLight();
	}

	//add constraints to mommie and babbies
	this.attachBaby = function(babbie) {
		
		game.physics.p2.createDistanceConstraint(this, babbie, 80, [0,0], [0,0],666);
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
		distance = Phaser.Math.distance(this.position.x, this.position.y,
										nearest.position.x, nearest.position.y)
		: distance = undefined;
		
		//sound arrays
		this.lullaby = this.voices[this.getCount()];
		this.cry = this.cries[this.getCount()];
		
		var far = 450;
		var near = 200;
		var touch = 75;
		//Spacebar controls
		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {

			//lullaby
			if(!this.lullaby.isPlaying)
				this.lullaby.play();
			
			//emit radialwave on mommie's position
			this.radialWaveEmitter.emitX = this.position.x;
			this.radialWaveEmitter.emitY = this.position.y;
			this.radialWaveEmitter.start(false, rLifespan, rRate, rQuanity);
			game.world.bringToTop(this.soundWaveEmitter);
			
			var angle;
			//if distance is greater than 400,
			//find angle between player to nearest and make far soundwave
			if (distance >= far) {
				//console.log("Far: " + distance);
				
				//find angle
				angle = Phaser.Math.angleBetweenPoints(this.position,		 									nearest.position);

				//convert to degrees and range to [0-360]
				angle = Phaser.Math.radToDeg(Phaser.Math.reverseAngle(angle));
				
				//set sound directions to mommie's position
				var soundDirX = this.position.x;
				var soundDirY = this.position.y;
				if (angle > 225 && angle < 315) {
					//console.log("below");
					
					//adjust y for being at top edge of the screen
					//else move y to bottom edgej
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
					//console.log("above");

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
				game.world.bringToTop(this.soundWaveEmitter);
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
				game.world.bringToTop(this.soundWaveEmitter);
				this.soundWaveEmitter.start(false, sLifespan, sRate, sQuanity);
			}
			//if distance is less than 200,
			//find angle between player to nearest and make near soundwave
			else if(distance <= near && nearest.body == null) {
				//console.log("Near: " + distance);
				if (babbieCount == 10) {
					this.dying = true;
					game.input.enabled = false;
					var whiteOut = game.add.sprite(2420 - 900, 0, "white");
					whiteOut.alpha = 0;

					game.add.tween(whiteOut).to( { alpha: 1}, 1000, "Linear", true);

					game.input.activePointer.resetButtons();
				
					game.add.tween(this.body).to( {angle: 270, x: 2360,y: 646}, 2000, "Linear", true, 1000);
					
					this.body.velocity.x = 0;
					this.body.velocity.y = 0;
					this.body.dynamic = false;

					game.add.tween(whiteOut).from( { alpha: 1}, 4000, "Linear", true, 4000);
				}
				else {
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
					game.world.bringToTop(this.soundWaveEmitter);
					this.soundWaveEmitter.start(false, sLifespan, sRate, sQuanity);
				}
			}
			//if distance is less than 200,
			//find angle between nearest to players, rotate, move babby
			else if(distance <= near && nearest.body != null) {
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
					nearest.body.angle = nearest.body.angle - direction - 90;
				}
				else if (direction >= 67.5 && direction <= 112.5) {
					//console.log("down");
					nearest.body.angle = nearest.body.angle - direction + 360;
				}
				else if (direction > 112.5 && direction < 157.5) {
					//console.log("leftDown");
					nearest.body.angle = nearest.body.angle - direction + 90;
				}
				else if (direction >= 157.5 && direction <= 202.5) {
					//console.log("left");
					nearest.body.angle = nearest.body.angle - direction + 180;
				}
				else if (direction > 202.5 && direction < 247.5) {
					//console.log("leftUp");
					nearest.body.angle = nearest.body.angle - direction - 90;
				}
				else if (direction >= 247.5 && direction <= 292.5) {
					//console.log("up");
					nearest.body.angle = nearest.body.angle - direction - 360;
				}
				else if (direction > 292.5 && direction < 337.5) {
					//console.log("rightUp");
					nearest.body.angle = nearest.body.angle - direction + 90;
		  		}
				else if (direction >= 337.5 && direction <= 360 ||
						 direction >= 0     && direction <= 22.5) {
					//console.log("right");
					nearest.body.angle = nearest.body.angle - direction - 180;
				}
				
				//move towards player
				nearest.body.velocity.x = Math.cos(angle) * 200;
				nearest.body.velocity.y = Math.sin(angle) * 200;
			}
		}

		//This will collect the baby if squid mommie is close by.
		// if (distance != undefined && distance <= touch && this.lullaby.isPlaying && nearest.body != null) {
			
		// 	this.collectBaby(nearest);
		// }
		
		//adding the feedback sound from the babys
		if(this.lullaby.isPlaying && 
		this.lullaby.currentTime >= (this.lullaby.durationMS - 50) && 
		!this.cry.isPlaying) {
			
			this.cry.play();		
		}

		if (distance != undefined && distance <= touch && nearest.body != null) {
			//console.log("eaten");
			this.collectBaby(nearest);
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

	if (this.dying == true)
		game.camera.focusOn(this);
	
}
//---------------------------------------------------------------------//