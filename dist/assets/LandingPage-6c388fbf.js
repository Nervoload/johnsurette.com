import{r as b,j as e,C as $,u as E,S as q}from"./vendor-react-21d16af9.js";import{s as H}from"./index-5609985f.js";import{h as T,M as R,k as Y,l as I,d as S}from"./vendor-three-core-939e41c2.js";import{P as G}from"./PageScaffold-ce90b117.js";import"./vendor-misc-e6f8c4c8.js";import"./vendor-motion-5687078d.js";const U=["Initializing interactive showcase...","Quantum display matrix online.","Signal harmonics synced.","Rotate, hover, and click to shape the field."],X=52,V=26,Z=1200,Q=({activeSection:s})=>{const u=b.useMemo(()=>[...U,...H.map(n=>`Open ${n.name} -> ${n.path}`)],[]),r=b.useMemo(()=>s?[`Focused route: ${s}`,...u]:u,[s,u]),[h,t]=b.useState(0),[l,m]=b.useState(0),[i,f]=b.useState(!1),[p,x]=b.useState(!1);b.useEffect(()=>{t(0),m(0),f(!1),x(!1)},[r]),b.useEffect(()=>{if(p)return;const n=r[h]??r[0],c=l>=n.length,v=l<=0;if(!i&&c){x(!0);const d=window.setTimeout(()=>{x(!1),f(!0)},Z);return()=>window.clearTimeout(d)}if(i&&v){f(!1),t(d=>(d+1)%r.length);return}const g=window.setTimeout(()=>{m(d=>d+(i?-1:1))},i?V:X);return()=>window.clearTimeout(g)},[i,p,h,r,l]);const o=(r[h]??r[0]).slice(0,Math.max(0,l));return e.jsxs("div",{className:"pointer-events-none absolute left-1/2 top-[67%] z-30 w-[min(84vw,670px)] -translate-x-1/2 rounded-xl border border-cyan-200/35 bg-slate-950/60 px-4 py-3 shadow-[0_16px_52px_-26px_rgba(14,116,144,0.85),0_0_28px_rgba(56,189,248,0.18)] backdrop-blur-xl sm:px-5",children:[e.jsxs("div",{className:"mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-cyan-100/70",children:[e.jsx("span",{className:"h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]"}),e.jsx("span",{children:"signal terminal"})]}),e.jsxs("p",{className:"min-h-[1.5rem] font-mono text-sm text-cyan-50 sm:text-base",children:[e.jsx("span",{children:o}),e.jsx("span",{className:"ml-[1px] inline-block h-[1.1em] w-[0.6ch] translate-y-[2px] animate-pulse bg-cyan-300/90 shadow-[0_0_8px_rgba(103,232,249,0.9)]"})]})]})},J=1700,K=s=>1-Math.pow(1-s,3),ee=({activeSection:s,centerpiece:u})=>{const r=b.useRef(null),[h,t]=b.useState({x:0,y:0}),[l,m]=b.useState(!1),[i,f]=b.useState(!1),[p,x]=b.useState(0);b.useEffect(()=>{let o=0;const n=performance.now(),c=v=>{const g=Math.min(1,(v-n)/J);x(K(g)),g<1&&(o=window.requestAnimationFrame(c))};return o=window.requestAnimationFrame(c),()=>window.cancelAnimationFrame(o)},[]);const a=o=>{var g;const n=(g=r.current)==null?void 0:g.getBoundingClientRect();if(!n)return;const c=(o.clientX-n.left)/n.width*2-1,v=(o.clientY-n.top)/n.height*2-1;t({x:Math.max(-1,Math.min(1,c)),y:Math.max(-1,Math.min(1,v))})};return e.jsxs("div",{className:"relative h-[clamp(260px,74vmin,720px)] w-[clamp(260px,74vmin,720px)]",children:[e.jsx("div",{className:"pointer-events-none absolute inset-[-24%] rounded-full bg-[radial-gradient(circle_at_40%_30%,rgba(56,189,248,0.25),rgba(99,102,241,0.17)_36%,rgba(217,70,239,0.14)_54%,rgba(2,6,23,0)_75%)] blur-[40px]"}),e.jsx("div",{className:"pointer-events-none absolute inset-[-8%] stage-flow-ring"}),e.jsx("div",{className:"pointer-events-none absolute inset-[2%] stage-flow-ring-alt"}),e.jsxs("div",{ref:r,className:"relative h-full w-full overflow-hidden rounded-full border border-cyan-200/10 bg-[radial-gradient(circle_at_50%_36%,rgba(30,41,59,0.72),rgba(15,23,42,0.62)_44%,rgba(2,6,23,0.42)_100%)] shadow-[0_55px_140px_-85px_rgba(14,116,144,0.82),inset_0_0_80px_rgba(56,189,248,0.08)]",onPointerEnter:()=>m(!0),onPointerLeave:()=>{m(!1),f(!1),t({x:0,y:0})},onPointerDown:()=>f(!0),onPointerUp:()=>f(!1),onPointerMove:a,children:[e.jsx("div",{className:"pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_50%_34%,rgba(56,189,248,0.06),rgba(15,23,42,0.03)_46%,rgba(2,6,23,0.08)_100%)] backdrop-blur-[1px]"}),e.jsx("div",{className:"absolute inset-0 z-10",children:e.jsx(u,{activeSection:s,pointer:h,hovering:l,pressed:i,introProgress:p})})]}),e.jsx(Q,{activeSection:s})]})},A=["0","1","{","}","[","]","<",">","/","\\","+","-","=","*",";",":","$","#","@","&"],te=(s,u)=>{const r=s*u;return Math.max(120,Math.min(360,Math.floor(r/9e3)))},M=(s,u)=>{const r=Math.sin(s*127.1+u*311.7)*43758.5453123;return r-Math.floor(r)},ne=()=>{const s=b.useRef(null);return b.useEffect(()=>{const u=s.current;if(!u)return;const r=u.getContext("2d");if(!r)return;let h=0,t=0,l=1,m=[],i=0,f=performance.now();const p=c=>{const v=M(c,3),g=M(c,4)*1.2-.1;return{nx:M(c,1),ny:g,z:v,speed:24+v*66,drift:(M(c,5)-.5)*(16+v*34),size:8+v*9,phase:M(c,6)*Math.PI*2,glyph:A[Math.floor(M(c,7)*A.length)],trail:3+Math.floor(M(c,8)*3)}},x=()=>{const c=te(h,t);if(m.length!==c){if(m.length<c){const v=m.length;for(let g=v;g<c;g++)m.push(p(g));return}m=m.slice(0,c)}},a=()=>{const c=u.getBoundingClientRect();h=c.width,t=c.height,l=Math.min(window.devicePixelRatio||1,2),u.width=Math.floor(h*l),u.height=Math.floor(t*l),r.setTransform(l,0,0,l,0,0),x()},o=(c,v,g,d,w,y)=>{r.font=`${d}px Menlo, Monaco, Consolas, monospace`,r.fillStyle=`hsla(${y}, 96%, 75%, ${w})`,r.fillText(c,v,g)},n=c=>{const v=Math.min(.05,(c-f)/1e3);f=c,r.clearRect(0,0,h,t),r.globalCompositeOperation="lighter";for(let g=0;g<m.length;g++){const d=m[g],w=Math.sin(c*.001+d.phase)*d.drift;d.ny+=d.speed*v/Math.max(t,1),d.nx+=w*v/Math.max(h,1)*.35,d.ny>1.15&&(d.ny=-.12-M(g,c*.001)*.2,d.nx=M(g,c*.002+20),d.glyph=A[Math.floor(M(g,c*.003+12)*A.length)]),d.nx<-.05&&(d.nx+=1.1),d.nx>1.05&&(d.nx-=1.1);const y=d.nx*h,j=d.ny*t,_=d.z,P=182+_*70,L=.06+_*.24,B=.5+_*.6,F=d.size*B;o(d.glyph,y,j,F,L,P);for(let C=1;C<=d.trail;C++){const k=(d.trail-C+1)/(d.trail+1),D=j-C*(3+_*5),O=y-w*.008*C,W=L*k*.5;o(d.glyph,O,D,F*(.92-C*.08),W,P+C*2)}}r.globalCompositeOperation="source-over",i=window.requestAnimationFrame(n)};return a(),m.length===0&&x(),window.addEventListener("resize",a),i=window.requestAnimationFrame(n),()=>{window.removeEventListener("resize",a),window.cancelAnimationFrame(i)}},[]),e.jsx("canvas",{ref:s,className:"pointer-events-none absolute inset-0 z-0 h-full w-full","aria-hidden":!0})},z=s=>Math.min(1,Math.max(0,s)),oe=s=>s*s*(3-2*s),N=()=>{const s=Math.random()*2-1,u=Math.random()*Math.PI*2,r=Math.sqrt(1-s*s);return new S(r*Math.cos(u),s,r*Math.sin(u))},re=s=>{const u=Math.abs(s.y)>.8?new S(1,0,0):new S(0,1,0);return new S().crossVectors(s,u).normalize()},ae=`
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vEnergy;
  uniform float uTime;
  uniform float uBeat;
  uniform float uIntro;
  uniform float uInteraction;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float n000 = hash(i + vec3(0.0, 0.0, 0.0));
    float n100 = hash(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash(i + vec3(1.0, 1.0, 1.0));

    float nx00 = mix(n000, n100, f.x);
    float nx10 = mix(n010, n110, f.x);
    float nx01 = mix(n001, n101, f.x);
    float nx11 = mix(n011, n111, f.x);
    float nxy0 = mix(nx00, nx10, f.y);
    float nxy1 = mix(nx01, nx11, f.y);
    return mix(nxy0, nxy1, f.z);
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amp = 0.56;
    float freq = 1.0;
    for (int i = 0; i < 4; i++) {
      value += noise(p * freq) * amp;
      amp *= 0.5;
      freq *= 2.0;
    }
    return value;
  }

  void main() {
    vec3 p = position;
    float n = fbm(normal * 2.7 + p * 0.8 + vec3(uTime * 0.26, uTime * 0.21, uTime * 0.19));
    float angular = atan(p.z, p.x);
    float spikes = pow(max(0.0, sin(angular * 12.0 + uTime * 2.5 + n * 7.0)), 4.0);
    float ripples = abs(sin((p.y + uTime * 0.28) * 14.0)) * 0.06;
    float interactionBoost = 1.0 + uInteraction * 1.6;
    float displacement = (0.05 + uBeat * 0.07) * n + spikes * (0.08 + uBeat * 0.08) * interactionBoost + ripples;
    displacement *= mix(0.16, 1.0, uIntro);

    vec3 displaced = p + normal * displacement;
    vec4 worldPos = modelMatrix * vec4(displaced, 1.0);

    vWorldPos = worldPos.xyz;
    vNormal = normalize(normalMatrix * normal);
    vEnergy = n + spikes;

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`,se=`
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vEnergy;
  uniform float uTime;
  uniform float uBeat;
  uniform float uIntro;
  uniform float uInteraction;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform vec3 uDeepColor;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPos);

    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.8);
    float turbulence = 0.5 + 0.5 * sin((vWorldPos.x + vWorldPos.z) * 3.8 + uTime * 2.0 + vEnergy * 10.0);
    float scan = 0.5 + 0.5 * sin((vWorldPos.y * 18.0) + uTime * 3.2 + vEnergy * 12.0);
    float heat = smoothstep(0.28, 1.28, vEnergy);

    vec3 base = mix(uDeepColor, uColorA, heat);
    base = mix(base, uColorB, turbulence * 0.52);
    base = mix(base, uColorC, scan * 0.36);

    vec3 rim = fresnel * (uColorC * 1.8 + uColorB * 0.5);
    vec3 pulse = uColorB * (0.12 + uBeat * 0.34 + uInteraction * 0.28);
    vec3 color = base + rim + pulse + uColorC * (uInteraction * 0.18);

    float alpha = (0.78 + fresnel * 0.2) * uIntro;
    gl_FragColor = vec4(color, alpha);
  }
`,ie=({introProgress:s,palette:u})=>{const r=b.useRef(null),h=b.useRef(null),t=b.useMemo(()=>{const m=new Float32Array(4200),i=new Float32Array(1400*3),f=new Float32Array(1400);for(let p=0;p<1400;p++){const x=N(),a=N(),o=3.8+Math.random()*4.6,n=.9+Math.pow(Math.random(),1.25)*1.2;m[p*3]=x.x*o,m[p*3+1]=x.y*o,m[p*3+2]=x.z*o,i[p*3]=a.x*n,i[p*3+1]=a.y*n,i[p*3+2]=a.z*n,f[p]=Math.random()*Math.PI*2}return{starts:m,targets:i,seeds:f,initial:m.slice(),count:1400}},[]);return E(({clock:l})=>{const m=r.current;if(!m)return;const i=oe(z(s)),f=m.geometry.getAttribute("position"),p=f.array,x=l.elapsedTime;for(let a=0;a<t.count;a++){const o=a*3,n=t.seeds[a],c=t.starts[o],v=t.starts[o+1],g=t.starts[o+2],d=t.targets[o],w=t.targets[o+1],y=t.targets[o+2],j=(1-i)*(.38+.18*Math.sin(x*1.8+n));p[o]=R.lerp(c,d,i)+Math.cos(x*2.1+n)*j,p[o+1]=R.lerp(v,w,i)+Math.sin(x*1.7+n*1.3)*j,p[o+2]=R.lerp(g,y,i)+Math.cos(x*2.3+n*.7)*j}f.needsUpdate=!0,h.current&&(h.current.opacity=Math.max(0,.95-i*.92),h.current.size=.03+(1-i)*.02,h.current.color.set(i<.55?u.accentHex:u.glowHex))}),e.jsxs("points",{ref:r,frustumCulled:!1,renderOrder:4,children:[e.jsx("bufferGeometry",{children:e.jsx("bufferAttribute",{attach:"attributes-position",array:t.initial,itemSize:3,count:t.count})}),e.jsx("pointsMaterial",{ref:h,color:u.accentHex,size:.04,transparent:!0,opacity:.95,sizeAttenuation:!0,blending:I,depthWrite:!1})]})},ce=({introProgress:s,hovering:u,palette:r})=>{const h=b.useRef(null),t=b.useRef(null),l=b.useMemo(()=>{const i=new Float32Array(3300),f=new Float32Array(1100),p=new Float32Array(1100),x=new Float32Array(1100*3);for(let a=0;a<1100;a++){const o=N(),n=1.08+Math.pow(Math.random(),1.5)*.68;i[a*3]=o.x,i[a*3+1]=o.y,i[a*3+2]=o.z,f[a]=n,p[a]=Math.random()*Math.PI*2,x[a*3]=o.x*n,x[a*3+1]=o.y*n,x[a*3+2]=o.z*n}return{directions:i,bases:f,seeds:p,initial:x,count:1100}},[]);return E(({clock:m})=>{const i=h.current;if(!i)return;const f=i.geometry.getAttribute("position"),p=f.array,x=m.elapsedTime;for(let a=0;a<l.count;a++){const o=a*3,n=l.seeds[a],c=l.directions[o],v=l.directions[o+1],g=l.directions[o+2],d=.06*Math.sin(x*2.3+n)+.04*Math.sin(x*4.9+n*.6),w=(1-s)*.36,y=l.bases[a]+d+w;p[o]=c*y,p[o+1]=v*y,p[o+2]=g*y}f.needsUpdate=!0,t.current&&(t.current.opacity=(u?.68:.56)*(.5+s*.5),t.current.size=u?.028:.024)}),e.jsxs("points",{ref:h,frustumCulled:!1,renderOrder:3,children:[e.jsx("bufferGeometry",{children:e.jsx("bufferAttribute",{attach:"attributes-position",array:l.initial,itemSize:3,count:l.count})}),e.jsx("pointsMaterial",{ref:t,color:r.glowHex,size:.024,transparent:!0,opacity:.6,sizeAttenuation:!0,blending:I,depthWrite:!1})]})},le=({introProgress:s,hovering:u,palette:r})=>{const h=b.useRef(null),t=b.useRef(null),l=b.useMemo(()=>{const f=[],p=new Float32Array(1872);for(let x=0;x<24;x++){const a=N(),o=re(a),n=new S().crossVectors(a,o).normalize();f.push({anchor:a,tangent:o,bitangent:n,span:.8+Math.random()*.8,height:.18+Math.random()*.72,phase:Math.random()*Math.PI*2,speed:.16+Math.random()*.42})}return{streams:f,streamCount:24,trailLength:26,initial:p,count:24*26}},[]);return E(({clock:m})=>{const i=h.current;if(!i)return;const f=i.geometry.getAttribute("position"),p=f.array,x=m.elapsedTime;let a=0;for(let o=0;o<l.streamCount;o++){const n=l.streams[o],c=(x*n.speed+n.phase/(Math.PI*2))%1;for(let v=0;v<l.trailLength;v++){let g=c-v/l.trailLength*.18;g<0&&(g+=1);const d=(g-.5)*n.span,w=4*g*(1-g)*n.height,y=Math.sin(g*Math.PI*2+x*2.2+n.phase)*.07,j=n.anchor.x*(1.03+w)+n.tangent.x*d+n.bitangent.x*y,_=n.anchor.y*(1.03+w)+n.tangent.y*d+n.bitangent.y*y,P=n.anchor.z*(1.03+w)+n.tangent.z*d+n.bitangent.z*y;p[a]=j,p[a+1]=_,p[a+2]=P,a+=3}}f.needsUpdate=!0,t.current&&(t.current.opacity=(u?.9:.72)*Math.max(.2,s),t.current.size=u?.038:.032,t.current.color.set(u?r.accentHex:r.baseHex))}),e.jsxs("points",{ref:h,frustumCulled:!1,renderOrder:5,children:[e.jsx("bufferGeometry",{children:e.jsx("bufferAttribute",{attach:"attributes-position",array:l.initial,itemSize:3,count:l.count})}),e.jsx("pointsMaterial",{ref:t,color:r.baseHex,size:.032,transparent:!0,opacity:.74,sizeAttenuation:!0,blending:I,depthWrite:!1})]})},ue=({pointer:s,hovering:u,pressed:r,introProgress:h,palette:t})=>{const l=b.useRef(null),m=b.useRef(null),i=b.useRef(null),f=b.useRef(null),p=b.useMemo(()=>({uTime:{value:0},uBeat:{value:0},uIntro:{value:0},uInteraction:{value:0},uColorA:{value:t.baseColor.clone()},uColorB:{value:t.glowColor.clone()},uColorC:{value:t.accentColor.clone()},uDeepColor:{value:t.deepColor.clone()}}),[t]);return E((x,a)=>{const o=x.clock.elapsedTime;if(l.current&&(l.current.rotation.y=R.lerp(l.current.rotation.y,s.x*.55,.07),l.current.rotation.x=R.lerp(l.current.rotation.x,-s.y*.42,.07),l.current.rotation.z+=a*.03),f.current){const n=.5+.5*Math.sin(o*2.6),c=(u?.55:0)+(r?.9:0),v=R.lerp(f.current.uniforms.uInteraction.value,c,.1);f.current.uniforms.uTime.value=o,f.current.uniforms.uBeat.value=n,f.current.uniforms.uIntro.value=Math.max(.08,h),f.current.uniforms.uInteraction.value=v}if(m.current){const n=(u?.06:0)+(r?.1:0),c=Math.sin(o*1.5)*.025,v=.62+h*.42+n+c;m.current.scale.setScalar(v),m.current.rotation.y+=a*.1,m.current.rotation.x+=a*.04}if(i.current){const n=1+Math.sin(o*1.8)*.03;i.current.scale.setScalar(n);const c=i.current.material;c instanceof Y&&(c.opacity=(u?.22:.16)*Math.max(.2,h))}}),e.jsxs(e.Fragment,{children:[e.jsx("ambientLight",{intensity:.24}),e.jsx("pointLight",{position:[3.2,2.1,3.8],color:t.accentColor,intensity:2}),e.jsx("pointLight",{position:[-3.4,-2.3,-2.5],color:t.glowColor,intensity:1.6}),e.jsx("pointLight",{position:[0,3.2,-4],color:t.baseColor,intensity:1.35}),e.jsxs("group",{ref:l,children:[e.jsxs("mesh",{ref:m,children:[e.jsx("icosahedronGeometry",{args:[1.06,42]}),e.jsx("shaderMaterial",{ref:f,uniforms:p,vertexShader:ae,fragmentShader:se,transparent:!0})]}),e.jsxs("mesh",{ref:i,scale:1.24,children:[e.jsx("sphereGeometry",{args:[1.1,40,40]}),e.jsx("meshBasicMaterial",{color:t.glowColor,transparent:!0,opacity:.16,blending:I,depthWrite:!1})]}),e.jsx(ce,{introProgress:h,hovering:u,palette:t}),e.jsx(le,{introProgress:h,hovering:u,palette:t}),e.jsx(ie,{introProgress:h,palette:t}),e.jsx(q,{count:150,size:2.4,speed:.5,scale:4.8,color:t.accentHex,opacity:.45,noise:1})]})]})},me=({activeSection:s,...u})=>{const r=b.useMemo(()=>{var f;const h=new T(((f=H.find(p=>p.name===s))==null?void 0:f.color)??"#06b6d4"),t={h:0,s:0,l:0};h.getHSL(t);const l=new T().setHSL((t.h+.09)%1,z(t.s*.95+.18),z(t.l+.18)),m=new T().setHSL((t.h+.25)%1,z(t.s+.28),z(t.l+.14)),i=new T().setHSL((t.h+.58)%1,z(t.s*.62+.2),.08);return{baseHex:`#${h.getHexString()}`,glowHex:`#${l.getHexString()}`,accentHex:`#${m.getHexString()}`,deepHex:`#${i.getHexString()}`,baseColor:h,glowColor:l,accentColor:m,deepColor:i}},[s]);return e.jsx($,{camera:{position:[0,0,5],fov:45},dpr:[1,2],gl:{antialias:!0,alpha:!0,powerPreference:"high-performance"},className:"h-full w-full",children:e.jsx(ue,{activeSection:s,palette:r,...u})})},fe={waveOrb:{id:"waveOrb",label:"Wave Orb",component:me}},de="waveOrb",ye=({onNavigate:s})=>{const u=fe[de].component;return e.jsx(G,{backgroundClassName:"bg-[radial-gradient(circle_at_20%_0%,rgba(186,230,253,0.55),rgba(224,231,255,0.42)_34%,rgba(248,250,252,1)_78%)]",footerBackgroundColor:"#ffffff",children:()=>e.jsxs(e.Fragment,{children:[e.jsxs("section",{className:"relative flex min-h-screen items-center justify-center",children:[e.jsx(ne,{}),e.jsx("div",{className:"relative z-10 px-4 sm:px-6",children:e.jsx(ee,{activeSection:null,centerpiece:u})})]}),e.jsxs("section",{className:"relative z-10 mx-auto grid min-h-[140vh] w-full max-w-6xl gap-5 px-6 pb-20 pt-14 sm:grid-cols-2",children:[e.jsxs("div",{className:"sm:col-span-2",children:[e.jsx("p",{className:"text-sm uppercase tracking-[0.22em] text-slate-500",children:"Landing Storyboard Foundation"}),e.jsx("h1",{className:"mt-3 max-w-2xl text-4xl font-semibold text-slate-900 sm:text-5xl",children:"Scroll-driven narrative stage for your intro, links, and depth scenes."})]}),H.map(r=>e.jsxs("article",{className:"rounded-2xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm",children:[e.jsx("h2",{className:"text-xl font-semibold",style:{color:r.color},children:r.name}),e.jsx("p",{className:"mt-3 text-slate-600",children:r.description}),e.jsx("button",{type:"button",className:"mt-5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100",onClick:()=>s(r.path,{direction:"right",color:r.color,duration:430}),children:"Open Section"})]},r.path))]})]})})};export{ye as default};
