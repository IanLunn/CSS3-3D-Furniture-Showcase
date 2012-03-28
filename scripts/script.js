$(document).ready(function(){
	transformsSupported = Modernizr.csstransforms3d;
	prefixedProperty = Modernizr.prefixed('transform');
	rAFSupported = Modernizr.prefixed('requestAnimationFrame', window);
		
	var isRotating = false,
		isShowcasing = false,
		rotatingTimer,
		rotateY = -20,
		videoPlaying = false,
		transition = false;
	
	if(transformsSupported && rAFSupported){ //if perspective is supported, go to town...
		$("#room1").show();
		$("#products").hide();
		initShowcase();
	}else{ //if perspective isn't supported, fallback to the basic product list and let the user know they're missing out on the good stuff
		$("#browser-support").show();
	}
	
	function initShowcase(){
		$room = $("#room1 .room");
		$showcase = $("#showcase");
		
		//more info about this function here: 
		//http://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
		function animLoop(render){
		    var lastFrame = +new Date;
		    function loop(now){
	            request = requestAnimationFrame(loop);
	            running = render(now - lastFrame);
	            lastFrame = now;
		    }
		    loop(lastFrame);
		}
	
		$(window).keydown(function(e){
			if(!isShowcasing){
				if(e.keyCode == 37 && !isRotating){ //left
					isRotating = true;
					$room.addClass("hide-desc").removeClass("showcase");
					animLoop(function(){
					    rotateY -= .4;
					    $room.css(prefixedProperty, "rotateY(" + rotateY + "deg) ");
					});
					
				}else if(e.keyCode == 39 && !isRotating){ //right	
					isRotating = true;
					$room.addClass("hide-desc").removeClass("showcase");
					animLoop(function(){
					    rotateY += .4;
					    $room.css(prefixedProperty, "rotateY(" + rotateY + "deg) ");
					});
				}
			}else{
				isShowcasing = false;
				$room.addClass("hide-desc").removeClass("showcase");
				cancelRequestAnimationFrame(request);
				switchShowcaseButton();
			}
		});
		
		$(window).keyup(function(e){
			if(e.keyCode == 37 || e.keyCode == 39){
				cancelRequestAnimationFrame(request);
				isRotating = false;
			}
		});
		
		function showcase(){
			$room.addClass("showcase");
			if(rotateY != -20){
				transition = true;
				$room.animate({"opacity": 0}, 500, function(){ //hide the room for a sec...
					rotateY = -20;
					$room.css(prefixedProperty, "rotateY(" + rotateY + "deg) ");	
					$(this).animate({"opacity": 1}, 500);
					transition = false;
					animLoop(function(){
					    rotateY += .4;
					    $room.css(prefixedProperty, "rotateY(" + rotateY + "deg) ");
					});
				});
			}else{
				animLoop(function(){
				    rotateY += .4;
				    $room.css(prefixedProperty, "rotateY(" + rotateY + "deg) ");
				});
			}			
		}
		
		function switchShowcaseButton(){
			var src = $showcase.attr("src"),
				newSrc;
			if(src.indexOf("off") != -1){
				newSrc = src.replace("off", "on");
			}else{
				newSrc = src.replace("on", "off");
			}
			$showcase.attr("src", newSrc);
		}
		
		$showcase.click(function(){
			if(!transition){
				switchShowcaseButton();
				if(!isShowcasing){
					isShowcasing = true;
					showcase();
				}else{
					$room.removeClass("showcase");
					cancelRequestAnimationFrame(request);
					isRotating = false;
					isShowcasing = false;
				}
			}
		});
		
		$("#click-remote").click(function(){
			if(!videoPlaying){
				videoPlaying = true;
				$("video").show();
				$("video")[0].play(); 
			}else{
				videoPlaying = false;
				$("video").hide();
				$("video")[0].pause();
			}
		});
	}
});