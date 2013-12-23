/**
 * Взрывы: http://www.gameplaypassion.com/blog/explosion-effect-html5-canvas/
 * */
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

$(function() {
	stop = false;
	var path = 'gfx/', players = [], dimensions = [0, 0], things = [], that = this, canvas = document.getElementById('canvas'), ctx = canvas.getContext("2d");

	$(window).on('resize', function() {
		dimensions = [$(window).width(), $(window).height()];

		canvas.width = dimensions[0];
		canvas.height = dimensions[1];
	}).trigger('resize');

	this.addThingMinTime = 1000;
	this.bgSpeed = 5;
	this.itemSpeed = 10;
	this.tickList = {};
	this.tickFunctionAdd = function(i) { var k = 'i' + Math.random(); this.tickList[k] = i; return k; };
	this.tickFunctionRemove = function(i) { delete this.tickList[i]; return true; };

	this.tickEvent = function() {
		if (!stop) requestAnimationFrame(arguments.callee);
		for(var i in that.tickList) that.tickList[i]();
	}; this.tickEvent();

	// background manager
	(function() {
		var $this = this;

		this.bg = {
			1: [5, {1: 1648, 2: 1626, 3: 1829, 4: 1394, 5: 3930}, 0, 0, $('.bg1')],
			2: [8, {1: 464, 2: 1645, 3: 1246, 4: 3096, 5: 2681, 6: 1271, 7: 1150, 8: 1578}, 0, 0, $('.bg2')],
			3: [8, {1: 793, 2: 1998, 3: 1134, 4: 2655, 5: 1917, 6: 1242, 7: 1530, 8: 2340}, 0, 0, $('.bg3')]
		};

		this.getNextItem = function(i) {
			var item = $('<div></div>'), parent = $('.bg' + i), prev = parent.find('div:last-child'), k;

			do { k = Math.round(Math.random() * (this.bg[i][0] - 1) + 1); } while (k == prev.data('k'));
			item.data('k', k).css({
				backgroundImage: 'url(' + path + 'bg' + i + '-' + k + '.png)',
				width: this.bg[i][1][k]
			}).appendTo(parent);

			this.bg[i][2] += this.bg[i][1][k];
		}

		for (var i = 0; i < 5; i++) {
			this.getNextItem(1);
			this.getNextItem(2);
			this.getNextItem(3);
		}

		that.tickFunctionAdd(function() {
			var multiply = [0, 0.9, 0.5, 0.2];

			for (var i = 1; i < 4; i++) {
				$this.bg[i][3] = $this.bg[i][3] - multiply[i] * that.bgSpeed;
				$this.bg[i][4].css('transform', 'translate' + (Modernizr.csstransforms3d ? '3d' : '') + '(' + ($this.bg[i][3]) + 'px, 0px' + (Modernizr.csstransforms3d ? ', 0px' : '') + ')');

				if (!$this.bg[i][5])
					$this.bg[i].push($this.bg[i][4][0].firstChild);

				var ew = parseInt($this.bg[i][5].style.width);
				if (ew < -$this.bg[i][3]) {
					$this.bg[i][5].parentNode.removeChild($this.bg[i][5]);
					$this.bg[i].pop();

					$this.bg[i][3] += ew;
					$this.bg[i][4].css('transform', 'translate' + (Modernizr.csstransforms3d ? '3d' : '') + '(' + ($this.bg[i][3]) + 'px, 0px' + (Modernizr.csstransforms3d ? ', 0px' : '') + ')');

					$this.getNextItem(i);
				}
			}
		});
	}());

	var Player = function(color) {
		this.moveValue = 0.3;

		this.pos = [0, 0];
		this.max = [6, 6];
		this.score = 0;
		this.speed = [0, 0];
		this.moving = [0, 0];
		this.dimensions = [150, 106];

		this.color = color || ['yellow', 'green', 'blue', 'red'][Math.floor(Math.random() * 4)];

		this.elka = $('<div class="elka elka-' + this.color + ' elka-normal"><i class="i0"></i><i class="i1"></i><i class="i2"></i><i class="i3"></i><i class="i4"></i><i class="i5"></i></div>');
		this.elka.appendTo('body');

		var $this = this;

		$(document).on('keydown keyup', function(e) { $this.key(e) });
		that.tickFunctionAdd(function() { $this.tick() });
	}

	var proto = Player.prototype;

	proto.key = function(e) {
		switch(e.which) {
			case 37: this.moving[0] = e.type == 'keydown' ? -this.moveValue : 0; break;
			case 38: this.moving[1] = e.type == 'keydown' ? -this.moveValue : 0; break;
			case 39: this.moving[0] = e.type == 'keydown' ? +this.moveValue : 0; break;
			case 40: this.moving[1] = e.type == 'keydown' ? +this.moveValue : 0; break;
		}
	}

	proto.tick = function() {
		var prevPos = [this.pos[0], this.pos[1]];

		// Устанавливаем текущую скорость
		this.speed[0] += this.moving[0];
		if (!this.moving[0] && this.speed[0]) this.speed[0] += this.speed[0] > 0 ? -this.moveValue : this.moveValue;
		if (this.speed[0] > this.max[0]) this.speed[0] = this.max[0]; if (this.speed[0] < -this.max[0]) this.speed[0] = -this.max[0];

		this.speed[1] += this.moving[1];
		if (!this.moving[1] && this.speed[1]) this.speed[1] += this.speed[1] > 0 ? -this.moveValue : this.moveValue;
		if (this.speed[1] > this.max[1]) this.speed[1] = this.max[1]; if (this.speed[1] < -this.max[1]) this.speed[1] = -this.max[1];

		this.speed[0] = parseFloat(this.speed[0].toFixed(3));
		this.speed[1] = parseFloat(this.speed[1].toFixed(3));

		this.pos[0] += this.speed[0]; this.pos[1] += this.speed[1];

		if (this.pos[0] < 0) {
			this.pos[0] = 0;
			this.speed[0] = 0;
		}

		if (this.pos[1] < 0) {
			this.pos[1] = 0;
			this.speed[1] = 0;
		}

		if (this.pos[0] + this.dimensions[0] > dimensions[0]) {
			this.pos[0] = dimensions[0] - this.dimensions[0];
			this.speed[0] = 0;
		}

		if (this.pos[1] + this.dimensions[1] > dimensions[1]) {
			this.pos[1] = dimensions[1] - this.dimensions[1];
			this.speed[1] = 0;
		}

		if (prevPos[0] != this.pos[0] || prevPos[1] != this.pos[1])
			this.elka.css('transform', 'translate' + (Modernizr.csstransforms3d ? '3d' : '') + '(' + this.pos[0] + 'px, ' + this.pos[1] + 'px' + (Modernizr.csstransforms3d ? ', 0px' : '') + ')');
	}

	players[0] = new Player();

	var thingTypes = {
		box: {
			name: 'box',
			style: function() {
				return {
					backgroundColor: '#' + parseInt(Math.random() * 800000 + 100000),
					border: '1px solid #fff',
					borderRadius: '64px',
					height: '64px',
					width: '64px'
				};
			},
			bang: function(gamer, that) {
				that.destroy();
			},
			width: 64,
			height: 64
		}
	};

	var Thing = function(type, id) {
		var $this = this;

		this.id = id;
		this.type = $.extend(true, {}, thingTypes[type]);
		this.speed = Math.random() * (that.itemSpeed - 7) + 3;

		if (typeof this.type.style == 'function') this.type.style = this.type.style();

		this.pos = [dimensions[0], Math.random() * (dimensions[1] - this.type.height)];

		this.item = $('<div class="thing thing-' + this.type.name + '">' + (this.type.content ? this.type.content : this.type.name) + '</div>');
		this.item.css(this.type.style).css('transform', 'translate' + (Modernizr.csstransforms3d ? '3d' : '') +
			'(' + this.pos[0] + 'px, ' + this.pos[1] + 'px' + (Modernizr.csstransforms3d ? ', 0px' : '') + ')');
		this.item.appendTo('body');

		this.tickFn = that.tickFunctionAdd(function() { $this.itemTick() });
	};

	var proto = Thing.prototype;
	proto.itemTick = function() {
		this.pos[0] -= this.speed;

		if (this.pos[0] < -this.type.width) {
			this.destroy();
			return false;
		}

		this.item.css(this.type.style).css('transform', 'translate' + (Modernizr.csstransforms3d ? '3d' : '') +
			'(' + this.pos[0] + 'px, ' + this.pos[1] + 'px' + (Modernizr.csstransforms3d ? ', 0px' : '') + ')');
	};

	proto.destroy = function() {
		that.tickFunctionRemove(this.tickFn);
		this.item.remove();
		delete things[this.id];
	};

	proto.bang = function(gamer) {
		return this.type.bang(gamer, this);
	};

	var addThingTime = new Date().getTime();
	addThing = function() {
		var now = new Date().getTime(), dt = now - (addThingTime || now);
		if (dt > that.addThingMinTime) {
			addThingTime = now;

			var id = 'i' + Math.random();
			things[id] = new Thing('box', id);
		}
	};
	this.tickFunctionAdd(addThing);

	testIntersection = function() {
		// ctx.clearRect(0, 0, canvas.width, canvas.height);

		var plGamers = [], plItems = [];
		for (var i in players) {
			if (!plGamers[i]) {
				plGamers[i] = new Polygon({x:0,y:0}, '#00FF00');
				plGamers[i].addAbsolutePoint([players[i].pos[0], players[i].pos[1] + 43]);
				plGamers[i].addAbsolutePoint([players[i].pos[0] + 24, players[i].pos[1] + 43]);
				plGamers[i].addAbsolutePoint([players[i].pos[0] + 24, players[i].pos[1] + 0]);
				plGamers[i].addAbsolutePoint([players[i].pos[0] + 53, players[i].pos[1] + 6]);
				plGamers[i].addAbsolutePoint([players[i].pos[0] + 79, players[i].pos[1] + 19]);
				plGamers[i].addAbsolutePoint([players[i].pos[0] + 101, players[i].pos[1] + 23]);
				plGamers[i].addAbsolutePoint([players[i].pos[0] + 122, players[i].pos[1] + 34]);
				plGamers[i].addAbsolutePoint([players[i].pos[0] + 149, players[i].pos[1] + 53]);
				plGamers[i].addAbsolutePoint([players[i].pos[0] + 122, players[i].pos[1] + 73]);
				plGamers[i].addAbsolutePoint([players[i].pos[0] + 101, players[i].pos[1] + 83]);
				plGamers[i].addAbsolutePoint([players[i].pos[0] + 80, players[i].pos[1] + 89]);
				plGamers[i].addAbsolutePoint([players[i].pos[0] + 53, players[i].pos[1] + 101]);
				plGamers[i].addAbsolutePoint([players[i].pos[0] + 24, players[i].pos[1] + 105]);
				plGamers[i].addAbsolutePoint([players[i].pos[0] + 24, players[i].pos[1] + 65]);
				plGamers[i].addAbsolutePoint([players[i].pos[0] + 4, players[i].pos[1] + 65]);
			}

			// plGamers[i].draw(ctx);

			for (var k in things) {
				if (!plItems[k]) {
					plItems[k] = new Polygon({x:0,y:0}, '#0000FF');
					plItems[k].addAbsolutePoint([things[k].pos[0], things[k].pos[1]]);
					plItems[k].addAbsolutePoint([things[k].pos[0] + things[k].type.width, things[k].pos[1]]);
					plItems[k].addAbsolutePoint([things[k].pos[0] + things[k].type.width, things[k].pos[1] + things[k].type.height]);
					plItems[k].addAbsolutePoint([things[k].pos[0], things[k].pos[1] + things[k].type.height]);
				}

				// plItems[k].draw(ctx);
				var is = plGamers[i].intersectsWith(plItems[k]);
				if (is) things[k].bang(players[i]);
			}
		}
	};

	this.tickFunctionAdd(testIntersection);
});

/*
 *  This is the Point constructor. Polygon uses this object, but it is
 *  just a really simple set of x and y coordinates.
 */
function Point(px, py) {
	this.x = px;
	this.y = py;
}

/*
 *  This is the Polygon constructor. All points are center-relative.
 */
function Polygon(c, clr) {
	this.points = new Array();
	this.center = c;
	this.color = clr; // used when drawing

}

/*
 *  Point x and y values should be relative to the center.
 */
Polygon.prototype.addPoint = function (p) {
	this.points.push({x:p[0], y:p[1]});
}

/*
 *  Point x and y values should be absolute coordinates.
 */
Polygon.prototype.addAbsolutePoint = function (p) {
	this.points.push({
		"x": p[0] - this.center.x,
		"y": p[1] - this.center.y
	});
}

/*
 * Returns the number of sides. Equal to the number of vertices.
 */
Polygon.prototype.getNumberOfSides = function () {
	return this.points.length;
}

/*
 * rotate the polygon by a number of radians
 */
Polygon.prototype.rotate = function (rads) {

	for (var i = 0; i < this.points.length; i++) {
		var x = this.points[i].x;
		var y = this.points[i].y;
		this.points[i].x = Math.cos(rads) * x - Math.sin(rads) * y;
		this.points[i].y = Math.sin(rads) * x + Math.cos(rads) * y;
	}

}

/*
 *  The draw function takes as a parameter a Context object from
 *  a Canvas element and draws the polygon on it.
 */
Polygon.prototype.draw = function (ctx) {

	ctx.save();

	ctx.fillStyle = this.color;
	ctx.beginPath();
	ctx.moveTo(this.points[0].x + this.center.x, this.points[0].y + this.center.y);
	for (var i = 1; i < this.points.length; i++) {
		ctx.lineTo(this.points[i].x + this.center.x, this.points[i].y + this.center.y);
	}
	ctx.closePath();
	ctx.fill();

	ctx.restore();

}

/*
 *  This function returns true if the given point is inside the polygon,
 *  and false otherwise.
 */
Polygon.prototype.containsPoint = function (pnt) {

	var nvert = this.points.length;
	var testx = pnt.x;
	var testy = pnt.y;

	var vertx = new Array();
	for (var q = 0; q < this.points.length; q++) {
		vertx.push(this.points[q].x + this.center.x);
	}

	var verty = new Array();
	for (var w = 0; w < this.points.length; w++) {
		verty.push(this.points[w].y + this.center.y);
	}

	var i, j = 0;
	var c = false;
	for (i = 0, j = nvert - 1; i < nvert; j = i++) {
		if (((verty[i] > testy) != (verty[j] > testy)) &&
			(testx < (vertx[j] - vertx[i]) * (testy - verty[i]) / (verty[j] - verty[i]) + vertx[i]))
			c = !c;
	}
	return c;

}

/*
 *  To detect intersection with another Polygon object, this
 *  function uses the Separating Axis Theorem. It returns false
 *  if there is no intersection, or an object if there is. The object
 *  contains 2 fields, overlap and axis. Moving the polygon by overlap
 *  on axis will get the polygons out of intersection.
 */
Polygon.prototype.intersectsWith = function (other) {

	var axis = new Point();
	var tmp, minA, maxA, minB, maxB;
	var side, i;
	var smallest = null;
	var overlap = 99999999;

	/* test polygon A's sides */
	for (side = 0; side < this.getNumberOfSides(); side++) {
		/* get the axis that we will project onto */
		if (side == 0) {
			axis.x = this.points[this.getNumberOfSides() - 1].y - this.points[0].y;
			axis.y = this.points[0].x - this.points[this.getNumberOfSides() - 1].x;
		} else {
			axis.x = this.points[side - 1].y - this.points[side].y;
			axis.y = this.points[side].x - this.points[side - 1].x;
		}

		/* normalize the axis */
		tmp = Math.sqrt(axis.x * axis.x + axis.y * axis.y);
		axis.x /= tmp;
		axis.y /= tmp;

		/* project polygon A onto axis to determine the min/max */
		minA = maxA = this.points[0].x * axis.x + this.points[0].y * axis.y;
		for (i = 1; i < this.getNumberOfSides(); i++) {
			tmp = this.points[i].x * axis.x + this.points[i].y * axis.y;
			if (tmp > maxA)
				maxA = tmp;
			else if (tmp < minA)
				minA = tmp;
		}
		/* correct for offset */
		tmp = this.center.x * axis.x + this.center.y * axis.y;
		minA += tmp;
		maxA += tmp;

		/* project polygon B onto axis to determine the min/max */
		minB = maxB = other.points[0].x * axis.x + other.points[0].y * axis.y;
		for (i = 1; i < other.getNumberOfSides(); i++) {
			tmp = other.points[i].x * axis.x + other.points[i].y * axis.y;
			if (tmp > maxB)
				maxB = tmp;
			else if (tmp < minB)
				minB = tmp;
		}
		/* correct for offset */
		tmp = other.center.x * axis.x + other.center.y * axis.y;
		minB += tmp;
		maxB += tmp;

		/* test if lines intersect, if not, return false */
		if (maxA < minB || minA > maxB) {
			return false;
		} else {
			var o = (maxA > minB ? maxA - minB : maxB - minA);
			if (o < overlap) {
				overlap = o;
				smallest = {
					x: axis.x,
					y: axis.y
				};
			}
		}
	}

	/* test polygon B's sides */
	for (side = 0; side < other.getNumberOfSides(); side++) {
		/* get the axis that we will project onto */
		if (side == 0) {
			axis.x = other.points[other.getNumberOfSides() - 1].y - other.points[0].y;
			axis.y = other.points[0].x - other.points[other.getNumberOfSides() - 1].x;
		} else {
			axis.x = other.points[side - 1].y - other.points[side].y;
			axis.y = other.points[side].x - other.points[side - 1].x;
		}

		/* normalize the axis */
		tmp = Math.sqrt(axis.x * axis.x + axis.y * axis.y);
		axis.x /= tmp;
		axis.y /= tmp;

		/* project polygon A onto axis to determine the min/max */
		minA = maxA = this.points[0].x * axis.x + this.points[0].y * axis.y;
		for (i = 1; i < this.getNumberOfSides(); i++) {
			tmp = this.points[i].x * axis.x + this.points[i].y * axis.y;
			if (tmp > maxA)
				maxA = tmp;
			else if (tmp < minA)
				minA = tmp;
		}
		/* correct for offset */
		tmp = this.center.x * axis.x + this.center.y * axis.y;
		minA += tmp;
		maxA += tmp;

		/* project polygon B onto axis to determine the min/max */
		minB = maxB = other.points[0].x * axis.x + other.points[0].y * axis.y;
		for (i = 1; i < other.getNumberOfSides(); i++) {
			tmp = other.points[i].x * axis.x + other.points[i].y * axis.y;
			if (tmp > maxB)
				maxB = tmp;
			else if (tmp < minB)
				minB = tmp;
		}
		/* correct for offset */
		tmp = other.center.x * axis.x + other.center.y * axis.y;
		minB += tmp;
		maxB += tmp;

		/* test if lines intersect, if not, return false */
		if (maxA < minB || minA > maxB) {
			return false;
		} else {
			var o = (maxA > minB ? maxA - minB : maxB - minA);
			if (o < overlap) {
				overlap = o;
				smallest = {
					x: axis.x,
					y: axis.y
				};
			}
		}
	}

	return {
		"overlap": overlap + 0.001,
		"axis": smallest
	};
}
