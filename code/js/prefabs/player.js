//---------------------------------------------------------------------//
//Squid Mommie														   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		mommie.js													   //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
function player(_game, _x, _y, _key) {
	Phaser.Sprite.call(this, _game, _x, _y, _key);
	
	//set size and anchor
	this.anchor.setTo(0.5);
	this.scale.setTo(0.3);
	
	//p2 physics and collision stuff
	game.physics.p2.enable(this, true);
	//this.body.collideWorldBounds = true;
	this.body.clearShapes();
	this.body.loadPolygon("squidPhysics", "squid", 0.3);
	
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
	
	//mouse controls 
	this.moveToPointerOnClick = function() {
		
		//get angles from mouse and player
		var deltaMouseRad = this.rotation - 
			game.physics.arcade.angleToPointer(this) - Math.PI / 2;
	
		//clamp range to 2PI to -2PI
		deltaMouseRad %= Math.PI;
		
		//offset by 2PI
		//if (deltaMouseRad !=  deltaMouseRad % Math.PI) {
		//	deltaMouseRad = (deltaMouseRad < 0) 
		//	? deltaMouseRad + Math.PI 
		//	: deltaMouseRad - Math.PI;	
		//}
		
		
		//On left mouse click, rotate, move to mouse
		if (game.input.activePointer.leftButton.isDown) {
			//rotate to mouse direction
			this.body.rotateLeft(50 * deltaMouseRad);
			
			
			//get angle from mouse to player
			var angle = (Math.atan2((3* game.input.position.y) - this.position.y,
				(3*game.input.position.x) - this.position.x));
		
			//noramlize angle
			angle = Phaser.Math.normalizeAngle(angle);
			
			//console.log(angle)
			
			//move to mouse
			this.body.force.x = Math.cos(angle) * 100;
			this.body.force.y = Math.sin(angle) * 100;
		}
		//Off left mouse click, reset player angle
		
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
	
	if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
		this.body.velocity.y += 10;
	else if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
		this.body.velocity.y -= 10;
	
	
	
}
//---------------------------------------------------------------------//




