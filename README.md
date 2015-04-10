# Simegraph JS
Animated jpgs. A small javascript lib and a few views to create high quality animated jpegs.

* Official website: http://www.padrone.nl/
* Licensing: http://www.padrone.nl/simegraph_license
* Support: contact me

## How it works

* Explanation how it works: http://padrone.nl/rembrandt_simegraph

## Step by step guide 

* Demo related to this howto: http://www.padrone.nl/simegraph/

# Instructions

This instruction is based on mac-os, if you're use a linux flavor it should be straight forward and even easier for you.

Chose to apply a Mask color (white, red or green or black) that works best with your animation jpg's. The example is a really bad combo → white. The walking man has a white bag which is almost blown out – there is a white colored edge at the building he passes. It's a terrible combination - great for testing, even though the result is reasonable good. With a green mask this animation would work better (as in easier and more reliable cross browser).

For best results use a tripod and remote trigger if you are capturing jpg's and/or movie segments. The example was shot with the camera semi hand-hold – I've corrected a bit for it, but you can see it in the details.

Keep enough margin in the animation jpegs – to clear out the previous and next step (for back/forth animation) and to have some margin for the jpg color filter. I'm talking here about margin between the mask edge and the animating / changing pixels. As a minimum this margin should be 16pixels, I advise to take more, e.g. 32 pixels, to prevent any bleeding of the mask area into the animation bits.

For best results, don't use jpg's for the animation but start of with only png files (lossless), the resulting composite.jpg will have only one pass of jpeg artifacts.

Download & place the package in a folder on your local web-directory (see System preferences, web-sharing, open website folder).

File name | Description
--------- | -----------
dev.html | Starting point, to do the animation with individual jpegs
index.html | Closure compiled result (strips of all the development related javascript)
cut.html | To create the composite image, one single image for all animation jpgs
fast.html | To do the animation with the composite jpegs
simegraph.js | The script for building the animation, intended for developing only
simegraph1.js | The reduced script for the fast version of the animation (for 'production'). Note: for development use simegraph.js.
impage.css | A bit of styling

Place your base.jpg and the animation jpg's in the same folder

Prepare the list of jpg's, for copy/paste into index.html

Open a terminal window
```bash
cd path_where_the_jpgs_are_stored
ls -1 -r *.jpg
```

if that fails, you can type them by hand.

Place the list of jpgfiles in the jpgFiles array

```javascript
var jpgFiles = [
          {name:"P3260805.jpg"},  // this first file is the base jpg (the whole scene)
          {name:"P3260804.jpg"},  // these next are masked out animation frames
          {name:"P3260803.jpg"},
          {name:"P3260802.jpg"},
          {name:"P3260801.jpg"},
          {name:"P3260800.jpg"},
          {name:"P3260799.jpg"},
          {name:"P3260798.jpg"},
          {name:"P3260797.jpg"},
          {name:"P3260796.jpg"},
          {name:"P3260795.jpg"},
          {name:"P3260794.jpg"},
          {name:"P3260793.jpg"},
          {name:"P3260792.jpg"},
          {name:"P3260791.jpg"},
          {name:"P3260790.jpg"},
          {name:"P3260789.jpg"},
          {name:"P3260788.jpg"},
          {name:"P3260787.jpg"},
          {name:"P3260786.jpg"},
          {name:"P3260785.jpg"},
          {name:"P3260784.jpg"}
      ]
```

Change the size of the canvas, based on the width/height of your image

```html
<canvas id="myCanvas" width="1600" height="900"></canvas>
```

Change the size and destination position for your animation jpg's, in case you have cropped them:

```javascript
	var compCoordinates = [
                 {name:"", x:0,y:0,w:1600,h:900, dx:0, dy:0}
            ]
```

Configure the parameters for the simegraph.js:

```javascript
	var sconf = {  …  }
```

Parameter | Value | Description
--------- | ----- | -----------
mask | “FFFFFF” | Masking color in RGB hex format, in general I would advise to use green “00FF00”
basicDraw | true | Do the basic draw method (vs creating composite and using the composite by fastDraw)
addReverseJpgFiles | true | Adds the reverse sequence of the jpg files (for reverse animation)
frameSpeed | 500 | Time per frame in milliseconds, change to 40 for 25fps
waitTimeStart | 5000 | In milliseconds, change to 1000 or so, if you are testing
waitTimeRepeat | 3000 | In milliseconds
jpgColorMargin | 1 | Experimental. Some (most) browsers seem to just fail to render the proper color (e.g. as gimp would), even after a 16pixels block – depending on the color. For a green mask I use the value 6 here.
filterDepth | 14 | Experimental. For green mask I use value 10
filterThreshold | 7 | Experimental. For green mask I use value 6

Check if the animation looks good, test it in different browsers. Else go back and make changes.

If all looks ok, create the composite.jpg. Pass the settings from index.html to cut.hml
* Check it, note you need to disable basicDraw.
* Add/change to sconf:
* compositeDraw: true
* waitTimeRepeat: 0 // dont repeat
* addReverseJpgFiles: false

In cut.html, tweak the width and height of the composite canvas so all animation frames fit well:

```html
<canvas id="compositeCanvas" width="1660" height="870"></canvas>
```

If all fits well on the composite, right mouse click it and save the composite as composite.png, change it to a jpg, preferably with a high quality standard (I use 95%)

Look at the console output of cut.html, copy the generated comCoordinates object and paste it in fast.html

Update the sconf parameters and jpgFiles array in fast.html
For sconf:
* remove compositeDraw:true
* add fastDraw: true
* set addReverseJpgFiles to true.

Important: note that jpgFiles has a for each frameName a second parameter, time. You need to add it. Here you can tweak the time per frame. 
E.g. by adding a multiply factor to frameSpeed which slowly goes from 1 to 0.1 to really slowdown the animation etc.

```javascript
var jpgFiles = [
              {name:"P3260805.jpg", time: frameSpeed * 1.0},
              {name:"P3260804.jpg", time: frameSpeed * 1.1},
              {name:"P3260803.jpg", time: frameSpeed * 1.2},
              ….
```
Important: check the size of canvasVirtual, it needs to hold the composite.jpg, so its width and height should match.

Bummer, it doesnt work – white area in around the walking man in fast.html while it was good in index and cut.html 

I solved it here by tweaking the parameters, first: change waitTimeRepeat and waitTimeStart to low values (e.g. 500) so you dont need to wait so long. Change the frameSpeed to say 500 – so you have time to observe the individual frames.

Changed sconf parameters:
* jpgColorMargin:2
* filterDepth:14
* filterThreshold:6

If all looks good, you can generate the result.html → a reduced javascript blob – as you dont need all thats in simegraph.js

To do this, install google closure compiler, it has a dependency on java but its worth it.

If you dont want to do this step, you can include the simegraph1.js script instead of simegraph.js. It's a reduced version / closure compiled version of simegraph.js for the fast animation option.
Do not use the simegraph.js on 'production', but use simegraph1.js instead.

Here are the steps to closure compile your animation into one single blob:

Next copy the javascript in fast.html into a file named fast.js
Add the contents of simegraph.js to this fast.js
Important: Change the var closureCompile to true

```bash
java -jar compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --js_output_file=out.js fast.js
```

Next open the file out.js, you need to make some edits in it:

From the end of the file search backwards to two instances of a xxx.onload.call(xxx)
These need to be removed, they are added so the closure compiler doesn't optimize everything away (as the onload.call is normally triggered by the browser, not the js code).
e.g. remove:
```javascript
V.onload.call(V)
W.onload.call(W)
```
Place the js blob in the result.html, you don't need the simegraph.js anymore! leave it out.

```html
<!DOCTYPE HTML>
<html>
  <head>
    <link type="text/css" href="impage.css" rel="stylesheet">
  </head>
  <body>
    <div id='divElement'>
      <canvas id="myCanvas" width="1600" height="900"></canvas>
    </div>
    <div style="display:none">
      <canvas id="canvasVirtual" width="1660" height="870"></canvas>
    </div>
    <script>

	// place the blob here


    </script>
  </body>
</html>
```

Or if you didnt bother:

```html
<!DOCTYPE HTML>
<html>
  <head>
    <link type="text/css" href="impage.css" rel="stylesheet">
  </head>
  <body>
    <div id='divElement'>
      <canvas id="myCanvas" width="1600" height="900"></canvas>
    </div>
    <div style="display:none">
      <canvas id="canvasVirtual" width="1660" height="870"></canvas>
    </div>
    <script>

      // place sconf, compCoordinates and jpgFiles variables here.
    
    </script>
    <script src="simegraph1.js"></script>
  </body>
</html>
```

