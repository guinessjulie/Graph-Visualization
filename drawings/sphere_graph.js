
var Drawing = Drawing || {};

Drawing.SphereGraph = function(options) {
  var options = options || {};
  var layout = options.layout || "2d";

  var camera, scene, renderer, interaction, stats;
  var graph = new Graph({limit: options.limit});
  
  var geo = [];
  var info;
  
  
  var mouse = { x: 0, y: 0 }, mouseOnDown = { x: 0, y: 0 };
  var rotation = { x: 0, y: 0 },
      target = { x: Math.PI*3/2, y: Math.PI / 6.0 },
      targetOnDown = { x: 0, y: 0 };

  var distance = 100000, distanceTarget = 100000;
  var padding = 40;
  var PI_HALF = Math.PI / 2;
  

  init();
  createGraph();
  animate();

  function init() {
    // Three.js initialization
    camera = new THREE.TrackballCamera({
      fov: 35, 
      aspect: window.innerWidth / window.innerHeight,
      near: 1,
      far: 100000,

      rotateSpeed: 0.5,
      zoomSpeed: 5.2,
      panSpeed: 1,

      noZoom: false,
      noPan: false,

      staticMoving: false,
      dynamicDampingFactor: 0.3,

      keys: [ 65, 83, 68 ]
    });
    camera.position.z = 5000;

    scene = new THREE.Scene();
    
    // Globe
    // var geometry = new THREE.SphereGeometry(100, 110, 100);
    // 
    // 
    // material = new THREE.MeshBasicMaterial();
    // mesh = new THREE.Mesh(geometry, material);    
    // // mesh.matrixAutoUpdate = false;
    // scene.addObject(mesh);



    // particles

    // var PI2 = Math.PI * 2;
    // var material = new THREE.MeshNormalMaterial();
    // 
    // for ( var i = 0; i < 100; i ++ ) {
    //   
    //   var cube_geometry = new THREE.CubeGeometry( 100, 100, 100 );
    //   var draw_object = new THREE.Mesh( cube_geometry, [ new THREE.MeshBasicMaterial( {  color: Math.random() * 0xffffff } ) ] );
    //  draw_object.position.x = Math.random() * 2 - 1;
    //  draw_object.position.y = Math.random() * 2 - 1;
    //  draw_object.position.z = Math.random() * 2 - 1;
    //   // draw_object.position.normalize();
    //   // draw_object.position.multiplyScalar( Math.random() * 10 + 450 );
    //   
    //   
    //   var lat = randomFromTo(-90, 90);
    //   var lng = randomFromTo(-180, 180);
    // 
    //   var phi = (90 - lat) * Math.PI / 180;
    //   var theta = (180 - lng) * Math.PI / 180;
    //   
    //   draw_object.position.x = 1000 * Math.sin(phi) * Math.cos(theta);
    //   draw_object.position.y = 1000 * Math.cos(phi);
    //   draw_object.position.z = 1000 * Math.sin(phi) * Math.sin(theta);
    // 
    //   // point.lookAt(mesh.position);
    // 
    //   // point.scale.z = -size;
    //   draw_object.updateMatrix();
    //   
    //   
    //  scene.addObject( draw_object );
    // 
    // }
    // 
    // for (var i = 0; i < 300; i++) {
    // 
    //   var geometry = new THREE.Geometry();
    // 
    //   var vector = new THREE.Vector3( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
    //   vector.normalize();
    //   vector.multiplyScalar( 450 );
    // 
    //   geometry.vertices.push( new THREE.Vertex( vector ) );
    // 
    //   var vector2 = vector.clone();
    //   vector2.multiplyScalar( Math.random() * 0.3 + 1 );
    // 
    //   geometry.vertices.push( new THREE.Vertex( vector2 ) );
    // 
    //   var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xff0000, opacity: Math.random() } ) );
    //   scene.addObject( line );
    // }
    

    var sphere_geometry = new THREE.SphereGeometry(4900, 110, 100);
    material = new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.3 });
    mesh = new THREE.Mesh(sphere_geometry, material);    
    // mesh.matrixAutoUpdate = false;
    scene.addObject(mesh);




    renderer = new THREE.WebGLRenderer({antialias: true});

    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );
  
    // Stats.js
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    document.body.appendChild( stats.domElement );

    info = document.createElement("div");
    info.style.position = 'absolute';
    info.style.top = '100px';
    
    document.body.appendChild( stats.domElement );
    document.body.appendChild( info );
  
    // info = document.getElementById("info");
  }
  
  
  function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }
  


  function createGraph() {
    var node = new Node(0);
    graph.addNode(node);
    drawNode(node);

    var nodes = [];
    nodes.push(node);
  
    var steps = 1;
    do {
      var node = nodes.shift();

      var numEdges = randomFromTo(1, 10);
      for(var i=1; i <= numEdges; i++) {
        var target_node = new Node(i*steps);
        if(graph.addNode(target_node)) {
          drawNode(target_node);
          nodes.push(target_node);
          if(graph.addEdge(node, target_node)) {
            drawEdge(node, target_node);
          }
        }
      }
      steps++;
    } while(nodes.length != 0 && steps < 100);
  
    graph.layout = new Layout.ForceDirectedSphere(graph, {width: 2000, height: 2000, iterations: 400});
    // if(layout === "3d") {
    //   graph.layout = new Layout.ForceDirected3D(graph, {width: 2000, height: 2000, iterations: 100});
    // } else {
    //   graph.layout = new Layout.ForceDirected(graph, {width: 2000, height: 2000, iterations: 2000});
    // }
    graph.layout.init();
  }



  function drawNode(node) {
    var geometry;
    geometry = new THREE.CubeGeometry( 50, 50, 50 );
    // if(layout === "3d") {
    //   geometry = new THREE.CubeGeometry( 50, 50, 50 );
    // } else {
    //   geometry = new THREE.CubeGeometry( 50, 50, 0 );
    // }
    var draw_object = new THREE.Mesh( geometry, [ new THREE.MeshBasicMaterial( {  color: Math.random() * 0xffffff } ), new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, wireframe: true } ) ] );

    // label
    // var labelCanvas = document.createElement( "canvas" );
    // var xc = labelCanvas.getContext("2d");
    // labelCanvas.width = labelCanvas.height = 128;
    // // xc.shadowColor = "#000";
    // // xc.shadowBlur = 7;
    // // xc.fillStyle = "orange";
    // xc.font = "50pt arial bold";
    // xc.fillText("myText", 10, 64);
    // 
    // var xm = new THREE.MeshBasicMaterial( { map: new THREE.Texture( labelCanvas ), transparent: true } );
    // xm.map.needsUpdate = true;

    var area = 2000;
    draw_object.position.x = Math.floor(Math.random() * (area + area + 1) - area);
    draw_object.position.y = Math.floor(Math.random() * (area + area + 1) - area);
      
    // 
    // if(layout === "3d") {
    //   draw_object.position.z = Math.floor(Math.random() * (area + area + 1) - area);
    // }

    // var area = 2000;

    // var lat = randomFromTo(-90, 90);
    // var lng = randomFromTo(-180, 180);
    // 
    // var phi = (90 - lat) * Math.PI / 180;
    // var theta = (180 - lng) * Math.PI / 180;
    // 
    // draw_object.position.lat = lat;
    // draw_object.position.lng = lng;
    // 
    // draw_object.position.x = area * Math.sin(phi) * Math.cos(theta);
    // draw_object.position.y = area * Math.cos(phi);
    // draw_object.position.z = area * Math.sin(phi) * Math.sin(theta);
    
    // if(layout === "3d") {
      // draw_object.position.z = area * Math.sin(phi) * Math.sin(theta);
    // }

    // draw_object.lookAt(camera.position);


    // var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), xm );
    // mesh.position.x = draw_object.position.x;
    // mesh.position.y = draw_object.position.y;
    // mesh.doubleSided = true;
    // mesh.draw_object = draw_object;
    // mesh.updateMatrix();
    // mesh.type = "label";
    // scene.addObject(mesh);

    draw_object.id = node.id;
    node.data.draw_object = draw_object;
    node.layout = {}
    node.layout.max_X = 90;
    node.layout.min_X = -90;
    node.layout.max_Y = 180;
    node.layout.min_Y = -180;
    
    node.position = draw_object.position;
    scene.addObject( node.data.draw_object );
  }


  function drawEdge(source, target) {
      material = new THREE.LineBasicMaterial( { color: 0xCCCCCC, opacity: 0.5, linewidth: 0.5 } );
      var tmp_geo = new THREE.Geometry();
    
      tmp_geo.vertices.push(new THREE.Vertex(source.data.draw_object.position));
      tmp_geo.vertices.push(new THREE.Vertex(target.data.draw_object.position));

      line = new THREE.Line( tmp_geo, material, THREE.LinePieces );
      line.scale.x = line.scale.y = line.scale.z = 1;
      line.originalScale = 1;
      
      line.geometry.__dirtyVertices = true;
      
      geo.push(tmp_geo);
      
      scene.addObject( line );
  }




    function addPoint(lat, lng, size, color, subgeo) {


      // var phi = (90 - lat) * Math.PI / 180;
      // var theta = (180 - lng) * Math.PI / 180;
      // 
      // point.position.x = 200 * Math.sin(phi) * Math.cos(theta);
      // point.position.y = 200 * Math.cos(phi);
      // point.position.z = 200 * Math.sin(phi) * Math.sin(theta);
      // 
      // point.lookAt(mesh.position);
      // 
      // point.scale.z = -size;
      // point.updateMatrix();
      // 
      // var i;
      // for (i = 0; i < point.geometry.faces.length; i++) {
      // 
      //   point.geometry.faces[i].color = color;
      // 
      // }
      // 
      // GeometryUtils.merge(subgeo, point);
      
      
      
      // particles

      // var PI2 = Math.PI * 2;
      // var material = new THREE.MeshNormalMaterial();
      // 
      // for ( var i = 0; i < 1000; i ++ ) {
      // 
      //  particle = new THREE.Particle( material );
      //  particle.position.x = Math.random() * 2 - 1;
      //  particle.position.y = Math.random() * 2 - 1;
      //  particle.position.z = Math.random() * 2 - 1;
      //  particle.position.normalize();
      //  particle.position.multiplyScalar( Math.random() * 10 + 450 );
      //  scene.addObject( particle );
      // 
      // }


      
      
      
    }






  function animate() {
    requestAnimationFrame( animate );
    render();
  }


  function render() {
    if(graph.layout.generate()) {
      info.style.border = '10px solid red';
    } else {
      info.style.border = 'none';      
      graph.layout.transform();
    }
      
  
    for(var i=0; i<geo.length; i++) {
      geo[i].__dirtyVertices = true;
    }
    for(var i=0; i<graph.nodes.length; i++) {
      graph.nodes[i].data.draw_object.lookAt(camera.position);
    }
    
    // rotation.x += (target.x - rotation.x) * 0.1;
    // rotation.y += (target.y - rotation.y) * 0.1;
    // distance += (distanceTarget - distance) * 0.3;
    // 
    // camera.position.x = distance * Math.sin(rotation.x) * Math.cos(rotation.y);
    // camera.position.y = distance * Math.sin(rotation.y);
    // camera.position.z = distance * Math.cos(rotation.x) * Math.cos(rotation.y);

    // vector.copy(camera.position);

    // renderer.clear();
    
    
    // scene.objects.forEach(function(obj) {
    //   if(obj.type === "label") {
    //     var delta_x = obj.position.x - obj.draw_object.position.x;
    //     var delta_y = obj.position.y - obj.draw_object.position.y;
    //     if(Math.sqrt(delta_x*delta_x) > 300) {
    //       obj.position.x = obj.draw_object.position.x;
    //     }
    //     if(Math.sqrt(delta_y*delta_y) > 300) {
    //       obj.position.y = obj.draw_object.position.y;
    //     }
    //     drawText(obj, obj.draw_object.position.y);
    //   }
    // });
  
    renderer.render( scene, camera );
    // interaction.update();
    stats.update();
  }


  function drawText(draw_object, text) {
    draw_object.materials[0].map.image = null;
    var textCanvas = document.createElement( "canvas" );
    var xc = textCanvas.getContext("2d");
    // xc.shadowColor = "#000";
    // xc.shadowBlur = 7;
    xc.font = "50pt arial bold";
    xc.fillText(text, 10, 64);
    draw_object.materials[0].map.image = textCanvas;
  }


  function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }

}