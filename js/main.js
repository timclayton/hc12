
window.onload = function() {

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
					pos 						=	Math.floor( sPercent ),  //  calculated position					
					stuck,
					body						=  document.querySelector("body");
					sections 				=  document.querySelectorAll("section");
					scenes 				=  new Array(),
					musicFiles			=  document.querySelectorAll(".music");
					narrationFiles		=  document.querySelectorAll(".narration"),
					play						=  document.getElementById("play"),
					playToggle			=  document.getElementById("play-toggle"),
					fastforward			=  document.getElementById("fastforward"),
					rewind					=  document.getElementById("rewind"),
					currentScene			=  document.getElementById("scene" + pos),
					csstransform 		=  getsupportedprop(['transform', 'MozTransform', 'WebkitTransform', 'msTransform', 'OTransform']),
					transformMaps 		=  new Array();
					
	var pauseAudio = function() {
	
		for ( i = 0; i < musicFiles.length; i++ ) {
	
			if ( !musicFiles[i].paused ) {
			
				musicFiles[i].pause();
				musicFiles[i].className = "music paused-in-progress";
			
			}
		
		}
		
		for ( i = 0; i < narrationFiles.length; i++ ) {
	
			if ( !narrationFiles[i].paused ) {
			
				narrationFiles[i].pause();
				narrationFiles[i].className = "narration paused-in-progress";
			
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
		
			if ( vol < fadeTo ) {
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
			
			var vol = 1;
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
		
		if ( file.paused ) {
			fadeInAudio(file, fadeTo, fadeSpeed);
		}
		
		else {
			fadeOutAudio(file, fadeTo, fadeSpeed);
		}
		
	}
	
	window.onresize = function() {
		
					wh						= window.innerHeight;
		
	}
	
	window.onscroll = function() {
					s 							= 	window.pageYOffset;  //  get scrollTop value
					gPercent				=  s / (d-wh),	// global percent value
					pos 						=	Math.floor( sPercent ),  //  calculated position
					next 						= 	Math.floor( ((s + wh) / (scenes[pos-1].end) + pos) );  //  next - is greater when fixed/absolute positioning changes occur
		var		prev						=  pos - 1;  //  scene prior to current
					
		if ( next === pos && stuck == false ) { stickScene(pos); } 
		if ( next > pos ) { unstickScene(); }

		scenes.forEach(setPos, this);
		transforms[0].forEach(transform, this);
		transforms[pos].forEach(transform, this);
		classShifts[0].forEach(shiftClass, this);
		classShifts[pos].forEach(shiftClass, this);
		
	}
	
	var stickScene = function() {  //  Adds proper class to current/prev scenes

		sections[pos - 1].className = "active";	
		if ( pos !== 1 ) { sections[pos - 2].className = "prev"; }
		stuck = true;
		
	}
	
	var unstickScene = function() {
	
		document.getElementById("scene" + next).className = "";
		stuck = false;
		
		
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
	
	var setPos = function(element) {
	
		var 		animPercent =  calcPercent(s,element.start,element.end);
		if (animPercent !== 0 && animPercent !== 1) { 
			sPercent = element.scene + animPercent; 
		}  
	}

	var transform = function(element, index, array) {
		
		if ( array === transforms[0] ) { var animPercent = calcPercent(gPercent,element.start,element.end); }  // global transforms 
		else { var animPercent = calcPercent(sPercent,element.start,element.end); }  //  scene specific transforms
		
		var		x1				= element.x * animPercent,
					y1				= element.y * animPercent;
			
		var		x 					= x1 === 0 ? 0 : x1 - element.mapX,
					y					= y1 === 0 ? 0 : y1 - element.mapY;

		if ( element.type === "translate" ) {
			
			transformMaps[element.map].translate[0] += x;
			transformMaps[element.map].translate[1] += y;
			
			element.id.style[csstransform]='translate(' + transformMaps[element.map].translate[0] + 'px,' + transformMaps[element.map].translate[1] + 'px)';
			
		}
		
		else if ( element.type === "size" ) {
					
			transformMaps[element.map].size[0] += x;
			transformMaps[element.map].size[1] += y;
			
			element.id.style.width=transformMaps[element.map].size[0] + '%';
			element.id.style.height=transformMaps[element.map].size[1] + '%';
			
		}
		
		else if ( element.type === "opacity" ) {
			
			transformMaps[element.map].opacity += x;
			
			element.id.style.opacity=transformMaps[element.map].opacity;
			
		}
		
		else if ( element.type === "bgShift" ) {
			
			transformMaps[element.map].bgShift[0] += x;
			transformMaps[element.map].bgShift[1] += y;
			
			element.id.style.backgroundPosition=transformMaps[element.map].bgShift[0] + "%" + (100 - transformMaps[element.map].bgShift[1]) + "%";
			
		}
		
		else if ( element.type === "narration" && animPercent > 0 ) {
		
			if ( !element.triggered ) {
				element.id.play();
				element.triggered = true;
			}
		
		}
		
		else if ( element.type === "music" && animPercent > 0 ) {
		
			if ( !element.triggered ) {
				toggleAudio(element.id, element.x, 100);
				element.triggered = true;
			}
		
		}
		
		element.mapX = x1;
		element.mapY = y1;
		
		if ( animPercent === 1 ) {
		
			if ( element.triggered ) {
				element.triggered = false;
			}
			
			array.splice(index, 1);
			completedTransforms[pos].push(element);
			
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
		if ( s >= d - wh ) { stopScroll() }
		else { window.scrollBy(0,15) }
	}
	
	var stopScroll = function() {
		clearInterval(autoScroll);
		play.className = "";
		playToggle.className = "paused";
	}
	
	var createTransformMaps = function() {
	
		var 	elements = new Array(),
				mapNumber;
		
		var assignMap = function(element) {
			var 	el = element.id.outerHTML,
					opacity = element.fade === "out" ? 1 : 0;
			
			if ( elements.indexOf(el) < 0 ) {
				elements.push(el);
				var map = new Object({
					translate: [0,0],
					size: [0,0], 
					bgShift: [0,0],
					opacity: opacity
				});
				transformMaps.push(map);
				mapNumber = transformMaps.length - 1;
			}
			else {
				mapNumber = elements.indexOf(el);
			}
			
			element.map = mapNumber;
			element.mapX = 0;
			element.mapY = 0;
			
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

	var resetTransforms = function(x) {
	
		var pushBack = function(element, index, array) {
			var arrayIndex = completedTransforms.indexOf(array);
			transforms[arrayIndex].push(element);
		}
	
		var zero = function(element) {
		
			element.mapX = 0;
			element.mapY = 0;
			element.id.removeAttribute("style");
			
			transformMaps[element.map].translate = [0,0];
			transformMaps[element.map].opacity = 0;
			transformMaps[element.map].size = [0,0];
			transformMaps[element.map].bgShift = [0,0];
		
		}
		
		for ( i = x - 1; i <= x; i++ ) {
			
			completedTransforms[i].forEach(pushBack, this);
			transforms[i].forEach(zero, this);
			
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
			
			{id:sections[0], start: 1.6, end: 1.99, x: -1.1, y: 0, type:"opacity", fade: "out"}
						
		],
		
		[  // scene 2
			
			
			{id:document.getElementById("s2t1"), start: 2.02, end: 2.08, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("s2t2"), start: 2.17, end: 2.21, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("s2t1"), start: 2.4, end: 2.44, x: -1.1, y: 0, type:"opacity"},
			{id:document.getElementById("s2t2"), start: 2.4, end: 2.44, x: -1.1, y: 0, type:"opacity"},
			{id:document.getElementById("near-cliff"), start:2.0, end:2.30, x: 80, y: -700, type:"translate"},
			{id:document.getElementById("far-cliff"), start:2.0, end:2.3, x: 0, y:-400, type:"translate"},
			{id:document.getElementById("s2bg"), start:2.0, end:2.3, x: 0, y:-50, type:"bgShift"},
			{id:document.getElementById("s2bg"), start:2.5, end:2.85, x: 0, y:-50, type:"bgShift"},
			{id:document.getElementById("near-cliff"), start:2.5, end:2.70, x: 1000, y: -800, type:"translate"},
			{id:document.getElementById("far-cliff"), start:2.5, end:2.75, x: 900, y:-600, type:"translate"},
			{id:document.getElementById("ledge"), start:2.15, end:2.3, x: 0, y:-354, type:"translate"},
			{id:document.getElementById("grinch"), start:2.15, end:2.3, x: 0, y: -696, type:"translate"},
			{id:document.getElementById("max"), start:2.15, end:2.3, x: 0, y:-354, type:"translate"},
			{id:document.getElementById("ledge"), start:2.5, end:2.63, x: 700, y:-500, type:"translate"},
			{id:document.getElementById("grinch"), start:2.5, end:2.63, x: 700, y: -500, type:"translate"},
			{id:document.getElementById("max"), start:2.50, end:2.63, x: 700, y:-500, type:"translate"},
			{id:document.getElementById("lights"), start:2.6, end:2.8, x: 0, y:-800, type:"translate"},
			{id:document.getElementById("s2t3"), start: 2.55, end: 2.6, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("s2t3"), start: 2.8, end: 2.83, x: -1.1, y: 0, type:"opacity"},
			{id:document.getElementById("back-row-houses"), start:2.63, end:2.83, x: 0, y:-670, type:"translate"},
			{id:document.getElementById("front-row-houses"), start:2.73, end:2.83, x: 0, y:-400, type:"translate"},
			{id:document.getElementById("lawn-ornaments"), start:2.73, end:2.83, x: 0, y:-380, type:"translate"},
			
			{id:sections[1], start: 2.1, end: 2.16, x: 1, y: 0, type:"opacity", fade: "in"},
			{id:sections[1], start: 2.9, end: 2.99, x: -1.1, y: 0, type:"opacity", fade: "out"},
			
			{id:narrationFiles[0], start: 2.01, end: 2.2, x: 1, y: 0, type:"narration"}, // For type narration or music, x controls where volume goes to
			{id:narrationFiles[1], start: 2.55, end: 2.6, x: 1, y: 0, type:"narration"},
			
			{id:musicFiles[2], start: 2.33, end: 2.6, x: 0.5, y: 0, type:"music"},
			{id:musicFiles[2], start: 2.9, end: 2.99, x: 0.5, y: 0, type:"music"} // on second call of same music file, fadeout is triggered
		],

		[ //scene 3
			
			{id:document.getElementById("s3t1"), start: 3.05, end: 3.15, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("s3t1"), start: 3.5, end: 3.55, x: -1.1, y: 0, type:"opacity"},

			{id:sections[2], start: 3.2, end: 3.35, x: 1, y: 0, type:"opacity", fade: "in"},
			{id:sections[2], start: 3.9, end: 3.99, x: -1.1, y: 0, type:"opacity", fade: "out"},


		],
		
		[  // scene 4	
			
			{id:document.getElementById("ericw"), start: 4.4, end: 4.6, x: -1000, y: 0, type:"translate"},
			{id:document.getElementById("s4t1"), start: 4.01, end: 4.1, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("doorway"), start: 4.1, end: 4.15, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("couch"), start: 4.1, end: 4.15, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("s4t1"), start: 4.4, end: 4.45, x: -1.1, y: 0, type:"opacity"},
			{id:document.getElementById("bunny-2"), start: 4.4, end: 4.6, x: -1000, y: 0, type:"translate"},
			{id:document.getElementById("bunny-big"), start: 4.4, end: 4.6, x: -1000, y: 0, type:"translate"},
			{id:document.getElementById("know-your-memes"), start: 4.4, end: 4.6, x: -1000, y: 0, type:"translate"},
			{id:document.getElementById("doorway"), start: 4.4, end: 4.6, x: -1000, y: 0, type:"translate"},
			{id:document.getElementById("couch"), start: 4.4, end: 4.6, x: -1000, y: 0, type:"translate"},
			{id:document.getElementById("grinch-burbs"), start: 4.4, end: 4.6, x: -1000, y: 0, type:"translate"},
			{id:document.getElementById("bg-test"), start: 4.4, end: 4.6, x: -1000, y: 0, type:"translate"},

			{id:sections[3], start: 4.2, end: 4.28, x: 1, y: 0, type:"opacity", fade: "in"},
			{id:sections[3], start: 4.9, end: 4.99, x: -1.1, y: 0, type:"opacity", fade: "out"},


		], 
		
		[  // scene 5

			{id:document.getElementById("s5t1"), start: 5, end: 5.1, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("s5t1"), start: 5.3, end: 5.4, x:-1.1, y: 0, type:"opacity"},

			{id:sections[4], start: 5.2, end: 5.28, x: 1, y: 0, type:"opacity", fade: "in"},
			{id:sections[4], start: 5.9, end: 5.99, x: -1.1, y: 0, type:"opacity", fade: "out"},


		
		],  
		
		[ 	//scene 6

			{id:document.getElementById("s6t1"), start: 6, end: 6.1, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("s6t1"), start: 6.4, end: 6.5, x: -1.1, y: 0, type:"opacity"},
			{id:document.getElementById("clouds-1"), start: 6.0, end: 6.99, x: 300, y: 20, type:"translate"},
			{id:document.getElementById("feeling-it"), start: 6.45, end: 6.5, x:1, y: 0, type:"opacity"},
			

			{id:sections[5], start: 6.2, end: 6.28, x: 1, y: 0, type:"opacity", fade: "in"},
			{id:sections[5], start: 6.9, end: 6.99, x: -1.1, y: 0, type:"opacity", fade: "out"},
	
		], 

		[ //scene 7

			{id:document.getElementById("s7t1"), start: 7, end: 7.1, x:0, y: 300, type:"translate"},
			{id:document.getElementById("s7t1"), start: 7.2, end: 7.28, x:-1.1, y: 0, type:"opacity"},
			{id:document.getElementById("garage-interior"), start: 7.5, end: 7.62, x:0, y: 250, type:"translate"},
			{id:document.getElementById("garage-exterior"), start: 7.5, end: 7.62, x:0, y: 20, type:"bgShift"},
			{id:document.getElementById("garage-decorations"), start: 7.5, end: 7.62, x:0, y: 300, type:"translate"},
			{id:document.getElementById("garageband"), start: 7.5, end: 7.62, x:0, y: 350, type:"translate"},
			{id:document.getElementById("garage-bg"), start: 7.5, end: 7.62, x:0, y: 80, type:"bgShift"},
			{id:document.getElementById("garage-grinch"), start: 7.4, end: 7.55, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("garage-grinch"), start: 7.5, end: 7.62, x:1, y: 300, type:"translate"},

			{id:sections[6], start: 7.2, end: 7.28, x: 1, y: 0, type:"opacity", fade: "in"},
			{id:sections[6], start: 7.9, end: 7.99, x: -1.1, y: 0, type:"opacity", fade: "out"},
			
		], 

		[ //scene 8 - miracle

			{id:document.getElementById("s8t1"), start: 8.0, end: 8.10, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("s8t1"), start: 8.2, end: 8.28, x:-1.1, y: 0, type:"opacity"},
			{id:document.getElementById("flamingo"), start: 8.5, end: 8.6, x:0, y: 100, type:"translate"},
			{id:document.getElementById("miracle-grinch"), start: 8.5, end: 8.6, x:0, y: 140, type:"translate"},
			{id:document.getElementById("carolers"), start: 8.5, end: 8.6, x:0, y: 150, type:"translate"},
			{id:document.getElementById("s8bg"), start: 8.5, end: 8.6, x:0, y: 80, type:"bgShift"},

			{id:sections[7], start: 8.2, end: 8.28, x: 1, y: 0, type:"opacity", fade: "in"},
			{id:sections[7], start: 8.9, end: 8.99, x: -1.1, y: 0, type:"opacity", fade: "out"},
		], 

		[ //scene 9 - aquarium

			{id:document.getElementById("s9t1"), start: 9.0, end: 9.1, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("s9t1"), start: 9.2, end: 9.28, x: -1.1, y: 0, type:"opacity"},
			{id:document.getElementById("little-fish-1"), start: 9.0, end: 9.99, x: -200, y: 0, type:"translate"},
			{id:document.getElementById("little-fish-2"), start: 9.0, end: 9.99, x: -250, y: 20, type:"translate"},
			{id:document.getElementById("big-fish"), start: 9.0, end: 9.99, x: -500, y: 20, type:"translate"},
			{id:document.getElementById("shark"), start: 9.65, end: 9.99, x: 2400, y: 0, type:"translate"},

			{id:sections[8], start: 9.2, end: 9.28, x: 1, y: 0, type:"opacity", fade: "in"},
			{id:sections[8], start: 9.9, end: 9.99, x: -1.1, y: 0, type:"opacity", fade: "out"},
		],

		 [ //scene 10 - truck
			{id:document.getElementById("s10t1"), start: 10.0, end: 10.1, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("s10t1"), start: 10.2, end: 10.28, x:-1.1, y: 0, type:"opacity"},
			{id:document.getElementById("truck-grinch"), start: 10.6, end: 10.8, x:-1400, y: 0, type:"translate"},
			{id:document.getElementById("truck"), start: 10.6, end: 10.8, x:-1400, y: 0, type:"translate"},

			{id:sections[9], start: 10.2, end: 10.28, x: 1, y: 0, type:"opacity", fade: "in"},
			{id:sections[9], start: 10.9, end: 10.99, x: -1.1, y: 0, type:"opacity", fade: "out"},
		 ],

		 [ //scene 11 - pool

		 	{id:document.getElementById("s11t1"), start: 11.0, end: 11.1, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("s11t1"), start: 11.2, end: 11.28, x: -1.1, y: 0, type:"opacity"},
			{id:document.getElementById("swimmers"), start: 11.0, end: 11.06, x:1, y: 0, type:"opacity"},

			{id:sections[10], start: 11.2, end: 11.28, x: 1, y: 0, type:"opacity", fade: "in"},
			{id:sections[10], start: 11.9, end: 11.99, x: -1.1, y: 0, type:"opacity", fade: "out"},
			
		 ],

		 [ //scene 12
		 	
		 	{id:document.getElementById("s12t1"), start: 12.0, end: 12.1, x: 1, y: 0, type:"opacity"},
		 	{id:document.getElementById("s12t1"), start: 12.2, end: 12.28, x: -1.1, y: 0, type:"opacity"},
			{id:document.getElementById("lights-out"), start: 12.69, end: 12.70, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("sleepingbg"), start: 12.0, end: 12.99, x:0, y: 90, type:"bgShift"},

			{id:sections[11], start: 12.2, end: 12.28, x: 1, y: 0, type:"opacity", fade: "in"},
			{id:sections[11], start: 12.9, end: 12.99, x: -1.1, y: 0, type:"opacity", fade: "out"},
		 ],

		 [ //scene 13 - sleeping
		 	{id:document.getElementById("beds-back"), start: 13.3, end: 13.35, x: 1, y: 0, type:"opacity"},
		 	{id:document.getElementById("beds-mid"), start: 13.3, end: 13.35, x: 1, y: 0, type:"opacity"},
		 	{id:document.getElementById("beds-front"), start: 13.3, end: 13.35, x: 1, y: 0, type:"opacity"},
		  	{id:document.getElementById("audrey"), start: 13.3, end: 13.35, x: 1, y: 0, type:"opacity"},
		  	{id:document.getElementById("matt"), start: 13.3, end: 13.35, x: 1, y: 0, type:"opacity"},
		  	{id:document.getElementById("diana"), start: 13.3, end: 13.35, x: 1, y: 0, type:"opacity"},
		  	{id:document.getElementById("eric"), start: 13.3, end: 13.35, x: 1, y: 0, type:"opacity"},
		  	{id:document.getElementById("julia"), start: 13.3, end: 13.35, x: 1, y: 0, type:"opacity"},
		  	{id:document.getElementById("katie"), start: 13.3, end: 13.35, x: 1, y: 0, type:"opacity"},
		  	{id:document.getElementById("erika"), start: 13.3, end: 13.35, x: 1, y: 0, type:"opacity"},
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
		  	{id:document.getElementById("sleepingbg"), start: 13.0, end: 13.99, x:0, y: 120, type:"bgShift"},

		  	{id:sections[12], start: 13.2, end: 13.28, x: 1, y: 0, type:"opacity", fade: "in"},
			{id:sections[12], start: 13.9, end: 13.99, x: -1.1, y: 0, type:"opacity", fade: "out"},
		 ],

		 [ //scene 14 - celebration 

		 	{id:document.getElementById("s14t1"), start: 14.0, end: 14.05, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("s14t1"), start: 14.1, end: 14.13, x:-1.1, y: 0, type:"opacity"},
		  	{id:document.getElementById("celebrationbg"), start: 14.0, end: 14.12, x:0, y: 20, type:"bgShift"},
		  	{id:document.getElementById("globe"), start: 14.0, end: 14.12, x:0, y: -681, type:"translate"},
		  	{id:document.getElementById("celebration"), start: 14.0, end: 14.12, x:0, y: -600, type:"translate"},
			{id:document.getElementById("celebration"), start: 14.0, end: 14.03, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("celebration-light"), start: 14.15, end: 14.2, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("celebration-light"), start: 14.35, end: 14.39, x:-1.1, y: 0, type:"opacity"},
			{id:document.getElementById("globe"), start: 14.24, end: 14.29, x:0, y: 681, type:"translate"},
			{id:document.getElementById("celebration"), start: 14.24, end: 14.29, x:0, y: 650, type:"translate"},
			{id:document.getElementById("celebrationbg"), start: 14.24, end: 14.29, x:0, y: 50, type:"bgShift"},
			{id:document.getElementById("celebrationbg"), start: 14.4, end: 14.66, x:0, y: 20, type:"bgShift"},
			{id:document.getElementById("s14t2"), start: 14.4, end: 14.44, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("s14t2"), start: 14.5, end: 14.54, x:-1.1, y: 0, type:"opacity"},
			{id:document.getElementById("s14t3"), start: 14.54, end: 14.57, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("s14t3"), start: 14.63, end: 14.66, x:-1.1, y: 0, type:"opacity"},
			{id:document.getElementById("questions-large"), start: 14.4, end: 14.44, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("questions-large"), start: 14.5, end: 14.54, x:-1.1, y: 0, type:"opacity"},
			{id:document.getElementById("questions-large"), start: 14.4, end: 14.99, x:0, y: -250, type:"translate"},
			{id:document.getElementById("questions-medium"), start: 14.4, end: 14.44, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("questions-medium"), start: 14.5, end: 14.54, x:-1.1, y: 0, type:"opacity"},
			{id:document.getElementById("questions-medium"), start: 14.4, end: 14.99, x:0, y: -150, type:"translate"},
			{id:document.getElementById("questions-small"), start: 14.4, end: 14.44, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("questions-small"), start: 14.5, end: 14.54, x:-1.1, y: 0, type:"opacity"},
			{id:document.getElementById("questions-small"), start: 14.4, end: 14.99, x:0, y: -50, type:"translate"},
			{id:document.getElementById("hearts-large"), start: 14.54, end: 14.57, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("hearts-large"), start: 14.63, end: 14.66, x:-1.1, y: 0, type:"opacity"},
			{id:document.getElementById("hearts-large"), start: 14.4, end: 14.99, x:0, y: -250, type:"translate"},
			{id:document.getElementById("hearts-medium"), start: 14.54, end: 14.57, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("hearts-medium"), start: 14.63, end: 14.66, x:-1.1, y: 0, type:"opacity"},
			{id:document.getElementById("hearts-medium"), start: 14.4, end: 14.99, x:0, y: -150, type:"translate"},
			{id:document.getElementById("hearts-small"), start: 14.54, end: 14.57, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("hearts-small"), start: 14.63, end: 14.66, x:-1.1, y: 0, type:"opacity"},
			{id:document.getElementById("hearts-small"), start: 14.4, end: 14.99, x:0, y: -50, type:"translate"},
			{id:document.getElementById("grinch-heart"), start: 14.66, end: 14.7, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("growing-heart"), start: 14.66, end: 14.7, x:1, y: 0, type:"opacity"},	
			

			{id:sections[13], start: 14.1, end: 14.18, x: 1, y: 0, type:"opacity", fade: "in"},
			{id:sections[13], start: 14.9, end: 14.99, x: -1.1, y: 0, type:"opacity", fade: "out"},
	
		 ],

		 [ //scene 14 - sky
			{id:document.getElementById("tbg"), start: 15, end: 15.05, x:1, y: 0, type:"opacity"},

			{id:sections[14], start: 14.1, end: 14.18, x: 1, y: 0, type:"opacity", fade: "in"},
			
		 ]
	]
	
	var completedTransforms = [ [],[],[],[],[],[],[],[],[],[],[],[],[],[],[] ];
	
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
			{id:document.getElementById("ericw"), start: 4.05, end: 4.5, prefix: "ericw", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], repeat:3},
			{id:document.getElementById("grinch-burbs"), start: 4.61, end: 4.85, prefix: "grinch-burbs", order: [0,1,2,3,4,5,6,7,8,9,10,11,12,13], repeat:1},
			{id:body, start: 4.5, end: 4.6, prefix: "color", order: [3,4], repeat:1}
		],
		
		[ // scene 5			
			{id:document.getElementById("smoke"), start: 5, end: 5.99, prefix: "smoke", order: [1,2,3,4,5,6,7,8], repeat:10},
			{id:document.getElementById("poker"), start: 5, end: 5.9, prefix: "poker", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19], repeat:3},
			{id:document.getElementById("grinch-poker"), start: 5.5, end: 5.9, prefix: "grinch-poker", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], repeat:1},
			{id:body, start: 5.5, end: 5.6, prefix: "color", order: [4,5], repeat:1}	
		],

		[ //scene 5
			{id:document.getElementById("drummers"), start: 6.0, end: 6.99, prefix: "drummers", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14], repeat:2},
			{id:document.getElementById("hippies"), start: 6.0, end: 6.99, prefix: "hippies", order: [1,2,3,4,5,6,7,8], repeat:5},
			{id:document.getElementById("monument-grinch"), start: 6.4, end: 6.8, prefix: "monument-grinch", order: [0, 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], repeat:0},
			{id:body, start: 6.5, end: 6.6, prefix: "color", order: [5,6], repeat:1}
		],
		
		[ // scene 6
			{id:document.getElementById("garageband"), start: 7, end: 7.9, prefix: "garageband", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21], repeat:2},	
			{id:document.getElementById("garage-grinch"), start: 7.5, end: 7.9, prefix: "grinch", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], repeat:1},
			{id:document.getElementById("garage-decorations"), start: 7.5, end: 7.9, prefix: "decorations", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,13,13,13], repeat:1},
			{id:body, start: 7.5, end: 7.6, prefix: "color", order: [6,7], repeat:1}
		],
		
		[ // scene 7
			{id:document.getElementById("carolers"), start: 8.0, end: 8.99, prefix: "carolers", order: [1,2,3,,2,1,2,3,2,1,2,3,2,1,2,3,2,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26], repeat:1},
			{id:document.getElementById("miracle-grinch"), start: 8.5, end: 8.9, prefix: "miracle-grinch", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19], repeat:1},
			{id:body, start: 8.5, end: 8.6, prefix: "color", order: [7,8], repeat:1}	
		],
		
		[ // scene 8 - aquarium
			{id:document.getElementById("aquarium-people"), start: 9.0, end: 9.99, prefix: "aqua", order: [1,2,3,4,5,6,7,8,9,10], repeat:3},
			{id:document.getElementById("aquarium-grinch"), start: 9.3, end: 9.65, prefix: "aquarium-grinch", order: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], repeat:1},
			{id:body, start: 9.5, end: 9.6, prefix: "color", order: [8,9], repeat:1}
			
		],

		

		[ // scene 9 - truck 
			{id:document.getElementById("businessmen"), start: 10.0, end: 10.99, prefix: "businessmen", order: [3,4,5,6,7,8,9,10,11,12,13,14,15,20,17,18,19,1,2], repeat:2},
			{id:document.getElementById("truck-decorations"), start: 10.7, end: 10.75, prefix: "decorations", order: [1,2,3,4,5], repeat:1},
			{id:document.getElementById("truck-grinch"), start: 10.2, end: 10.75, prefix: "truck-grinch", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17], repeat:1},
			{id:body, start: 10.5, end: 10.6, prefix: "color", order: [9,10], repeat:1}
		],

		[ // scene 10 - pool
			{id:document.getElementById("phelps"), start: 11.3, end: 11.7, prefix: "phelps", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42], repeat:1},
			{id:document.getElementById("swimmers"), start: 11.0, end: 11.99, prefix: "swimmers", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17,18,19,20,21,22,23,24,25,26,27,28], repeat:2},
			{id:document.getElementById("pool-grinch"), start: 11.6, end: 11.8, prefix: "pool-grinch", order: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], repeat:1},
			{id:body, start: 11.5, end: 11.6, prefix: "color", order: [10,11], repeat:1}
			
		],

		[ // scene 11
			{id:document.getElementById("fire"), start: 12.0, end: 12.99, prefix: "fire", order: [1,2,3,4,5,6], repeat:10},
			{id:document.getElementById("stieff"), start: 12.0, end: 12.99, prefix: "stieff", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17,18,19,20], repeat:3},
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
			{id:document.getElementById("sleeping-grinch"), start: 13.05, end: 13.99, prefix: "sleeping-grinch", order: [1,2,3,4,5,6,7,8,9,10,11], repeat:5},
			{id:body, start: 13.5, end: 13.6, prefix: "color", order: [12,13], repeat:1}
		],

		[ // scene 13 - celebration
			{id:document.getElementById("celebration"), start: 14.0, end: 14.99, prefix: "celebration", order: [1,2,3,4,5,6,7,8], repeat:6},
			{id:document.getElementById("celebration-light"), start: 14.2, end: 14.6, prefix: "celebration-light", order: [1,2,3,4,5], repeat:8},
			{id:document.getElementById("growing-heart"), start: 14.66, end: 14.94, prefix: "growing-heart", order: [1,2,2,2,2,3,3,3,3,4,5,6,7,8,9,10,11,12,13,14,15,17,18,18,19,19,19], repeat:1},
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

	playToggle.onclick = function() {
		if ( this.className === "playing" ) {
			stopScroll();
			this.className = "paused";
			pauseAudio();
		}
		else {
			scrollToEnd();
			this.className = "playing";
			play.className = "playing";
			restartAudio();
		}
	}

	fastforward.onclick = function () {
		playToggle.click();
		pos += 1;
		window.scrollTo(0, scenes[pos-1].start);
		playToggle.click();
		narration.className = "paused";
	}

	rewind.onclick = function () {
		playToggle.click();
		var x = pos;
		window.scrollTo(0,  scenes[x-2].start);
		document.getElementById("scene" + x).className = "";
		resetTransforms(pos);
		document.getElementById("scene" + (x-1)).className = "active";
		playToggle.click();
	}
	
	play.onclick = function() {
		if ( this.className !== "playing" ) {
			scrollToEnd();
			this.className = "playing";
			playToggle.className = "playing";
		}
	}
	
	stickScene();  //  Apply fixed positioning to first scene
	
}