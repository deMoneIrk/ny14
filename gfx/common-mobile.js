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

gameStart = function() {
	var wh = [parseInt($('.stick i').width()) / 2, parseInt($('.stick i').height()) / 2], pos = [$('.stick i').position().left + wh[0], $('.stick i').position().top + wh[1]], max = 140;
	socket.emit('iphone', { wh: wh, pos: pos });

	$('body').addClass('fade_second_screen');
	$('.game_pad').addClass('yellow').show();

	$(document).on('touchstart touchmove touchend', function(e) {
		e.preventDefault();
	});

	$('.strike').on('touchstart', function(e) {
		socket.emit('iphone');
		top.location.reload();
	});

	var start = []
	$('.stick i').on('touchstart', function(e) {
		start = [e.originalEvent.targetTouches[0].screenX, e.originalEvent.targetTouches[0].screenY];
		socket.emit('iphone', { pos: now });
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

		$(this).css('transform', 'translate' + (Modernizr.csstransforms3d ? '3d' : '') + '(' + (-change[0]) + 'px, ' + (-change[1]) + 'px' + (Modernizr.csstransforms3d ? ', 0px' : '') + ')');

		socket.emit('iphone', { now: now, change: change, angle: angle });
	});
};

gameStop = function() {

};

$(function() {
	setTimeout(function() {
		gameStart();
	}, 500);

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
		}
	});
});
