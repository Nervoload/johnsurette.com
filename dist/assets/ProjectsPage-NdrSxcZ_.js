import{a as l,j as r,aA as ut,aB as mt,S as Qe,au as xt,n as Je,aE as Ve,C as gt,aF as yt,aG as wt,Y as Mt,o as et,M as E,aH as bt,az as Te,R as Ze,aI as Xe,V as vt,i as kt,aJ as St,p as $t,aK as Ae}from"./index-D7UpT4CE.js";import{D as jt}from"./DepthRainBackdrop-CLxLTzhS.js";import{u as Rt,L as Ct}from"./LandingOnboardingOverlay-DZDlOJCr.js";import{S as Pt}from"./SceneBloom-CuIy13sb.js";import{r as tt,p as We}from"./projectData-DtvGTTBQ.js";import{c as rt}from"./probe-CLQtrfq2.js";import{a as Et,u as Tt}from"./use-motion-value-qEsX5CYm.js";import{u as At}from"./use-motion-value-event-C4kWLO2l.js";import{P as Lt}from"./PageScaffold-BSFUySdK.js";import"./Footer-DtOwzXZE.js";const Nt=({progress:t,height:s=200,forceLowPower:e=!1,themeMode:a,children:n})=>{const[o,d]=l.useState(!1),[h,f]=l.useState(!1);l.useEffect(()=>{if(typeof window>"u")return;const u=window.matchMedia("(max-width: 900px)"),$=window.matchMedia("(prefers-reduced-motion: reduce)"),x=()=>{d(u.matches),f($.matches)};return x(),u.addEventListener?(u.addEventListener("change",x),$.addEventListener("change",x)):(u.addListener(x),$.addListener(x)),()=>{u.removeEventListener?(u.removeEventListener("change",x),$.removeEventListener("change",x)):(u.removeListener(x),$.removeListener(x))}},[]);const c=h||e,D=s,N=l.useMemo(()=>a==="dark"?"#0b1326":"#eef4fb",[a]);return l.useEffect(()=>{},[c,o,D,a]),r.jsx("section",{style:{height:`${D}vh`},className:"relative",children:r.jsxs("div",{className:"sticky top-0 h-[100svh] overflow-hidden",children:[r.jsx("div",{className:"theme-project-scene-haze-a pointer-events-none absolute inset-0"}),r.jsx("div",{className:"theme-project-scene-haze-b pointer-events-none absolute inset-0"}),r.jsx(ut,{children:r.jsxs(mt,{className:"absolute inset-0 h-full w-full",camera:{position:[0,.14,6.15],fov:43},dpr:c?[1,1.5]:[1,2],shadows:!1,gl:{preserveDrawingBuffer:!1,antialias:!c,powerPreference:"high-performance",alpha:!0},onCreated:({gl:u})=>{u.outputColorSpace=Qe,xt.enabled=!0,u.shadowMap.enabled=!1,u.setClearColor(16777215,0)},children:[r.jsx("fog",{attach:"fog",args:[N,8,24]}),r.jsx("ambientLight",{intensity:.72}),r.jsx("spotLight",{position:[0,5.2,2.6],angle:.56,penumbra:.66,intensity:c?1.45:1.68,distance:26}),r.jsx("directionalLight",{position:[2.8,2.6,2.4],intensity:.45}),r.jsx("directionalLight",{position:[-3.2,1.4,-2.8],intensity:.18}),r.jsx(Pt,{enabled:!c}),r.jsx("group",{scale:1.14,position:[0,.02,0],children:n(t,{lowPowerMode:c,mobileViewport:o})})]})}),r.jsx("div",{className:"theme-project-scene-bottom-fade pointer-events-none absolute inset-x-0 bottom-0 h-36"})]})})},Dt=t=>"data:image/svg+xml;utf8,"+encodeURIComponent(t==="dark"?"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'><rect width='720' height='1024' fill='#0f172a'/><rect x='36' y='36' width='648' height='952' rx='28' fill='none' stroke='#334155' stroke-width='8'/></svg>":"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'><rect width='720' height='1024' fill='#f8fafc'/><rect x='36' y='36' width='648' height='952' rx='28' fill='none' stroke='#94a3b8' stroke-width='8'/></svg>"),It="data:image/svg+xml;utf8,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#103a8a'/><stop offset='100%' stop-color='#1f5fd8'/></linearGradient></defs><rect width='720' height='1024' fill='url(#g)'/></svg>"),ot=l.forwardRef(({frontSrc:t,backSrc:s,width:e,height:a,thickness:n=.02,borderColor:o="#e0e0e0",edgeColor:d,edgeGlow:h,flip:f,pop:c,popScale:D=1.15,onClick:N,isClickable:u,frontAttachment:$,themeMode:x="light",...m},y)=>{const{viewport:T,gl:C}=Je(),I=Math.min(T.width,T.height),O=e??I*.08,A=a??O*1.4,Y=l.useRef(null),V=l.useRef(null),v=l.useRef(null),ce=l.useRef(null),de=l.useRef(null),he=l.useRef(null),ae=l.useRef(!1);l.useImperativeHandle(y,()=>Y.current,[]);const w=Ve(Ze,t??Dt(x)),p=Ve(Ze,s??It),M=l.useMemo(()=>new gt(d??o),[d,o]),P=l.useMemo(()=>{const b=new yt(O+.016,A+.016,n+.012),G=new wt(b);return b.dispose(),G},[O,A,n]);l.useMemo(()=>{const b=C.capabilities.getMaxAnisotropy();for(const G of[w,p])G.colorSpace=Qe,G.anisotropy=b,G.minFilter=Mt,G.needsUpdate=!0},[w,p,C]),et(()=>{var le,W,Q;const b=Y.current;if(!b)return;const G=((le=f==null?void 0:f.get)==null?void 0:le.call(f))??0;b.rotation.y=Math.PI*G;const F=((W=c==null?void 0:c.get)==null?void 0:W.call(c))??0,ge=1+(D-1)*F;b.scale.setScalar(ge);const Z=((Q=h==null?void 0:h.get)==null?void 0:Q.call(h))??0,fe=ae.current?2.15:1,z=E.clamp(Z*fe,0,1.9),ne=V.current;ne&&(ne.emissive.setRGB(1,1,1),ne.emissiveIntensity=.24+z*.2);const ie=v.current;ie&&(ie.uniforms.uAccentColor.value.copy(M),ie.uniforms.uGlow.value=E.clamp(z*.52,0,1.1));const pe=ce.current;pe&&(pe.opacity=E.clamp(.34+z*.22,.34,.76));const X=de.current;X&&(X.opacity=E.clamp(z*.64,0,.95),X.color.copy(M).multiplyScalar(.95+z*2.3),X.visible=X.opacity>.01);const _=he.current;_&&(_.uniforms.uColor.value.copy(M),_.uniforms.uOpacity.value=E.clamp(z*.28,0,.48),_.uniforms.uStrength.value=.85+z*1.7,_.visible=z>.01)}),l.useEffect(()=>()=>{C.domElement.style.cursor="auto"},[C]),l.useEffect(()=>()=>{P.dispose()},[P]);const j=()=>u?u():!0,g=b=>{ae.current=!0,N&&j()?(b.stopPropagation(),C.domElement.style.cursor="pointer"):C.domElement.style.cursor="auto"},i=()=>{ae.current=!1,C.domElement.style.cursor="auto"},R=b=>{!N||!j()||(b.stopPropagation(),N())};return r.jsxs("group",{ref:Y,...m,children:[r.jsxs("mesh",{renderOrder:2,children:[r.jsx("boxGeometry",{args:[O+.03,A+.03,n+.04]}),r.jsx("shaderMaterial",{ref:he,uniforms:{uColor:{value:M.clone()},uOpacity:{value:0},uStrength:{value:.7}},vertexShader:`
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
            `,blending:Te,transparent:!0,depthWrite:!1,depthTest:!0,side:bt,toneMapped:!1})]}),r.jsx("lineSegments",{geometry:P,renderOrder:3,children:r.jsx("lineBasicMaterial",{ref:de,color:M,transparent:!0,opacity:0,blending:Te,depthWrite:!1,toneMapped:!1})}),r.jsxs("mesh",{castShadow:!0,children:[r.jsx("boxGeometry",{args:[O,A,n]}),r.jsx("meshStandardMaterial",{color:o,metalness:.08,roughness:.52})]}),r.jsxs("mesh",{position:[0,0,n/2+1e-4],onPointerOver:g,onPointerOut:i,onClick:R,children:[r.jsx("planeGeometry",{args:[O,A]}),r.jsx("meshStandardMaterial",{ref:V,map:w,roughness:.3,metalness:0,emissive:"#ffffff",emissiveMap:w,emissiveIntensity:.34,toneMapped:!1})]}),r.jsxs("mesh",{position:[0,0,n/2+18e-5],renderOrder:5,children:[r.jsx("planeGeometry",{args:[O,A]}),r.jsx("shaderMaterial",{ref:v,uniforms:{uMap:{value:w},uAccentColor:{value:M.clone()},uGlow:{value:0}},vertexShader:`
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
            `,blending:Te,transparent:!0,depthWrite:!1,depthTest:!0,toneMapped:!1})]}),r.jsxs("mesh",{position:[0,0,n/2+26e-5],renderOrder:6,children:[r.jsx("planeGeometry",{args:[O,A]}),r.jsx("meshBasicMaterial",{ref:ce,map:w,transparent:!0,opacity:.34,depthWrite:!1,toneMapped:!1})]}),$?r.jsx("group",{position:[0,0,n/2+.0015],children:$}):null,r.jsxs("mesh",{"rotation-y":Math.PI,position:[0,0,-n/2-1e-4],children:[r.jsx("planeGeometry",{args:[O,A]}),r.jsx("meshStandardMaterial",{map:p,roughness:.28,metalness:0,emissive:"#ffffff",emissiveMap:p,emissiveIntensity:.4,toneMapped:!1})]})]})});ot.displayName="Card3D";const U="Manrope, ui-sans-serif, system-ui, -apple-system, sans-serif",Ot=(t,s,e)=>{const{palette:a,accent:n}=t,o={atlas:a.line,signal:n,forge:a.bright,lattice:a.mid};return s==="dark"?{bgStart:a.deep,bgEnd:a.mid,portal:o[e],trim:a.line,text:a.bright,muted:a.line,chip:a.deep,chipText:a.bright}:{bgStart:a.bright,bgEnd:a.line,portal:o[e],trim:n,text:a.deep,muted:a.mid,chip:"#ffffff",chipText:a.deep}},Le=1024,Ne=720,De=720,Ie=1024,Be=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&apos;"),Oe=(t,s,e)=>{const a=t.trim().split(/\s+/).filter(Boolean);if(!a.length)return[""];const n=[];let o="";for(const f of a){const c=o?`${o} ${f}`:f;if(c.length<=s){o=c;continue}if(o&&n.push(o),o=f,n.length===e)break}n.length<e&&o&&n.push(o),n.length>e&&(n.length=e);const d=a.join(" "),h=n.join(" ");if(d.length>h.length){const f=n.length-1;n[f]=`${n[f].replace(/\.{3}$/,"").trim()}...`}return n},te=(t,s,e)=>t.map((a,n)=>`<tspan x='${s}' dy='${n===0?0:e}'>${Be(a)}</tspan>`).join(""),Gt=(t,{min:s,max:e})=>Math.max(s,Math.min(e,44+t.trim().length*10.4)),Bt=(t,s,e="landscape",a="light")=>{const n=tt(t),o=Ot(t,a,n.frontFamily),d=Oe(t.title,24,2),h=Oe(t.subtitle,26,2),f=Oe(t.summary,40,2),c=e==="landscape",D=Gt(n.dateLabel,{min:188,max:c?336:308}),N=c?Le:De,u=c?Ne:Ie,$=c?512:360,x=c?360:512,m=c?260:250,y=c?`
  <g transform='translate(720 0) rotate(90)'>
    <rect width='${Le}' height='${Ne}' fill='url(#bg)'/>
    <rect width='${Le}' height='${Ne}' fill='url(#grid)'/>

    <rect x='20' y='20' width='984' height='680' rx='34' fill='none' stroke='${o.trim}' stroke-opacity='0.34' stroke-width='9'/>
    <rect x='20' y='20' width='984' height='680' rx='34' fill='none' stroke='${t.accent}' stroke-opacity='0.72' stroke-width='4.8'/>
    <rect x='44' y='44' width='936' height='632' rx='28' fill='none' stroke='${o.trim}' stroke-opacity='0.28' stroke-width='2.2'/>

    <ellipse cx='512' cy='360' rx='228' ry='148' fill='url(#portalGlow)'/>
    <circle cx='512' cy='360' r='108' fill='none' stroke='${t.accent}' stroke-opacity='0.44' stroke-width='4'/>
    <circle cx='512' cy='360' r='68' fill='none' stroke='${o.trim}' stroke-opacity='0.42' stroke-width='3'/>

    <text x='84' y='122' fill='${o.text}' font-family='${U}' font-size='54' font-weight='700'>
      ${te(d,84,60)}
    </text>

    <g transform='translate(84 588)'>
      <rect x='0' y='0' width='${D}' height='44' rx='22' fill='${o.chip}'/>
      <text x='18' y='29' fill='${o.muted}' font-family='${U}' font-size='18' font-weight='600'>${Be(n.dateLabel)}</text>
    </g>

    <g transform='translate(938 520)'>
      <text x='0' y='0' text-anchor='end' fill='${o.muted}' font-family='${U}' font-size='29' font-weight='600'>
        ${te(h,0,34)}
      </text>
      <text x='0' y='86' text-anchor='end' fill='${o.text}' font-family='${U}' font-size='22' font-weight='500' opacity='0.92'>
        ${te(f,0,28)}
      </text>
    </g>

    <path d='M98 440 H262' stroke='${t.accent}' stroke-opacity='0.5' stroke-width='3'/>
    <path d='M760 440 H924' stroke='${t.accent}' stroke-opacity='0.38' stroke-width='3'/>
  </g>`:`
  <g>
    <rect width='${De}' height='${Ie}' fill='url(#bg)'/>
    <rect width='${De}' height='${Ie}' fill='url(#grid)'/>

    <rect x='20' y='20' width='680' height='984' rx='34' fill='none' stroke='${o.trim}' stroke-opacity='0.34' stroke-width='9'/>
    <rect x='20' y='20' width='680' height='984' rx='34' fill='none' stroke='${t.accent}' stroke-opacity='0.72' stroke-width='4.8'/>
    <rect x='44' y='44' width='632' height='936' rx='28' fill='none' stroke='${o.trim}' stroke-opacity='0.28' stroke-width='2.2'/>

    <ellipse cx='360' cy='512' rx='206' ry='142' fill='url(#portalGlow)'/>
    <circle cx='360' cy='512' r='108' fill='none' stroke='${t.accent}' stroke-opacity='0.44' stroke-width='4'/>
    <circle cx='360' cy='512' r='68' fill='none' stroke='${o.trim}' stroke-opacity='0.42' stroke-width='3'/>

    <text x='84' y='144' fill='${o.text}' font-family='${U}' font-size='52' font-weight='700'>
      ${te(d,84,58)}
    </text>

    <g transform='translate(84 812)'>
      <rect x='0' y='0' width='${D}' height='44' rx='22' fill='${o.chip}'/>
      <text x='18' y='29' fill='${o.muted}' font-family='${U}' font-size='18' font-weight='600'>${Be(n.dateLabel)}</text>
    </g>

    <g transform='translate(636 702)'>
      <text x='0' y='0' text-anchor='end' fill='${o.muted}' font-family='${U}' font-size='27' font-weight='600'>
        ${te(h,0,32)}
      </text>
      <text x='0' y='80' text-anchor='end' fill='${o.text}' font-family='${U}' font-size='21' font-weight='500' opacity='0.92'>
        ${te(f,0,27)}
      </text>
    </g>

    <path d='M98 644 H262' stroke='${t.accent}' stroke-opacity='0.5' stroke-width='3'/>
    <path d='M458 644 H622' stroke='${t.accent}' stroke-opacity='0.38' stroke-width='3'/>
  </g>`,T=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='${N}' y2='${u}' gradientUnits='userSpaceOnUse'>
      <stop offset='0%' stop-color='${o.bgStart}'/>
      <stop offset='100%' stop-color='${o.bgEnd}'/>
    </linearGradient>
    <radialGradient id='portalGlow' cx='${$}' cy='${x}' r='${m}' gradientUnits='userSpaceOnUse'>
      <stop offset='0%' stop-color='${o.portal}' stop-opacity='0.56'/>
      <stop offset='100%' stop-color='${o.portal}' stop-opacity='0'/>
    </radialGradient>
    <pattern id='grid' width='32' height='32' patternUnits='userSpaceOnUse' patternTransform='rotate(${s*11})'>
      <path d='M16 0V32 M0 16H32' stroke='${o.trim}' stroke-opacity='0.08' stroke-width='1'/>
    </pattern>
  </defs>

  ${y}
</svg>`;return`data:image/svg+xml;utf8,${encodeURIComponent(T)}`},zt=(t,s)=>{const e=t.palette,a=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${e.deep}'/>
      <stop offset='100%' stop-color='${e.mid}'/>
    </linearGradient>
    <linearGradient id='backTrim' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${e.line}' stop-opacity='0.9'/>
      <stop offset='50%' stop-color='${e.bright}' stop-opacity='0.82'/>
      <stop offset='100%' stop-color='${e.line}' stop-opacity='0.88'/>
    </linearGradient>
    <radialGradient id='coreGlow' cx='50%' cy='50%' r='40%'>
      <stop offset='0%' stop-color='${e.bright}' stop-opacity='0.28'/>
      <stop offset='100%' stop-color='${e.bright}' stop-opacity='0'/>
    </radialGradient>
    <pattern id='grid' width='28' height='28' patternUnits='userSpaceOnUse' patternTransform='rotate(${s*9})'>
      <path d='M14 0 V28 M0 14 H28' stroke='${e.line}' stroke-opacity='0.13' stroke-width='1'/>
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
  <rect x='28' y='28' width='664' height='968' rx='28' fill='none' stroke='${e.line}' stroke-width='10' stroke-opacity='0.28'/>
  <rect x='28' y='28' width='664' height='968' rx='28' fill='none' stroke='url(#backTrim)' stroke-width='6.5' stroke-opacity='0.8'/>
  <rect x='58' y='58' width='604' height='908' rx='24' fill='none' stroke='${e.bright}' stroke-width='3.1' stroke-opacity='0.54'/>
  <path d='M102 140 H162 M102 140 V200 M618 140 H558 M618 140 V200 M102 884 H162 M102 884 V824 M618 884 H558 M618 884 V824' stroke='${e.bright}' stroke-width='2.4' stroke-linecap='round' stroke-opacity='0.58' fill='none'/>
  <g transform='translate(360 512) rotate(${s*14})'>
    <circle r='176' fill='none' stroke='${e.bright}' stroke-width='14' stroke-opacity='0.28'/>
    <circle r='132' fill='none' stroke='${e.line}' stroke-width='5' stroke-opacity='0.62'/>
    <circle r='88' fill='none' stroke='${e.bright}' stroke-width='3.4' stroke-opacity='0.78'/>
    <path d='M0-120 L20-30 L110 0 L20 30 L0 120 L-20 30 L-110 0 L-20 -30 Z' fill='${e.line}' fill-opacity='0.42'/>
    <circle r='20' fill='${e.bright}' fill-opacity='0.82'/>
  </g>
  <g transform='translate(360 512)' opacity='0.38'>
    <path d='M-250 -320 C-180 -220 -140 -120 -110 -20 C-70 120 -120 230 -220 320' stroke='${e.line}' stroke-width='2' fill='none'/>
    <path d='M250 320 C180 220 140 120 110 20 C70 -120 120 -230 220 -320' stroke='${e.line}' stroke-width='2' fill='none'/>
  </g>
  <path d='M114 122 C228 96 492 96 606 122' stroke='${e.bright}' stroke-opacity='0.36' stroke-width='2.3' fill='none'/>
  <path d='M128 902 C246 926 474 926 592 902' stroke='${e.bright}' stroke-opacity='0.34' stroke-width='2.2' fill='none'/>
  <rect width='720' height='1024' filter='url(#grain)'/>
</svg>`;return`data:image/svg+xml;utf8,${encodeURIComponent(a)}`},Yt=t=>{if(t<=0)return[];const s=Array.from({length:t},(a,n)=>n);let e=t*131+17;for(let a=s.length-1;a>0;a-=1){e=e*1664525+1013904223>>>0;const n=e%(a+1);[s[a],s[n]]=[s[n],s[a]]}return s},se=t=>Math.min(1,Math.max(0,t)),re=t=>1-Math.pow(1-t,3),oe=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,B=(t,s,e)=>se((t-s)/(e-s)),L=(t,s,e)=>E.lerp(t,s,e),Ft=(t,s)=>{const e=Math.max(0,t-4);return{dealStart:.64,dealEnd:s?Math.min(.91,.88+e*.025):Math.min(.92,.84+e*.03),flipStart:s?Math.max(.7,.72-e*.01):Math.max(.74,.78-e*.01),flipEnd:s?Math.min(.94,.86+e*.03):.98,browseStart:s?Math.min(.92,.86+e*.025):Math.min(.97,.95+e*.015),dealDelaySpan:Math.min(.5,.32+e*.045),flipDelaySpan:Math.min(.52,.35+e*.05)}},Ke=(t,s,e)=>e?{width:t,height:s,cardSpacing:s*.44,ringRx:t*.17,ringRy:s*.13,exitDropMax:s*.34,dealEntryY:s*.48,browseParallaxX:.07,browseParallaxY:.045,dealScaleMax:2.08,dealArcMax:.2,stackDepthStep:.0085,flipArcZMax:.5,flipArcYMax:.06}:{width:t,height:s,cardSpacing:s*.56,ringRx:t*.24,ringRy:s*.18,exitDropMax:s*.48,dealEntryY:s*.6,browseParallaxX:.16,browseParallaxY:.08,dealScaleMax:2.2,dealArcMax:.3,stackDepthStep:.008,flipArcZMax:.7,flipArcYMax:.12},_t=({progress:t,items:s,onCardSelect:e,onActiveProjectChange:a,lowPowerMode:n=!1,mobileViewport:o=!1,themeMode:d})=>{const{viewport:h,pointer:f,camera:c,gl:D}=Je(),N=l.useRef([]),u=l.useRef([]),$=l.useRef(null),x=l.useRef(null),m=l.useRef([]),y=l.useRef([]),T=l.useRef(Ke(h.width,h.height,o)),C=l.useRef(!1),I=l.useMemo(()=>s.map(w=>tt(w)),[s]),A=Math.min(h.width,h.height)*(o?.228:.198),Y=A*1.46,V=o?"portrait":"landscape",v=s.length,ce=l.useMemo(()=>s.map((w,p)=>({frontSrc:Bt(w,p+1,V,d),backSrc:zt(w,p+1),borderColor:d==="dark"?"#172036":"#f8fafc",edgeColor:w.accent,themeMode:d,width:A,height:Y})),[s,Y,A,V,d]),de=l.useMemo(()=>Yt(v),[v]);l.useEffect(()=>{},[s]),m.current.length!==v&&(m.current=Array.from({length:v},()=>Xe(0))),y.current.length!==v&&(y.current=Array.from({length:v},()=>Xe(0)));const he=l.useMemo(()=>s.map((w,p)=>({x:(p%2===0?-1:1)*(.46+p*.08),y:(p%3-1)*.2,lift:.12+p*.014})),[s]),ae=w=>{if(!C.current)return;const p=s[w],M=N.current[w];if(!p||!M)return;const P=new vt;M.getWorldPosition(P);const j=P.clone().project(c),g=D.domElement.getBoundingClientRect(),i=g.left+(j.x*.5+.5)*g.width,R=g.top+(-j.y*.5+.5)*g.height;e==null||e(p,{x:i,y:R})};return et((w,p)=>{const M=$.current;if(!M)return;const P=w.clock.getElapsedTime(),j=se(t.get()),g=Ke(h.width,h.height,o),i=T.current,R=1-Math.exp(-Math.min(p,.2)*10),b=Ft(v,o);i.width=L(i.width,g.width,R),i.height=L(i.height,g.height,R),i.cardSpacing=L(i.cardSpacing,g.cardSpacing,R),i.ringRx=L(i.ringRx,g.ringRx,R),i.ringRy=L(i.ringRy,g.ringRy,R),i.exitDropMax=L(i.exitDropMax,g.exitDropMax,R),i.dealEntryY=L(i.dealEntryY,g.dealEntryY,R),i.browseParallaxX=L(i.browseParallaxX,g.browseParallaxX,R),i.browseParallaxY=L(i.browseParallaxY,g.browseParallaxY,R),i.dealScaleMax=L(i.dealScaleMax,g.dealScaleMax,R),i.dealArcMax=L(i.dealArcMax,g.dealArcMax,R),i.stackDepthStep=L(i.stackDepthStep,g.stackDepthStep,R),i.flipArcZMax=L(i.flipArcZMax,g.flipArcZMax,R),i.flipArcYMax=L(i.flipArcYMax,g.flipArcYMax,R);const G=re(B(j,0,o?.3:.26)),F=re(B(j,.18,.36)),ge=re(B(j,.32,.48)),Z=oe(B(j,.44,.58)),fe=B(j,b.dealStart,b.dealEnd),z=B(j,b.flipStart,b.flipEnd),ne=oe(B(j,b.browseStart,1)),ie=oe(B(j,.62,.78)),pe=.56*oe(B(j,.88,1)),X=se(Math.max(ie,pe)),_=j>.64;C.current=j>(o?.9:.84);const le=G*(1-F),W=1-re(B(j,.56,.72)),Q=f.x,ye=f.y,st=Math.PI*.24*le,at=-Math.PI*.035*le,Ye=_?o?.008:.012:0;M.rotation.x=(st+ye*.03)*W+ye*Ye,M.rotation.y=(at+Q*.05)*W+Q*Ye;const we=i.cardSpacing,nt=(v-1)*we,Fe=ne*nt,_e=_&&v>0?E.clamp(Math.round(Fe/Math.max(we,1e-4)),0,v-1):null,ue=_e!==null?s[_e]:s[0]??null,He=(ue==null?void 0:ue.id)??null;x.current!==He&&(x.current=He,a==null||a(ue)),M.position.x=Q*i.browseParallaxX*W,M.position.y=ye*i.browseParallaxY*W+Fe;const it=i.ringRx,lt=i.ringRy,ct=(ge*.3+Z*.48)*Math.PI*2;for(let k=0;k<v;k++){const S=N.current[k];if(!S)continue;const Me=v>1?k/(v-1):0;if(y.current[k].set(X),_){const J=Me*b.dealDelaySpan,H=oe(se((fe-J)/Math.max(.01,1-J*.55))),K=re(B(fe,.82,1)),be=i.dealEntryY,me=-k*we,ve=E.lerp(be,me,H),ke=Math.sin(H*Math.PI)*i.dealArcMax,Se=-k*i.stackDepthStep;S.position.x=0,S.position.y=E.lerp(ve,me,K),S.position.z=E.lerp(ke,Se,K);const $e=o?0:Math.PI/2,q=$e*H;S.rotation.x=0;const je=(1-H)*((k%2===0?-1:1)*.08),Re=q+je;S.rotation.z=E.lerp(Re,$e,K);const xe=Me*b.flipDelaySpan,ee=oe(se((z-xe)/Math.max(.01,1-xe*.45))),Ce=Math.sin(ee*Math.PI)*i.flipArcZMax,Pe=Math.sin(ee*Math.PI)*i.flipArcYMax;S.position.z+=Ce,S.position.y+=Pe,m.current[k].set(1-ee),H>.98&&ee>.98&&(S.position.y+=Math.sin(P*1.1+k*1.3)*.01,S.position.z+=Math.cos(P*.9+k*.7)*.005),S.rotation.y=0;const Ee=E.lerp(1,i.dealScaleMax,H);S.scale.setScalar(Ee)}else{const J=he[k],H=re(se((G-Me*.44)/.56)),K=Math.sin(H*Math.PI),be=-k*.05,me=-(de[k]??k)*.055,ve=J.x*K,ke=J.y*K,Se=E.lerp(be,me,H)+J.lift*K,q=k/v*Math.PI*2+ct,je=Math.sin(q)*it,Re=Math.cos(q)*lt+.05,xe=-.06+Math.sin(q*2)*.012,ee=E.lerp(ve,je,F),Ce=E.lerp(ke,Re,F),Pe=E.lerp(Se,xe,F),Ee=i.exitDropMax*Z,dt=Math.sin(q*1.1)*.06*Z,Ue=.01+F*.022,ht=Math.sin(P*1.65+k*.82)*Ue,ft=Math.cos(P*1.2+k*.58)*Ue*.45;S.position.x=ee+dt,S.position.y=Ce-Ee+ht,S.position.z=Pe-.16*Z+ft,S.rotation.x=0,S.rotation.y=0,S.rotation.z=q*(o?.08:.1)*F,m.current[k].set(1);const pt=1+.1*F-.12*Z;S.scale.setScalar(pt)}}}),r.jsx("group",{ref:$,children:ce.map((w,p)=>{const M=s[p];return I[p],r.jsx("group",{ref:P=>{P&&(N.current[p]=P)},position:[0,0,-p*.05],children:r.jsx(ot,{ref:P=>{u.current[p]=P},...w,flip:m.current[p],edgeGlow:y.current[p],frontAttachment:void 0,isClickable:()=>C.current,onClick:()=>ae(p)})},(M==null?void 0:M.id)??`card-${p}`)})})},ze=t=>Math.min(1,Math.max(0,t)),Ht=640,Ut=140,Vt=t=>{const s=Math.max(0,t-4);return Ht+s*Ut},qe=(t,s)=>{const e=ze(t),a=Math.max(0,s-4),n=Math.min(.67,.62+a*.03),o=Math.min(.84,.76+a*.04),d=Math.min(.9,.76+a*.05),h=Math.max(.08,1-d);return e<=.12?e:e<=.3?.12+(e-.12)/.18*.3:e<=.46?.42+(e-.3)/.16*.26:e<=n?.68+(e-.46)/(n-.46)*.16:e<=o?.84+(e-n)/(o-n)*.12:e<=d?.96:.96+(e-d)/h*.04},Zt=({scrollContainer:t,items:s,onCardSelect:e,onActiveProjectChange:a,forceLowPower:n=!1,themeMode:o})=>{const d=rt(),h=l.useRef(null),f=l.useRef(0),c=l.useRef(0),D=Vt(s.length),N="projects:storyboard-scroll",u=Et(0),{scrollYProgress:$}=Tt({container:t,target:h,offset:["start start","end end"],layoutEffect:!1});At($,"change",m=>{f.current=m});const x=l.useCallback(()=>{const m=ze($.get());f.current=m,u.set(qe(m,s.length)),c.current=3},[s.length,$,u]);return l.useEffect(()=>{x()},[x]),l.useEffect(()=>{},[n,s.length,N,t,$,D]),l.useEffect(()=>{if(typeof window>"u")return;const m=()=>{x()},y=typeof ResizeObserver<"u"?new ResizeObserver(()=>{m()}):null,T=h.current,C=t.current;y&&(T&&y.observe(T),C&&y.observe(C)),window.addEventListener("resize",m);const I=window.visualViewport;return I==null||I.addEventListener("resize",m),()=>{y==null||y.disconnect(),window.removeEventListener("resize",m),I==null||I.removeEventListener("resize",m)}},[t,x]),Rt((m,y)=>{const T=qe(f.current,s.length),C=u.get();if(c.current>0){u.set(T),c.current-=1;return}const I=T<.68,O=T<.96,A=(I?3e-4:O?44e-5:78e-5)*y,Y=T-C,V=Math.sign(Y)*Math.min(Math.abs(Y),A),v=ze(C+V);u.set(v)}),r.jsx("div",{ref:h,...d,children:r.jsx(Nt,{progress:u,height:D,forceLowPower:n,themeMode:o,children:(m,y)=>r.jsx(_t,{progress:m,items:s,onCardSelect:e,onActiveProjectChange:a,lowPowerMode:y.lowPowerMode,mobileViewport:y.mobileViewport,themeMode:o})})})},Ge=(t,s)=>{const e=t.replace("#",""),a=e.length===3?e.split("").map(o=>`${o}${o}`).join(""):e,n=o=>Number.parseInt(a.slice(o,o+2),16);return`rgba(${n(0)}, ${n(2)}, ${n(4)}, ${s})`},Xt=({projects:t,themeMode:s,onOpenCaseStudy:e})=>{const a=s==="dark",n=a?{background:"rgba(2, 6, 23, 0.62)",borderColor:"rgba(148, 163, 184, 0.16)",boxShadow:"0 24px 64px -48px rgba(2, 6, 23, 0.94)"}:{background:"rgba(255, 255, 255, 0.74)",borderColor:"rgba(148, 163, 184, 0.18)",boxShadow:"0 24px 64px -54px rgba(15, 23, 42, 0.26)"};return r.jsx("section",{className:"relative z-20 mx-auto w-full max-w-6xl px-6 pb-28 pt-8 sm:pt-14",children:r.jsxs("div",{className:"mx-auto max-w-4xl",children:[r.jsx("p",{className:"theme-text-subtle text-[0.76rem] uppercase tracking-[0.28em]",children:"Case Study Directory"}),r.jsx("h2",{className:"theme-text-primary mt-4 text-[1.9rem] font-semibold leading-[0.98] tracking-[-0.05em] sm:text-[2.5rem]",children:"Open a route when you want the editorial version."}),r.jsx("div",{className:"mt-8 overflow-hidden rounded-[1.8rem] border p-2 sm:p-3",style:n,children:r.jsx("div",{className:"space-y-2",children:t.map((o,d)=>{const h=o.metrics[0];return r.jsx("button",{type:"button",className:"group w-full rounded-[1.35rem] border px-4 py-4 text-left transition duration-200 hover:translate-y-[-1px] sm:px-5",style:{borderColor:Ge(o.accent,.14),background:a?"rgba(15, 23, 42, 0.34)":"rgba(255, 255, 255, 0.56)"},onClick:()=>e(o),children:r.jsxs("div",{className:"flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",children:[r.jsxs("div",{className:"flex min-w-0 items-start gap-4",children:[r.jsx("div",{className:"flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[0.7rem] font-semibold uppercase tracking-[0.18em] theme-text-subtle",style:{borderColor:Ge(o.accent,.2),background:Ge(o.accent,a?.08:.05)},children:String(d+1).padStart(2,"0")}),r.jsxs("div",{className:"min-w-0",children:[r.jsx("p",{className:"theme-text-subtle text-[0.66rem] font-semibold uppercase tracking-[0.22em]",children:o.hero.eyebrow}),r.jsx("h3",{className:"theme-text-primary mt-2 text-[1.12rem] font-semibold leading-tight tracking-[-0.03em] sm:text-[1.2rem]",children:o.title}),r.jsx("p",{className:"theme-text-muted mt-2 max-w-2xl text-[0.92rem] leading-relaxed",children:o.hero.thesis})]})]}),r.jsxs("div",{className:"flex shrink-0 items-center justify-between gap-5 sm:justify-end",children:[r.jsxs("div",{className:"text-left sm:text-right",children:[r.jsx("p",{className:"theme-text-primary text-[0.96rem] font-semibold tracking-[-0.03em]",children:h.value}),r.jsx("p",{className:"theme-text-subtle mt-1 text-[0.64rem] uppercase tracking-[0.18em]",children:h.label})]}),r.jsx("div",{className:"theme-text-subtle text-[0.68rem] font-semibold uppercase tracking-[0.2em] transition-transform duration-200 group-hover:translate-x-1",children:"Open"})]})]})},o.id)})})})]})})},ar=({themeMode:t,navInteractionTick:s,onNavigate:e})=>{const a=rt(),[n,o]=l.useState(!0),d=$t.projects,h=kt();l.useEffect(()=>{const c=window.setTimeout(()=>{o(!1)},900);return()=>window.clearTimeout(c)},[]);const f=l.useCallback(c=>{e(St(c.slug),{color:c.accent,direction:"down",intensity:"lite",duration:620})},[e]);return r.jsx(Lt,{backgroundClassName:d.backgroundClassName,footerBackgroundColor:d.footerBackgroundColor,footerRunwayVh:d.footerRunwayVh,children:c=>r.jsxs("div",{...a,className:"relative isolate",children:[r.jsx("div",{className:"pointer-events-none absolute inset-0 z-0","aria-hidden":!0,children:r.jsxs("div",{className:"sticky top-0 h-[100svh]",children:[r.jsx(jt,{effectId:d.backdropEffectId,quality:d.backdropQuality,interactionMode:d.backdropInteractionMode,styleSeed:d.backdropStyleSeed,className:d.backdropClassName}),d.backdropOverlayClassName?r.jsx("div",{className:d.backdropOverlayClassName}):null]})}),r.jsx(Ct,{scrollContainerRef:c,navInteractionTick:s,isTouch:h,navInteractionLockMs:2e3,dismissAllThresholdPx:typeof window>"u"?void 0:window.innerHeight,visitStorageKey:"projects-onboarding-hints-seen"}),r.jsxs("div",{className:"relative z-10",children:[r.jsxs("header",{className:"theme-text-primary relative z-20 mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 pt-24",children:[r.jsx("p",{className:"theme-text-subtle text-[0.78rem] uppercase tracking-[0.3em]",children:Ae.eyebrow}),r.jsx("h1",{className:"max-w-4xl text-4xl font-semibold leading-[0.94] tracking-[-0.05em] xs:text-5xl sm:text-6xl",children:Ae.title}),r.jsx("p",{className:"theme-text-muted max-w-3xl text-[1rem] leading-relaxed sm:text-[1.06rem]",children:Ae.summary})]}),r.jsx("div",{className:"relative mt-10",children:r.jsx(Zt,{scrollContainer:c,items:We,onCardSelect:f,forceLowPower:n,themeMode:t})}),r.jsx(Xt,{projects:We,themeMode:t,onOpenCaseStudy:f})]})]})})};export{ar as default};
