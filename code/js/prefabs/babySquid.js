//---------------------------------------------------------------------//
//Squid Mommie - Beta												   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		babySquid.js												   //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
function babySquid(_game, _x, _y, _key, _lvl, _id, _size, _alpha, _eaten) {
	Phaser.Sprite.call(this, _game, _x, _y, _key);
	
	//set size and anchor
	this.anchor.setTo(0.5);
	this.scale.setTo(_size);
	this.alpha = _alpha;
	
	//p2 physics and collision stuff
	game.physics.p2.enable(this, false);
	this.body.collideWorldBounds = true;
	this.body.clearShapes();
	this.body.addRectangle(10, 30);
	this.body.mass = 2;


	var bbLifespan = 2000;
	var bbQuanity = 10;
	var bbSizeX = 0.15;
	var bbSizeY = 0.15;
	var bbRate = 1;
	this.bBubbleEmitter = game.add.emitter(-300,300);
	this.bBubbleEmitter.makeParticles("radialWave", 0, bbQuanity);
	this.bBubbleEmitter.gravity.y = -10;
	this.bBubbleEmitter.setSize(bbSizeX, bbSizeY);
	this.bBubbleEmitter.alpha = 1;

	this.die = function() {
		this.bBubbleEmitter.emitX = this.position.x;
		this.bBubbleEmitter.emitY = this.position.y;
		this.bBubbleEmitter.start(false, bbLifespan, bbRate, bbQuanity);
	}

	//Babbie id number
	var levelNumber = _lvl;
	var idNumber = _id;
	this.eaten = _eaten;
	this.mommie = null;
	this.once = false;

	// Define constants that affect motion
	this.SPEED = 120; // missile speed pixels/second
	this.TURN_RATE = 2; // turn rate in degrees/frame
	this.WOBBLE_LIMIT = 30; // degrees
	this.WOBBLE_SPEED = 120; // milliseconds
	this.wobble = this.WOBBLE_LIMIT;

	this.eat = function() {
		this.eaten = true;
	}

	this.setMommie = function(_mommie) {
		this.mommie = _mommie;
	}

	//getter function for id number
	this.getId = function() {
		return idNumber;
	}

	//getter function for id number
	this.getLevel = function() {
		return levelNumber;
	}

	this.followMommie = function() {

		var targetAngle = game.math.angleBetween(
			this.position.x, this.position.y,
			this.mommie.position.x, this.mommie.position.y
		);

		targetAngle += this.game.math.degToRad(this.wobble);

		// Gradually (this.TURN_RATE) aim the missile towards the target angle
		if (this.body.rotation !== targetAngle) {
			// Calculate difference between the current angle and targetAngle
			var delta = targetAngle - this.body.rotation;
	
			// Keep it in range from -180 to 180 to make the most efficient turns.
			if (delta > Math.PI) delta -= Math.PI * 2;
			if (delta < -Math.PI) delta += Math.PI * 2;
	
			if (delta > 0) {
				// Turn clockwise
				this.body.angle += this.TURN_RATE;
			} else {
				// Turn counter-clockwise
				this.body.angle -= this.TURN_RATE;
			}
	
			// Just set angle to target angle if they are close
			if (Math.abs(delta) < this.game.math.degToRad(this.TURN_RATE)) {
				this.body.rotation = targetAngle;
			}
		}
	
		// Calculate velocity vector based on this.rotation and this.SPEED
		this.body.velocity.x = Math.cos(this.body.rotation) * this.SPEED;
		this.body.velocity.y = Math.sin(this.body.rotation) * this.SPEED;
	}
}

babySquid.prototype = Object.create(Phaser.Sprite.prototype);
babySquid.prototype.constructor = babySquid;

babySquid.prototype.update = function() {
	if (this.eaten == true) 
		this.followMommie();
	
	if (this.eaten == true && this.once == false) {
    	this.game.add.tween(this) .to( { 
			wobble: -this.WOBBLE_LIMIT 
		}, this.WOBBLE_SPEED, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.POSITIVE_INFINITY, true );
		this.body.clearShapes();
		this.once = true;
	}
}
//---------------------------------------------------------------------//

