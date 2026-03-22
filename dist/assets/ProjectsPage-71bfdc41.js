import{r as d,ay as yt,az as Mt,aA as wt,j as t,au as vt,av as bt,w as at,aa as jt,d as nt,aB as tt,C as de,aC as kt,aD as St,K as Rt,e as J,as as Oe,aE as $t,A as st,M as E,V as q,Z as Pt,G as Ct,X as Et,aF as Ye,m as Fe,p as At,aG as Ze}from"./index-55238d0b.js";import{r as it,D as Tt,p as Lt}from"./projectData-e2f783c7.js";import{S as It,A as Dt}from"./SceneBloom-d37f6cdb.js";import{c as je}from"./probe-e4e617c0.js";import{b as Gt,u as Nt,a as zt}from"./use-motion-value-1ff0358a.js";import{P as Bt}from"./PageScaffold-2b34e09b.js";import"./Footer-df946975.js";function Ot(e){const r=d.useRef(0),{isStatic:s}=d.useContext(yt);d.useEffect(()=>{if(s)return;const l=({timestamp:o,delta:n})=>{r.current||(r.current=o),e(o-r.current,n)};return Mt.update(l,!0),()=>wt(l)},[e])}const Yt=({progress:e,height:r=200,forceLowPower:s=!1,themeMode:l,children:o})=>{const[n,c]=d.useState(!1),[p,i]=d.useState(!1);d.useEffect(()=>{if(typeof window>"u")return;const h=window.matchMedia("(max-width: 900px)"),g=window.matchMedia("(prefers-reduced-motion: reduce)"),x=()=>{c(h.matches),i(g.matches)};return x(),h.addEventListener?(h.addEventListener("change",x),g.addEventListener("change",x)):(h.addListener(x),g.addListener(x)),()=>{h.removeEventListener?(h.removeEventListener("change",x),g.removeEventListener("change",x)):(h.removeListener(x),g.removeListener(x))}},[]);const a=p||s,u=r,f=d.useMemo(()=>l==="dark"?"#0b1326":"#eef4fb",[l]);return d.useEffect(()=>{},[a,n,u,l]),t.jsx("section",{style:{height:`${u}vh`},className:"relative",children:t.jsxs("div",{className:"sticky top-0 h-[100svh] overflow-hidden",children:[t.jsx("div",{className:"theme-project-scene-haze-a pointer-events-none absolute inset-0"}),t.jsx("div",{className:"theme-project-scene-haze-b pointer-events-none absolute inset-0"}),t.jsx(vt,{children:t.jsxs(bt,{className:"absolute inset-0 h-full w-full",camera:{position:[0,.14,6.15],fov:43},dpr:a?[1,1.5]:[1,2],shadows:!1,gl:{preserveDrawingBuffer:!1,antialias:!a,powerPreference:"high-performance",alpha:!0},onCreated:({gl:h})=>{h.outputColorSpace=at,jt.enabled=!0,h.shadowMap.enabled=!1,h.setClearColor(16777215,0)},children:[t.jsx("fog",{attach:"fog",args:[f,8,24]}),t.jsx("ambientLight",{intensity:.72}),t.jsx("spotLight",{position:[0,5.2,2.6],angle:.56,penumbra:.66,intensity:a?1.45:1.68,distance:26}),t.jsx("directionalLight",{position:[2.8,2.6,2.4],intensity:.45}),t.jsx("directionalLight",{position:[-3.2,1.4,-2.8],intensity:.18}),t.jsx(It,{enabled:!a}),t.jsx("group",{scale:1.14,position:[0,.02,0],children:o(e,{lowPowerMode:a,mobileViewport:n})})]})}),t.jsx("div",{className:"theme-project-scene-bottom-fade pointer-events-none absolute inset-x-0 bottom-0 h-36"})]})})},Ft=e=>"data:image/svg+xml;utf8,"+encodeURIComponent(e==="dark"?"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'><rect width='720' height='1024' fill='#0f172a'/><rect x='36' y='36' width='648' height='952' rx='28' fill='none' stroke='#334155' stroke-width='8'/></svg>":"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'><rect width='720' height='1024' fill='#f8fafc'/><rect x='36' y='36' width='648' height='952' rx='28' fill='none' stroke='#94a3b8' stroke-width='8'/></svg>"),Zt="data:image/svg+xml;utf8,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#103a8a'/><stop offset='100%' stop-color='#1f5fd8'/></linearGradient></defs><rect width='720' height='1024' fill='url(#g)'/></svg>"),ct=d.forwardRef(({frontSrc:e,backSrc:r,width:s,height:l,thickness:o=.02,borderColor:n="#e0e0e0",edgeColor:c,edgeGlow:p,flip:i,pop:a,popScale:u=1.15,onClick:f,isClickable:h,frontAttachment:g,themeMode:x="light",...w},v)=>{const{viewport:L,gl:P}=nt(),me=Math.min(L.width,L.height),A=s??me*.08,I=l??A*1.4,F=d.useRef(null),ee=d.useRef(null),xe=d.useRef(null),R=d.useRef(null),ge=d.useRef(null),ye=d.useRef(null),ne=d.useRef(!1);d.useImperativeHandle(v,()=>F.current,[]);const Z=tt(st,e??Ft(x)),C=tt(st,r??Zt),y=d.useMemo(()=>new de(c??n),[c,n]),S=d.useMemo(()=>{const M=new kt(A+.016,I+.016,o+.012),T=new St(M);return M.dispose(),T},[A,I,o]);d.useMemo(()=>{const M=P.capabilities.getMaxAnisotropy();for(const T of[Z,C])T.colorSpace=at,T.anisotropy=M,T.minFilter=Rt,T.needsUpdate=!0},[Z,C,P]),J(()=>{var te,le,V;const M=F.current;if(!M)return;const T=((te=i==null?void 0:i.get)==null?void 0:te.call(i))??0;M.rotation.y=Math.PI*T;const Me=((le=a==null?void 0:a.get)==null?void 0:le.call(a))??0,B=1+(u-1)*Me;M.scale.setScalar(B);const ke=((V=p==null?void 0:p.get)==null?void 0:V.call(p))??0,U=ne.current?2.15:1,N=E.clamp(ke*U,0,1.9),ie=ee.current;ie&&(ie.emissive.setRGB(1,1,1),ie.emissiveIntensity=.24+N*.2);const ce=xe.current;ce&&(ce.uniforms.uAccentColor.value.copy(y),ce.uniforms.uGlow.value=E.clamp(N*.52,0,1.1));const we=R.current;we&&(we.opacity=E.clamp(.34+N*.22,.34,.76));const _=ge.current;_&&(_.opacity=E.clamp(N*.64,0,.95),_.color.copy(y).multiplyScalar(.95+N*2.3),_.visible=_.opacity>.01);const H=ye.current;H&&(H.uniforms.uColor.value.copy(y),H.uniforms.uOpacity.value=E.clamp(N*.28,0,.48),H.uniforms.uStrength.value=.85+N*1.7,H.visible=N>.01)}),d.useEffect(()=>()=>{P.domElement.style.cursor="auto"},[P]),d.useEffect(()=>()=>{S.dispose()},[S]);const D=()=>h?h():!0,b=M=>{ne.current=!0,f&&D()?(M.stopPropagation(),P.domElement.style.cursor="pointer"):P.domElement.style.cursor="auto"},j=()=>{ne.current=!1,P.domElement.style.cursor="auto"},m=M=>{!f||!D()||(M.stopPropagation(),f())};return t.jsxs("group",{ref:F,...w,children:[t.jsxs("mesh",{renderOrder:2,children:[t.jsx("boxGeometry",{args:[A+.03,I+.03,o+.04]}),t.jsx("shaderMaterial",{ref:ye,uniforms:{uColor:{value:y.clone()},uOpacity:{value:0},uStrength:{value:.7}},vertexShader:`
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
            `,blending:Oe,transparent:!0,depthWrite:!1,depthTest:!0,side:$t,toneMapped:!1})]}),t.jsx("lineSegments",{geometry:S,renderOrder:3,children:t.jsx("lineBasicMaterial",{ref:ge,color:y,transparent:!0,opacity:0,blending:Oe,depthWrite:!1,toneMapped:!1})}),t.jsxs("mesh",{castShadow:!0,children:[t.jsx("boxGeometry",{args:[A,I,o]}),t.jsx("meshStandardMaterial",{color:n,metalness:.08,roughness:.52})]}),t.jsxs("mesh",{position:[0,0,o/2+1e-4],onPointerOver:b,onPointerOut:j,onClick:m,children:[t.jsx("planeGeometry",{args:[A,I]}),t.jsx("meshStandardMaterial",{ref:ee,map:Z,roughness:.3,metalness:0,emissive:"#ffffff",emissiveMap:Z,emissiveIntensity:.34,toneMapped:!1})]}),t.jsxs("mesh",{position:[0,0,o/2+18e-5],renderOrder:5,children:[t.jsx("planeGeometry",{args:[A,I]}),t.jsx("shaderMaterial",{ref:xe,uniforms:{uMap:{value:Z},uAccentColor:{value:y.clone()},uGlow:{value:0}},vertexShader:`
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
            `,blending:Oe,transparent:!0,depthWrite:!1,depthTest:!0,toneMapped:!1})]}),t.jsxs("mesh",{position:[0,0,o/2+26e-5],renderOrder:6,children:[t.jsx("planeGeometry",{args:[A,I]}),t.jsx("meshBasicMaterial",{ref:R,map:Z,transparent:!0,opacity:.34,depthWrite:!1,toneMapped:!1})]}),g?t.jsx("group",{position:[0,0,o/2+.0015],children:g}):null,t.jsxs("mesh",{"rotation-y":Math.PI,position:[0,0,-o/2-1e-4],children:[t.jsx("planeGeometry",{args:[A,I]}),t.jsx("meshStandardMaterial",{map:C,roughness:.28,metalness:0,emissive:"#ffffff",emissiveMap:C,emissiveIntensity:.4,toneMapped:!1})]})]})});ct.displayName="Card3D";const pe=e=>Math.min(1,Math.max(0,e)),fe=e=>typeof e=="number"?e:e.get(),Y=()=>{},he=.08,ue=(e,r)=>d.useMemo(()=>({accent:new de(e),deep:new de(r.deep),mid:new de(r.mid),bright:new de(r.bright)}),[e,r.deep,r.mid,r.bright]),Ut=({reveal:e,intensity:r,accent:s,palette:l})=>{const o=d.useRef(null),n=d.useRef([]),c=ue(s,l);return J(({clock:p})=>{const i=o.current;if(!i)return;const a=pe(fe(e)),u=a>he;if(i.visible=u,!u)return;const f=p.elapsedTime,h=(.7+a*.6)*(.9+r*.12);i.scale.setScalar(h),i.rotation.y=f*.55,i.rotation.x=Math.sin(f*.7)*.12,i.position.z=.1+a*.5,i.position.y=.02+Math.sin(f*1.2)*.04;const g=.44+a*.26;n.current.forEach((x,w)=>{if(!x)return;const v=f*(1.8+w*.22)+w*(Math.PI*.66);x.position.set(Math.cos(v)*g,Math.sin(v*1.08)*g*.58,Math.sin(v*.72)*.22)})}),t.jsxs("group",{ref:o,position:[0,.04,.2],children:[t.jsxs("mesh",{raycast:Y,children:[t.jsx("icosahedronGeometry",{args:[.19,2]}),t.jsx("meshStandardMaterial",{color:c.mid,emissive:c.accent,emissiveIntensity:.56,metalness:.1,roughness:.38,toneMapped:!1})]}),t.jsxs("mesh",{rotation:[Math.PI/2,0,0],raycast:Y,children:[t.jsx("torusGeometry",{args:[.55,.03,18,84]}),t.jsx("meshStandardMaterial",{color:c.accent,emissive:c.accent,emissiveIntensity:.72,transparent:!0,opacity:.88,metalness:.05,roughness:.42,toneMapped:!1})]}),Array.from({length:4}).map((p,i)=>t.jsxs("mesh",{raycast:Y,ref:a=>{n.current[i]=a},children:[t.jsx("sphereGeometry",{args:[.07,16,16]}),t.jsx("meshStandardMaterial",{color:c.bright,emissive:c.accent,emissiveIntensity:.9,toneMapped:!1})]},`orbital-satellite-${i}`))]})},_t=({reveal:e,intensity:r,accent:s,palette:l})=>{const o=d.useRef(null),n=d.useRef([]),c=ue(s,l),p=d.useMemo(()=>[-.48,-.32,-.16,0,.16,.32,.48],[]);return J(({clock:i})=>{const a=o.current;if(!a)return;const u=pe(fe(e)),f=u>he;if(a.visible=f,!f)return;const h=i.elapsedTime;a.scale.setScalar(.7+u*.52),a.position.z=.08+u*.44,a.rotation.y=Math.sin(h*.82)*.09,a.rotation.x=-.12+Math.sin(h*.56)*.06,n.current.forEach((g,x)=>{if(!g)return;const v=.54+(.28+.72*(.5+.5*Math.sin(h*2.8+x*.66)))*(.85+r*.28);g.scale.y=v,g.position.y=-.08+v*.18,g.position.z=Math.sin(h*1.2+x)*.05})}),t.jsx("group",{ref:o,position:[0,-.04,.14],children:p.map((i,a)=>t.jsxs("mesh",{raycast:Y,ref:u=>{n.current[a]=u},position:[i,0,0],children:[t.jsx("boxGeometry",{args:[.09,.36,.09]}),t.jsx("meshStandardMaterial",{color:a%2===0?c.mid:c.accent,emissive:c.accent,emissiveIntensity:.64,metalness:.08,roughness:.34,toneMapped:!1})]},`spine-${a}`))})},Ht=({reveal:e,intensity:r,accent:s,palette:l})=>{const o=d.useRef(null),n=ue(s,l),c=d.useMemo(()=>[new q(-.42,.08,0),new q(-.16,.28,.14),new q(.18,.2,-.08),new q(.44,.04,.04),new q(-.08,-.2,.1),new q(.28,-.26,-.03)],[]),p=d.useMemo(()=>{const i=[[0,1],[1,2],[2,3],[1,4],[4,5],[2,5],[0,4]],a=new Float32Array(i.length*6);i.forEach(([f,h],g)=>{a[g*6]=c[f].x,a[g*6+1]=c[f].y,a[g*6+2]=c[f].z,a[g*6+3]=c[h].x,a[g*6+4]=c[h].y,a[g*6+5]=c[h].z});const u=new Pt;return u.setAttribute("position",new Ct(a,3)),u},[c]);return d.useEffect(()=>()=>{p.dispose()},[p]),J(({clock:i})=>{const a=o.current;if(!a)return;const u=pe(fe(e)),f=u>he;if(a.visible=f,!f)return;const h=i.elapsedTime;a.scale.setScalar((.7+u*.64)*(.95+r*.1)),a.rotation.y=h*.42,a.rotation.x=Math.sin(h*.72)*.08,a.position.z=.14+u*.46,a.position.y=Math.sin(h*1.1)*.03}),t.jsxs("group",{ref:o,position:[0,0,.2],children:[t.jsx("lineSegments",{geometry:p,raycast:Y,children:t.jsx("lineBasicMaterial",{color:n.accent,transparent:!0,opacity:.72,toneMapped:!1})}),c.map((i,a)=>t.jsxs("mesh",{position:[i.x,i.y,i.z],raycast:Y,children:[t.jsx("sphereGeometry",{args:[.06+a%2*.012,16,16]}),t.jsx("meshStandardMaterial",{color:a%2===0?n.bright:n.mid,emissive:n.accent,emissiveIntensity:.74,toneMapped:!1})]},`node-${a}`))]})},Vt=({reveal:e,intensity:r,accent:s,palette:l})=>{const o=d.useRef(null),n=ue(s,l);return J(({clock:c})=>{const p=o.current;if(!p)return;const i=pe(fe(e)),a=i>he;if(p.visible=a,!a)return;const u=c.elapsedTime;p.scale.setScalar((.72+i*.58)*(.96+r*.08)),p.rotation.z=Math.sin(u*.62)*.16,p.rotation.y=u*.52,p.position.z=.12+i*.48,p.position.y=-.03+Math.sin(u*1.5)*.04}),t.jsxs("group",{ref:o,position:[0,-.02,.2],children:[t.jsxs("mesh",{raycast:Y,children:[t.jsx("torusKnotGeometry",{args:[.34,.07,140,18,2,3]}),t.jsx("meshStandardMaterial",{color:n.mid,emissive:n.accent,emissiveIntensity:.82,metalness:.22,roughness:.32,toneMapped:!1})]}),t.jsxs("mesh",{rotation:[Math.PI/2,0,0],raycast:Y,children:[t.jsx("ringGeometry",{args:[.46,.56,64]}),t.jsx("meshBasicMaterial",{color:n.accent,transparent:!0,opacity:.28,toneMapped:!1,side:Et})]})]})},Xt=({reveal:e,intensity:r,accent:s,palette:l})=>{const o=d.useRef(null),n=d.useRef([]),c=ue(s,l),p=d.useMemo(()=>{const i=[];for(let u=0;u<3;u+=1)for(let f=0;f<3;f+=1)i.push([(f-1)*.22,(u-1)*.22*.78,0]);return i},[]);return J(({clock:i})=>{const a=o.current;if(!a)return;const u=pe(fe(e)),f=u>he;if(a.visible=f,!f)return;const h=i.elapsedTime;a.scale.setScalar((.78+u*.55)*(.93+r*.12)),a.rotation.y=Math.sin(h*.72)*.2,a.position.z=.12+u*.45,a.position.y=-.02+Math.sin(h*1.24)*.03,n.current.forEach((g,x)=>{if(!g)return;const v=.44+(.35+.65*(.5+.5*Math.sin(h*2.4+x*.44)))*(.72+r*.34);g.scale.y=v,g.position.z=Math.sin(h*1.1+x*.22)*.04,g.position.y=p[x][1]-.12+v*.12})}),t.jsx("group",{ref:o,position:[0,.04,.2],children:p.map(([i,a,u],f)=>t.jsxs("mesh",{raycast:Y,ref:h=>{n.current[f]=h},position:[i,a,u],children:[t.jsx("cylinderGeometry",{args:[.045,.045,.28,14]}),t.jsx("meshStandardMaterial",{color:f%2===0?c.mid:c.bright,emissive:c.accent,emissiveIntensity:.66,roughness:.32,metalness:.18,toneMapped:!1})]},`pillar-${f}`))})},Wt=e=>{switch(e.preset){case"orbitalCore":return t.jsx(Ut,{...e});case"dataSpines":return t.jsx(_t,{...e});case"nodeConstellation":return t.jsx(Ht,{...e});case"ribbonArc":return t.jsx(Vt,{...e});case"pillarArray":return t.jsx(Xt,{...e});default:return null}},Kt=(e,r,s)=>{const{palette:l,accent:o}=e,n={atlas:l.line,signal:o,forge:l.bright,lattice:l.mid};return r==="dark"?{bgStart:l.deep,bgEnd:l.mid,portal:n[s],trim:l.line,text:l.bright,muted:l.line,chip:l.deep,chipText:l.bright}:{bgStart:l.bright,bgEnd:l.line,portal:n[s],trim:o,text:l.deep,muted:l.mid,chip:"#ffffff",chipText:l.deep}},Ue=1024,_e=720,He=720,Ve=1024,We=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&apos;"),Xe=(e,r,s)=>{const l=e.trim().split(/\s+/).filter(Boolean);if(!l.length)return[""];const o=[];let n="";for(const i of l){const a=n?`${n} ${i}`:i;if(a.length<=r){n=a;continue}if(n&&o.push(n),n=i,o.length===s)break}o.length<s&&n&&o.push(n),o.length>s&&(o.length=s);const c=l.join(" "),p=o.join(" ");if(c.length>p.length){const i=o.length-1;o[i]=`${o[i].replace(/\.{3}$/,"").trim()}...`}return o},re=(e,r,s)=>e.map((l,o)=>`<tspan x='${r}' dy='${o===0?0:s}'>${We(l)}</tspan>`).join(""),qt=(e,{min:r,max:s})=>Math.max(r,Math.min(s,44+e.trim().length*10.4)),Qt=(e,r,s="landscape",l="light")=>{const o=it(e),n=Kt(e,l,o.frontFamily),c=Xe(e.title,24,2),p=Xe(e.subtitle,26,2),i=Xe(e.summary,40,2),a=s==="landscape",u=qt(o.dateLabel,{min:188,max:a?336:308}),f=a?Ue:He,h=a?_e:Ve,g=a?512:360,x=a?360:512,w=a?260:250,v=a?`
  <g transform='translate(720 0) rotate(90)'>
    <rect width='${Ue}' height='${_e}' fill='url(#bg)'/>
    <rect width='${Ue}' height='${_e}' fill='url(#grid)'/>

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
      <text x='18' y='29' fill='${n.muted}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='18' font-weight='600'>${We(o.dateLabel)}</text>
    </g>

    <g transform='translate(938 520)'>
      <text x='0' y='0' text-anchor='end' fill='${n.muted}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='29' font-weight='600'>
        ${re(p,0,34)}
      </text>
      <text x='0' y='86' text-anchor='end' fill='${n.text}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='22' font-weight='500' opacity='0.92'>
        ${re(i,0,28)}
      </text>
    </g>

    <path d='M98 440 H262' stroke='${e.accent}' stroke-opacity='0.5' stroke-width='3'/>
    <path d='M760 440 H924' stroke='${e.accent}' stroke-opacity='0.38' stroke-width='3'/>
  </g>`:`
  <g>
    <rect width='${He}' height='${Ve}' fill='url(#bg)'/>
    <rect width='${He}' height='${Ve}' fill='url(#grid)'/>

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
      <text x='18' y='29' fill='${n.muted}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='18' font-weight='600'>${We(o.dateLabel)}</text>
    </g>

    <g transform='translate(636 702)'>
      <text x='0' y='0' text-anchor='end' fill='${n.muted}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='27' font-weight='600'>
        ${re(p,0,32)}
      </text>
      <text x='0' y='80' text-anchor='end' fill='${n.text}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='21' font-weight='500' opacity='0.92'>
        ${re(i,0,27)}
      </text>
    </g>

    <path d='M98 644 H262' stroke='${e.accent}' stroke-opacity='0.5' stroke-width='3'/>
    <path d='M458 644 H622' stroke='${e.accent}' stroke-opacity='0.38' stroke-width='3'/>
  </g>`,L=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='${f}' y2='${h}' gradientUnits='userSpaceOnUse'>
      <stop offset='0%' stop-color='${n.bgStart}'/>
      <stop offset='100%' stop-color='${n.bgEnd}'/>
    </linearGradient>
    <radialGradient id='portalGlow' cx='${g}' cy='${x}' r='${w}' gradientUnits='userSpaceOnUse'>
      <stop offset='0%' stop-color='${n.portal}' stop-opacity='0.56'/>
      <stop offset='100%' stop-color='${n.portal}' stop-opacity='0'/>
    </radialGradient>
    <pattern id='grid' width='32' height='32' patternUnits='userSpaceOnUse' patternTransform='rotate(${r*11})'>
      <path d='M16 0V32 M0 16H32' stroke='${n.trim}' stroke-opacity='0.08' stroke-width='1'/>
    </pattern>
  </defs>

  ${v}
</svg>`;return`data:image/svg+xml;utf8,${encodeURIComponent(L)}`},Jt=(e,r)=>{const s=e.palette,l=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'>
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
</svg>`;return`data:image/svg+xml;utf8,${encodeURIComponent(l)}`},es=e=>{if(e<=0)return[];const r=Array.from({length:e},(l,o)=>o);let s=e*131+17;for(let l=r.length-1;l>0;l-=1){s=s*1664525+1013904223>>>0;const o=s%(l+1);[r[l],r[o]]=[r[o],r[l]]}return r},Q=e=>Math.min(1,Math.max(0,e)),oe=e=>1-Math.pow(1-e,3),ae=e=>e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2,z=(e,r,s)=>Q((e-r)/(s-r)),G=(e,r,s)=>E.lerp(e,r,s),ts=(e,r)=>{const s=Math.max(0,e-4);return{dealStart:.64,dealEnd:r?Math.min(.91,.88+s*.025):Math.min(.92,.84+s*.03),flipStart:r?Math.max(.7,.72-s*.01):Math.max(.74,.78-s*.01),flipEnd:r?Math.min(.94,.86+s*.03):.98,browseStart:r?Math.min(.92,.86+s*.025):Math.min(.97,.95+s*.015),dealDelaySpan:Math.min(.5,.32+s*.045),flipDelaySpan:Math.min(.52,.35+s*.05)}},rt=(e,r,s)=>s?{width:e,height:r,cardSpacing:r*.44,ringRx:e*.17,ringRy:r*.13,exitDropMax:r*.34,dealEntryY:r*.48,browseParallaxX:.07,browseParallaxY:.045,dealScaleMax:2.08,dealArcMax:.2,stackDepthStep:.0085,flipArcZMax:.5,flipArcYMax:.06}:{width:e,height:r,cardSpacing:r*.56,ringRx:e*.24,ringRy:r*.18,exitDropMax:r*.48,dealEntryY:r*.6,browseParallaxX:.16,browseParallaxY:.08,dealScaleMax:2.2,dealArcMax:.3,stackDepthStep:.008,flipArcZMax:.7,flipArcYMax:.12},ss=({progress:e,items:r,onCardSelect:s,lowPowerMode:l=!1,mobileViewport:o=!1,themeMode:n})=>{const{viewport:c,pointer:p,camera:i,gl:a}=nt(),u=d.useRef([]),f=d.useRef([]),h=d.useRef(null),g=d.useRef([]),x=d.useRef([]),w=d.useRef([]),v=d.useRef(rt(c.width,c.height,o)),L=d.useRef(!1),P=d.useMemo(()=>r.map(C=>it(C)),[r]),A=Math.min(c.width,c.height)*(o?.228:.198),I=A*1.46,F=o?"portrait":"landscape",ee=E.clamp(A*.58,o?.34:.42,o?.56:.72),xe=o?0:-Math.PI/2,R=r.length,ge=d.useMemo(()=>r.map((C,y)=>({frontSrc:Qt(C,y+1,F,n),backSrc:Jt(C,y+1),borderColor:n==="dark"?"#172036":"#f8fafc",edgeColor:C.accent,themeMode:n,width:A,height:I})),[r,I,A,F,n]),ye=d.useMemo(()=>es(R),[R]);d.useEffect(()=>{},[r]),g.current.length!==R&&(g.current=Array.from({length:R},()=>Ye(0))),x.current.length!==R&&(x.current=Array.from({length:R},()=>Ye(0))),w.current.length!==R&&(w.current=Array.from({length:R},()=>Ye(0)));const ne=d.useMemo(()=>r.map((C,y)=>({x:(y%2===0?-1:1)*(.46+y*.08),y:(y%3-1)*.2,lift:.12+y*.014})),[r]),Z=C=>{if(!L.current)return;const y=r[C],S=u.current[C];if(!y||!S)return;const D=new q;S.getWorldPosition(D);const b=D.clone().project(i),j=a.domElement.getBoundingClientRect(),m=j.left+(b.x*.5+.5)*j.width,M=j.top+(-b.y*.5+.5)*j.height;s==null||s(y,{x:m,y:M})};return J((C,y)=>{const S=h.current;if(!S)return;const D=C.clock.getElapsedTime(),b=Q(e.get()),j=rt(c.width,c.height,o),m=v.current,M=1-Math.exp(-Math.min(y,.2)*10),T=ts(R,o);m.width=G(m.width,j.width,M),m.height=G(m.height,j.height,M),m.cardSpacing=G(m.cardSpacing,j.cardSpacing,M),m.ringRx=G(m.ringRx,j.ringRx,M),m.ringRy=G(m.ringRy,j.ringRy,M),m.exitDropMax=G(m.exitDropMax,j.exitDropMax,M),m.dealEntryY=G(m.dealEntryY,j.dealEntryY,M),m.browseParallaxX=G(m.browseParallaxX,j.browseParallaxX,M),m.browseParallaxY=G(m.browseParallaxY,j.browseParallaxY,M),m.dealScaleMax=G(m.dealScaleMax,j.dealScaleMax,M),m.dealArcMax=G(m.dealArcMax,j.dealArcMax,M),m.stackDepthStep=G(m.stackDepthStep,j.stackDepthStep,M),m.flipArcZMax=G(m.flipArcZMax,j.flipArcZMax,M),m.flipArcYMax=G(m.flipArcYMax,j.flipArcYMax,M);const Me=oe(z(b,0,o?.3:.26)),B=oe(z(b,.18,.36)),ke=oe(z(b,.32,.48)),U=ae(z(b,.44,.58)),N=z(b,T.dealStart,T.dealEnd),ie=z(b,T.flipStart,T.flipEnd),ce=ae(z(b,T.browseStart,1)),we=ae(z(b,.62,.78)),_=.56*ae(z(b,.88,1)),H=Q(Math.max(we,_)),te=b>.64;L.current=b>(o?.95:.9);const le=Me*(1-B),V=1-oe(z(b,.56,.72)),Se=p.x,Re=p.y,lt=Math.PI*.24*le,dt=-Math.PI*.035*le,qe=te?o?.008:.012:0;S.rotation.x=(lt+Re*.03)*V+Re*qe,S.rotation.y=(dt+Se*.05)*V+Se*qe;const $e=m.cardSpacing,pt=(R-1)*$e,Qe=ce*pt,Je=te&&R>0?E.clamp(Math.round(Qe/Math.max($e,1e-4)),0,R-1):null;Je!==null&&r[Je],S.position.x=Se*m.browseParallaxX*V,S.position.y=Re*m.browseParallaxY*V+Qe;const ft=m.ringRx,ht=m.ringRy,ut=(ke*.3+U*.48)*Math.PI*2;for(let k=0;k<R;k++){const $=u.current[k];if(!$)continue;const Pe=R>1?k/(R-1):0;if(x.current[k].set(H),te){const se=Pe*T.dealDelaySpan,O=ae(Q((N-se)/Math.max(.01,1-se*.55))),X=oe(z(N,.82,1)),Ce=m.dealEntryY,ve=-k*$e,Ee=E.lerp(Ce,ve,O),Ae=Math.sin(O*Math.PI)*m.dealArcMax,Te=-k*m.stackDepthStep;$.position.x=0,$.position.y=E.lerp(Ee,ve,X),$.position.z=E.lerp(Ae,Te,X);const Le=o?0:Math.PI/2,W=Le*O;$.rotation.x=0;const Ie=(1-O)*((k%2===0?-1:1)*.08),De=W+Ie;$.rotation.z=E.lerp(De,Le,X);const be=Pe*T.flipDelaySpan,K=ae(Q((ie-be)/Math.max(.01,1-be*.45))),Ge=Math.sin(K*Math.PI)*m.flipArcZMax,Ne=Math.sin(K*Math.PI)*m.flipArcYMax;$.position.z+=Ge,$.position.y+=Ne,g.current[k].set(1-K);const ze=Q((K-.08)/.92);w.current[k].set(ze),O>.98&&K>.98&&($.position.y+=Math.sin(D*1.1+k*1.3)*.01,$.position.z+=Math.cos(D*.9+k*.7)*.005),$.rotation.y=0;const Be=E.lerp(1,m.dealScaleMax,O);$.scale.setScalar(Be)}else{const se=ne[k],O=oe(Q((Me-Pe*.44)/.56)),X=Math.sin(O*Math.PI),Ce=-k*.05,ve=-(ye[k]??k)*.055,Ee=se.x*X,Ae=se.y*X,Te=E.lerp(Ce,ve,O)+se.lift*X,W=k/R*Math.PI*2+ut,Ie=Math.sin(W)*ft,De=Math.cos(W)*ht+.05,be=-.06+Math.sin(W*2)*.012,K=E.lerp(Ee,Ie,B),Ge=E.lerp(Ae,De,B),Ne=E.lerp(Te,be,B),ze=m.exitDropMax*U,Be=Math.sin(W*1.1)*.06*U,et=.01+B*.022,mt=Math.sin(D*1.65+k*.82)*et,xt=Math.cos(D*1.2+k*.58)*et*.45;$.position.x=K+Be,$.position.y=Ge-ze+mt,$.position.z=Ne-.16*U+xt,$.rotation.x=0,$.rotation.y=0,$.rotation.z=W*(o?.08:.1)*B,g.current[k].set(1),w.current[k].set(0);const gt=1+.1*B-.12*U;$.scale.setScalar(gt)}}}),t.jsx("group",{ref:h,children:ge.map((C,y)=>{const S=r[y],D=P[y];return t.jsx("group",{ref:b=>{b&&(u.current[y]=b)},position:[0,0,-y*.05],children:t.jsx(ct,{ref:b=>{f.current[y]=b},...C,flip:g.current[y],edgeGlow:x.current[y],frontAttachment:!l&&S&&D?t.jsx("group",{rotation:[0,0,xe],scale:ee,children:t.jsx(Wt,{preset:D.popoutPreset,accent:S.accent,palette:S.palette,reveal:w.current[y],intensity:D.popoutIntensity*.84})}):void 0,isClickable:()=>L.current,onClick:()=>Z(y)})},(S==null?void 0:S.id)??`card-${y}`)})})},Ke=e=>Math.min(1,Math.max(0,e)),rs=e=>560+Math.max(0,e-4)*110,ot=(e,r)=>{const s=Ke(e),l=Math.max(0,r-4),o=Math.min(.67,.62+l*.03),n=Math.min(.84,.76+l*.04),c=Math.min(.9,.76+l*.05),p=Math.max(.08,1-c);return s<=.12?s:s<=.3?.12+(s-.12)/.18*.3:s<=.46?.42+(s-.3)/.16*.26:s<=o?.68+(s-.46)/(o-.46)*.16:s<=n?.84+(s-o)/(n-o)*.12:s<=c?.96:.96+(s-c)/p*.04},os=({scrollContainer:e,items:r,onCardSelect:s,forceLowPower:l=!1,themeMode:o})=>{const n=je(),c=d.useRef(null),p=d.useRef(0),i=d.useRef(0),a=rs(r.length),u="projects:storyboard-scroll",f=Gt(0),{scrollYProgress:h}=Nt({container:e,target:c,offset:["start start","end end"],layoutEffect:!1});zt(h,"change",x=>{p.current=x});const g=d.useCallback(()=>{const x=Ke(h.get());p.current=x,f.set(ot(x,r.length)),i.current=3},[r.length,h,f]);return d.useEffect(()=>{g()},[g]),d.useEffect(()=>{},[l,r.length,u,e,h,a]),d.useEffect(()=>{if(typeof window>"u")return;const x=()=>{g()},w=typeof ResizeObserver<"u"?new ResizeObserver(()=>{x()}):null,v=c.current,L=e.current;w&&(v&&w.observe(v),L&&w.observe(L)),window.addEventListener("resize",x);const P=window.visualViewport;return P==null||P.addEventListener("resize",x),()=>{w==null||w.disconnect(),window.removeEventListener("resize",x),P==null||P.removeEventListener("resize",x)}},[e,g]),Ot((x,w)=>{const v=ot(p.current,r.length),L=f.get();if(i.current>0){f.set(v),i.current-=1;return}const P=v<.68,me=v<.96,A=(P?34e-5:me?5e-4:9e-4)*w,I=v-L,F=Math.sign(I)*Math.min(Math.abs(I),A),ee=Ke(L+F);f.set(ee)}),t.jsx("div",{ref:c,...n,children:t.jsx(Yt,{progress:f,height:a,forceLowPower:l,themeMode:o,children:(x,w)=>t.jsx(ss,{progress:x,items:r,onCardSelect:s,lowPowerMode:w.lowPowerMode,mobileViewport:w.mobileViewport,themeMode:o})})})},as=({item:e,originPos:r,onClose:s,themeMode:l})=>{d.useEffect(()=>{if(!e)return;const c=p=>{p.key==="Escape"&&s()};return window.addEventListener("keydown",c),()=>window.removeEventListener("keydown",c)},[e,s]),d.useEffect(()=>{},[e,r,l]);const o=je(),n=je();return t.jsx(Dt,{children:e&&r&&t.jsxs(t.Fragment,{children:[t.jsx(Fe.div,{...o,className:"theme-overlay-backdrop fixed inset-0 z-[90]",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.28},onClick:s},"overlay-backdrop"),t.jsx(Fe.div,{className:"fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-8",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:s,children:t.jsxs(Fe.div,{...n,className:"theme-overlay-panel relative max-h-[82vh] w-full max-w-[720px] overflow-y-auto rounded-3xl border backdrop-blur-xl",initial:{scale:.25,x:r.x-window.innerWidth/2,y:r.y-window.innerHeight/2,opacity:0},animate:{scale:1,x:0,y:0,opacity:1},exit:{scale:.85,opacity:0},transition:{type:"spring",damping:28,stiffness:260},onClick:c=>c.stopPropagation(),children:[t.jsx("div",{className:"h-1.5 rounded-t-3xl",style:{background:e.accent}}),t.jsxs("div",{className:"p-6 sm:p-8",children:[t.jsx("button",{onClick:s,className:"theme-overlay-close absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full transition","aria-label":"Close",children:t.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:t.jsx("path",{d:"M4 4l8 8M12 4l-8 8",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})})}),t.jsx("p",{className:"theme-text-subtle text-[11px] uppercase tracking-[0.24em]",children:e.subtitle}),t.jsx("h3",{className:"mt-2 text-[28px] font-medium leading-tight sm:text-[36px]",style:{color:e.accent},children:e.title}),t.jsx("p",{className:"theme-text-muted mt-4 text-[15px] leading-relaxed",children:e.summary}),t.jsx("p",{className:"theme-text-primary mt-3 text-[14px] leading-relaxed",children:e.details}),t.jsx("div",{className:"mt-5 flex flex-wrap gap-2",children:e.tags.map(c=>t.jsx("span",{className:"theme-chip-subtle rounded-full px-3 py-1 text-[11px] font-medium",children:c},c))}),e.media.length>0&&t.jsx("div",{className:"mt-5 grid gap-3 sm:grid-cols-2",children:e.media.map((c,p)=>t.jsx("div",{className:"theme-media-frame overflow-hidden rounded-2xl border",children:t.jsx("img",{src:c,alt:`${e.title} preview ${p+1}`,className:"h-44 w-full object-cover",loading:"lazy"})},`${e.id}-media-${p}`))}),e.links.length>0&&t.jsx("div",{className:"mt-5 flex flex-wrap items-center gap-3",children:e.links.map(c=>t.jsxs("a",{href:c.href,target:"_blank",rel:"noopener noreferrer",className:"theme-pill-button rounded-lg border px-4 py-2 text-[13px] font-medium transition",children:[c.label," ↗"]},c.label))})]})]})},`overlay-${e.id}`)]})})},hs=({themeMode:e})=>{const r=je(),[s,l]=d.useState(!0),[o,n]=d.useState(null),[c,p]=d.useState(null),i=At.projects;d.useEffect(()=>{const f=window.setTimeout(()=>{l(!1)},900);return()=>window.clearTimeout(f)},[]);const a=d.useCallback((f,h)=>{n(f),p(h)},[]),u=d.useCallback(()=>{n(null),p(null)},[]);return t.jsx(Bt,{backgroundClassName:i.backgroundClassName,footerBackgroundColor:i.footerBackgroundColor,footerRunwayVh:i.footerRunwayVh,children:f=>t.jsxs("div",{...r,className:"relative isolate",children:[t.jsx("div",{className:"pointer-events-none absolute inset-0 z-0","aria-hidden":!0,children:t.jsxs("div",{className:"sticky top-0 h-[100svh]",children:[t.jsx(Tt,{effectId:i.backdropEffectId,quality:i.backdropQuality,interactionMode:i.backdropInteractionMode,styleSeed:i.backdropStyleSeed,className:i.backdropClassName}),i.backdropOverlayClassName?t.jsx("div",{className:i.backdropOverlayClassName}):null]})}),t.jsxs("div",{className:"relative z-10",children:[t.jsxs("header",{className:"theme-text-primary relative z-20 mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 pt-24",children:[t.jsx("p",{className:"theme-text-subtle text-sm uppercase tracking-[0.22em]",children:Ze.eyebrow}),t.jsx("h1",{className:"text-3xl font-medium xs:text-4xl sm:text-5xl",children:Ze.title}),t.jsx("p",{className:"theme-text-muted max-w-2xl",children:Ze.summary})]}),t.jsx("div",{className:"relative mt-8",children:t.jsx(os,{scrollContainer:f,items:Lt,onCardSelect:a,forceLowPower:s,themeMode:e})}),t.jsx(as,{item:o,originPos:c,onClose:u,themeMode:e})]})]})})};export{hs as default};
