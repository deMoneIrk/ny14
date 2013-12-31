function Point(e,t){this.x=e;this.y=t}function Polygon(e,t){this.points=new Array;this.center=e;this.color=t}function randomFloat(e,t){return e+Math.random()*(t-e)}function Particle(){this.scale=1;this.x=0;this.y=0;this.radius=20;this.color="#000";this.velocityX=0;this.velocityY=0;this.scaleSpeed=.5;this.update=function(e){this.scale-=this.scaleSpeed*e/1e3;if(this.scale<=0){this.scale=0;return false}this.x+=this.velocityX*e/1e3;this.y+=this.velocityY*e/1e3;return true};this.draw=function(e){e.save();e.translate(this.x,this.y);e.scale(this.scale,this.scale);e.beginPath();e.arc(0,0,this.radius,0,Math.PI*2,true);e.closePath();e.fillStyle=this.color;e.fill();e.restore()}}function createExplosion(e,t,n){var r=10;var i=30;var s=10;var o=60;var u=200;var a=1;var f=4;for(var l=0;l<360;l+=Math.round(360/s)){var c=new Particle;c.x=e;c.y=t;c.radius=randomFloat(r,i);c.color=n;c.scaleSpeed=randomFloat(a,f);var h=randomFloat(o,u);c.velocityX=h*Math.cos(l*Math.PI/180);c.velocityY=h*Math.sin(l*Math.PI/180);particles["i"+Math.random()]=c}}function update(e,t){for(var n in particles){var r=particles[n];var n=r.update(e);if(n){r.draw(t)}else{delete particles[n]}}}var socket,context,musicStop=true;var Game=function(e){function f(e,t,n,r,i){function u(){s++;if(s>e){clearInterval(o);i&&i();return}s%2?n&&n():r&&r()}var s=0,o;o=setInterval(u,t)}var t=false;var n="/gfx/",r=[],i=[0,0],s=[],o=this,u=document.getElementById("canvas"),a=u.getContext("2d");$(window).on("resize",function(){i=[$(window).width(),$(window).height()];$("#game").width(i[0]).height(i[1]);u.width=i[0];u.height=i[1]}).trigger("resize");this.gameID=0;this.addThingMinTime=500;this.speedMultiplier=1;this.bgSpeed=5;this.itemSpeed=1;this.tickList={};this.tickFunctionAdd=function(e){var t="i"+Math.random();this.tickList[t]=e;return t};this.tickFunctionRemove=function(e){delete this.tickList[e];return true};this.tickEvent=function(){if(!t)requestAnimationFrame(arguments.callee);for(var e in o.tickList)o.tickList[e]()};(function(){var e=this;this.bg={1:[5,{1:1648,2:1626,3:1829,4:1394,5:3930},0,0,$(".bg1")],2:[8,{1:464,2:1645,3:1246,4:3096,5:2681,6:1271,7:1150,8:1578},0,0,$(".bg2")],3:[8,{1:793,2:1998,3:1134,4:2655,5:1917,6:1242,7:1530,8:2340},0,0,$(".bg3")]};this.getNextItem=function(e){var t=$("<div></div>"),r=$(".bg"+e),i=r.find("div:last-child"),s;do{s=Math.round(Math.random()*(this.bg[e][0]-1)+1)}while(s==i.data("k"));t.data("k",s).css({backgroundImage:"url("+n+"bg"+e+"-"+s+".png)",width:this.bg[e][1][s]}).appendTo(r);this.bg[e][2]+=this.bg[e][1][s]};for(var t=0;t<5;t++){this.getNextItem(1);this.getNextItem(2);this.getNextItem(3)}o.tickFunctionAdd(function(){var t=[0,1.2,.5,.2];for(var n=1;n<4;n++){e.bg[n][3]=e.bg[n][3]-t[n]*o.bgSpeed*o.speedMultiplier;e.bg[n][4].css("transform","translate"+(Modernizr.csstransforms3d?"3d":"")+"("+e.bg[n][3]+"px, 0px"+(Modernizr.csstransforms3d?", 0px":"")+")");if(!e.bg[n][5])e.bg[n].push(e.bg[n][4][0].firstChild);var r=parseInt(e.bg[n][5].style.width);if(r<-e.bg[n][3]){e.bg[n][5].parentNode.removeChild(e.bg[n][5]);e.bg[n].pop();e.bg[n][3]+=r;e.bg[n][4].css("transform","translate"+(Modernizr.csstransforms3d?"3d":"")+"("+e.bg[n][3]+"px, 0px"+(Modernizr.csstransforms3d?", 0px":"")+")");e.getNextItem(n)}}})})();var l="random";thingTypes={ball1:{role:"good",name:"ball1",content:function(){return Math.random()>.5?'<i class="ball"></i>':"<i></i>"},style:{},bang:function(e,t){t.destroy("#8e44ac");e.score+=25},bangMusic:"ting",width:40,height:33},ball2:{role:"good",name:"ball2",content:function(){return Math.random()>.5?'<i class="ball"></i>':"<i></i>"},style:{},bang:function(e,t){t.destroy("#bd3d24");e.score+=50},bangMusic:"ting2",width:40,height:33},ball3:{role:"good",name:"ball3",content:function(){return Math.random()>.5?'<i class="ball"></i>':"<i></i>"},style:{},bang:function(e,t){t.destroy("#27ad5f");e.score+=100},bangMusic:"ting3",width:40,height:33},bgremlin:{role:"bad",name:"bgremlin",content:"<i></i>",style:{},bang:function(e,t){t.destroy("#6fdefb");e.score-=10;for(var n in s){var r="i"+Math.random();s[r]=new c("snowflake",r);s[r].pos=[s[n].pos[0],s[n].pos[1]];s[n].destroy("#6fdefb")}},bandMusic:"take2",width:92,height:59},box:{role:"bad",name:"box",content:"<i></i>",style:{},bang:function(e,t){e.score-=10;e.thingFb=true;f(20,100,function(){t.pos[1]+=10;e.pos[0]+=Math.random()*10-5;e.pos[1]+=Math.random()*10-5},function(){t.pos[1]+=10;e.pos[0]+=Math.random()*10-5;e.pos[1]+=Math.random()*10-5},function(){e.thingFb=false;t.destroy("#6fdefb")})},bangMusic:"glass",width:74,height:85},candy:{role:"secret",name:"candy",content:"<i></i>",style:{},bang:function(e,t){e.score+=300;t.boom("#f0b546");t.destroy("#bd3d24")},bangMusic:"ting",width:62,height:53},candycane:{role:"secret",name:"candycane",content:"<i></i>",style:{},bang:function(e,t){e.score+=300;t.boom("#ffffff");t.destroy("#bd3d24")},bangMusic:"ting2",width:42,height:52},cookie:{role:"secret",name:"cookie",content:"<i></i>",style:{},bang:function(e,t){e.score+=300;t.destroy("#e27c3d")},bangMusic:"ting3",width:42,height:52},deer:{role:"good",name:"deer",content:"<i></i>",deerTimeout:false,style:{},bang:function(e,t){e.score+=25;t.destroy("#e27c3d");if(o.bgSpeed<10){o.bgSpeed+=5;o.itemSpeed++}source.playbackRate.value=1.5;if(thingTypes.deer.deerTimeout)clearTimeout(thingTypes.deer.deerTimeout);thingTypes.deer.deerTimeout=setTimeout(function(){var e=setInterval(function(){if(o.bgSpeed>5){o.bgSpeed--;o.itemSpeed-=.2}else{source.playbackRate.value=1;thingTypes.deer.deerTimeout=false;clearInterval(e)}},100)},1e4)},width:57,height:80},fireball:{role:"bad",name:"fireball",content:"<i></i>",style:{},bang:function(e,t){t.destroy("#fdd857");e.score-=50;e.destroyConsole()},bangMusic:"wooff-wooff",width:76,height:76},ggremlin:{role:"bad",name:"ggremlin",content:"<i></i>",style:{},thingGG:false,bang:function(e,t){t.destroy("#2dcc70");e.score-=10;if(!thingTypes.ggremlin.thingGG)for(var n in r)r[n].elka.removeClass("elka-"+r[n].color).addClass("elka-green");if(thingTypes.ggremlin.thingGG)clearTimeout(thingTypes.ggremlin.thingGG);thingTypes.ggremlin.thingGG=setTimeout(function(){f(6,100,function(){for(var e in r)r[e].elka.removeClass("elka-green").addClass("elka-"+r[e].color)},function(){for(var e in r)r[e].elka.removeClass("elka-"+r[e].color).addClass("elka-green")},function(){for(var e in r)r[e].elka.removeClass("elka-green").addClass("elka-"+r[e].color);thingTypes.ggremlin.thingGG=false})},1e4)},bangMusic:"ha-ha",width:92,height:59},santa:{role:"bad",name:"santa",content:"<i></i>",style:{},bang:function(e,t){t.destroy("#e45136");e.score+=25;for(var n in s){var r="i"+Math.random();s[r]=new c("box",r);s[r].pos=[s[n].pos[0],s[n].pos[1]];s[n].destroy("#ffffff")}},bangMusic:"ho-ho-ho",width:92,height:59},snowflake:{role:"bad",name:"snowflake",content:"<i></i>",style:{},bang:function(e,t){t.destroy("#ffffff");e.score-=25;e.slowSpeed()},bangMusic:"uskorenie",width:62,height:57},star:{role:"good",name:"star",content:"<i></i>",style:{},bang:function(e,t){t.destroy("#fdd957");e.star()},width:68,height:68},ygremlin:{role:"bad",name:"ygremlin",content:"<i></i>",style:{},bang:function(e,t){t.destroy("#fdc501");e.score-=10;for(var n in s){var r="i"+Math.random();s[r]=new c("fireball",r);s[r].pos=[s[n].pos[0],s[n].pos[1]];s[n].destroy("#fdc501")}},bangMusic:"take2",width:92,height:59}};var c=function(e,t){var n=this;this.id=t;this.type=$.extend(true,{},thingTypes[e]);this.speed=Math.random()*3+3;if(this.type.style&&typeof this.type.style=="function")this.type.style=this.type.style();if(this.type.content&&typeof this.type.content=="function")this.type.content=this.type.content();this.pos=[i[0],Math.random()*(i[1]-this.type.height)];this.item=$('<div class="thing thing-'+this.type.name+'">'+(this.type.content||"")+"</div>");this.item.css(this.type.style);this.item.css("transform","translate"+(Modernizr.csstransforms3d?"3d":"")+"("+this.pos[0]+"px, "+this.pos[1]+"px"+(Modernizr.csstransforms3d?", 0px":"")+")");this.item.appendTo("#game");if(typeof this.type.create=="function")this.type.create();this.tickFn=o.tickFunctionAdd(function(){n.itemTick()})};var h=c.prototype;h.itemTick=function(){this.pos[0]-=this.speed*o.itemSpeed*o.speedMultiplier;if(this.pos[0]<-this.type.width){this.destroy();return false}this.item.css(this.type.style).css("transform","translate"+(Modernizr.csstransforms3d?"3d":"")+"("+this.pos[0]+"px, "+this.pos[1]+"px"+(Modernizr.csstransforms3d?", 0px":"")+")")};h.boom=function(e){createExplosion(this.pos[0],this.pos[1]+this.type.height/2,e)};h.destroy=function(e){e&&this.boom(e);o.tickFunctionRemove(this.tickFn);this.item.remove();delete s[this.id]};h.bang=function(e){return this.type.bang(e,this)};var p=function(e){do{var t=Object.keys(thingTypes)[Math.floor(Math.random()*Object.keys(thingTypes).length)]}while(!(thingTypes[t].role in e));return t};var d=(new Date).getTime();var v=function(){var e=(new Date).getTime(),t=e-(d||e);if(t>o.addThingMinTime){d=e;var n="i"+Math.random();s[n]=new c(l=="random"?p(Math.random()<.2?{bad:true}:{good:true}):l,n)}};var m=function(){var e=[],t=[];for(var n in r){if(r[n].disabled)continue;if(!e[n]){e[n]=new Polygon({x:0,y:0},"#00FF00");e[n].addAbsolutePoint([r[n].pos[0],r[n].pos[1]+43]);e[n].addAbsolutePoint([r[n].pos[0]+24,r[n].pos[1]+43]);e[n].addAbsolutePoint([r[n].pos[0]+24,r[n].pos[1]+0]);e[n].addAbsolutePoint([r[n].pos[0]+53,r[n].pos[1]+6]);e[n].addAbsolutePoint([r[n].pos[0]+79,r[n].pos[1]+19]);e[n].addAbsolutePoint([r[n].pos[0]+101,r[n].pos[1]+23]);e[n].addAbsolutePoint([r[n].pos[0]+122,r[n].pos[1]+34]);e[n].addAbsolutePoint([r[n].pos[0]+149,r[n].pos[1]+53]);e[n].addAbsolutePoint([r[n].pos[0]+122,r[n].pos[1]+73]);e[n].addAbsolutePoint([r[n].pos[0]+101,r[n].pos[1]+83]);e[n].addAbsolutePoint([r[n].pos[0]+80,r[n].pos[1]+89]);e[n].addAbsolutePoint([r[n].pos[0]+53,r[n].pos[1]+101]);e[n].addAbsolutePoint([r[n].pos[0]+24,r[n].pos[1]+105]);e[n].addAbsolutePoint([r[n].pos[0]+24,r[n].pos[1]+65]);e[n].addAbsolutePoint([r[n].pos[0]+4,r[n].pos[1]+65])}for(var i in s){if(!t[i]){t[i]=new Polygon({x:0,y:0},"#0000FF");t[i].addAbsolutePoint([s[i].pos[0],s[i].pos[1]]);t[i].addAbsolutePoint([s[i].pos[0]+s[i].type.width,s[i].pos[1]]);t[i].addAbsolutePoint([s[i].pos[0]+s[i].type.width,s[i].pos[1]+s[i].type.height]);t[i].addAbsolutePoint([s[i].pos[0],s[i].pos[1]+s[i].type.height])}var u=e[n].intersectsWith(t[i]);if(u){if(s[i].type.bangMusic)o.play(s[i].type.bangMusic);s[i].bang(r[n])}}}};var g=function(e,t){this.moveValue=1.5;this.id=t;this.disabled=false;this.pos=[-160,0];this.max=[6,6];this.starCount=0;this.score=0;this.speed=[0,0];this.moving=[0,0];this.dimensions=[150,106];this.color=e||["yellow","green","blue","red"][Math.floor(Math.random()*4)];this.elka=$('<div class="elka elka-'+this.color+' elka-normal"><i class="i0"></i><i class="i1"></i><i class="i2"></i>'+'<i class="i3"></i><i class="i4"></i><i class="i5"></i><b class="star"></b></div>');this.elka.appendTo("#game");this.elkaStar=this.elka.find(".star");var n=this;this.introFn=o.tickFunctionAdd(function(){n.intro()})};var h=g.prototype;h.intro=function(){var e=this;if(this.pos[0]<0){this.pos[0]+=5;this.elka.css("transform","translate"+(Modernizr.csstransforms3d?"3d":"")+"("+this.pos[0]+"px, "+this.pos[1]+"px"+(Modernizr.csstransforms3d?", 0px":"")+")")}else{o.tickFunctionRemove(this.introFn);this.tickFn=o.tickFunctionAdd(function(){e.playerTick()})}};h.outtro=function(){o.tickFunctionRemove(this.tickFn);var e=this;this.outFn=o.tickFunctionAdd(function(){e.getOut()})};h.getOut=function(){var e=this;if(this.pos[0]<i[0]+200){this.pos[0]+=20;this.elka.css("transform","translate"+(Modernizr.csstransforms3d?"3d":"")+"("+this.pos[0]+"px, "+this.pos[1]+"px"+(Modernizr.csstransforms3d?", 0px":"")+")")}else{o.tickFunctionRemove(this.outFn);o.playerGotOut()}};h.destroy=function(){this.disabled=true;this.posChangedManually=true;var e=this;o.play("boom1");createExplosion(this.pos[0]+75,this.pos[1]+53,"#ff0");e.elka.remove();delete r[e.id]};h.star=function(){this.starCount++;this.elkaStar.text(this.starCount);this.elka[this.starCount?"addClass":"removeClass"]("elka-star")};h.shot=function(){if(!this.starCount||this.wasShot)return false;this.starCount--;this.wasShot=true;this.elkaStar.text(this.starCount);if(!this.starCount)this.elka.removeClass("elka-star");var e=$('<div class="shot"></div>'),t=[this.pos[0]+122,this.pos[1]+40];e.css({left:t[0],top:t[1],width:i[0]});e.appendTo("#game");var n=this;setTimeout(function(){n.wasShot=false;e.hide().remove()},250);for(var u in s){if(s[u].pos[0]>=t[0]&&!(t[1]+28<s[u].pos[1])&&!(s[u].pos[1]+s[u].type.height<t[1])){if(s[u].type.name=="box"){var a="i"+Math.random();s[a]=new c(p({secret:true}),a);s[a].pos=[s[u].pos[0],s[u].pos[1]]}s[u].boom("#fdc501");s[u].destroy("#fdd957");this.score+=5}}for(var u in r){if(r[u].pos[0]>=t[0]&&!(t[1]+28<r[u].pos[1])&&!(r[u].pos[1]+106<t[1])){r[u].destroyConsole();r[u].score-=50}}o.play("laser")};h.destroyConsole=function(){if(!this.thingFb){var e=this;this.speed=[0,0];this.moving=[0,0];this.thingFb=true;f(100,100,function(){e.elka.removeClass("elka-frozen");e.pos[0]+=Math.random()*3-6;e.pos[1]+=Math.random()*3-6},function(){e.elka.addClass("elka-frozen");e.pos[0]+=Math.random()*3-6;e.pos[1]+=Math.random()*3-6},function(){e.elka.removeClass("elka-frozen");e.thingFb=false})}};h.slowSpeed=function(){var e=this;this.speed=[0,0];this.moving=[0,0];this.max=[2,2];this.elka.addClass("elka-frozen");if(this.thingSf)clearTimeout(this.thingSf);this.thingSf=setTimeout(function(){f(5,100,function(){e.elka.removeClass("elka-frozen")},function(){e.elka.addClass("elka-frozen")},function(){e.elka.removeClass("elka-frozen");e.max=[6,6]})},1e4)};h.playerTick=function(){var e=[this.pos[0],this.pos[1]];$("#scores ."+this.color+"-text span").text(this.score);this.speed[0]+=this.moving[0];if(!this.moving[0]&&this.speed[0]){var t=this.speed[0]>0;this.speed[0]+=this.speed[0]>0?-this.moveValue*500:this.moveValue*500;if(t&&this.speed[0]<0)this.speed[0]=0}if(this.speed[0]>this.max[0])this.speed[0]=this.max[0];if(this.speed[0]<-this.max[0])this.speed[0]=-this.max[0];this.speed[1]+=this.moving[1];if(!this.moving[1]&&this.speed[1]){var t=this.speed[1]>0;this.speed[1]+=this.speed[1]>0?-this.moveValue*500:this.moveValue*500;if(t&&this.speed[1]<0)this.speed[1]=0}if(this.speed[1]>this.max[1])this.speed[1]=this.max[1];if(this.speed[1]<-this.max[1])this.speed[1]=-this.max[1];this.speed[0]=parseFloat(this.speed[0].toFixed(3));this.speed[1]=parseFloat(this.speed[1].toFixed(3));this.pos[0]+=this.speed[0];this.pos[1]+=this.speed[1];if(this.pos[0]<0){this.pos[0]=0;this.speed[0]=0}if(this.pos[1]<0){this.pos[1]=0;this.speed[1]=0}if(this.pos[0]+this.dimensions[0]>i[0]){this.pos[0]=i[0]-this.dimensions[0];this.speed[0]=0}if(this.pos[1]+this.dimensions[1]>i[1]){this.pos[1]=i[1]-this.dimensions[1];this.speed[1]=0}if(e[0]!=this.pos[0]||e[1]!=this.pos[1]||this.thingFb||this.posChangedManually)this.elka.css("transform","translate"+(Modernizr.csstransforms3d?"3d":"")+"("+this.pos[0]+"px, "+this.pos[1]+"px"+(Modernizr.csstransforms3d?", 0px":"")+")")};this.players=r;this.startGame=function(){clearInterval(window.ciInnder);$(".snowWrap .snow").remove();socket.emit("game started",{gameID:this.gameID});this.tickEvent();this.thingFn=this.tickFunctionAdd(v);this.interFn=this.tickFunctionAdd(m);var e=0;for(var t in r){r[t].pos[1]=e*110;r[t].intro()}this.tickFunctionAdd(function(){a.clearRect(0,0,a.canvas.width,a.canvas.height);update(1e3/60,a)})};this.newPlayer=function(e,t){r[e]=new g(t,e)};this.endGame=function(){this.tickFunctionRemove(this.thingFn);var e=this;setTimeout(function(){e._endGame()},5e3)};this._endGame=function(){this.tickFunctionRemove(this.interFn);for(var e in r)r[e].outtro();var t=this,n=(this.bgSpeed-1)/20;f(20,100,function(){t.bgSpeed-=n},function(){t.bgSpeed-=n})};var y=0;this.playerGotOut=function(){y++;if(y>=Object.keys(r).length){this.showScore()}};this.showScore=function(){var e="",t={};for(var n in r){if(r[n].name)t[n]=r[n].score;e+='<tr><td><div class="avatar">'+(r[n].pic?'<img src="'+r[n].pic+'" />':"")+"</div></td><td>"+(r[n].name||r[n].color+" tree")+"</td><td>"+parseInt(r[n].score)+"</td></tr>"}socket.emit("end game",{gameID:this.gameID});if(Object.keys(t).length){socket.emit("game results",{gameID:this.gameID,players:t})}$(".finish_table").html(e);$(".finish_screen").fadeIn(function(){$("#game").hide()})};this.play=function(e){if(musicStop||!audios[e])return false;var t=context.createBufferSource();t.buffer=audios[e];destination=context.destination;t.connect(destination);t.start(0)}};$(function(){function i(e){$(".front_elka_"+(e+1)).find("div").eq(r[e]).addClass("elka_animate");r[e]=r[e]-1;if(r[e]>=0){setTimeout(function(){i(e)},70)}else{setTimeout(function(){$(".front_elka_"+(e+1)).find("div").removeClass("elka_animate");r[e]=5},1e3)}}function u(){i(s);s++;if(s<=3){setTimeout(u,800)}else{s=0;if(o)setTimeout(u,5e3)}}function f(){var e=Object.keys(t.players);var n=function(){if(e.length){var r=e.shift(),i=t.players[r];$(".intro_elka_"+a[i.color]).addClass("color");setTimeout(n,800)}else{l()}};n()}function l(){var e=$(".intro_elka.color:not(.go_up)");if(e.length){e.addClass("go_up");setTimeout(l,200)}else{setTimeout(c,1e3)}}function c(){$(".first_screen").fadeOut(800,function(){$("#game").fadeIn(function(){t.startGame();n=true;setInterval(function(){t.speedMultiplier+=.5},6e4);setTimeout(function(){t.endGame(e)},18e4)})})}socket=io.connect("http://2014.studio38.ru:8089");var e;var t=new Game,n=false;socket.emit("newGame");socket.on("id",function(r){e=r.id;t.gameID=e;$(".second_screen_code").text(e);socket.on("system",function(e){switch(e.status){case"player-off":$("#av_"+e.playerID).html("").attr({id:"","class":"no-user"});$("#scores ."+t.players[e.playerID].color+"-text").remove();t.players[e.playerID].destroy();$(".start_btn")[Object.keys(t.players).length?"removeClass":"addClass"]("disabled");if(n&&!Object.keys(t.players).length)top.location.reload();break;case"new player":var r=$(".players_ico .no-user:first");r.attr({id:"av_"+e.playerID,"class":e.color+" authorization"+(e.pic?"":" no_ava")});if(e.pic)r.html('<img src="'+e.pic+'" />');t.newPlayer(e.playerID,e.color);t.players[e.playerID].name=e.name||"";t.players[e.playerID].pic=e.pic||"";$("#scores tr").append('<td class="players_ico '+e.color+'-text"><li class="'+e.color+" authorization"+(e.pic?"":" no_ava")+'">'+(e.pic?'<img src="'+e.pic+'" />':"")+"</li><span>0</span></td>");$(".start_btn")[Object.keys(t.players).length?"removeClass":"addClass"]("disabled");break}});socket.on("move",function(e){if(n){t.players[e.playerID].moving[0]=e.x==0?0:(e.x>0?1:-1)*t.players[e.playerID].moveValue;t.players[e.playerID].moving[1]=e.y==0?0:(e.y>0?1:-1)*t.players[e.playerID].moveValue}else{$("#av_"+e.playerID).css("transform","translate"+(Modernizr.csstransforms3d?"3d":"")+"("+e.x/10+"px, "+e.y/10+"px"+(Modernizr.csstransforms3d?", 0px":"")+")")}});socket.on("shot",function(e){if(n){t.players[e.playerID].shot()}})});var r=[5,5,5,5];var s=0,o=true;u();$(".first_btn").click(function(){o=false;$(".front_elka_wrap_inner").fadeOut(800);$(".first_screen_center").fadeOut(800,function(){$(".animate_wrap").fadeIn()})});var a={blue:1,yellow:2,red:3,green:4};$(".start_btn").click(function(){if(!Object.keys(t.players).length)return false;$(".animate_wrap").addClass("startanimate");setTimeout(f,2500)});window.audios={};window.AudioContext=window.AudioContext||window.webkitAudioContext;context=new AudioContext,source=context.createBufferSource();var h=function(e,t){var n=new XMLHttpRequest;n.open("GET","/audio/"+e+".mp3",true);n.responseType="arraybuffer";n.onload=function(n){context.decodeAudioData(this.response,function(n){window.audios[e]=n;if(typeof t=="function")t(e)})};n.send()};var p=function(e){for(var t in e)h(e[t],d)};var d=function(e){if(e=="maintheme"){$(".sound_ico").show().on("click",function(){if($(this).hasClass("disabled")){source=context.createBufferSource();source.buffer=audios["maintheme"];destination=context.destination;source.connect(destination);source.loop=true;source.start(0)}else{source.stop(0)}$(this).toggleClass("disabled");musicStop=!musicStop}).click()}};var v=function(e){for(var t in e){var n=document.createElement("img");n.src="/gfx/"+e[t]+".png"}};p(["maintheme","ting","ting2","ting3","laser","take2","xmas_fast","wooff-wooff","ha-ha","ho-ho-ho","uskorenie","glass","boom1"]);for(var m=1;m<4;m++)for(var g=1;g<[0,6,9,9][m];g++)v(["bg"+m+"-"+g]);v(["e1","e2","e3","e4","items"]);window.rnd=function(e,t){return Math.ceil(Math.random()*t+e)};if($(".snowWrap").length>0){var y=0;window.ciInnder=setInterval(function(){var e=Math.ceil(Math.random()*10);for(var t=0;t<e;t++){y=y+1;var n=Math.ceil(rnd(0,$(window).width())),r=Math.ceil(rnd(0,$(window).height()/6));$(".snowWrap").append('<i id="cnInnder'+y+'" class="snow" style="top: '+r+"px; left: "+n+'px"></i>');var i=$("#cnInnder"+y);$(i).animate({left:n+parseInt((Math.random()-.5)*6)*32,top:$(".snowWrap").outerHeight()-50},5e3,"linear",function(){$(this).addClass("notransition").animate({opacity:0},function(){$(this).remove()})}).addClass("fade")}},500)}});(function(){var e=0;var t=["ms","moz","webkit","o"];for(var n=0;n<t.length&&!window.requestAnimationFrame;++n){window.requestAnimationFrame=window[t[n]+"RequestAnimationFrame"];window.cancelAnimationFrame=window[t[n]+"CancelAnimationFrame"]||window[t[n]+"CancelRequestAnimationFrame"]}if(!window.requestAnimationFrame)window.requestAnimationFrame=function(t,n){var r=(new Date).getTime();var i=Math.max(0,16-(r-e));var s=window.setTimeout(function(){t(r+i)},i);e=r+i;return s};if(!window.cancelAnimationFrame)window.cancelAnimationFrame=function(e){clearTimeout(e)}})();Polygon.prototype.addPoint=function(e){this.points.push({x:e[0],y:e[1]})};Polygon.prototype.addAbsolutePoint=function(e){this.points.push({x:e[0]-this.center.x,y:e[1]-this.center.y})};Polygon.prototype.getNumberOfSides=function(){return this.points.length};Polygon.prototype.rotate=function(e){for(var t=0;t<this.points.length;t++){var n=this.points[t].x;var r=this.points[t].y;this.points[t].x=Math.cos(e)*n-Math.sin(e)*r;this.points[t].y=Math.sin(e)*n+Math.cos(e)*r}};Polygon.prototype.draw=function(e){e.save();e.fillStyle=this.color;e.beginPath();e.moveTo(this.points[0].x+this.center.x,this.points[0].y+this.center.y);for(var t=1;t<this.points.length;t++){e.lineTo(this.points[t].x+this.center.x,this.points[t].y+this.center.y)}e.closePath();e.fill();e.restore()};Polygon.prototype.containsPoint=function(e){var t=this.points.length;var n=e.x;var r=e.y;var i=new Array;for(var s=0;s<this.points.length;s++){i.push(this.points[s].x+this.center.x)}var o=new Array;for(var u=0;u<this.points.length;u++){o.push(this.points[u].y+this.center.y)}var a,f=0;var l=false;for(a=0,f=t-1;a<t;f=a++){if(o[a]>r!=o[f]>r&&n<(i[f]-i[a])*(r-o[a])/(o[f]-o[a])+i[a])l=!l}return l};Polygon.prototype.intersectsWith=function(e){var t=new Point;var n,r,i,s,o;var u,a;var f=null;var l=99999999;for(u=0;u<this.getNumberOfSides();u++){if(u==0){t.x=this.points[this.getNumberOfSides()-1].y-this.points[0].y;t.y=this.points[0].x-this.points[this.getNumberOfSides()-1].x}else{t.x=this.points[u-1].y-this.points[u].y;t.y=this.points[u].x-this.points[u-1].x}n=Math.sqrt(t.x*t.x+t.y*t.y);t.x/=n;t.y/=n;r=i=this.points[0].x*t.x+this.points[0].y*t.y;for(a=1;a<this.getNumberOfSides();a++){n=this.points[a].x*t.x+this.points[a].y*t.y;if(n>i)i=n;else if(n<r)r=n}n=this.center.x*t.x+this.center.y*t.y;r+=n;i+=n;s=o=e.points[0].x*t.x+e.points[0].y*t.y;for(a=1;a<e.getNumberOfSides();a++){n=e.points[a].x*t.x+e.points[a].y*t.y;if(n>o)o=n;else if(n<s)s=n}n=e.center.x*t.x+e.center.y*t.y;s+=n;o+=n;if(i<s||r>o){return false}else{var c=i>s?i-s:o-r;if(c<l){l=c;f={x:t.x,y:t.y}}}}for(u=0;u<e.getNumberOfSides();u++){if(u==0){t.x=e.points[e.getNumberOfSides()-1].y-e.points[0].y;t.y=e.points[0].x-e.points[e.getNumberOfSides()-1].x}else{t.x=e.points[u-1].y-e.points[u].y;t.y=e.points[u].x-e.points[u-1].x}n=Math.sqrt(t.x*t.x+t.y*t.y);t.x/=n;t.y/=n;r=i=this.points[0].x*t.x+this.points[0].y*t.y;for(a=1;a<this.getNumberOfSides();a++){n=this.points[a].x*t.x+this.points[a].y*t.y;if(n>i)i=n;else if(n<r)r=n}n=this.center.x*t.x+this.center.y*t.y;r+=n;i+=n;s=o=e.points[0].x*t.x+e.points[0].y*t.y;for(a=1;a<e.getNumberOfSides();a++){n=e.points[a].x*t.x+e.points[a].y*t.y;if(n>o)o=n;else if(n<s)s=n}n=e.center.x*t.x+e.center.y*t.y;s+=n;o+=n;if(i<s||r>o){return false}else{var c=i>s?i-s:o-r;if(c<l){l=c;f={x:t.x,y:t.y}}}}return{overlap:l+.001,axis:f}};var particles={}