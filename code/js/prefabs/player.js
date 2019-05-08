//---------------------------------------------------------------------//
//Squid Mommie														   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		mommie.js													   //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
function player(_game, _x, _y, _key) {
	Phaser.Sprite.call(this, _game, _x, _y, _key);
	
	this.anchor.setTo(0.5);
	this.scale.setTo(0.3);
	
	game.physics.p2.enable(this, true);
	
	this.body.collideWorldBounds = true;
	this.body.clearShapes();
	this.body.loadPolygon("squidPhysics", "squid", 0.3);
	
	var babbieCount = 0;
	
	this.incrementCount = function() {
		++babbieCount;
	}
	
	this.getCount = function() {
		return babbieCount;
	}
	
	this.moveToPointerOnClick = function() {
		var deltaMouseRad = this.rotation - 
			game.physics.arcade.angleToPointer(this) - Math.PI / 2;
	
		deltaMouseRad %= Math.PI * 2;
		
		if (deltaMouseRad !=  deltaMouseRad % Math.PI) {
			deltaMouseRad = (deltaMouseRad < 0) 
			? deltaMouseRad + Math.PI * 2 
			: deltaMouseRad - Math.PI * 2;	
		}
		
		
		if (game.input.activePointer.leftButton.isDown) {
			this.body.rotateLeft(50 * deltaMouseRad);
			
			var angle = Math.atan2(game.input.y - this.position.y,
				game.input.x - this.position.x);
				
				this.body.force.x = Math.cos(angle) * 50;
				this.body.force.y = Math.sin(angle) * 50;
		}	
		else {
			if (Math.floor(this.body.angle) > 1)
				this.body.angle -= 1;
			else if (Math.floor(this.body.angle) < -1)
				this.body.angle += 1;
			else if (Math.floor(this.body.angle) <= 1 && Math.floor(this.body.angle) >= -1)
				this.body.angle = 0;
			
			//console.log(this.body.angle);
		}
	}
	
	
}

player.prototype = Object.create(Phaser.Sprite.prototype);
player.prototype.constructor = player;

player.prototype.update = function() {
	
	this.moveToPointerOnClick();
	
}
//---------------------------------------------------------------------//




