//---------------------------------------------------------------------//
//Squid Mommie - Alpha												   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		player.js													   //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
function player(_game, _x, _y, _key, _babbies) {
	Phaser.Sprite.call(this, _game, _x, _y, _key);

	//Adding Audio Variables
	this.swish = false; //quick fix variable to make the swim sfx play at the right time
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
	this.voices = [this.song00, this.song01, this.song02, this.song03, this.song04, this.song05]; //This here is an array of squid mommie lullabys
	this.cries = [this.cry00, this.cry01, this.cry02, this.cry03, this.cry04]; //This is an array of squid baby cries
	
	//set size and anchor
	this.anchor.setTo(0.5);
	this.scale.setTo(0.3);
	
	//p2 physics and collision stuff
	game.physics.p2.enable(this, true);
	this.body.collideWorldBounds = true;
	this.body.clearShapes();
	this.body.loadPolygon("squidPhysics", "squid", 0.3);

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
	var babbieCount = 0;
	
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

	//eat baby, increment count
	this.collectBaby = function(babbie) {
			babbie.destroy();
			this.incrementCount();
	}

	//mouse controls 
	this.moveToPointerOnClick = function() {
		
		//get angles from mouse and player
		var deltaMouseRad = this.rotation - 
			game.physics.arcade.angleToPointer(this) - Math.PI / 2;
	
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
			//rotate to mouse direction
			this.body.rotateLeft(50 * deltaMouseRad);
			
			var mouseWorldPosX = game.input.activePointer.position.x + game.camera.position.x;
			var mouseWorldPosY = game.input.activePointer.position.y + game.camera.position.y;

			//get angle from mouse to player
			var angle = (Math.atan2(mouseWorldPosY - this.position.y, mouseWorldPosX - this.position.x));
		
		
			//noramlize angle
			angle = Phaser.Math.normalizeAngle(angle);
			
			// console.log("Angle: " + angle);
			// console.log("MouseX: " + mouseWorldPosX);
			// console.log("MouseY: " + mouseWorldPosY);
			// console.log("Player: " + this.position.y);
			
			//move to mouse
			this.body.force.x = Math.cos(angle) * 100;
			this.body.force.y = Math.sin(angle) * 100;

			//squid sound section
			if (game.input.activePointer.leftButton.justPressed && !this.swish) {
				console.log('swish swish');
				this.swim.play();
				this.swish = true;
			}
		}
		//Off left mouse click, reset player angle
		else {
			this.swish = false //resetting the variable after the mouse is released
			if (Math.floor(this.body.angle) > 1)
				this.body.angle -= 1;
			else if (Math.floor(this.body.angle) < -1)
				this.body.angle += 1;
			else if (Math.floor(this.body.angle) <= 1 && 
			         Math.floor(this.body.angle) >= -1)
				this.body.angle = 0;
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
		
		//Spacebar controls
		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
			//if no babbies are alive do final sing
			if (_babbies.countLiving() == 0)
				game.state.start("Gameover", true, false);
			
			this.radialWaveEmitter.emitX = this.position.x;
			this.radialWaveEmitter.emitY = this.position.y;
			this.radialWaveEmitter.start(false, rLifespan, rRate, rQuanity);
			
			var angle;
			//if distance is greater than 400,
			//find angle between player to nearest 
			if (distance >= 400) {
				console.log(distance);
				angle = Phaser.Math.angleBetweenPoints(this.position, 									  nearest.position);
				
				angle = Phaser.Math.radToDeg(Phaser.Math.reverseAngle(angle));
				
				//console.log(game.camera.atLimit);
				//console.log(this.position.x);
				//console.log(this.position.y);
				var soundDirX = this.position.x;
				var soundDirY = this.position.y;
				if (angle > 225 && angle < 315) {
					console.log("above");
					if (game.camera.atLimit.y == true &&
						game.camera.atLimit.x == false )
						soundDirY += 450;
					else
						soundDirY += 350;
					
					//soundDirX = nearest.position.x;
					this.soundWaveEmitter.angle = 0;
					this.soundWaveEmitter.emitX = 1 * soundDirX;
					this.soundWaveEmitter.emitY = 1 * soundDirY;
				}
				else if (angle >= 315 && angle <= 360 || 
					     angle >= 0   && angle <= 45) {
					console.log("right");
					soundDirX -= 350;
					this.soundWaveEmitter.angle = 90;
					this.soundWaveEmitter.emitX =  1 * soundDirY;
					this.soundWaveEmitter.emitY = -1 * soundDirX;
				}
				else if (angle > 45 && angle < 135) {
					console.log("below");
					if (game.camera.atLimit.y == true)
						soundDirY -= 600;
					else
						soundDirY -= 350;
					
					this.soundWaveEmitter.angle = 180;
					this.soundWaveEmitter.emitX = -1 * soundDirX;
					this.soundWaveEmitter.emitY = -1 * soundDirY;
				}
				else if (angle >= 135 && angle <= 225) {
					console.log("left");
					soundDirX += 350;
					//soundDirY = nearest.position.y;
					this.soundWaveEmitter.angle = 270;
					this.soundWaveEmitter.emitX = -1 * soundDirY;
					this.soundWaveEmitter.emitY =  1 * soundDirX;
				}
				this.soundWaveEmitter.start(false, sLifespan, sRate, sQuanity);
				
			}
			else if (distance > 200 && distance < 400) {
				console.log(distance);
				angle = Phaser.Math.angleBetweenPoints(this.position, 									  nearest.position);
				
				angle = Phaser.Math.radToDeg(Phaser.Math.reverseAngle(angle));
				
				var soundDirX = nearest.position.x;
				var soundDirY = nearest.position.y;
				if (angle > 225 && angle < 315) {
					this.soundWaveEmitter.angle = 0;
					this.soundWaveEmitter.emitX = 1 * soundDirX;
					this.soundWaveEmitter.emitY = 1 * soundDirY;
				}
				else if (angle >= 315 && angle <= 360 || 
					     angle >= 0   && angle <= 45) {
					this.soundWaveEmitter.angle = 90;
					this.soundWaveEmitter.emitX =  1 * soundDirY;
					this.soundWaveEmitter.emitY = -1 * soundDirX;
				}
				else if (angle > 45 && angle < 135) {
					this.soundWaveEmitter.angle = 180;
					this.soundWaveEmitter.emitX = -1 * soundDirX;
					this.soundWaveEmitter.emitY = -1 * soundDirY;
				}
				else if (angle >= 135 && angle <= 225) {
					this.soundWaveEmitter.angle = 270;
					this.soundWaveEmitter.emitX = -1 * soundDirY;
					this.soundWaveEmitter.emitY =  1 * soundDirX;
				}
				this.soundWaveEmitter.start(false, sLifespan, sRate, sQuanity);
			}
			//if distance is less than 200,
			//find angle between nearest to players
			else if(distance <= 200) {
				//console.log(nearest);
				angle = Phaser.Math.angleBetweenPoints(nearest.position, 									   this.position);
				//move towards player
				nearest.body.force.x = Math.cos(angle) * 10000;
				nearest.body.force.y = Math.sin(angle) * 10000;
			}
			
		}
		
		//if distance is less than 50, eat baby
		if (distance != undefined && distance <= 50) 
			this.collectBaby(nearest);
	}
	
	
}

player.prototype = Object.create(Phaser.Sprite.prototype);
player.prototype.constructor = player;

player.prototype.update = function() {
	
	this.moveToPointerOnClick();

	this.sing();	
	
}
//---------------------------------------------------------------------//




