# Xpansly "Problem we solve" scroll hero: brief and working prototype

Use this as context for writing a build prompt. It covers the goal, every design decision made so far, the open questions, and the full code of the approved proof of concept (POC).

## 1. Goal

A scroll-driven 3D hero for the "Problem we solve" section of the Xpansly landing page (xpansly.ai).

- The scene starts empty (space black).
- As the user scrolls, 3D cubes fly in from outside the frame, swirl inward, and lock together into the final Xpansly dither X mark.
- Problem copy plays over the build-up. The final frame is the finished 3D mark plus the value proposition.
- Cubes react to mouse hover (touch on mobile).

## 2. Approved design decisions

1. **Empty to full:** nothing on screen at the start. Cubes begin well outside the frame (spawned roughly along the direction of their own target, with jitter), arrive at staggered random times, spin, swirl, and settle flat as they lock in. Approved as is.
2. **Final shape:** built from the exact 173 dither cells in the supplied SVG (`mark-dithered-192.svg`, 32 by 32 grid of 6px cells). Each cell is one cube in the front plane, so straight-on it matches the SVG.
3. **Volume:** a small to medium bump, not a spiky star.
   - Extra dithered layers in front of and behind the mark, thickest near the centre of mass (about cell 15, 16) and fading outward. Max about 5 layers.
   - A short central spine pointing at the camera and directly behind the mark, about 4 cubes long, tapering to a single cube.
4. **Volume fade:** depth thickness and fill density are greatest at the top right and fade to the bottom left, matching how the SVG's dither thins out. Formula used: `g = clamp((col - row + 14) / 36, 0, 1)`, with density `0.3 + 0.7 * g` and layer depth scaled by `0.2 + 0.8 * g`.
5. **Idle motion:** once formed, the mark sways slowly by itself so the depth reads without a cursor. Hover tilts it and moves a point light that follows the cursor.
6. **Hover:** cubes within a radius of the cursor are pushed away and tilted, then spring back. Only applies after cubes have landed.

## 3. Copy (placeholder, Ruth Plater-Williams supplies final copy)

Stages tied to scroll progress (0 to 1):

| Scroll | Eyebrow | Heading | Body |
|---|---|---|---|
| 0 to 0.2 | The problem | B2B growth runs on hope | Targets get set, then everyone waits to see what happens. |
| 0.2 to 0.4 | The problem | Signals are scattered | Intent, activity and deals sit in separate tools, so nobody sees the whole picture. |
| 0.4 to 0.6 | The problem | Every stakeholder moves differently | The buying committee is pulling in all directions, with nothing to line it up. |
| 0.6 to 0.82 | The shift | Now it comes together | Xpansly is the GTM Operating System that moves the B2B buying committee. |
| 0.82 to 1 | Xpansly | Xpansly turns B2B growth from something you hope for into something you can forecast. | (none) |

The final line is the outcome statement from the brief. UK English throughout.

## 4. What the POC proved, and what changes for production

The POC uses plain white lit cubes plus a full-screen Bayer dither post-process (3 to 6 tone levels, cell size 3px) so the lighting shows up as dither density. That was a proof of concept look only.

### Production look requirements (new)

1. **Background:** space black.
2. **Material:** the logo and cubes should look 3D, almost chrome or glass, with lighting.
3. **Text:** overlapping text blocks over the 3D, with sticky scroll sections.

### Recommended approach

**Chrome or glass look**
- Replace the white cubes with `MeshPhysicalMaterial` (high metalness, low roughness, clearcoat) plus a good environment map. Chrome only reads as chrome when it reflects something, so use a small studio style HDR with a few soft light boxes (or build one in code, e.g. `RoomEnvironment` through PMREM).
- True glass (`transmission`) is expensive across about 1,000 instances (extra render pass). Start with chrome as the hero and test glass as an option. A cheaper glass look: transparency, fresnel edges, and the same environment reflections.
- Drop the full-screen dither post-process, since it flattens chrome. The dither identity lives in the shape itself (the SVG pattern and the top-right to bottom-left fade). Optionally use a dither-style dissolve while cubes arrive, then settle into clean chrome.
- Subtle bloom on highlights against the black background.

**Sticky scroll with overlapping text**
- A tall section (about 400 to 500vh) holds a sticky full-viewport canvas. Text blocks are normal sections that scroll over it on a higher layer.
- One scroll-progress value drives cube arrival, final lock, and the active text block. GSAP ScrollTrigger or Lenis can supply it.
- Legibility: chrome highlights can hurt contrast. Offset the mark to one side on desktop, keep text on the other, add soft dark scrims, and hold WCAG 2.1 AA (4.5:1 minimum, never rely on colour alone). On mobile, mark at top, text below.

**Production concerns**
- Bake the SVG into a small JSON mask at build time.
- `InstancedMesh`, pixel ratio capped at 2, pause rendering when offscreen (IntersectionObserver), lazy-load Three.js.
- Fewer cubes and simpler materials on mobile (no transmission).
- Static image or poster for `prefers-reduced-motion` and for WebGL failure.
- Colours must come from the locked Xpansly palette (the POC uses placeholder cool blue and near black). Retired names must not appear anywhere in the build.

**Build order:** look-dev the material on its own first, then add the scroll sections, then performance and fallbacks.

### Open question

Which stack is the website on (Framer, WordPress, Next.js or other)? This decides the embed approach, for example a code component in Framer versus a React Three Fiber section.

## 5. Final POC code (approved version)

Single self-contained HTML fragment. It uses Three.js r128 from cdnjs. The scroll container is an inner scroller, which in production becomes page scroll with a sticky canvas.

The mask rows are the 32 rows of the SVG, one character per 6px cell (`1` = cube present).

```html
<style>
.xw{position:relative;width:100%;height:500px;background:#0b0d12;border-radius:12px;overflow:hidden}
.xw canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.xs{position:absolute;inset:0;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:none;touch-action:pan-y}
.xs::-webkit-scrollbar{display:none}
.xsp{height:2800px}
.xc{position:absolute;left:0;right:0;bottom:0;height:190px;background:linear-gradient(to top,#0b0d12 55%,rgba(11,13,18,0));pointer-events:none}
.xt{position:absolute;left:20px;right:20px;bottom:22px;opacity:0;transform:translateY(10px);transition:opacity .45s,transform .45s;pointer-events:none}
.xt.on{opacity:1;transform:none}
.xe{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#8fc2ff;margin:0 0 6px;font-weight:500}
.xh{font-size:20px;line-height:1.3;font-weight:500;color:#f2f5fa;margin:0 0 6px}
.xb{font-size:14px;line-height:1.55;color:#aab3c2;margin:0}
.xbar{position:absolute;left:0;top:0;height:2px;width:0;background:#8fc2ff}
.xhint{position:absolute;top:14px;left:20px;font-size:12px;color:#7d8798;transition:opacity .3s;pointer-events:none}
</style>
<div class="xw" id="xw">
  <canvas id="xcv"></canvas>
  <div class="xbar" id="xbar"></div>
  <div class="xhint" id="xhint">Scroll to begin</div>
  <div class="xs" id="xs"><div class="xsp"></div></div>
  <div class="xc"></div>
  <div class="xt on" id="t0"><p class="xe">The problem</p><p class="xh">B2B growth runs on hope</p><p class="xb">Targets get set, then everyone waits to see what happens.</p></div>
  <div class="xt" id="t1"><p class="xe">The problem</p><p class="xh">Signals are scattered</p><p class="xb">Intent, activity and deals sit in separate tools, so nobody sees the whole picture.</p></div>
  <div class="xt" id="t2"><p class="xe">The problem</p><p class="xh">Every stakeholder moves differently</p><p class="xb">The buying committee is pulling in all directions, with nothing to line it up.</p></div>
  <div class="xt" id="t3"><p class="xe">The shift</p><p class="xh">Now it comes together</p><p class="xb">Xpansly is the GTM Operating System that moves the B2B buying committee.</p></div>
  <div class="xt" id="t4"><p class="xe">Xpansly</p><p class="xh" style="font-size:18px">Xpansly turns B2B growth from something you hope for into something you can forecast.</p></div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
(function(){
var THREE=window.THREE;
var wrap=document.getElementById('xw'),canvas=document.getElementById('xcv'),sc=document.getElementById('xs');
var bar=document.getElementById('xbar'),hint=document.getElementById('xhint');
var steps=[0,1,2,3,4].map(function(i){return document.getElementById('t'+i)});
var renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:false});
var pr=Math.min(window.devicePixelRatio||1,2);
renderer.setPixelRatio(pr);
var scene=new THREE.Scene();
var camera=new THREE.PerspectiveCamera(40,1,0.1,100);
var group=new THREE.Group();group.position.y=1.0;scene.add(group);
scene.add(new THREE.AmbientLight(0xffffff,0.3));
var dir=new THREE.DirectionalLight(0xffffff,0.95);dir.position.set(-4,5,6);scene.add(dir);
var pl=new THREE.PointLight(0xffffff,1.2,10,1.5);pl.position.set(0,0,3);scene.add(pl);

var ROWS='00000000000000000000000000000001;00000000000000000000000000000010;00000000000000000000000000000100;00000000000000000000000000001000;00000000000000000000000000110000;00000000000000000000000001010000;00000000000000000000000011100000;00000000000000000000001101000000;00000000000000000000011010000000;00000000000000000001010110000000;00000100000000001011111100000000;00000011010101010101010000000000;00000001101011111111111000000000;00000001011111011101010000000000;00000000101011101011100000000000;00000001010101011111010000000000;00000000101011111011100000000000;00000001011101010101000000000000;00000000101011111111100000000000;00000001010101010111000000000000;00000010111010101010100000000000;00000001010101110111000000000000;00000010101110101010100000000000;00000001010101010101000000000000;00000010101010101011100000000000;00000101010100000000100000000000;00000010000000000000010000000000;00001000000000000000000000000000;00010000000000000000000000000000;00100000000000000000000000000000;00000000000000000000000000000000;10000000000000000000000000000000'.split(';');

function b2(x,y){x=Math.floor(x);y=Math.floor(y);var v=x/2+y*y*0.75;return v-Math.floor(v);}
function b4(x,y){return b2(x*0.5,y*0.5)*0.25+b2(x,y);}
function b8(x,y){return b4(x*0.5,y*0.5)*0.25+b2(x,y);}

var U=0.21,CX=15,CY=16,DZ=5,RR=23,SPINE=4;
var T=[];
function add(c,r,k){T.push([(c-15.5)*U,-(r-15.5)*U,k*U]);}
for(var r=0;r<32;r++){
 for(var c=0;c<32;c++){
  if(ROWS[r].charAt(c)!=='1')continue;
  add(c,r,0);
  var g=Math.min(1,Math.max(0,(c-r+14)/36));
  var d=Math.hypot(c-CX,r-CY);
  var f=Math.max(0,1-d/RR);
  var zb=Math.round(DZ*Math.pow(f,1.3)*(0.2+0.8*g)+0.3);
  var dens=0.3+0.7*g;
  for(var k=1;k<=zb;k++){
   if(b8(c+7*k,r+3*k)<dens)add(c,r,k);
   if(b8(c+7*k+11,r+3*k+5)<dens)add(c,r,-k);
  }
 }
}
for(var k=1;k<=SPINE;k++){
 var reach=k<=2?1:0;
 for(var dy=-reach;dy<=reach;dy++)for(var dx=-reach;dx<=reach;dx++){
  if(Math.abs(dx)+Math.abs(dy)>reach)continue;
  add(CX+dx,CY+dy,k);add(CX+dx,CY+dy,-k);
 }
}
var C=T.length;
var geo=new THREE.BoxGeometry(U*0.92,U*0.92,U*0.92);
var mat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.55,metalness:0.05});
var mesh=new THREE.InstancedMesh(geo,mat,C);
mesh.frustumCulled=false;
group.add(mesh);

var sx=new Float32Array(C),sy=new Float32Array(C),sz=new Float32Array(C);
var rx=new Float32Array(C),ry=new Float32Array(C),rz=new Float32Array(C);
var spx=new Float32Array(C),spy=new Float32Array(C),sw=new Float32Array(C);
var dl=new Float32Array(C);
var ox=new Float32Array(C),oy=new Float32Array(C),oz=new Float32Array(C);
for(var i=0;i<C;i++){
 var ang=Math.atan2(T[i][1],T[i][0]||0.001)+(Math.random()-0.5)*1.8;
 var rad=17+Math.random()*9;
 sx[i]=Math.cos(ang)*rad;sy[i]=Math.sin(ang)*rad;sz[i]=(Math.random()-0.5)*10;
 rx[i]=Math.random()*6.28;ry[i]=Math.random()*6.28;rz[i]=Math.random()*6.28;
 spx[i]=(Math.random()-0.5)*1.2;spy[i]=(Math.random()-0.5)*1.2;
 sw[i]=0.8+Math.random()*0.9;
 dl[i]=Math.random();
}

var rt=new THREE.WebGLRenderTarget(2,2,{minFilter:THREE.NearestFilter,magFilter:THREE.NearestFilter});
var qc=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
var qm=new THREE.ShaderMaterial({
 uniforms:{t:{value:rt.texture},res:{value:new THREE.Vector2(2,2)},cell:{value:3},levels:{value:3},
  cA:{value:new THREE.Color(0x0b0d12)},cB:{value:new THREE.Color(0xa6d2ff)}},
 vertexShader:'void main(){gl_Position=vec4(position.xy,0.,1.);}',
 fragmentShader:'uniform sampler2D t;uniform vec2 res;uniform float cell;uniform float levels;uniform vec3 cA;uniform vec3 cB;'+
 'float b2(vec2 a){a=floor(a);return fract(a.x/2.+a.y*a.y*.75);}'+
 'float b4(vec2 a){return b2(.5*a)*.25+b2(a);}'+
 'float b8(vec2 a){return b4(.5*a)*.25+b2(a);}'+
 'void main(){vec2 id=floor(gl_FragCoord.xy/cell);vec2 uv=(id+.5)*cell/res;'+
 'vec3 c=texture2D(t,uv).rgb;float l=dot(c,vec3(.299,.587,.114));'+
 'float q=clamp(floor(l*levels+b8(id))/levels,0.,1.);gl_FragColor=vec4(mix(cA,cB,q),1.);}'
});
var quad=new THREE.Mesh(new THREE.PlaneGeometry(2,2),qm);
var qs=new THREE.Scene();qs.add(quad);

var W=0,H=0;
function resize(){
 W=wrap.clientWidth;H=wrap.clientHeight;
 renderer.setSize(W,H,false);
 rt.setSize(W*pr,H*pr);
 qm.uniforms.res.value.set(W*pr,H*pr);
 qm.uniforms.cell.value=3*pr;
 camera.aspect=W/H;
 var size=8.8,a=Math.min(1,W/H);
 var d=size/(0.7279*a);
 camera.position.set(0,0,d);camera.lookAt(0,0,0);
 camera.updateProjectionMatrix();
}
resize();
if(window.ResizeObserver){new ResizeObserver(resize).observe(wrap);}else{window.addEventListener('resize',resize);}

var ndc=new THREE.Vector2(9,9),active=false;
function setPointer(e){
 var r=wrap.getBoundingClientRect();
 ndc.x=((e.clientX-r.left)/r.width)*2-1;
 ndc.y=-(((e.clientY-r.top)/r.height)*2-1);
 active=true;
}
sc.addEventListener('pointermove',setPointer);
sc.addEventListener('pointerdown',setPointer);
sc.addEventListener('pointerleave',function(){active=false;});

var rc=new THREE.Raycaster(),plane=new THREE.Plane(new THREE.Vector3(0,0,1),0),hit=new THREE.Vector3();
var dummy=new THREE.Object3D();
function sm(a,b,x){x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x);}
function eo(x){return 1-Math.pow(1-x,3);}
var sp=0,cur=-1;

function frame(){
 var t=performance.now()/1000;
 var max=sc.scrollHeight-sc.clientHeight;
 var p=max>0?sc.scrollTop/max:0;
 sp+=(p-sp)*0.1;
 bar.style.width=(sp*100)+'%';
 hint.style.opacity=sp>0.03?0:1;
 var idx=sp<0.2?0:sp<0.4?1:sp<0.6?2:sp<0.82?3:4;
 if(idx!==cur){cur=idx;for(var s=0;s<5;s++){steps[s].className='xt'+(s===idx?' on':'');}}

 var raw=Math.min(1,Math.max(0,(sp-0.1)/0.76));
 var fin=sm(0.8,0.95,sp);
 qm.uniforms.levels.value=3+3*sm(0.5,0.95,sp);

 var tyg=active?ndc.x*0.6*fin:Math.sin(t*0.5)*0.4*fin;
 var txg=active?-ndc.y*0.35*fin:Math.sin(t*0.37+1)*0.15*fin;
 group.rotation.y+=(tyg-group.rotation.y)*0.06;
 group.rotation.x+=(txg-group.rotation.x)*0.06;
 group.updateMatrixWorld(true);
 var mx=999,my=999;
 if(active){
  rc.setFromCamera(ndc,camera);
  if(rc.ray.intersectPlane(plane,hit)){var lp=group.worldToLocal(hit.clone());mx=lp.x;my=lp.y;pl.position.set(hit.x,hit.y,3);}
 } else {pl.position.set(Math.sin(t*0.5)*3,2,3);}
 dir.position.x=-4+Math.sin(t*0.6)*3*fin;

 var R=1.5;
 for(var i=0;i<C;i++){
  var loc=Math.min(1,Math.max(0,(raw-dl[i]*0.55)/0.45));
  var e=eo(loc),k=1-e;
  var X=sx[i]+(T[i][0]-sx[i])*e,Y=sy[i]+(T[i][1]-sy[i])*e,Z=sz[i]+(T[i][2]-sz[i])*e;
  var a=sw[i]*k*k,ca=Math.cos(a),sa=Math.sin(a);
  var X2=X*ca-Y*sa,Y2=X*sa+Y*ca;
  X=X2;Y=Y2;
  var wx=0,wy=0,wz=0;
  var dx=X-mx,dy=Y-my,dd=Math.sqrt(dx*dx+dy*dy);
  if(dd<R&&e>0.98){var f=Math.pow(1-dd/R,2),n=dd||1;wx=dx/n*f*1.3;wy=dy/n*f*1.3;wz=f*1.5;}
  ox[i]+=(wx-ox[i])*0.12;oy[i]+=(wy-oy[i])*0.12;oz[i]+=(wz-oz[i])*0.12;
  dummy.position.set(X+ox[i],Y+oy[i],Z+oz[i]);
  dummy.rotation.set(((rx[i]+t*spx[i])%6.283)*k+oy[i]*0.8,((ry[i]+t*spy[i])%6.283)*k+ox[i]*0.8,(rz[i]%6.283)*k);
  dummy.updateMatrix();
  mesh.setMatrixAt(i,dummy.matrix);
 }
 mesh.instanceMatrix.needsUpdate=true;
 renderer.setRenderTarget(rt);renderer.render(scene,camera);
 renderer.setRenderTarget(null);renderer.render(qs,qc);
 requestAnimationFrame(frame);
}
frame();
})();
</script>
```

## 6. Key tunables in the code

| Variable | Effect |
|---|---|
| `U` | Cube and cell size in world units |
| `DZ` | Max bulk depth in layers (volume bump) |
| `SPINE` | Length of the front and back point, in cubes |
| `RR` | Radius over which bulk depth fades out |
| `g` formula | Direction and strength of the top-right to bottom-left fade |
| `raw` range `(sp-0.1)/0.76` | Scroll window in which cubes arrive |
| `dl[i] * 0.55` | How staggered the arrivals are |
| `rad` (17 to 26) | How far outside the frame cubes start |
| `levels`, `cell` | Dither tone levels and dither cell size (POC only, dropped for chrome) |

## 7. Suggested prompt skeleton for the build

Ask for: the site stack, sticky canvas section of about 450vh, one scroll-progress source driving cubes and text, chrome `MeshPhysicalMaterial` with an environment map on a space black background, the SVG baked to a mask, text blocks layered over the canvas with contrast scrims at WCAG AA, mobile and reduced-motion fallbacks, locked Xpansly palette only, UK English, and no retired names.
