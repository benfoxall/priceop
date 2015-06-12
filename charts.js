

function demand1(x) {
  return Math.exp(10-0.05*x)/(1+Math.exp(10-0.05*x))
}

function demand2(x) {
  return Math.exp(8-0.048*x)/(1+Math.exp(8-0.048*x))
}

function demand2Inv(x) {
  return (8-Math.log(x/(1-x))) / 0.048;
}


function Pi1(x) {
  return demand1(x) * x;
}


function Pi2(x) {
  return demand2(x) * x;
}

function Chart(element){

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width  = this.width  = 960 - margin.left - margin.right,
      height = this.height = 700 - margin.top - margin.bottom;

  var svg = this.svg = d3.select(element).append('svg')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var graph1 = this.graph1 = svg.append('g');


  var guide1 = svg.append('line')
    .attr('class', 'guide1')
    .attr('x1', 50)
    .attr('x2', 50)
    .attr('y1', 0)
    .attr('y2', height)


  var guide2 = svg.append('line')
    .attr('class', 'guide2')
    .attr('x1', 50)
    .attr('x2', 50)
    .attr('y1', 0)
    .attr('y2', height)



  var series1 = d3.range(100,240).map(function(x){
    return {
      x:x,
      y:demand1(x)
    }
  });

  var series2 = d3.range(100,240).map(function(x){
    return {
      x:x,
      y:demand2(x)
    }
  });

  var x = d3.scale.linear()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height/2 - 20, 0]);

  var y2 = d3.scale.linear()
    .range([height, height/2 + 20]);


  var line = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });

  x.domain(d3.extent(series1.concat(series2), function(d) { return d.x; }));
  // y.domain(d3.extent(series1.concat(series2), function(d) { return d.y; }));
  y.domain([0,1]);

  var path1 = graph1.append("path")
    .datum(series1)
    .attr("class", "line")
    .attr("d", line);

  var path2 = graph1.append("path")
    .datum(series2)
    .attr("class", "line2")
    .attr("d", line);

  var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(function(d){return '£' + d})
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .tickFormat(function(d){return d*100 + '%'})
    .orient("left");


  var x_axis = graph1.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0.5," + (height/2 + 0.5 - 20) + ")")
    .call(xAxis);

  var y_axis = graph1.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(.5,.5)")
    .call(yAxis);




  // Second graph

  var graph2 = this.graph2 = svg.append('g');


  var series12 = d3.range(100,240).map(function(x){
    return {
      x:x,
      y:Pi1(x)
    }
  });

  var series22 = d3.range(100,240).map(function(x){
    return {
      x:x,
      y:Pi2(x)
    }
  });


  var x2 = d3.scale.linear()
    .range([0, width]);

  var y2 = d3.scale.linear()
    .range([height, height/2 + 20]);

  x2.domain(d3.extent(series12.concat(series22), function(d) { return d.x; }));
  y2.domain(d3.extent(series12.concat(series22), function(d) { return d.y; }));
  // y2.domain([0,1]);


  var line2 = d3.svg.line()
    .x(function(d) { return x2(d.x); })
    .y(function(d) { return y2(d.y); });


  var path12 = graph2.append("path")
    .datum(series12)
    .attr("class", "line")
    .attr("d", line2);

  var path22 = graph2.append("path")
    .datum(series22)
    .attr("class", "line2")
    .attr("d", line2);

  var xAxis2 = d3.svg.axis()
    .scale(x)
    .tickFormat(function(d){return '£' + d})
    .orient("bottom");

  var yAxis2 = d3.svg.axis()
    .scale(y2)
    .tickFormat(function(d){return '£' + d})
    .orient("left");


  var x_axis2 = graph2.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0.5," + (height + 0.5) + ")")
    .call(xAxis2);

  var y_axis2 = graph2.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(.5,.5)")
    .call(yAxis2);




  this.showGuides = function(datum){
    // guide1.attr('x1', x(datum.x))
    // guide1.attr('x2', x(datum.x))
    guide1.attr('transform', 'scale(0.3, 1) translate(' + x(datum.x) + ', 0)')
    guide2.attr('transform', 'scale(0.3, 1) translate(' + x(datum.y) + ', 0)')

    // guide2.attr('x1', x(datum.y))
    // guide2.attr('x2', x(datum.y))

  }


  // HIDE EVERYTHING 

  graph1.attr('transform', 'translate('+width/2+','+height/2+') scale(0)')
  graph2.attr('transform', 'translate('+width/2+','+height/2+') scale(0)')


  // hide lines initially
  svg.selectAll('.line, .line2, .guide1, .guide2').style('opacity',0);

  //
  svg.selectAll('.guide1, .guide2').attr('transform', 'scale(0.3, 1)')

}

Chart.prototype._series_first = function(){
  this.svg.selectAll('.line').transition().style('opacity',1)
  this.svg.selectAll('.line2').transition().style('opacity',0)
}

Chart.prototype._series_both = function(){
  this.svg.selectAll('.line').transition().style('opacity',1)
  this.svg.selectAll('.line2').transition().style('opacity',1)
}



Chart.prototype._first = function(){
  this.graph1.transition().attr('transform', 'translate(0, 200) scale(1)').duration(1500)
  this.graph2.transition().attr('transform', 'translate('+this.width/2+','+this.height/2+') scale(0)').duration(1500)
}

Chart.prototype._both = function(){
  this.graph1.transition().attr('transform', 'translate(0, 0) scale(1)').duration(1500)
  this.graph2.transition().attr('transform', 'translate(0, 0) scale(1)').duration(1500)
}

Chart.prototype._left = function(){
  this.graph1.transition().attr('transform', 'translate(0, 120) scale(.3)').duration(1500)
  this.graph2.transition().attr('transform', 'translate(0, 230) scale(.3)').duration(1500)
}

Chart.prototype._showGuides = function(){
  this.svg.selectAll('.guide1, .guide2')
    .style('stroke-width', 7)
    .style('opacity', 0)
    .transition()
    .style('opacity',.4)
    .duration(1500)
}





function Chart3d(element, firstChart){


  THREE.AxisHelper = function ( size ) {

    size = size || 1;

    var vertices = new Float32Array( [
      -.5, -.5, 0,  size-.5, -.5, 0,
      -.5, -.5, 0,  -.5, size-.5, 0,
      -.5, -.5, 0,  -.5, -.5, size
    ] );

    var colors = new Float32Array( [
      0, .53, 1,   0, .53, 1,  // g
      1,  0,  .53, 1,  0,  .53, // r
      1, 1,   1,   1, 1, 1    // b
      // 0, 0,   0,   0, 0, 0    // b

      // 1, 0, 0,  1, 0, 0, // r
      // 0, 1, 0,  0.6, 1, 0, // g
      // 0, 0, 1,  0, 0.6, 1  // b
    ] );

    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

    var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );

    THREE.Line.call( this, geometry, material, THREE.LinePieces );

  };

  THREE.AxisHelper.prototype = Object.create( THREE.Line.prototype );
  THREE.AxisHelper.prototype.constructor = THREE.AxisHelper;



  var _width = 960;
  var _height = 700;


  var group = new THREE.Object3D();
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 25, _width/_height, 0.1, 1000 );

  var renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize( _width, _height );
  renderer.setClearColor( 0x222222 );

  element.appendChild( renderer.domElement );


  function pointGenerator(x, y){

    return new THREE.Vector3( x-.5, y-.5, (Pi1((x*140)+100) + Pi2((y*140)+100))/500 );

  }


  var geometry = new THREE.ParametricGeometry( pointGenerator, 40, 40 );

  var point, face, numberOfSides;

  for ( var i = 0; i < geometry.vertices.length; i++ ) 
  {
    point = geometry.vertices[ i ];
    color = new THREE.Color( 0x0000ff );
    color.setHSL( point.z*4, 1, .8  );
    geometry.colors[i] = color; // use this array for convenience
  }

  var faceIndices = [ 'a', 'b', 'c', 'd' ];
  for ( var i = 0; i < geometry.faces.length; i++ ) 
  {
    face = geometry.faces[ i ];
    numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
    for( var j = 0; j < numberOfSides; j++ ) 
    {
      vertexIndex = face[ faceIndices[ j ] ];
      face.vertexColors[ j ] = geometry.colors[ vertexIndex ];
    }
  }


  var material = new THREE.MeshBasicMaterial( {vertexColors: THREE.VertexColors, side:THREE.DoubleSide })

  var wireTexture = new THREE.ImageUtils.loadTexture( 'images/square.png' );
  wireTexture.wrapS = wireTexture.wrapT = THREE.RepeatWrapping; 
  wireTexture.repeat.set( 40, 40 );
  wireMaterial = this.surfaceMaterial = new THREE.MeshBasicMaterial( { 
    vertexColors: THREE.VertexColors, 
    side:THREE.DoubleSide,
    alphaMap: wireTexture,
    transparent: true,
    opacity:0.0
  } );



  var surface = new THREE.Mesh( geometry, wireMaterial );
  group.add( surface );





  // draw a line
  var material = this.lineMaterial = new THREE.LineBasicMaterial({
      color: 0x0000ff,
      linewidth: 1
  });

  var line_geometry = new THREE.Geometry();

  line_geometry.datum = [];

  d3.range(-.1,.9,.005).forEach(function(x){

    // (x*140)+100
    x = (x*140)+100;
    var d1 = demand1(x);
    var d2 = 1.2-d1;
    var y  = demand2Inv(d2);


    var xs = (x-100)/140;
    var ys = (y-100)/140;


    // var y = ((8 - Math.log(1.2 - demand1((x*140)+10))) / 0.048);
    var p = 
    new THREE.Vector3(
      xs - .5,
      ys - .5,
      // 0
      (Pi1((xs*140)+100) + Pi2((ys*140)+100))/500
    );


    // if(xs < 0) return;
    // if(ys < 0) return;
    // if(((Pi1((xs*140)+100) + Pi2((ys*140)+100))/500) < .) return;

    // var p = pointGenerator(i/100, i/100);
    // p.z+=.01
    line_geometry.vertices.push(
      p  
    );

    line_geometry.datum.push({
      x:x,
      y:y
    })

    // line_geometry.vertices.push(new THREE.Vector3(-1, 0, 0));

  })

  var line = new THREE.Line(line_geometry, material);

  group.add(line);




  var geometry = new THREE.SphereGeometry( .01, .01, .01 );
  var material = this.pointMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} );
  var sphere = new THREE.Mesh( geometry, material );
  group.add( sphere );




  var axisHelper = new THREE.AxisHelper( 1 );
  group.add( axisHelper );


  camera.position.z = 4;
  camera.lookAt(new THREE.Vector3(-.5,.5,0))


  // make it off to the right
  
  //{x: -4, y: 0, z: 15}

  camera.position.z = 15;
  camera.position.x = -4;

  this.camera = camera;




  group.rotation.x = 30;
  group.position.x = -.5;

  scene.add(group);


  // var rotate = { z: 0, y: 0 };
  // var tween = new TWEEN.Tween( rotate )
  //       .to( { z: 3, y: 1 }, 15000 )
  //       .repeat(Infinity)
  //       .yoyo(true)
  //       .easing( TWEEN.Easing.Quadratic.InOut )
  //       .start();



  // how long the ball takes to move (millis)
  var ballduration = 7000;
  var _this = this;

  var render = function (now) {
    TWEEN.update(now)

    requestAnimationFrame( render );


    var progress = (now/ballduration)%1;

    var j = ~~(progress * line_geometry.vertices.length);

    if(_this.showPoint){    
      sphere.position.x = line_geometry.vertices[j].x
      sphere.position.y = line_geometry.vertices[j].y
      sphere.position.z = line_geometry.vertices[j].z

      firstChart.showGuides(line_geometry.datum[j]);
    } else {
      sphere.position.y = -1000;
    }


    


    group.rotation.z += 0.005;

    // group.rotation.z = rotate.z;
    // group.rotation.y = rotate.y;

    renderer.render(scene, camera);
  };

  requestAnimationFrame(render);


  // hide everything

  this.surfaceMaterial.opacity = 0;
  this.lineMaterial.opacity = 0;
  this.lineMaterial.transparent = true;

  this.pointMaterial.opacity = 0;
  this.pointMaterial.transparent = true;

  this.showPoint = false;

}


Chart3d.prototype._show = function() {
  new TWEEN.Tween( this.camera.position )
        .to( { z: 4.5, x: -.4 }, 3000 )
        .easing( TWEEN.Easing.Quadratic.Out )
        .start();
}

Chart3d.prototype._surface = function(){
  new TWEEN.Tween( this.surfaceMaterial )
        .to( { opacity: 1 }, 1500 )
        .start();
}

Chart3d.prototype._line = function(){
  new TWEEN.Tween( this.lineMaterial )
        .to( { opacity: 1 }, 1500 )
        .start();
}

Chart3d.prototype._point = function(){
  this.showPoint = true;
  new TWEEN.Tween( this.pointMaterial )
        .to( { opacity: 1 }, 1500 )
        .start();
}

