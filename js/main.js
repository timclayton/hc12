$(document).ready(function(){

		var totalImages = 131;
		var count = 0; //number of images loaded
		var images = [];
		var urlArray = [];
		
		
		function updateImageDisplay() {
			count++;
		    var displayContainer = document.getElementById('percent-text');
		    var percent = Math.floor( (count/totalImages) * 100 ) + "%";
		    displayContainer.innerHTML = percent; 
			
		}
		

	 	function countImages() {

    		$('#maincontent').find('div').each(function(){
    			
    			if($(this).css('background-image') != 'none') {
    				var url = $(this).css('background-image').replace(/^url\("?([^\"\))]+)"?\)$/i, '$1'); ;
    				urlArray.push(url);
    			}
    		});

    		for(var i=0;i<urlArray.length;i++) {
    			var image = new Image();
    			image.src = urlArray[i];
    			images.push(image);
		    	images[i].onload = function () { updateImageDisplay();  }
		    	images[i].onerror= function(){  }//imageloadpost() }

			}
    	}

	countImages();
	
	$("#info-toggle").click(function() {
		$("#info-box").fadeToggle();
	});
	
	$("section").click(function() {
		$("#info-box").fadeOut();
	})
	
});


window.onload = function() {

	var showMainContent = function() {
		$("#maincontent").fadeIn(2000);
		$("#preload").fadeOut(2000);
	}

	showMainContent();

	function getsupportedprop(proparray){
		var root=document.documentElement //reference root element of document
		for (var i=0; i<proparray.length; i++){ //loop through possible properties
			if (typeof root.style[proparray[i]]=="string"){ //if the property value is a string (versus undefined)
				return proparray[i] //return that string
			}
		}
	}
	
		var 		s							= 	window.pageYOffset,  //  get scrollTop value 
					d							=  document.body.clientHeight,
					wh						=  window.innerHeight, 
					sPercent				=  1,
					gPercent				=  s / (d-wh),	
					pos 						=	Math.floor( sPercent ),  //  calculated position,
					body						=  document.querySelector("body");
					sections 				=  document.querySelectorAll("section");
					scenes 				=  new Array(),
					musicFiles			=  document.querySelectorAll(".music"),
					musicVol				=  .5,
					narrationFiles		=  document.querySelectorAll(".narration"),
					narrationVol			=  1,
					audioDisabled		=  false,
					audioReset			=  false,
					play						=  document.getElementById("play"),
					playing					=  false,
					playToggle			=  document.getElementById("play-toggle"),
					audioToggle			=  document.getElementById("audio-toggle"),
					fastforward			=  document.getElementById("fastforward"),
					rewind					=  document.getElementById("rewind"),
					currentScene			=  document.getElementById("scene" + pos),
					csstransform 		=  getsupportedprop(['transform', 'MozTransform', 'WebkitTransform', 'msTransform', 'OTransform']),
					transformMaps 		=  new Array();
					
	window.onresize = function() {
		
					wh						= window.innerHeight;
					//setBgHeight();
		
	}
	
	window.onscroll = function() {
					s 							= 	window.pageYOffset;  //  get scrollTop value
					gPercent				=  s / (d-wh),	// global percent value
					pos 						=	Math.floor( sPercent );  //  calculated position
					
		scenes.forEach(setPos, this);
		transforms[0].forEach(transform, this);
		transforms[pos].forEach(transform, this);
		classShifts[0].forEach(shiftClass, this);
		classShifts[pos].forEach(shiftClass, this);
		
		if ( !playing && !audioReset ) {
			resetAudio();
			audioReset = true;
		}
		
	}
	
	var resetAudio = function() {
	
		var stopSceneAudio = function(element) {
	
			if ( element.type === "music" ) {
				element.id.pause();
				element.id.currentTime = 0;
				element.id.className = "music";
			}
			else if ( element.type === "narration" ) {
				element.id.pause();
				element.id.currentTime = 0;
				element.id.className = "narration";
			}
		
		}
		
		for ( i = 0; i < sections.length; i++ ) {
			transforms[i].forEach(stopSceneAudio, this);
		}
	
	}
					
	var pauseAllAudio = function(inProgress) {
	
		for ( i = 0; i < musicFiles.length; i++ ) {
	
			if ( !musicFiles[i].paused ) {
				musicFiles[i].pause();
				musicFiles[i].className = inProgress ?  "music paused-in-progress" : "music";
			}
		
		}
		
		for ( i = 0; i < narrationFiles.length; i++ ) {
	
			if ( !narrationFiles[i].paused ) {
				narrationFiles[i].pause();
				narrationFiles[i].className = inProgress ? "narration paused-in-progress" : "narration";
			}
		
		}
	
	}
					
	var restartAudio = function() {
	
		for ( i = 0; i < musicFiles.length; i++ ) {
	
			if ( musicFiles[i].className === "music paused-in-progress" ) {
				musicFiles[i].play();
				musicFiles[i].className = "music";
			}
		
		}
		
		for ( i = 0; i < narrationFiles.length; i++ ) {
	
			if ( narrationFiles[i].className === "narration paused-in-progress" ) {
				narrationFiles[i].play();
				narrationFiles[i].className = "narration";
			}
		
		}
	
	}	
	
	var fadeInAudio = function(file, fadeTo, fadeSpeed) {
		
		file.volume = 0;
		file.play();
			
		var vol = 0;
		var fadeInterval = setInterval(function() {
		
			if ( vol < musicVol ) {
				vol += 0.05;
				file.volume = vol.toFixed(2);
			} 
			
			else {
				clearInterval(fadeInterval);
			}
			
		}, fadeSpeed);
	
	}
	
	var fadeOutAudio = function(file, fadeTo, fadeSpeed) {
	
		if ( file.volume > 0 ) {
			
			var vol = file.volume;
			var fadeInterval = setInterval(function() {
			
				if ( vol > 0 ) {
					vol -= 0.05;
					file.volume = vol.toFixed(2);
				} 
				
				else {
					clearInterval(fadeInterval);
					file.pause();
					file.currentTime = 0;
				}
				
			}, fadeSpeed);
			
		}
	
	}
	
	var toggleAudio = function(file, fadeTo, fadeSpeed) {
		
		if ( fadeTo > 0 ) {
			fadeInAudio(file, fadeTo, fadeSpeed);
		}
		
		else {
			fadeOutAudio(file, fadeTo, fadeSpeed);
		}
		
	}
	
	var duplicate = function(element) {
		if ( element.repeat > 1 ) {  //  If the element loops, duplicate the order 
			var order = element.order
			for ( var i = 1; i < element.repeat; i++ ) {
				var newOrder = element.order.concat(order);
				element.order = newOrder;
			}
		}
		element.total = element.order.length;
	}
	
	var calcPercent = function(a,b,c) {	
		
		if ( a <= b ) { return 0 }
		else { return a >= c ? 1 : ( a - b ) / ( c - b ) }
	
	}
	
	var calcSum = function(a,b) {
		return a + b;
	}
	
	var setPos = function(element) {
	
		var 		animPercent =  calcPercent(s,element.start,element.end);
		if (animPercent !== 0 && animPercent !== 1) { 
			sPercent = element.scene + animPercent; 
		}  
	}

	var transform = function(element, index, array) {
		
		if ( array === transforms[0] ) { var animPercent = calcPercent(gPercent,element.start,element.end); }  // global transforms 
		else { var animPercent = calcPercent(sPercent,element.start,element.end); }  //  scene specific transforms
		
		var		x				= element.x * animPercent,
					y				= element.y * animPercent;

		if ( element.type === "translate" ) {
			
			transformMaps[element.map].translate[0][element.mapPos] = x;
			transformMaps[element.map].translate[1][element.mapPos] = y;
			
			element.id.style[csstransform]='translate(' + transformMaps[element.map].translate[0].reduce(calcSum) + 'px,' + transformMaps[element.map].translate[1].reduce(calcSum) + 'px)';
			
		}
		
		else if ( element.type === "opacity" ) {
			
			transformMaps[element.map].opacity[element.mapPos] = x;
			
			element.id.style.opacity=transformMaps[element.map].opacity.reduce(calcSum);
			
		}
		
		else if ( element.type === "bgShift" ) {
			
			transformMaps[element.map].bgShift[0][element.mapPos] = x;
			transformMaps[element.map].bgShift[1][element.mapPos] = y;
			
			element.id.style.backgroundPosition=transformMaps[element.map].bgShift[0].reduce(calcSum) + "%" + (100 - transformMaps[element.map].bgShift[1].reduce(calcSum)) + "%";
			
		}
		
		else if ( element.type === "scale" ) {


			
		 	transformMaps[element.map].scale[0][element.mapPos] = x + 1;
		 	transformMaps[element.map].scale[1][element.mapPos] = y + 1;
			
		 	element.id.style[csstransform]='scale(' + transformMaps[element.map].scale[0].reduce(calcSum) + ',' + transformMaps[element.map].scale[1].reduce(calcSum) + ')';
			
		 }
		
		else if ( element.type === "size" ) {
					
			transformMaps[element.map].size[0][element.mapPos] = x;
			transformMaps[element.map].size[1][element.mapPos] = y;
			
			element.id.style.width=transformMaps[element.map].size[0].reduce(calcSum) + '%';
			element.id.style.height=transformMaps[element.map].size[1].reduce(calcSum) + '%';
			
		}
		
		else if ( playToggle.className === "playing" ) {
		
			if ( element.type === "narration" && animPercent > 0 && animPercent < 1 ) {
			
				if ( !element.triggered ) {
					element.id.volume = narrationVol;
					element.id.play();
					element.triggered = true;
				}
			
			}
			
			else if ( element.type === "music" && animPercent > 0 && animPercent < 1 ) {
			
				if ( !element.triggered ) {
					toggleAudio(element.id, element.x, 100);
					element.triggered = true;
				}
			
			}
			
			if ( animPercent === 1 || animPercent === 0 ) {
				element.triggered = false;
			}
			
			if ( audioDisabled ) {
				element.id.pause();
			}
		
		}
			
	}
	
	var shiftClass = function(element, index, array) {
	
		if ( array === classShifts[0] ) { var animPercent = calcPercent(gPercent,element.start,element.end); }  // global transforms 
		else { var animPercent = calcPercent(sPercent,element.start,element.end); }  //  scene specific transforms
		
		var orderPos = element.order[Math.floor( element.total * animPercent )];
		if ( orderPos !== undefined ) { element.id.className = element.prefix + orderPos; }
	
	}
	
	var scrollToEnd = function() {
        autoScroll = setInterval(scrollIncrement, 30);
    }
	
	var scrollIncrement = function() {
		s < d - wh ? window.scrollBy(0,15) : stopScroll(true);
	}
	
	var stopScroll = function(end) {
		clearInterval(autoScroll);
		playToggle.className = end ? "restart" : "paused";
		playing = false;
	}
	
	var createTransformMaps = function() {
	
		var elements = new Array(),
				mapNumber,
				mapPos = 0;
		
		var assignMap = function(element) {
			var 	el = element.id.outerHTML,
					opacity = element.fade === "out" ? 1 : 0;
			
			if ( elements.indexOf(el) < 0 ) {
				elements.push(el);
				var map = new Object({
					translate: [[0],[0]],
					size: [[0],[0]],
					bgShift: [[0],[0]],
					opacity: [0,opacity],
					scale: [[1],[1]],
					totalTransforms: 0
				});
				transformMaps.push(map);
				mapNumber = transformMaps.length - 1;
				element.mapPos = 0;
			}
			
			else {
				mapNumber = elements.indexOf(el);
				transformMaps[mapNumber].totalTransforms + 1;
				transformMaps[mapNumber].translate[0].push(0);
				transformMaps[mapNumber].translate[1].push(0);
				transformMaps[mapNumber].size[0].push(0);
				transformMaps[mapNumber].size[1].push(0);
				transformMaps[mapNumber].bgShift[0].push(0);
				transformMaps[mapNumber].bgShift[1].push(0);
				transformMaps[mapNumber].scale[0].push(1);
				transformMaps[mapNumber].scale[1].push(1);
				transformMaps[mapNumber].opacity.push(opacity);
				transformMaps[mapNumber].totalTransforms += 1;
				element.mapPos = transformMaps[mapNumber].totalTransforms;
			}
			
			element.map = mapNumber;
			
		}
	
		for (var i = 0; i < transforms.length; i++) {
		
			transforms[i].forEach(assignMap, this);
		
		}
		
	}
	
	var createSceneObjects = function() {
		
		var start = 0;
	
		for (var i = 0; i < sections.length; ++i) {
			var 	item = sections[i],
					height = parseInt(item.clientHeight),
					end = start + height,
					c = item.className;
					id = item.id
					newScene = new Object({
						id: id,
						scene: i + 1,
						height: height,
						start: start,
						end: end,
					});
			
			scenes.push(newScene);		
			start = end;
		}
	
	}
	
	var transforms = [	// First array holds global transforms, following are per scene
	
		[  // global
		
			{id:document.getElementById("candycane1"), start: 0.01, end: 0.04, x: 60, y: -400, type:"translate"},
		
		],
		
		[  // scene 1
			
			{id:document.getElementById("strike-through"), start: 1.1, end: 1.2, x: 100, y: 50, type:"size"},
			{id:document.getElementById("text-john-berndts"), start: 1.25, end: 1.4, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("text-how-the"), start: 1.6, end: 1.99, x: 0, y: -40, type:"translate"},
			{id:document.getElementById("text-grinch"), start: 1.6, end: 1.99, x: 0, y: -60, type:"translate"},
			{id:document.getElementById("text-stole"), start: 1.6, end: 1.99, x: 0, y: -80, type:"translate"},
			{id:document.getElementById("text-christmas"), start: 1.6, end: 1.99, x: 0, y: -100, type:"translate"},
			{id:document.getElementById("grinch-face"), start: 1.85, end: 1.99, x: 0, y: -300, type:"translate"},
			{id:document.getElementById("play"), start: 1.5, end: 1.7, x: -1, y: 0, type:"opacity", fade: "out"},
			{id:document.getElementById("controls"), start: 1.5, end: 1.7, x: 1, y: 0, type:"opacity"},
			
			{id:sections[0], start: 1.6, end: 1.99, x: -1, y: 0, type:"opacity", fade: "out"}
						
		],
		
		[  // scene 2
			
			
			{id:document.getElementById("s2t1"), start: 2.02, end: 2.08, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("s2t2"), start: 2.17, end: 2.21, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("s2t1"), start: 2.4, end: 2.44, x: -1, y: 0, type:"opacity"},
			{id:document.getElementById("s2t2"), start: 2.4, end: 2.44, x: -1, y: 0, type:"opacity"},
			{id:document.getElementById("near-cliff"), start:2.0, end:2.26, x: 80, y: -700, type:"translate"},
			{id:document.getElementById("far-cliff"), start:2.0, end:2.26, x: 0, y:-400, type:"translate"},
			{id:document.getElementById("s2bg"), start:2.0, end:2.26, x: 0, y:-50, type:"bgShift"},
			{id:document.getElementById("s2bg"), start:2.44, end:2.85, x: 0, y:-50, type:"bgShift"},
			{id:document.getElementById("near-cliff"), start:2.44, end:2.65, x: 1000, y: -800, type:"translate"},
			{id:document.getElementById("far-cliff"), start:2.44, end:2.65, x: 900, y:-600, type:"translate"},
			{id:document.getElementById("ledge"), start:2.13, end:2.26, x: 0, y:-354, type:"translate"},
			{id:document.getElementById("grinch"), start:2.13, end:2.26, x: 0, y: -696, type:"translate"},
			{id:document.getElementById("max"), start:2.13, end:2.26, x: 0, y:-354, type:"translate"},
			{id:document.getElementById("ledge"), start:2.44, end:2.6, x: 700, y:-500, type:"translate"},
			{id:document.getElementById("grinch"), start:2.44, end:2.6, x: 700, y: -500, type:"translate"},
			{id:document.getElementById("max"), start:2.44, end:2.6, x: 700, y:-500, type:"translate"},
			{id:document.getElementById("lights"), start:2.55, end:2.98, x: 100, y:-900, type:"translate"},
			{id:document.getElementById("s2t3"), start: 2.5, end: 2.58, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("s2t3"), start: 2.76, end: 2.8, x: -1, y: 0, type:"opacity"},
			{id:document.getElementById("back-row-houses"), start:2.58, end:2.98, x: 220, y:-870, type:"translate"},
			{id:document.getElementById("front-row-houses"), start:2.62, end:2.98, x: 260, y:-700, type:"translate"},
			{id:document.getElementById("lawn-ornaments"), start:2.66, end:2.98, x: 110, y:-480, type:"translate"},
			{id:document.getElementById("gate"), start:2.8, end:2.98, x: 0, y:-870, type:"translate"},
			
			{id:sections[1], start: 2.1, end: 2.13, x: 1, y: 0, type:"opacity"},
			{id:sections[1], start: 2.93, end: 2.99, x: -1, y: 0, type:"opacity"},
			
			{id:narrationFiles[0], start: 2.01, end: 2.2, x: 1, y: 0, type:"narration"}, // For type narration or music, x controls where volume goes to
			{id:narrationFiles[1], start: 2.52, end: 2.6, x: 1, y: 0, type:"narration"}
			
		],

		[ //scene 3
			
			{id:document.getElementById("s3t1"), start: 3.05, end: 3.15, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("s3t1"), start: 3.5, end: 3.55, x: -1, y: 0, type:"opacity"},
			{id:document.getElementById("front-snow"), start: 3.1, end: 3.99, x: 0, y: 200, type:"translate"},
			{id:document.getElementById("back-snow"), start: 3.1, end: 3.99, x: 0, y: 450, type:"translate"},
			{id:document.getElementById("grinch-transition"), start: 3.2, end: 3.99, x: 1, y: 1, type:"scale"},
			{id:document.getElementById("grinch-container"), start: 3.2, end: 3.99, x: 0, y: -350, type:"translate"},

			{id:sections[2], start: 3.2, end: 3.35, x: 1, y: 0, type:"opacity"},
			{id:sections[2], start: 3.85, end: 3.99, x: -1.1, y: 0, type:"opacity"},

			{id:narrationFiles[2], start: 3.01, end: 3.2, x: 1, y: 0, type:"narration"}, 
			
			{id:musicFiles[1], start: 3.2, end: 3.6, x: 0.4, y: 0, type:"music"}, // on second call of same music file, fadeout is triggered
			{id:musicFiles[1], start: 3.95, end: 3.99, x: 0, y: 0, type:"music"} 
		],
		
		[  // scene 4	
			
			{id:document.getElementById("ericw"), start: 4.54, end: 4.65, x: -1000, y: 0, type:"translate"},
			{id:document.getElementById("s4t1"), start: 4.01, end: 4.1, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("doorway"), start: 4.1, end: 4.15, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("couch"), start: 4.1, end: 4.15, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("s4t1"), start: 4.37, end: 4.42, x: -1, y: 0, type:"opacity"},
			{id:document.getElementById("memes"), start: 4.54, end: 4.65, x: -1000, y: 0, type:"translate"},
			{id:document.getElementById("doorway"), start: 4.54, end: 4.65, x: -1000, y: 0, type:"translate"},
			{id:document.getElementById("couch"), start: 4.54, end: 4.65, x: -1050, y: 0, type:"translate"},
			{id:document.getElementById("grinch-burbs"), start: 4.54, end: 4.65, x: -1000, y: 0, type:"translate"},
			{id:document.getElementById("bg-test"), start: 4.54, end: 4.65, x: -1000, y: 0, type:"translate"},

			{id:sections[3], start: 4.2, end: 4.26, x: 1, y: 0, type:"opacity"},
			{id:sections[3], start: 4.95, end: 4.99, x: -1, y: 0, type:"opacity"},

			{id:narrationFiles[3], start: 4.01, end: 4.2, x: 1, y: 0, type:"narration"},
			
			{id:musicFiles[2], start: 4.1, end: 4.3, x: 0.5, y: 0, type:"music"},
			{id:musicFiles[2], start: 4.95, end: 4.99, x: 0, y: 0, type:"music"} 
		], 
		
		[  // scene 5

			{id:document.getElementById("s5t1"), start: 5, end: 5.1, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("s5t1"), start: 5.3, end: 5.4, x:-1, y: 0, type:"opacity"},
			{id:document.getElementById("poker"), start: 5.2, end: 5.3, x: 0, y: -100, type:"translate"},
			{id:document.getElementById("bg-inner"), start: 5.2, end: 5.3, x: 0, y: 20, type:"bgShift"},
			{id:document.getElementById("poker-bg"), start: 5.2, end: 5.3, x: 0, y: 20, type:"bgShift"},
			{id:document.getElementById("grinch-poker"), start: 5.2, end: 5.3, x: 0, y: 100, type:"translate"},

			{id:sections[4], start: 5.2, end: 5.28, x: 1, y: 0, type:"opacity"},
			{id:sections[4], start: 5.9, end: 5.99, x: -1, y: 0, type:"opacity"},

			{id:narrationFiles[4], start: 5.01, end: 5.2, x: 1, y: 0, type:"narration"},
			
			{id:musicFiles[3], start: 5.1, end: 5.3, x: 0.5, y: 0, type:"music"},
			{id:musicFiles[3], start: 5.95, end: 5.99, x: 0, y: 0, type:"music"} 
		],  
		
		[ 	//scene 6


			{id:document.getElementById("s6t1"), start: 6, end: 6.1, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("s6t1"), start: 6.4, end: 6.5, x: -1, y: 0, type:"opacity"},
			{id:document.getElementById("symbols"), start: 6.2, end: 6.28, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("symbols"), start: 6.2, end: 6.99, x: 0, y: 500, type:"translate"},
			{id:document.getElementById("clouds-1"), start: 6.2, end: 6.4, x: 0, y: -100, type:"translate"},
			{id:document.getElementById("clouds-1"), start: 6.4, end: 6.99, x: 0, y: 0, type:"translate"},
			{id:document.getElementById("feeling-it"), start: 6.45, end: 6.5, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("drummers"), start: 6.3, end: 6.5, x: 0, y: -400, type:"translate"},
			{id:document.getElementById("hippies"), start: 6.27, end: 6.5, x: 0, y: -600, type:"translate"},
			{id:document.getElementById("monument-grinch"), start: 6.2, end: 6.45, x: 0, y: -400, type:"translate"},
			{id:document.getElementById("monument"), start: 6.2, end: 6.45, x: 0, y: -400, type:"translate"},
			
			{id:sections[5], start: 6.2, end: 6.28, x: 1, y: 0, type:"opacity"},
			{id:sections[5], start: 6.95, end: 6.99, x: -1, y: 0, type:"opacity"},
			
			{id:narrationFiles[5], start: 6.01, end: 6.2, x: 1, y: 0, type:"narration"},
			
			{id:musicFiles[4], start: 6.1, end: 6.3, x: 0.5, y: 0, type:"music"},
			{id:musicFiles[4], start: 6.95, end: 6.99, x: 0, y: 0, type:"music"} 
	
		], 

		[ //scene 7

			{id:document.getElementById("s7t1"), start: 7, end: 7.1, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("s7t1"), start: 7.2, end: 7.28, x:-1, y: 0, type:"opacity"},
			{id:document.getElementById("garage-interior"), start: 7.5, end: 7.99, x:0, y: 250, type:"translate"},
			{id:document.getElementById("garage-exterior"), start: 7.5, end: 7.99, x:0, y: 300, type:"translate"},
			{id:document.getElementById("garage-decorations"), start: 7.5, end: 7.99, x:0, y: 300, type:"translate"},
			{id:document.getElementById("garageband"), start: 7.5, end: 7.99, x:0, y: 380, type:"translate"},
			{id:document.getElementById("garage-bg"), start: 7.5, end: 7.99, x:0, y: 80, type:"bgShift"},
			{id:document.getElementById("garage-grinch"), start: 7.5, end: 7.58, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("garage-grinch"), start: 7.5, end: 7.99, x:1, y: 300, type:"translate"},

			{id:sections[6], start: 7.2, end: 7.26, x: 1, y: 0, type:"opacity"},
			{id:sections[6], start: 7.95, end: 7.99, x: -1, y: 0, type:"opacity"},
			
			{id:narrationFiles[6], start: 7.01, end: 7.2, x: 1, y: 0, type:"narration"},
			
			{id:musicFiles[5], start: 7.2, end: 7.4, x: 0.5, y: 0, type:"music"},
			{id:musicFiles[5], start: 7.95, end: 7.99, x: 0, y: 0, type:"music"} 
			
		], 

		[ //scene 8 - miracle

			{id:document.getElementById("s8t1"), start: 8.0, end: 8.10, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("s8t1"), start: 8.2, end: 8.28, x:-1, y: 0, type:"opacity"},
			{id:document.getElementById("flamingo"), start: 8.55, end: 8.7, x:0, y: 100, type:"translate"},
			{id:document.getElementById("miracle-grinch"), start: 8.55, end: 8.7, x:0, y: 140, type:"translate"},
			{id:document.getElementById("carolers"), start: 8.55, end: 8.7, x:0, y: 150, type:"translate"},
			{id:document.getElementById("s8bg"), start: 8.55, end: 8.7, x:0, y: 80, type:"bgShift"},

			{id:sections[7], start: 8.15, end: 8.25, x: 1, y: 0, type:"opacity"},
			{id:sections[7], start: 8.9, end: 8.99, x: -1, y: 0, type:"opacity"},
			
			{id:narrationFiles[7], start: 8.01, end: 8.2, x: 1, y: 0, type:"narration"},
			
			{id:musicFiles[6], start: 8.08, end: 8.3, x: 0.5, y: 0, type:"music"},
			{id:musicFiles[6], start: 8.95, end: 8.99, x: 0, y: 0, type:"music"} 
			
		], 

		[ //scene 9 - aquarium

			{id:document.getElementById("s9t1"), start: 9.0, end: 9.1, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("s9t1"), start: 9.2, end: 9.28, x: -1, y: 0, type:"opacity"},
			{id:document.getElementById("bubbles-1"), start: 9.0, end: 9.99, x: 0, y: -200, type:"translate"},
			{id:document.getElementById("bubbles-2"), start: 9.0, end: 9.99, x: 0, y: -250, type:"translate"},
			{id:document.getElementById("bubbles-3"), start: 9.0, end: 9.99, x: 0, y: -300, type:"translate"},

			{id:document.getElementById("little-fish-1"), start: 9.0, end: 9.99, x: -200, y: 0, type:"translate"},
			{id:document.getElementById("little-fish-2"), start: 9.0, end: 9.99, x: -250, y: 20, type:"translate"},
			{id:document.getElementById("big-fish"), start: 9.0, end: 9.99, x: -500, y: 20, type:"translate"},
			{id:document.getElementById("shark"), start: 9.65, end: 9.99, x: -2400, y: 0, type:"translate"},

			{id:sections[8], start: 9.2, end: 9.28, x: 1, y: 0, type:"opacity"},
			{id:sections[8], start: 9.9, end: 9.99, x: -1, y: 0, type:"opacity"},
			
			{id:narrationFiles[8], start: 9.01, end: 9.2, x: 1, y: 0, type:"narration"},
			
			{id:musicFiles[7], start: 9.1, end: 9.3, x: 0.5, y: 0, type:"music"},
			{id:musicFiles[7], start: 9.9, end: 9.99, x: 0, y: 0, type:"music"} 
		],

		 [ //scene 10 - truck
			{id:document.getElementById("s10t1"), start: 10.0, end: 10.1, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("s10t1"), start: 10.2, end: 10.28, x:-1, y: 0, type:"opacity"},
			{id:document.getElementById("s10bg"), start: 10.2, end: 10.28, x:0, y: 10, type:"bgShift"},
			{id:document.getElementById("truck"), start: 10.2, end: 10.28, x:0, y: -200, type:"translate"},
			{id:document.getElementById("truck-grinch"), start: 10.2, end: 10.28, x:0, y: -200, type:"translate"},
			{id:document.getElementById("businessmen"), start: 10.2, end: 10.28, x:0, y: -300, type:"translate"},
			{id:document.getElementById("truck-grinch"), start: 10.8, end: 10.93, x:-1400, y: 0, type:"translate"},
			{id:document.getElementById("truck"), start: 10.8, end: 10.9, x:-1400, y: 0, type:"translate"},

			{id:sections[9], start: 10.2, end: 10.28, x: 1, y: 0, type:"opacity"},
			{id:sections[9], start: 10.95, end: 10.99, x: -1, y: 0, type:"opacity"},
			
			{id:narrationFiles[9], start: 10.01, end: 10.2, x: 1, y: 0, type:"narration"},
			
			{id:musicFiles[8], start: 10.1, end: 10.3, x: 0.5, y: 0, type:"music"},
			{id:musicFiles[8], start: 10.95, end: 10.99, x: 0, y: 0, type:"music"} 
		 ],

		 [ //scene 11 - pool

		 	{id:document.getElementById("s11t1"), start: 11.0, end: 11.1, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("s11t1"), start: 11.2, end: 11.28, x: -1, y: 0, type:"opacity"},
			{id:document.getElementById("swimmers"), start: 11.26, end: 11.3, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("divers"), start: 11.23, end: 11.26, x:0, y: 1800, type:"translate"},
			{id:document.getElementById("front-splash"), start: 11.25, end: 11.27, x:0, y: -385, type:"translate"},
			{id:document.getElementById("back-splash"), start: 11.25, end: 11.27, x:0, y: -437, type:"translate"},
			{id:document.getElementById("front-splash"), start: 11.27, end: 11.28, x:0, y: 20, type:"translate"},
			{id:document.getElementById("back-splash"), start: 11.27, end: 11.28, x:0, y: 37, type:"translate"},
			{id:document.getElementById("swimmers"), start: 11.27, end: 11.31, x:0, y: -400, type:"translate"},

			{id:sections[10], start: 11.15, end: 11.25, x: 1, y: 0, type:"opacity"},
			{id:sections[10], start: 11.95, end: 11.99, x: -1, y: 0, type:"opacity"},
			
			{id:narrationFiles[10], start: 11.01, end: 11.2, x: 1, y: 0, type:"narration"},
			
			{id:musicFiles[9], start: 11.1, end: 11.3, x: 0.5, y: 0, type:"music"},
			{id:musicFiles[9], start: 11.95, end: 11.99, x: 0, y: 0, type:"music"} 
			
		 ],

		 [ //scene 12
		 	
		 	{id:document.getElementById("s12t1"), start: 12.0, end: 12.1, x: 1, y: 0, type:"opacity"},
		 	{id:document.getElementById("s12t1"), start: 12.2, end: 12.28, x: -1, y: 0, type:"opacity"},
			{id:document.getElementById("lights-out"), start: 12.69, end: 12.70, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("grinch-stieff"), start: 12.2, end: 12.28, x: 0, y: -400, type:"translate"},
			{id:document.getElementById("stieff"), start: 12.2, end: 12.28, x: 0, y: -400, type:"translate"},
			{id:document.getElementById("fire"), start: 12.2, end: 12.28, x: 0, y: -400, type:"translate"},
			{id:document.getElementById("foreground"), start: 12.2, end: 12.28, x: 0, y: -400, type:"translate"},

			{id:sections[11], start: 12.2, end: 12.28, x: 1, y: 0, type:"opacity"},
			{id:sections[11], start: 12.95, end: 12.99, x: -1, y: 0, type:"opacity"},
			
			{id:narrationFiles[11], start: 12.01, end: 12.2, x: 1, y: 0, type:"narration"},
			
			{id:musicFiles[10], start: 12.1, end: 12.3, x: 0.5, y: 0, type:"music"},
			{id:musicFiles[10], start: 12.95, end: 12.99, x: 0, y: 0, type:"music"} 
			
		 ],

		 [ //scene 13 - sleeping
		 	
			{id:document.getElementById("beds-back"), start: 13.1, end: 13.99, x:0, y: 1000, type:"translate"},
			{id:document.getElementById("julia"), start: 13.1, end: 13.99, x: 0, y: 1000, type:"translate"},
		  {id:document.getElementById("katie"), start: 13.1, end: 13.99, x: 0, y: 1000, type:"translate"},
			{id:document.getElementById("beds-mid"), start: 13.2, end: 13.99, x:0, y: 1200, type:"translate"},
			{id:document.getElementById("diana"), start: 13.2, end: 13.99, x: 0, y: 1200, type:"translate"},
			{id:document.getElementById("erika"), start: 13.2, end: 13.99, x: 0, y: 1200, type:"translate"},
			{id:document.getElementById("beds-front"), start: 13.3, end: 13.99, x:0, y: 1300, type:"translate"},
			{id:document.getElementById("audrey"), start: 13.3, end: 13.99, x: 0, y: 1300, type:"translate"},
	  	{id:document.getElementById("matt"), start: 13.3, end: 13.99, x: 0, y: 1300, type:"translate"},
	  	{id:document.getElementById("eric"), start: 13.3, end: 13.99, x: 0, y: 1300, type:"translate"},
	  	{id:document.getElementById("sleeping-grinch"), start: 13.0, end: 13.05, x: 1, y: 0, type:"opacity"},
	  	{id:document.getElementById("sleeping-grinch"), start: 13.25, end: 13.35, x: -1.1, y: 0, type:"opacity"},
	  	{id:document.getElementById("sleepingbg"), start: 13.0, end: 13.99, x:0, y: 100, type:"bgShift"},
	  	{id:document.getElementById("sleepingbg2"), start: 13.0, end: 13.99, x:0, y: 100, type:"bgShift"},
	  	{id:document.getElementById("sleepingbg2"), start: 13.7, end: 13.85, x:1, y: 0, type:"opacity"},

		  {id:sections[12], start: 13.2, end: 13.28, x: 1, y: 0, type:"opacity"},
			{id:sections[12], start: 13.9, end: 13.99, x: -1, y: 0, type:"opacity"},
			
			{id:narrationFiles[12], start: 13.01, end: 13.2, x: 1, y: 0, type:"narration"},
			
			{id:musicFiles[11], start: 13.2, end: 13.4, x: 0.5, y: 0, type:"music"},
			{id:musicFiles[11], start: 13.8, end: 13.99, x: 0, y: 0, type:"music"} 
		 ],

		 [ //scene 14 - celebration 

		 	{id:document.getElementById("s14t1"), start: 14.0, end: 14.05, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("s14t1"), start: 14.14, end: 14.18, x:-1, y: 0, type:"opacity"},
		  {id:document.getElementById("celebrationbg"), start: 14.1, end: 14.16, x:0, y: 20, type:"bgShift"},
		  {id:document.getElementById("globe"), start: 14.1, end: 14.16, x:0, y: -681, type:"translate"},
		  {id:document.getElementById("celebration"), start: 14.1, end: 14.16, x:0, y: -600, type:"translate"},
			{id:document.getElementById("celebration"), start: 14.0, end: 14.03, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("celebration-light"), start: 14.2, end: 14.24, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("celebration-light"), start: 14.35, end: 14.39, x:-1, y: 0, type:"opacity"},
			{id:document.getElementById("globe"), start: 14.28, end: 14.33, x:0, y: 681, type:"translate"},
			{id:document.getElementById("celebration"), start: 14.28, end: 14.33, x:0, y: 650, type:"translate"},
			{id:document.getElementById("celebrationbg"), start: 14.28, end: 14.33, x:0, y: 50, type:"bgShift"},
			{id:document.getElementById("celebrationbg"), start: 14.4, end: 14.66, x:0, y: 20, type:"bgShift"},
			{id:document.getElementById("s14t2"), start: 14.4, end: 14.44, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("s14t2"), start: 14.5, end: 14.54, x:-1, y: 0, type:"opacity"},
			{id:document.getElementById("s14t3"), start: 14.54, end: 14.57, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("s14t3"), start: 14.63, end: 14.66, x:-1, y: 0, type:"opacity"},
			{id:document.getElementById("questions-large"), start: 14.4, end: 14.44, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("questions-large"), start: 14.5, end: 14.54, x:-1, y: 0, type:"opacity"},
			{id:document.getElementById("questions-large"), start: 14.4, end: 14.99, x:0, y: -950, type:"translate"},
			{id:document.getElementById("questions-medium"), start: 14.4, end: 14.44, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("questions-medium"), start: 14.5, end: 14.54, x:-1, y: 0, type:"opacity"},
			{id:document.getElementById("questions-medium"), start: 14.4, end: 14.99, x:0, y: -300, type:"translate"},
			{id:document.getElementById("questions-small"), start: 14.4, end: 14.44, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("questions-small"), start: 14.5, end: 14.54, x:-1, y: 0, type:"opacity"},
			{id:document.getElementById("questions-small"), start: 14.4, end: 14.99, x:0, y: -50, type:"translate"},
			{id:document.getElementById("hearts-large"), start: 14.54, end: 14.57, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("hearts-large"), start: 14.63, end: 14.66, x:-1, y: 0, type:"opacity"},
			{id:document.getElementById("hearts-large"), start: 14.4, end: 14.99, x:0, y: -950, type:"translate"},
			{id:document.getElementById("hearts-medium"), start: 14.54, end: 14.58, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("hearts-medium"), start: 14.63, end: 14.66, x:-1, y: 0, type:"opacity"},
			{id:document.getElementById("hearts-medium"), start: 14.4, end: 14.99, x:0, y: -300, type:"translate"},
			{id:document.getElementById("hearts-small"), start: 14.54, end: 14.58, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("hearts-small"), start: 14.63, end: 14.66, x:-1, y: 0, type:"opacity"},
			{id:document.getElementById("hearts-small"), start: 14.4, end: 14.99, x:0, y: -50, type:"translate"},
			// {id:document.getElementById("grinch-heart"), start: 14.66, end: 14.7, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("growing-heart"), start: 14.85, end: 14.88, x:1, y: 0, type:"opacity"},	
			{id:document.getElementById("s14t4"), start: 14.66, end: 14.7, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("s14t4"), start: 14.75, end: 14.8, x:-1, y: 0, type:"opacity"},
			{id:document.getElementById("s14t5"), start: 14.78, end: 14.82, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("s14t5"), start: 14.84, end: 14.87, x:-1, y: 0, type:"opacity"},
			

			{id:sections[13], start: 14.1, end: 14.14, x: 1, y: 0, type:"opacity"},
			{id:sections[13], start: 14.96, end: 14.99, x: -1, y: 0, type:"opacity"},
			
			{id:narrationFiles[13], start: 14.01, end: 14.2, x: 1, y: 0, type:"narration"},
			{id:narrationFiles[14], start: 14.4, end: 14.42, x: 1, y: 0, type:"narration"},
			{id:narrationFiles[15], start: 14.66, end: 14.68, x: 1, y: 0, type:"narration"},
			
			
			{id:musicFiles[12], start: 14.1, end: 14.15, x: 0.5, y: 0, type:"music"},
			{id:musicFiles[12], start: 14.97, end: 14.99, x: 0, y: 0, type:"music"}
	
		 ],

		 [ //scene 14 - finale
			{id:document.getElementById("tbg"), start: 15, end: 15.05, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("s15t1"), start: 15.0, end: 15.05, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("s15t1"), start: 15.15, end: 15.3, x:-1, y: 0, type:"opacity"},
			
			{id:sections[14], start: 15.25, end: 15.3, x: 1, y: 0, type:"opacity"},
			
			{id:narrationFiles[16], start: 15.0, end: 15.01, x: 1, y: 0, type:"narration"},

			{id:musicFiles[13], start: 15.0, end: 15.1, x: 0.5, y: 0, type:"music"},
			{id:musicFiles[13], start: 15.97, end: 15.99, x: 0, y: 0, type:"music"}


		 ]
	]
	
	var classShifts = [  // First array holds global class shifts, following are per scene
	
		[  // global
		
		],
		
		[  // scene 1
			{id:document.getElementById("wings"), start: 1.0, end: 1.99, prefix: "wings", order: [1,2,3,4,5,6,7,8,9], repeat:3}		
		],
	
		[  // scene 2
			{id:document.getElementById("max"), start: 2.15, end: 2.7, prefix: "max", order: [1,2,3,4,5,6], repeat:18},
			{id:document.getElementById("grinch"), start: 2.15, end: 2.8, prefix: "grinch", order: [1,2,3,4,5,6,7,8,9], repeat:6},
			{id:body, start: 2.5, end: 2.6, prefix: "color", order: [1,2], repeat:1}
		],
		 
		[ //scene 3
			{id:document.getElementById("grinch-transition"), start: 3.0, end: 3.99, prefix: "grinch-transition", order: [1,2,3,4,5,6,7,8,9], repeat:4},
			{id:body, start: 3.5, end: 3.6, prefix: "color", order: [2,3], repeat:1}
		],
		
		[  // scene 4		
			{id:document.getElementById("ericw"), start: 4.05, end: 4.65, prefix: "ericw", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], repeat:4},
			{id:document.getElementById("grinch-burbs"), start: 4.66, end: 4.9, prefix: "grinch-burbs", order: [0,1,2,3,4,5,6,7,8,9,10,11,12,13], repeat:1},
			{id:body, start: 4.5, end: 4.6, prefix: "color", order: [3,4], repeat:1}
		],
		
		[ // scene 5			
			{id:document.getElementById("smoke"), start: 5, end: 5.99, prefix: "smoke", order: [1,2,3,4,5,6,7,8], repeat:10},
			{id:document.getElementById("poker"), start: 5.18, end: 5.99, prefix: "poker", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19], repeat:2},
			{id:document.getElementById("grinch-poker"), start: 5.5, end: 5.9, prefix: "grinch-poker", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], repeat:1},
			{id:body, start: 5.5, end: 5.6, prefix: "color", order: [4,5], repeat:1}	
		],

		[ //scene 5
			{id:document.getElementById("drummers"), start: 6.0, end: 6.99, prefix: "drummers", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14], repeat:4},
			{id:document.getElementById("hippies"), start: 6.0, end: 6.99, prefix: "hippies", order: [1,2,3,4,5,6,7], repeat:10},
			{id:document.getElementById("symbols"), start: 6.0, end: 6.99, prefix: "symbols", order: [1,2,3,4,5,6,7], repeat:10},
			// {id:document.getElementById("symbols-2"), start: 6.2, end: 6.99, prefix: "symbols", order: [1,2,3,4,5,6,7], repeat:10},
			{id:document.getElementById("monument-grinch"), start: 6.6, end: 6.9, prefix: "monument-grinch", order: [0, 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], repeat:0},
			{id:body, start: 6.5, end: 6.6, prefix: "color", order: [5,6], repeat:1}
		],
		
		[ // scene 6
			{id:document.getElementById("garageband"), start: 7, end: 7.95, prefix: "garageband", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21], repeat:4},	
			{id:document.getElementById("garage-grinch"), start: 7.58, end: 7.88, prefix: "grinch", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], repeat:1},
			{id:document.getElementById("garage-decorations"), start: 7.5, end: 7.9, prefix: "decorations", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,13,13,13], repeat:1},
			{id:body, start: 7.5, end: 7.6, prefix: "color", order: [6,7], repeat:1}
		],
		
		[ // scene 7
			{id:document.getElementById("carolers"), start: 8.0, end: 8.99, prefix: "carolers", order: [1,2,3,,2,1,2,3,2,1,2,3,2,1,2,3,2,1,2,3,,1,2,3,2,1,2,3,2,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26], repeat:1},
			{id:document.getElementById("miracle-grinch"), start: 8.68, end: 8.9, prefix: "miracle-grinch", order: [1,2,3,4,5,6,7,8,9,10,11,12], repeat:1},
			{id:body, start: 8.5, end: 8.6, prefix: "color", order: [7,8], repeat:1}	
		],
		
		[ // scene 8 - aquarium
			{id:document.getElementById("aquarium-people"), start: 9.0, end: 9.99, prefix: "aqua", order: [1,2,3,4,5,6,7,8,9,10], repeat:4},
			{id:document.getElementById("aquarium-grinch"), start: 9.6, end: 9.8, prefix: "aquarium-grinch", order: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], repeat:1},
			{id:body, start: 9.5, end: 9.6, prefix: "color", order: [8,9], repeat:1}
			
		],

		

		[ // scene 9 - truck 
			{id:document.getElementById("businessmen"), start: 10.0, end: 10.99, prefix: "businessmen", order: [3,4,5,6,7,8,9,10,11,12,13,14,15,20,17,18,19,1,2], repeat:4},
			{id:document.getElementById("truck-grinch"), start: 10.5, end: 10.85, prefix: "truck-grinch", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17], repeat:1},
			{id:body, start: 10.5, end: 10.6, prefix: "color", order: [9,10], repeat:1}
		],

		[ // scene 10 - pool
			{id:document.getElementById("phelps"), start: 11.5, end: 11.7, prefix: "phelps", order: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33], repeat:1},
			{id:document.getElementById("swimmers"), start: 11.0, end: 11.99, prefix: "swimmers", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17,18,19,20,21,22,23,24,25,26,27,28], repeat:4},
			{id:document.getElementById("pool-grinch"), start: 11.73, end: 11.9, prefix: "pool-grinch", order: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], repeat:1},
			{id:body, start: 11.5, end: 11.6, prefix: "color", order: [10,11], repeat:1}
			
		],

		[ // scene 11
			{id:document.getElementById("fire"), start: 12.0, end: 12.99, prefix: "fire", order: [1,2,3,4,5,6], repeat:10},
			{id:document.getElementById("stieff"), start: 12.0, end: 12.99, prefix: "stieff", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17,18,19,20], repeat:5},
			{id:document.getElementById("grinch-stieff"), start: 12.5, end: 12.85, prefix: "grinch-stieff", order: [1,2,3,4,5,6,7,8,9,10,11,12,13], repeat:1},
			{id:body, start: 12.5, end: 12.6, prefix: "color", order: [11,12], repeat:1}
		],

		[ // scene 12 - sleeping
			{id:document.getElementById("audrey"), start: 13.3, end: 13.99, prefix: "audrey", order: [1,2,3,4,5,6,7,8], repeat:3},
			{id:document.getElementById("diana"), start: 13.3, end: 13.99, prefix: "diana", order: [1,2,3,4,5,6,7], repeat:3},
			{id:document.getElementById("eric"), start: 13.3, end: 13.99, prefix: "eric", order: [1,2,3,4,5,6,7,8,9,10], repeat:3},
			{id:document.getElementById("erika"), start: 13.3, end: 13.99, prefix: "erika", order: [1,2,3,4,5,6,7,8], repeat:3},
			{id:document.getElementById("julia"), start: 13.2, end: 13.99, prefix: "julia", order: [1,2,3,4,5,6,7,8], repeat:3},
			{id:document.getElementById("katie"), start: 13.2, end: 13.99, prefix: "katie", order: [1,2,3,4,5,6,7], repeat:3},
			{id:document.getElementById("matt"), start: 13.3, end: 13.99, prefix: "matt", order: [1,2,3,4,5,6,7], repeat:3},
			{id:document.getElementById("sleeping-grinch"), start: 13.05, end: 13.99, prefix: "sleeping-grinch", order: [1,2,3,4,5,6,7,8,9,10,11], repeat:8},
			{id:body, start: 13.5, end: 13.6, prefix: "color", order: [12,13], repeat:1}
		],

		[ // scene 13 - celebration
			{id:document.getElementById("celebration"), start: 14.0, end: 14.5, prefix: "celebration", order: [1,2,3,4,5,6,7,8], repeat:6},
			{id:document.getElementById("celebration-light"), start: 14.2, end: 14.6, prefix: "celebration-light", order: [1,2,3,4,5], repeat:16},
			{id:document.getElementById("growing-heart"), start: 14.88, end: 14.95, prefix: "growing-heart", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17], repeat:1},
			{id:body, start: 14.5, end: 14.6, prefix: "color", order: [13,14], repeat:1}
		],

		[ // scene 14
			{id:document.getElementById("bells"), start: 15, end: 15.99, prefix: "bells", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], repeat:12},
			{id:document.getElementById("tbg"), start: 15, end: 15.99, prefix: "tbg", order: [1,2,3,4,5,6,7,8,9], repeat:12},
			{id:body, start: 15.5, end: 15.6, prefix: "color", order: [14,15], repeat:1}
		]
	
	]
	
	createSceneObjects();
	createTransformMaps();
	
	for ( i = 0; i < classShifts.length; i++ ) {
		classShifts[i].forEach(duplicate, this);
	}
	
	window.scrollTo(0,0);
	$("html, body").animate({
		scrollTop: 600
	}, 2000);

	playToggle.onclick = function() {
		if ( playing ) {
			stopScroll();
			this.className = "paused";
			fastforward.className = "fastforward-disabled";
			rewind.className = "rewind-disabled";
			body.style.overflowY = "scroll";
			pauseAllAudio(true);
			playing = false;
			audioReset = false;
		}
		else if ( playToggle.className === "restart" ) {
			audioDisabled = true;
			window.scrollTo(0, 0);
			playToggle.className = "paused";
			transforms[pos].forEach(transform, this);
			resetAudio();
			audioDisabled = false;
			playToggle.click();
		}
		else {
			scrollToEnd();
			playing = true;
			this.className = "playing";
			fastforward.className = "fastforward-enabled";
			rewind.className = "rewind-enabled";
			body.style.overflowY = "hidden";
			restartAudio();
		}
	}

	fastforward.onclick = function () {
		if ( playing ) {
			var x = pos;
			audioDisabled = true;
			window.scrollTo(0, scenes[x].start);
			transforms[x - 1].forEach(transform, this);
			resetAudio();
			audioDisabled = false;
		}
	}

	rewind.onclick = function () {
		if ( playing ) {
			var x = pos;
			audioDisabled = true;
			window.scrollTo(0,  scenes[x-2].start);
			transforms[x].forEach(transform, this);
			resetAudio();
			audioDisabled = false;
		}
	}
	
	audioToggle.onclick = function() {
	
		if ( audioToggle.className === "audio-on" ) {
			musicVol = 0;
			narrationVol = 0;
			audioToggle.className = "audio-off";
		}
		else {
			musicVol = 0.5;
			narrationVol = 1;
			audioToggle.className = "audio-on";
		}
		
		for ( i = 0; i < musicFiles.length; i++ ) {
			musicFiles[i].volume = musicVol;
		}
		
		for ( i = 0; i < narrationFiles.length; i++ ) {
			narrationFiles[i].volume = narrationVol;
		}
		
	}
	
	play.onclick = function() {
		playToggle.click();
	}
	
}