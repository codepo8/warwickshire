/*
  Warwickshire info by Christian Heilmann
  Homepage: http://isithackday.com/demos/warwickshire
  Copyright (c)2010 Christian Heilmann
  Code licensed under the BSD License:
  http://wait-till-i.com/license.txt
*/
wws = {};
YUI().use('node',function(Y){

/* Add class to body to trigger CSS hiding */

  Y.one('body').addClass('js');

/* Make headers keyboard accessible */

  Y.all('.section h2').set('tabIndex',-1);
  Y.all('.section ul').set('tabIndex',-1);
  Y.one('#info').set('tabIndex',-1);

/* show and hide sections under h2 headings using event delegation */

  Y.delegate('click', function(e) {
    e.preventDefault();
    var dad = Y.one(e.target).ancestor('div');
    if(dad.hasClass('show')){
      dad.removeClass('show');
    } else {
      dad.addClass('show');
      var next = Y.one(e.target).next('ul');
      next.focus();
    }
  }, '#bd', 'h2');

/* Welcome blurb */

   Y.one('#info').set('innerHTML',
   '<h2>Get all the information here</h2>'+
   '<p>Click any of the icons on the map to the right to get '+
   'detail information about the location.</p>'+
   '<p>You can make the map less busy by turning features on and off'+
   'with the buttons above.</p>'
  ).addClass('intro');

/* Start map */

  var points = [];
  wws.map = new YMap(Y.one('#map')._node);
  wws.map.addTypeControl();
  wws.map.addZoomLong();
  wws.map.addPanControl();
  wws.map.disableKeyControls();
  wws.map.setMapType(YAHOO_MAP_HYB);

/* Get Parks information and add markers */

  var parks = Y.all('#parks .name').get('innerHTML');
  var parklocs = Y.all('#parks .geo span').get('innerHTML');
  for(var i=0,j=parks.length;i<j;i++){
    var coor = parklocs[i].split(',');
    var point = new YGeoPoint(coor[0],coor[1]);
    points.push(point);
    var img = new YImage();
    img.src = 'park.png';
    img.size = new YSize(32,32);
    var marker = new YMarker(point,img,'mp'+i);
    YEvent.Capture(marker, EventsList.MouseClick,   
      function(i){
       var src = document.getElementById(i.thisObj.id.replace('m',''));
        wws.showinfo(src.innerHTML);  
      });   
      marker.addAutoExpand(parks[i] + ' (click for more)');
    wws.map.addOverlay(marker);
  };

/* Get Museums information and add markers */

  var museums = Y.all('#museums .name').get('innerHTML');
  var museumlocs = Y.all('#museums .geo span').get('innerHTML');
  for(i=0,j=museums.length;i<j;i++){
    coor = museumlocs[i].split(',');
    point = new YGeoPoint(coor[0],coor[1]);
    points.push(point);
    img = new YImage();
    img.src = 'museum.png';
    img.size = new YSize(32,32);
    marker = new YMarker(point,img,'mm'+i);
    YEvent.Capture(marker, EventsList.MouseClick,   
      function(i){
       var src = document.getElementById(i.thisObj.id.replace('m',''));
        wws.showinfo(src.innerHTML);  
      });   
    marker.addAutoExpand(museums[i] + ' (click for more)');
    wws.map.addOverlay(marker);
  };
  
/* Get Libraries information and add markers */

  var libraries = Y.all('#libraries .name').get('innerHTML');
  var librarylocs = Y.all('#libraries .geo span').get('innerHTML');
  for(i=0,j=libraries.length;i<j;i++){
    coor = librarylocs[i].split(',');
    point = new YGeoPoint(coor[0],coor[1]);
    points.push(point);
    img = new YImage();
    img.src = 'library.png';
    img.size = new YSize(32,32);
    marker = new YMarker(point,img,'ml'+i);
    YEvent.Capture(marker, EventsList.MouseClick,   
      function(i){
       var src = document.getElementById(i.thisObj.id.replace('m',''));
        wws.showinfo(src.innerHTML);  
      });   
    marker.addAutoExpand(libraries[i] + ' (click for more)');
    wws.map.addOverlay(marker);
  };
  
/* Get Schools information and add markers */

  var schools = Y.all('#schools .name').get('innerHTML');
  var schoollocs = Y.all('#schools .geo span').get('innerHTML');
  for(i=0,j=schools.length;i<j;i++){
    coor = schoollocs[i].split(',');
    point = new YGeoPoint(coor[0],coor[1]);
    points.push(point);
    img = new YImage();
    img.src = 'school.png';
    img.size = new YSize(32,32);
    marker = new YMarker(point,img,'ms'+i);
    YEvent.Capture(marker, EventsList.MouseClick,   
      function(i){
       var src = document.getElementById(i.thisObj.id.replace('m',''));
        wws.showinfo(src.innerHTML);  
      });   
    marker.addAutoExpand(schools[i] + ' (click for more)');
    wws.map.addOverlay(marker);
    marker.hide();
  };

/* Find best zoom level and draw map */

  var zac = wws.map.getBestZoomAndCenter(points);
  var level = zac.zoomLevel;
  wws.map.drawZoomAndCenter(zac.YGeoPoint,level-2);

/* Add the button after the map to trigger the resize functionality */

  Y.one('#container').append(
    '<button id="size">&#8595; larger map &#8595;</button>'
  );
  
/* Add the buttons to show and hide markers of various types */
/* Make the "schools" one inactive by default as there are far too many */

  Y.one('#container').prepend(
    '<div class="buttons">'+
    '<button id="librariesbutton">hide libraries</button>'+
    '<button id="parksbutton">hide parks</button>'+
    '<button id="museumsbutton">hide museums</button>'+
    '<button id="schoolsbutton" class="inactive">show schools</button>'+
    '</div>'
  );

/* Use event delegation to add handlers to all the buttons */

  Y.delegate('click',function(event){
    var t = Y.one(event.target);

/* switch on the ID of the button */

    switch(t.get('id')){

/* and fork accordingly */

      case 'size':
        if(t.get('innerHTML').indexOf('smaller map')!=-1){
          t.set('innerHTML','&#8595; larger map &#8595;');
          Y.one('#map').setStyle('height','280px');
        } else {
          t.set('innerHTML','&#8593; smaller map &#8593;');
          Y.one('#map').setStyle('height','600px');
        }
      break;

      case 'librariesbutton':
        if(t.get('innerHTML').indexOf('hide')!=-1){
          wws.toggleMarkers('ml',0);
          t.set('innerHTML','show libraries');
          t.addClass('inactive');
        } else {
          wws.toggleMarkers('ml',1);
          t.set('innerHTML','hide libraries');
          t.removeClass('inactive');
        }
      break;

      case 'parksbutton':
        if(t.get('innerHTML').indexOf('hide')!=-1){
          wws.toggleMarkers('mp',0);
          t.set('innerHTML','show parks');
          t.addClass('inactive');
        } else {
          wws.toggleMarkers('mp',1);
          t.set('innerHTML','hide parks');
          t.removeClass('inactive');
        }
      break;

      case 'museumsbutton':
        if(t.get('innerHTML').indexOf('hide')!=-1){
          wws.toggleMarkers('mm',0);
          t.set('innerHTML','show museums');
          t.addClass('inactive');
        } else {
          wws.toggleMarkers('mm',1);
          t.set('innerHTML','hide museums');
          t.removeClass('inactive');
        }
      break;

      case 'schoolsbutton':
        if(t.get('innerHTML').indexOf('hide')!=-1){
          wws.toggleMarkers('ms',0);
          t.set('innerHTML','show schools');
          t.addClass('inactive');
        } else {
          wws.toggleMarkers('ms',1);
          t.set('innerHTML','hide schools');
          t.removeClass('inactive');
        }
      break;

    }
  },'#container','button');

/* A simple function to set the content of the info window */

  wws.showinfo = function(html){
    Y.one('#info').set('innerHTML',html).removeClass('intro');
    if(Y.one('#info a')){
      Y.one('#info a').focus();
    } else {
      Y.one('#info').focus();
    }
  };

/* function to toggle the markers of a certain kind */

  wws.toggleMarkers = function(str,what){
    var markers = wws.map.getMarkerIDs();
    for(var i=0;i<markers.length;i++){
      if(markers[i].indexOf(str)!==-1){
        var m = wws.map.getMarkerObject(markers[i]);
        if(what){
          m.unhide(); 
        } else {
          m.hide();
        }
      }
    }
  };
});
