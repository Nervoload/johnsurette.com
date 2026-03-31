import{a as l,aJ as jt,aK as St,aL as $t,j as e,C as Rt,d as Pt,Z as dt,ap as Ct,g as pt,aM as nt,f as he,aN as Et,aO as Tt,a5 as It,e as se,k as Fe,aP as At,a1 as at,y as E,V as te,ad as Lt,a3 as Nt,ab as Dt,aQ as Ze,t as Gt,w as zt,aR as Ot,aS as Ue}from"./index-106befd0.js";import{D as Bt}from"./DepthRainBackdrop-b07e33c5.js";import{L as Yt}from"./LandingOnboardingOverlay-c6c25f47.js";import{S as Ft}from"./SceneBloom-66f66822.js";import{r as ht,p as it}from"./projectData-0cbece20.js";import{c as ft}from"./probe-e4e617c0.js";import{a as Zt,u as Ut}from"./use-motion-value-058497e5.js";import{u as _t}from"./use-motion-value-event-5c1443b4.js";import{P as Ht}from"./PageScaffold-78e1f147.js";import"./Footer-52507e00.js";function Vt(t){const o=l.useRef(0),{isStatic:r}=l.useContext(jt);l.useEffect(()=>{if(r)return;const i=({timestamp:a,delta:s})=>{o.current||(o.current=a),t(a-o.current,s)};return St.update(i,!0),()=>$t(i)},[t])}const Xt=({progress:t,height:o=200,forceLowPower:r=!1,themeMode:i,children:a})=>{const[s,d]=l.useState(!1),[h,c]=l.useState(!1);l.useEffect(()=>{if(typeof window>"u")return;const f=window.matchMedia("(max-width: 900px)"),x=window.matchMedia("(prefers-reduced-motion: reduce)"),y=()=>{d(f.matches),c(x.matches)};return y(),f.addEventListener?(f.addEventListener("change",y),x.addEventListener("change",y)):(f.addListener(y),x.addListener(y)),()=>{f.removeEventListener?(f.removeEventListener("change",y),x.removeEventListener("change",y)):(f.removeListener(y),x.removeListener(y))}},[]);const n=h||r,u=o,m=l.useMemo(()=>i==="dark"?"#0b1326":"#eef4fb",[i]);return l.useEffect(()=>{},[n,s,u,i]),e.jsx("section",{style:{height:`${u}vh`},className:"relative",children:e.jsxs("div",{className:"sticky top-0 h-[100svh] overflow-hidden",children:[e.jsx("div",{className:"theme-project-scene-haze-a pointer-events-none absolute inset-0"}),e.jsx("div",{className:"theme-project-scene-haze-b pointer-events-none absolute inset-0"}),e.jsx(Rt,{children:e.jsxs(Pt,{className:"absolute inset-0 h-full w-full",camera:{position:[0,.14,6.15],fov:43},dpr:n?[1,1.5]:[1,2],shadows:!1,gl:{preserveDrawingBuffer:!1,antialias:!n,powerPreference:"high-performance",alpha:!0},onCreated:({gl:f})=>{f.outputColorSpace=dt,Ct.enabled=!0,f.shadowMap.enabled=!1,f.setClearColor(16777215,0)},children:[e.jsx("fog",{attach:"fog",args:[m,8,24]}),e.jsx("ambientLight",{intensity:.72}),e.jsx("spotLight",{position:[0,5.2,2.6],angle:.56,penumbra:.66,intensity:n?1.45:1.68,distance:26}),e.jsx("directionalLight",{position:[2.8,2.6,2.4],intensity:.45}),e.jsx("directionalLight",{position:[-3.2,1.4,-2.8],intensity:.18}),e.jsx(Ft,{enabled:!n}),e.jsx("group",{scale:1.14,position:[0,.02,0],children:a(t,{lowPowerMode:n,mobileViewport:s})})]})}),e.jsx("div",{className:"theme-project-scene-bottom-fade pointer-events-none absolute inset-x-0 bottom-0 h-36"})]})})},Wt=t=>"data:image/svg+xml;utf8,"+encodeURIComponent(t==="dark"?"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'><rect width='720' height='1024' fill='#0f172a'/><rect x='36' y='36' width='648' height='952' rx='28' fill='none' stroke='#334155' stroke-width='8'/></svg>":"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'><rect width='720' height='1024' fill='#f8fafc'/><rect x='36' y='36' width='648' height='952' rx='28' fill='none' stroke='#94a3b8' stroke-width='8'/></svg>"),Kt="data:image/svg+xml;utf8,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#103a8a'/><stop offset='100%' stop-color='#1f5fd8'/></linearGradient></defs><rect width='720' height='1024' fill='url(#g)'/></svg>"),ut=l.forwardRef(({frontSrc:t,backSrc:o,width:r,height:i,thickness:a=.02,borderColor:s="#e0e0e0",edgeColor:d,edgeGlow:h,flip:c,pop:n,popScale:u=1.15,onClick:m,isClickable:f,frontAttachment:x,themeMode:y="light",...w},M)=>{const{viewport:$,gl:T}=pt(),I=Math.min($.width,$.height),L=r??I*.08,D=i??L*1.4,G=l.useRef(null),X=l.useRef(null),W=l.useRef(null),ge=l.useRef(null),ye=l.useRef(null),j=l.useRef(null),pe=l.useRef(!1);l.useImperativeHandle(M,()=>G.current,[]);const _=nt(at,t??Wt(y)),oe=nt(at,o??Kt),H=l.useMemo(()=>new he(d??s),[d,s]),C=l.useMemo(()=>{const g=new Et(L+.016,D+.016,a+.012),p=new Tt(g);return g.dispose(),p},[L,D,a]);l.useMemo(()=>{const g=T.capabilities.getMaxAnisotropy();for(const p of[_,oe])p.colorSpace=dt,p.anisotropy=g,p.minFilter=It,p.needsUpdate=!0},[_,oe,T]),se(()=>{var be,ve,ae;const g=G.current;if(!g)return;const p=((be=c==null?void 0:c.get)==null?void 0:be.call(c))??0;g.rotation.y=Math.PI*p;const P=((ve=n==null?void 0:n.get)==null?void 0:ve.call(n))??0,B=1+(u-1)*P;g.scale.setScalar(B);const Me=((ae=h==null?void 0:h.get)==null?void 0:ae.call(h))??0,Y=pe.current?2.15:1,O=E.clamp(Me*Y,0,1.9),F=X.current;F&&(F.emissive.setRGB(1,1,1),F.emissiveIntensity=.24+O*.2);const ne=W.current;ne&&(ne.uniforms.uAccentColor.value.copy(H),ne.uniforms.uGlow.value=E.clamp(O*.52,0,1.1));const we=ge.current;we&&(we.opacity=E.clamp(.34+O*.22,.34,.76));const K=ye.current;K&&(K.opacity=E.clamp(O*.64,0,.95),K.color.copy(H).multiplyScalar(.95+O*2.3),K.visible=K.opacity>.01);const q=j.current;q&&(q.uniforms.uColor.value.copy(H),q.uniforms.uOpacity.value=E.clamp(O*.28,0,.48),q.uniforms.uStrength.value=.85+O*1.7,q.visible=O>.01)}),l.useEffect(()=>()=>{T.domElement.style.cursor="auto"},[T]),l.useEffect(()=>()=>{C.dispose()},[C]);const b=()=>f?f():!0,R=g=>{pe.current=!0,m&&b()?(g.stopPropagation(),T.domElement.style.cursor="pointer"):T.domElement.style.cursor="auto"},N=()=>{pe.current=!1,T.domElement.style.cursor="auto"},v=g=>{!m||!b()||(g.stopPropagation(),m())};return e.jsxs("group",{ref:G,...w,children:[e.jsxs("mesh",{renderOrder:2,children:[e.jsx("boxGeometry",{args:[L+.03,D+.03,a+.04]}),e.jsx("shaderMaterial",{ref:j,uniforms:{uColor:{value:H.clone()},uOpacity:{value:0},uStrength:{value:.7}},vertexShader:`
              varying vec3 vNormal;
              varying vec3 vViewDir;

              void main() {
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                vNormal = normalize(normalMatrix * normal);
                vViewDir = normalize(-mvPosition.xyz);
                gl_Position = projectionMatrix * mvPosition;
              }
            `,fragmentShader:`
              uniform vec3 uColor;
              uniform float uOpacity;
              uniform float uStrength;
              varying vec3 vNormal;
              varying vec3 vViewDir;

              void main() {
                float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0), 2.8);
                float alpha = fresnel * uOpacity;
                vec3 rgb = uColor * (uStrength * (0.5 + fresnel * 0.9));
                gl_FragColor = vec4(rgb, alpha);
              }
            `,blending:Fe,transparent:!0,depthWrite:!1,depthTest:!0,side:At,toneMapped:!1})]}),e.jsx("lineSegments",{geometry:C,renderOrder:3,children:e.jsx("lineBasicMaterial",{ref:ye,color:H,transparent:!0,opacity:0,blending:Fe,depthWrite:!1,toneMapped:!1})}),e.jsxs("mesh",{castShadow:!0,children:[e.jsx("boxGeometry",{args:[L,D,a]}),e.jsx("meshStandardMaterial",{color:s,metalness:.08,roughness:.52})]}),e.jsxs("mesh",{position:[0,0,a/2+1e-4],onPointerOver:R,onPointerOut:N,onClick:v,children:[e.jsx("planeGeometry",{args:[L,D]}),e.jsx("meshStandardMaterial",{ref:X,map:_,roughness:.3,metalness:0,emissive:"#ffffff",emissiveMap:_,emissiveIntensity:.34,toneMapped:!1})]}),e.jsxs("mesh",{position:[0,0,a/2+18e-5],renderOrder:5,children:[e.jsx("planeGeometry",{args:[L,D]}),e.jsx("shaderMaterial",{ref:W,uniforms:{uMap:{value:_},uAccentColor:{value:H.clone()},uGlow:{value:0}},vertexShader:`
              varying vec2 vUv;

              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,fragmentShader:`
              uniform sampler2D uMap;
              uniform vec3 uAccentColor;
              uniform float uGlow;
              varying vec2 vUv;

              void main() {
                vec4 tex = texture2D(uMap, vUv);
                float lum = dot(tex.rgb, vec3(0.2126, 0.7152, 0.0722));
                float maxC = max(tex.r, max(tex.g, tex.b));
                float minC = min(tex.r, min(tex.g, tex.b));
                float chroma = maxC - minC;

                float detail = length(vec2(dFdx(lum), dFdy(lum)));
                float detailMask = smoothstep(0.004, 0.028, detail);
                float colorMask = smoothstep(0.08, 0.24, chroma);
                float whiteMask = smoothstep(0.76, 0.98, lum) * (1.0 - smoothstep(0.04, 0.15, chroma)) * detailMask;

                float glow = uGlow;
                vec3 gray = vec3(lum);
                vec3 satBoost = gray + (tex.rgb - gray) * (1.0 + 0.42 * glow * colorMask);
                vec3 accentPush = uAccentColor * (0.22 + 0.72 * colorMask) * glow * 0.52;
                vec3 whitePush = vec3(1.0) * whiteMask * glow * 0.46;

                vec3 outColor =
                  satBoost * (0.08 + glow * (0.16 + colorMask * 0.12))
                  + accentPush
                  + whitePush;
                float alpha = clamp((colorMask * 0.44 + whiteMask * 0.66) * glow, 0.0, 0.82);

                gl_FragColor = vec4(outColor, alpha);
              }
            `,blending:Fe,transparent:!0,depthWrite:!1,depthTest:!0,toneMapped:!1})]}),e.jsxs("mesh",{position:[0,0,a/2+26e-5],renderOrder:6,children:[e.jsx("planeGeometry",{args:[L,D]}),e.jsx("meshBasicMaterial",{ref:ge,map:_,transparent:!0,opacity:.34,depthWrite:!1,toneMapped:!1})]}),x?e.jsx("group",{position:[0,0,a/2+.0015],children:x}):null,e.jsxs("mesh",{"rotation-y":Math.PI,position:[0,0,-a/2-1e-4],children:[e.jsx("planeGeometry",{args:[L,D]}),e.jsx("meshStandardMaterial",{map:oe,roughness:.28,metalness:0,emissive:"#ffffff",emissiveMap:oe,emissiveIntensity:.4,toneMapped:!1})]})]})});ut.displayName="Card3D";const fe=t=>Math.min(1,Math.max(0,t)),ue=t=>typeof t=="number"?t:t.get(),U=()=>{},me=.08,xe=(t,o)=>l.useMemo(()=>({accent:new he(t),deep:new he(o.deep),mid:new he(o.mid),bright:new he(o.bright)}),[t,o.deep,o.mid,o.bright]),qt=({reveal:t,intensity:o,accent:r,palette:i})=>{const a=l.useRef(null),s=l.useRef([]),d=xe(r,i);return se(({clock:h})=>{const c=a.current;if(!c)return;const n=fe(ue(t)),u=n>me;if(c.visible=u,!u)return;const m=h.elapsedTime,f=(.7+n*.6)*(.9+o*.12);c.scale.setScalar(f),c.rotation.y=m*.55,c.rotation.x=Math.sin(m*.7)*.12,c.position.z=.1+n*.5,c.position.y=.02+Math.sin(m*1.2)*.04;const x=.44+n*.26;s.current.forEach((y,w)=>{if(!y)return;const M=m*(1.8+w*.22)+w*(Math.PI*.66);y.position.set(Math.cos(M)*x,Math.sin(M*1.08)*x*.58,Math.sin(M*.72)*.22)})}),e.jsxs("group",{ref:a,position:[0,.04,.2],children:[e.jsxs("mesh",{raycast:U,children:[e.jsx("icosahedronGeometry",{args:[.19,2]}),e.jsx("meshStandardMaterial",{color:d.mid,emissive:d.accent,emissiveIntensity:.56,metalness:.1,roughness:.38,toneMapped:!1})]}),e.jsxs("mesh",{rotation:[Math.PI/2,0,0],raycast:U,children:[e.jsx("torusGeometry",{args:[.55,.03,18,84]}),e.jsx("meshStandardMaterial",{color:d.accent,emissive:d.accent,emissiveIntensity:.72,transparent:!0,opacity:.88,metalness:.05,roughness:.42,toneMapped:!1})]}),Array.from({length:4}).map((h,c)=>e.jsxs("mesh",{raycast:U,ref:n=>{s.current[c]=n},children:[e.jsx("sphereGeometry",{args:[.07,16,16]}),e.jsx("meshStandardMaterial",{color:d.bright,emissive:d.accent,emissiveIntensity:.9,toneMapped:!1})]},`orbital-satellite-${c}`))]})},Qt=({reveal:t,intensity:o,accent:r,palette:i})=>{const a=l.useRef(null),s=l.useRef([]),d=xe(r,i),h=l.useMemo(()=>[-.48,-.32,-.16,0,.16,.32,.48],[]);return se(({clock:c})=>{const n=a.current;if(!n)return;const u=fe(ue(t)),m=u>me;if(n.visible=m,!m)return;const f=c.elapsedTime;n.scale.setScalar(.7+u*.52),n.position.z=.08+u*.44,n.rotation.y=Math.sin(f*.82)*.09,n.rotation.x=-.12+Math.sin(f*.56)*.06,s.current.forEach((x,y)=>{if(!x)return;const M=.54+(.28+.72*(.5+.5*Math.sin(f*2.8+y*.66)))*(.85+o*.28);x.scale.y=M,x.position.y=-.08+M*.18,x.position.z=Math.sin(f*1.2+y)*.05})}),e.jsx("group",{ref:a,position:[0,-.04,.14],children:h.map((c,n)=>e.jsxs("mesh",{raycast:U,ref:u=>{s.current[n]=u},position:[c,0,0],children:[e.jsx("boxGeometry",{args:[.09,.36,.09]}),e.jsx("meshStandardMaterial",{color:n%2===0?d.mid:d.accent,emissive:d.accent,emissiveIntensity:.64,metalness:.08,roughness:.34,toneMapped:!1})]},`spine-${n}`))})},Jt=({reveal:t,intensity:o,accent:r,palette:i})=>{const a=l.useRef(null),s=xe(r,i),d=l.useMemo(()=>[new te(-.42,.08,0),new te(-.16,.28,.14),new te(.18,.2,-.08),new te(.44,.04,.04),new te(-.08,-.2,.1),new te(.28,-.26,-.03)],[]),h=l.useMemo(()=>{const c=[[0,1],[1,2],[2,3],[1,4],[4,5],[2,5],[0,4]],n=new Float32Array(c.length*6);c.forEach(([m,f],x)=>{n[x*6]=d[m].x,n[x*6+1]=d[m].y,n[x*6+2]=d[m].z,n[x*6+3]=d[f].x,n[x*6+4]=d[f].y,n[x*6+5]=d[f].z});const u=new Lt;return u.setAttribute("position",new Nt(n,3)),u},[d]);return l.useEffect(()=>()=>{h.dispose()},[h]),se(({clock:c})=>{const n=a.current;if(!n)return;const u=fe(ue(t)),m=u>me;if(n.visible=m,!m)return;const f=c.elapsedTime;n.scale.setScalar((.7+u*.64)*(.95+o*.1)),n.rotation.y=f*.42,n.rotation.x=Math.sin(f*.72)*.08,n.position.z=.14+u*.46,n.position.y=Math.sin(f*1.1)*.03}),e.jsxs("group",{ref:a,position:[0,0,.2],children:[e.jsx("lineSegments",{geometry:h,raycast:U,children:e.jsx("lineBasicMaterial",{color:s.accent,transparent:!0,opacity:.72,toneMapped:!1})}),d.map((c,n)=>e.jsxs("mesh",{position:[c.x,c.y,c.z],raycast:U,children:[e.jsx("sphereGeometry",{args:[.06+n%2*.012,16,16]}),e.jsx("meshStandardMaterial",{color:n%2===0?s.bright:s.mid,emissive:s.accent,emissiveIntensity:.74,toneMapped:!1})]},`node-${n}`))]})},er=({reveal:t,intensity:o,accent:r,palette:i})=>{const a=l.useRef(null),s=xe(r,i);return se(({clock:d})=>{const h=a.current;if(!h)return;const c=fe(ue(t)),n=c>me;if(h.visible=n,!n)return;const u=d.elapsedTime;h.scale.setScalar((.72+c*.58)*(.96+o*.08)),h.rotation.z=Math.sin(u*.62)*.16,h.rotation.y=u*.52,h.position.z=.12+c*.48,h.position.y=-.03+Math.sin(u*1.5)*.04}),e.jsxs("group",{ref:a,position:[0,-.02,.2],children:[e.jsxs("mesh",{raycast:U,children:[e.jsx("torusKnotGeometry",{args:[.34,.07,140,18,2,3]}),e.jsx("meshStandardMaterial",{color:s.mid,emissive:s.accent,emissiveIntensity:.82,metalness:.22,roughness:.32,toneMapped:!1})]}),e.jsxs("mesh",{rotation:[Math.PI/2,0,0],raycast:U,children:[e.jsx("ringGeometry",{args:[.46,.56,64]}),e.jsx("meshBasicMaterial",{color:s.accent,transparent:!0,opacity:.28,toneMapped:!1,side:Dt})]})]})},tr=({reveal:t,intensity:o,accent:r,palette:i})=>{const a=l.useRef(null),s=l.useRef([]),d=xe(r,i),h=l.useMemo(()=>{const c=[];for(let u=0;u<3;u+=1)for(let m=0;m<3;m+=1)c.push([(m-1)*.22,(u-1)*.22*.78,0]);return c},[]);return se(({clock:c})=>{const n=a.current;if(!n)return;const u=fe(ue(t)),m=u>me;if(n.visible=m,!m)return;const f=c.elapsedTime;n.scale.setScalar((.78+u*.55)*(.93+o*.12)),n.rotation.y=Math.sin(f*.72)*.2,n.position.z=.12+u*.45,n.position.y=-.02+Math.sin(f*1.24)*.03,s.current.forEach((x,y)=>{if(!x)return;const M=.44+(.35+.65*(.5+.5*Math.sin(f*2.4+y*.44)))*(.72+o*.34);x.scale.y=M,x.position.z=Math.sin(f*1.1+y*.22)*.04,x.position.y=h[y][1]-.12+M*.12})}),e.jsx("group",{ref:a,position:[0,.04,.2],children:h.map(([c,n,u],m)=>e.jsxs("mesh",{raycast:U,ref:f=>{s.current[m]=f},position:[c,n,u],children:[e.jsx("cylinderGeometry",{args:[.045,.045,.28,14]}),e.jsx("meshStandardMaterial",{color:m%2===0?d.mid:d.bright,emissive:d.accent,emissiveIntensity:.66,roughness:.32,metalness:.18,toneMapped:!1})]},`pillar-${m}`))})},rr=t=>{switch(t.preset){case"orbitalCore":return e.jsx(qt,{...t});case"dataSpines":return e.jsx(Qt,{...t});case"nodeConstellation":return e.jsx(Jt,{...t});case"ribbonArc":return e.jsx(er,{...t});case"pillarArray":return e.jsx(tr,{...t});default:return null}},V="Manrope, ui-sans-serif, system-ui, -apple-system, sans-serif",sr=(t,o,r)=>{const{palette:i,accent:a}=t,s={atlas:i.line,signal:a,forge:i.bright,lattice:i.mid};return o==="dark"?{bgStart:i.deep,bgEnd:i.mid,portal:s[r],trim:i.line,text:i.bright,muted:i.line,chip:i.deep,chipText:i.bright}:{bgStart:i.bright,bgEnd:i.line,portal:s[r],trim:a,text:i.deep,muted:i.mid,chip:"#ffffff",chipText:i.deep}},_e=1024,He=720,Ve=720,Xe=1024,qe=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&apos;"),We=(t,o,r)=>{const i=t.trim().split(/\s+/).filter(Boolean);if(!i.length)return[""];const a=[];let s="";for(const c of i){const n=s?`${s} ${c}`:c;if(n.length<=o){s=n;continue}if(s&&a.push(s),s=c,a.length===r)break}a.length<r&&s&&a.push(s),a.length>r&&(a.length=r);const d=i.join(" "),h=a.join(" ");if(d.length>h.length){const c=a.length-1;a[c]=`${a[c].replace(/\.{3}$/,"").trim()}...`}return a},ce=(t,o,r)=>t.map((i,a)=>`<tspan x='${o}' dy='${a===0?0:r}'>${qe(i)}</tspan>`).join(""),or=(t,{min:o,max:r})=>Math.max(o,Math.min(r,44+t.trim().length*10.4)),nr=(t,o,r="landscape",i="light")=>{const a=ht(t),s=sr(t,i,a.frontFamily),d=We(t.title,24,2),h=We(t.subtitle,26,2),c=We(t.summary,40,2),n=r==="landscape",u=or(a.dateLabel,{min:188,max:n?336:308}),m=n?_e:Ve,f=n?He:Xe,x=n?512:360,y=n?360:512,w=n?260:250,M=n?`
  <g transform='translate(720 0) rotate(90)'>
    <rect width='${_e}' height='${He}' fill='url(#bg)'/>
    <rect width='${_e}' height='${He}' fill='url(#grid)'/>

    <rect x='20' y='20' width='984' height='680' rx='34' fill='none' stroke='${s.trim}' stroke-opacity='0.34' stroke-width='9'/>
    <rect x='20' y='20' width='984' height='680' rx='34' fill='none' stroke='${t.accent}' stroke-opacity='0.72' stroke-width='4.8'/>
    <rect x='44' y='44' width='936' height='632' rx='28' fill='none' stroke='${s.trim}' stroke-opacity='0.28' stroke-width='2.2'/>

    <ellipse cx='512' cy='360' rx='228' ry='148' fill='url(#portalGlow)'/>
    <circle cx='512' cy='360' r='108' fill='none' stroke='${t.accent}' stroke-opacity='0.44' stroke-width='4'/>
    <circle cx='512' cy='360' r='68' fill='none' stroke='${s.trim}' stroke-opacity='0.42' stroke-width='3'/>

    <text x='84' y='122' fill='${s.text}' font-family='${V}' font-size='54' font-weight='700'>
      ${ce(d,84,60)}
    </text>

    <g transform='translate(84 588)'>
      <rect x='0' y='0' width='${u}' height='44' rx='22' fill='${s.chip}'/>
      <text x='18' y='29' fill='${s.muted}' font-family='${V}' font-size='18' font-weight='600'>${qe(a.dateLabel)}</text>
    </g>

    <g transform='translate(938 520)'>
      <text x='0' y='0' text-anchor='end' fill='${s.muted}' font-family='${V}' font-size='29' font-weight='600'>
        ${ce(h,0,34)}
      </text>
      <text x='0' y='86' text-anchor='end' fill='${s.text}' font-family='${V}' font-size='22' font-weight='500' opacity='0.92'>
        ${ce(c,0,28)}
      </text>
    </g>

    <path d='M98 440 H262' stroke='${t.accent}' stroke-opacity='0.5' stroke-width='3'/>
    <path d='M760 440 H924' stroke='${t.accent}' stroke-opacity='0.38' stroke-width='3'/>
  </g>`:`
  <g>
    <rect width='${Ve}' height='${Xe}' fill='url(#bg)'/>
    <rect width='${Ve}' height='${Xe}' fill='url(#grid)'/>

    <rect x='20' y='20' width='680' height='984' rx='34' fill='none' stroke='${s.trim}' stroke-opacity='0.34' stroke-width='9'/>
    <rect x='20' y='20' width='680' height='984' rx='34' fill='none' stroke='${t.accent}' stroke-opacity='0.72' stroke-width='4.8'/>
    <rect x='44' y='44' width='632' height='936' rx='28' fill='none' stroke='${s.trim}' stroke-opacity='0.28' stroke-width='2.2'/>

    <ellipse cx='360' cy='512' rx='206' ry='142' fill='url(#portalGlow)'/>
    <circle cx='360' cy='512' r='108' fill='none' stroke='${t.accent}' stroke-opacity='0.44' stroke-width='4'/>
    <circle cx='360' cy='512' r='68' fill='none' stroke='${s.trim}' stroke-opacity='0.42' stroke-width='3'/>

    <text x='84' y='144' fill='${s.text}' font-family='${V}' font-size='52' font-weight='700'>
      ${ce(d,84,58)}
    </text>

    <g transform='translate(84 812)'>
      <rect x='0' y='0' width='${u}' height='44' rx='22' fill='${s.chip}'/>
      <text x='18' y='29' fill='${s.muted}' font-family='${V}' font-size='18' font-weight='600'>${qe(a.dateLabel)}</text>
    </g>

    <g transform='translate(636 702)'>
      <text x='0' y='0' text-anchor='end' fill='${s.muted}' font-family='${V}' font-size='27' font-weight='600'>
        ${ce(h,0,32)}
      </text>
      <text x='0' y='80' text-anchor='end' fill='${s.text}' font-family='${V}' font-size='21' font-weight='500' opacity='0.92'>
        ${ce(c,0,27)}
      </text>
    </g>

    <path d='M98 644 H262' stroke='${t.accent}' stroke-opacity='0.5' stroke-width='3'/>
    <path d='M458 644 H622' stroke='${t.accent}' stroke-opacity='0.38' stroke-width='3'/>
  </g>`,$=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='${m}' y2='${f}' gradientUnits='userSpaceOnUse'>
      <stop offset='0%' stop-color='${s.bgStart}'/>
      <stop offset='100%' stop-color='${s.bgEnd}'/>
    </linearGradient>
    <radialGradient id='portalGlow' cx='${x}' cy='${y}' r='${w}' gradientUnits='userSpaceOnUse'>
      <stop offset='0%' stop-color='${s.portal}' stop-opacity='0.56'/>
      <stop offset='100%' stop-color='${s.portal}' stop-opacity='0'/>
    </radialGradient>
    <pattern id='grid' width='32' height='32' patternUnits='userSpaceOnUse' patternTransform='rotate(${o*11})'>
      <path d='M16 0V32 M0 16H32' stroke='${s.trim}' stroke-opacity='0.08' stroke-width='1'/>
    </pattern>
  </defs>

  ${M}
</svg>`;return`data:image/svg+xml;utf8,${encodeURIComponent($)}`},ar=(t,o)=>{const r=t.palette,i=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${r.deep}'/>
      <stop offset='100%' stop-color='${r.mid}'/>
    </linearGradient>
    <linearGradient id='backTrim' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${r.line}' stop-opacity='0.9'/>
      <stop offset='50%' stop-color='${r.bright}' stop-opacity='0.82'/>
      <stop offset='100%' stop-color='${r.line}' stop-opacity='0.88'/>
    </linearGradient>
    <radialGradient id='coreGlow' cx='50%' cy='50%' r='40%'>
      <stop offset='0%' stop-color='${r.bright}' stop-opacity='0.28'/>
      <stop offset='100%' stop-color='${r.bright}' stop-opacity='0'/>
    </radialGradient>
    <pattern id='grid' width='28' height='28' patternUnits='userSpaceOnUse' patternTransform='rotate(${o*9})'>
      <path d='M14 0 V28 M0 14 H28' stroke='${r.line}' stroke-opacity='0.13' stroke-width='1'/>
    </pattern>
    <filter id='grain'>
      <feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/>
      <feColorMatrix type='saturate' values='0'/>
      <feComponentTransfer><feFuncA type='table' tableValues='0 0.02'/></feComponentTransfer>
    </filter>
  </defs>
  <rect width='720' height='1024' fill='url(#bg)'/>
  <rect width='720' height='1024' fill='url(#grid)'/>
  <circle cx='360' cy='512' r='256' fill='url(#coreGlow)'/>
  <rect x='28' y='28' width='664' height='968' rx='28' fill='none' stroke='${r.line}' stroke-width='10' stroke-opacity='0.28'/>
  <rect x='28' y='28' width='664' height='968' rx='28' fill='none' stroke='url(#backTrim)' stroke-width='6.5' stroke-opacity='0.8'/>
  <rect x='58' y='58' width='604' height='908' rx='24' fill='none' stroke='${r.bright}' stroke-width='3.1' stroke-opacity='0.54'/>
  <path d='M102 140 H162 M102 140 V200 M618 140 H558 M618 140 V200 M102 884 H162 M102 884 V824 M618 884 H558 M618 884 V824' stroke='${r.bright}' stroke-width='2.4' stroke-linecap='round' stroke-opacity='0.58' fill='none'/>
  <g transform='translate(360 512) rotate(${o*14})'>
    <circle r='176' fill='none' stroke='${r.bright}' stroke-width='14' stroke-opacity='0.28'/>
    <circle r='132' fill='none' stroke='${r.line}' stroke-width='5' stroke-opacity='0.62'/>
    <circle r='88' fill='none' stroke='${r.bright}' stroke-width='3.4' stroke-opacity='0.78'/>
    <path d='M0-120 L20-30 L110 0 L20 30 L0 120 L-20 30 L-110 0 L-20 -30 Z' fill='${r.line}' fill-opacity='0.42'/>
    <circle r='20' fill='${r.bright}' fill-opacity='0.82'/>
  </g>
  <g transform='translate(360 512)' opacity='0.38'>
    <path d='M-250 -320 C-180 -220 -140 -120 -110 -20 C-70 120 -120 230 -220 320' stroke='${r.line}' stroke-width='2' fill='none'/>
    <path d='M250 320 C180 220 140 120 110 20 C70 -120 120 -230 220 -320' stroke='${r.line}' stroke-width='2' fill='none'/>
  </g>
  <path d='M114 122 C228 96 492 96 606 122' stroke='${r.bright}' stroke-opacity='0.36' stroke-width='2.3' fill='none'/>
  <path d='M128 902 C246 926 474 926 592 902' stroke='${r.bright}' stroke-opacity='0.34' stroke-width='2.2' fill='none'/>
  <rect width='720' height='1024' filter='url(#grain)'/>
</svg>`;return`data:image/svg+xml;utf8,${encodeURIComponent(i)}`},ir=t=>{if(t<=0)return[];const o=Array.from({length:t},(i,a)=>a);let r=t*131+17;for(let i=o.length-1;i>0;i-=1){r=r*1664525+1013904223>>>0;const a=r%(i+1);[o[i],o[a]]=[o[a],o[i]]}return o},re=t=>Math.min(1,Math.max(0,t)),le=t=>1-Math.pow(1-t,3),de=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,z=(t,o,r)=>re((t-o)/(r-o)),A=(t,o,r)=>E.lerp(t,o,r),cr=(t,o)=>{const r=Math.max(0,t-4);return{dealStart:.64,dealEnd:o?Math.min(.91,.88+r*.025):Math.min(.92,.84+r*.03),flipStart:o?Math.max(.7,.72-r*.01):Math.max(.74,.78-r*.01),flipEnd:o?Math.min(.94,.86+r*.03):.98,browseStart:o?Math.min(.92,.86+r*.025):Math.min(.97,.95+r*.015),dealDelaySpan:Math.min(.5,.32+r*.045),flipDelaySpan:Math.min(.52,.35+r*.05)}},ct=(t,o,r)=>r?{width:t,height:o,cardSpacing:o*.44,ringRx:t*.17,ringRy:o*.13,exitDropMax:o*.34,dealEntryY:o*.48,browseParallaxX:.07,browseParallaxY:.045,dealScaleMax:2.08,dealArcMax:.2,stackDepthStep:.0085,flipArcZMax:.5,flipArcYMax:.06}:{width:t,height:o,cardSpacing:o*.56,ringRx:t*.24,ringRy:o*.18,exitDropMax:o*.48,dealEntryY:o*.6,browseParallaxX:.16,browseParallaxY:.08,dealScaleMax:2.2,dealArcMax:.3,stackDepthStep:.008,flipArcZMax:.7,flipArcYMax:.12},lr=({progress:t,items:o,onCardSelect:r,onActiveProjectChange:i,lowPowerMode:a=!1,mobileViewport:s=!1,themeMode:d})=>{const{viewport:h,pointer:c,camera:n,gl:u}=pt(),m=l.useRef([]),f=l.useRef([]),x=l.useRef(null),y=l.useRef(null),w=l.useRef([]),M=l.useRef([]),$=l.useRef([]),T=l.useRef(ct(h.width,h.height,s)),I=l.useRef(!1),L=l.useMemo(()=>o.map(C=>ht(C)),[o]),G=Math.min(h.width,h.height)*(s?.228:.198),X=G*1.46,W=s?"portrait":"landscape",ge=E.clamp(G*.58,s?.34:.42,s?.56:.72),ye=s?0:-Math.PI/2,j=o.length,pe=l.useMemo(()=>o.map((C,b)=>({frontSrc:nr(C,b+1,W,d),backSrc:ar(C,b+1),borderColor:d==="dark"?"#172036":"#f8fafc",edgeColor:C.accent,themeMode:d,width:G,height:X})),[o,X,G,W,d]),_=l.useMemo(()=>ir(j),[j]);l.useEffect(()=>{},[o]),w.current.length!==j&&(w.current=Array.from({length:j},()=>Ze(0))),M.current.length!==j&&(M.current=Array.from({length:j},()=>Ze(0))),$.current.length!==j&&($.current=Array.from({length:j},()=>Ze(0)));const oe=l.useMemo(()=>o.map((C,b)=>({x:(b%2===0?-1:1)*(.46+b*.08),y:(b%3-1)*.2,lift:.12+b*.014})),[o]),H=C=>{if(!I.current)return;const b=o[C],R=m.current[C];if(!b||!R)return;const N=new te;R.getWorldPosition(N);const v=N.clone().project(n),g=u.domElement.getBoundingClientRect(),p=g.left+(v.x*.5+.5)*g.width,P=g.top+(-v.y*.5+.5)*g.height;r==null||r(b,{x:p,y:P})};return se((C,b)=>{const R=x.current;if(!R)return;const N=C.clock.getElapsedTime(),v=re(t.get()),g=ct(h.width,h.height,s),p=T.current,P=1-Math.exp(-Math.min(b,.2)*10),B=cr(j,s);p.width=A(p.width,g.width,P),p.height=A(p.height,g.height,P),p.cardSpacing=A(p.cardSpacing,g.cardSpacing,P),p.ringRx=A(p.ringRx,g.ringRx,P),p.ringRy=A(p.ringRy,g.ringRy,P),p.exitDropMax=A(p.exitDropMax,g.exitDropMax,P),p.dealEntryY=A(p.dealEntryY,g.dealEntryY,P),p.browseParallaxX=A(p.browseParallaxX,g.browseParallaxX,P),p.browseParallaxY=A(p.browseParallaxY,g.browseParallaxY,P),p.dealScaleMax=A(p.dealScaleMax,g.dealScaleMax,P),p.dealArcMax=A(p.dealArcMax,g.dealArcMax,P),p.stackDepthStep=A(p.stackDepthStep,g.stackDepthStep,P),p.flipArcZMax=A(p.flipArcZMax,g.flipArcZMax,P),p.flipArcYMax=A(p.flipArcYMax,g.flipArcYMax,P);const Me=le(z(v,0,s?.3:.26)),Y=le(z(v,.18,.36)),O=le(z(v,.32,.48)),F=de(z(v,.44,.58)),ne=z(v,B.dealStart,B.dealEnd),we=z(v,B.flipStart,B.flipEnd),K=de(z(v,B.browseStart,1)),q=de(z(v,.62,.78)),be=.56*de(z(v,.88,1)),ve=re(Math.max(q,be)),ae=v>.64;I.current=v>(s?.9:.84);const Je=Me*(1-Y),ke=1-le(z(v,.56,.72)),Re=c.x,Pe=c.y,mt=Math.PI*.24*Je,xt=-Math.PI*.035*Je,et=ae?s?.008:.012:0;R.rotation.x=(mt+Pe*.03)*ke+Pe*et,R.rotation.y=(xt+Re*.05)*ke+Re*et;const Ce=p.cardSpacing,gt=(j-1)*Ce,tt=K*gt,rt=ae&&j>0?E.clamp(Math.round(tt/Math.max(Ce,1e-4)),0,j-1):null,je=rt!==null?o[rt]:o[0]??null,st=(je==null?void 0:je.id)??null;y.current!==st&&(y.current=st,i==null||i(je)),R.position.x=Re*p.browseParallaxX*ke,R.position.y=Pe*p.browseParallaxY*ke+tt;const yt=p.ringRx,Mt=p.ringRy,wt=(O*.3+F*.48)*Math.PI*2;for(let k=0;k<j;k++){const S=m.current[k];if(!S)continue;const Ee=j>1?k/(j-1):0;if(M.current[k].set(ve),ae){const ie=Ee*B.dealDelaySpan,Z=de(re((ne-ie)/Math.max(.01,1-ie*.55))),Q=le(z(ne,.82,1)),Te=p.dealEntryY,Se=-k*Ce,Ie=E.lerp(Te,Se,Z),Ae=Math.sin(Z*Math.PI)*p.dealArcMax,Le=-k*p.stackDepthStep;S.position.x=0,S.position.y=E.lerp(Ie,Se,Q),S.position.z=E.lerp(Ae,Le,Q);const Ne=s?0:Math.PI/2,J=Ne*Z;S.rotation.x=0;const De=(1-Z)*((k%2===0?-1:1)*.08),Ge=J+De;S.rotation.z=E.lerp(Ge,Ne,Q);const $e=Ee*B.flipDelaySpan,ee=de(re((we-$e)/Math.max(.01,1-$e*.45))),ze=Math.sin(ee*Math.PI)*p.flipArcZMax,Oe=Math.sin(ee*Math.PI)*p.flipArcYMax;S.position.z+=ze,S.position.y+=Oe,w.current[k].set(1-ee);const Be=re((ee-.08)/.92);$.current[k].set(Be),Z>.98&&ee>.98&&(S.position.y+=Math.sin(N*1.1+k*1.3)*.01,S.position.z+=Math.cos(N*.9+k*.7)*.005),S.rotation.y=0;const Ye=E.lerp(1,p.dealScaleMax,Z);S.scale.setScalar(Ye)}else{const ie=oe[k],Z=le(re((Me-Ee*.44)/.56)),Q=Math.sin(Z*Math.PI),Te=-k*.05,Se=-(_[k]??k)*.055,Ie=ie.x*Q,Ae=ie.y*Q,Le=E.lerp(Te,Se,Z)+ie.lift*Q,J=k/j*Math.PI*2+wt,De=Math.sin(J)*yt,Ge=Math.cos(J)*Mt+.05,$e=-.06+Math.sin(J*2)*.012,ee=E.lerp(Ie,De,Y),ze=E.lerp(Ae,Ge,Y),Oe=E.lerp(Le,$e,Y),Be=p.exitDropMax*F,Ye=Math.sin(J*1.1)*.06*F,ot=.01+Y*.022,bt=Math.sin(N*1.65+k*.82)*ot,vt=Math.cos(N*1.2+k*.58)*ot*.45;S.position.x=ee+Ye,S.position.y=ze-Be+bt,S.position.z=Oe-.16*F+vt,S.rotation.x=0,S.rotation.y=0,S.rotation.z=J*(s?.08:.1)*Y,w.current[k].set(1),$.current[k].set(0);const kt=1+.1*Y-.12*F;S.scale.setScalar(kt)}}}),e.jsx("group",{ref:x,children:pe.map((C,b)=>{const R=o[b],N=L[b];return e.jsx("group",{ref:v=>{v&&(m.current[b]=v)},position:[0,0,-b*.05],children:e.jsx(ut,{ref:v=>{f.current[b]=v},...C,flip:w.current[b],edgeGlow:M.current[b],frontAttachment:!a&&R&&N?e.jsx("group",{rotation:[0,0,ye],scale:ge,children:e.jsx(rr,{preset:N.popoutPreset,accent:R.accent,palette:R.palette,reveal:$.current[b],intensity:N.popoutIntensity*.84})}):void 0,isClickable:()=>I.current,onClick:()=>H(b)})},(R==null?void 0:R.id)??`card-${b}`)})})},Qe=t=>Math.min(1,Math.max(0,t)),dr=t=>440+Math.max(0,t-4)*90,lt=(t,o)=>{const r=Qe(t),i=Math.max(0,o-4),a=Math.min(.67,.62+i*.03),s=Math.min(.84,.76+i*.04),d=Math.min(.9,.76+i*.05),h=Math.max(.08,1-d);return r<=.12?r:r<=.3?.12+(r-.12)/.18*.3:r<=.46?.42+(r-.3)/.16*.26:r<=a?.68+(r-.46)/(a-.46)*.16:r<=s?.84+(r-a)/(s-a)*.12:r<=d?.96:.96+(r-d)/h*.04},pr=({scrollContainer:t,items:o,onCardSelect:r,onActiveProjectChange:i,forceLowPower:a=!1,themeMode:s})=>{const d=ft(),h=l.useRef(null),c=l.useRef(0),n=l.useRef(0),u=dr(o.length),m="projects:storyboard-scroll",f=Zt(0),{scrollYProgress:x}=Ut({container:t,target:h,offset:["start start","end end"],layoutEffect:!1});_t(x,"change",w=>{c.current=w});const y=l.useCallback(()=>{const w=Qe(x.get());c.current=w,f.set(lt(w,o.length)),n.current=3},[o.length,x,f]);return l.useEffect(()=>{y()},[y]),l.useEffect(()=>{},[a,o.length,m,t,x,u]),l.useEffect(()=>{if(typeof window>"u")return;const w=()=>{y()},M=typeof ResizeObserver<"u"?new ResizeObserver(()=>{w()}):null,$=h.current,T=t.current;M&&($&&M.observe($),T&&M.observe(T)),window.addEventListener("resize",w);const I=window.visualViewport;return I==null||I.addEventListener("resize",w),()=>{M==null||M.disconnect(),window.removeEventListener("resize",w),I==null||I.removeEventListener("resize",w)}},[t,y]),Vt((w,M)=>{const $=lt(c.current,o.length),T=f.get();if(n.current>0){f.set($),n.current-=1;return}const I=$<.68,L=$<.96,D=(I?34e-5:L?5e-4:9e-4)*M,G=$-T,X=Math.sign(G)*Math.min(Math.abs(G),D),W=Qe(T+X);f.set(W)}),e.jsx("div",{ref:h,...d,children:e.jsx(Xt,{progress:f,height:u,forceLowPower:a,themeMode:s,children:(w,M)=>e.jsx(lr,{progress:w,items:o,onCardSelect:r,onActiveProjectChange:i,lowPowerMode:M.lowPowerMode,mobileViewport:M.mobileViewport,themeMode:s})})})},Ke=(t,o)=>{const r=t.replace("#",""),i=r.length===3?r.split("").map(s=>`${s}${s}`).join(""):r,a=s=>Number.parseInt(i.slice(s,s+2),16);return`rgba(${a(0)}, ${a(2)}, ${a(4)}, ${o})`},hr=({projects:t,themeMode:o,onOpenCaseStudy:r})=>{const i=o==="dark",a=i?{background:"rgba(2, 6, 23, 0.62)",borderColor:"rgba(148, 163, 184, 0.16)",boxShadow:"0 24px 64px -48px rgba(2, 6, 23, 0.94)"}:{background:"rgba(255, 255, 255, 0.74)",borderColor:"rgba(148, 163, 184, 0.18)",boxShadow:"0 24px 64px -54px rgba(15, 23, 42, 0.26)"};return e.jsx("section",{className:"relative z-20 mx-auto w-full max-w-6xl px-6 pb-28 pt-8 sm:pt-14",children:e.jsxs("div",{className:"mx-auto max-w-4xl",children:[e.jsx("p",{className:"theme-text-subtle text-[0.76rem] uppercase tracking-[0.28em]",children:"Case Study Directory"}),e.jsx("h2",{className:"theme-text-primary mt-4 text-[1.9rem] font-semibold leading-[0.98] tracking-[-0.05em] sm:text-[2.5rem]",children:"Open a route when you want the editorial version."}),e.jsx("div",{className:"mt-8 overflow-hidden rounded-[1.8rem] border p-2 sm:p-3",style:a,children:e.jsx("div",{className:"space-y-2",children:t.map((s,d)=>{const h=s.metrics[0];return e.jsx("button",{type:"button",className:"group w-full rounded-[1.35rem] border px-4 py-4 text-left transition duration-200 hover:translate-y-[-1px] sm:px-5",style:{borderColor:Ke(s.accent,.14),background:i?"rgba(15, 23, 42, 0.34)":"rgba(255, 255, 255, 0.56)"},onClick:()=>r(s),children:e.jsxs("div",{className:"flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",children:[e.jsxs("div",{className:"flex min-w-0 items-start gap-4",children:[e.jsx("div",{className:"flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[0.7rem] font-semibold uppercase tracking-[0.18em] theme-text-subtle",style:{borderColor:Ke(s.accent,.2),background:Ke(s.accent,i?.08:.05)},children:String(d+1).padStart(2,"0")}),e.jsxs("div",{className:"min-w-0",children:[e.jsx("p",{className:"theme-text-subtle text-[0.66rem] font-semibold uppercase tracking-[0.22em]",children:s.hero.eyebrow}),e.jsx("h3",{className:"theme-text-primary mt-2 text-[1.12rem] font-semibold leading-tight tracking-[-0.03em] sm:text-[1.2rem]",children:s.title}),e.jsx("p",{className:"theme-text-muted mt-2 max-w-2xl text-[0.92rem] leading-relaxed",children:s.hero.thesis})]})]}),e.jsxs("div",{className:"flex shrink-0 items-center justify-between gap-5 sm:justify-end",children:[e.jsxs("div",{className:"text-left sm:text-right",children:[e.jsx("p",{className:"theme-text-primary text-[0.96rem] font-semibold tracking-[-0.03em]",children:h.value}),e.jsx("p",{className:"theme-text-subtle mt-1 text-[0.64rem] uppercase tracking-[0.18em]",children:h.label})]}),e.jsx("div",{className:"theme-text-subtle text-[0.68rem] font-semibold uppercase tracking-[0.2em] transition-transform duration-200 group-hover:translate-x-1",children:"Open"})]})]})},s.id)})})})]})})},kr=({themeMode:t,navInteractionTick:o,onNavigate:r})=>{const i=ft(),[a,s]=l.useState(!0),d=Gt.projects,h=zt();l.useEffect(()=>{const n=window.setTimeout(()=>{s(!1)},900);return()=>window.clearTimeout(n)},[]);const c=l.useCallback(n=>{r(Ot(n.slug),{color:n.accent,direction:"down",intensity:"lite",duration:620})},[r]);return e.jsx(Ht,{backgroundClassName:d.backgroundClassName,footerBackgroundColor:d.footerBackgroundColor,footerRunwayVh:d.footerRunwayVh,children:n=>e.jsxs("div",{...i,className:"relative isolate",children:[e.jsx("div",{className:"pointer-events-none absolute inset-0 z-0","aria-hidden":!0,children:e.jsxs("div",{className:"sticky top-0 h-[100svh]",children:[e.jsx(Bt,{effectId:d.backdropEffectId,quality:d.backdropQuality,interactionMode:d.backdropInteractionMode,styleSeed:d.backdropStyleSeed,className:d.backdropClassName}),d.backdropOverlayClassName?e.jsx("div",{className:d.backdropOverlayClassName}):null]})}),e.jsx(Yt,{scrollContainerRef:n,navInteractionTick:o,isTouch:h,navInteractionLockMs:2e3,dismissAllThresholdPx:typeof window>"u"?void 0:window.innerHeight,visitStorageKey:"projects-onboarding-hints-seen"}),e.jsxs("div",{className:"relative z-10",children:[e.jsxs("header",{className:"theme-text-primary relative z-20 mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 pt-24",children:[e.jsx("p",{className:"theme-text-subtle text-[0.78rem] uppercase tracking-[0.3em]",children:Ue.eyebrow}),e.jsx("h1",{className:"max-w-4xl text-4xl font-semibold leading-[0.94] tracking-[-0.05em] xs:text-5xl sm:text-6xl",children:Ue.title}),e.jsx("p",{className:"theme-text-muted max-w-3xl text-[1rem] leading-relaxed sm:text-[1.06rem]",children:Ue.summary})]}),e.jsx("div",{className:"relative mt-10",children:e.jsx(pr,{scrollContainer:n,items:it,onCardSelect:c,forceLowPower:a,themeMode:t})}),e.jsx(hr,{projects:it,themeMode:t,onOpenCaseStudy:c})]})]})})};export{kr as default};
