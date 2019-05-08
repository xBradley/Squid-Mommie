//---------------------------------------------------------------------//
//Squid Mommie														   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		mommie.js													   //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
function babySquid(_game, _x, _y, _key) {
	Phaser.Sprite.call(this, _game, _x, _y, _key);
	
	this.anchor.setTo(0.5);
	this.scale.setTo(0.1);
	
	game.physics.p2.enable(this, true);
	
	this.body.collideWorldBounds = true;
	this.body.clearShapes();
	this.body.loadPolygon("squidPhysics", "squid", 0.1);
	

}

babySquid.prototype = Object.create(Phaser.Sprite.prototype);
babySquid.prototype.constructor = babySquid;

//---------------------------------------------------------------------//

