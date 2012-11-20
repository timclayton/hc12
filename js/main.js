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
		
		if (animPercent !== 0 && animPercent !== 1) { sPercent = element.scene + animPercent }
	
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
		
		else if ( element.type === "bgShiftX" ) {
			
			element.id.style.backgroundPosition=x + "% 100%"
			
		}
			
	}
	
	var shiftClass = function(element, index, array) {
	
		if ( array === classShifts[0] ) { var animPercent = calcPercent(gPercent,element.start,element.end); }  // global transforms 
		else { var animPercent = calcPercent(sPercent,element.start,element.end); }  //  scene specific transforms
		
		var orderPos = element.order[Math.floor( element.total * animPercent )];
		if ( orderPos !== undefined ) { element.id.className = element.prefix + orderPos; }
	
	}
	
	var scrollToEnd = function() {
        var scroll = setInterval( function() {
			window.scrollTo(0,s+=15);
			if ( s >= d-wh ) {
				clearInterval(scroll);
			}
		}, 15);
    }

    // var clearTimeout = function(element) {
    // 	window.setTimeout()  ;
    // }
	
	var scenes = [
	
		{scene:1, start:0, end:3000},
		{scene:2, start:3000, end:13000},
		{scene:3, start:13000, end:22000},
		{scene:4, start:22000, end:30000},
		{scene:5, start:30000, end:36000}
	
	]
	
	var transforms = [	// First array holds global transforms, following are per scene
	
		[  // global
		
			{id:document.getElementById("candycane1"), start: 0.07, end: 0.15, x: 60, y: -400, type:"translate"},
			{id:document.getElementById("snowflakes-mid"), start: 0.1, end: 0.25, x: 0, y: 2000, type:"translate"},
			{id:document.getElementById("snowflakes-top"), start: 0.2, end: 0.45, x: 0, y: 2000, type:"translate"},
			{id:document.getElementById("snowflakes-bottom"), start: 0.25, end: 0.65, x: 0, y: 2000, type:"translate"}
		
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

			{id:document.getElementById("textbox1"), start: 2.05, end: 2.15, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("textbox2"), start: 2.55, end: 2.65, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("near-cliff"), start:2.0, end:2.80, x: 0, y: -1800, type:"translate"},
			{id:document.getElementById("far-cliff"), start:2.0, end:2.9, x: 0, y:-1200, type:"translate"},
			{id:document.getElementById("ledge"), start:2.3, end:2.6, x: -628, y:0, type:"translate"},
			{id:document.getElementById("grinch"), start:2.7, end:2.74, x: 0, y: -718, type:"translate"},
			{id:document.getElementById("max"), start:2.3, end:2.6, x: -628, y:0, type:"translate"},
			{id:document.getElementById("lights"), start:2.5, end:2.8, x: 1, y:0, type:"opacity"},
		
		],
		
		[  // scene 3
			
			{id:document.getElementById("textbox3"), start: 3.05, end: 3.15, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("back-row-houses"), start:3.2, end:3.6, x: -1400, y:0, type:"translate"},
			{id:document.getElementById("front-row-houses"), start:3.3, end:3.5, x: 967, y:0, type:"translate"},
			{id:document.getElementById("lawn-ornaments"), start:3.25, end:3.4, x: -1235, y:0, type:"translate"},
			{id:document.getElementById("gate"), start:3.65, end:3.75, x: 0, y:-850, type:"translate"}
		
		],
		
		[  // scene 4
		
			{id:document.getElementById("ericw"), start: 4, end: 4.05, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("ericw"), start: 4.4, end: 4.6, x: -800, y: 0, type:"translate"},
			{id:document.getElementById("s3bg"), start: 4.4, end: 4.6, x: 100, y: 0, type:"bgShiftX"}
		
		]
		
	
	]
	
	var classShifts = [  // First array holds global class shifts, following are per scene
	
		[  // global
		
		],
		
		[  // scene 1
		
		],
	
		[  // scene 2
			{id:document.getElementById("max"), start: 2.35, end: 2.8, prefix: "max", order: [1,2,3,4,5,6], repeat:6}
		],
		
		[  // scene 3
		
			
		],
		
		[ // scene 4
			{id:document.getElementById("ericw"), start: 4.1, end: 4.7, prefix: "ericw", order: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], repeat:2}
		
		]
	
	]
	
	for ( i = 0; i < classShifts.length; i++ ) {
		classShifts[i].forEach(duplicate, this);
	}
	
	window.scrollTo(0,0);
	
	document.getElementById("play").onclick = function () {
	   scrollToEnd();
	}

	//pause the scroll
	document.getElementById("controls").onclick = function () {
		scrollToEnd();
	}
	
	stickScene();  //  Apply fixed positioning to first scene
	
}