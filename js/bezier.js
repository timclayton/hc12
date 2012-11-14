/**
 * Cubic Bezier CSS3 transitions emulator
 *
 * See this post for more details
 * http://st-on-it.blogspot.com/2011/05/calculating-cubic-bezier-function.html
 *
 * Copyright (C) 2011 Nikolay Nemshilov
 */
function Bezier(p1,p2,p3,p4) {
  // defining the bezier functions in the polynomial form
  var Cx = 3 * p1;
  var Bx = 3 * (p3 - p1) - Cx;
  var Ax = 1 - Cx - Bx;

  var Cy = 3 * p2;
  var By = 3 * (p4 - p2) - Cy;
  var Ay = 1 - Cy - By;

  function bezier_x(t) { return t * (Cx + t * (Bx + t * Ax)); }
  function bezier_y(t) { return t * (Cy + t * (By + t * Ay)); }


  // using Newton's method to aproximate the parametric value of x for t
  function bezier_x_der(t) { return Cx + t * (2*Bx + 3*Ax * t); }

  function find_x_for(t) {
    var x=t, i=0, z;

    while (i < 5) { // making 5 iterations max
      z = bezier_x(x) - t;

      if (Math.abs(z) < 1e-3) break; // if already got close enough

      x = x - z/bezier_x_der(x);
      i++;
    }

    return x;
  };

  return function(t) {
    return bezier_y(find_x_for(t));
  }
}


function print_bezier(p1,p2,p3,p4) {
  console.log("\nBezier: ("+p1+","+p2+","+p3+","+p4+")");

  var time   = new Date();
  var bezier = new Bezier(p1,p2,p3,p4);

  console.log('-------+--------');
  console.log(' I     | O      ');
  console.log('-------+--------');

  for (var i=0; i < 1.001; i += 0.1) {
    console.log(i.toFixed(4) + " | "+ bezier(i).toFixed(4))
  }

  console.log('-------+--------');
  console.log("Done in: "+ (new Date() - time) + "ms")
}

print_bezier(0,0,1,1);
print_bezier(.25,0.1,.25,1);