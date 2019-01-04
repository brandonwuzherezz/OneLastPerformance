"use strict";

//this code was taken from the in-class spritesheet example
//https://jsfiddle.net/_arnav/c9o0bqx4/
function SpriteSheet(url, frameWidth, frameHeight, frameSpeed, framesPerAnim) {
	var image = new Image();
	var numCols;
	var numRows;
	
	var currentBaseFrame = 0;
	var currentFrame;
	var counter = 0;
	var currentAnim = 1;
	image.src = url;
	
	image.onload = function(){
		numCols = Math.floor(image.width / frameWidth);
		numRows = Math.floor(image.height / frameHeight);
	}
	
	this.update = function(nextAnim = -1){
		//increment the current frame every frameSpeed-many update calls
		if(counter == (frameSpeed - 1)){
			currentBaseFrame = (currentBaseFrame + 1) % framesPerAnim;
		}
		counter = (counter + 1) % frameSpeed;
		
		//console.log('--------------');
		//console.log(currentFrame);

		//if (nextAnim > -1 & nextAnim * framesPerAnim < numCols * numRows) {
			currentAnim = nextAnim;
		//}
		
		currentFrame = currentBaseFrame + framesPerAnim * currentAnim;
	}
	
	this.draw = function(gamestate, x, y, drawWidth, drawHeight){
		
		//currentFrame is in [0, ..., framesPerAnim - 1]
		//so if framesPerAnim - 1 > numCols, we use another row of the image
		//the row we are in is the floor of currentFrame / numCols
		
		//for colums just use % to keep currentFrame % numCols in range [0, ..., numCols]
		
		//we also need to take into account multiple animation states. 
		//For this we assume each animation has the same number of frames and the same frame sizes.
		//So we just add on the number of frames in an animation

		var row = Math.floor(currentFrame / numCols);

		var col = Math.floor(currentFrame % numCols);
		gamestate.context.drawImage(image, col*frameWidth, row*frameHeight, frameWidth, frameHeight, x, y, drawWidth, drawHeight);
	}
}
