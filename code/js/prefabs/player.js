//---------------------------------------------------------------------//
//Squid Mommie - Alpha												   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		player.js													   //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
function player(_game, _x, _y, _key, _babbies) {
	Phaser.Sprite.call(this, _game, _x, _y, _key);

	//Adding swim SFX
	var swim;
	this.swim = game.add.audio('swim');
	
	//set size and anchor
	this.anchor.setTo(0.5);
	this.scale.setTo(0.3);
	
	//p2 physics and collision stuff
	game.physics.p2.enable(this, true);
	this.body.collideWorldBounds = true;
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
		}
		//Off left mouse click, reset player angle
		else {
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
			
			var angle;
			//if distance is greater than 200,
			//find angle between player to nearest 
			if (distance >= 200) {
				//console.log(distance);
				angle = Phaser.Math.angleBetweenPoints(this.position, 									  nearest.position);
				
				//revive arrow and point to nearest
				//this.arrow.revive();
				//this.arrow.angle = Phaser.Math.radToDeg(angle) + 90;	
			}
			//if distance is less than 200,
			//find angle between nearest to player
			else if(distance < 200) {
				//console.log(nearest);
				angle = Phaser.Math.angleBetweenPoints(nearest.position, 									   this.position);
				
				//move towards player
				nearest.body.force.x = Math.cos(angle) * 10000;
				nearest.body.force.y = Math.sin(angle) * 10000;
			}
		}
		  
		
		//arrow is fixed on player
		//this.arrow.position.x = player.position.x + 20;
		//this.arrow.position.y = player.position.y - 70;;
		
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




