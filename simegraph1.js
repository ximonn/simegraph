var e=sconf&&sconf.mask?sconf.mask:"00FF00",aa=sconf?sconf.f?!0:!1:!1,u=sconf?sconf.fastDraw?!0:!1:!1,z=sconf?sconf.g?!0:!1:!1,ba=sconf?sconf.addReverseJpgFiles?!0:!1:!0,ca=sconf&&sconf.frameSpeed?sconf.frameSpeed:33,da=sconf&&sconf.waitTimeStart?sconf.waitTimeStart:3E3,ea=sconf&&sconf.waitTimeRepeat?sconf.waitTimeRepeat:3E3,A=sconf&&sconf.jpgColorMargin?sconf.jpgColorMargin:6,D=sconf&&sconf.filterDepth?sconf.filterDepth:10,fa=sconf&&sconf.filterThreshold?sconf.filterThreshold:6,E=document.getElementById("myCanvas"),
F=E.getContext("2d"),G=document.getElementById("canvasVirtual"),H=G.getContext("2d"),I,K,L=null,M=null,N=null;
function O(a,c,b){var d=0;b&&(d=b);b=compCoordinates[d];var d=E.width,l=E.height,B=G.width,g=G.height;u||H.drawImage(a,0,0);L&&u||(L=H.getImageData(0,0,B,g).data);N||(M=F.getImageData(0,0,d,l),N=M.data);a=d-1;var g=0,h=l-1,m=0,t=-1,f=0,v=2*D,J=4*v,C=4*B*D,n=parseInt(e.substring(0,2),16),p=parseInt(e.substring(2,4),16),q=parseInt(e.substring(4,6),16);125<n?n-=A:n+=A;125<p?p-=A:p+=A;125<q?q-=A:q+=A;for(var r=0;r<b.h;r++)for(var w=B*(r+b.y)*4+4*b.x,X=d*(r+0+b.dy)*4+4*(0+b.dx),x=f=0;x<b.w;x++,w+=4,X+=
4){var y=function(a){var b=!1;(125<n?L[a]>n:L[a]<n)&&(125<p?L[++a]>p:L[++a]<p)&&(125<q?L[++a]>q:L[++a]<q)&&(b=!0);return b},k=function(a){var b=!1;if((125<n?L[a]<n:L[a]>n)||(125<p?L[++a]<p:L[++a]>p)||(125<q?L[++a]<q:L[++a]>q))b=!0;return b};f<D&&k(w)&&f++;if(0<f)if(k=w+J,x+v>=b.w||y(k))f-=2;else if(k=w-C,0>k||y(k))f-=2;else if(k=w+C,r+D>=b.h||y(k))f-=2;f>fa&&(y=w,k=X,N[k]=L[y],N[++k]=L[++y],N[++k]=L[++y]);z&&c&&(f>fa?(-1==t&&(x<a&&(a=x),r<h&&(h=r)),t=1):-1!=t&&(x>g&&(g=x),r>m&&(m=r),t=-1))}F.putImageData(M,
0,0);if(z&&c)return a-=40,0>a&&(a=0),g+=40,g>=d&&(g=d-1),h-=40,0>h&&(h=0),m+=40,m>=l&&(m=l-1),{a:a,b:h,c:g,d:m,dx:b.dx,dy:b.dy}}var P=[],Q=0,R=0,S=0;
function ga(a){var c,b=a.src.split("/");c=b[b.length-1];b=a.e;1==b&&console.log("var compCoordinates = [");for(var d=!1,l=0;l<P.length;l++)P[l]==c&&(d=!0);d||P.push(c);if(!d){a=O(a,!0);Q+(a.c-a.a)>=I.width&&(Q=0,R+=S,S=0);for(var d=Q,l=R,B=E.width,g=I.width,h=I.height,m=H.getImageData(0,0,B,E.height).data,h=K.getImageData(0,0,g,h),t=h.data,f=a.a;f<a.c;f++)for(var v=a.b;v<a.d;v++){var J=B*v*4+4*f,C=g*(l+v-a.b)*4+4*(d+f-a.a);t[C]=m[J];t[++C]=m[++J];t[++C]=m[++J]}K.putImageData(h,0,0);c='  {name:"'+
c+'", x:'+d+",y:"+l+",w:"+(a.c-a.a)+",h:"+(a.d-a.b)+", dx:"+(a.dx+a.a)+", dy:"+(a.dy+a.b)+"}";c=b==jpgFiles.length-1?c+"\n];":c+",";console.log(c);b=a.d-a.b;b>S&&(S=b);Q+=a.c-a.a}}function ha(a){for(var c=compCoordinates.length,b=0,d=0;d<c&&!b;d++)compCoordinates[d].name==a&&(b=d);return b}function ia(){var a=["webkit","moz","ms","o"];if("hidden"in document)return"hidden";for(var c=0;c<a.length;c++)if(a[c]+"Hidden"in document)return a[c]+"Hidden";return null}
function T(){var a=ia();return a?document[a]:!1}var ja=ia();if(ja){var ka=ja.replace(/[H|h]idden/,"")+"visibilitychange";document.addEventListener(ka,la)}function la(){T()&&u&&F.drawImage(U,0,0)}
function ma(){function a(c){var b=c,d=ca;u&&(d=jpgFiles[b].time);setTimeout(function(){c++;c<jpgFiles.length?a(c):!z&&0<ea&&(c=1,setTimeout(function(){a(c)},ea+(T()?1E3:0)));if(u)T()||drawImageStep(V,!1,ha(jpgFiles[b].name));else{var d=na[b];W[b]?drawImageStep(d):(console.log("info: image not available yet, nr:"+b),W[b]=drawImageStep)}},d+(T()?200:0))}a(1)}if(ba)for(var oa=jpgFiles.length-2;0<oa;oa--)jpgFiles.push(jpgFiles[oa]);var W=Array(jpgFiles.length);
aa?drawImageStep=O:z&&(drawImageStep=ga,I=document.getElementById("compositeCanvas"),K=I.getContext("2d"),K.fillStyle="#"+e,K.fillRect(0,0,I.width,I.height));var na=[],U=new Image,V=new Image;
if(u)drawImageStep=O,U.onload=function(){F.drawImage(this,0,0);Date.now||(Date.now=function(){return(new Date).getTime()});var a=Date.now();V.onload=function(){var c=da+a-Date.now();1>c&&(c=1);setTimeout(function(){H.drawImage(V,0,0);ma()},c)};V.src="composite.jpg";},U.src=jpgFiles[0].name;else for(var Y=0;Y<jpgFiles.length;Y++){var Z=new Image;Z.src=jpgFiles[Y].name;Z.e=Y;na.push(Z);Z.onload=0==Y?function(){F.drawImage(this,0,0);setTimeout(function(){ma()},da)}:function(){var a=
this.e;if(0<=a)if(W[a])W[a](U[a]);else W[a]=!0}};