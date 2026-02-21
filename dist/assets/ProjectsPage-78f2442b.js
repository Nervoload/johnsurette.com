import{a as He,r as d,u as U,j as e,C as mt,b as Xe}from"./vendor-react-f1ef5386.js";import{r as st,D as gt,d as xt,p as yt}from"./projectData-cd159072.js";import{Q as Ke,r as qe,X as Qe,e as Mt,c as wt,a2 as vt,M as bt,P as kt,v as jt,O as $t,C as ne,a0 as rt,a1 as Rt,a3 as St,a4 as Pt,a5 as Ct,Z as Ie,a6 as At,a7 as Je,g as E,V as q,K as Tt,$ as Et,D as Bt}from"./vendor-three-core-247151ed.js";import{C as Lt}from"./CanvasErrorBoundary-2640f12f.js";import{E as zt,R as It,U as Gt}from"./vendor-three-extras-ea52043d.js";import{d as Ge}from"./vendor-misc-6f88f977.js";import{c as Dt,a as Nt,b as _t,d as Ot,A as Yt,m as De}from"./vendor-motion-5c402cdc.js";import{P as Ft}from"./PageScaffold-b7cce978.js";const Ut=({enabled:t=!0,strength:o=.32,radius:i=.72,threshold:c=.88})=>{const{gl:s,scene:p,camera:h,size:u}=He(),l=d.useRef(!1),r=d.useMemo(()=>{try{const n=s.getPixelRatio(),a=Math.max(1,Math.floor(u.width*n)),f=Math.max(1,Math.floor(u.height*n)),g=new Ke(a,f,{format:qe,type:Qe,depthBuffer:!0,stencilBuffer:!1}),x=new Ke(a,f,{format:qe,type:Qe,depthBuffer:!0,stencilBuffer:!1}),w=new zt(s,x);w.renderToScreen=!1;const M=new It(p,h);M.clear=!0,M.clearAlpha=0,w.addPass(M);const C=new Gt(new Mt(a,f),o,i,c);w.addPass(C);const G=new wt({uniforms:{tBase:{value:g.texture},tBloomCombined:{value:w.readBuffer.texture}},vertexShader:`
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.0, 1.0);
          }
        `,fragmentShader:`
          #include <common>
          varying vec2 vUv;
          uniform sampler2D tBase;
          uniform sampler2D tBloomCombined;

          void main() {
            vec4 base = texture2D(tBase, vUv);
            vec3 bloomCombined = texture2D(tBloomCombined, vUv).rgb;
            vec3 bloomOnly = max(bloomCombined - base.rgb, vec3(0.0));
            vec3 finalRgb = base.rgb + bloomOnly;
            gl_FragColor = vec4(finalRgb, base.a);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }
        `,depthWrite:!1,depthTest:!1,transparent:!0,blending:vt}),R=new bt(new kt(2,2),G),z=new jt,H=new $t(-1,1,1,-1,0,1);return z.add(R),{baseTarget:g,composer:w,bloomPass:C,compositeScene:z,compositeCamera:H,compositeMaterial:G,compositeMesh:R}}catch(n){return console.error("[SceneBloom] Failed to initialize bloom pipeline.",n),null}},[s,p,h,u.width,u.height,o,i,c]);return d.useEffect(()=>{l.current=!1},[r]),d.useEffect(()=>{if(!r)return;const n=s.getPixelRatio(),a=Math.max(1,Math.floor(u.width*n)),f=Math.max(1,Math.floor(u.height*n));r.baseTarget.setSize(a,f),r.composer.setSize(u.width,u.height),r.compositeMaterial.uniforms.tBase.value=r.baseTarget.texture,r.compositeMaterial.uniforms.tBloomCombined.value=r.composer.readBuffer.texture},[r,s,u.width,u.height]),d.useEffect(()=>{r&&(r.bloomPass.enabled=t,r.bloomPass.strength=o,r.bloomPass.radius=i,r.bloomPass.threshold=c)},[r,t,o,i,c]),d.useEffect(()=>()=>{r&&(r.bloomPass.dispose(),r.composer.dispose(),r.baseTarget.dispose(),r.compositeMesh.geometry.dispose(),r.compositeMaterial.dispose())},[r]),U(n=>{const a=n.gl,f=a.autoClear,g=a.getClearAlpha(),x=a.getClearColor(new ne).clone(),w=()=>{a.setRenderTarget(null),a.autoClear=!0,a.setClearColor(x,0),a.clear(!0,!0,!0),a.render(p,h)};try{if(!t||!r||l.current){w();return}a.autoClear=!0,a.setRenderTarget(r.baseTarget),a.setClearColor(x,0),a.clear(!0,!0,!0),a.render(p,h),r.composer.render(),r.compositeMaterial.uniforms.tBloomCombined.value=r.composer.readBuffer.texture,a.setRenderTarget(null),a.setClearColor(x,0),a.clear(!0,!0,!0),a.render(r.compositeScene,r.compositeCamera)}catch(M){l.current=!0,console.error("[SceneBloom] Runtime bloom failure; falling back to base render.",M),w()}finally{a.setClearColor(x,g),a.autoClear=f}},1),null},Ht=({progress:t,height:o=200,forceLowPower:i=!1,children:c})=>{const[s,p]=d.useState(!1),[h,u]=d.useState(!1);d.useEffect(()=>{if(typeof window>"u")return;const n=window.matchMedia("(max-width: 900px)"),a=window.matchMedia("(prefers-reduced-motion: reduce)"),f=()=>{p(n.matches),u(a.matches)};return f(),n.addEventListener?(n.addEventListener("change",f),a.addEventListener("change",f)):(n.addListener(f),a.addListener(f)),()=>{n.removeEventListener?(n.removeEventListener("change",f),a.removeEventListener("change",f)):(n.removeListener(f),a.removeListener(f))}},[]);const l=h||i,r=o;return e.jsx("section",{style:{height:`${r}vh`},className:"relative",children:e.jsxs("div",{className:"sticky top-0 h-[100svh] overflow-hidden",children:[e.jsx("div",{className:"pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(191,219,254,0.34),transparent_46%),radial-gradient(circle_at_78%_20%,rgba(196,181,253,0.26),transparent_42%),linear-gradient(165deg,rgba(255,255,255,0.58),rgba(248,250,252,0.56)_58%,rgba(238,242,247,0.62))]"}),e.jsx("div",{className:"pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_72%,rgba(148,163,184,0.12),transparent_58%)]"}),e.jsx(Lt,{children:e.jsxs(mt,{className:"absolute inset-0 h-full w-full",camera:{position:[0,.14,6.15],fov:43},dpr:l?[1,1.5]:[1,2],shadows:!1,gl:{preserveDrawingBuffer:!1,antialias:!l,powerPreference:"high-performance",alpha:!0},onCreated:({gl:n})=>{n.outputColorSpace=rt,Rt.enabled=!0,n.shadowMap.enabled=!1,n.setClearColor(16777215,0)},children:[e.jsx("fog",{attach:"fog",args:["#f8fafc",8,24]}),e.jsx("ambientLight",{intensity:.72}),e.jsx("spotLight",{position:[0,5.2,2.6],angle:.56,penumbra:.66,intensity:l?1.45:1.68,distance:26}),e.jsx("directionalLight",{position:[2.8,2.6,2.4],intensity:.45}),e.jsx("directionalLight",{position:[-3.2,1.4,-2.8],intensity:.18}),e.jsx(Ut,{enabled:!l}),e.jsx("group",{scale:1.14,position:[0,.02,0],children:c(t,{lowPowerMode:l,mobileViewport:s})})]})}),e.jsx("div",{className:"pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent to-slate-50"})]})})},Vt="data:image/svg+xml;utf8,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'><rect width='720' height='1024' fill='#f8fafc'/><rect x='36' y='36' width='648' height='952' rx='28' fill='none' stroke='#94a3b8' stroke-width='8'/></svg>"),Zt="data:image/svg+xml;utf8,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#103a8a'/><stop offset='100%' stop-color='#1f5fd8'/></linearGradient></defs><rect width='720' height='1024' fill='url(#g)'/></svg>"),ot=d.forwardRef(({frontSrc:t,backSrc:o,width:i,height:c,thickness:s=.02,borderColor:p="#e0e0e0",edgeColor:h,edgeGlow:u,flip:l,pop:r,popScale:n=1.15,onClick:a,isClickable:f,frontAttachment:g,...x},w)=>{const{viewport:M,gl:C}=He(),G=Math.min(M.width,M.height),R=i??G*.08,z=c??R*1.4,H=d.useRef(null),he=d.useRef(null),A=d.useRef(null),me=d.useRef(null),ge=d.useRef(null),xe=d.useRef(null),ie=d.useRef(!1);d.useImperativeHandle(w,()=>H.current,[]);const $=Xe(Je,t??Vt),y=Xe(Je,o??Zt),v=d.useMemo(()=>new ne(h??p),[h,p]),B=d.useMemo(()=>{const L=new St(R+.016,z+.016,s+.012),T=new Pt(L);return L.dispose(),T},[R,z,s]);d.useMemo(()=>{const L=C.capabilities.getMaxAnisotropy();for(const T of[$,y])T.colorSpace=rt,T.anisotropy=L,T.minFilter=Ct,T.needsUpdate=!0},[$,y,C]),U(()=>{var Z,ee,te;const L=H.current;if(!L)return;const T=((Z=l==null?void 0:l.get)==null?void 0:Z.call(l))??0;L.rotation.y=Math.PI*T;const be=((ee=r==null?void 0:r.get)==null?void 0:ee.call(r))??0,V=1+(n-1)*be;L.scale.setScalar(V);const ye=((te=u==null?void 0:u.get)==null?void 0:te.call(u))??0,ke=ie.current?2.15:1,N=E.clamp(ye*ke,0,1.9),le=he.current;le&&(le.emissive.setRGB(1,1,1),le.emissiveIntensity=.24+N*.2);const ce=A.current;ce&&(ce.uniforms.uAccentColor.value.copy(v),ce.uniforms.uGlow.value=E.clamp(N*.52,0,1.1));const Me=me.current;Me&&(Me.opacity=E.clamp(.34+N*.22,.34,.76));const Y=ge.current;Y&&(Y.opacity=E.clamp(N*.64,0,.95),Y.color.copy(v).multiplyScalar(.95+N*2.3),Y.visible=Y.opacity>.01);const F=xe.current;F&&(F.uniforms.uColor.value.copy(v),F.uniforms.uOpacity.value=E.clamp(N*.28,0,.48),F.uniforms.uStrength.value=.85+N*1.7,F.visible=N>.01)}),d.useEffect(()=>()=>{C.domElement.style.cursor="auto"},[C]),d.useEffect(()=>()=>{B.dispose()},[B]);const b=()=>f?f():!0,k=L=>{ie.current=!0,a&&b()?(L.stopPropagation(),C.domElement.style.cursor="pointer"):C.domElement.style.cursor="auto"},m=()=>{ie.current=!1,C.domElement.style.cursor="auto"},P=L=>{!a||!b()||(L.stopPropagation(),a())};return e.jsxs("group",{ref:H,...x,children:[e.jsxs("mesh",{renderOrder:2,children:[e.jsx("boxGeometry",{args:[R+.03,z+.03,s+.04]}),e.jsx("shaderMaterial",{ref:xe,uniforms:{uColor:{value:v.clone()},uOpacity:{value:0},uStrength:{value:.7}},vertexShader:`
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
            `,blending:Ie,transparent:!0,depthWrite:!1,depthTest:!0,side:At,toneMapped:!1})]}),e.jsx("lineSegments",{geometry:B,renderOrder:3,children:e.jsx("lineBasicMaterial",{ref:ge,color:v,transparent:!0,opacity:0,blending:Ie,depthWrite:!1,toneMapped:!1})}),e.jsxs("mesh",{castShadow:!0,children:[e.jsx("boxGeometry",{args:[R,z,s]}),e.jsx("meshStandardMaterial",{color:p,metalness:.08,roughness:.52})]}),e.jsxs("mesh",{position:[0,0,s/2+1e-4],onPointerOver:k,onPointerOut:m,onClick:P,children:[e.jsx("planeGeometry",{args:[R,z]}),e.jsx("meshStandardMaterial",{ref:he,map:$,roughness:.3,metalness:0,emissive:"#ffffff",emissiveMap:$,emissiveIntensity:.34,toneMapped:!1})]}),e.jsxs("mesh",{position:[0,0,s/2+18e-5],renderOrder:5,children:[e.jsx("planeGeometry",{args:[R,z]}),e.jsx("shaderMaterial",{ref:A,uniforms:{uMap:{value:$},uAccentColor:{value:v.clone()},uGlow:{value:0}},vertexShader:`
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
            `,blending:Ie,transparent:!0,depthWrite:!1,depthTest:!0,toneMapped:!1})]}),e.jsxs("mesh",{position:[0,0,s/2+26e-5],renderOrder:6,children:[e.jsx("planeGeometry",{args:[R,z]}),e.jsx("meshBasicMaterial",{ref:me,map:$,transparent:!0,opacity:.34,depthWrite:!1,toneMapped:!1})]}),g?e.jsx("group",{position:[0,0,s/2+.0015],children:g}):null,e.jsxs("mesh",{"rotation-y":Math.PI,position:[0,0,-s/2-1e-4],children:[e.jsx("planeGeometry",{args:[R,z]}),e.jsx("meshStandardMaterial",{map:y,roughness:.28,metalness:0,emissive:"#ffffff",emissiveMap:y,emissiveIntensity:.4,toneMapped:!1})]})]})});ot.displayName="Card3D";const fe=t=>Math.min(1,Math.max(0,t)),de=t=>typeof t=="number"?t:t.get(),O=()=>{},pe=.08,ue=(t,o)=>d.useMemo(()=>({accent:new ne(t),deep:new ne(o.deep),mid:new ne(o.mid),bright:new ne(o.bright)}),[t,o.deep,o.mid,o.bright]),Wt=({reveal:t,intensity:o,accent:i,palette:c})=>{const s=d.useRef(null),p=d.useRef([]),h=ue(i,c);return U(({clock:u})=>{const l=s.current;if(!l)return;const r=fe(de(t)),n=r>pe;if(l.visible=n,!n)return;const a=u.elapsedTime,f=(.7+r*.6)*(.9+o*.12);l.scale.setScalar(f),l.rotation.y=a*.55,l.rotation.x=Math.sin(a*.7)*.12,l.position.z=.1+r*.5,l.position.y=.02+Math.sin(a*1.2)*.04;const g=.44+r*.26;p.current.forEach((x,w)=>{if(!x)return;const M=a*(1.8+w*.22)+w*(Math.PI*.66);x.position.set(Math.cos(M)*g,Math.sin(M*1.08)*g*.58,Math.sin(M*.72)*.22)})}),e.jsxs("group",{ref:s,position:[0,.04,.2],children:[e.jsxs("mesh",{raycast:O,children:[e.jsx("icosahedronGeometry",{args:[.19,2]}),e.jsx("meshStandardMaterial",{color:h.mid,emissive:h.accent,emissiveIntensity:.56,metalness:.1,roughness:.38,toneMapped:!1})]}),e.jsxs("mesh",{rotation:[Math.PI/2,0,0],raycast:O,children:[e.jsx("torusGeometry",{args:[.55,.03,18,84]}),e.jsx("meshStandardMaterial",{color:h.accent,emissive:h.accent,emissiveIntensity:.72,transparent:!0,opacity:.88,metalness:.05,roughness:.42,toneMapped:!1})]}),Array.from({length:4}).map((u,l)=>e.jsxs("mesh",{raycast:O,ref:r=>{p.current[l]=r},children:[e.jsx("sphereGeometry",{args:[.07,16,16]}),e.jsx("meshStandardMaterial",{color:h.bright,emissive:h.accent,emissiveIntensity:.9,toneMapped:!1})]},`orbital-satellite-${l}`))]})},Xt=({reveal:t,intensity:o,accent:i,palette:c})=>{const s=d.useRef(null),p=d.useRef([]),h=ue(i,c),u=d.useMemo(()=>[-.48,-.32,-.16,0,.16,.32,.48],[]);return U(({clock:l})=>{const r=s.current;if(!r)return;const n=fe(de(t)),a=n>pe;if(r.visible=a,!a)return;const f=l.elapsedTime;r.scale.setScalar(.7+n*.52),r.position.z=.08+n*.44,r.rotation.y=Math.sin(f*.82)*.09,r.rotation.x=-.12+Math.sin(f*.56)*.06,p.current.forEach((g,x)=>{if(!g)return;const M=.54+(.28+.72*(.5+.5*Math.sin(f*2.8+x*.66)))*(.85+o*.28);g.scale.y=M,g.position.y=-.08+M*.18,g.position.z=Math.sin(f*1.2+x)*.05})}),e.jsx("group",{ref:s,position:[0,-.04,.14],children:u.map((l,r)=>e.jsxs("mesh",{raycast:O,ref:n=>{p.current[r]=n},position:[l,0,0],children:[e.jsx("boxGeometry",{args:[.09,.36,.09]}),e.jsx("meshStandardMaterial",{color:r%2===0?h.mid:h.accent,emissive:h.accent,emissiveIntensity:.64,metalness:.08,roughness:.34,toneMapped:!1})]},`spine-${r}`))})},Kt=({reveal:t,intensity:o,accent:i,palette:c})=>{const s=d.useRef(null),p=ue(i,c),h=d.useMemo(()=>[new q(-.42,.08,0),new q(-.16,.28,.14),new q(.18,.2,-.08),new q(.44,.04,.04),new q(-.08,-.2,.1),new q(.28,-.26,-.03)],[]),u=d.useMemo(()=>{const l=[[0,1],[1,2],[2,3],[1,4],[4,5],[2,5],[0,4]],r=new Float32Array(l.length*6);l.forEach(([a,f],g)=>{r[g*6]=h[a].x,r[g*6+1]=h[a].y,r[g*6+2]=h[a].z,r[g*6+3]=h[f].x,r[g*6+4]=h[f].y,r[g*6+5]=h[f].z});const n=new Tt;return n.setAttribute("position",new Et(r,3)),n},[h]);return d.useEffect(()=>()=>{u.dispose()},[u]),U(({clock:l})=>{const r=s.current;if(!r)return;const n=fe(de(t)),a=n>pe;if(r.visible=a,!a)return;const f=l.elapsedTime;r.scale.setScalar((.7+n*.64)*(.95+o*.1)),r.rotation.y=f*.42,r.rotation.x=Math.sin(f*.72)*.08,r.position.z=.14+n*.46,r.position.y=Math.sin(f*1.1)*.03}),e.jsxs("group",{ref:s,position:[0,0,.2],children:[e.jsx("lineSegments",{geometry:u,raycast:O,children:e.jsx("lineBasicMaterial",{color:p.accent,transparent:!0,opacity:.72,toneMapped:!1})}),h.map((l,r)=>e.jsxs("mesh",{position:[l.x,l.y,l.z],raycast:O,children:[e.jsx("sphereGeometry",{args:[.06+r%2*.012,16,16]}),e.jsx("meshStandardMaterial",{color:r%2===0?p.bright:p.mid,emissive:p.accent,emissiveIntensity:.74,toneMapped:!1})]},`node-${r}`))]})},qt=({reveal:t,intensity:o,accent:i,palette:c})=>{const s=d.useRef(null),p=ue(i,c);return U(({clock:h})=>{const u=s.current;if(!u)return;const l=fe(de(t)),r=l>pe;if(u.visible=r,!r)return;const n=h.elapsedTime;u.scale.setScalar((.72+l*.58)*(.96+o*.08)),u.rotation.z=Math.sin(n*.62)*.16,u.rotation.y=n*.52,u.position.z=.12+l*.48,u.position.y=-.03+Math.sin(n*1.5)*.04}),e.jsxs("group",{ref:s,position:[0,-.02,.2],children:[e.jsxs("mesh",{raycast:O,children:[e.jsx("torusKnotGeometry",{args:[.34,.07,140,18,2,3]}),e.jsx("meshStandardMaterial",{color:p.mid,emissive:p.accent,emissiveIntensity:.82,metalness:.22,roughness:.32,toneMapped:!1})]}),e.jsxs("mesh",{rotation:[Math.PI/2,0,0],raycast:O,children:[e.jsx("ringGeometry",{args:[.46,.56,64]}),e.jsx("meshBasicMaterial",{color:p.accent,transparent:!0,opacity:.28,toneMapped:!1,side:Bt})]})]})},Qt=({reveal:t,intensity:o,accent:i,palette:c})=>{const s=d.useRef(null),p=d.useRef([]),h=ue(i,c),u=d.useMemo(()=>{const l=[];for(let n=0;n<3;n+=1)for(let a=0;a<3;a+=1)l.push([(a-1)*.22,(n-1)*.22*.78,0]);return l},[]);return U(({clock:l})=>{const r=s.current;if(!r)return;const n=fe(de(t)),a=n>pe;if(r.visible=a,!a)return;const f=l.elapsedTime;r.scale.setScalar((.78+n*.55)*(.93+o*.12)),r.rotation.y=Math.sin(f*.72)*.2,r.position.z=.12+n*.45,r.position.y=-.02+Math.sin(f*1.24)*.03,p.current.forEach((g,x)=>{if(!g)return;const M=.44+(.35+.65*(.5+.5*Math.sin(f*2.4+x*.44)))*(.72+o*.34);g.scale.y=M,g.position.z=Math.sin(f*1.1+x*.22)*.04,g.position.y=u[x][1]-.12+M*.12})}),e.jsx("group",{ref:s,position:[0,.04,.2],children:u.map(([l,r,n],a)=>e.jsxs("mesh",{raycast:O,ref:f=>{p.current[a]=f},position:[l,r,n],children:[e.jsx("cylinderGeometry",{args:[.045,.045,.28,14]}),e.jsx("meshStandardMaterial",{color:a%2===0?h.mid:h.bright,emissive:h.accent,emissiveIntensity:.66,roughness:.32,metalness:.18,toneMapped:!1})]},`pillar-${a}`))})},Jt=t=>{switch(t.preset){case"orbitalCore":return e.jsx(Wt,{...t});case"dataSpines":return e.jsx(Xt,{...t});case"nodeConstellation":return e.jsx(Kt,{...t});case"ribbonArc":return e.jsx(qt,{...t});case"pillarArray":return e.jsx(Qt,{...t});default:return null}},es={atlas:{bgStart:"#fcfdff",bgEnd:"#eef5ff",portal:"#dbeafe",trim:"#60a5fa",text:"#0f172a",muted:"#475569",chip:"#e2e8f0",chipText:"#334155"},signal:{bgStart:"#f0fdff",bgEnd:"#e0f2fe",portal:"#bae6fd",trim:"#0ea5e9",text:"#082f49",muted:"#155e75",chip:"#d9f8ff",chipText:"#0c4a6e"},forge:{bgStart:"#faf5ff",bgEnd:"#f3e8ff",portal:"#e9d5ff",trim:"#a855f7",text:"#3b0764",muted:"#6b21a8",chip:"#f3e8ff",chipText:"#581c87"},lattice:{bgStart:"#f0fdf4",bgEnd:"#dcfce7",portal:"#bbf7d0",trim:"#22c55e",text:"#052e16",muted:"#166534",chip:"#dcfce7",chipText:"#14532d"}},ts={Active:{bg:"#dcfce7",fg:"#166534"},"In Progress":{bg:"#e0f2fe",fg:"#0c4a6e"},Paused:{bg:"#ffedd5",fg:"#9a3412"},Archived:{bg:"#e2e8f0",fg:"#334155"}},Ne=1024,_e=720,Oe=720,Ye=1024,Q=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&apos;"),Fe=(t,o,i)=>{const c=t.trim().split(/\s+/).filter(Boolean);if(!c.length)return[""];const s=[];let p="";for(const l of c){const r=p?`${p} ${l}`:l;if(r.length<=o){p=r;continue}if(p&&s.push(p),p=l,s.length===i)break}s.length<i&&p&&s.push(p),s.length>i&&(s.length=i);const h=c.join(" "),u=s.join(" ");if(h.length>u.length){const l=s.length-1;s[l]=`${s[l].replace(/\.{3}$/,"").trim()}...`}return s},ss=t=>{const o=t.trim().split(/\s+/).filter(Boolean);return o.length?o.length===1?o[0].slice(0,2).toUpperCase():`${o[0][0]}${o[1][0]}`.toUpperCase():"PR"},re=(t,o,i)=>t.map((c,s)=>`<tspan x='${o}' dy='${s===0?0:i}'>${Q(c)}</tspan>`).join(""),rs=(t,o,i="landscape")=>{const c=st(t),s=es[c.frontFamily],p=ts[c.status],h=Fe(t.title,24,2),u=Fe(t.subtitle,26,2),l=Fe(t.summary,40,2),r=ss(t.title),n=Math.min(280,38+c.status.length*9),a=Math.min(184,36+c.dateLabel.length*9),f=i==="landscape",g=f?Ne:Oe,x=f?_e:Ye,w=f?512:360,M=f?360:512,C=f?260:250,G=f?`
  <g transform='translate(720 0) rotate(90)'>
    <rect width='${Ne}' height='${_e}' fill='url(#bg)'/>
    <rect width='${Ne}' height='${_e}' fill='url(#grid)'/>

    <rect x='20' y='20' width='984' height='680' rx='34' fill='none' stroke='${s.trim}' stroke-opacity='0.34' stroke-width='9'/>
    <rect x='20' y='20' width='984' height='680' rx='34' fill='none' stroke='${t.accent}' stroke-opacity='0.72' stroke-width='4.8'/>
    <rect x='44' y='44' width='936' height='632' rx='28' fill='none' stroke='${s.trim}' stroke-opacity='0.28' stroke-width='2.2'/>

    <ellipse cx='512' cy='360' rx='228' ry='148' fill='url(#portalGlow)'/>
    <circle cx='512' cy='360' r='108' fill='none' stroke='${t.accent}' stroke-opacity='0.44' stroke-width='4'/>
    <circle cx='512' cy='360' r='68' fill='none' stroke='${s.trim}' stroke-opacity='0.42' stroke-width='3'/>

    <path d='M84 86 H150 M84 86 V152 M940 86 H874 M940 86 V152 M84 634 H150 M84 634 V568 M940 634 H874 M940 634 V568' stroke='${t.accent}' stroke-opacity='0.62' stroke-width='2.2' stroke-linecap='round' fill='none'/>

    <text x='84' y='122' fill='${s.text}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='54' font-weight='700'>
      ${re(h,84,60)}
    </text>

    <g transform='translate(852 74)'>
      <rect width='96' height='96' rx='24' fill='${s.chip}'/>
      <rect x='1.5' y='1.5' width='93' height='93' rx='22.5' fill='none' stroke='${t.accent}' stroke-opacity='0.54'/>
      <text x='48' y='58' text-anchor='middle' fill='${s.chipText}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='33' font-weight='700'>${Q(r)}</text>
    </g>

    <g transform='translate(84 588)'>
      <rect x='0' y='0' width='${a}' height='44' rx='22' fill='${s.chip}'/>
      <text x='18' y='29' fill='${s.muted}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='18' font-weight='600'>${Q(c.dateLabel)}</text>

      <rect x='${a+12}' y='0' width='${n}' height='44' rx='22' fill='${p.bg}'/>
      <text x='${a+30}' y='29' fill='${p.fg}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='18' font-weight='700'>${Q(c.status)}</text>
    </g>

    <g transform='translate(938 520)'>
      <text x='0' y='0' text-anchor='end' fill='${s.muted}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='29' font-weight='600'>
        ${re(u,0,34)}
      </text>
      <text x='0' y='86' text-anchor='end' fill='${s.text}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='22' font-weight='500' opacity='0.92'>
        ${re(l,0,28)}
      </text>
    </g>

    <path d='M98 440 H262' stroke='${t.accent}' stroke-opacity='0.5' stroke-width='3'/>
    <path d='M760 440 H924' stroke='${t.accent}' stroke-opacity='0.38' stroke-width='3'/>
  </g>`:`
  <g>
    <rect width='${Oe}' height='${Ye}' fill='url(#bg)'/>
    <rect width='${Oe}' height='${Ye}' fill='url(#grid)'/>

    <rect x='20' y='20' width='680' height='984' rx='34' fill='none' stroke='${s.trim}' stroke-opacity='0.34' stroke-width='9'/>
    <rect x='20' y='20' width='680' height='984' rx='34' fill='none' stroke='${t.accent}' stroke-opacity='0.72' stroke-width='4.8'/>
    <rect x='44' y='44' width='632' height='936' rx='28' fill='none' stroke='${s.trim}' stroke-opacity='0.28' stroke-width='2.2'/>

    <ellipse cx='360' cy='512' rx='206' ry='142' fill='url(#portalGlow)'/>
    <circle cx='360' cy='512' r='108' fill='none' stroke='${t.accent}' stroke-opacity='0.44' stroke-width='4'/>
    <circle cx='360' cy='512' r='68' fill='none' stroke='${s.trim}' stroke-opacity='0.42' stroke-width='3'/>

    <path d='M84 130 H150 M84 130 V196 M636 130 H570 M636 130 V196 M84 894 H150 M84 894 V828 M636 894 H570 M636 894 V828' stroke='${t.accent}' stroke-opacity='0.62' stroke-width='2.2' stroke-linecap='round' fill='none'/>

    <text x='84' y='144' fill='${s.text}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='52' font-weight='700'>
      ${re(h,84,58)}
    </text>

    <g transform='translate(584 84)'>
      <rect width='96' height='96' rx='24' fill='${s.chip}'/>
      <rect x='1.5' y='1.5' width='93' height='93' rx='22.5' fill='none' stroke='${t.accent}' stroke-opacity='0.54'/>
      <text x='48' y='58' text-anchor='middle' fill='${s.chipText}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='33' font-weight='700'>${Q(r)}</text>
    </g>

    <g transform='translate(84 812)'>
      <rect x='0' y='0' width='${a}' height='44' rx='22' fill='${s.chip}'/>
      <text x='18' y='29' fill='${s.muted}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='18' font-weight='600'>${Q(c.dateLabel)}</text>

      <rect x='${a+12}' y='0' width='${n}' height='44' rx='22' fill='${p.bg}'/>
      <text x='${a+30}' y='29' fill='${p.fg}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='18' font-weight='700'>${Q(c.status)}</text>
    </g>

    <g transform='translate(636 702)'>
      <text x='0' y='0' text-anchor='end' fill='${s.muted}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='27' font-weight='600'>
        ${re(u,0,32)}
      </text>
      <text x='0' y='80' text-anchor='end' fill='${s.text}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='21' font-weight='500' opacity='0.92'>
        ${re(l,0,27)}
      </text>
    </g>

    <path d='M98 644 H262' stroke='${t.accent}' stroke-opacity='0.5' stroke-width='3'/>
    <path d='M458 644 H622' stroke='${t.accent}' stroke-opacity='0.38' stroke-width='3'/>
  </g>`,R=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='${g}' y2='${x}' gradientUnits='userSpaceOnUse'>
      <stop offset='0%' stop-color='${s.bgStart}'/>
      <stop offset='100%' stop-color='${s.bgEnd}'/>
    </linearGradient>
    <radialGradient id='portalGlow' cx='${w}' cy='${M}' r='${C}' gradientUnits='userSpaceOnUse'>
      <stop offset='0%' stop-color='${s.portal}' stop-opacity='0.56'/>
      <stop offset='100%' stop-color='${s.portal}' stop-opacity='0'/>
    </radialGradient>
    <pattern id='grid' width='32' height='32' patternUnits='userSpaceOnUse' patternTransform='rotate(${o*11})'>
      <path d='M16 0V32 M0 16H32' stroke='${s.trim}' stroke-opacity='0.08' stroke-width='1'/>
    </pattern>
  </defs>

  ${G}
</svg>`;return`data:image/svg+xml;utf8,${encodeURIComponent(R)}`},os=(t,o)=>{const i=t.palette,c=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${i.deep}'/>
      <stop offset='100%' stop-color='${i.mid}'/>
    </linearGradient>
    <linearGradient id='backTrim' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${i.line}' stop-opacity='0.9'/>
      <stop offset='50%' stop-color='${i.bright}' stop-opacity='0.82'/>
      <stop offset='100%' stop-color='${i.line}' stop-opacity='0.88'/>
    </linearGradient>
    <radialGradient id='coreGlow' cx='50%' cy='50%' r='40%'>
      <stop offset='0%' stop-color='${i.bright}' stop-opacity='0.28'/>
      <stop offset='100%' stop-color='${i.bright}' stop-opacity='0'/>
    </radialGradient>
    <pattern id='grid' width='28' height='28' patternUnits='userSpaceOnUse' patternTransform='rotate(${o*9})'>
      <path d='M14 0 V28 M0 14 H28' stroke='${i.line}' stroke-opacity='0.13' stroke-width='1'/>
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
  <rect x='28' y='28' width='664' height='968' rx='28' fill='none' stroke='${i.line}' stroke-width='10' stroke-opacity='0.28'/>
  <rect x='28' y='28' width='664' height='968' rx='28' fill='none' stroke='url(#backTrim)' stroke-width='6.5' stroke-opacity='0.8'/>
  <rect x='58' y='58' width='604' height='908' rx='24' fill='none' stroke='${i.bright}' stroke-width='3.1' stroke-opacity='0.54'/>
  <path d='M102 140 H162 M102 140 V200 M618 140 H558 M618 140 V200 M102 884 H162 M102 884 V824 M618 884 H558 M618 884 V824' stroke='${i.bright}' stroke-width='2.4' stroke-linecap='round' stroke-opacity='0.58' fill='none'/>
  <g transform='translate(360 512) rotate(${o*14})'>
    <circle r='176' fill='none' stroke='${i.bright}' stroke-width='14' stroke-opacity='0.28'/>
    <circle r='132' fill='none' stroke='${i.line}' stroke-width='5' stroke-opacity='0.62'/>
    <circle r='88' fill='none' stroke='${i.bright}' stroke-width='3.4' stroke-opacity='0.78'/>
    <path d='M0-120 L20-30 L110 0 L20 30 L0 120 L-20 30 L-110 0 L-20 -30 Z' fill='${i.line}' fill-opacity='0.42'/>
    <circle r='20' fill='${i.bright}' fill-opacity='0.82'/>
  </g>
  <g transform='translate(360 512)' opacity='0.38'>
    <path d='M-250 -320 C-180 -220 -140 -120 -110 -20 C-70 120 -120 230 -220 320' stroke='${i.line}' stroke-width='2' fill='none'/>
    <path d='M250 320 C180 220 140 120 110 20 C70 -120 120 -230 220 -320' stroke='${i.line}' stroke-width='2' fill='none'/>
  </g>
  <path d='M114 122 C228 96 492 96 606 122' stroke='${i.bright}' stroke-opacity='0.36' stroke-width='2.3' fill='none'/>
  <path d='M128 902 C246 926 474 926 592 902' stroke='${i.bright}' stroke-opacity='0.34' stroke-width='2.2' fill='none'/>
  <rect width='720' height='1024' filter='url(#grain)'/>
</svg>`;return`data:image/svg+xml;utf8,${encodeURIComponent(c)}`},as=t=>{if(t<=0)return[];const o=Array.from({length:t},(c,s)=>s);let i=t*131+17;for(let c=o.length-1;c>0;c-=1){i=i*1664525+1013904223>>>0;const s=i%(c+1);[o[c],o[s]]=[o[s],o[c]]}return o},J=t=>Math.min(1,Math.max(0,t)),oe=t=>1-Math.pow(1-t,3),ae=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,D=(t,o,i)=>J((t-o)/(i-o)),I=(t,o,i)=>E.lerp(t,o,i),et=(t,o,i)=>i?{width:t,height:o,cardSpacing:o*.44,ringRx:t*.17,ringRy:o*.13,exitDropMax:o*.34,dealEntryY:o*.48,browseParallaxX:.07,browseParallaxY:.045,dealScaleMax:2.08,dealArcMax:.2,stackDepthStep:.0085,flipArcZMax:.5,flipArcYMax:.06}:{width:t,height:o,cardSpacing:o*.56,ringRx:t*.24,ringRy:o*.18,exitDropMax:o*.48,dealEntryY:o*.6,browseParallaxX:.16,browseParallaxY:.08,dealScaleMax:2.2,dealArcMax:.3,stackDepthStep:.008,flipArcZMax:.7,flipArcYMax:.12},ns=({progress:t,items:o,onCardSelect:i,lowPowerMode:c=!1,mobileViewport:s=!1})=>{const{viewport:p,pointer:h,camera:u,gl:l}=He(),r=d.useRef([]),n=d.useRef(null),a=d.useRef([]),f=d.useRef([]),g=d.useRef([]),x=d.useRef(et(p.width,p.height,s)),w=d.useRef(!1),M=d.useMemo(()=>o.map($=>st($)),[o]),G=Math.min(p.width,p.height)*(s?.228:.198),R=G*1.46,z=s?"portrait":"landscape",H=E.clamp(G*.58,s?.34:.42,s?.56:.72),he=s?0:-Math.PI/2,A=o.length,me=d.useMemo(()=>o.map(($,y)=>({frontSrc:rs($,y+1,z),backSrc:os($,y+1),borderColor:"#f8fafc",edgeColor:$.accent,width:G,height:R})),[o,R,G,z]),ge=d.useMemo(()=>as(A),[A]);a.current.length!==A&&(a.current=Array.from({length:A},()=>Ge(0))),f.current.length!==A&&(f.current=Array.from({length:A},()=>Ge(0))),g.current.length!==A&&(g.current=Array.from({length:A},()=>Ge(0)));const xe=d.useMemo(()=>o.map(($,y)=>({x:(y%2===0?-1:1)*(.46+y*.08),y:(y%3-1)*.2,lift:.12+y*.014})),[o]),ie=$=>{if(!w.current)return;const y=o[$],v=r.current[$];if(!y||!v)return;const B=new q;v.getWorldPosition(B);const b=B.clone().project(u),k=l.domElement.getBoundingClientRect(),m=k.left+(b.x*.5+.5)*k.width,P=k.top+(-b.y*.5+.5)*k.height;i==null||i(y,{x:m,y:P})};return U(($,y)=>{const v=n.current;if(!v)return;const B=$.clock.getElapsedTime(),b=J(t.get()),k=et(p.width,p.height,s),m=x.current,P=1-Math.exp(-Math.min(y,.2)*10);m.width=I(m.width,k.width,P),m.height=I(m.height,k.height,P),m.cardSpacing=I(m.cardSpacing,k.cardSpacing,P),m.ringRx=I(m.ringRx,k.ringRx,P),m.ringRy=I(m.ringRy,k.ringRy,P),m.exitDropMax=I(m.exitDropMax,k.exitDropMax,P),m.dealEntryY=I(m.dealEntryY,k.dealEntryY,P),m.browseParallaxX=I(m.browseParallaxX,k.browseParallaxX,P),m.browseParallaxY=I(m.browseParallaxY,k.browseParallaxY,P),m.dealScaleMax=I(m.dealScaleMax,k.dealScaleMax,P),m.dealArcMax=I(m.dealArcMax,k.dealArcMax,P),m.stackDepthStep=I(m.stackDepthStep,k.stackDepthStep,P),m.flipArcZMax=I(m.flipArcZMax,k.flipArcZMax,P),m.flipArcYMax=I(m.flipArcYMax,k.flipArcYMax,P);const L=oe(D(b,0,s?.3:.26)),T=oe(D(b,.18,.36)),be=oe(D(b,.32,.48)),V=ae(D(b,.44,.58)),ye=D(b,.64,s?.88:.84),ke=D(b,s?.72:.78,s?.86:.98),N=ae(D(b,s?.86:.95,1)),le=ae(D(b,.62,.78)),ce=.56*ae(D(b,.88,1)),Me=J(Math.max(le,ce)),Y=b>.64;w.current=b>(s?.95:.9);const F=L*(1-T),Z=1-oe(D(b,.56,.72)),ee=h.x,te=h.y,at=Math.PI*.24*F,nt=-Math.PI*.035*F,Ve=Y?s?.008:.012:0;v.rotation.x=(at+te*.03)*Z+te*Ve,v.rotation.y=(nt+ee*.05)*Z+ee*Ve;const Ze=m.cardSpacing,it=(A-1)*Ze,lt=N*it;v.position.x=ee*m.browseParallaxX*Z,v.position.y=te*m.browseParallaxY*Z+lt;const ct=m.ringRx,ft=m.ringRy,dt=(be*.3+V*.48)*Math.PI*2;for(let j=0;j<A;j++){const S=r.current[j];if(!S)continue;const je=A>1?j/(A-1):0;if(f.current[j].set(Me),Y){const se=je*.32,_=ae(J((ye-se)/Math.max(.01,1-se*.55))),W=oe(D(ye,.82,1)),$e=m.dealEntryY,we=-j*Ze,Re=E.lerp($e,we,_),Se=Math.sin(_*Math.PI)*m.dealArcMax,Pe=-j*m.stackDepthStep;S.position.x=0,S.position.y=E.lerp(Re,we,W),S.position.z=E.lerp(Se,Pe,W);const Ce=s?0:Math.PI/2,X=Ce*_;S.rotation.x=0;const Ae=(1-_)*((j%2===0?-1:1)*.08),Te=X+Ae;S.rotation.z=E.lerp(Te,Ce,W);const ve=je*.35,K=ae(J((ke-ve)/Math.max(.01,1-ve*.45))),Ee=Math.sin(K*Math.PI)*m.flipArcZMax,Be=Math.sin(K*Math.PI)*m.flipArcYMax;S.position.z+=Ee,S.position.y+=Be,a.current[j].set(1-K);const Le=J((K-.08)/.92);g.current[j].set(Le),_>.98&&K>.98&&(S.position.y+=Math.sin(B*1.1+j*1.3)*.01,S.position.z+=Math.cos(B*.9+j*.7)*.005),S.rotation.y=0;const ze=E.lerp(1,m.dealScaleMax,_);S.scale.setScalar(ze)}else{const se=xe[j],_=oe(J((L-je*.44)/.56)),W=Math.sin(_*Math.PI),$e=-j*.05,we=-(ge[j]??j)*.055,Re=se.x*W,Se=se.y*W,Pe=E.lerp($e,we,_)+se.lift*W,X=j/A*Math.PI*2+dt,Ae=Math.sin(X)*ct,Te=Math.cos(X)*ft+.05,ve=-.06+Math.sin(X*2)*.012,K=E.lerp(Re,Ae,T),Ee=E.lerp(Se,Te,T),Be=E.lerp(Pe,ve,T),Le=m.exitDropMax*V,ze=Math.sin(X*1.1)*.06*V,We=.01+T*.022,pt=Math.sin(B*1.65+j*.82)*We,ut=Math.cos(B*1.2+j*.58)*We*.45;S.position.x=K+ze,S.position.y=Ee-Le+pt,S.position.z=Be-.16*V+ut,S.rotation.x=0,S.rotation.y=0,S.rotation.z=X*(s?.08:.1)*T,a.current[j].set(1),g.current[j].set(0);const ht=1+.1*T-.12*V;S.scale.setScalar(ht)}}}),e.jsx("group",{ref:n,children:me.map(($,y)=>{const v=o[y],B=M[y];return e.jsx("group",{ref:b=>{b&&(r.current[y]=b)},position:[0,0,-y*.05],children:e.jsx(ot,{...$,flip:a.current[y],edgeGlow:f.current[y],frontAttachment:!c&&v&&B?e.jsx("group",{rotation:[0,0,he],scale:H,children:e.jsx(Jt,{preset:B.popoutPreset,accent:v.accent,palette:v.palette,reveal:g.current[y],intensity:B.popoutIntensity*.84})}):void 0,isClickable:()=>w.current,onClick:()=>ie(y)})},(v==null?void 0:v.id)??`card-${y}`)})})},Ue=t=>Math.min(1,Math.max(0,t)),tt=t=>{const o=Ue(t);return o<=.12?o:o<=.3?.12+(o-.12)/.18*.3:o<=.46?.42+(o-.3)/.16*.26:o<=.62?.68+(o-.46)/.16*.16:o<=.76?.84+(o-.62)/.14*.12:.96+(o-.76)/.24*.04},is=({scrollContainer:t,items:o,onCardSelect:i,forceLowPower:c=!1})=>{const s=d.useRef(null),p=d.useRef(0),h=d.useRef(0),u=Dt(0),{scrollYProgress:l}=Nt({container:t,target:s,offset:["start start","end end"],layoutEffect:!1});_t(l,"change",n=>{p.current=n});const r=d.useCallback(()=>{const n=Ue(l.get());p.current=n,u.set(tt(n)),h.current=3},[l,u]);return d.useEffect(()=>{r()},[r]),d.useEffect(()=>{if(typeof window>"u")return;const n=()=>{r()},a=typeof ResizeObserver<"u"?new ResizeObserver(()=>{n()}):null,f=s.current,g=t.current;a&&(f&&a.observe(f),g&&a.observe(g)),window.addEventListener("resize",n);const x=window.visualViewport;return x==null||x.addEventListener("resize",n),()=>{a==null||a.disconnect(),window.removeEventListener("resize",n),x==null||x.removeEventListener("resize",n)}},[t,r]),Ot((n,a)=>{const f=tt(p.current),g=u.get();if(h.current>0){u.set(f),h.current-=1;return}const x=f<.68,w=f<.96,M=(x?34e-5:w?5e-4:9e-4)*a,C=f-g,G=Math.sign(C)*Math.min(Math.abs(C),M),R=Ue(g+G);u.set(R)}),e.jsx("div",{ref:s,children:e.jsx(Ht,{progress:u,height:560,forceLowPower:c,children:(n,a)=>e.jsx(ns,{progress:n,items:o,onCardSelect:i,lowPowerMode:a.lowPowerMode,mobileViewport:a.mobileViewport})})})},ls=({item:t,originPos:o,onClose:i})=>(d.useEffect(()=>{if(!t)return;const c=s=>{s.key==="Escape"&&i()};return window.addEventListener("keydown",c),()=>window.removeEventListener("keydown",c)},[t,i]),e.jsx(Yt,{children:t&&o&&e.jsxs(e.Fragment,{children:[e.jsx(De.div,{className:"fixed inset-0 z-[90] bg-black/30 backdrop-blur-sm",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.28},onClick:i},"overlay-backdrop"),e.jsx(De.div,{className:"fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-8",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:i,children:e.jsxs(De.div,{className:"relative w-full max-w-[720px] max-h-[82vh] overflow-y-auto rounded-3xl border border-slate-200/80 bg-white/95 shadow-2xl backdrop-blur-xl",initial:{scale:.25,x:o.x-window.innerWidth/2,y:o.y-window.innerHeight/2,opacity:0},animate:{scale:1,x:0,y:0,opacity:1},exit:{scale:.85,opacity:0},transition:{type:"spring",damping:28,stiffness:260},onClick:c=>c.stopPropagation(),children:[e.jsx("div",{className:"h-1.5 rounded-t-3xl",style:{background:t.accent}}),e.jsxs("div",{className:"p-6 sm:p-8",children:[e.jsx("button",{onClick:i,className:"absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600","aria-label":"Close",children:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:e.jsx("path",{d:"M4 4l8 8M12 4l-8 8",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})})}),e.jsx("p",{className:"text-[11px] uppercase tracking-[0.24em] text-slate-500",children:t.subtitle}),e.jsx("h3",{className:"mt-2 text-[28px] font-medium leading-tight sm:text-[36px]",style:{color:t.accent},children:t.title}),e.jsx("p",{className:"mt-4 text-[15px] leading-relaxed text-slate-600",children:t.summary}),e.jsx("p",{className:"mt-3 text-[14px] leading-relaxed text-slate-700",children:t.details}),e.jsx("div",{className:"mt-5 flex flex-wrap gap-2",children:t.tags.map(c=>e.jsx("span",{className:"rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600",children:c},c))}),t.media.length>0&&e.jsx("div",{className:"mt-5 grid gap-3 sm:grid-cols-2",children:t.media.map((c,s)=>e.jsx("div",{className:"overflow-hidden rounded-2xl border border-slate-200 bg-slate-100",children:e.jsx("img",{src:c,alt:`${t.title} preview ${s+1}`,className:"h-44 w-full object-cover",loading:"lazy"})},`${t.id}-media-${s}`))}),t.links.length>0&&e.jsx("div",{className:"mt-5 flex flex-wrap items-center gap-3",children:t.links.map(c=>e.jsxs("a",{href:c.href,target:"_blank",rel:"noopener noreferrer",className:"rounded-lg border border-slate-300 px-4 py-2 text-[13px] font-medium text-slate-700 transition hover:bg-slate-100",children:[c.label," ↗"]},c.label))})]})]})},`overlay-${t.id}`)]})})),xs=()=>{const[t,o]=d.useState(!0),[i,c]=d.useState(null),[s,p]=d.useState(null);d.useEffect(()=>{const l=window.setTimeout(()=>{o(!1)},900);return()=>window.clearTimeout(l)},[]);const h=d.useCallback((l,r)=>{c(l),p(r)},[]),u=d.useCallback(()=>{c(null),p(null)},[]);return e.jsx(Ft,{backgroundClassName:"bg-slate-50",footerBackgroundColor:"#ffffff",footerRunwayVh:120,children:l=>e.jsxs("div",{className:"relative isolate",children:[e.jsx("div",{className:"pointer-events-none absolute inset-0 z-0","aria-hidden":!0,children:e.jsxs("div",{className:"sticky top-0 h-[100svh]",children:[e.jsx(gt,{effectId:xt,quality:"balanced",interactionMode:"subtle",styleSeed:91,className:"pointer-events-none absolute inset-0 h-full w-full opacity-[0.62]"}),e.jsx("div",{className:"absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(219,234,254,0.38),transparent_48%),radial-gradient(circle_at_76%_18%,rgba(221,214,254,0.28),transparent_46%),linear-gradient(168deg,rgba(255,255,255,0.72),rgba(248,250,252,0.66)_44%,rgba(238,242,247,0.74)_100%)]"})]})}),e.jsxs("div",{className:"relative z-10",children:[e.jsxs("header",{className:"relative z-20 mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 pt-24 text-slate-900",children:[e.jsx("p",{className:"text-sm uppercase tracking-[0.22em] text-slate-500",children:"Projects"}),e.jsx("h1",{className:"text-3xl font-medium xs:text-4xl sm:text-5xl",children:"Ideas Realized."}),e.jsx("p",{className:"max-w-2xl text-slate-600",children:"A collection of my favorite projects, experiments, and prototypes."})]}),e.jsx("div",{className:"relative mt-8",children:e.jsx(is,{scrollContainer:l,items:yt,onCardSelect:h,forceLowPower:t})}),e.jsx(ls,{item:i,originPos:s,onClose:u})]})]})})};export{xs as default};
