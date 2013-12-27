var socket = io.connect('http://2014.studio38.ru:8089'), playerID, gameID;

socket.emit('newPlayer');
socket.on('id', function(data) {
	playerID = data.id;
});

socket.on('system', function(data) {
	switch (data.status) {
		case 'no places':
		case 'no game':
			$('#gameID').css('background-color', '#f00').focus();

			setTimeout(function() {
				$('#gameID').css('background-color', '#fff');
			}, 300);

			break;

		case 'server-off':
			$('.game_pad').hide().attr('className', 'game_pad');
			$('#gameID').css('background-color', '#fff').val('');
			$('body').removeClass('fade_second_screen');
			break;

		case 'joined game':
			gameID = data.gameID;
			$('#gameID').css('background-color', '#fff').val('');
			$('.game_pad').addClass(data.color).fadeIn();
			break;
	}
});

/*gameStart = function(color) {
	var wh = [parseInt($('.stick i').width()) / 2, parseInt($('.stick i').height()) / 2], max = 140;

	$('body').addClass('fade_second_screen');
	$('.game_pad').addClass(color).show();

	$(document).on('touchstart touchmove touchend', function(e) {
		e.preventDefault();
	});

	$('.strike').on('touchstart', function(e) {
		socket.emit('shot', { gameID: gameID, playerID: playerID });
	});

	var start = [];
	$('.stick i').on('touchstart', function(e) {
		start = [e.originalEvent.targetTouches[0].screenX, e.originalEvent.targetTouches[0].screenY];
	}).on('touchmove', function(e) {
		var now = [e.originalEvent.targetTouches[0].screenX, e.originalEvent.targetTouches[0].screenY],
			change = [start[0] - now[0], start[1] - now[1]];

		if (change[0] > max) change[0] = max; if (change[0] < -max) change[0] = -max;
		if (change[1] > max) change[1] = max; if (change[1] < -max) change[1] = -max;

		change[2] = Math.sqrt(Math.pow(change[0], 2) + Math.pow(change[1], 2) - 2 * change[0] * change[1] * Math.cos(90 * Math.PI / 180));
		var
			angle1 = Math.acos((Math.pow(change[0], 2) + Math.pow(change[2], 2) - Math.pow(change[1], 2)) / (2 * change[0] * change[2])) * 180 / Math.PI,
			angle0 = 90 - angle0,
			angle2 = 90;

		if (change[2] < -max) {
			change[2] = -max;
			change[1] = change[2] * (Math.sin(angle0 * Math.PI / 180) / Math.sin(angle1 * Math.PI / 180));
			change[0] = change[2] * (Math.sin(angle1 * Math.PI / 180) / Math.sin(angle0 * Math.PI / 180));
		} else if (change[2] > max) {
			change[2] = max;
			change[1] = change[2] * (Math.sin(angle0 * Math.PI / 180) / Math.sin(angle1 * Math.PI / 180));
			change[0] = change[2] * (Math.sin(angle1 * Math.PI / 180) / Math.sin(angle0 * Math.PI / 180));
		}

		socket.emit('iphone', { gameID: gameID, playerID: playerID, speedX: change[0], speedY: change[1] });

		$(this).css('transform', 'translate' + (Modernizr.csstransforms3d ? '3d' : '') + '(' + (-change[0]) + 'px, ' + (-change[1]) + 'px' + (Modernizr.csstransforms3d ? ', 0px' : '') + ')');
	}).on('touchend', function(e) {

	});
};*/

gameStart = function(color) {
	$('body').addClass('fade_second_screen');
	$('.game_pad').addClass(color).show();

	$(document).on('touchstart touchmove touchend', function(e) {
		e.preventDefault();
	});
};

/*(function() {
	requestAnimationFrame(arguments.callee);

	// socket.emit('iphone', { iPos: iPos });
})();*/

/***** requestAnimationFrame polyfill *****/
// Source: http://html5.by/blog/what-is-requestanimationframe/
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

gameStop = function() {
	gameID = false;

};

$(function() {
	if(window.orientation == -90 || window.orientation == 90 || window.orientation == undefined) {
		$('body').addClass('horizontal');
	} else {
		$('body').removeClass('horizontal');
	}

	window.addEventListener("orientationchange", function() {
		if(window.orientation == -90 || window.orientation == 90 || window.orientation == undefined) {
			$('body').addClass('horizontal');
		} else {
			$('body').removeClass('horizontal');
		}
	}, false);
	
	$('.play_inkognito_btn').click(function() {
		$('body').addClass('fade_second_screen');
	});

	$('.join_btn').click(function() {
		if (!$('#gameID').val()) {
			$('#gameID').focus();
			return false;
		} else {
			socket.emit('joinGame', { playerID: playerID, gameID: document.getElementById('gameID').value });
			socket.on('joined game', function(data) {
				// socket.emit('iphone', { hello: true });
				gameStart(data.color);
			});
		}
	});
});
