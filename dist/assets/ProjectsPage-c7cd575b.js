import{a as l,aK as Mt,aL as wt,aM as vt,j as t,C as bt,d as jt,_ as nt,aq as kt,g as it,aN as st,f as de,aO as St,aP as Rt,a6 as Pt,e as J,k as Be,aQ as $t,a2 as rt,z as E,V as q,ae as Ct,a4 as Et,ac as At,aR as Lt,aS as It,aT as Ye,A as Tt,m as Fe,t as Nt,w as Dt,aU as Ue}from"./index-20d29d16.js";import{D as Gt,L as zt}from"./LandingOnboardingOverlay-48106cbb.js";import{S as Ot}from"./SceneBloom-a315788e.js";import{c as je}from"./probe-e4e617c0.js";import{a as Bt,u as Yt}from"./use-motion-value-d8a21f61.js";import{u as Ft}from"./use-motion-value-event-0b9f22a8.js";import{P as Ut}from"./PageScaffold-0c12f87a.js";import"./Footer-62b69b50.js";function Zt(e){const s=l.useRef(0),{isStatic:r}=l.useContext(Mt);l.useEffect(()=>{if(r)return;const i=({timestamp:a,delta:n})=>{s.current||(s.current=a),e(a-s.current,n)};return wt.update(i,!0),()=>vt(i)},[e])}const _t=({progress:e,height:s=200,forceLowPower:r=!1,themeMode:i,children:a})=>{const[n,c]=l.useState(!1),[p,d]=l.useState(!1);l.useEffect(()=>{if(typeof window>"u")return;const f=window.matchMedia("(max-width: 900px)"),h=window.matchMedia("(prefers-reduced-motion: reduce)"),x=()=>{c(f.matches),d(h.matches)};return x(),f.addEventListener?(f.addEventListener("change",x),h.addEventListener("change",x)):(f.addListener(x),h.addListener(x)),()=>{f.removeEventListener?(f.removeEventListener("change",x),h.removeEventListener("change",x)):(f.removeListener(x),h.removeListener(x))}},[]);const o=p||r,u=s,m=l.useMemo(()=>i==="dark"?"#0b1326":"#eef4fb",[i]);return l.useEffect(()=>{},[o,n,u,i]),t.jsx("section",{style:{height:`${u}vh`},className:"relative",children:t.jsxs("div",{className:"sticky top-0 h-[100svh] overflow-hidden",children:[t.jsx("div",{className:"theme-project-scene-haze-a pointer-events-none absolute inset-0"}),t.jsx("div",{className:"theme-project-scene-haze-b pointer-events-none absolute inset-0"}),t.jsx(bt,{children:t.jsxs(jt,{className:"absolute inset-0 h-full w-full",camera:{position:[0,.14,6.15],fov:43},dpr:o?[1,1.5]:[1,2],shadows:!1,gl:{preserveDrawingBuffer:!1,antialias:!o,powerPreference:"high-performance",alpha:!0},onCreated:({gl:f})=>{f.outputColorSpace=nt,kt.enabled=!0,f.shadowMap.enabled=!1,f.setClearColor(16777215,0)},children:[t.jsx("fog",{attach:"fog",args:[m,8,24]}),t.jsx("ambientLight",{intensity:.72}),t.jsx("spotLight",{position:[0,5.2,2.6],angle:.56,penumbra:.66,intensity:o?1.45:1.68,distance:26}),t.jsx("directionalLight",{position:[2.8,2.6,2.4],intensity:.45}),t.jsx("directionalLight",{position:[-3.2,1.4,-2.8],intensity:.18}),t.jsx(Ot,{enabled:!o}),t.jsx("group",{scale:1.14,position:[0,.02,0],children:a(e,{lowPowerMode:o,mobileViewport:n})})]})}),t.jsx("div",{className:"theme-project-scene-bottom-fade pointer-events-none absolute inset-x-0 bottom-0 h-36"})]})})},Ht=e=>"data:image/svg+xml;utf8,"+encodeURIComponent(e==="dark"?"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'><rect width='720' height='1024' fill='#0f172a'/><rect x='36' y='36' width='648' height='952' rx='28' fill='none' stroke='#334155' stroke-width='8'/></svg>":"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'><rect width='720' height='1024' fill='#f8fafc'/><rect x='36' y='36' width='648' height='952' rx='28' fill='none' stroke='#94a3b8' stroke-width='8'/></svg>"),Vt="data:image/svg+xml;utf8,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#103a8a'/><stop offset='100%' stop-color='#1f5fd8'/></linearGradient></defs><rect width='720' height='1024' fill='url(#g)'/></svg>"),ct=l.forwardRef(({frontSrc:e,backSrc:s,width:r,height:i,thickness:a=.02,borderColor:n="#e0e0e0",edgeColor:c,edgeGlow:p,flip:d,pop:o,popScale:u=1.15,onClick:m,isClickable:f,frontAttachment:h,themeMode:x="light",...w},v)=>{const{viewport:I,gl:$}=it(),me=Math.min(I.width,I.height),A=r??me*.08,T=i??A*1.4,F=l.useRef(null),ee=l.useRef(null),xe=l.useRef(null),R=l.useRef(null),ge=l.useRef(null),ye=l.useRef(null),ne=l.useRef(!1);l.useImperativeHandle(v,()=>F.current,[]);const U=st(rt,e??Ht(x)),C=st(rt,s??Vt),y=l.useMemo(()=>new de(c??n),[c,n]),S=l.useMemo(()=>{const M=new St(A+.016,T+.016,a+.012),L=new Rt(M);return M.dispose(),L},[A,T,a]);l.useMemo(()=>{const M=$.capabilities.getMaxAnisotropy();for(const L of[U,C])L.colorSpace=nt,L.anisotropy=M,L.minFilter=Pt,L.needsUpdate=!0},[U,C,$]),J(()=>{var te,le,V;const M=F.current;if(!M)return;const L=((te=d==null?void 0:d.get)==null?void 0:te.call(d))??0;M.rotation.y=Math.PI*L;const Me=((le=o==null?void 0:o.get)==null?void 0:le.call(o))??0,O=1+(u-1)*Me;M.scale.setScalar(O);const ke=((V=p==null?void 0:p.get)==null?void 0:V.call(p))??0,Z=ne.current?2.15:1,G=E.clamp(ke*Z,0,1.9),ie=ee.current;ie&&(ie.emissive.setRGB(1,1,1),ie.emissiveIntensity=.24+G*.2);const ce=xe.current;ce&&(ce.uniforms.uAccentColor.value.copy(y),ce.uniforms.uGlow.value=E.clamp(G*.52,0,1.1));const we=R.current;we&&(we.opacity=E.clamp(.34+G*.22,.34,.76));const _=ge.current;_&&(_.opacity=E.clamp(G*.64,0,.95),_.color.copy(y).multiplyScalar(.95+G*2.3),_.visible=_.opacity>.01);const H=ye.current;H&&(H.uniforms.uColor.value.copy(y),H.uniforms.uOpacity.value=E.clamp(G*.28,0,.48),H.uniforms.uStrength.value=.85+G*1.7,H.visible=G>.01)}),l.useEffect(()=>()=>{$.domElement.style.cursor="auto"},[$]),l.useEffect(()=>()=>{S.dispose()},[S]);const N=()=>f?f():!0,b=M=>{ne.current=!0,m&&N()?(M.stopPropagation(),$.domElement.style.cursor="pointer"):$.domElement.style.cursor="auto"},j=()=>{ne.current=!1,$.domElement.style.cursor="auto"},g=M=>{!m||!N()||(M.stopPropagation(),m())};return t.jsxs("group",{ref:F,...w,children:[t.jsxs("mesh",{renderOrder:2,children:[t.jsx("boxGeometry",{args:[A+.03,T+.03,a+.04]}),t.jsx("shaderMaterial",{ref:ye,uniforms:{uColor:{value:y.clone()},uOpacity:{value:0},uStrength:{value:.7}},vertexShader:`
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
            `,blending:Be,transparent:!0,depthWrite:!1,depthTest:!0,side:$t,toneMapped:!1})]}),t.jsx("lineSegments",{geometry:S,renderOrder:3,children:t.jsx("lineBasicMaterial",{ref:ge,color:y,transparent:!0,opacity:0,blending:Be,depthWrite:!1,toneMapped:!1})}),t.jsxs("mesh",{castShadow:!0,children:[t.jsx("boxGeometry",{args:[A,T,a]}),t.jsx("meshStandardMaterial",{color:n,metalness:.08,roughness:.52})]}),t.jsxs("mesh",{position:[0,0,a/2+1e-4],onPointerOver:b,onPointerOut:j,onClick:g,children:[t.jsx("planeGeometry",{args:[A,T]}),t.jsx("meshStandardMaterial",{ref:ee,map:U,roughness:.3,metalness:0,emissive:"#ffffff",emissiveMap:U,emissiveIntensity:.34,toneMapped:!1})]}),t.jsxs("mesh",{position:[0,0,a/2+18e-5],renderOrder:5,children:[t.jsx("planeGeometry",{args:[A,T]}),t.jsx("shaderMaterial",{ref:xe,uniforms:{uMap:{value:U},uAccentColor:{value:y.clone()},uGlow:{value:0}},vertexShader:`
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
            `,blending:Be,transparent:!0,depthWrite:!1,depthTest:!0,toneMapped:!1})]}),t.jsxs("mesh",{position:[0,0,a/2+26e-5],renderOrder:6,children:[t.jsx("planeGeometry",{args:[A,T]}),t.jsx("meshBasicMaterial",{ref:R,map:U,transparent:!0,opacity:.34,depthWrite:!1,toneMapped:!1})]}),h?t.jsx("group",{position:[0,0,a/2+.0015],children:h}):null,t.jsxs("mesh",{"rotation-y":Math.PI,position:[0,0,-a/2-1e-4],children:[t.jsx("planeGeometry",{args:[A,T]}),t.jsx("meshStandardMaterial",{map:C,roughness:.28,metalness:0,emissive:"#ffffff",emissiveMap:C,emissiveIntensity:.4,toneMapped:!1})]})]})});ct.displayName="Card3D";const pe=e=>Math.min(1,Math.max(0,e)),fe=e=>typeof e=="number"?e:e.get(),Y=()=>{},he=.08,ue=(e,s)=>l.useMemo(()=>({accent:new de(e),deep:new de(s.deep),mid:new de(s.mid),bright:new de(s.bright)}),[e,s.deep,s.mid,s.bright]),Xt=({reveal:e,intensity:s,accent:r,palette:i})=>{const a=l.useRef(null),n=l.useRef([]),c=ue(r,i);return J(({clock:p})=>{const d=a.current;if(!d)return;const o=pe(fe(e)),u=o>he;if(d.visible=u,!u)return;const m=p.elapsedTime,f=(.7+o*.6)*(.9+s*.12);d.scale.setScalar(f),d.rotation.y=m*.55,d.rotation.x=Math.sin(m*.7)*.12,d.position.z=.1+o*.5,d.position.y=.02+Math.sin(m*1.2)*.04;const h=.44+o*.26;n.current.forEach((x,w)=>{if(!x)return;const v=m*(1.8+w*.22)+w*(Math.PI*.66);x.position.set(Math.cos(v)*h,Math.sin(v*1.08)*h*.58,Math.sin(v*.72)*.22)})}),t.jsxs("group",{ref:a,position:[0,.04,.2],children:[t.jsxs("mesh",{raycast:Y,children:[t.jsx("icosahedronGeometry",{args:[.19,2]}),t.jsx("meshStandardMaterial",{color:c.mid,emissive:c.accent,emissiveIntensity:.56,metalness:.1,roughness:.38,toneMapped:!1})]}),t.jsxs("mesh",{rotation:[Math.PI/2,0,0],raycast:Y,children:[t.jsx("torusGeometry",{args:[.55,.03,18,84]}),t.jsx("meshStandardMaterial",{color:c.accent,emissive:c.accent,emissiveIntensity:.72,transparent:!0,opacity:.88,metalness:.05,roughness:.42,toneMapped:!1})]}),Array.from({length:4}).map((p,d)=>t.jsxs("mesh",{raycast:Y,ref:o=>{n.current[d]=o},children:[t.jsx("sphereGeometry",{args:[.07,16,16]}),t.jsx("meshStandardMaterial",{color:c.bright,emissive:c.accent,emissiveIntensity:.9,toneMapped:!1})]},`orbital-satellite-${d}`))]})},Wt=({reveal:e,intensity:s,accent:r,palette:i})=>{const a=l.useRef(null),n=l.useRef([]),c=ue(r,i),p=l.useMemo(()=>[-.48,-.32,-.16,0,.16,.32,.48],[]);return J(({clock:d})=>{const o=a.current;if(!o)return;const u=pe(fe(e)),m=u>he;if(o.visible=m,!m)return;const f=d.elapsedTime;o.scale.setScalar(.7+u*.52),o.position.z=.08+u*.44,o.rotation.y=Math.sin(f*.82)*.09,o.rotation.x=-.12+Math.sin(f*.56)*.06,n.current.forEach((h,x)=>{if(!h)return;const v=.54+(.28+.72*(.5+.5*Math.sin(f*2.8+x*.66)))*(.85+s*.28);h.scale.y=v,h.position.y=-.08+v*.18,h.position.z=Math.sin(f*1.2+x)*.05})}),t.jsx("group",{ref:a,position:[0,-.04,.14],children:p.map((d,o)=>t.jsxs("mesh",{raycast:Y,ref:u=>{n.current[o]=u},position:[d,0,0],children:[t.jsx("boxGeometry",{args:[.09,.36,.09]}),t.jsx("meshStandardMaterial",{color:o%2===0?c.mid:c.accent,emissive:c.accent,emissiveIntensity:.64,metalness:.08,roughness:.34,toneMapped:!1})]},`spine-${o}`))})},Kt=({reveal:e,intensity:s,accent:r,palette:i})=>{const a=l.useRef(null),n=ue(r,i),c=l.useMemo(()=>[new q(-.42,.08,0),new q(-.16,.28,.14),new q(.18,.2,-.08),new q(.44,.04,.04),new q(-.08,-.2,.1),new q(.28,-.26,-.03)],[]),p=l.useMemo(()=>{const d=[[0,1],[1,2],[2,3],[1,4],[4,5],[2,5],[0,4]],o=new Float32Array(d.length*6);d.forEach(([m,f],h)=>{o[h*6]=c[m].x,o[h*6+1]=c[m].y,o[h*6+2]=c[m].z,o[h*6+3]=c[f].x,o[h*6+4]=c[f].y,o[h*6+5]=c[f].z});const u=new Ct;return u.setAttribute("position",new Et(o,3)),u},[c]);return l.useEffect(()=>()=>{p.dispose()},[p]),J(({clock:d})=>{const o=a.current;if(!o)return;const u=pe(fe(e)),m=u>he;if(o.visible=m,!m)return;const f=d.elapsedTime;o.scale.setScalar((.7+u*.64)*(.95+s*.1)),o.rotation.y=f*.42,o.rotation.x=Math.sin(f*.72)*.08,o.position.z=.14+u*.46,o.position.y=Math.sin(f*1.1)*.03}),t.jsxs("group",{ref:a,position:[0,0,.2],children:[t.jsx("lineSegments",{geometry:p,raycast:Y,children:t.jsx("lineBasicMaterial",{color:n.accent,transparent:!0,opacity:.72,toneMapped:!1})}),c.map((d,o)=>t.jsxs("mesh",{position:[d.x,d.y,d.z],raycast:Y,children:[t.jsx("sphereGeometry",{args:[.06+o%2*.012,16,16]}),t.jsx("meshStandardMaterial",{color:o%2===0?n.bright:n.mid,emissive:n.accent,emissiveIntensity:.74,toneMapped:!1})]},`node-${o}`))]})},qt=({reveal:e,intensity:s,accent:r,palette:i})=>{const a=l.useRef(null),n=ue(r,i);return J(({clock:c})=>{const p=a.current;if(!p)return;const d=pe(fe(e)),o=d>he;if(p.visible=o,!o)return;const u=c.elapsedTime;p.scale.setScalar((.72+d*.58)*(.96+s*.08)),p.rotation.z=Math.sin(u*.62)*.16,p.rotation.y=u*.52,p.position.z=.12+d*.48,p.position.y=-.03+Math.sin(u*1.5)*.04}),t.jsxs("group",{ref:a,position:[0,-.02,.2],children:[t.jsxs("mesh",{raycast:Y,children:[t.jsx("torusKnotGeometry",{args:[.34,.07,140,18,2,3]}),t.jsx("meshStandardMaterial",{color:n.mid,emissive:n.accent,emissiveIntensity:.82,metalness:.22,roughness:.32,toneMapped:!1})]}),t.jsxs("mesh",{rotation:[Math.PI/2,0,0],raycast:Y,children:[t.jsx("ringGeometry",{args:[.46,.56,64]}),t.jsx("meshBasicMaterial",{color:n.accent,transparent:!0,opacity:.28,toneMapped:!1,side:At})]})]})},Qt=({reveal:e,intensity:s,accent:r,palette:i})=>{const a=l.useRef(null),n=l.useRef([]),c=ue(r,i),p=l.useMemo(()=>{const d=[];for(let u=0;u<3;u+=1)for(let m=0;m<3;m+=1)d.push([(m-1)*.22,(u-1)*.22*.78,0]);return d},[]);return J(({clock:d})=>{const o=a.current;if(!o)return;const u=pe(fe(e)),m=u>he;if(o.visible=m,!m)return;const f=d.elapsedTime;o.scale.setScalar((.78+u*.55)*(.93+s*.12)),o.rotation.y=Math.sin(f*.72)*.2,o.position.z=.12+u*.45,o.position.y=-.02+Math.sin(f*1.24)*.03,n.current.forEach((h,x)=>{if(!h)return;const v=.44+(.35+.65*(.5+.5*Math.sin(f*2.4+x*.44)))*(.72+s*.34);h.scale.y=v,h.position.z=Math.sin(f*1.1+x*.22)*.04,h.position.y=p[x][1]-.12+v*.12})}),t.jsx("group",{ref:a,position:[0,.04,.2],children:p.map(([d,o,u],m)=>t.jsxs("mesh",{raycast:Y,ref:f=>{n.current[m]=f},position:[d,o,u],children:[t.jsx("cylinderGeometry",{args:[.045,.045,.28,14]}),t.jsx("meshStandardMaterial",{color:m%2===0?c.mid:c.bright,emissive:c.accent,emissiveIntensity:.66,roughness:.32,metalness:.18,toneMapped:!1})]},`pillar-${m}`))})},Jt=e=>{switch(e.preset){case"orbitalCore":return t.jsx(Xt,{...e});case"dataSpines":return t.jsx(Wt,{...e});case"nodeConstellation":return t.jsx(Kt,{...e});case"ribbonArc":return t.jsx(qt,{...e});case"pillarArray":return t.jsx(Qt,{...e});default:return null}},es=(e,s,r)=>Math.min(r,Math.max(s,e)),Ze={dateLabel:"TBD",status:"Active",popoutIntensity:1},lt=e=>{var r,i;const s=e.front;return{dateLabel:((r=s.dateLabel)==null?void 0:r.trim())||Ze.dateLabel,status:s.status??Ze.status,iconSvg:((i=s.iconSvg)==null?void 0:i.trim())||It(e.title,e.accent,e.palette),frontFamily:s.frontFamily,popoutPreset:s.popoutPreset,popoutIntensity:es(s.popoutIntensity??Ze.popoutIntensity,.45,1.9)}},ts=Lt,ss=(e,s,r)=>{const{palette:i,accent:a}=e,n={atlas:i.line,signal:a,forge:i.bright,lattice:i.mid};return s==="dark"?{bgStart:i.deep,bgEnd:i.mid,portal:n[r],trim:i.line,text:i.bright,muted:i.line,chip:i.deep,chipText:i.bright}:{bgStart:i.bright,bgEnd:i.line,portal:n[r],trim:a,text:i.deep,muted:i.mid,chip:"#ffffff",chipText:i.deep}},_e=1024,He=720,Ve=720,Xe=1024,Ke=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&apos;"),We=(e,s,r)=>{const i=e.trim().split(/\s+/).filter(Boolean);if(!i.length)return[""];const a=[];let n="";for(const d of i){const o=n?`${n} ${d}`:d;if(o.length<=s){n=o;continue}if(n&&a.push(n),n=d,a.length===r)break}a.length<r&&n&&a.push(n),a.length>r&&(a.length=r);const c=i.join(" "),p=a.join(" ");if(c.length>p.length){const d=a.length-1;a[d]=`${a[d].replace(/\.{3}$/,"").trim()}...`}return a},re=(e,s,r)=>e.map((i,a)=>`<tspan x='${s}' dy='${a===0?0:r}'>${Ke(i)}</tspan>`).join(""),rs=(e,{min:s,max:r})=>Math.max(s,Math.min(r,44+e.trim().length*10.4)),os=(e,s,r="landscape",i="light")=>{const a=lt(e),n=ss(e,i,a.frontFamily),c=We(e.title,24,2),p=We(e.subtitle,26,2),d=We(e.summary,40,2),o=r==="landscape",u=rs(a.dateLabel,{min:188,max:o?336:308}),m=o?_e:Ve,f=o?He:Xe,h=o?512:360,x=o?360:512,w=o?260:250,v=o?`
  <g transform='translate(720 0) rotate(90)'>
    <rect width='${_e}' height='${He}' fill='url(#bg)'/>
    <rect width='${_e}' height='${He}' fill='url(#grid)'/>

    <rect x='20' y='20' width='984' height='680' rx='34' fill='none' stroke='${n.trim}' stroke-opacity='0.34' stroke-width='9'/>
    <rect x='20' y='20' width='984' height='680' rx='34' fill='none' stroke='${e.accent}' stroke-opacity='0.72' stroke-width='4.8'/>
    <rect x='44' y='44' width='936' height='632' rx='28' fill='none' stroke='${n.trim}' stroke-opacity='0.28' stroke-width='2.2'/>

    <ellipse cx='512' cy='360' rx='228' ry='148' fill='url(#portalGlow)'/>
    <circle cx='512' cy='360' r='108' fill='none' stroke='${e.accent}' stroke-opacity='0.44' stroke-width='4'/>
    <circle cx='512' cy='360' r='68' fill='none' stroke='${n.trim}' stroke-opacity='0.42' stroke-width='3'/>

    <text x='84' y='122' fill='${n.text}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='54' font-weight='700'>
      ${re(c,84,60)}
    </text>

    <g transform='translate(84 588)'>
      <rect x='0' y='0' width='${u}' height='44' rx='22' fill='${n.chip}'/>
      <text x='18' y='29' fill='${n.muted}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='18' font-weight='600'>${Ke(a.dateLabel)}</text>
    </g>

    <g transform='translate(938 520)'>
      <text x='0' y='0' text-anchor='end' fill='${n.muted}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='29' font-weight='600'>
        ${re(p,0,34)}
      </text>
      <text x='0' y='86' text-anchor='end' fill='${n.text}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='22' font-weight='500' opacity='0.92'>
        ${re(d,0,28)}
      </text>
    </g>

    <path d='M98 440 H262' stroke='${e.accent}' stroke-opacity='0.5' stroke-width='3'/>
    <path d='M760 440 H924' stroke='${e.accent}' stroke-opacity='0.38' stroke-width='3'/>
  </g>`:`
  <g>
    <rect width='${Ve}' height='${Xe}' fill='url(#bg)'/>
    <rect width='${Ve}' height='${Xe}' fill='url(#grid)'/>

    <rect x='20' y='20' width='680' height='984' rx='34' fill='none' stroke='${n.trim}' stroke-opacity='0.34' stroke-width='9'/>
    <rect x='20' y='20' width='680' height='984' rx='34' fill='none' stroke='${e.accent}' stroke-opacity='0.72' stroke-width='4.8'/>
    <rect x='44' y='44' width='632' height='936' rx='28' fill='none' stroke='${n.trim}' stroke-opacity='0.28' stroke-width='2.2'/>

    <ellipse cx='360' cy='512' rx='206' ry='142' fill='url(#portalGlow)'/>
    <circle cx='360' cy='512' r='108' fill='none' stroke='${e.accent}' stroke-opacity='0.44' stroke-width='4'/>
    <circle cx='360' cy='512' r='68' fill='none' stroke='${n.trim}' stroke-opacity='0.42' stroke-width='3'/>

    <text x='84' y='144' fill='${n.text}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='52' font-weight='700'>
      ${re(c,84,58)}
    </text>

    <g transform='translate(84 812)'>
      <rect x='0' y='0' width='${u}' height='44' rx='22' fill='${n.chip}'/>
      <text x='18' y='29' fill='${n.muted}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='18' font-weight='600'>${Ke(a.dateLabel)}</text>
    </g>

    <g transform='translate(636 702)'>
      <text x='0' y='0' text-anchor='end' fill='${n.muted}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='27' font-weight='600'>
        ${re(p,0,32)}
      </text>
      <text x='0' y='80' text-anchor='end' fill='${n.text}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='21' font-weight='500' opacity='0.92'>
        ${re(d,0,27)}
      </text>
    </g>

    <path d='M98 644 H262' stroke='${e.accent}' stroke-opacity='0.5' stroke-width='3'/>
    <path d='M458 644 H622' stroke='${e.accent}' stroke-opacity='0.38' stroke-width='3'/>
  </g>`,I=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='${m}' y2='${f}' gradientUnits='userSpaceOnUse'>
      <stop offset='0%' stop-color='${n.bgStart}'/>
      <stop offset='100%' stop-color='${n.bgEnd}'/>
    </linearGradient>
    <radialGradient id='portalGlow' cx='${h}' cy='${x}' r='${w}' gradientUnits='userSpaceOnUse'>
      <stop offset='0%' stop-color='${n.portal}' stop-opacity='0.56'/>
      <stop offset='100%' stop-color='${n.portal}' stop-opacity='0'/>
    </radialGradient>
    <pattern id='grid' width='32' height='32' patternUnits='userSpaceOnUse' patternTransform='rotate(${s*11})'>
      <path d='M16 0V32 M0 16H32' stroke='${n.trim}' stroke-opacity='0.08' stroke-width='1'/>
    </pattern>
  </defs>

  ${v}
</svg>`;return`data:image/svg+xml;utf8,${encodeURIComponent(I)}`},as=(e,s)=>{const r=e.palette,i=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'>
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
    <pattern id='grid' width='28' height='28' patternUnits='userSpaceOnUse' patternTransform='rotate(${s*9})'>
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
  <g transform='translate(360 512) rotate(${s*14})'>
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
</svg>`;return`data:image/svg+xml;utf8,${encodeURIComponent(i)}`},ns=e=>{if(e<=0)return[];const s=Array.from({length:e},(i,a)=>a);let r=e*131+17;for(let i=s.length-1;i>0;i-=1){r=r*1664525+1013904223>>>0;const a=r%(i+1);[s[i],s[a]]=[s[a],s[i]]}return s},Q=e=>Math.min(1,Math.max(0,e)),oe=e=>1-Math.pow(1-e,3),ae=e=>e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2,z=(e,s,r)=>Q((e-s)/(r-s)),D=(e,s,r)=>E.lerp(e,s,r),is=(e,s)=>{const r=Math.max(0,e-4);return{dealStart:.64,dealEnd:s?Math.min(.91,.88+r*.025):Math.min(.92,.84+r*.03),flipStart:s?Math.max(.7,.72-r*.01):Math.max(.74,.78-r*.01),flipEnd:s?Math.min(.94,.86+r*.03):.98,browseStart:s?Math.min(.92,.86+r*.025):Math.min(.97,.95+r*.015),dealDelaySpan:Math.min(.5,.32+r*.045),flipDelaySpan:Math.min(.52,.35+r*.05)}},ot=(e,s,r)=>r?{width:e,height:s,cardSpacing:s*.44,ringRx:e*.17,ringRy:s*.13,exitDropMax:s*.34,dealEntryY:s*.48,browseParallaxX:.07,browseParallaxY:.045,dealScaleMax:2.08,dealArcMax:.2,stackDepthStep:.0085,flipArcZMax:.5,flipArcYMax:.06}:{width:e,height:s,cardSpacing:s*.56,ringRx:e*.24,ringRy:s*.18,exitDropMax:s*.48,dealEntryY:s*.6,browseParallaxX:.16,browseParallaxY:.08,dealScaleMax:2.2,dealArcMax:.3,stackDepthStep:.008,flipArcZMax:.7,flipArcYMax:.12},cs=({progress:e,items:s,onCardSelect:r,lowPowerMode:i=!1,mobileViewport:a=!1,themeMode:n})=>{const{viewport:c,pointer:p,camera:d,gl:o}=it(),u=l.useRef([]),m=l.useRef([]),f=l.useRef(null),h=l.useRef([]),x=l.useRef([]),w=l.useRef([]),v=l.useRef(ot(c.width,c.height,a)),I=l.useRef(!1),$=l.useMemo(()=>s.map(C=>lt(C)),[s]),A=Math.min(c.width,c.height)*(a?.228:.198),T=A*1.46,F=a?"portrait":"landscape",ee=E.clamp(A*.58,a?.34:.42,a?.56:.72),xe=a?0:-Math.PI/2,R=s.length,ge=l.useMemo(()=>s.map((C,y)=>({frontSrc:os(C,y+1,F,n),backSrc:as(C,y+1),borderColor:n==="dark"?"#172036":"#f8fafc",edgeColor:C.accent,themeMode:n,width:A,height:T})),[s,T,A,F,n]),ye=l.useMemo(()=>ns(R),[R]);l.useEffect(()=>{},[s]),h.current.length!==R&&(h.current=Array.from({length:R},()=>Ye(0))),x.current.length!==R&&(x.current=Array.from({length:R},()=>Ye(0))),w.current.length!==R&&(w.current=Array.from({length:R},()=>Ye(0)));const ne=l.useMemo(()=>s.map((C,y)=>({x:(y%2===0?-1:1)*(.46+y*.08),y:(y%3-1)*.2,lift:.12+y*.014})),[s]),U=C=>{if(!I.current)return;const y=s[C],S=u.current[C];if(!y||!S)return;const N=new q;S.getWorldPosition(N);const b=N.clone().project(d),j=o.domElement.getBoundingClientRect(),g=j.left+(b.x*.5+.5)*j.width,M=j.top+(-b.y*.5+.5)*j.height;r==null||r(y,{x:g,y:M})};return J((C,y)=>{const S=f.current;if(!S)return;const N=C.clock.getElapsedTime(),b=Q(e.get()),j=ot(c.width,c.height,a),g=v.current,M=1-Math.exp(-Math.min(y,.2)*10),L=is(R,a);g.width=D(g.width,j.width,M),g.height=D(g.height,j.height,M),g.cardSpacing=D(g.cardSpacing,j.cardSpacing,M),g.ringRx=D(g.ringRx,j.ringRx,M),g.ringRy=D(g.ringRy,j.ringRy,M),g.exitDropMax=D(g.exitDropMax,j.exitDropMax,M),g.dealEntryY=D(g.dealEntryY,j.dealEntryY,M),g.browseParallaxX=D(g.browseParallaxX,j.browseParallaxX,M),g.browseParallaxY=D(g.browseParallaxY,j.browseParallaxY,M),g.dealScaleMax=D(g.dealScaleMax,j.dealScaleMax,M),g.dealArcMax=D(g.dealArcMax,j.dealArcMax,M),g.stackDepthStep=D(g.stackDepthStep,j.stackDepthStep,M),g.flipArcZMax=D(g.flipArcZMax,j.flipArcZMax,M),g.flipArcYMax=D(g.flipArcYMax,j.flipArcYMax,M);const Me=oe(z(b,0,a?.3:.26)),O=oe(z(b,.18,.36)),ke=oe(z(b,.32,.48)),Z=ae(z(b,.44,.58)),G=z(b,L.dealStart,L.dealEnd),ie=z(b,L.flipStart,L.flipEnd),ce=ae(z(b,L.browseStart,1)),we=ae(z(b,.62,.78)),_=.56*ae(z(b,.88,1)),H=Q(Math.max(we,_)),te=b>.64;I.current=b>(a?.95:.9);const le=Me*(1-O),V=1-oe(z(b,.56,.72)),Se=p.x,Re=p.y,dt=Math.PI*.24*le,pt=-Math.PI*.035*le,Qe=te?a?.008:.012:0;S.rotation.x=(dt+Re*.03)*V+Re*Qe,S.rotation.y=(pt+Se*.05)*V+Se*Qe;const Pe=g.cardSpacing,ft=(R-1)*Pe,Je=ce*ft,et=te&&R>0?E.clamp(Math.round(Je/Math.max(Pe,1e-4)),0,R-1):null;et!==null&&s[et],S.position.x=Se*g.browseParallaxX*V,S.position.y=Re*g.browseParallaxY*V+Je;const ht=g.ringRx,ut=g.ringRy,mt=(ke*.3+Z*.48)*Math.PI*2;for(let k=0;k<R;k++){const P=u.current[k];if(!P)continue;const $e=R>1?k/(R-1):0;if(x.current[k].set(H),te){const se=$e*L.dealDelaySpan,B=ae(Q((G-se)/Math.max(.01,1-se*.55))),X=oe(z(G,.82,1)),Ce=g.dealEntryY,ve=-k*Pe,Ee=E.lerp(Ce,ve,B),Ae=Math.sin(B*Math.PI)*g.dealArcMax,Le=-k*g.stackDepthStep;P.position.x=0,P.position.y=E.lerp(Ee,ve,X),P.position.z=E.lerp(Ae,Le,X);const Ie=a?0:Math.PI/2,W=Ie*B;P.rotation.x=0;const Te=(1-B)*((k%2===0?-1:1)*.08),Ne=W+Te;P.rotation.z=E.lerp(Ne,Ie,X);const be=$e*L.flipDelaySpan,K=ae(Q((ie-be)/Math.max(.01,1-be*.45))),De=Math.sin(K*Math.PI)*g.flipArcZMax,Ge=Math.sin(K*Math.PI)*g.flipArcYMax;P.position.z+=De,P.position.y+=Ge,h.current[k].set(1-K);const ze=Q((K-.08)/.92);w.current[k].set(ze),B>.98&&K>.98&&(P.position.y+=Math.sin(N*1.1+k*1.3)*.01,P.position.z+=Math.cos(N*.9+k*.7)*.005),P.rotation.y=0;const Oe=E.lerp(1,g.dealScaleMax,B);P.scale.setScalar(Oe)}else{const se=ne[k],B=oe(Q((Me-$e*.44)/.56)),X=Math.sin(B*Math.PI),Ce=-k*.05,ve=-(ye[k]??k)*.055,Ee=se.x*X,Ae=se.y*X,Le=E.lerp(Ce,ve,B)+se.lift*X,W=k/R*Math.PI*2+mt,Te=Math.sin(W)*ht,Ne=Math.cos(W)*ut+.05,be=-.06+Math.sin(W*2)*.012,K=E.lerp(Ee,Te,O),De=E.lerp(Ae,Ne,O),Ge=E.lerp(Le,be,O),ze=g.exitDropMax*Z,Oe=Math.sin(W*1.1)*.06*Z,tt=.01+O*.022,xt=Math.sin(N*1.65+k*.82)*tt,gt=Math.cos(N*1.2+k*.58)*tt*.45;P.position.x=K+Oe,P.position.y=De-ze+xt,P.position.z=Ge-.16*Z+gt,P.rotation.x=0,P.rotation.y=0,P.rotation.z=W*(a?.08:.1)*O,h.current[k].set(1),w.current[k].set(0);const yt=1+.1*O-.12*Z;P.scale.setScalar(yt)}}}),t.jsx("group",{ref:f,children:ge.map((C,y)=>{const S=s[y],N=$[y];return t.jsx("group",{ref:b=>{b&&(u.current[y]=b)},position:[0,0,-y*.05],children:t.jsx(ct,{ref:b=>{m.current[y]=b},...C,flip:h.current[y],edgeGlow:x.current[y],frontAttachment:!i&&S&&N?t.jsx("group",{rotation:[0,0,xe],scale:ee,children:t.jsx(Jt,{preset:N.popoutPreset,accent:S.accent,palette:S.palette,reveal:w.current[y],intensity:N.popoutIntensity*.84})}):void 0,isClickable:()=>I.current,onClick:()=>U(y)})},(S==null?void 0:S.id)??`card-${y}`)})})},qe=e=>Math.min(1,Math.max(0,e)),ls=e=>560+Math.max(0,e-4)*110,at=(e,s)=>{const r=qe(e),i=Math.max(0,s-4),a=Math.min(.67,.62+i*.03),n=Math.min(.84,.76+i*.04),c=Math.min(.9,.76+i*.05),p=Math.max(.08,1-c);return r<=.12?r:r<=.3?.12+(r-.12)/.18*.3:r<=.46?.42+(r-.3)/.16*.26:r<=a?.68+(r-.46)/(a-.46)*.16:r<=n?.84+(r-a)/(n-a)*.12:r<=c?.96:.96+(r-c)/p*.04},ds=({scrollContainer:e,items:s,onCardSelect:r,forceLowPower:i=!1,themeMode:a})=>{const n=je(),c=l.useRef(null),p=l.useRef(0),d=l.useRef(0),o=ls(s.length),u="projects:storyboard-scroll",m=Bt(0),{scrollYProgress:f}=Yt({container:e,target:c,offset:["start start","end end"],layoutEffect:!1});Ft(f,"change",x=>{p.current=x});const h=l.useCallback(()=>{const x=qe(f.get());p.current=x,m.set(at(x,s.length)),d.current=3},[s.length,f,m]);return l.useEffect(()=>{h()},[h]),l.useEffect(()=>{},[i,s.length,u,e,f,o]),l.useEffect(()=>{if(typeof window>"u")return;const x=()=>{h()},w=typeof ResizeObserver<"u"?new ResizeObserver(()=>{x()}):null,v=c.current,I=e.current;w&&(v&&w.observe(v),I&&w.observe(I)),window.addEventListener("resize",x);const $=window.visualViewport;return $==null||$.addEventListener("resize",x),()=>{w==null||w.disconnect(),window.removeEventListener("resize",x),$==null||$.removeEventListener("resize",x)}},[e,h]),Zt((x,w)=>{const v=at(p.current,s.length),I=m.get();if(d.current>0){m.set(v),d.current-=1;return}const $=v<.68,me=v<.96,A=($?34e-5:me?5e-4:9e-4)*w,T=v-I,F=Math.sign(T)*Math.min(Math.abs(T),A),ee=qe(I+F);m.set(ee)}),t.jsx("div",{ref:c,...n,children:t.jsx(_t,{progress:m,height:o,forceLowPower:i,themeMode:a,children:(x,w)=>t.jsx(cs,{progress:x,items:s,onCardSelect:r,lowPowerMode:w.lowPowerMode,mobileViewport:w.mobileViewport,themeMode:a})})})},ps=({item:e,originPos:s,onClose:r,themeMode:i})=>{l.useEffect(()=>{if(!e)return;const c=p=>{p.key==="Escape"&&r()};return window.addEventListener("keydown",c),()=>window.removeEventListener("keydown",c)},[e,r]),l.useEffect(()=>{},[e,s,i]);const a=je(),n=je();return t.jsx(Tt,{children:e&&s&&t.jsxs(t.Fragment,{children:[t.jsx(Fe.div,{...a,className:"theme-overlay-backdrop fixed inset-0 z-[90]",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.28},onClick:r},"overlay-backdrop"),t.jsx(Fe.div,{className:"fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-8",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:r,children:t.jsxs(Fe.div,{...n,className:"theme-overlay-panel relative max-h-[82vh] w-full max-w-[720px] overflow-y-auto rounded-3xl border backdrop-blur-xl",initial:{scale:.25,x:s.x-window.innerWidth/2,y:s.y-window.innerHeight/2,opacity:0},animate:{scale:1,x:0,y:0,opacity:1},exit:{scale:.85,opacity:0},transition:{type:"spring",damping:28,stiffness:260},onClick:c=>c.stopPropagation(),children:[t.jsx("div",{className:"h-1.5 rounded-t-3xl",style:{background:e.accent}}),t.jsxs("div",{className:"p-6 sm:p-8",children:[t.jsx("button",{onClick:r,className:"theme-overlay-close absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full transition","aria-label":"Close",children:t.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:t.jsx("path",{d:"M4 4l8 8M12 4l-8 8",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})})}),t.jsx("p",{className:"theme-text-subtle text-[11px] uppercase tracking-[0.24em]",children:e.subtitle}),t.jsx("h3",{className:"mt-2 text-[28px] font-medium leading-tight sm:text-[36px]",style:{color:e.accent},children:e.title}),t.jsx("p",{className:"theme-text-muted mt-4 text-[15px] leading-relaxed",children:e.summary}),t.jsx("p",{className:"theme-text-primary mt-3 text-[14px] leading-relaxed",children:e.details}),t.jsx("div",{className:"mt-5 flex flex-wrap gap-2",children:e.tags.map(c=>t.jsx("span",{className:"theme-chip-subtle rounded-full px-3 py-1 text-[11px] font-medium",children:c},c))}),e.media.length>0&&t.jsx("div",{className:"mt-5 grid gap-3 sm:grid-cols-2",children:e.media.map((c,p)=>t.jsx("div",{className:"theme-media-frame overflow-hidden rounded-2xl border",children:t.jsx("img",{src:c,alt:`${e.title} preview ${p+1}`,className:"h-44 w-full object-cover",loading:"lazy"})},`${e.id}-media-${p}`))}),e.links.length>0&&t.jsx("div",{className:"mt-5 flex flex-wrap items-center gap-3",children:e.links.map(c=>t.jsxs("a",{href:c.href,target:"_blank",rel:"noopener noreferrer",className:"theme-pill-button rounded-lg border px-4 py-2 text-[13px] font-medium transition",children:[c.label," ↗"]},c.label))})]})]})},`overlay-${e.id}`)]})})},ws=({themeMode:e,navInteractionTick:s})=>{const r=je(),[i,a]=l.useState(!0),[n,c]=l.useState(null),[p,d]=l.useState(null),o=Nt.projects,u=Dt();l.useEffect(()=>{const h=window.setTimeout(()=>{a(!1)},900);return()=>window.clearTimeout(h)},[]);const m=l.useCallback((h,x)=>{c(h),d(x)},[]),f=l.useCallback(()=>{c(null),d(null)},[]);return t.jsx(Ut,{backgroundClassName:o.backgroundClassName,footerBackgroundColor:o.footerBackgroundColor,footerRunwayVh:o.footerRunwayVh,children:h=>t.jsxs("div",{...r,className:"relative isolate",children:[t.jsx("div",{className:"pointer-events-none absolute inset-0 z-0","aria-hidden":!0,children:t.jsxs("div",{className:"sticky top-0 h-[100svh]",children:[t.jsx(Gt,{effectId:o.backdropEffectId,quality:o.backdropQuality,interactionMode:o.backdropInteractionMode,styleSeed:o.backdropStyleSeed,className:o.backdropClassName}),o.backdropOverlayClassName?t.jsx("div",{className:o.backdropOverlayClassName}):null]})}),t.jsx(zt,{scrollContainerRef:h,navInteractionTick:s,isTouch:u,navInteractionLockMs:2e3,dismissAllThresholdPx:typeof window>"u"?void 0:window.innerHeight,visitStorageKey:"projects-onboarding-hints-seen"}),t.jsxs("div",{className:"relative z-10",children:[t.jsxs("header",{className:"theme-text-primary relative z-20 mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 pt-24",children:[t.jsx("p",{className:"theme-text-subtle text-sm uppercase tracking-[0.22em]",children:Ue.eyebrow}),t.jsx("h1",{className:"text-3xl font-medium xs:text-4xl sm:text-5xl",children:Ue.title}),t.jsx("p",{className:"theme-text-muted max-w-2xl",children:Ue.summary})]}),t.jsx("div",{className:"relative mt-8",children:t.jsx(ds,{scrollContainer:h,items:ts,onCardSelect:m,forceLowPower:i,themeMode:e})}),t.jsx(ps,{item:n,originPos:p,onClose:f,themeMode:e})]})]})})};export{ws as default};
