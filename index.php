<?php ob_start("ob_gzhandler"); 
/*
  Warwickshire info by Christian Heilmann
  Homepage: http://isithackday.com/demos/warwickshire
  Copyright (c)2010 Christian Heilmann
  Code licensed under the BSD License:
  http://wait-till-i.com/license.txt
*/
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">  
  <title>Warwickshire information</title>
  <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/combo?2.8.0/build/reset-fonts-grids/reset-fonts-grids.css&2.8.0/build/base/base-min.css">
  <link rel="stylesheet" type="text/css" href="warwick.css">
</head>
<body class="yui-skin-sam">
<div id="doc" class="yui-t7">

  <div id="hd" role="banner">
    <h1>Warwickshire information</h1>
    <p class="intro">Here you can find out all about the libraries, 
      parks and museums and schools around Warwickshire.</p>
  </div>
  <div id="bd" role="main">
    <div id="container"><div id="map"></div><div id="info"></div></div>
    <?php

$yql = 'select * from xml where url in ('.
       '"http://ws.warwickshire.gov.uk/parks.xml",'.
       '"http://ws.warwickshire.gov.uk/libraries.xml",'.
       '"http://ws.warwickshire.gov.uk/museums.xml",'.
       '"http://opendata.s3.amazonaws.com/schools/schools-warwickshire.xml"'.
       ')';    
$url = 'http://query.yahooapis.com/v1/public/yql?q='.urlencode($yql).
       '&diagnostics=false&format=json';
$ch = curl_init(); 
curl_setopt($ch, CURLOPT_URL, $url); 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
$output = curl_exec($ch); 
curl_close($ch);
$data = json_decode($output);

/* Parks */

echo '<div class="section"><h2>Parks ('.
      sizeof($data->query->results->parks->park).
     ')</h2><ul id="parks">';
foreach($data->query->results->parks->park as $k=>$p){
  echo '<li';
  if($p->image){echo' class="hasimg"';}
  echo ' id="p'.$k.'">';
  echo '<h3><a href="'.$p->link.'"><span class="name">'.
        $p->name.'</span></a></h3>';
  if($p->image){
    echo '<img class="photo" src="'.$p->image.'" alt="'.$p->name.'">';
  }
  addpara('',$p->address->street);
  addpara('',$p->address->area);
  addpara('',$p->address->town_city);
  addpara('',$p->address->county);
  addpara('',$p->address->postcode);
  echo '<p class="geo">Location: <span>'.
        $p->coordinates.'</span></p></li>';
}
echo '</ul></div>';

/* Museums */

echo '<div class="section"><h2>Museums ('.
      sizeof($data->query->results->museums->museum).
     ')</h2><ul id="museums">';
foreach($data->query->results->museums->museum as $k=>$m){
  echo '<li';
  if($m->image){echo' class="hasimg"';}
  echo ' id="m'.$k.'">';
  echo '<h3><a href="'.$m->link.'"><span class="name">'.
        $m->name.'</span></a></h3>';
  if($m->image){
    echo '<img class="photo" src="'.$m->image.'" alt="'.$m->name.'">';
  }
  addpara('',$m->address->buildingname);
  addpara('',$m->address->street);
  addpara('',$m->address->area);
  addpara('',$m->address->town_city);
  addpara('',$m->address->county);
  addpara('',$m->address->postcode);
  addpara('Telephone',$m->telno);
  addpara('Group Bookings',$m->groupbookingsno);
  if($m->email){
    echo   '<p>Email: <a href="mailto:'.$m->email.'">'.
            $m->email.'</a></p>';
  }
echo '<p class="geo">Location: <span>'.$m->coordinates.'</span></p></li>';
}
echo '</ul></div>';

/* Libraries */

echo '<div class="section"><h2>Libraries ('.
      sizeof($data->query->results->libraries->library).
      ')</h2><ul id="libraries">';
foreach($data->query->results->libraries->library as $k=>$l){
  echo '<li';
  if($l->image){echo' class="hasimg"';}
  echo ' id="l'.$k.'">';
  echo '<h3><a href="'.$l->link.'"><span class="name">'.
        $l->name.'</span></a></h3>';
  if($l->image){
    echo '<img class="photo" src="'.$l->image.'" alt="'.$l->name.'">';
  }
  addpara('',$l->address->street);
  addpara('',$l->address->area);
  addpara('',$l->address->town_city);
  addpara('',$l->address->county);
  addpara('',$l->address->postcode);
  addpara('Telephone',$l->telno);
  addpara('Fax',$l->faxno);
  if($l->email){
    echo '<p>Email: <a href="mailto:'.$l->email.'">'.$l->email.'</a></p>';
  }
  echo '<p class="geo">Location: <span>'.
        $l->coordinates.'</span></p></li>';
}
echo '</ul></div>';

/* Schools */

echo '<div class="section"><h2>Schools ('.
      sizeof($data->query->results->RECORDS->SCHOOL).
     ')</h2><ul id="schools">';
foreach($data->query->results->RECORDS->SCHOOL as $k=>$s){
  echo '<li id="s'.$k.'">';
  echo '<h3><span class="name">'.$s->SCH_NAME.'</span></h3>';
  addpara('',ucwords(strtolower($s->ADDRESS_1)));
  addpara('',ucwords(strtolower($s->ADDRESS_2)));
  addpara('',ucwords(strtolower($s->ADDRESS_3)));
  addpara('Post code',$s->POSTCODE);
  addpara('Type',$s->SCH_TYPE);
  addpara('',$s->EDUC_AREA);
  echo '<p class="geo">Location: <span>'.
        $s->LATTIUDE.','.$s->LONGITUDE.'</span></p></li>';
}
echo '</ul></div>';


function addpara($s,$p){
  if($p){
    echo '<p>';
    if($s!=''){echo $s.': ';}
    echo $p.'</p>';
  }
}
?>
  </div>
  <div id="ft" role="contentinfo">
    <p>Written by <a href="http://wait-till-i.com">Christian Heilmann</a> , icons by <a href="http://bogo-d.deviantart.com/">Bogdan Mihaiciuc</a>, data provided by <a href="http://glowing-sunrise-23.heroku.com/datasets">the Warwickshire Open Data programme</a>.</p>
  </div>
</div>
<script type="text/javascript" charset="utf-8">
  document.body.className+=" js";
</script>
<script src="http://api.maps.yahoo.com/ajaxymap?v=3.8&appid=SckyCn7V34EmWovT9sK7Z2ivzd2NtNKOMzTWVFwViDtkNLvxNKbiLqqWN9nqtdg-'"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/3.1.1/build/yui/yui-min.js"></script>
<script src="warwick.js"></script>
</body>
</html>
<?php ob_flush(); flush(); ?>