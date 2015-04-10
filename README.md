# simegraph
Animated jpg. A small javascript lib and a few views to create high quality animated jpegs.


## Step by step guide / howto
This instruction is based on mac-os, if you're use a linux flavor it should be straight forward and even easier for you.

Chose to apply a Mask color (white, red or green or black) that works best with your animation jpg's. The example is a really bad combo → white. The walking man has a white bag which is almost blown out – there is a white colored edge at the building he passes. It's a terrible combination, but the result is almost ok. With a green mask this animation would work great.

For best results use a tripod and remote trigger if you are capturing jpg's and/or movie segments. The example was shot with the camera semi hand-hold – I've corrected a bit for it, but you can see it in the details.

Keep enough margin in the animation jpegs – to clear out the previous and next step (for back/forth animation) and to have some margin for the jpg color filter. I'm talking here about margin between the mask edge and the animating / changing pixels. As a minimum this margin should be 16pixels, I advise to take more, e.g. 32 pixels, to prevent any bleeding of the mask area into the animation bits.

For best results, don't use jpg's for the animation but start of with only png files (lossless), the resulting composite.jpg will have only one pass of jpeg artifacts.

Download & place the package in a folder on your local web-directory (see System preferences, web-sharing, open website folder).

File name | Description
-----------------------
index.html | Starting point, to do the animation with individual jpegs
cut.html | To create the composite image, one single image for all animation jpgs
fast.html | To do the animation with the composite jpegs
result.html | The closure compiled optimized version of fast.html
simegraph.js | The script for building the animation, intended for developing only
simegraph1.js | The reduced script for the fast version of the animation (for 'production')
impage.css | A bit of styling

Place your base.jpg and the animation jpg's in the same folder

Prepare the list of jpg's, for copy/paste into index.html

Open a terminal window
cd to the path where the jpg's are stored
ls -1 -r *.jpg

	.. if that fails, you can type them by hand.

Place the list of jpgfiles in the jpgFiles array
