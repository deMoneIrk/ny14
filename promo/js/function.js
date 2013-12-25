$(function(){
	//alert('vdf')	
	var indexArr = [5, 5, 5, 5];
 	function elkaAnimate(index){
 		//console.log(indexArr[index])
		$('.front_elka_'+(index + 1)).find('div').eq(indexArr[index]).addClass('elka_animate');
		indexArr[index] = indexArr[index] - 1;
		if(indexArr[index] >= 0){
			setTimeout(function(){
				elkaAnimate(index);
			}, 70);	
		} else {
			setTimeout(function(){
				$('.front_elka_'+(index + 1)).find('div').removeClass('elka_animate');
				indexArr[index] = 5;
			}, 1000);
		}	
	}
	
	var introAnimateIndex = [1, 3, 2, 4],
		atroI = 0, 
		step2Count = 0;
	function introAnimate(){
		$('.intro_elka_'+introAnimateIndex[atroI]).addClass('color');
		atroI++;
		if(atroI < 4){
			setTimeout(introAnimate, 800);
		} else {
			setTimeout(introAnimateStep2, 1000);
		}
					
	}
	function introAnimateStep2(){
		$('.intro_elka.color').length;
		$('.intro_elka.color').eq(step2Count).addClass('go_up');
		step2Count++;
		if(step2Count < $('.intro_elka.color').length){
			setTimeout(introAnimateStep2, 200);	
		} else {
			alert('Сюда хуярь старт игры!')
		}
			
	}
	/*setTimeout(introAnimate, 1000);*/
	
	var animeteIndex = 0,
		elkaAnimated = true; 
	function startAnimate(){
		//console.log(animeteIndex);
		elkaAnimate(animeteIndex);
		animeteIndex++;
		if(animeteIndex <= 3){
			setTimeout(startAnimate, 800);	
		}else {
			animeteIndex = 0;
			if(elkaAnimated)
				setTimeout(startAnimate, 5000);	
			//console.log('Animate Complite', animeteIndex)	
		}	
	}
	startAnimate();
	window.rnd = function(from, to) {
	    return Math.ceil(Math.random() * to + from);
	};
	var cn = 0;
    var ci = setInterval(function() {
        var cnt = Math.ceil(Math.random() * 10);
        for (var i = 0; i < cnt; i++) {
            cn = cn + 1;
            var l = Math.ceil(rnd(0, $(window).width())),
				t = Math.ceil(rnd(0, ($(window).height() / 6)));
            $('.front_elka_wrap').append('<i id="cn' + cn + '" class="snow" style="top: '+ t +'px; left: ' + l + 'px"></i>');
            var thisSnow = $('#cn' + cn);
            $(thisSnow).animate({
                left: l + parseInt((Math.random() - 0.5) * 6) * 32,
                top: ($(window).height() - 20)
            }, 5000, 'linear', function() {
                $(this).addClass('notransition').animate({
                    opacity: 0
                }, function() {
                    $(this).remove();
                });
                
            }).addClass('fade');
        }
    }, 500);
    
    $('.first_btn').click(function(){
    	elkaAnimated = false;
    	$('.front_elka_wrap_inner').fadeOut(800);
    	$('.first_screen_center').fadeOut(800, function(){
    		$('.animate_wrap').fadeIn();	
    	});
			
    });
    
    $('.start_btn').click(function(){
    	$('.animate_wrap').addClass('startanimate');
		setTimeout(introAnimate, 2500);	
    });
	
});