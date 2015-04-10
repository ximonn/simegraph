/**
 * @license Simegraph JS
 *
 * (c) 2015 Padrone
 *
 * License: www.padrone.nl/license
 */
var e=sconf&&sconf.mask?sconf.mask:"00FF00",aa=sconf?sconf.f?!0:!1:!1,u=sconf?sconf.fastDraw?!0:!1:!1,z=sconf?sconf.g?!0:!1:!1,ba=sconf?sconf.addReverseJpgFiles?!0:!1:!0,ca=sconf&&sconf.frameSpeed?sconf.frameSpeed:33,da=sconf&&sconf.waitTimeStart?sconf.waitTimeStart:3E3,ea=sconf&&sconf.waitTimeRepeat?sconf.waitTimeRepeat:3E3,A=sconf&&sconf.jpgColorMargin?sconf.jpgColorMargin:6,D=sconf&&sconf.filterDepth?sconf.filterDepth:10,fa=sconf&&sconf.filterThreshold?sconf.filterThreshold:6,E=sconf&&sconf.path?
sconf.path:"img/",F=document.getElementById("myCanvas"),G=F.getContext("2d"),H=document.getElementById("canvasVirtual"),I=H.getContext("2d"),K,L,M=null,N=null,O=null;
function P(a,c,b){var d=0;b&&(d=b);b=compCoordinates[d];var d=F.width,l=F.height,B=H.width,g=H.height;u||I.drawImage(a,0,0);M&&u||(M=I.getImageData(0,0,B,g).data);O||(N=G.getImageData(0,0,d,l),O=N.data);a=d-1;var g=0,h=l-1,m=0,t=-1,f=0,v=2*D,J=4*v,C=4*B*D,n=parseInt(e.substring(0,2),16),p=parseInt(e.substring(2,4),16),q=parseInt(e.substring(4,6),16);125<n?n-=A:n+=A;125<p?p-=A:p+=A;125<q?q-=A:q+=A;for(var r=0;r<b.h;r++)for(var w=B*(r+b.y)*4+4*b.x,Y=d*(r+0+b.dy)*4+4*(0+b.dx),x=f=0;x<b.w;x++,w+=4,Y+=
4){var y=function(a){var b=!1;(125<n?M[a]>n:M[a]<n)&&(125<p?M[++a]>p:M[++a]<p)&&(125<q?M[++a]>q:M[++a]<q)&&(b=!0);return b},k=function(a){var b=!1;if((125<n?M[a]<n:M[a]>n)||(125<p?M[++a]<p:M[++a]>p)||(125<q?M[++a]<q:M[++a]>q))b=!0;return b};f<D&&k(w)&&f++;if(0<f)if(k=w+J,x+v>=b.w||y(k))f-=2;else if(k=w-C,0>k||y(k))f-=2;else if(k=w+C,r+D>=b.h||y(k))f-=2;f>fa&&(y=w,k=Y,O[k]=M[y],O[++k]=M[++y],O[++k]=M[++y]);z&&c&&(f>fa?(-1==t&&(x<a&&(a=x),r<h&&(h=r)),t=1):-1!=t&&(x>g&&(g=x),r>m&&(m=r),t=-1))}G.putImageData(N,
0,0);if(z&&c)return a-=40,0>a&&(a=0),g+=40,g>=d&&(g=d-1),h-=40,0>h&&(h=0),m+=40,m>=l&&(m=l-1),{a:a,b:h,c:g,d:m,dx:b.dx,dy:b.dy}}var Q=[],R=0,ga=0,S=0;
function ha(a){var c,b=a.src.split("/");c=b[b.length-1];b=a.e;1==b&&console.log("var compCoordinates = [");for(var d=!1,l=0;l<Q.length;l++)Q[l]==c&&(d=!0);d||Q.push(c);if(!d){a=P(a,!0);R+(a.c-a.a)>=K.width&&(R=0,ga+=S,S=0);for(var d=R,l=ga,B=F.width,g=K.width,h=K.height,m=I.getImageData(0,0,B,F.height).data,h=L.getImageData(0,0,g,h),t=h.data,f=a.a;f<a.c;f++)for(var v=a.b;v<a.d;v++){var J=B*v*4+4*f,C=g*(l+v-a.b)*4+4*(d+f-a.a);t[C]=m[J];t[++C]=m[++J];t[++C]=m[++J]}L.putImageData(h,0,0);c='  {name:"'+
c+'", x:'+d+",y:"+l+",w:"+(a.c-a.a)+",h:"+(a.d-a.b)+", dx:"+(a.dx+a.a)+", dy:"+(a.dy+a.b)+"}";c=b==jpgFiles.length-1?c+"\n];":c+",";console.log(c);b=a.d-a.b;b>S&&(S=b);R+=a.c-a.a}}function ia(a){for(var c=compCoordinates.length,b=0,d=0;d<c&&!b;d++)compCoordinates[d].name==a&&(b=d);return b}function ja(){var a=["webkit","moz","ms","o"];if("hidden"in document)return"hidden";for(var c=0;c<a.length;c++)if(a[c]+"Hidden"in document)return a[c]+"Hidden";return null}
function T(){var a=ja();return a?document[a]:!1}var ka=ja();if(ka){var la=ka.replace(/[H|h]idden/,"")+"visibilitychange";document.addEventListener(la,ma)}function ma(){T()&&u&&G.drawImage(U,0,0)}
function na(){function a(c){var b=c,d=ca;u&&(d=jpgFiles[b].time);setTimeout(function(){c++;c<jpgFiles.length?a(c):!z&&0<ea&&(c=1,setTimeout(function(){a(c)},ea+(T()?1E3:0)));if(u)T()||drawImageStep(V,!1,ia(jpgFiles[b].name));else{var d=oa[b];W[b]?drawImageStep(d):(console.log("info: image not available yet, nr:"+b),W[b]=drawImageStep)}},d+(T()?200:0))}a(1)}if(ba)for(var pa=jpgFiles.length-2;0<pa;pa--)jpgFiles.push(jpgFiles[pa]);var W=Array(jpgFiles.length);
aa?drawImageStep=P:z&&(drawImageStep=ha,K=document.getElementById("compositeCanvas"),L=K.getContext("2d"),L.fillStyle="#"+e,L.fillRect(0,0,K.width,K.height));var oa=[],U=new Image,V=new Image;
if(u)drawImageStep=P,U.onload=function(){G.drawImage(this,0,0);Date.now||(Date.now=function(){return(new Date).getTime()});var a=Date.now();V.onload=function(){var c=da+a-Date.now();1>c&&(c=1);setTimeout(function(){I.drawImage(V,0,0);na()},c)};V.src=E+"composite.jpg";},U.src=E+jpgFiles[0].name;else for(var X=0;X<jpgFiles.length;X++){var Z=new Image;Z.src=E+jpgFiles[X].name;Z.e=X;oa.push(Z);Z.onload=0==X?function(){G.drawImage(this,0,0);setTimeout(function(){na()},
da)}:function(){var a=this.e;if(0<=a)if(W[a])W[a](U[a]);else W[a]=!0}};