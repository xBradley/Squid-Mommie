//---------------------------------------------------------------------//
//Squid Mommie - Beta												   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		babySquid.js												   //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
function babySquid(_game, _x, _y, _key) {
	Phaser.Sprite.call(this, _game, _x, _y, _key);
	
	//set size and anchor
	this.anchor.setTo(0.5);
	this.scale.setTo(0.1);
	
	//p2 physics and collision stuff
	game.physics.p2.enable(this, true);
	this.body.collideWorldBounds = false;
	this.body.clearShapes();
	this.body.loadPolygon("squidPhysics", "squid", 0.1);
	this.body.mass = 0.2;
}

babySquid.prototype = Object.create(Phaser.Sprite.prototype);
babySquid.prototype.constructor = babySquid;
//---------------------------------------------------------------------//

