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
	var path = 'gfx/', players = [], dimensions = [], that = this;

	this.bgSpeed = 10;
	this.tickList = [];
	this.tickFunctionAdd = function(i) { this.tickList.push(i); };

	this.tickEvent = function() {
		if (!stop) requestAnimationFrame(arguments.callee);
		for(var i in that.tickList) that.tickList[i]();
	}; this.tickEvent();

	this.bgManager = function() {
		var $this = this;

		this.bg = {
			1: [5, {1: 1648, 2: 1626, 3: 1829, 4: 1394, 5: 3930}, 0, 0, $('.bg1')],
			2: [8, {1: 464, 2: 1645, 3: 1246, 4: 3096, 5: 2681, 6: 1271, 7: 1150, 8: 1578}, 0, 0, $('.bg2')],
			3: [8, {1: 793, 2: 1998, 3: 1134, 4: 2655, 5: 1917, 6: 1242, 7: 1530, 8: 2340}, 0, 0, $('.bg3')]
		};

		this.getNextItem = function(i) {
			var item = $('<div></div>'), parent = $('.bg' + i), prev = parent.find('div:last-child'), k;

			do { k = Math.round(Math.random() * (this.bg[i][0] - 1) + 1); } while (k == prev.data('k'));
			item.data('k', k).css({backgroundImage: 'url(' + path + 'bg' + i + '-' + k + '.png)', width: this.bg[i][1][k]}).appendTo(parent);

			this.bg[i][2] += this.bg[i][1][k];
		}

		for (var i = 0; i < 5; i++) {
			this.getNextItem(1);
			this.getNextItem(2);
			this.getNextItem(3);
		}

		this.moveLines = function() {
			var multiply = [0, 0.9, 0.6, 0.3];

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
		}

		that.tickFunctionAdd(function() { $this.moveLines(); });
	}

	this.bgManager();

	var Player = function(color) {
		this.moveValue = 0.1;

		this.pos = [0, 0];
		this.max = [6, 6];
		this.speed = [0, 0];
		this.moving = [0, 0];
		this.dimensions = [150, 106];

		this.elka = false;

		this.color = color || 'yellow';

		this.build();

		var $this = this;

		$(document).on('keydown keyup', function(e) { $this.key(e) });
		that.tickFunctionAdd(function() { $this.tick() });
	}

	var proto = Player.prototype;

	proto.build = function() {
		this.elka = $('<div class="elka elka-' + this.color + ' elka-normal"><i class="i0"></i><i class="i1"></i><i class="i2"></i><i class="i3"></i><i class="i4"></i><i class="i5"></i></div>');
		this.elka.appendTo('body');
	}

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

	$(window).on('resize', function() {
		dimensions = [$(window).width(), $(window).height()];
	}).trigger('resize');

	players[0] = new Player();
});
