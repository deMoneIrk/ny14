$(function() {
	var isChrome = navigator.userAgent.indexOf('Chrome') !== -1,
		players = [];

	var Player = function(color) {
		this.x = this.y = 0;
		this.speed = 100;
		this.color = color || 'yellow';

		this.build = function() {
			$('body').append('<div class="elka elka-' + this.color + ' elka-normal"><i class="i0"></i><i class="i1"></i><i class="i2"></i><i class="i3"></i><i class="i4"></i><i class="i5"></i></div>');
		};

		this.move = function(e) {
			switch(e.which) {
				case 37: // left
					
					break;
				case 38: // top
					
					break;
				case 39: // right
					
					break;
				case 40: // down
					
					break;
			}
		}

		this.build();
		$(document).on('keydown', this.move);
	}

	$(document).on('mouseenter mouseleave', '.elka', function(e) {
		$(this)[e.type == 'mouseenter' ? 'addClass' : 'removeClass']('elka-frozen');
	});

	players[0] = new Player();
})