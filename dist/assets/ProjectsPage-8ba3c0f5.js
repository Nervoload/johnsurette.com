import{r as d,j as t,C as mt,a as tt,b as qe,u as ee}from"./vendor-react-42df3ce4.js";import{C as xt,p as gt,b as Ge}from"./index-3a6174e4.js";import{r as st,D as yt,p as Mt}from"./projectData-6003ca5a.js";import{a2 as rt,as as wt,t as fe,aK as vt,aL as bt,aa as kt,x as Be,aM as jt,a6 as Qe,g as E,V as q,u as $t,a8 as St,ag as Rt}from"./vendor-three-core-f6c6daec.js";import{S as Pt}from"./SceneBloom-5fddde2b.js";import{d as Oe}from"./vendor-misc-d1160b3c.js";import{d as Ct,a as At,c as Et,e as Lt,A as Tt,m as Ye}from"./vendor-motion-d394c1ae.js";import{P as It}from"./PageScaffold-dfb30050.js";import"./vendor-three-extras-53049b4e.js";const Nt=({progress:e,height:r=200,forceLowPower:s=!1,themeMode:i,children:o})=>{const[n,f]=d.useState(!1),[p,c]=d.useState(!1);d.useEffect(()=>{if(typeof window>"u")return;const l=window.matchMedia("(max-width: 900px)"),h=window.matchMedia("(prefers-reduced-motion: reduce)"),g=()=>{f(l.matches),c(h.matches)};return g(),l.addEventListener?(l.addEventListener("change",g),h.addEventListener("change",g)):(l.addListener(g),h.addListener(g)),()=>{l.removeEventListener?(l.removeEventListener("change",g),h.removeEventListener("change",g)):(l.removeListener(g),h.removeListener(g))}},[]);const a=p||s,u=r,m=d.useMemo(()=>i==="dark"?"#0b1326":"#eef4fb",[i]);return t.jsx("section",{style:{height:`${u}vh`},className:"relative",children:t.jsxs("div",{className:"sticky top-0 h-[100svh] overflow-hidden",children:[t.jsx("div",{className:"theme-project-scene-haze-a pointer-events-none absolute inset-0"}),t.jsx("div",{className:"theme-project-scene-haze-b pointer-events-none absolute inset-0"}),t.jsx(xt,{children:t.jsxs(mt,{className:"absolute inset-0 h-full w-full",camera:{position:[0,.14,6.15],fov:43},dpr:a?[1,1.5]:[1,2],shadows:!1,gl:{preserveDrawingBuffer:!1,antialias:!a,powerPreference:"high-performance",alpha:!0},onCreated:({gl:l})=>{l.outputColorSpace=rt,wt.enabled=!0,l.shadowMap.enabled=!1,l.setClearColor(16777215,0)},children:[t.jsx("fog",{attach:"fog",args:[m,8,24]}),t.jsx("ambientLight",{intensity:.72}),t.jsx("spotLight",{position:[0,5.2,2.6],angle:.56,penumbra:.66,intensity:a?1.45:1.68,distance:26}),t.jsx("directionalLight",{position:[2.8,2.6,2.4],intensity:.45}),t.jsx("directionalLight",{position:[-3.2,1.4,-2.8],intensity:.18}),t.jsx(Pt,{enabled:!a}),t.jsx("group",{scale:1.14,position:[0,.02,0],children:o(e,{lowPowerMode:a,mobileViewport:n})})]})}),t.jsx("div",{className:"theme-project-scene-bottom-fade pointer-events-none absolute inset-x-0 bottom-0 h-36"})]})})},zt=e=>"data:image/svg+xml;utf8,"+encodeURIComponent(e==="dark"?"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'><rect width='720' height='1024' fill='#0f172a'/><rect x='36' y='36' width='648' height='952' rx='28' fill='none' stroke='#334155' stroke-width='8'/></svg>":"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'><rect width='720' height='1024' fill='#f8fafc'/><rect x='36' y='36' width='648' height='952' rx='28' fill='none' stroke='#94a3b8' stroke-width='8'/></svg>"),Dt="data:image/svg+xml;utf8,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#103a8a'/><stop offset='100%' stop-color='#1f5fd8'/></linearGradient></defs><rect width='720' height='1024' fill='url(#g)'/></svg>"),ot=d.forwardRef(({frontSrc:e,backSrc:r,width:s,height:i,thickness:o=.02,borderColor:n="#e0e0e0",edgeColor:f,edgeGlow:p,flip:c,pop:a,popScale:u=1.15,onClick:m,isClickable:l,frontAttachment:h,themeMode:g="light",...C},M)=>{const{viewport:H,gl:N}=tt(),z=Math.min(H.width,H.height),A=s??z*.08,I=i??A*1.4,ne=d.useRef(null),xe=d.useRef(null),P=d.useRef(null),ge=d.useRef(null),ye=d.useRef(null),Me=d.useRef(null),ie=d.useRef(!1);d.useImperativeHandle(M,()=>ne.current,[]);const j=qe(Qe,e??zt(g)),y=qe(Qe,r??Dt),w=d.useMemo(()=>new fe(f??n),[f,n]),L=d.useMemo(()=>{const $=new vt(A+.016,I+.016,o+.012),D=new bt($);return $.dispose(),D},[A,I,o]);d.useMemo(()=>{const $=N.capabilities.getMaxAnisotropy();for(const D of[j,y])D.colorSpace=rt,D.anisotropy=$,D.minFilter=kt,D.needsUpdate=!0},[j,y,N]),ee(()=>{var de,_,te;const $=ne.current;if(!$)return;const D=((de=c==null?void 0:c.get)==null?void 0:de.call(c))??0;$.rotation.y=Math.PI*D;const O=((_=a==null?void 0:a.get)==null?void 0:_.call(a))??0,je=1+(u-1)*O;$.scale.setScalar(je);const U=((te=p==null?void 0:p.get)==null?void 0:te.call(p))??0,we=ie.current?2.15:1,B=E.clamp(U*we,0,1.9),le=xe.current;le&&(le.emissive.setRGB(1,1,1),le.emissiveIntensity=.24+B*.2);const ce=P.current;ce&&(ce.uniforms.uAccentColor.value.copy(w),ce.uniforms.uGlow.value=E.clamp(B*.52,0,1.1));const ve=ge.current;ve&&(ve.opacity=E.clamp(.34+B*.22,.34,.76));const Z=ye.current;Z&&(Z.opacity=E.clamp(B*.64,0,.95),Z.color.copy(w).multiplyScalar(.95+B*2.3),Z.visible=Z.opacity>.01);const V=Me.current;V&&(V.uniforms.uColor.value.copy(w),V.uniforms.uOpacity.value=E.clamp(B*.28,0,.48),V.uniforms.uStrength.value=.85+B*1.7,V.visible=B>.01)}),d.useEffect(()=>()=>{N.domElement.style.cursor="auto"},[N]),d.useEffect(()=>()=>{L.dispose()},[L]);const v=()=>l?l():!0,b=$=>{ie.current=!0,m&&v()?($.stopPropagation(),N.domElement.style.cursor="pointer"):N.domElement.style.cursor="auto"},x=()=>{ie.current=!1,N.domElement.style.cursor="auto"},R=$=>{!m||!v()||($.stopPropagation(),m())};return t.jsxs("group",{ref:ne,...C,children:[t.jsxs("mesh",{renderOrder:2,children:[t.jsx("boxGeometry",{args:[A+.03,I+.03,o+.04]}),t.jsx("shaderMaterial",{ref:Me,uniforms:{uColor:{value:w.clone()},uOpacity:{value:0},uStrength:{value:.7}},vertexShader:`
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
            `,blending:Be,transparent:!0,depthWrite:!1,depthTest:!0,side:jt,toneMapped:!1})]}),t.jsx("lineSegments",{geometry:L,renderOrder:3,children:t.jsx("lineBasicMaterial",{ref:ye,color:w,transparent:!0,opacity:0,blending:Be,depthWrite:!1,toneMapped:!1})}),t.jsxs("mesh",{castShadow:!0,children:[t.jsx("boxGeometry",{args:[A,I,o]}),t.jsx("meshStandardMaterial",{color:n,metalness:.08,roughness:.52})]}),t.jsxs("mesh",{position:[0,0,o/2+1e-4],onPointerOver:b,onPointerOut:x,onClick:R,children:[t.jsx("planeGeometry",{args:[A,I]}),t.jsx("meshStandardMaterial",{ref:xe,map:j,roughness:.3,metalness:0,emissive:"#ffffff",emissiveMap:j,emissiveIntensity:.34,toneMapped:!1})]}),t.jsxs("mesh",{position:[0,0,o/2+18e-5],renderOrder:5,children:[t.jsx("planeGeometry",{args:[A,I]}),t.jsx("shaderMaterial",{ref:P,uniforms:{uMap:{value:j},uAccentColor:{value:w.clone()},uGlow:{value:0}},vertexShader:`
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
            `,blending:Be,transparent:!0,depthWrite:!1,depthTest:!0,toneMapped:!1})]}),t.jsxs("mesh",{position:[0,0,o/2+26e-5],renderOrder:6,children:[t.jsx("planeGeometry",{args:[A,I]}),t.jsx("meshBasicMaterial",{ref:ge,map:j,transparent:!0,opacity:.34,depthWrite:!1,toneMapped:!1})]}),h?t.jsx("group",{position:[0,0,o/2+.0015],children:h}):null,t.jsxs("mesh",{"rotation-y":Math.PI,position:[0,0,-o/2-1e-4],children:[t.jsx("planeGeometry",{args:[A,I]}),t.jsx("meshStandardMaterial",{map:y,roughness:.28,metalness:0,emissive:"#ffffff",emissiveMap:y,emissiveIntensity:.4,toneMapped:!1})]})]})});ot.displayName="Card3D";const pe=e=>Math.min(1,Math.max(0,e)),he=e=>typeof e=="number"?e:e.get(),F=()=>{},ue=.08,me=(e,r)=>d.useMemo(()=>({accent:new fe(e),deep:new fe(r.deep),mid:new fe(r.mid),bright:new fe(r.bright)}),[e,r.deep,r.mid,r.bright]),Gt=({reveal:e,intensity:r,accent:s,palette:i})=>{const o=d.useRef(null),n=d.useRef([]),f=me(s,i);return ee(({clock:p})=>{const c=o.current;if(!c)return;const a=pe(he(e)),u=a>ue;if(c.visible=u,!u)return;const m=p.elapsedTime,l=(.7+a*.6)*(.9+r*.12);c.scale.setScalar(l),c.rotation.y=m*.55,c.rotation.x=Math.sin(m*.7)*.12,c.position.z=.1+a*.5,c.position.y=.02+Math.sin(m*1.2)*.04;const h=.44+a*.26;n.current.forEach((g,C)=>{if(!g)return;const M=m*(1.8+C*.22)+C*(Math.PI*.66);g.position.set(Math.cos(M)*h,Math.sin(M*1.08)*h*.58,Math.sin(M*.72)*.22)})}),t.jsxs("group",{ref:o,position:[0,.04,.2],children:[t.jsxs("mesh",{raycast:F,children:[t.jsx("icosahedronGeometry",{args:[.19,2]}),t.jsx("meshStandardMaterial",{color:f.mid,emissive:f.accent,emissiveIntensity:.56,metalness:.1,roughness:.38,toneMapped:!1})]}),t.jsxs("mesh",{rotation:[Math.PI/2,0,0],raycast:F,children:[t.jsx("torusGeometry",{args:[.55,.03,18,84]}),t.jsx("meshStandardMaterial",{color:f.accent,emissive:f.accent,emissiveIntensity:.72,transparent:!0,opacity:.88,metalness:.05,roughness:.42,toneMapped:!1})]}),Array.from({length:4}).map((p,c)=>t.jsxs("mesh",{raycast:F,ref:a=>{n.current[c]=a},children:[t.jsx("sphereGeometry",{args:[.07,16,16]}),t.jsx("meshStandardMaterial",{color:f.bright,emissive:f.accent,emissiveIntensity:.9,toneMapped:!1})]},`orbital-satellite-${c}`))]})},Bt=({reveal:e,intensity:r,accent:s,palette:i})=>{const o=d.useRef(null),n=d.useRef([]),f=me(s,i),p=d.useMemo(()=>[-.48,-.32,-.16,0,.16,.32,.48],[]);return ee(({clock:c})=>{const a=o.current;if(!a)return;const u=pe(he(e)),m=u>ue;if(a.visible=m,!m)return;const l=c.elapsedTime;a.scale.setScalar(.7+u*.52),a.position.z=.08+u*.44,a.rotation.y=Math.sin(l*.82)*.09,a.rotation.x=-.12+Math.sin(l*.56)*.06,n.current.forEach((h,g)=>{if(!h)return;const M=.54+(.28+.72*(.5+.5*Math.sin(l*2.8+g*.66)))*(.85+r*.28);h.scale.y=M,h.position.y=-.08+M*.18,h.position.z=Math.sin(l*1.2+g)*.05})}),t.jsx("group",{ref:o,position:[0,-.04,.14],children:p.map((c,a)=>t.jsxs("mesh",{raycast:F,ref:u=>{n.current[a]=u},position:[c,0,0],children:[t.jsx("boxGeometry",{args:[.09,.36,.09]}),t.jsx("meshStandardMaterial",{color:a%2===0?f.mid:f.accent,emissive:f.accent,emissiveIntensity:.64,metalness:.08,roughness:.34,toneMapped:!1})]},`spine-${a}`))})},Ot=({reveal:e,intensity:r,accent:s,palette:i})=>{const o=d.useRef(null),n=me(s,i),f=d.useMemo(()=>[new q(-.42,.08,0),new q(-.16,.28,.14),new q(.18,.2,-.08),new q(.44,.04,.04),new q(-.08,-.2,.1),new q(.28,-.26,-.03)],[]),p=d.useMemo(()=>{const c=[[0,1],[1,2],[2,3],[1,4],[4,5],[2,5],[0,4]],a=new Float32Array(c.length*6);c.forEach(([m,l],h)=>{a[h*6]=f[m].x,a[h*6+1]=f[m].y,a[h*6+2]=f[m].z,a[h*6+3]=f[l].x,a[h*6+4]=f[l].y,a[h*6+5]=f[l].z});const u=new $t;return u.setAttribute("position",new St(a,3)),u},[f]);return d.useEffect(()=>()=>{p.dispose()},[p]),ee(({clock:c})=>{const a=o.current;if(!a)return;const u=pe(he(e)),m=u>ue;if(a.visible=m,!m)return;const l=c.elapsedTime;a.scale.setScalar((.7+u*.64)*(.95+r*.1)),a.rotation.y=l*.42,a.rotation.x=Math.sin(l*.72)*.08,a.position.z=.14+u*.46,a.position.y=Math.sin(l*1.1)*.03}),t.jsxs("group",{ref:o,position:[0,0,.2],children:[t.jsx("lineSegments",{geometry:p,raycast:F,children:t.jsx("lineBasicMaterial",{color:n.accent,transparent:!0,opacity:.72,toneMapped:!1})}),f.map((c,a)=>t.jsxs("mesh",{position:[c.x,c.y,c.z],raycast:F,children:[t.jsx("sphereGeometry",{args:[.06+a%2*.012,16,16]}),t.jsx("meshStandardMaterial",{color:a%2===0?n.bright:n.mid,emissive:n.accent,emissiveIntensity:.74,toneMapped:!1})]},`node-${a}`))]})},Yt=({reveal:e,intensity:r,accent:s,palette:i})=>{const o=d.useRef(null),n=me(s,i);return ee(({clock:f})=>{const p=o.current;if(!p)return;const c=pe(he(e)),a=c>ue;if(p.visible=a,!a)return;const u=f.elapsedTime;p.scale.setScalar((.72+c*.58)*(.96+r*.08)),p.rotation.z=Math.sin(u*.62)*.16,p.rotation.y=u*.52,p.position.z=.12+c*.48,p.position.y=-.03+Math.sin(u*1.5)*.04}),t.jsxs("group",{ref:o,position:[0,-.02,.2],children:[t.jsxs("mesh",{raycast:F,children:[t.jsx("torusKnotGeometry",{args:[.34,.07,140,18,2,3]}),t.jsx("meshStandardMaterial",{color:n.mid,emissive:n.accent,emissiveIntensity:.82,metalness:.22,roughness:.32,toneMapped:!1})]}),t.jsxs("mesh",{rotation:[Math.PI/2,0,0],raycast:F,children:[t.jsx("ringGeometry",{args:[.46,.56,64]}),t.jsx("meshBasicMaterial",{color:n.accent,transparent:!0,opacity:.28,toneMapped:!1,side:Rt})]})]})},Ft=({reveal:e,intensity:r,accent:s,palette:i})=>{const o=d.useRef(null),n=d.useRef([]),f=me(s,i),p=d.useMemo(()=>{const c=[];for(let u=0;u<3;u+=1)for(let m=0;m<3;m+=1)c.push([(m-1)*.22,(u-1)*.22*.78,0]);return c},[]);return ee(({clock:c})=>{const a=o.current;if(!a)return;const u=pe(he(e)),m=u>ue;if(a.visible=m,!m)return;const l=c.elapsedTime;a.scale.setScalar((.78+u*.55)*(.93+r*.12)),a.rotation.y=Math.sin(l*.72)*.2,a.position.z=.12+u*.45,a.position.y=-.02+Math.sin(l*1.24)*.03,n.current.forEach((h,g)=>{if(!h)return;const M=.44+(.35+.65*(.5+.5*Math.sin(l*2.4+g*.44)))*(.72+r*.34);h.scale.y=M,h.position.z=Math.sin(l*1.1+g*.22)*.04,h.position.y=p[g][1]-.12+M*.12})}),t.jsx("group",{ref:o,position:[0,.04,.2],children:p.map(([c,a,u],m)=>t.jsxs("mesh",{raycast:F,ref:l=>{n.current[m]=l},position:[c,a,u],children:[t.jsx("cylinderGeometry",{args:[.045,.045,.28,14]}),t.jsx("meshStandardMaterial",{color:m%2===0?f.mid:f.bright,emissive:f.accent,emissiveIntensity:.66,roughness:.32,metalness:.18,toneMapped:!1})]},`pillar-${m}`))})},Ht=e=>{switch(e.preset){case"orbitalCore":return t.jsx(Gt,{...e});case"dataSpines":return t.jsx(Bt,{...e});case"nodeConstellation":return t.jsx(Ot,{...e});case"ribbonArc":return t.jsx(Yt,{...e});case"pillarArray":return t.jsx(Ft,{...e});default:return null}},Vt=(e,r,s)=>{const{palette:i,accent:o}=e,n={atlas:i.line,signal:o,forge:i.bright,lattice:i.mid};return r==="dark"?{bgStart:i.deep,bgEnd:i.mid,portal:n[s],trim:i.line,text:i.bright,muted:i.line,chip:i.deep,chipText:i.bright}:{bgStart:i.bright,bgEnd:i.line,portal:n[s],trim:o,text:i.deep,muted:i.mid,chip:"#ffffff",chipText:i.deep}},Ut={light:{Active:{bg:"#dcfce7",fg:"#166534"},"In Progress":{bg:"#e0f2fe",fg:"#0c4a6e"},Paused:{bg:"#ffedd5",fg:"#9a3412"},Archived:{bg:"#e2e8f0",fg:"#334155"}},dark:{Active:{bg:"#14532d",fg:"#bbf7d0"},"In Progress":{bg:"#0c4a6e",fg:"#bae6fd"},Paused:{bg:"#7c2d12",fg:"#fed7aa"},Archived:{bg:"#334155",fg:"#cbd5e1"}}},Fe=1024,He=720,Ve=720,Ue=1024,Q=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&apos;"),Ze=(e,r,s)=>{const i=e.trim().split(/\s+/).filter(Boolean);if(!i.length)return[""];const o=[];let n="";for(const c of i){const a=n?`${n} ${c}`:c;if(a.length<=r){n=a;continue}if(n&&o.push(n),n=c,o.length===s)break}o.length<s&&n&&o.push(n),o.length>s&&(o.length=s);const f=i.join(" "),p=o.join(" ");if(f.length>p.length){const c=o.length-1;o[c]=`${o[c].replace(/\.{3}$/,"").trim()}...`}return o},Zt=e=>{const r=e.trim().split(/\s+/).filter(Boolean);return r.length?r.length===1?r[0].slice(0,2).toUpperCase():`${r[0][0]}${r[1][0]}`.toUpperCase():"PR"},re=(e,r,s)=>e.map((i,o)=>`<tspan x='${r}' dy='${o===0?0:s}'>${Q(i)}</tspan>`).join(""),_t=(e,r,s="landscape",i="light")=>{const o=st(e),n=Vt(e,i,o.frontFamily),f=Ut[i][o.status],p=Ze(e.title,24,2),c=Ze(e.subtitle,26,2),a=Ze(e.summary,40,2),u=Zt(e.title),m=Math.min(280,38+o.status.length*9),l=Math.min(184,36+o.dateLabel.length*9),h=s==="landscape",g=h?Fe:Ve,C=h?He:Ue,M=h?512:360,H=h?360:512,N=h?260:250,z=h?`
  <g transform='translate(720 0) rotate(90)'>
    <rect width='${Fe}' height='${He}' fill='url(#bg)'/>
    <rect width='${Fe}' height='${He}' fill='url(#grid)'/>

    <rect x='20' y='20' width='984' height='680' rx='34' fill='none' stroke='${n.trim}' stroke-opacity='0.34' stroke-width='9'/>
    <rect x='20' y='20' width='984' height='680' rx='34' fill='none' stroke='${e.accent}' stroke-opacity='0.72' stroke-width='4.8'/>
    <rect x='44' y='44' width='936' height='632' rx='28' fill='none' stroke='${n.trim}' stroke-opacity='0.28' stroke-width='2.2'/>

    <ellipse cx='512' cy='360' rx='228' ry='148' fill='url(#portalGlow)'/>
    <circle cx='512' cy='360' r='108' fill='none' stroke='${e.accent}' stroke-opacity='0.44' stroke-width='4'/>
    <circle cx='512' cy='360' r='68' fill='none' stroke='${n.trim}' stroke-opacity='0.42' stroke-width='3'/>

    <path d='M84 86 H150 M84 86 V152 M940 86 H874 M940 86 V152 M84 634 H150 M84 634 V568 M940 634 H874 M940 634 V568' stroke='${e.accent}' stroke-opacity='0.62' stroke-width='2.2' stroke-linecap='round' fill='none'/>

    <text x='84' y='122' fill='${n.text}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='54' font-weight='700'>
      ${re(p,84,60)}
    </text>

    <g transform='translate(852 74)'>
      <rect width='96' height='96' rx='24' fill='${n.chip}'/>
      <rect x='1.5' y='1.5' width='93' height='93' rx='22.5' fill='none' stroke='${e.accent}' stroke-opacity='0.54'/>
      <text x='48' y='58' text-anchor='middle' fill='${n.chipText}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='33' font-weight='700'>${Q(u)}</text>
    </g>

    <g transform='translate(84 588)'>
      <rect x='0' y='0' width='${l}' height='44' rx='22' fill='${n.chip}'/>
      <text x='18' y='29' fill='${n.muted}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='18' font-weight='600'>${Q(o.dateLabel)}</text>

      <rect x='${l+12}' y='0' width='${m}' height='44' rx='22' fill='${f.bg}'/>
      <text x='${l+30}' y='29' fill='${f.fg}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='18' font-weight='700'>${Q(o.status)}</text>
    </g>

    <g transform='translate(938 520)'>
      <text x='0' y='0' text-anchor='end' fill='${n.muted}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='29' font-weight='600'>
        ${re(c,0,34)}
      </text>
      <text x='0' y='86' text-anchor='end' fill='${n.text}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='22' font-weight='500' opacity='0.92'>
        ${re(a,0,28)}
      </text>
    </g>

    <path d='M98 440 H262' stroke='${e.accent}' stroke-opacity='0.5' stroke-width='3'/>
    <path d='M760 440 H924' stroke='${e.accent}' stroke-opacity='0.38' stroke-width='3'/>
  </g>`:`
  <g>
    <rect width='${Ve}' height='${Ue}' fill='url(#bg)'/>
    <rect width='${Ve}' height='${Ue}' fill='url(#grid)'/>

    <rect x='20' y='20' width='680' height='984' rx='34' fill='none' stroke='${n.trim}' stroke-opacity='0.34' stroke-width='9'/>
    <rect x='20' y='20' width='680' height='984' rx='34' fill='none' stroke='${e.accent}' stroke-opacity='0.72' stroke-width='4.8'/>
    <rect x='44' y='44' width='632' height='936' rx='28' fill='none' stroke='${n.trim}' stroke-opacity='0.28' stroke-width='2.2'/>

    <ellipse cx='360' cy='512' rx='206' ry='142' fill='url(#portalGlow)'/>
    <circle cx='360' cy='512' r='108' fill='none' stroke='${e.accent}' stroke-opacity='0.44' stroke-width='4'/>
    <circle cx='360' cy='512' r='68' fill='none' stroke='${n.trim}' stroke-opacity='0.42' stroke-width='3'/>

    <path d='M84 130 H150 M84 130 V196 M636 130 H570 M636 130 V196 M84 894 H150 M84 894 V828 M636 894 H570 M636 894 V828' stroke='${e.accent}' stroke-opacity='0.62' stroke-width='2.2' stroke-linecap='round' fill='none'/>

    <text x='84' y='144' fill='${n.text}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='52' font-weight='700'>
      ${re(p,84,58)}
    </text>

    <g transform='translate(584 84)'>
      <rect width='96' height='96' rx='24' fill='${n.chip}'/>
      <rect x='1.5' y='1.5' width='93' height='93' rx='22.5' fill='none' stroke='${e.accent}' stroke-opacity='0.54'/>
      <text x='48' y='58' text-anchor='middle' fill='${n.chipText}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='33' font-weight='700'>${Q(u)}</text>
    </g>

    <g transform='translate(84 812)'>
      <rect x='0' y='0' width='${l}' height='44' rx='22' fill='${n.chip}'/>
      <text x='18' y='29' fill='${n.muted}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='18' font-weight='600'>${Q(o.dateLabel)}</text>

      <rect x='${l+12}' y='0' width='${m}' height='44' rx='22' fill='${f.bg}'/>
      <text x='${l+30}' y='29' fill='${f.fg}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='18' font-weight='700'>${Q(o.status)}</text>
    </g>

    <g transform='translate(636 702)'>
      <text x='0' y='0' text-anchor='end' fill='${n.muted}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='27' font-weight='600'>
        ${re(c,0,32)}
      </text>
      <text x='0' y='80' text-anchor='end' fill='${n.text}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='21' font-weight='500' opacity='0.92'>
        ${re(a,0,27)}
      </text>
    </g>

    <path d='M98 644 H262' stroke='${e.accent}' stroke-opacity='0.5' stroke-width='3'/>
    <path d='M458 644 H622' stroke='${e.accent}' stroke-opacity='0.38' stroke-width='3'/>
  </g>`,A=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='${g}' y2='${C}' gradientUnits='userSpaceOnUse'>
      <stop offset='0%' stop-color='${n.bgStart}'/>
      <stop offset='100%' stop-color='${n.bgEnd}'/>
    </linearGradient>
    <radialGradient id='portalGlow' cx='${M}' cy='${H}' r='${N}' gradientUnits='userSpaceOnUse'>
      <stop offset='0%' stop-color='${n.portal}' stop-opacity='0.56'/>
      <stop offset='100%' stop-color='${n.portal}' stop-opacity='0'/>
    </radialGradient>
    <pattern id='grid' width='32' height='32' patternUnits='userSpaceOnUse' patternTransform='rotate(${r*11})'>
      <path d='M16 0V32 M0 16H32' stroke='${n.trim}' stroke-opacity='0.08' stroke-width='1'/>
    </pattern>
  </defs>

  ${z}
</svg>`;return`data:image/svg+xml;utf8,${encodeURIComponent(A)}`},Xt=(e,r)=>{const s=e.palette,i=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${s.deep}'/>
      <stop offset='100%' stop-color='${s.mid}'/>
    </linearGradient>
    <linearGradient id='backTrim' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${s.line}' stop-opacity='0.9'/>
      <stop offset='50%' stop-color='${s.bright}' stop-opacity='0.82'/>
      <stop offset='100%' stop-color='${s.line}' stop-opacity='0.88'/>
    </linearGradient>
    <radialGradient id='coreGlow' cx='50%' cy='50%' r='40%'>
      <stop offset='0%' stop-color='${s.bright}' stop-opacity='0.28'/>
      <stop offset='100%' stop-color='${s.bright}' stop-opacity='0'/>
    </radialGradient>
    <pattern id='grid' width='28' height='28' patternUnits='userSpaceOnUse' patternTransform='rotate(${r*9})'>
      <path d='M14 0 V28 M0 14 H28' stroke='${s.line}' stroke-opacity='0.13' stroke-width='1'/>
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
  <rect x='28' y='28' width='664' height='968' rx='28' fill='none' stroke='${s.line}' stroke-width='10' stroke-opacity='0.28'/>
  <rect x='28' y='28' width='664' height='968' rx='28' fill='none' stroke='url(#backTrim)' stroke-width='6.5' stroke-opacity='0.8'/>
  <rect x='58' y='58' width='604' height='908' rx='24' fill='none' stroke='${s.bright}' stroke-width='3.1' stroke-opacity='0.54'/>
  <path d='M102 140 H162 M102 140 V200 M618 140 H558 M618 140 V200 M102 884 H162 M102 884 V824 M618 884 H558 M618 884 V824' stroke='${s.bright}' stroke-width='2.4' stroke-linecap='round' stroke-opacity='0.58' fill='none'/>
  <g transform='translate(360 512) rotate(${r*14})'>
    <circle r='176' fill='none' stroke='${s.bright}' stroke-width='14' stroke-opacity='0.28'/>
    <circle r='132' fill='none' stroke='${s.line}' stroke-width='5' stroke-opacity='0.62'/>
    <circle r='88' fill='none' stroke='${s.bright}' stroke-width='3.4' stroke-opacity='0.78'/>
    <path d='M0-120 L20-30 L110 0 L20 30 L0 120 L-20 30 L-110 0 L-20 -30 Z' fill='${s.line}' fill-opacity='0.42'/>
    <circle r='20' fill='${s.bright}' fill-opacity='0.82'/>
  </g>
  <g transform='translate(360 512)' opacity='0.38'>
    <path d='M-250 -320 C-180 -220 -140 -120 -110 -20 C-70 120 -120 230 -220 320' stroke='${s.line}' stroke-width='2' fill='none'/>
    <path d='M250 320 C180 220 140 120 110 20 C70 -120 120 -230 220 -320' stroke='${s.line}' stroke-width='2' fill='none'/>
  </g>
  <path d='M114 122 C228 96 492 96 606 122' stroke='${s.bright}' stroke-opacity='0.36' stroke-width='2.3' fill='none'/>
  <path d='M128 902 C246 926 474 926 592 902' stroke='${s.bright}' stroke-opacity='0.34' stroke-width='2.2' fill='none'/>
  <rect width='720' height='1024' filter='url(#grain)'/>
</svg>`;return`data:image/svg+xml;utf8,${encodeURIComponent(i)}`},Wt=e=>{if(e<=0)return[];const r=Array.from({length:e},(i,o)=>o);let s=e*131+17;for(let i=r.length-1;i>0;i-=1){s=s*1664525+1013904223>>>0;const o=s%(i+1);[r[i],r[o]]=[r[o],r[i]]}return r},J=e=>Math.min(1,Math.max(0,e)),oe=e=>1-Math.pow(1-e,3),ae=e=>e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2,G=(e,r,s)=>J((e-r)/(s-r)),T=(e,r,s)=>E.lerp(e,r,s),Kt=(e,r)=>{const s=Math.max(0,e-4);return{dealStart:.64,dealEnd:r?Math.min(.91,.88+s*.025):Math.min(.92,.84+s*.03),flipStart:r?Math.max(.7,.72-s*.01):Math.max(.74,.78-s*.01),flipEnd:r?Math.min(.94,.86+s*.03):.98,browseStart:r?Math.min(.92,.86+s*.025):Math.min(.97,.95+s*.015),dealDelaySpan:Math.min(.5,.32+s*.045),flipDelaySpan:Math.min(.52,.35+s*.05)}},Je=(e,r,s)=>s?{width:e,height:r,cardSpacing:r*.44,ringRx:e*.17,ringRy:r*.13,exitDropMax:r*.34,dealEntryY:r*.48,browseParallaxX:.07,browseParallaxY:.045,dealScaleMax:2.08,dealArcMax:.2,stackDepthStep:.0085,flipArcZMax:.5,flipArcYMax:.06}:{width:e,height:r,cardSpacing:r*.56,ringRx:e*.24,ringRy:r*.18,exitDropMax:r*.48,dealEntryY:r*.6,browseParallaxX:.16,browseParallaxY:.08,dealScaleMax:2.2,dealArcMax:.3,stackDepthStep:.008,flipArcZMax:.7,flipArcYMax:.12},qt=({progress:e,items:r,onCardSelect:s,lowPowerMode:i=!1,mobileViewport:o=!1,themeMode:n})=>{const{viewport:f,pointer:p,camera:c,gl:a}=tt(),u=d.useRef([]),m=d.useRef(null),l=d.useRef([]),h=d.useRef([]),g=d.useRef([]),C=d.useRef(Je(f.width,f.height,o)),M=d.useRef(!1),H=d.useMemo(()=>r.map(j=>st(j)),[r]),z=Math.min(f.width,f.height)*(o?.228:.198),A=z*1.46,I=o?"portrait":"landscape",ne=E.clamp(z*.58,o?.34:.42,o?.56:.72),xe=o?0:-Math.PI/2,P=r.length,ge=d.useMemo(()=>r.map((j,y)=>({frontSrc:_t(j,y+1,I,n),backSrc:Xt(j,y+1),borderColor:n==="dark"?"#172036":"#f8fafc",edgeColor:j.accent,themeMode:n,width:z,height:A})),[r,A,z,I,n]),ye=d.useMemo(()=>Wt(P),[P]);l.current.length!==P&&(l.current=Array.from({length:P},()=>Oe(0))),h.current.length!==P&&(h.current=Array.from({length:P},()=>Oe(0))),g.current.length!==P&&(g.current=Array.from({length:P},()=>Oe(0)));const Me=d.useMemo(()=>r.map((j,y)=>({x:(y%2===0?-1:1)*(.46+y*.08),y:(y%3-1)*.2,lift:.12+y*.014})),[r]),ie=j=>{if(!M.current)return;const y=r[j],w=u.current[j];if(!y||!w)return;const L=new q;w.getWorldPosition(L);const v=L.clone().project(c),b=a.domElement.getBoundingClientRect(),x=b.left+(v.x*.5+.5)*b.width,R=b.top+(-v.y*.5+.5)*b.height;s==null||s(y,{x,y:R})};return ee((j,y)=>{const w=m.current;if(!w)return;const L=j.clock.getElapsedTime(),v=J(e.get()),b=Je(f.width,f.height,o),x=C.current,R=1-Math.exp(-Math.min(y,.2)*10),$=Kt(P,o);x.width=T(x.width,b.width,R),x.height=T(x.height,b.height,R),x.cardSpacing=T(x.cardSpacing,b.cardSpacing,R),x.ringRx=T(x.ringRx,b.ringRx,R),x.ringRy=T(x.ringRy,b.ringRy,R),x.exitDropMax=T(x.exitDropMax,b.exitDropMax,R),x.dealEntryY=T(x.dealEntryY,b.dealEntryY,R),x.browseParallaxX=T(x.browseParallaxX,b.browseParallaxX,R),x.browseParallaxY=T(x.browseParallaxY,b.browseParallaxY,R),x.dealScaleMax=T(x.dealScaleMax,b.dealScaleMax,R),x.dealArcMax=T(x.dealArcMax,b.dealArcMax,R),x.stackDepthStep=T(x.stackDepthStep,b.stackDepthStep,R),x.flipArcZMax=T(x.flipArcZMax,b.flipArcZMax,R),x.flipArcYMax=T(x.flipArcYMax,b.flipArcYMax,R);const D=oe(G(v,0,o?.3:.26)),O=oe(G(v,.18,.36)),je=oe(G(v,.32,.48)),U=ae(G(v,.44,.58)),we=G(v,$.dealStart,$.dealEnd),B=G(v,$.flipStart,$.flipEnd),le=ae(G(v,$.browseStart,1)),ce=ae(G(v,.62,.78)),ve=.56*ae(G(v,.88,1)),Z=J(Math.max(ce,ve)),V=v>.64;M.current=v>(o?.95:.9);const de=D*(1-O),_=1-oe(G(v,.56,.72)),te=p.x,$e=p.y,at=Math.PI*.24*de,nt=-Math.PI*.035*de,Xe=V?o?.008:.012:0;w.rotation.x=(at+$e*.03)*_+$e*Xe,w.rotation.y=(nt+te*.05)*_+te*Xe;const We=x.cardSpacing,it=(P-1)*We,lt=le*it;w.position.x=te*x.browseParallaxX*_,w.position.y=$e*x.browseParallaxY*_+lt;const ct=x.ringRx,dt=x.ringRy,ft=(je*.3+U*.48)*Math.PI*2;for(let k=0;k<P;k++){const S=u.current[k];if(!S)continue;const Se=P>1?k/(P-1):0;if(h.current[k].set(Z),V){const se=Se*$.dealDelaySpan,Y=ae(J((we-se)/Math.max(.01,1-se*.55))),X=oe(G(we,.82,1)),Re=x.dealEntryY,be=-k*We,Pe=E.lerp(Re,be,Y),Ce=Math.sin(Y*Math.PI)*x.dealArcMax,Ae=-k*x.stackDepthStep;S.position.x=0,S.position.y=E.lerp(Pe,be,X),S.position.z=E.lerp(Ce,Ae,X);const Ee=o?0:Math.PI/2,W=Ee*Y;S.rotation.x=0;const Le=(1-Y)*((k%2===0?-1:1)*.08),Te=W+Le;S.rotation.z=E.lerp(Te,Ee,X);const ke=Se*$.flipDelaySpan,K=ae(J((B-ke)/Math.max(.01,1-ke*.45))),Ie=Math.sin(K*Math.PI)*x.flipArcZMax,Ne=Math.sin(K*Math.PI)*x.flipArcYMax;S.position.z+=Ie,S.position.y+=Ne,l.current[k].set(1-K);const ze=J((K-.08)/.92);g.current[k].set(ze),Y>.98&&K>.98&&(S.position.y+=Math.sin(L*1.1+k*1.3)*.01,S.position.z+=Math.cos(L*.9+k*.7)*.005),S.rotation.y=0;const De=E.lerp(1,x.dealScaleMax,Y);S.scale.setScalar(De)}else{const se=Me[k],Y=oe(J((D-Se*.44)/.56)),X=Math.sin(Y*Math.PI),Re=-k*.05,be=-(ye[k]??k)*.055,Pe=se.x*X,Ce=se.y*X,Ae=E.lerp(Re,be,Y)+se.lift*X,W=k/P*Math.PI*2+ft,Le=Math.sin(W)*ct,Te=Math.cos(W)*dt+.05,ke=-.06+Math.sin(W*2)*.012,K=E.lerp(Pe,Le,O),Ie=E.lerp(Ce,Te,O),Ne=E.lerp(Ae,ke,O),ze=x.exitDropMax*U,De=Math.sin(W*1.1)*.06*U,Ke=.01+O*.022,pt=Math.sin(L*1.65+k*.82)*Ke,ht=Math.cos(L*1.2+k*.58)*Ke*.45;S.position.x=K+De,S.position.y=Ie-ze+pt,S.position.z=Ne-.16*U+ht,S.rotation.x=0,S.rotation.y=0,S.rotation.z=W*(o?.08:.1)*O,l.current[k].set(1),g.current[k].set(0);const ut=1+.1*O-.12*U;S.scale.setScalar(ut)}}}),t.jsx("group",{ref:m,children:ge.map((j,y)=>{const w=r[y],L=H[y];return t.jsx("group",{ref:v=>{v&&(u.current[y]=v)},position:[0,0,-y*.05],children:t.jsx(ot,{...j,flip:l.current[y],edgeGlow:h.current[y],frontAttachment:!i&&w&&L?t.jsx("group",{rotation:[0,0,xe],scale:ne,children:t.jsx(Ht,{preset:L.popoutPreset,accent:w.accent,palette:w.palette,reveal:g.current[y],intensity:L.popoutIntensity*.84})}):void 0,isClickable:()=>M.current,onClick:()=>ie(y)})},(w==null?void 0:w.id)??`card-${y}`)})})},_e=e=>Math.min(1,Math.max(0,e)),Qt=e=>560+Math.max(0,e-4)*110,et=(e,r)=>{const s=_e(e),i=Math.max(0,r-4),o=Math.min(.67,.62+i*.03),n=Math.min(.84,.76+i*.04),f=Math.min(.9,.76+i*.05),p=Math.max(.08,1-f);return s<=.12?s:s<=.3?.12+(s-.12)/.18*.3:s<=.46?.42+(s-.3)/.16*.26:s<=o?.68+(s-.46)/(o-.46)*.16:s<=n?.84+(s-o)/(n-o)*.12:s<=f?.96:.96+(s-f)/p*.04},Jt=({scrollContainer:e,items:r,onCardSelect:s,forceLowPower:i=!1,themeMode:o})=>{const n=d.useRef(null),f=d.useRef(0),p=d.useRef(0),c=Qt(r.length),a=Ct(0),{scrollYProgress:u}=At({container:e,target:n,offset:["start start","end end"],layoutEffect:!1});Et(u,"change",l=>{f.current=l});const m=d.useCallback(()=>{const l=_e(u.get());f.current=l,a.set(et(l,r.length)),p.current=3},[r.length,u,a]);return d.useEffect(()=>{m()},[m]),d.useEffect(()=>{if(typeof window>"u")return;const l=()=>{m()},h=typeof ResizeObserver<"u"?new ResizeObserver(()=>{l()}):null,g=n.current,C=e.current;h&&(g&&h.observe(g),C&&h.observe(C)),window.addEventListener("resize",l);const M=window.visualViewport;return M==null||M.addEventListener("resize",l),()=>{h==null||h.disconnect(),window.removeEventListener("resize",l),M==null||M.removeEventListener("resize",l)}},[e,m]),Lt((l,h)=>{const g=et(f.current,r.length),C=a.get();if(p.current>0){a.set(g),p.current-=1;return}const M=g<.68,H=g<.96,N=(M?34e-5:H?5e-4:9e-4)*h,z=g-C,A=Math.sign(z)*Math.min(Math.abs(z),N),I=_e(C+A);a.set(I)}),t.jsx("div",{ref:n,children:t.jsx(Nt,{progress:a,height:c,forceLowPower:i,themeMode:o,children:(l,h)=>t.jsx(qt,{progress:l,items:r,onCardSelect:s,lowPowerMode:h.lowPowerMode,mobileViewport:h.mobileViewport,themeMode:o})})})},es=({item:e,originPos:r,onClose:s})=>(d.useEffect(()=>{if(!e)return;const i=o=>{o.key==="Escape"&&s()};return window.addEventListener("keydown",i),()=>window.removeEventListener("keydown",i)},[e,s]),t.jsx(Tt,{children:e&&r&&t.jsxs(t.Fragment,{children:[t.jsx(Ye.div,{className:"theme-overlay-backdrop fixed inset-0 z-[90]",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.28},onClick:s},"overlay-backdrop"),t.jsx(Ye.div,{className:"fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-8",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:s,children:t.jsxs(Ye.div,{className:"theme-overlay-panel relative max-h-[82vh] w-full max-w-[720px] overflow-y-auto rounded-3xl border backdrop-blur-xl",initial:{scale:.25,x:r.x-window.innerWidth/2,y:r.y-window.innerHeight/2,opacity:0},animate:{scale:1,x:0,y:0,opacity:1},exit:{scale:.85,opacity:0},transition:{type:"spring",damping:28,stiffness:260},onClick:i=>i.stopPropagation(),children:[t.jsx("div",{className:"h-1.5 rounded-t-3xl",style:{background:e.accent}}),t.jsxs("div",{className:"p-6 sm:p-8",children:[t.jsx("button",{onClick:s,className:"theme-overlay-close absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full transition","aria-label":"Close",children:t.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:t.jsx("path",{d:"M4 4l8 8M12 4l-8 8",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})})}),t.jsx("p",{className:"theme-text-subtle text-[11px] uppercase tracking-[0.24em]",children:e.subtitle}),t.jsx("h3",{className:"mt-2 text-[28px] font-medium leading-tight sm:text-[36px]",style:{color:e.accent},children:e.title}),t.jsx("p",{className:"theme-text-muted mt-4 text-[15px] leading-relaxed",children:e.summary}),t.jsx("p",{className:"theme-text-primary mt-3 text-[14px] leading-relaxed",children:e.details}),t.jsx("div",{className:"mt-5 flex flex-wrap gap-2",children:e.tags.map(i=>t.jsx("span",{className:"theme-chip-subtle rounded-full px-3 py-1 text-[11px] font-medium",children:i},i))}),e.media.length>0&&t.jsx("div",{className:"mt-5 grid gap-3 sm:grid-cols-2",children:e.media.map((i,o)=>t.jsx("div",{className:"theme-media-frame overflow-hidden rounded-2xl border",children:t.jsx("img",{src:i,alt:`${e.title} preview ${o+1}`,className:"h-44 w-full object-cover",loading:"lazy"})},`${e.id}-media-${o}`))}),e.links.length>0&&t.jsx("div",{className:"mt-5 flex flex-wrap items-center gap-3",children:e.links.map(i=>t.jsxs("a",{href:i.href,target:"_blank",rel:"noopener noreferrer",className:"theme-pill-button rounded-lg border px-4 py-2 text-[13px] font-medium transition",children:[i.label," ↗"]},i.label))})]})]})},`overlay-${e.id}`)]})})),ds=({themeMode:e})=>{const[r,s]=d.useState(!0),[i,o]=d.useState(null),[n,f]=d.useState(null),p=gt.projects;d.useEffect(()=>{const u=window.setTimeout(()=>{s(!1)},900);return()=>window.clearTimeout(u)},[]);const c=d.useCallback((u,m)=>{o(u),f(m)},[]),a=d.useCallback(()=>{o(null),f(null)},[]);return t.jsx(It,{backgroundClassName:p.backgroundClassName,footerBackgroundColor:p.footerBackgroundColor,footerRunwayVh:p.footerRunwayVh,children:u=>t.jsxs("div",{className:"relative isolate",children:[t.jsx("div",{className:"pointer-events-none absolute inset-0 z-0","aria-hidden":!0,children:t.jsxs("div",{className:"sticky top-0 h-[100svh]",children:[t.jsx(yt,{effectId:p.backdropEffectId,quality:p.backdropQuality,interactionMode:p.backdropInteractionMode,styleSeed:p.backdropStyleSeed,className:p.backdropClassName}),p.backdropOverlayClassName?t.jsx("div",{className:p.backdropOverlayClassName}):null]})}),t.jsxs("div",{className:"relative z-10",children:[t.jsxs("header",{className:"theme-text-primary relative z-20 mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 pt-24",children:[t.jsx("p",{className:"theme-text-subtle text-sm uppercase tracking-[0.22em]",children:Ge.eyebrow}),t.jsx("h1",{className:"text-3xl font-medium xs:text-4xl sm:text-5xl",children:Ge.title}),t.jsx("p",{className:"theme-text-muted max-w-2xl",children:Ge.summary})]}),t.jsx("div",{className:"relative mt-8",children:t.jsx(Jt,{scrollContainer:u,items:Mt,onCardSelect:c,forceLowPower:r,themeMode:e})}),t.jsx(es,{item:i,originPos:n,onClose:a,themeMode:e})]})]})})};export{ds as default};
