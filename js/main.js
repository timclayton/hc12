$(document).ready(function() {

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
	
	$(window).resize($.throttle(function() {
		
					wh						= window.innerHeight;
		
	}, 50));
	
	$(window).scroll($.throttle(function() {
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
		
	}, 50));
	
	var stickScene = function() {  //  Adds proper class to current/prev scenes

		document.getElementById("scene" + pos).className = "active";	
		if ( pos !== 1 ) { document.getElementById("scene" + (pos - 1)).className = "prev"; }
		stuck = true;
		
	}
	
	var unstickScene = function() {
	
		document.getElementById("scene" + next).className = "";
		stuck = false;
		
	}
	
	var calcPercent = function(a,b,c) {	
		
		if ( a < b ) { var d = 0; }
		else if ( a >= c ) { var d = 1; }
		else { var d =  ( a - b ) / ( c - b ); }
		return d;
	
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
			
	}
	
	
	
	var scenes = [
	
		{scene:1, start:0, end:4000},
		{scene:2, start:4000, end:12000},
		{scene:3, start:12000, end:16000},
		{scene:4, start:16000, end:22000}
	
	]
	
	var transforms = [	// First array holds global transforms, following are per scene
	
		[
		
			{id:document.getElementById("candycane1"), start: 0.07, end: 0.3, x: 60, y: -400, type:"translate"},
		
		],
		
		[
			
			{id:document.getElementById("strike-through"), start: 1.1, end: 1.2, x: 100, y: 50, type:"size"},
			{id:document.getElementById("text-john-berndts"), start: 1.25, end: 1.4, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("text-how-the"), start: 1.6, end: 1.99, x: 0, y: -40, type:"translate"},
			{id:document.getElementById("text-grinch"), start: 1.6, end: 1.99, x: 0, y: -60, type:"translate"},
			{id:document.getElementById("text-stole"), start: 1.6, end: 1.99, x: 0, y: -80, type:"translate"},
			{id:document.getElementById("text-christmas"), start: 1.6, end: 1.99, x: 0, y: -100, type:"translate"},
			{id:document.getElementById("grinch-face"), start: 1.85, end: 1.99, x: 0, y: -300, type:"translate"}
						
		],
		
		[
		
			{id:document.getElementById("textbox1"), start: 2.05, end: 2.2, x: 1, y: 0, type:"opacity"},
			{id:document.getElementById("textbox2"), start: 2.4, end: 2.55, x: 1, y: 0, type:"opacity"}
		
		]
		
	
	]
	
	
	
	window.scrollTo(0,0);
	
	$("#play").click(function() {  //  animate scroll
		$("html,body").animate({
			scrollTop: d-wh
		}, 20000, 'linear');
	});
	
	stickScene();  //  Apply fixed positioning to first scene
	
});