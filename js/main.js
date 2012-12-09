
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
					sections 				=  document.getElementsByTagName("section");
					scenes 				=  new Array(),
					play						=  document.getElementById("play"),
					playToggle			=  document.getElementById("play-toggle"),
					fastforward			=  document.getElementById("fastforward"),
					rewind					=  document.getElementById("rewind"),
					currentScene			=  document.getElementById("scene" + pos),
					csstransform 		=  getsupportedprop(['transform', 'MozTransform', 'WebkitTransform', 'msTransform', 'OTransform']),
					transformMaps 		=  new Array(),
					transformMaps 		=  new Array(),
					narration				=  document.getElementById("narration"),
					narrationSprite		=  [ [0,10], [10,18], [18,20.7], [20.7,25.1], [25.1,30.3], [30.3,33.5], [33.5,36.7], [36.7,39.8], [39.8,42.8], [42.8,45.3], [45.4,47.8], [47.8,50.7], [50.7,54.5], [54.5,64.5], [64.5,77], [77,86.9], [86.9,101.1] ],
					narrationEnd			=  0;
					
	narration.addEventListener('timeupdate', function(e) {
	
		if ( narration.currentTime > narrationEnd ) {
			narration.pause();
			narration.className = "paused";
		}
		
	}, false);
	
	var playNarration = function(sound) {
	
		
		narration.currentTime = sound[0];
		narrationEnd = sound[1];
		narration.play();
		narration.className = "playing";
		
	}
	
	window.onresize = function() {
		
					wh						= window.innerHeight;
					setBgHeight();
		
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
		
		 if(document.getElementById("audio" + pos)) {
		 	if(document.getElementById("audio" + (pos-1))) {
		 		//var lastAudio = document.getElementById("audio" + (pos-1));
		 			document.getElementById("audio" + (pos-1)).pause();

		 			//var interval = 40; // 200ms interval

		 			// var fadeout = setInterval(
		 			//   function() {
		 			//     if (lastAudio.volume > 0) {
		 			//     	console.log(lastAudio.volume);
		 			//       lastAudio.volume -= 0.1
		 			//     }
		 			//     else {
		 			//       // Stop the setInterval when 0 is reached
		 			//       clearInterval(fadeout);
		 			//     }
		 			//   }, interval);
		 	 }
		 	document.getElementById("audio" + pos).play();
		 }

		
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
		
		if ( element.audio && animPercent > 0 ) {
			if ( narration.className != "playing" ) {
				playNarration(element.audio);
			}
		}
		element.mapX = x1;
		element.mapY = y1;
		
		if ( animPercent === 1 ) {
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
			var el = element.id.outerHTML;
			
			if ( elements.indexOf(el) < 0 ) {
				elements.push(el);
				var map = new Object({
					translate: [0,0],
					opacity: 0, 
					size: [0,0], 
					bgShift: [0,0]
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

	 var setBgHeight = function () {


	 	background =  document.getElementsByClassName('bg');
	 	
	 	 for (var i = 0; i < background.length; i++) {
	 	 	background[i].style.height = wh + 'px';
	 	 };
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
			{id:document.getElementById("s1bg"), start: 1.6, end: 1.99, x: 0, y: -40, type:"bgShift"},
			{id:document.getElementById("s2bg"), start: 1.65, end: 1.99, x: 0, y: -10, type:"bgShift"}
						
		],
		
		[  // scene 2

			{id:document.getElementById("textbox1"), start: 2.05, end: 2.1, x: 1, y: 0, type:"opacity", audio: narrationSprite[0]},
			{id:document.getElementById("textbox2"), start: 2.25, end: 2.30, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("textbox1"), start: 2.45, end: 2.5, x: -1.1, y: 0, type:"opacity"},
			{id:document.getElementById("textbox2"), start: 2.45, end: 2.5, x: -1.1, y: 0, type:"opacity"},
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
			{id:document.getElementById("textbox3"), start: 2.55, end: 2.6, x: 1, y: 0, type:"opacity", audio: narrationSprite[1]},
			{id:document.getElementById("textbox3"), start: 2.8, end: 2.83, x: -1.1, y: 0, type:"opacity"},
			{id:document.getElementById("back-row-houses"), start:2.63, end:2.83, x: 0, y:-670, type:"translate"},
			{id:document.getElementById("front-row-houses"), start:2.73, end:2.83, x: 0, y:-400, type:"translate"},
			{id:document.getElementById("lawn-ornaments"), start:2.73, end:2.83, x: 0, y:-380, type:"translate"},
			{id:document.getElementById("back-row-houses"), start:2.8, end:2.99, x: 0, y:-30, type:"translate"},
			{id:document.getElementById("front-row-houses"), start:2.8, end:2.99, x: 0, y:-40, type:"translate"},
			{id:document.getElementById("lawn-ornaments"), start:2.8, end:2.99, x: 0, y:-35, type:"translate"},
			{id:document.getElementById("gate"), start:2.85, end:2.9, x: 0, y:-750, type:"translate"},
			{id:document.getElementById("s2bg"), start:2.92, end:2.99, x: 0, y:-50, type:"bgShift"},
			{id:document.getElementById("lights"), start:2.92, end:2.99, x: 0, y:-100, type:"translate"},
			{id:document.getElementById("gate"), start:2.92, end:2.99, x: 0, y:-300, type:"translate"},
			{id:document.getElementById("ericw"), start: 2.92, end: 2.99, x: 0, y:60, type:"translate"},
			{id:document.getElementById("bg-test"), start: 2.92, end: 2.99, x: 0, y: -100, type:"translate"},
			// {id:document.getElementById("s3bg"), start: 2.92, end: 2.99, x: 0, y: 0, type:"bgShift"},

		
		],
		
		[  // scene 3
			
			
			{id:document.getElementById("ericw"), start: 3.4, end: 3.6, x: -1000, y: 0, type:"translate"},
			{id:document.getElementById("kitchen-text"), start: 3.1, end: 3.15, x: 1, y: 0, type:"opacity", audio: narrationSprite[3]},
			{id:document.getElementById("doorway"), start: 3.1, end: 3.15, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("couch"), start: 3.1, end: 3.15, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("kitchen-text"), start: 3.4, end: 3.45, x: -1.1, y: 0, type:"opacity"},
			{id:document.getElementById("bunny-2"), start: 3.4, end: 3.6, x: -1000, y: 0, type:"translate"},
			{id:document.getElementById("bunny-big"), start: 3.4, end: 3.6, x: -1000, y: 0, type:"translate"},
			{id:document.getElementById("know-your-memes"), start: 3.4, end: 3.6, x: -1000, y: 0, type:"translate"},
			{id:document.getElementById("doorway"), start: 3.4, end: 3.6, x: -1000, y: 0, type:"translate"},
			{id:document.getElementById("couch"), start: 3.4, end: 3.6, x: -1000, y: 0, type:"translate"},
			{id:document.getElementById("grinch-burbs"), start: 3.4, end: 3.6, x: -1000, y: 0, type:"translate"},
			{id:document.getElementById("bg-test"), start: 3.4, end: 3.6, x: -1000, y: 0, type:"translate"},
			{id:document.getElementById("poker"), start: 3.85, end: 3.99, x:0, y: -40, type:"translate"},
			{id:document.getElementById("grinch-poker"), start: 3.80, end: 3.99, x:0, y: -20, type:"translate"},
			{id:document.getElementById("bg-inner"), start: 3.85, end: 3.99, x:0, y: -20, type:"translate"},
			{id:document.getElementById("second-bg"), start: 3.85, end: 3.99, x:0, y: -20, type:"bgShift"},
			{id:document.getElementById("poker-bg"), start: 3.85, end: 3.99, x:0, y: -30, type:"bgShift"}
		
		], 
		
		[  // scene 4
			// {id:document.getElementById("smoke"), start: 3.0, end: 3.99, x:1, y: 0, type:"opacity"},
			
			{id:document.getElementById("poker"), start: 4.95, end: 4.99, x:0, y: -40, type:"translate"},
			{id:document.getElementById("grinch-poker"), start: 4.95, end: 4.99, x:0, y: -20, type:"translate"},
			{id:document.getElementById("bg-inner"), start: 4.95, end: 4.99, x:0, y: -40, type:"translate"},
			{id:document.getElementById("poker-text"), start: 4.3, end: 4.35, x:1, y: 0, type:"opacity", audio: narrationSprite[4]},
			{id:document.getElementById("poker-text"), start: 4.6, end: 4.65, x:-1.1, y: 0, type:"opacity"},
			{id:document.getElementById("poker"), start: 4.75, end: 4.99, x:0, y: -200, type:"translate"},
			{id:document.getElementById("grinch-poker"), start: 4.75, end: 4.99, x:0, y: -100, type:"translate"},
			{id:document.getElementById("bg-inner"), start: 4.75, end: 4.99, x:0, y: -100, type:"translate"},
			{id:document.getElementById("second-bg"), start: 4.75, end: 4.99, x:0, y: -100, type:"bgShift"},
			{id:document.getElementById("poker-bg"), start: 4.75, end: 4.99, x:0, y: -100, type:"bgShift"},
			{id:document.getElementById("monumentbg"), start: 4.85, end: 4.99, x:0, y: -50, type:"bgShift"},
			{id:document.getElementById("monument"), start: 4.85, end: 4.99, x: 0, y: 200, type:"translate"},
			{id:document.getElementById("monument-grinch"), start: 4.85, end: 4.99, x: 0, y: 200, type:"translate"},
			{id:document.getElementById("drummers"), start: 4.85, end: 4.99, x: 0, y: 100, type:"translate"},
			{id:document.getElementById("clouds-1"), start: 4.85, end: 4.99, x: 0, y: 80, type:"translate"},

		
		],  
		
		[ 	//scene 5
			{id:document.getElementById("hippies"), start: 5.0, end: 5.05, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("textbox-scene5"), start: 5.2, end: 5.4, x: 1, y: 0, type:"opacity", audio: narrationSprite[5]},
			{id:document.getElementById("clouds-1"), start: 5.0, end: 5.99, x: 300, y: 20, type:"translate"},
			{id:document.getElementById("feeling-it"), start: 5.45, end: 5.5, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("monument"), start: 5.85, end: 5.99, x: 0, y: -150, type:"translate"},
			{id:document.getElementById("drummers"), start: 5.85, end: 5.99, x: 0, y: -350, type:"translate"},
			{id:document.getElementById("hippies"), start: 5.85, end: 5.99, x: 0, y: -250, type:"translate"},
	
		], 

		[ //scene 6
			{id:document.getElementById("garage-interior"), start: 6, end: 6.06, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("garage-exterior"), start: 6, end: 6.06, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("garage-decorations"), start: 6, end: 6.06, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("garageband"), start: 6, end: 6.06, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("textbox-scene6"), start: 6.1, end: 6.2, x:1, y: 0, type:"opacity", audio: narrationSprite[6]},
			{id:document.getElementById("garage-interior"), start: 6.5, end: 6.62, x:0, y: 250, type:"translate"},
			{id:document.getElementById("garage-exterior"), start: 6.5, end: 6.62, x:0, y: 300, type:"translate"},
			{id:document.getElementById("textbox-scene6"), start: 6.5, end: 6.62, x:0, y: 300, type:"translate"},
			{id:document.getElementById("garage-decorations"), start: 6.5, end: 6.62, x:0, y: 300, type:"translate"},
			{id:document.getElementById("garageband"), start: 6.5, end: 6.62, x:0, y: 350, type:"translate"},
			{id:document.getElementById("garage-bg"), start: 6.5, end: 6.62, x:0, y: 80, type:"bgShift"},
			{id:document.getElementById("garage-grinch"), start: 6.4, end: 6.55, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("garage-grinch"), start: 6.5, end: 6.62, x:1, y: 300, type:"translate"},
			{id:document.getElementById("carolers"), start: 6.9, end: 6.99, x:0, y: 90, type:"translate"},
			{id:document.getElementById("flamingo"), start: 6.9, end: 6.99, x:0, y: 100, type:"translate"},
			
		], 

		[ //scene 7 - miracle
			{id:document.getElementById("miracle-grinch"), start: 7.0, end: 7.05, x: 1, y:0, type:"opacity"},
			{id:document.getElementById("text-miracle"), start: 7.15, end: 7.20, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("text-miracle"), start: 7.45, end: 7.55, x:-1.1, y: 0, type:"opacity", audio: narrationSprite[7]},
			{id:document.getElementById("flamingo"), start: 7.5, end: 7.6, x:0, y: 100, type:"translate"},
			{id:document.getElementById("miracle-grinch"), start: 7.5, end: 7.6, x:0, y: 140, type:"translate"},
			{id:document.getElementById("carolers"), start: 7.5, end: 7.6, x:0, y: 150, type:"translate"},
			{id:document.getElementById("s7bg"), start: 7.5, end: 7.6, x:0, y: 80, type:"bgShift"},
			{id:document.getElementById("carolers"), start: 7.9, end: 7.99, x:0, y: 80, type:"translate"},
			{id:document.getElementById("flamingo"), start: 7.9, end: 7.99, x:0, y: 100, type:"translate"},
			{id:document.getElementById("aquariumbg"), start: 7.85, end: 7.99, x:0, y: -10, type:"bgShift"},
			{id:document.getElementById("aquarium-grinch"), start: 7.85, end: 7.99, x:0, y: -40, type:"translate"},
			{id:document.getElementById("aquarium-people"), start: 7.85, end: 7.99, x:0, y: -80, type:"translate"}
		], 

		[ //scene 8 - aquarium
			// {id:document.getElementById("aquarium-grinch"), start: 8.0, end: 8.06, x:1, y: 0, type:"opacity"},
			// {id:document.getElementById("aquarium-people"), start: 8.0, end: 8.06, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("bubbles-1"), start: 8.0, end: 8.99, x: 0, y: -300, type:"translate"},
			{id:document.getElementById("bubbles-2"), start: 8.0, end: 8.99, x: 0, y: -350, type:"translate"},
			{id:document.getElementById("bubbles-3"), start: 8.0, end: 8.99, x: 0, y:-500, type:"translate"},
			{id:document.getElementById("little-fish-1"), start: 8.0, end: 8.06, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("little-fish-2"), start: 8.0, end: 8.06, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("big-fish"), start: 8.0, end: 8.06, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("little-fish-1"), start: 8.0, end: 8.99, x: -200, y: 0, type:"translate"},
			{id:document.getElementById("little-fish-2"), start: 8.0, end: 8.99, x: -250, y: 20, type:"translate"},
			{id:document.getElementById("big-fish"), start: 8.0, end: 8.99, x: -500, y: 20, type:"translate"},
			{id:document.getElementById("text-aquarium"), start: 8.4, end: 8.5, x: 1, y: 0, type:"opacity", audio: narrationSprite[8]},
			{id:document.getElementById("text-aquarium"), start: 8.8, end: 8.85, x: -1.1, y: 0, type:"opacity"},
			{id:document.getElementById("shark"), start: 8.65, end: 8.99, x: 2400, y: 0, type:"translate"},
			{id:document.getElementById("businessmen"), start: 8.9, end: 8.99, x:0, y: 140, type:"translate"},
			{id:document.getElementById("truck-grinch"), start: 8.9, end: 8.99, x:0, y: 100, type:"translate"},
			{id:document.getElementById("truck"), start: 8.9, end: 8.99, x:0, y: 100, type:"translate"},
			{id:document.getElementById("s9bg"), start: 8.9, end: 8.99, x:0, y: 50, type:"bgShift"},
		],

		 [ //scene 9 - truck
			{id:document.getElementById("text-truck"), start: 9.3, end: 9.4, x:1, y: 0, type:"opacity", audio: narrationSprite[9]},
			{id:document.getElementById("text-truck"), start: 9.55, end: 9.6, x:-1.1, y: 0, type:"opacity"},
			{id:document.getElementById("truck-decorations"), start: 9.0, end: 9.06, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("truck-grinch"), start: 9.6, end: 9.8, x:-1400, y: 0, type:"translate"},
			{id:document.getElementById("truck"), start: 9.6, end: 9.8, x:-1400, y: 0, type:"translate"},
			{id:document.getElementById("businessmen"), start: 9.85, end: 9.99, x:0, y: 140, type:"translate"},
			{id:document.getElementById("truck"), start: 9.85, end: 9.99, x:0, y: 100, type:"translate"},
			{id:document.getElementById("s9bg"), start: 9.85, end: 9.99, x:0, y: 50, type:"bgShift"},
		 ],

		 [ //scene 10 - pool
			{id:document.getElementById("swimmers"), start: 10.0, end: 10.06, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("text-pool"), start: 10.0, end: 10.05, x: 1, y: 0, type:"opacity", audio: narrationSprite[10]},
			{id:document.getElementById("text-pool"), start: 10.35, end: 10.4, x: -1.1, y: 0, type:"opacity"},
			{id:document.getElementById("stieff"), start: 10.9, end: 10.99, x:0, y: 200, type:"translate"},
			{id:document.getElementById("fire"), start: 10.9, end: 10.99, x:0, y: 200, type:"translate"},
			{id:document.getElementById("midground"), start: 10.9, end: 10.99, x:0, y: 200, type:"translate"},
			{id:document.getElementById("foreground"), start: 10.9, end: 10.99, x:0, y: 200, type:"translate"},
			{id:document.getElementById("s11bg"), start: 10.9, end: 10.99, x:0, y: 50, type:"bgShift"}
		 ],

		 [ //scene 11 
		 	
		 	{id:document.getElementById("stieff-text"), start: 11.65, end: 11.7, x: 1, y: 0, type:"opacity", audio: narrationSprite[11]},
			{id:document.getElementById("lights-out"), start: 11.69, end: 11.70, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("grinch-stieff"), start: 11.5, end: 11.51, x: 1, y: 0, type:"opacity"},
			// {id:document.getElementById("midground"), start: 11.00, end: 11.05, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("grinch-stieff"), start: 11.9, end: 11.99, x:0, y: 100, type:"translate"},
			{id:document.getElementById("stieff"), start: 11.9, end: 11.99, x:0, y: 100, type:"translate"},
			{id:document.getElementById("fire"), start: 11.9, end: 11.99, x:0, y: 100, type:"translate"},
			{id:document.getElementById("midground"), start: 11.9, end: 11.99, x:0, y: 100, type:"translate"},
			{id:document.getElementById("foreground"), start: 11.9, end: 11.99, x:0, y: 100, type:"translate"},
			{id:document.getElementById("s11bg"), start: 11.9, end: 11.99, x:0, y: 50, type:"bgShift"},
			{id:document.getElementById("sleepingbg"), start: 12.0, end: 12.99, x:0, y: 90, type:"bgShift"}
		 ],

		 [ //scene 12 - sleeping
		 {id:document.getElementById("beds-back"), start: 12.3, end: 12.35, x: 1, y: 0, type:"opacity"},
		 {id:document.getElementById("beds-mid"), start: 12.3, end: 12.35, x: 1, y: 0, type:"opacity"},
		 {id:document.getElementById("beds-front"), start: 12.3, end: 12.35, x: 1, y: 0, type:"opacity"},
		  {id:document.getElementById("audrey"), start: 12.3, end: 12.35, x: 1, y: 0, type:"opacity"},
		  {id:document.getElementById("matt"), start: 12.3, end: 12.35, x: 1, y: 0, type:"opacity"},
		  {id:document.getElementById("diana"), start: 12.3, end: 12.35, x: 1, y: 0, type:"opacity"},
		  {id:document.getElementById("eric"), start: 12.3, end: 12.35, x: 1, y: 0, type:"opacity"},
		  {id:document.getElementById("julia"), start: 12.3, end: 12.35, x: 1, y: 0, type:"opacity"},
		  {id:document.getElementById("katie"), start: 12.3, end: 12.35, x: 1, y: 0, type:"opacity"},
		  {id:document.getElementById("erika"), start: 12.3, end: 12.35, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("beds-back"), start: 12.1, end: 12.99, x:0, y: 1000, type:"translate"},
			{id:document.getElementById("julia"), start: 12.1, end: 12.99, x: 0, y: 1000, type:"translate"},
		  {id:document.getElementById("katie"), start: 12.1, end: 12.99, x: 0, y: 1000, type:"translate"},
			{id:document.getElementById("beds-mid"), start: 12.2, end: 12.99, x:0, y: 1200, type:"translate"},
			{id:document.getElementById("diana"), start: 12.2, end: 12.99, x: 0, y: 1200, type:"translate"},
			{id:document.getElementById("erika"), start: 12.2, end: 12.99, x: 0, y: 1200, type:"translate"},
			{id:document.getElementById("beds-front"), start: 12.3, end: 12.99, x:0, y: 1300, type:"translate"},
			{id:document.getElementById("audrey"), start: 12.3, end: 12.99, x: 0, y: 1300, type:"translate"},
		  {id:document.getElementById("matt"), start: 12.3, end: 12.99, x: 0, y: 1300, type:"translate"},
		  {id:document.getElementById("eric"), start: 12.3, end: 12.99, x: 0, y: 1300, type:"translate"},
		  {id:document.getElementById("sleeping-grinch"), start: 12.0, end: 12.05, x: 1, y: 0, type:"opacity", audio: narrationSprite[12]},
		  {id:document.getElementById("sleeping-grinch"), start: 12.95, end: 12.99, x: -1.1, y: 0, type:"opacity"},
		  {id:document.getElementById("sleepingbg"), start: 12.0, end: 12.99, x:0, y: 120, type:"bgShift"}
		 ],

		 [ //scene 13 - celebration 
		  {id:document.getElementById("celebrationbg"), start: 13.0, end: 13.12, x:0, y: 90, type:"bgShift"},
		  {id:document.getElementById("globe"), start: 13.0, end: 13.12, x:0, y: -681, type:"translate"},
		  {id:document.getElementById("celebration"), start: 13.0, end: 13.12, x:0, y: -600, type:"translate"},
			{id:document.getElementById("celebration"), start: 13.0, end: 13.03, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("text-celebration"), start: 13.1, end: 13.13, x:1, y: 0, type:"opacity", audio: narrationSprite[13]},
			{id:document.getElementById("text-celebration"), start: 13.2, end: 13.23, x:-1.1, y: 0, type:"opacity"},
			{id:document.getElementById("celebration-light"), start: 13.15, end: 13.2, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("celebration-light"), start: 13.35, end: 13.39, x:-1.1, y: 0, type:"opacity"},
			{id:document.getElementById("globe"), start: 13.24, end: 13.29, x:0, y: 681, type:"translate"},
			{id:document.getElementById("celebration"), start: 13.24, end: 13.29, x:0, y: 650, type:"translate"},
			{id:document.getElementById("celebrationbg"), start: 13.24, end: 13.29, x:0, y: 70, type:"bgShift"},
			{id:document.getElementById("celebrationbg"), start: 13.4, end: 13.66, x:0, y: 20, type:"bgShift"},
			{id:document.getElementById("text-sky-1"), start: 13.4, end: 13.44, x:1, y: 0, type:"opacity", audio: narrationSprite[14]},
			{id:document.getElementById("text-sky-1"), start: 13.5, end: 13.54, x:-1.1, y: 0, type:"opacity"},
			{id:document.getElementById("text-sky-2"), start: 13.54, end: 13.57, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("text-sky-2"), start: 13.63, end: 13.66, x:-1.1, y: 0, type:"opacity"},
			{id:document.getElementById("questions-large"), start: 13.4, end: 13.44, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("questions-large"), start: 13.5, end: 13.54, x:-1.1, y: 0, type:"opacity"},
			{id:document.getElementById("questions-large"), start: 13.4, end: 13.99, x:0, y: -250, type:"translate"},
			{id:document.getElementById("questions-medium"), start: 13.4, end: 13.44, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("questions-medium"), start: 13.5, end: 13.54, x:-1.1, y: 0, type:"opacity"},
			{id:document.getElementById("questions-medium"), start: 13.4, end: 13.99, x:0, y: -150, type:"translate"},
			{id:document.getElementById("questions-small"), start: 13.4, end: 13.44, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("questions-small"), start: 13.5, end: 13.54, x:-1.1, y: 0, type:"opacity"},
			{id:document.getElementById("questions-small"), start: 13.4, end: 13.99, x:0, y: -50, type:"translate"},
			{id:document.getElementById("hearts-large"), start: 13.54, end: 13.57, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("hearts-large"), start: 13.63, end: 13.66, x:-1.1, y: 0, type:"opacity"},
			{id:document.getElementById("hearts-large"), start: 13.4, end: 13.99, x:0, y: -250, type:"translate"},
			{id:document.getElementById("hearts-medium"), start: 13.54, end: 13.57, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("hearts-medium"), start: 13.63, end: 13.66, x:-1.1, y: 0, type:"opacity"},
			{id:document.getElementById("hearts-medium"), start: 13.4, end: 13.99, x:0, y: -150, type:"translate"},
			{id:document.getElementById("hearts-small"), start: 13.54, end: 13.57, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("hearts-small"), start: 13.63, end: 13.66, x:-1.1, y: 0, type:"opacity"},
			{id:document.getElementById("hearts-small"), start: 13.4, end: 13.99, x:0, y: -50, type:"translate"},
			{id:document.getElementById("grinch-heart"), start: 13.66, end: 13.7, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("growing-heart"), start: 13.66, end: 13.7, x:1, y: 0, type:"opacity"},	
			{id:document.getElementById("curtain"), start: 13.96, end: 13.999, x:0, y: 300, type:"translate"},
			{id:document.getElementById("bells"), start: 13.96, end: 13.999, x:0, y: 300, type:"translate"},
			{id: narration, start: 13.7, end: 13.75, x:1, y: 0, audio: narrationSprite[15]},
			{id: narration, start: 13.85, end: 13.9, x:1, y: 0, audio: narrationSprite[16]},
			{id: narration, start: 13.92, end: 13.95, x:1, y: 0, audio: narrationSprite[16]},
		 ],

		 [ //scene 14 - sky
			{id:document.getElementById("tbg"), start: 14, end: 14.05, x:1, y: 0, type:"opacity"}
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
			{id:document.getElementById("max"), start: 2.15, end: 2.7, prefix: "max", order: [1,2,3,4,5,6], repeat:13},
			{id:document.getElementById("grinch"), start: 2.15, end: 2.8, prefix: "grinch", order: [1,2,3,4,5,6,7,8,9], repeat:6}
		],
		
		[  // scene 3		
			{id:document.getElementById("ericw"), start: 3.05, end: 3.5, prefix: "ericw", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], repeat:3},
			{id:document.getElementById("grinch-burbs"), start: 3.61, end: 3.85, prefix: "grinch-burbs", order: [0,1,2,3,4,5,6,7,8,9,10,11,12,13], repeat:1}
		],
		
		[ // scene 4			
			{id:document.getElementById("smoke"), start: 4, end: 4.99, prefix: "smoke", order: [1,2,3,4,5,6,7,8], repeat:10},
			{id:document.getElementById("poker"), start: 4, end: 4.9, prefix: "poker", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19], repeat:3},
			{id:document.getElementById("grinch-poker"), start: 4.5, end: 4.9, prefix: "grinch-poker", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], repeat:1},
			
		],

		[ //scene 5
			{id:document.getElementById("drummers"), start: 5.0, end: 5.99, prefix: "drummers", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14], repeat:2},
			{id:document.getElementById("hippies"), start: 5.0, end: 5.99, prefix: "hippies", order: [1,2,3,4,5,6,7,8], repeat:5},
			{id:document.getElementById("monument-grinch"), start: 5.4, end: 5.8, prefix: "monument-grinch", order: [0, 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], repeat:0}
		],
		
		[ // scene 6
			{id:document.getElementById("garageband"), start: 6, end: 6.9, prefix: "garageband", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21], repeat:2},	
			{id:document.getElementById("garage-grinch"), start: 6.5, end: 6.9, prefix: "grinch", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], repeat:1},
			{id:document.getElementById("garage-decorations"), start: 6.5, end: 6.9, prefix: "decorations", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,13,13,13], repeat:1}	
		],
		
		[ // scene 7
			{id:document.getElementById("carolers"), start: 7.0, end: 7.99, prefix: "carolers", order: [1,2,3,,2,1,2,3,2,1,2,3,2,1,2,3,2,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26], repeat:1},
			{id:document.getElementById("miracle-grinch"), start: 7.5, end: 7.9, prefix: "miracle-grinch", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19], repeat:1}	
		],
		
		[ // scene 8 - aquarium
			{id:document.getElementById("aquarium-people"), start: 8.0, end: 8.99, prefix: "aqua", order: [1,2,3,4,5,6,7,8,9,10], repeat:3},
			{id:document.getElementById("aquarium-grinch"), start: 8.3, end: 8.65, prefix: "aquarium-grinch", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], repeat:1}
			
		],

		

		[ // scene 9 - truck 
			{id:document.getElementById("businessmen"), start: 9.0, end: 9.99, prefix: "businessmen", order: [3,4,5,6,7,8,9,10,11,12,13,14,15,20,17,18,19,1,2], repeat:2},
			{id:document.getElementById("truck-decorations"), start: 9.7, end: 9.75, prefix: "decorations", order: [1,2,3,4,5], repeat:1},
			{id:document.getElementById("truck-grinch"), start: 9.2, end: 9.75, prefix: "truck-grinch", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17], repeat:1}
			
			
		],

		[ // scene 10 - pool
			{id:document.getElementById("phelps"), start: 10.0, end: 10.7, prefix: "phelps", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42], repeat:1},
			{id:document.getElementById("swimmers"), start: 10.0, end: 10.99, prefix: "swimmers", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17,18,19,20,21,22,23,24,25,26,27,28], repeat:2},
			{id:document.getElementById("pool-grinch"), start: 10.5, end: 10.8, prefix: "pool-grinch", order: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], repeat:1}
			
		],

		[ // scene 11
			{id:document.getElementById("fire"), start: 11.0, end: 11.99, prefix: "fire", order: [1,2,3,4,5,6], repeat:10},
			{id:document.getElementById("stieff"), start: 11.0, end: 11.99, prefix: "stieff", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17,18,19,20], repeat:3},
			{id:document.getElementById("grinch-stieff"), start: 11.5, end: 11.85, prefix: "grinch-stieff", order: [1,2,3,4,5,6,7,8,9,10,11,12,13], repeat:1}
		],

		[ // scene 12 - sleeping
			{id:document.getElementById("audrey"), start: 12.3, end: 12.99, prefix: "audrey", order: [1,2,3,4,5,6,7,8], repeat:3},
			{id:document.getElementById("diana"), start: 12.3, end: 12.99, prefix: "diana", order: [1,2,3,4,5,6,7], repeat:3},
			{id:document.getElementById("eric"), start: 12.3, end: 12.99, prefix: "eric", order: [1,2,3,4,5,6,7,8,9,10], repeat:3},
			{id:document.getElementById("erika"), start: 12.3, end: 12.99, prefix: "erika", order: [1,2,3,4,5,6,7,8], repeat:3},
			{id:document.getElementById("julia"), start: 12.2, end: 12.99, prefix: "julia", order: [1,2,3,4,5,6,7,8], repeat:3},
			{id:document.getElementById("katie"), start: 12.2, end: 12.99, prefix: "katie", order: [1,2,3,4,5,6,7], repeat:3},
			{id:document.getElementById("matt"), start: 12.3, end: 12.99, prefix: "matt", order: [1,2,3,4,5,6,7], repeat:3},
			{id:document.getElementById("sleeping-grinch"), start: 12.05, end: 12.99, prefix: "sleeping-grinch", order: [1,2,3,4,5,6,7,8,9,10,11], repeat:5},
		],

		[ // scene 13 - celebration
			{id:document.getElementById("celebration"), start: 13.0, end: 13.99, prefix: "celebration", order: [1,2,3,4,5,6,7,8], repeat:6},
			{id:document.getElementById("celebration-light"), start: 13.2, end: 13.6, prefix: "celebration-light", order: [1,2,3,4,5], repeat:8},
			{id:document.getElementById("growing-heart"), start: 13.66, end: 13.94, prefix: "growing-heart", order: [1,2,2,2,2,3,3,3,3,4,5,6,7,8,9,10,11,12,13,14,15,17,18,18,19,19,19], repeat:1}
		],

		[ // scene 14
			{id:document.getElementById("bells"), start: 14, end: 14.99, prefix: "bells", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], repeat:12},
			{id:document.getElementById("tbg"), start: 14, end: 14.99, prefix: "tbg", order: [1,2,3,4,5,6,7,8,9], repeat:12}
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
			document.getElementById("audio" + pos).pause();
			if ( narration.className === "playing" ) {
				narration.pause();
				narration.className = "paused active"
			}
		}
		else {
			scrollToEnd();
			this.className = "playing";
			play.className = "playing";
			document.getElementById("audio" + pos).play();
			if ( narration.className === "paused active" ) {
				narration.play();
				narration.className = "playing"
			}
		}
	}

	fastforward.onclick = function () {
		playToggle.click();
		pos += 1;
		stickScene();
		window.scrollTo(0, scenes[pos-1].start);
		playToggle.click();

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
	setBgHeight(); 
	
}