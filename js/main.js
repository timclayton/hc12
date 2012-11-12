$(document).ready(function() {

		var 		s							= 	$(window).scrollTop(),  //  get scrollTop value 
					wh						=  $(window).height(), 
					sh		 				=  4000,	 //  scene height - set all scenes as equal height 
					pos 						=	Math.floor( (s / sh) + 1 ),  //  calculated position
					percent,
					stuck;
	
	$(window).resize($.throttle(function() {
		
					wh						= $(window).height();
		var		percent					=  1 + ( s / sh );  //  scene plus percent through the current scene
		
	}, 50));
	
	$(window).scroll($.throttle(function() {
					s 							= 	$(window).scrollTop();  //  get scrollTop value
					percent					=  1 + ( s / sh ),  //  scene plus percent through the current scene
					pos 						=	Math.floor( percent ),  //  calculated position
					next 						= 	Math.floor( ((s + wh) / sh) + 1 );  //  next - is greater when fixed/absolute positioning changes occur
		var		prev						=  pos - 1;  //  scene prior to current
					
		if ( next === pos && stuck == false ) { stickScene(pos); } 
		if ( next > pos ) { unstickScene(); }
		
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
	
	var transform = function(element) {
		
		if ( percent - element.globalStart < 0 ) { var animPercent = 0; }
		else if ( percent >= element.globalEnd ) { var animPercent = 1; }
		else { var animPercent =  ( percent - element.globalStart ) / ( element.globalEnd - element.globalStart ); }
		
		var		x 					=  element.endX * animPercent,
					y					=  element.endY * animPercent;
		

		if ( element.type === "translate" ) {			
			
			element.id.style.WebkitTransform='translate(' + x + 'px,' + y + 'px)'
			
		}
		
		else if ( element.type === "size" ) {
			
			element.id.style.width=x + '%';
			element.id.style.height=y + '%'
			
		}
		
		else if ( element.type === "opacity" ) {
			
			element.id.style.opacity=x
			
		}
			
	}
	
	var transforms = [	// First array holds global transforms, following are per scene
	
		[
		
			{id:document.getElementById("candycane1"), globalStart: 1.6, globalEnd: 2.3, endX: 60, endY: -400, type:"translate"},
		
		],
		
		[
			
			{id:document.getElementById("strike-through"), globalStart: 1.1, globalEnd: 1.2, endX: 100, endY: 50, type:"size"},
			{id:document.getElementById("text-john-berndts"), globalStart: 1.25, globalEnd: 1.4, endX: 1, endY: 0, type:"opacity"},
			{id:document.getElementById("text-how-the"), globalStart: 1.6, globalEnd: 1.99, endX: 0, endY: -40, type:"translate"},
			{id:document.getElementById("text-grinch"), globalStart: 1.6, globalEnd: 1.99, endX: 0, endY: -60, type:"translate"},
			{id:document.getElementById("text-stole"), globalStart: 1.6, globalEnd: 1.99, endX: 0, endY: -80, type:"translate"},
			{id:document.getElementById("text-christmas"), globalStart: 1.6, globalEnd: 1.99, endX: 0, endY: -100, type:"translate"},
			{id:document.getElementById("grinch-face"), globalStart: 1.85, globalEnd: 1.99, endX: 0, endY: -300, type:"translate"}
						
		],
		
		[
		
			{id:document.getElementById("textbox1"), globalStart: 2.05, globalEnd: 2.2, endX: 1, endY: 0, type:"opacity"},
			{id:document.getElementById("textbox2"), globalStart: 2.4, globalEnd: 2.55, endX: 1, endY: 0, type:"opacity"}
		
		]
		
	
	]
	
	$("#play").click(function() {  //  animate scroll
		$("html,body").animate({
			scrollTop: 3200
		}, 4000, 'linear', function() {
			$("html,body").animate({
				scrollTop: 4000
			}, 1100, 'linear', function() {
				$("html,body").animate({
					scrollTop: 7000
				}, 6000, 'linear')
			});
		});
	});
	
	stickScene();  //  Apply fixed positioning to first scene
	
});