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
					play						=  document.getElementById("play"),
					playToggle			=  document.getElementById("play-toggle"),
					csstransform 		=  getsupportedprop(['transform', 'MozTransform', 'WebkitTransform', 'msTransform', 'OTransform']);
	
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

		document.getElementById("scene" + pos).className = "active";	
		if ( pos !== 1 ) { document.getElementById("scene" + (pos - 1)).className = "prev"; }
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
			
		var		x 					=  element.x * animPercent,
					y					=  element.y * animPercent;
		

		if ( element.type === "translate" ) {			
			
			element.id.style[csstransform]='translate(' + x + 'px,' + y + 'px)'
			
		}
		
		else if ( element.type === "size" ) {
			
			element.id.style.width=x + '%';
			element.id.style.height=y + '%'
			
		}
		
		else if ( element.type === "opacity" ) {
			
			element.id.style.opacity=x
			
		}
		
		else if ( element.type === "bgShift" ) {
			
			element.id.style.backgroundPosition=x + "%" + (100-y) + "%"
			
		}
			
	}
	
	var shiftClass = function(element, index, array) {
	
		if ( array === classShifts[0] ) { var animPercent = calcPercent(gPercent,element.start,element.end); }  // global transforms 
		else { var animPercent = calcPercent(sPercent,element.start,element.end); }  //  scene specific transforms
		
		var orderPos = element.order[Math.floor( element.total * animPercent )];
		if ( orderPos !== undefined ) { element.id.className = element.prefix + orderPos; }
	
	}
	
	var scrollToEnd = function() {
        autoScroll = setInterval(scrollIncrement, 15);
    }
	
	var scrollIncrement = function() {
		if ( s >= d - wh ) { stopScroll() }
		else { window.scrollTo(0,s+=15) }
	}
	
	var stopScroll = function() {
		clearInterval(autoScroll);
		play.className = "";
		playToggle.className = "paused";
	}
	
	var scenes = [
	
		{scene:1, start:0, end:3000},
		{scene:2, start:3000, end:19000},
		{scene:3, start:19000, end:27000},
		{scene:4, start:27000, end:33000},
		{scene:5, start:33000, end:40000},
		{scene:6, start:40000, end:50000},
		{scene:7, start:50000, end:56000},
		{scene:8, start:56000, end:66000},
		{scene:9, start:66000, end:80000},
		{scene:10, start:80000, end:90000},
		{scene:11, start:90000, end:100000},
		{scene:12, start:100000, end:110000},
		{scene:13, start:110000, end:124000},
		{scene:14, start:124000, end:134000},
		{scene:15, start:134000, end:144000},
		{scene:16, start:144000, end:154000}
	]
	
	var transforms = [	// First array holds global transforms, following are per scene
	
		[  // global
		
			{id:document.getElementById("candycane1"), start: 0.07, end: 0.15, x: 60, y: -400, type:"translate"},
			{id:document.getElementById("snowflakes-mid"), start: 0.1, end: 0.25, x: 0, y: 2000, type:"translate"},
			{id:document.getElementById("snowflakes-top"), start: 0.14, end: 0.3, x: 0, y: 2000, type:"translate"},
			{id:document.getElementById("snowflakes-bottom"), start: 0.2, end: 0.55, x: 0, y: 2000, type:"translate"}
		
		],
		
		[  // scene 1
			
			{id:document.getElementById("strike-through"), start: 1.1, end: 1.2, x: 100, y: 50, type:"size"},
			{id:document.getElementById("text-john-berndts"), start: 1.25, end: 1.4, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("text-how-the"), start: 1.6, end: 1.99, x: 0, y: -40, type:"translate"},
			{id:document.getElementById("text-grinch"), start: 1.6, end: 1.99, x: 0, y: -60, type:"translate"},
			{id:document.getElementById("text-stole"), start: 1.6, end: 1.99, x: 0, y: -80, type:"translate"},
			{id:document.getElementById("text-christmas"), start: 1.6, end: 1.99, x: 0, y: -100, type:"translate"},
			{id:document.getElementById("grinch-face"), start: 1.85, end: 1.99, x: 0, y: -300, type:"translate"}
						
		],
		
		[  // scene 2

			{id:document.getElementById("textbox1"), start: 2.05, end: 2.1, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("textbox2"), start: 2.25, end: 2.30, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("near-cliff"), start:2.0, end:2.50, x: 0, y: -1800, type:"translate"},
			{id:document.getElementById("far-cliff"), start:2.0, end:2.5, x: 0, y:-1200, type:"translate"},
			{id:document.getElementById("ledge"), start:2.15, end:2.3, x: -628, y:0, type:"translate"},
			{id:document.getElementById("grinch"), start:2.3, end:2.34, x: 0, y: -718, type:"translate"},
			{id:document.getElementById("max"), start:2.15, end:2.3, x: -628, y:0, type:"translate"},
			{id:document.getElementById("lights"), start:2.3, end:2.9, x: 800, y:-1000, type:"translate"},
			{id:document.getElementById("textbox3"), start: 2.5, end: 2.55, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("back-row-houses"), start:2.6, end:2.7, x: -30, y:-670, type:"translate"},
			{id:document.getElementById("front-row-houses"), start:2.6, end:2.7, x: 50, y:-400, type:"translate"},
			{id:document.getElementById("lawn-ornaments"), start:2.6, end:2.7, x: -40, y:0, type:"translate"},
			{id:document.getElementById("gate"), start:2.8, end:2.9, x: 0, y:-850, type:"translate"}
		
		],
		
		[  // scene 3
			
			{id:document.getElementById("ericw"), start: 3, end: 3.05, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("ericw"), start: 3.4, end: 3.6, x: -800, y: 0, type:"translate"},
			{id:document.getElementById("s3bg"), start: 3.4, end: 3.6, x: 100, y: 0, type:"bgShift"}
		
		],
		
		[  // scene 4
		
			{id:document.getElementById("poker"), start: 4., end: 4.06, x:1, y: 0, type:"opacity"}
		
		], 
		
		[ 	//scene 5
		  {id:document.getElementById("drummers"), start: 5., end: 5.06, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("textbox-scene5"), start: 5.2, end: 5.4, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("clouds-1"), start: 5.0, end: 5.99, x: 300, y: 20, type:"translate"},
			{id:document.getElementById("clouds-2"), start: 5.0, end: 5.99, x: 100, y: 5, type:"translate"},
			{id:document.getElementById("monument"), start: 5.0, end: 5.99, x: 0, y: -150, type:"translate"},
			{id:document.getElementById("monument-lights"), start: 5.0, end: 5.99, x: 0, y: -150, type:"translate"},
			{id:document.getElementById("symbols"), start: 5.0, end: 5.99, x:30, y: -150, type:"translate"},
			{id:document.getElementById("feeling-it"), start: 5.45, end: 5.5, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("didgeri-do"), start: 5.25, end: 5.3, x:1, y: 0, type:"opacity"},
		],

		[ //scene 6
			{id:document.getElementById("garage-interior"), start: 6, end: 6.06, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("garage-exterior"), start: 6, end: 6.06, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("garage-decorations"), start: 6, end: 6.06, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("garageband"), start: 6, end: 6.06, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("textbox-scene6"), start: 6.1, end: 6.2, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("garage-interior"), start: 6.5, end: 6.62, x:0, y: 250, type:"translate"},
			{id:document.getElementById("garage-exterior"), start: 6.5, end: 6.62, x:0, y: 300, type:"translate"},
			{id:document.getElementById("garage-decorations"), start: 6.5, end: 6.62, x:0, y: 300, type:"translate"},
			{id:document.getElementById("garageband"), start: 6.5, end: 6.62, x:0, y: 350, type:"translate"},
			{id:document.getElementById("garage-bg"), start: 6.5, end: 6.62, x:0, y: 80, type:"bgShift"}
		],

		[ //scene 7

		],

		[ //scene 8 - aquarium
			{id:document.getElementById("aquarium-people"), start: 8.0, end: 8.06, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("bubbles-1"), start: 8.0, end: 8.99, x: 0, y: -300, type:"translate"},
			{id:document.getElementById("bubbles-2"), start: 8.0, end: 8.99, x: 0, y: -350, type:"translate"},
			{id:document.getElementById("bubbles-3"), start: 8.0, end: 8.99, x: 0, y:-500, type:"translate"},
			{id:document.getElementById("little-fish-1"), start: 8.0, end: 8.99, x: -200, y: 0, type:"translate"},
			{id:document.getElementById("little-fish-2"), start: 8.0, end: 8.99, x: -250, y: 20, type:"translate"},
			{id:document.getElementById("big-fish"), start: 8.0, end: 8.99, x: -500, y: 20, type:"translate"},
			{id:document.getElementById("text-aquarium"), start: 8.4, end: 8.5, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("shark"), start: 8.5, end: 8.99, x: -3000, y: 0, type:"translate"}
		],

		[ //scene 9 - pool
			{id:document.getElementById("swimmers"), start: 9.0, end: 9.06, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("text-pool"), start: 9.4, end: 9.5, x: 1, y: 0, type:"opacity"}
		 	// {id:document.getElementById("phelps"), start: 9.1, end: 9.7, x: -500, y: 0, type:"translate"},
		 ],

		 [ //scene 10 - truck
			{id:document.getElementById("businessmen"), start: 10.0, end: 10.06, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("text-truck"), start: 10.3, end: 10.4, x:1, y: 0, type:"opacity"}
		 ],

		 [ //scene 11 
			
		 ],

		 [ //scene 12 
			
		 ],

		 [ //scene 13 - celebration 
		  {id:document.getElementById("globe"), start: 13.0, end: 13.4, x:0, y: -681, type:"translate"},
		  {id:document.getElementById("celebration"), start: 13.0, end: 13.4, x:0, y: -600, type:"translate"},
			{id:document.getElementById("celebration"), start: 13.0, end: 13.06, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("text-celebration"), start: 13.3, end: 13.4, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("celebration-light"), start: 13.4, end: 13.5, x:1, y: 0, type:"opacity"}
		 ],

		 [ //scene 14 - sky
			{id:document.getElementById("text-sky-1"), start: 14.1, end: 14.2, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("text-sky-2"), start: 14.5, end: 14.6, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("questions-large"), start: 14.0, end: 14.1, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("hearts-large"), start: 14.5, end: 14.7, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("questions-large"), start: 14.0, end: 14.99, x:0, y: -100, type:"translate"},
			{id:document.getElementById("hearts-large"), start: 14.0, end: 14.99, x:0, y: -100, type:"translate"},
			{id:document.getElementById("questions-medium"), start: 14.0, end: 14.1, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("hearts-medium"), start: 14.5, end: 14.7, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("questions-medium"), start: 14.0, end: 14.99, x:0, y: -60, type:"translate"},
			{id:document.getElementById("hearts-medium"), start: 14.0, end: 14.99, x:0, y: -60, type:"translate"},
			{id:document.getElementById("questions-small"), start: 14.0, end: 14.1, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("hearts-small"), start: 14.5, end: 14.7, x:1, y: 0, type:"opacity"},
			{id:document.getElementById("questions-small"), start: 14.0, end: 14.99, x:0, y: -30, type:"translate"},
			{id:document.getElementById("hearts-small"), start: 14.0, end: 14.99, x:0, y: -30, type:"translate"},
		 ],

		 [ //scene 15 
			
		 ],


		 [ //scene 16 
			
		 ]
	]
	
	var classShifts = [  // First array holds global class shifts, following are per scene
	
		[  // global
		
		],
		
		[  // scene 1
			{id:document.getElementById("wings"), start: 1.0, end: 1.99, prefix: "wings", order: [1,2,3,4,5,6,7,8,9], repeat:3}		
		],
	
		[  // scene 2
			{id:document.getElementById("max"), start: 2.35, end: 2.8, prefix: "max", order: [1,2,3,4,5,6], repeat:6}
		],
		
		[  // scene 3		
			{id:document.getElementById("ericw"), start: 3.1, end: 3.7, prefix: "ericw", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], repeat:2}
		],
		
		[ // scene 4			
			{id:document.getElementById("poker"), start: 4, end: 4.9, prefix: "poker", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19], repeat:2}
		],

		[ //scene 5
			{id:document.getElementById("drummers"), start: 5.0, end: 5.99, prefix: "drummers", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14], repeat:2}
		],
		
		[ // scene 6
			{id:document.getElementById("garageband"), start: 6, end: 6.9, prefix: "garageband", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21], repeat:2}		
		],
		
		[ // scene 7
						
		],
		
		[ // scene 8 - aquarium
			{id:document.getElementById("aquarium-people"), start: 8.0, end: 8.99, prefix: "aqua", order: [1,2,3,4,5,6,7,8,9,10], repeat:3}
			
		],

		[ // scene 9 - pool
			{id:document.getElementById("phelps"), start: 9.0, end: 9.99, prefix: "phelps", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42], repeat:1},
			{id:document.getElementById("swimmers"), start: 9.0, end: 9.99, prefix: "swimmers", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17,18,19,20,21,22,23,24,25,26,27,28], repeat:2}
			
		],

		[ // scene 10 
			{id:document.getElementById("businessmen"), start: 10.0, end: 10.99, prefix: "businessmen", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], repeat:2}
			
		],

		[ // scene 11

		],

		[ // scene 12

		],

		[ // scene 13 - celebration
			{id:document.getElementById("celebration"), start: 13.0, end: 13.99, prefix: "celebration", order: [1,2,3,4,5,6,7,8], repeat:6},
			{id:document.getElementById("celebration-light"), start: 13.4, end: 13.99, prefix: "celebration-light", order: [1,2,3,4,5], repeat:6}
		],

		[ // scene 14

		],

		[ // scene 15

		],

		[ // scene 16

		]
	
	]
	
	for ( i = 0; i < classShifts.length; i++ ) {
		classShifts[i].forEach(duplicate, this);
	}
	
	window.scrollTo(0,0);

	playToggle.onclick = function() {
		if ( this.className === "playing" ) {
			stopScroll();
			this.className = "paused";
		}
		else {
			scrollToEnd();
			this.className = "playing";
			play.className = "playing";
		}
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