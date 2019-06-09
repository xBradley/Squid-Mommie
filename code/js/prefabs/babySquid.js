//---------------------------------------------------------------------//
//Squid Mommie - Beta												   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		babySquid.js												   //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
function babySquid(_game, _x, _y, _key, _lvl, _id, _size, _alpha) {
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

	//getter function for id number
	this.getId = function() {
		return idNumber;
	}

	//getter function for id number
	this.getLevel = function() {
		return levelNumber;
	}
}

babySquid.prototype = Object.create(Phaser.Sprite.prototype);
babySquid.prototype.constructor = babySquid;
//---------------------------------------------------------------------//

