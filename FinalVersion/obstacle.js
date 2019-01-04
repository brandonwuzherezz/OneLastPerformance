//note: cannot "use strict" in this file because ObstacleTimeline manipulates the argument object
//this will be fixed when ObstacleTimeline and EnemyTimeline are migrated to timelines.js

//linked list structure for obstacles in the level
//nodes contain one of two things:
//	1. instructions to spawn an object
//	2. instructions to wait n game-steps before proceeding to the next instruction

function ObstacleTimeline () {

	//dummy node at head (private)
	var head;
	
	//current node (private)
	var current;

	//subclass for nodes containing box-spawn instructions (private)
	function ObstacleNode(_data, _next = null) {
		var data = _data;
		this.next = _next;
		
		this.act = function(gamestate) {
			gamestate.activeObstacleList.insert(
			new Obstacle(data.initX, data.initY, data.directionX, data.directionY, data.speed, data.width, data.height, gamestate.obstacleImageSrc));
			return this.next;
		}
		
		this.subSubLog = function() {
			console.log(data);
		}
	}
	
	//subclass for nodes containing wait instructions (private)
	function WaitNode(_delay, _next = null) {
		var initDelay = _delay;
		var delay = _delay;
		this.next = _next;
		
		this.act = function(gamestate) {
			//wait for delay number of game-steps
			if (delay > 0) {
				delay -= 1;
				return this;
			}
			delay = initDelay;
			return this.next;
		}
		
		this.subSubLog = function() {
			console.log(delay);
		}
	}

	//function to initialize the list given the constructor arguments (private)
	function initializeList(arguments) {
		head = new WaitNode (0);
		current = head;
		var temp = head;
		for (var i = 0; i < arguments.length; ++i) {
			if (typeof arguments[i] == "object") {
				temp.next = new ObstacleNode(arguments[i]);
			}
			else if (typeof arguments[i] == "number") {
				temp.next = new WaitNode(arguments[i]);
			}
			else {
				throw "invalid argument at slot " + i;
			}
			temp = temp.next;
		}
		//log();
	}
	
	//run through instructions (starting at current) until you reach a wait instruction (public)
	this.update = function(gamestate) {
		if (current != null) {
			//console.log('current = ');
			//current.subSubLog()
			var c_next = current.act(gamestate);
			if (c_next != current) {
				current = c_next;
				this.update(gamestate);
			}
		}
		else {
			gamestate.doLevelTransition = gamestate.levelnum + 1;
		}
	}
	
	this.reset = function() {
		current = head;
	}
	
	initializeList(arguments);
	
	//for testing purposes
	function log(){
		console.log("------------");
		console.log("obstacleTimeline = ");
		subLog(head);
	}
	
	function subLog(node) {
		if (node != null) {
			node.subSubLog();
			subLog(node.next);
		}
		else console.log("------------");
	}
}


//collection structure that contains the obstacles which are currently on the screen
//that is, the obstacles which we want to process using draw and update
function ObstacleList() {
	this.obstaclemap = new Set();

	this.insert = function(o) {
		this.obstaclemap.add(o);
	}

	this.delete = function(o) {
		this.obstaclemap.delete(o);
	}

	this.draw = function(gamestate) {
		this.obstaclemap.forEach(function(o) {
			o.draw(gamestate);
		});
	}

	this.update = function(gamestate) {
		this.obstaclemap.forEach(function(o) {
			o.update(gamestate);
		});
	}
}

//the class whose instances define individual obstacles
//note that they will not be processed unless passed into gamestate.activeObstacleList
function Obstacle(x_, y_, dx, dy, speed, width, height, tileSrc = "cloudTex.png") {
	//initialize all the parameters

	//private
	var obstacleTile = new Tile(tileSrc, width, height);

	//public
	this.tag = "obstacle";
	this.position = {x:x_, y:y_};
	this.direction = {x:dx, y:dy};
	this.speed = speed;
	this.width = width;
	this.height = height;

	this.draw = function(gamestate) {
		obstacleTile.draw(this, gamestate);
	}

	this.update = function(gamestate) {
		this.position.x += this.direction.x * this.speed;
		this.position.y += this.direction.y * this.speed;
		this.subOffscreen(gamestate);
	}

	this.subOffscreen = function(gamestate) {
		var p0 = this.position.x - this.width*2 > gamestate.canvas.width;
		var p1 = this.position.x + this.width*2 < 0;
		var p2 = this.position.y - this.height*2 > gamestate.canvas.height;
		var p3 = this.position.y + this.height*2 < 0;
		if (p0 || p1 || p2 || p3) {
			gamestate.activeEnemyList.delete(this);
		}
	}
}
