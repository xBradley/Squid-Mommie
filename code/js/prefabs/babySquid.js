//---------------------------------------------------------------------//
//Squid Mommie - Beta												   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		babySquid.js												   //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
function babySquid(_game, _x, _y, _key, _lvl, _id) {
	Phaser.Sprite.call(this, _game, _x, _y, _key);
	
	//set size and anchor
	this.anchor.setTo(0.5);
	this.scale.setTo(0.5);
	this.alpha = 0.5;
	
	//p2 physics and collision stuff
	game.physics.p2.enable(this, false);
	this.body.collideWorldBounds = true;
	this.body.clearShapes();
	this.body.addRectangle(10, 30);
	this.body.mass = 0.2;


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

