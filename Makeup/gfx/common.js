$(function() {
	var isChrome = navigator.userAgent.indexOf('Chrome') !== -1,
		players = [];

	var Player = function(color) {
		this.moveValue = 0.025;

		this.pos = [0, 0];
		this.max = [2, 2];
		this.speed = [0, 0];
		this.moving = [0, 0];

		this.color = color || 'yellow';

		this.build();

		var $this = this;
		$(document).on('keydown keyup', function(e) {
			$this.key(e);
		});

		setInterval(function() {
			$this.tick();
		}, 100);
	}

	var proto = Player.prototype;

	proto.build = function() {
		$('body').append('<div class="elka elka-' + this.color + ' elka-normal"><i class="i0"></i><i class="i1"></i><i class="i2"></i><i class="i3"></i><i class="i4"></i><i class="i5"></i></div>');
	}

	proto.key = function(e) {
		switch(e.which) {
			case 37: this.moving[0] = e.type == 'keydown' ? -this.moveValue : 0; break;
			case 38: this.moving[1] = e.type == 'keydown' ? +this.moveValue : 0; break;
			case 39: this.moving[0] = e.type == 'keydown' ? +this.moveValue : 0; break;
			case 40: this.moving[1] = e.type == 'keydown' ? -this.moveValue : 0; break;
		}
	}

	proto.tick = function() {
		// Устанавливаем текущую скорость
		this.speed[0] += this.moving[0];
		if (!this.moving[0] && this.speed[0]) this.speed[0] += this.speed[0] > 0 ? -this.moveValue : this.moveValue;
		if (this.speed[0] > this.max[0]) this.speed[0] = this.max[0]; if (this.speed[0] < -this.max[0]) this.speed[0] = -this.max[0];

		this.speed[1] += this.moving[1];
		if (!this.moving[1] && this.speed[1]) this.speed[1] += this.speed[1] > 0 ? -this.moveValue : this.moveValue;
		if (this.speed[1] > this.max[1]) this.speed[1] = this.max[1]; if (this.speed[1] < -this.max[1]) this.speed[1] = -this.max[1];

		this.speed[0] = parseFloat(this.speed[0].toFixed(3));
		this.speed[1] = parseFloat(this.speed[1].toFixed(3));

		
	}

	$(document).on('mouseenter mouseleave', '.elka', function(e) {
		$(this)[e.type == 'mouseenter' ? 'addClass' : 'removeClass']('elka-frozen');
	});

	players[0] = new Player();
});
