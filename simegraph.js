

      var closureCompile = false;
      var DBG = true && !closureCompile;

      // ------- configuration ------------------

      var default_mask = "00FF00";  // RGB, use the max/min values: 00 or FF
      var default_addReverseJpgFiles = true;
      var default_fastDraw = false;
      var default_basicDraw = false;
      var default_compositeDraw = false;
      var default_frameSpeed = 33;
      var default_waitTimeStart = 3000;
      var default_waitTimeRepeat = 3000;
      var default_jpgPath = "img/";
      
      // expiremental parameters
      var default_jpgColorMargin = 6;  // typically range 1 to 10, depends on how well jpg's are rendered in various browsers
      var default_filterDepth = 10;    // typically close to one jpg bock of 16 pixels
      var default_filterThreshold = 6; // typically around halve of filterDepth value


      // example sconf - to start with:
      /*
      var sconf = {
        mask: "00FF00",
        basicDraw: true,
        addReverseJpgFiles: false,
        frameSpeed: 1000, 
        waitTimeStart: 1000,
        waitTimeRepeat: 5000,
        default_jpgColorMargin: 6,
        default_filterDepth: 10,
        default_filterThreshold, 6
      }
      */


      // initailize local _conf based on setting from global sconf
      var _conf = {
        mask: (sconf && sconf.mask) ? sconf.mask : default_mask,
        basicDraw: (sconf) ? (sconf.basicDraw ? true : false) : default_basicDraw,
        fastDraw: (sconf) ? (sconf.fastDraw ? true : false) : default_fastDraw,
        compositeDraw: (sconf) ? (sconf.compositeDraw ? true : false) : default_compositeDraw,
        addReverseJpgFiles: (sconf) ? (sconf.addReverseJpgFiles ? true : false) : default_addReverseJpgFiles,
        frameSpeed: (sconf && sconf.frameSpeed) ? sconf.frameSpeed : default_frameSpeed, 
        waitTimeStart: (sconf && sconf.waitTimeStart) ? sconf.waitTimeStart : default_waitTimeStart,
        waitTimeRepeat: (sconf && sconf.waitTimeRepeat) ? sconf.waitTimeRepeat : default_waitTimeRepeat,
        jpgColorMargin: (sconf && sconf.jpgColorMargin) ? sconf.jpgColorMargin : default_jpgColorMargin,
        filterDepth: (sconf && sconf.filterDepth) ? sconf.filterDepth : default_filterDepth,
        filterThreshold: (sconf && sconf.filterThreshold) ? sconf.filterThreshold : default_filterThreshold,
        jpgPath: (sconf && sconf.path) ? sconf.path : default_jpgPath
      }

      DBG && !_conf.basicDraw && !_conf.fastDraw && !_conf.compositeDraw && console.log("Error: no draw method chosen - check sconf");

      /*var mask = "00FF00";
      var basicDraw = true;
      var fastDraw = false;
      var compositeDraw = false;
      var frameSpeed = 10;
      var waitTimeStart = 7000;
      var waitTimeRepeat = 5000;
      var addReverseJpgFiles = true;
      */

      // ----  initialize statics ------------------
      var canvas = document.getElementById('myCanvas');
      var context = canvas.getContext('2d');

      var canvasVirtual = document.getElementById('canvasVirtual');
      var contextVirtual = canvasVirtual.getContext('2d');

      // optional canvas for drawing composite image (initialized later if required)
      var canvasComposite;
      var contextComposite;

      // helper methods for conversion between hex and decimal values
      function d2h(d) {return d.toString(16);}
      function h2d(h) {return parseInt(h,16);} 

      function drawImage(imageObj) {
        var x = 0;
        var y = 0;

        context.drawImage(imageObj, x, y);
      }

      var data = null; // virtual image data;
      var orgImageData = null; // real image (in view)
      var orgData = null; // data for real image

      // --------- drawImageDelta -------------------
      //  imageObj: the image to draw
      //  measureArea: boolean to optionally set tracking of the square area within the image that holds the delta (data) 
      //  cNumber: optional coordinate index (default is 0)
      function drawImageDelta2(imageObj, measureArea, cNumber) {
        var c = 0;
        if (cNumber) {
          c = cNumber;
        }
        var pos = compCoordinates[c];

        // get data of new image
        var xpos = 0;
        var ypos = 0;
        var width = canvas.width; 
        var height = canvas.height;

        var vWidth = canvasVirtual.width;
        var vHeight = canvasVirtual.height;

        if (!_conf.fastDraw) {  // fast draw uses one single composite image as source - no per frame image
          contextVirtual.drawImage(imageObj, 0, 0);
        }
        

        // -------------- start processing intensive stretch ---------------
        //                          do only ONCE
        if (!data || !_conf.fastDraw) {
          var imageData = contextVirtual.getImageData(xpos, ypos, vWidth, vHeight);
          data = imageData.data;
        }

        // get access to current image
        if (!orgData) {
          orgImageData = context.getImageData(xpos, ypos, width, height);
          orgData = orgImageData.data;
        }
        // -------------- end processing intensive stretch ---------------

        var dataLength = orgData.length;

        // measuring vars for determining interested data area (outer areas are mask only)
        var xa = width - 1;
        var xb = 0;
        var ya = height - 1;
        var yb = 0;
        var xactive = -1;
        var yactive = -1;

        //filter
        var jpegFilter = 0;        
        var filterDepth = _conf.filterDepth; // 10  14
        var filterThreshold = _conf.filterThreshold; //6  7
        var pixelRange = filterDepth * 2;
        var pixelRangeStep = pixelRange * 4;
        var hLine = filterDepth;
        var hLineStep = vWidth * 4 * hLine;
        // posStep = ++ (equals +1)
        var negStep = 2; // if at 1, the right edge is not filtered properly.


        // determine R,G,B filter values (to filter between mask and image data)
        var jpgColorMargin = 1; // if jpg was lossless this should be 1, typically 6 is needed (worst case chrome on macos)
        var whiteR = h2d(_conf.mask.substring(0,2));
        var whiteG = h2d(_conf.mask.substring(2,4));
        var whiteB = h2d(_conf.mask.substring(4,6));
        (whiteR > 125) ? (whiteR -= _conf.jpgColorMargin) : (whiteR += _conf.jpgColorMargin);
        (whiteG > 125) ? (whiteG -= _conf.jpgColorMargin) : (whiteG += _conf.jpgColorMargin);
        (whiteB > 125) ? (whiteB -= _conf.jpgColorMargin) : (whiteB += _conf.jpgColorMargin);


        for (var y = 0; y < pos.h; y++) {
          // precalculate the starting position in the data array
          var iBase = (vWidth * (y + pos.y) * 4) + (pos.x * 4);
          var dBase = (width * (y + ypos + pos.dy) * 4) + ((xpos + pos.dx) * 4); 
          jpegFilter = 0;
          
          for (var x = 0, i = iBase, d = dBase; x < pos.w; x++, i += 4, d += 4) {

            function checkForImage(datapos) {
              var result = false;
              if (  ((whiteR > 125) ? (data[datapos] < whiteR) : (data[datapos] > whiteR)) ||
                    ((whiteG > 125) ? (data[++datapos] < whiteG) : (data[++datapos] > whiteG)) || 
                    ((whiteB > 125) ? (data[++datapos] < whiteB) : (data[++datapos] > whiteB))  ) {
                result = true;
              }
              return result;
            }

            function checkForMask(datapos) {
              var result = false;
              if (  ((whiteR > 125) ? (data[datapos] > whiteR) : (data[datapos] < whiteR)) && 
                    ((whiteG > 125) ? (data[++datapos] > whiteG) : (data[++datapos] < whiteG)) && 
                    ((whiteB > 125) ? (data[++datapos] > whiteB) : (data[++datapos] < whiteB))  ) {
                result = true;
              }
              return result;
            }

            // check for Image content
            if (jpegFilter < filterDepth) {
              if (checkForImage(i)) {
                  jpegFilter++;
              }
            }

            
            // Check if mask is direct area
            // In the jpg, there is no hard boundary of pixels at 255,255,255 bordering pixels with real image data
            if (jpegFilter > 0) {
              var toRight = i + pixelRangeStep;
              if (x + pixelRange >= pos.w || checkForMask(toRight)) {
                jpegFilter -= negStep;
              }
              else {
                var above = i - hLineStep;
                if (above < 0 || checkForMask(above)) {
                    jpegFilter -= negStep;
                }
                else {
                  var below = i + hLineStep;
                  if (y + hLine >= pos.h || checkForMask(below)) {
                      jpegFilter -= negStep;
                  }
                }
              }
            }
            

            // copy pixel
            if (jpegFilter > filterThreshold) {
              var ii = i;
              var dd = d;
              orgData[dd] = data[ii];
              orgData[++dd] = data[++ii];
              orgData[++dd] = data[++ii];    
            }


            // ---- track/measure coordinates -------
            if (_conf.compositeDraw && measureArea) {
              if (jpegFilter > filterThreshold) {
                  // track top/left coordinate
                  if (xactive == -1) {
                    if (x < xa) {
                      xa = x;
                      //console.log("  xa:"+xa+"  y:"+y);
                    }
                    if (y < ya) {
                      ya = y;
                      //console.log("  ya:"+y);
                    }
                  }
                  xactive = 1;
              }
              else {
                // tack bottom/right coordinate
                if (xactive != -1) {
                  if (x > xb) {
                    xb = x;
                    //console.log("  xb:"+xb+"  y:"+y);
                  }
                  if (y > yb) {
                      yb = y;
                      //console.log("  yb:"+y);
                    }
                  xactive = -1;
                }
              }  
            }
          }
        }

        context.putImageData(orgImageData, xpos, ypos);

        // --- process tracked area results --------------
        if (_conf.compositeDraw && measureArea) {
          var margin = 40; // 2 x 16 block is 32 +  1/2 block extra margin
          // add filter margins
          xa -= margin;
          if (xa < 0) {
            xa = 0;
          }
          xb += margin;
          if (xb >= width) {
            xb = width - 1;
          }
          ya -= margin;
          if (ya < 0) {
            ya = 0;
          }
          yb += margin;
          if (yb >= height) {
            yb = height - 1;
          }

          //console.log("  xa,ya:"+xa+","+ya+"  xb,yb:"+xb+","+yb);
        
          var r = {x1:xa, y1:ya, x2:xb, y2:yb, dx:pos.dx, dy:pos.dy};

          return r;
        }
      }


      // -------- drawImageDelta_atPos ----------------------
      // copies the drawn image delta to composite Image
      //   pos: defines square area to copy (source area)
      //   des: defines position in composite image (destination position)
      function drawImageDelta_atPos(imageObj, pos, des) {
        // get data of new image
        var xpos = 0;
        var ypos = 0;
        var width = canvas.width;
        var height = canvas.height;
        var cWidth = canvasComposite.width;
        var cHeight = canvasComposite.height;

        //contextVirtual.drawImage(imageObj, 0, 0);
        var imageData = contextVirtual.getImageData(xpos, ypos, width, height);
        var data = imageData.data;

        var comp_imageData = contextComposite.getImageData(0, 0, cWidth, cHeight);
        var comp_data = comp_imageData.data;

        var dataLength = data.length;
        
        for (var x = pos.x1; x < pos.x2; x++) {
          for (var y = pos.y1; y < pos.y2; y++) {

            // source array pos
            var i = (width*y*4) + (x*4);

            // destination array pos
            var d = (cWidth*(des.y+y-pos.y1)*4) + (des.x+x-pos.x1)*4;
            //var d = (cWidth * (des.y + y) * 4) + (des.x + x) * 4;

            //var helps = " "+data[i]+", "+data[i+1]+", "+data[i+2];
            //console.log(helps);

            comp_data[d] = data[i];
            comp_data[++d] = data[++i];
            comp_data[++d] = data[++i];
          }
        }

        contextComposite.putImageData(comp_imageData, 0, 0);
      }


      // ----- checkImageDuplicate ------------
      // helper for drawImageComposite

      // list of images already drawn
      var processedImageNames = new Array();

      function checkImageDuplicate(imageName) {
        var isDuplicate = false;
        for (var n=0; n < processedImageNames.length; n++ ) {
          if (processedImageNames[n] == imageName) {
            isDuplicate = true;
          }
        }
        if (!isDuplicate) {
          processedImageNames.push(imageName);
        }
        return isDuplicate;
      }


      // helper - get filename from imageObject
      function getImageName(imageObj) {
        var imageNameArray = imageObj.src.split("/");
        var imageName = imageNameArray[imageNameArray.length - 1];
        return imageName;
      }


      // initialize start coordinates to draw composite image
      var cX = 0;
      var cY = 0;
      var cYnext = 0; // holds y position for next line of images in composite

      function drawImageComposite(imageObj) {
        var imageName = getImageName(imageObj);

        // -- make easy copy paste
        var iNr = imageObj.myImageIndex;
        if (iNr == 1) {
          console.log("var compCoordinates = [");
        }
        


        if (!checkImageDuplicate(imageName)) {

          var measureArea = true;
          var pos = drawImageDelta2(imageObj, measureArea);

          // check if we need to carriage return to next line (if image fits on current line)
          if (cX + (pos.x2 - pos.x1) >= canvasComposite.width) {
            cX = 0;
            cY += cYnext;
            cYnext = 0;
          }

          var des = {x:cX, y:cY};
          
          drawImageDelta_atPos(imageObj, pos, des);

          var consString = ("  {name:\""+imageName+"\", x:"+des.x+",y:"+des.y+",w:"+(pos.x2-pos.x1)+",h:"+(pos.y2-pos.y1)+
            ", dx:"+(pos.dx + pos.x1) + 
            ", dy:"+(pos.dy + pos.y1) + "}"
          );

          if (iNr == jpgFiles.length - 1) {
            consString += ("\n];");
          }
          else {
            consString += ",";
          }

          console.log(consString);

          // track largest vertical size for current horizontal line.
          var posYdelta = pos.y2 - pos.y1;
          if (posYdelta > cYnext) {
            cYnext = posYdelta;
          }
          
          cX += (pos.x2 - pos.x1);                
        }
      }


      // helper - fastdraw, get coordinates for fileName 
      function getCoordinates(fileName) {
        //var fileName = getImageName(imageObj);
        var l = compCoordinates.length;
        var result = 0;
        for (var n=0; n<l && !result; n++) {
          var cName = compCoordinates[n].name;
          if (cName == fileName) {
            result = n;
          }
        }
        return result;
      }

      // --- helper methods to determine if the jpg is visible or hidden ---------
      function getHiddenProp(){
          var prefixes = ['webkit','moz','ms','o'];
          
          // if 'hidden' is natively supported just return it
          if ('hidden' in document) return 'hidden';
          
          // otherwise loop over all the known prefixes until we find one
          for (var i = 0; i < prefixes.length; i++){
              if ((prefixes[i] + 'Hidden') in document) 
                  return prefixes[i] + 'Hidden';
          }

          // otherwise it's not supported
          return null;
      }
      function isHidden() {
          var prop = getHiddenProp();
          if (!prop) return false;
          
          return document[prop];
      }
      var visProp = getHiddenProp();
      if (visProp) {
        var evtname = visProp.replace(/[H|h]idden/,'') + 'visibilitychange';
        document.addEventListener(evtname, visChange);
      }
      function visChange() {
         
        if (isHidden()) {
              DBG && console.log("Tab Hidden!\n");
              // clear screen.
              if (_conf.fastDraw) {
                drawImage(imgObject);
              }
        }
        else {
              DBG && console.log("Tab Visible!\n");
        }
      }

      // ---------------- animation loop -----------------
      function startAnim() {

        function nextImage(n) {
          
          var current_n = n;
          var timeToNext = _conf.frameSpeed;

          if (_conf.fastDraw) {
            timeToNext = jpgFiles[current_n].time;
          }

          setTimeout(function() {
            
            // select nextImage
            n++;
            if (n < jpgFiles.length) {
                nextImage(n);
            }
            else if (!_conf.compositeDraw && _conf.waitTimeRepeat > 0) {
                n=1;
                setTimeout(function() {
                  nextImage(n);
                }, (_conf.waitTimeRepeat + (isHidden() ? 1000 : 0)));
            }

            if (_conf.fastDraw) {
              
              if (!isHidden()) {
                var fileName = jpgFiles[current_n].name;
                var c = getCoordinates(fileName);
                drawImageStep(imgObjectC, false, c);
              }
              else {
                DBG && console.log("anim skipped due to hidden");
              }
            }
            else {

              // draw currentImage
              var imageObj2 = imgObjects[current_n];

              if (!imageLoadedCallbacks[current_n]) {
                console.log("info: image not available yet, nr:"+current_n);
                imageLoadedCallbacks[current_n] = drawImageStep;
              }
              else {
                drawImageStep(imageObj2);
              }
            }
          }, (timeToNext + (isHidden() ? 200 : 0)));
        }
      
        var n = 1;
        nextImage(n);
      }

      // add jpgs in reverse to array, for back animation
      if (_conf.addReverseJpgFiles) {
        var maxl = jpgFiles.length - 2; // not -1, dont do last one twice
        for (var l = maxl; l > 0; l--) { // dont double 1st one!
          var obj = jpgFiles[l];
          jpgFiles.push(obj);
        }
      }

      var imageLoadedCallbacks = new Array(jpgFiles.length);

      // initialize drawImage - method for drawing the animation steps
      var drawImage;
      if (_conf.basicDraw) {
        drawImageStep = drawImageDelta2;
      }
      else if (_conf.compositeDraw) {
        drawImageStep = drawImageComposite;
        
        // prepare composite image
        canvasComposite = document.getElementById('compositeCanvas');
        contextComposite = canvasComposite.getContext('2d');
        contextComposite.fillStyle = "#" + _conf.mask;
        contextComposite.fillRect(0,0,canvasComposite.width,canvasComposite.height);
      }

      

      var imgObjects = [];
      var imgObject = new Image();
      var imgObjectC = new Image();

      if (_conf.fastDraw) {
        // animate from composite image

        drawImageStep = drawImageDelta2;

        // preload image and start anim
        imgObject.onload = function() {
              drawImage(this);

              if (!Date.now) {
                Date.now = function() { return new Date().getTime(); }
              }

              var startTime = Date.now();

              imgObjectC.onload = function() {

                // composite.jpg might be relatively big: adjust waitTime for loading time..s
                var remainingWaitTime = _conf.waitTimeStart + startTime - Date.now();
                if (remainingWaitTime < 1) {
                  remainingWaitTime = 1;
                }

                DBG && console.log("remainginWaitTime: "+remainingWaitTime);

                setTimeout(function() {
                  
                  contextVirtual.drawImage(imgObjectC, 0, 0);
                  
                  startAnim(imgObjectC);
                }, remainingWaitTime);
              }
              imgObjectC.src = _conf.jpgPath + "composite.jpg";
              if (closureCompile) {
                imgObjectC.onload.call(imgObjectC);
              }
        };
        imgObject.src = _conf.jpgPath + jpgFiles[0].name;
        if (closureCompile) {
          imgObject.onload.call(imgObject);
        }
      }
      else {
        // animate by loading individual jpg files

        // preload images and start anim on first image        
        for (var n=0; n < jpgFiles.length; n++) {
          var imageObj = new Image();
          imageObj.src = _conf.jpgPath + jpgFiles[n].name;
          imageObj.myImageIndex = n;
          imgObjects.push(imageObj);
          
          if (n == 0 ){
            imageObj.onload = function() {
              drawImage(this);
              setTimeout(function() {
                startAnim();
              }, _conf.waitTimeStart);
            };    
          }
          else {
            imageObj.onload = function() {
              var filename = this.src;

              var imageNr = this.myImageIndex;
              
              // store status as loaded or callback if proc is waiting for it
              if (imageNr >= 0) {
                if (!imageLoadedCallbacks[imageNr]) {
                  imageLoadedCallbacks[imageNr] = true;
                }
                else {
                  // underscore not used.
                  //if (getClass.call(imageLoadedCallbacks[imageNr]) == '[object Function]') {
                    imageLoadedCallbacks[imageNr]( imgObject[imageNr] );
                  //}
                }
              }
            } 
          }
        }
      }
    