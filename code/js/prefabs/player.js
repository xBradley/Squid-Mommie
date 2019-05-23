//---------------------------------------------------------------------//
//Squid Mommie - Alpha												   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		player.js													   //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
function player(_game, _x, _y, _key, _babbies, _count) {
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
	game.physics.p2.enable(this, false);
	this.body.collideWorldBounds = true;
	this.body.clearShapes();
	this.body.loadPolygon("squidPhysics", "squid", 0.3);
	
	//babbies eaten count
	var babbieCount = _count;
	
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
			if (game.input.activePointer.leftButton.justPressed && !this.swish && !this.swim.isPlaying) {
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
		

		this.lullaby = this.voices[this.getCount()];
		this.cry = this.cries[this.getCount()];
		
		//Spacebar controls
		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
			//if the player collects all the babies they do their final sing
			if (babbieCount == 5)
				game.state.start("Gameover", true, false);

			//lullaby
			if(!this.lullaby.isPlaying)
				this.lullaby.play();
			
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

		//adding the feedback sound from the babys
		if(this.lullaby.isPlaying && this.lullaby.currentTime >= (this.lullaby.durationMS - 300) && ! this.cry.isPlaying){
				console.log("beep beep");
				this.cry.play();			
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




