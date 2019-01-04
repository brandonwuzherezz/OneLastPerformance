//note: cannot "use strict" in this file because EnemyTimeline manipulates the argument object
//this will be fixed when ObstacleTimeline and EnemyTimeline are migrated to timelines.js


//linked list structure for obstacles in the level
//nodes contain one of two things:
//	1. instructions to spawn an enemy
//	2. instructions to wait n game-steps before proceeding to the next instruction

function EnemyTimeline () {

	//dummy node at head (private)
	var head;
	
	//current node (private)
	var current;

	//subclass for nodes containing box-spawn instructions (private)
	function EnemyNode(_data, _next = null) {
		var data = _data;
		this.next = _next;
		
		this.act = function(gamestate) {
			if (data.canExplode == null) {
				data.canExplode = true;
			}
			if (data.shootfn = null) {
				data.shootfn = function(c,g) {};
			}
			gamestate.activeEnemyList.insert(
			new Enemy(data.initX, data.initY, data.width, data.height, data.discreteBehavior, data.continuousBehavior, data.beatInterval, data.canExplode, data.src));
			return this.next;
		}
	}
	
	//subclass for nodes containing wait instructions (private)
	function WaitNode(_delay, _next = null) {
		var initDelay = _delay;
		var delay = _delay; 
		this.next = _next;
		
		this.act = function(gamestate) {
			//wait for @_delay number of game-steps
			if (delay > 0) {
				--delay;
				return this;
			}
			delay = initDelay;
			return this.next;
		}
	}

	//function to initialize the list given the constructor arguments (private)
	function initializeList(arguments) {
		head = new WaitNode (0);
		current = head;
		var temp = head;
		for (var i = 0; i < arguments.length; ++i) {
			if (typeof arguments[i] == "object") {
				temp.next = new EnemyNode(arguments[i]);
			}
			else if (typeof arguments[i] == "number") {
				temp.next = new WaitNode(arguments[i]);
			}
			else {
				throw "invalid argument at slot " + i;
			}
			temp = temp.next;
		}
	}
	
	//run through instructions (starting at current) until you reach a wait instruction (public)
	this.update = function(gamestate) {
		if (current != null) {
			var c_next = current.act(gamestate);
			if (c_next != current) {
				current = c_next;
				this.update(gamestate);
			}
		}
	}
	
	this.reset = function() {
		current = head;
	}
	
	initializeList(arguments);
}


//collection structure that contains the enemies which are currently on the screen
//that is, the enemies which we want to process using draw and update
function EnemyList() {
	this.enemymap = new Set();

	this.insert = function(e) {
		this.enemymap.add(e);
	}

	this.delete = function(e) {
		this.enemymap.delete(e);
	}

	this.draw = function(gamestate) {
		this.enemymap.forEach(function(e) {
			e.draw(gamestate);
		});
	}

	this.update = function(gamestate) {
		this.enemymap.forEach(function(e) {
			e.update(gamestate);
		});
	}
}

//data passed as an argument to Enemy to determine its movement path
function EnemyWaypoint () {
	this.positionList = [];
	this.speedList = [];

	//initialize the data coming in from the arguments
	if ((arguments.length + 1) % 3 != 0 & arguments.length > 2) {
		throw "usage: x0, y0, s0, x1, y1, s1, ... , xn, yn, sn \n" +
			  "requiring at least 2 positions";
	}
	for (var i = 0; i < arguments.length - 2; i += 3) {
		this.positionList.push({x:arguments[i], y:arguments[i+1]});
		this.speedList.push(arguments[i+2]);
	}
	this.positionList.push({x:arguments[arguments.length - 2],
							y:arguments[arguments.length - 1]});
							
	console.log(this.positionList);
	console.log(this.speedList);
}

var defaultWaypoint = new EnemyWaypoint(50, 0, 5, 50, 100);
var defaultEnemyImageSrc = "http://people.ucsc.edu/~bsamudio/FinalGame120/viynl.png";

var explosionImage = document.createElement("img"),
	imageUrl = "http://i402.photobucket.com/albums/pp101/Tumer/metalslug_zpsjtrdg5wm.gif";
	explosionImage.src = imageUrl;
	
//the class whose instances define individual enemies
//note that they will not be processed unless passed into gamestate.activeEnemyList
function Enemy(initX, initY, width, height, discreteBehavior, continuousBehavior, beatInterval = 30, canExplode = true, src = defaultEnemyImageSrc) {
	//initialize all the parameters

	//private
	var enemyImage = new Image();
	enemyImage.src = src;//TODO
	
	//public
	this.tag = "enemy";
	this.src = src;
	this.beatInterval = beatInterval;
	this.internalTimer = 0;
	this.direction;
	
	this.position = {x:initX, y:initY};

	this.width = width;
	this.height = height;

	this.canExplode = canExplode;
	this.explode = false;

	this.discreteBehavior = discreteBehavior;
	this.continuousBehavior = continuousBehavior;
	
	this.delay=0;;
	
	this.draw = function(gamestate) {
	 if(this.explode){
	  gamestate.context.drawImage(explosionImage, this.position.x, this.position.y, this.width, this.height);
	  return;
	 }
		gamestate.context.drawImage(enemyImage, this.position.x, this.position.y, this.width, this.height);
	}

	this.update = function(gamestate) {	
		if (this.explode) {
			//TODO https://www.youtube.com/watch?v=fzP9KUBP4uA	
            if(this.delay==0){
		     gamestate.EnemyDeathsound.play();
		    }
		    this.delay++;
		}
		if(this.delay==10 && this.explode){
		    gamestate.score+=500;
			gamestate.activeEnemyList.delete(this);
		
		}
		if(this.delay!=10 && this.explode){
		 return;
		}
		//do per-beat behaviors
		if (gamestate.time % this.beatInterval == 0) {
			this.discreteBehavior(this, gamestate);
		}
		//do per-step behaviors
		this.continuousBehavior(this, gamestate);
		
		//check to make sure we aren't too far offscreen, and handle it if we are
		this.subOffscreen(gamestate);
		
		this.internalTimer += 1;
	}

	this.subOffscreen = function(gamestate) {
		var p0 = this.position.x - this.width*2 > gamestate.canvas.width;
		var p1 = this.position.x + this.width*2 < 0;
		var p2 = this.position.y - this.height*2 > gamestate.canvas.height;
		var p3 = this.position.y + this.height*2 < 0;
		if (p0 || p1 || p2 || p3) {
			gamestate.activeEnemyList.delete(this);
			return true;
		}
		else return false;
	}
}

//behaviors

function fmany() {
	var args = arguments;
	return function() {
		for (var i = 0; i < args.length; ++i) {
			args[i].apply(this, arguments);
		}
	}
}


//notation:

//moveDiscrete = move only on the beat
//moveContinuous = move on every time step
function moveFixed(x, y) { return function(enemy) {
	enemy.position.x += x;
	enemy.position.y += y;
}}

function moveDirectional(dx, dy, s) { return function(enemy) {
	enemy.direction = Xmath.vUnit({x:dx, y:dy});
	enemy.position = Xmath.vPlus(Xmath.vScale(s, enemy.direction), enemy.position);
}}

function moveWithAccel(dx, dy, startS, endS, acc) { return function(enemy) {
	enemy.direction = Xmath.vUnit({x:dx, y:dy});
	var speed = startS + enemy.internalTimer * acc;
	if (speed > endS) speed = endS;
	enemy.position = Xmath.vPlus(Xmath.vScale(speed, enemy.direction), enemy.position);
}}

function moveSinusoidal(freq, amp, axisX, axisY) { return function(enemy, gamestate) {
	var theta = Math.cos(Math.PI * 2 * enemy.internalTimer / freq);
	var offsetDirection = Xmath.vUnit({x:-axisY, y:axisX});
	enemy.position = Xmath.vPlus(enemy.position, Xmath.vScale(theta * amp, offsetDirection));
}}

function moveWaypoint(_waypoints) { return function*(enemy) {
	var waypoints = _waypoints;
	var waypointIndex = 0;
	var direction = Xmath.vUnitDir(waypoints.positionList[1], waypoints.positionList[0]);
	var speed  = waypoints.speedList[0];
	enemy.position = waypoints.positionList[waypointIndex];
	yield;
	
	console.log(waypoints);
	console.log(waypointIndex);
	console.log(direction);
	console.log(speed);
	
	while (true) {
		//calculate next position naively
		var nextPosition = Xmath.vPlus(enemy.position, Xmath.vScale(speed, direction))
		var nextWaypoint = (waypointIndex < waypoints.positionList.length - 1) ? 
			waypoints.positionList[waypointIndex + 1] : 
			null;
		
		//if the next position lands us within one step of the next waypoint...
		if (waypointIndex < waypoints.positionList.length - 1)
		if (Xmath.vDist(nextWaypoint, nextPosition) < speed) {
			//...let the next position be equal to the next waypoint...
			nextPosition = nextWaypoint;
			//...update positions and directions to that specified by the next waypoint
			if (waypointIndex != waypoints.positionList.length - 2) {
				direction = Xmath.vUnitDir(waypoints.positionList[waypointIndex + 2], nextposition);
			}
			speed = this.waypoints.speedList[waypointIndex + 1];
			
			//...update our counter for the waypoint index...
			waypointIndex += 1;
		}
		
		//update the position to what was just decided upon
		this.position = nextPosition;
		
		yield;
	}
}}

function moveAtPlayer(speed) { return function(enemy, gamestate) {
	var direction = Xmath.vUnitDir(gamestate.activePlayer.position, enemy.position);
	enemy.position = Xmath.vPlus(Xmath.vScale(speed, direction), enemy.position);
}}

//firing is always discrete

function fireSingle(protobullet) { return function(enemy, gamestate) {
	gamestate.activeEnemyList.insert(new Enemy(
		enemy.position.x + (enemy.width - protobullet.width) / 2,
		enemy.position.y + (enemy.height - protobullet.height) / 2,
		protobullet.width, protobullet.height, 
		protobullet.discreteBehavior,
		protobullet.continuousBehavior,
		protobullet.beatInterval,
		protobullet.canExplode,
		protobullet.src)
	);
}}

function fireSpread(angle, spread, count, speed, protobullet) { return function(enemy, gamestate) {
	var px = enemy.position.x + (enemy.width - protobullet.width) / 2;
	var py = enemy.position.y + (enemy.height - protobullet.height) / 2;
	for (var i = angle - spread/2; i < angle + spread/2; i += spread/count) {
		//console.log("(dx, dy) =");
		//console.log(Math.cos(i));
		//console.log(Math.sin(i));
		gamestate.activeEnemyList.insert (new Enemy(
			px, py,
			protobullet.width, protobullet.height, protobullet.discreteBehavior,
			moveDirectional(Math.cos(i),-Math.sin(i), speed),
			protobullet.canExplode, protobullet.src)
		);
	}
}}

function burstCallback(wait, durration, steps, offset, callback = function() {}) { return function*(enemy, gamestate) {
	var stepSize = Math.floor(durration / steps);
	var timer = offset;
	while (true) {
		while (timer < wait) {
			timer += 1;
			yield; //wait wait amount of time
		}
		while (timer < wait + durration) {
			timer += 1;
			if (timer % stepSize) {
				callback(enemy, gamestate);
			}
			yield; //
		}
		timer = 0;
	}
}}
