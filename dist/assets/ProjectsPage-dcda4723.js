import{a as Ue,r as f,u as O,j as s,C as at,b as We}from"./vendor-react-dd4faaa1.js";import{n as Ye,R as Ze,H as Xe,e as nt,i as it,v as lt,l as ct,w as ft,S as dt,O as pt,h as se,x as Ke,y as ht,z as ut,E as mt,D as gt,p as Ge,G as xt,I as qe,M as T,d as Z,k as yt,r as bt,J as vt}from"./vendor-three-core-95690918.js";import{C as wt}from"./CanvasErrorBoundary-ed8965f4.js";import{E as Mt,R as kt,U as jt}from"./vendor-three-extras-dc43cb1b.js";import{d as Ee}from"./vendor-misc-72c8405f.js";import{c as Pt,a as St,d as $t,e as Ct,A as Rt,m as De}from"./vendor-motion-67d84b2b.js";import{P as Bt}from"./PageScaffold-cf994b92.js";const Tt=({enabled:e=!0,strength:t=.32,radius:r=.72,threshold:n=.88})=>{const{gl:i,scene:p,camera:d,size:h}=Ue(),a=f.useRef(!1),o=f.useMemo(()=>{try{const l=i.getPixelRatio(),c=Math.max(1,Math.floor(h.width*l)),u=Math.max(1,Math.floor(h.height*l)),m=new Ye(c,u,{format:Ze,type:Xe,depthBuffer:!0,stencilBuffer:!1}),y=new Ye(c,u,{format:Ze,type:Xe,depthBuffer:!0,stencilBuffer:!1}),w=new Mt(i,y);w.renderToScreen=!1;const x=new kt(p,d);x.clear=!0,x.clearAlpha=0,w.addPass(x);const $=new jt(new nt(c,u),t,r,n);w.addPass($);const j=new it({uniforms:{tBase:{value:m.texture},tBloomCombined:{value:w.readBuffer.texture}},vertexShader:`
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
        `,depthWrite:!1,depthTest:!1,transparent:!0,blending:lt}),C=new ct(new ft(2,2),j),I=new dt,V=new pt(-1,1,1,-1,0,1);return I.add(C),{baseTarget:m,composer:w,bloomPass:$,compositeScene:I,compositeCamera:V,compositeMaterial:j,compositeMesh:C}}catch(l){return console.error("[SceneBloom] Failed to initialize bloom pipeline.",l),null}},[i,p,d,h.width,h.height,t,r,n]);return f.useEffect(()=>{a.current=!1},[o]),f.useEffect(()=>{if(!o)return;const l=i.getPixelRatio(),c=Math.max(1,Math.floor(h.width*l)),u=Math.max(1,Math.floor(h.height*l));o.baseTarget.setSize(c,u),o.composer.setSize(h.width,h.height),o.compositeMaterial.uniforms.tBase.value=o.baseTarget.texture,o.compositeMaterial.uniforms.tBloomCombined.value=o.composer.readBuffer.texture},[o,i,h.width,h.height]),f.useEffect(()=>{o&&(o.bloomPass.enabled=e,o.bloomPass.strength=t,o.bloomPass.radius=r,o.bloomPass.threshold=n)},[o,e,t,r,n]),f.useEffect(()=>()=>{o&&(o.bloomPass.dispose(),o.composer.dispose(),o.baseTarget.dispose(),o.compositeMesh.geometry.dispose(),o.compositeMaterial.dispose())},[o]),O(l=>{const c=l.gl,u=c.autoClear,m=c.getClearAlpha(),y=c.getClearColor(new se).clone(),w=()=>{c.setRenderTarget(null),c.autoClear=!0,c.setClearColor(y,0),c.clear(!0,!0,!0),c.render(p,d)};try{if(!e||!o||a.current){w();return}c.autoClear=!0,c.setRenderTarget(o.baseTarget),c.setClearColor(y,0),c.clear(!0,!0,!0),c.render(p,d),o.composer.render(),o.compositeMaterial.uniforms.tBloomCombined.value=o.composer.readBuffer.texture,c.setRenderTarget(null),c.setClearColor(y,0),c.clear(!0,!0,!0),c.render(o.compositeScene,o.compositeCamera)}catch(x){a.current=!0,console.error("[SceneBloom] Runtime bloom failure; falling back to base render.",x),w()}finally{c.setClearColor(y,m),c.autoClear=u}},1),null},It=({progress:e,height:t=200,forceLowPower:r=!1,children:n})=>{const[i,p]=f.useState(!1);f.useEffect(()=>{if(typeof window>"u")return;const a=window.matchMedia("(max-width: 900px)"),o=window.matchMedia("(prefers-reduced-motion: reduce)"),l=()=>{p(a.matches||o.matches)};return l(),a.addEventListener?(a.addEventListener("change",l),o.addEventListener("change",l)):(a.addListener(l),o.addListener(l)),()=>{a.removeEventListener?(a.removeEventListener("change",l),o.removeEventListener("change",l)):(a.removeListener(l),o.removeListener(l))}},[]);const d=i||r,h=d?Math.max(190,Math.min(t,220)):t;return s.jsx("section",{style:{height:`${h}vh`},className:"relative",children:s.jsxs("div",{className:"sticky top-0 h-screen overflow-hidden bg-slate-50",children:[s.jsx("div",{className:"pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(191,219,254,0.52),transparent_46%),radial-gradient(circle_at_78%_20%,rgba(196,181,253,0.34),transparent_42%),linear-gradient(165deg,#ffffff,#f8fafc_58%,#eef2f7)]"}),s.jsx("div",{className:"pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_72%,rgba(148,163,184,0.15),transparent_58%)]"}),s.jsx(wt,{children:s.jsxs(at,{className:"absolute inset-0 h-full w-full",camera:{position:[0,.14,6.15],fov:43},dpr:d?[1,1.5]:[1,2],shadows:!1,gl:{preserveDrawingBuffer:!1,antialias:!d,powerPreference:"high-performance",alpha:!0},onCreated:({gl:a})=>{a.outputColorSpace=Ke,ht.enabled=!0,a.shadowMap.enabled=!1,a.setClearColor(16777215,0)},children:[s.jsx("fog",{attach:"fog",args:["#f8fafc",8,24]}),s.jsx("ambientLight",{intensity:.72}),s.jsx("spotLight",{position:[0,5.2,2.6],angle:.56,penumbra:.66,intensity:d?1.45:1.68,distance:26}),s.jsx("directionalLight",{position:[2.8,2.6,2.4],intensity:.45}),s.jsx("directionalLight",{position:[-3.2,1.4,-2.8],intensity:.18}),s.jsx(Tt,{enabled:!d}),s.jsx("group",{scale:1.14,position:[0,.02,0],children:n(e,{lowPowerMode:d})})]})}),s.jsx("div",{className:"pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent to-slate-50"})]})})},Lt="data:image/svg+xml;utf8,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'><rect width='720' height='1024' fill='#f8fafc'/><rect x='36' y='36' width='648' height='952' rx='28' fill='none' stroke='#94a3b8' stroke-width='8'/></svg>"),At="data:image/svg+xml;utf8,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#103a8a'/><stop offset='100%' stop-color='#1f5fd8'/></linearGradient></defs><rect width='720' height='1024' fill='url(#g)'/></svg>"),Qe=f.forwardRef(({frontSrc:e,backSrc:t,width:r,height:n,thickness:i=.02,borderColor:p="#e0e0e0",edgeColor:d,edgeGlow:h,flip:a,pop:o,popScale:l=1.15,onClick:c,isClickable:u,frontAttachment:m,...y},w)=>{const{viewport:x,gl:$}=Ue(),j=Math.min(x.width,x.height),C=r??j*.08,I=n??C*1.4,V=f.useRef(null),he=f.useRef(null),S=f.useRef(null),g=f.useRef(null),P=f.useRef(null),b=f.useRef(null),L=f.useRef(!1);f.useImperativeHandle(w,()=>V.current,[]);const M=We(qe,e??Lt),z=We(qe,t??At),R=f.useMemo(()=>new se(d??p),[d,p]),q=f.useMemo(()=>{const B=new ut(C+.016,I+.016,i+.012),A=new mt(B);return B.dispose(),A},[C,I,i]);f.useMemo(()=>{const B=$.capabilities.getMaxAnisotropy();for(const A of[M,z])A.colorSpace=Ke,A.anisotropy=B,A.minFilter=gt,A.needsUpdate=!0},[M,z,$]),O(()=>{var ge,xe,ye;const B=V.current;if(!B)return;const A=((ge=a==null?void 0:a.get)==null?void 0:ge.call(a))??0;B.rotation.y=Math.PI*A;const me=((xe=o==null?void 0:o.get)==null?void 0:xe.call(o))??0,K=1+(l-1)*me;B.scale.setScalar(K);const oe=((ye=h==null?void 0:h.get)==null?void 0:ye.call(h))??0,re=L.current?2.15:1,E=T.clamp(oe*re,0,1.9),ae=he.current;ae&&(ae.emissive.setRGB(1,1,1),ae.emissiveIntensity=.24+E*.2);const Q=S.current;Q&&(Q.uniforms.uAccentColor.value.copy(R),Q.uniforms.uGlow.value=T.clamp(E*.52,0,1.1));const ne=g.current;ne&&(ne.opacity=T.clamp(.34+E*.22,.34,.76));const U=P.current;U&&(U.opacity=T.clamp(E*.64,0,.95),U.color.copy(R).multiplyScalar(.95+E*2.3),U.visible=U.opacity>.01);const _=b.current;_&&(_.uniforms.uColor.value.copy(R),_.uniforms.uOpacity.value=T.clamp(E*.28,0,.48),_.uniforms.uStrength.value=.85+E*1.7,_.visible=E>.01)}),f.useEffect(()=>()=>{$.domElement.style.cursor="auto"},[$]),f.useEffect(()=>()=>{q.dispose()},[q]);const ue=()=>u?u():!0,Me=B=>{L.current=!0,c&&ue()?(B.stopPropagation(),$.domElement.style.cursor="pointer"):$.domElement.style.cursor="auto"},ke=()=>{L.current=!1,$.domElement.style.cursor="auto"},je=B=>{!c||!ue()||(B.stopPropagation(),c())};return s.jsxs("group",{ref:V,...y,children:[s.jsxs("mesh",{renderOrder:2,children:[s.jsx("boxGeometry",{args:[C+.03,I+.03,i+.04]}),s.jsx("shaderMaterial",{ref:b,uniforms:{uColor:{value:R.clone()},uOpacity:{value:0},uStrength:{value:.7}},vertexShader:`
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
            `,blending:Ge,transparent:!0,depthWrite:!1,depthTest:!0,side:xt,toneMapped:!1})]}),s.jsx("lineSegments",{geometry:q,renderOrder:3,children:s.jsx("lineBasicMaterial",{ref:P,color:R,transparent:!0,opacity:0,blending:Ge,depthWrite:!1,toneMapped:!1})}),s.jsxs("mesh",{castShadow:!0,children:[s.jsx("boxGeometry",{args:[C,I,i]}),s.jsx("meshStandardMaterial",{color:p,metalness:.08,roughness:.52})]}),s.jsxs("mesh",{position:[0,0,i/2+1e-4],onPointerOver:Me,onPointerOut:ke,onClick:je,children:[s.jsx("planeGeometry",{args:[C,I]}),s.jsx("meshStandardMaterial",{ref:he,map:M,roughness:.3,metalness:0,emissive:"#ffffff",emissiveMap:M,emissiveIntensity:.34,toneMapped:!1})]}),s.jsxs("mesh",{position:[0,0,i/2+18e-5],renderOrder:5,children:[s.jsx("planeGeometry",{args:[C,I]}),s.jsx("shaderMaterial",{ref:S,uniforms:{uMap:{value:M},uAccentColor:{value:R.clone()},uGlow:{value:0}},vertexShader:`
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
            `,blending:Ge,transparent:!0,depthWrite:!1,depthTest:!0,toneMapped:!1})]}),s.jsxs("mesh",{position:[0,0,i/2+26e-5],renderOrder:6,children:[s.jsx("planeGeometry",{args:[C,I]}),s.jsx("meshBasicMaterial",{ref:g,map:M,transparent:!0,opacity:.34,depthWrite:!1,toneMapped:!1})]}),m?s.jsx("group",{position:[0,0,i/2+.0015],children:m}):null,s.jsxs("mesh",{"rotation-y":Math.PI,position:[0,0,-i/2-1e-4],children:[s.jsx("planeGeometry",{args:[C,I]}),s.jsx("meshStandardMaterial",{map:z,roughness:.28,metalness:0,emissive:"#ffffff",emissiveMap:z,emissiveIntensity:.4,toneMapped:!1})]})]})});Qe.displayName="Card3D";const ce=e=>Math.min(1,Math.max(0,e)),fe=e=>typeof e=="number"?e:e.get(),N=()=>{},de=.08,pe=(e,t)=>f.useMemo(()=>({accent:new se(e),deep:new se(t.deep),mid:new se(t.mid),bright:new se(t.bright)}),[e,t.deep,t.mid,t.bright]),Gt=({reveal:e,intensity:t,accent:r,palette:n})=>{const i=f.useRef(null),p=f.useRef([]),d=pe(r,n);return O(({clock:h})=>{const a=i.current;if(!a)return;const o=ce(fe(e)),l=o>de;if(a.visible=l,!l)return;const c=h.elapsedTime,u=(.7+o*.6)*(.9+t*.12);a.scale.setScalar(u),a.rotation.y=c*.55,a.rotation.x=Math.sin(c*.7)*.12,a.position.z=.1+o*.5,a.position.y=.02+Math.sin(c*1.2)*.04;const m=.44+o*.26;p.current.forEach((y,w)=>{if(!y)return;const x=c*(1.8+w*.22)+w*(Math.PI*.66);y.position.set(Math.cos(x)*m,Math.sin(x*1.08)*m*.58,Math.sin(x*.72)*.22)})}),s.jsxs("group",{ref:i,position:[0,.04,.2],children:[s.jsxs("mesh",{raycast:N,children:[s.jsx("icosahedronGeometry",{args:[.19,2]}),s.jsx("meshStandardMaterial",{color:d.mid,emissive:d.accent,emissiveIntensity:.56,metalness:.1,roughness:.38,toneMapped:!1})]}),s.jsxs("mesh",{rotation:[Math.PI/2,0,0],raycast:N,children:[s.jsx("torusGeometry",{args:[.55,.03,18,84]}),s.jsx("meshStandardMaterial",{color:d.accent,emissive:d.accent,emissiveIntensity:.72,transparent:!0,opacity:.88,metalness:.05,roughness:.42,toneMapped:!1})]}),Array.from({length:4}).map((h,a)=>s.jsxs("mesh",{raycast:N,ref:o=>{p.current[a]=o},children:[s.jsx("sphereGeometry",{args:[.07,16,16]}),s.jsx("meshStandardMaterial",{color:d.bright,emissive:d.accent,emissiveIntensity:.9,toneMapped:!1})]},`orbital-satellite-${a}`))]})},Et=({reveal:e,intensity:t,accent:r,palette:n})=>{const i=f.useRef(null),p=f.useRef([]),d=pe(r,n),h=f.useMemo(()=>[-.48,-.32,-.16,0,.16,.32,.48],[]);return O(({clock:a})=>{const o=i.current;if(!o)return;const l=ce(fe(e)),c=l>de;if(o.visible=c,!c)return;const u=a.elapsedTime;o.scale.setScalar(.7+l*.52),o.position.z=.08+l*.44,o.rotation.y=Math.sin(u*.82)*.09,o.rotation.x=-.12+Math.sin(u*.56)*.06,p.current.forEach((m,y)=>{if(!m)return;const x=.54+(.28+.72*(.5+.5*Math.sin(u*2.8+y*.66)))*(.85+t*.28);m.scale.y=x,m.position.y=-.08+x*.18,m.position.z=Math.sin(u*1.2+y)*.05})}),s.jsx("group",{ref:i,position:[0,-.04,.14],children:h.map((a,o)=>s.jsxs("mesh",{raycast:N,ref:l=>{p.current[o]=l},position:[a,0,0],children:[s.jsx("boxGeometry",{args:[.09,.36,.09]}),s.jsx("meshStandardMaterial",{color:o%2===0?d.mid:d.accent,emissive:d.accent,emissiveIntensity:.64,metalness:.08,roughness:.34,toneMapped:!1})]},`spine-${o}`))})},Dt=({reveal:e,intensity:t,accent:r,palette:n})=>{const i=f.useRef(null),p=pe(r,n),d=f.useMemo(()=>[new Z(-.42,.08,0),new Z(-.16,.28,.14),new Z(.18,.2,-.08),new Z(.44,.04,.04),new Z(-.08,-.2,.1),new Z(.28,-.26,-.03)],[]),h=f.useMemo(()=>{const a=[[0,1],[1,2],[2,3],[1,4],[4,5],[2,5],[0,4]],o=new Float32Array(a.length*6);a.forEach(([c,u],m)=>{o[m*6]=d[c].x,o[m*6+1]=d[c].y,o[m*6+2]=d[c].z,o[m*6+3]=d[u].x,o[m*6+4]=d[u].y,o[m*6+5]=d[u].z});const l=new yt;return l.setAttribute("position",new bt(o,3)),l},[d]);return f.useEffect(()=>()=>{h.dispose()},[h]),O(({clock:a})=>{const o=i.current;if(!o)return;const l=ce(fe(e)),c=l>de;if(o.visible=c,!c)return;const u=a.elapsedTime;o.scale.setScalar((.7+l*.64)*(.95+t*.1)),o.rotation.y=u*.42,o.rotation.x=Math.sin(u*.72)*.08,o.position.z=.14+l*.46,o.position.y=Math.sin(u*1.1)*.03}),s.jsxs("group",{ref:i,position:[0,0,.2],children:[s.jsx("lineSegments",{geometry:h,raycast:N,children:s.jsx("lineBasicMaterial",{color:p.accent,transparent:!0,opacity:.72,toneMapped:!1})}),d.map((a,o)=>s.jsxs("mesh",{position:[a.x,a.y,a.z],raycast:N,children:[s.jsx("sphereGeometry",{args:[.06+o%2*.012,16,16]}),s.jsx("meshStandardMaterial",{color:o%2===0?p.bright:p.mid,emissive:p.accent,emissiveIntensity:.74,toneMapped:!1})]},`node-${o}`))]})},Ft=({reveal:e,intensity:t,accent:r,palette:n})=>{const i=f.useRef(null),p=pe(r,n);return O(({clock:d})=>{const h=i.current;if(!h)return;const a=ce(fe(e)),o=a>de;if(h.visible=o,!o)return;const l=d.elapsedTime;h.scale.setScalar((.72+a*.58)*(.96+t*.08)),h.rotation.z=Math.sin(l*.62)*.16,h.rotation.y=l*.52,h.position.z=.12+a*.48,h.position.y=-.03+Math.sin(l*1.5)*.04}),s.jsxs("group",{ref:i,position:[0,-.02,.2],children:[s.jsxs("mesh",{raycast:N,children:[s.jsx("torusKnotGeometry",{args:[.34,.07,140,18,2,3]}),s.jsx("meshStandardMaterial",{color:p.mid,emissive:p.accent,emissiveIntensity:.82,metalness:.22,roughness:.32,toneMapped:!1})]}),s.jsxs("mesh",{rotation:[Math.PI/2,0,0],raycast:N,children:[s.jsx("ringGeometry",{args:[.46,.56,64]}),s.jsx("meshBasicMaterial",{color:p.accent,transparent:!0,opacity:.28,toneMapped:!1,side:vt})]})]})},Nt=({reveal:e,intensity:t,accent:r,palette:n})=>{const i=f.useRef(null),p=f.useRef([]),d=pe(r,n),h=f.useMemo(()=>{const a=[];for(let l=0;l<3;l+=1)for(let c=0;c<3;c+=1)a.push([(c-1)*.22,(l-1)*.22*.78,0]);return a},[]);return O(({clock:a})=>{const o=i.current;if(!o)return;const l=ce(fe(e)),c=l>de;if(o.visible=c,!c)return;const u=a.elapsedTime;o.scale.setScalar((.78+l*.55)*(.93+t*.12)),o.rotation.y=Math.sin(u*.72)*.2,o.position.z=.12+l*.45,o.position.y=-.02+Math.sin(u*1.24)*.03,p.current.forEach((m,y)=>{if(!m)return;const x=.44+(.35+.65*(.5+.5*Math.sin(u*2.4+y*.44)))*(.72+t*.34);m.scale.y=x,m.position.z=Math.sin(u*1.1+y*.22)*.04,m.position.y=h[y][1]-.12+x*.12})}),s.jsx("group",{ref:i,position:[0,.04,.2],children:h.map(([a,o,l],c)=>s.jsxs("mesh",{raycast:N,ref:u=>{p.current[c]=u},position:[a,o,l],children:[s.jsx("cylinderGeometry",{args:[.045,.045,.28,14]}),s.jsx("meshStandardMaterial",{color:c%2===0?d.mid:d.bright,emissive:d.accent,emissiveIntensity:.66,roughness:.32,metalness:.18,toneMapped:!1})]},`pillar-${c}`))})},zt=e=>{switch(e.preset){case"orbitalCore":return s.jsx(Gt,{...e});case"dataSpines":return s.jsx(Et,{...e});case"nodeConstellation":return s.jsx(Dt,{...e});case"ribbonArc":return s.jsx(Ft,{...e});case"pillarArray":return s.jsx(Nt,{...e});default:return null}},Ot=(e,t,r)=>Math.min(r,Math.max(t,e)),Vt=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&apos;"),Ut=e=>{const t=e.trim().split(/\s+/).filter(Boolean);return t.length===0?"PR":t.length===1?t[0].slice(0,2).toUpperCase()||"PR":`${t[0][0]}${t[1][0]}`.toUpperCase()},_t=(e,t,r)=>{const n=Vt(Ut(e));return`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96' fill='none'>
    <defs>
      <linearGradient id='monogramBg' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${t}' stop-opacity='0.92'/>
        <stop offset='100%' stop-color='${r.mid}' stop-opacity='0.92'/>
      </linearGradient>
    </defs>
    <rect x='8' y='8' width='80' height='80' rx='24' fill='url(#monogramBg)'/>
    <rect x='13' y='13' width='70' height='70' rx='20' stroke='${r.line}' stroke-opacity='0.55'/>
    <text x='48' y='58' text-anchor='middle' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='30' font-weight='700' fill='${r.line}'>${n}</text>
  </svg>`},ie=(e,t,r)=>`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96' fill='none'>
  <rect x='8' y='8' width='80' height='80' rx='24' fill='${t.bright}' fill-opacity='0.92'/>
  <rect x='8' y='8' width='80' height='80' rx='24' stroke='${e}' stroke-opacity='0.42' stroke-width='2'/>
  <g stroke='${e}' fill='none' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'>
    ${r}
  </g>
</svg>`,le={deck:(e,t)=>ie(e,t,"<rect x='26' y='24' width='44' height='26' rx='8'/><rect x='22' y='40' width='52' height='30' rx='9' opacity='0.88'/><path d='M48 28v38'/><path d='M34 58h28'/>"),lens:(e,t)=>ie(e,t,"<circle cx='46' cy='46' r='16'/><circle cx='46' cy='46' r='8' opacity='0.78'/><path d='M58 58 72 72'/><path d='M24 72c8-7 14-8 22-8' opacity='0.64'/>"),timeline:(e,t)=>ie(e,t,`<path d='M18 28h60'/><path d='M18 48h60'/><path d='M18 68h60'/><circle cx='32' cy='28' r='4' fill='${e}'/><circle cx='58' cy='48' r='4' fill='${e}'/><circle cx='42' cy='68' r='4' fill='${e}'/>`),neural:(e,t)=>ie(e,t,`<circle cx='30' cy='32' r='4' fill='${e}'/><circle cx='62' cy='30' r='4' fill='${e}'/><circle cx='28' cy='62' r='4' fill='${e}'/><circle cx='64' cy='62' r='4' fill='${e}'/><path d='M30 32 62 30 64 62 28 62 30 32'/><path d='M30 32 64 62'/><path d='M62 30 28 62'/>`),dashboard:(e,t)=>ie(e,t,"<rect x='22' y='24' width='52' height='44' rx='10'/><path d='M30 60v-8'/><path d='M40 60V44'/><path d='M50 60V36'/><path d='M60 60V48'/><path d='M24 72h48' opacity='0.7'/>")},D=(e,t)=>`data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 400'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='${e}'/>
          <stop offset='100%' stop-color='${t}'/>
        </linearGradient>
      </defs>
      <rect width='720' height='400' fill='url(#g)'/>
      <g opacity='0.26' stroke='white'>
        <circle cx='360' cy='200' r='110' fill='none' stroke-width='6'/>
        <circle cx='360' cy='200' r='70' fill='none' stroke-width='4'/>
      </g>
    </svg>
  `)}`,Fe={dateLabel:"TBD",status:"Active",popoutIntensity:1},Je=e=>{var r,n;const t=e.front;return{dateLabel:((r=t.dateLabel)==null?void 0:r.trim())||Fe.dateLabel,status:t.status??Fe.status,iconSvg:((n=t.iconSvg)==null?void 0:n.trim())||_t(e.title,e.accent,e.palette),frontFamily:t.frontFamily,popoutPreset:t.popoutPreset,popoutIntensity:Ot(t.popoutIntensity??Fe.popoutIntensity,.45,1.9)}},Ht=[{id:"portfolio-3d",title:"Projects",subtitle:"Ideas realized.",summary:"A collection of my favorite projects, experiments, and prototypes.",details:"Built reusable scene primitives, transition orchestration, and card-based storytelling blocks to keep animation logic composable across pages.",tags:["React","Framer Motion","Architecture"],accent:"#ffd608",palette:{deep:"#8a6b00",mid:"#d4a800",bright:"#fff8e0",line:"#fffdf2"},media:[D("#e2e8f0","#cbd5e1"),D("#1f5fd8","#1947a6")],links:[{label:"Live Site",href:"#"},{label:"Source",href:"#"}],front:{dateLabel:"2026",status:"Active",frontFamily:"atlas",popoutPreset:"orbitalCore",popoutIntensity:1.15,iconSvg:le.deck("#ffd608",{deep:"#8a6b00",mid:"#d4a800",bright:"#fff8e0",line:"#fffdf2"})}},{id:"vision-lab",title:"Vision Lab",subtitle:"3D + Graphics Experiments",summary:"Interactive visual prototypes focused on depth, motion, and tactile interfaces.",details:"Explored lightweight approaches to visual depth where real-time 3D is used selectively and performance-first fallbacks are available for mobile devices.",tags:["Three.js","R3F","Performance"],accent:"#08c5ff",palette:{deep:"#004a6b",mid:"#0891b2",bright:"#e0f7ff",line:"#f0fbff"},media:[D("#1b2a44","#132339"),D("#0ea390","#0f6f67")],links:[{label:"Case Study",href:"#"},{label:"Prototype",href:"#"}],front:{dateLabel:"2025",status:"In Progress",frontFamily:"signal",popoutPreset:"nodeConstellation",popoutIntensity:1.24,iconSvg:le.lens("#08c5ff",{deep:"#004a6b",mid:"#0891b2",bright:"#e0f7ff",line:"#f0fbff"})}},{id:"timeline-book",title:"Life Timeline Book",subtitle:"About Page Prototype",summary:"A layered pop-up-book timeline concept with foreground, midground, and background scenes.",details:"Designed a card scene graph that can load decade-based snapshots, crossfade layered assets, and support gradual updates without rewriting animation timelines.",tags:["Storytelling","Timeline","Design Systems"],accent:"#08ff94",palette:{deep:"#004d2d",mid:"#06b66f",bright:"#e0fff0",line:"#f0fff8"},media:[D("#b91c1c","#7f1d1d"),D("#4f46e5","#312e81")],links:[{label:"Read Notes",href:"#"},{label:"Design Doc",href:"#"}],front:{dateLabel:"Prototype",status:"Active",frontFamily:"lattice",popoutPreset:"ribbonArc",popoutIntensity:1.05,iconSvg:le.timeline("#08ff94",{deep:"#004d2d",mid:"#06b66f",bright:"#e0fff0",line:"#f0fff8"})}},{id:"neural-search",title:"Neural Search Engine",subtitle:"Semantic Retrieval System",summary:"A vector-based search tool that understands intent, not just keywords.",details:"Built an embeddings pipeline with nearest-neighbor retrieval, query expansion, and a lightweight React front-end. Optimised for sub-100ms latency on commodity hardware.",tags:["Python","FAISS","NLP","React"],accent:"#a855f7",palette:{deep:"#4c1d95",mid:"#7c3aed",bright:"#f3e8ff",line:"#faf5ff"},media:[D("#4c1d95","#6d28d9"),D("#7c3aed","#a78bfa")],links:[{label:"Demo",href:"#"},{label:"Source",href:"#"}],front:{dateLabel:"2024",status:"Paused",frontFamily:"forge",popoutPreset:"dataSpines",popoutIntensity:1,iconSvg:le.neural("#a855f7",{deep:"#4c1d95",mid:"#7c3aed",bright:"#f3e8ff",line:"#faf5ff"})}},{id:"homelab-dashboard",title:"Homelab Dashboard",subtitle:"Infrastructure Monitor",summary:"A real-time dashboard for self-hosted services, container health, and network metrics.",details:"Aggregates Prometheus metrics, Docker container states, and uptime checks into a single glanceable UI with WebSocket-driven live updates and alerting hooks.",tags:["TypeScript","WebSockets","Docker","Grafana"],accent:"#f97316",palette:{deep:"#7c2d12",mid:"#ea580c",bright:"#fff7ed",line:"#fffbf5"},media:[D("#7c2d12","#c2410c"),D("#ea580c","#fb923c")],links:[{label:"Live Panel",href:"#"},{label:"Source",href:"#"}],front:{dateLabel:"2026",status:"Active",frontFamily:"signal",popoutPreset:"pillarArray",popoutIntensity:1.18,iconSvg:le.dashboard("#f97316",{deep:"#7c2d12",mid:"#ea580c",bright:"#fff7ed",line:"#fffbf5"})}}],Wt={atlas:{bgStart:"#fcfdff",bgEnd:"#eef5ff",portal:"#dbeafe",trim:"#60a5fa",text:"#0f172a",muted:"#475569",chip:"#e2e8f0",chipText:"#334155"},signal:{bgStart:"#f0fdff",bgEnd:"#e0f2fe",portal:"#bae6fd",trim:"#0ea5e9",text:"#082f49",muted:"#155e75",chip:"#d9f8ff",chipText:"#0c4a6e"},forge:{bgStart:"#faf5ff",bgEnd:"#f3e8ff",portal:"#e9d5ff",trim:"#a855f7",text:"#3b0764",muted:"#6b21a8",chip:"#f3e8ff",chipText:"#581c87"},lattice:{bgStart:"#f0fdf4",bgEnd:"#dcfce7",portal:"#bbf7d0",trim:"#22c55e",text:"#052e16",muted:"#166534",chip:"#dcfce7",chipText:"#14532d"}},Yt={Active:{bg:"#dcfce7",fg:"#166534"},"In Progress":{bg:"#e0f2fe",fg:"#0c4a6e"},Paused:{bg:"#ffedd5",fg:"#9a3412"},Archived:{bg:"#e2e8f0",fg:"#334155"}},Ne=1024,ze=720,we=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&apos;"),Oe=(e,t,r)=>{const n=e.trim().split(/\s+/).filter(Boolean);if(!n.length)return[""];const i=[];let p="";for(const a of n){const o=p?`${p} ${a}`:a;if(o.length<=t){p=o;continue}if(p&&i.push(p),p=a,i.length===r)break}i.length<r&&p&&i.push(p),i.length>r&&(i.length=r);const d=n.join(" "),h=i.join(" ");if(d.length>h.length){const a=i.length-1;i[a]=`${i[a].replace(/\.{3}$/,"").trim()}...`}return i},Zt=e=>{const t=e.trim().split(/\s+/).filter(Boolean);return t.length?t.length===1?t[0].slice(0,2).toUpperCase():`${t[0][0]}${t[1][0]}`.toUpperCase():"PR"},Ve=(e,t,r)=>e.map((n,i)=>`<tspan x='${t}' dy='${i===0?0:r}'>${we(n)}</tspan>`).join(""),Xt=(e,t)=>{const r=Je(e),n=Wt[r.frontFamily],i=Yt[r.status],p=Oe(e.title,24,2),d=Oe(e.subtitle,26,2),h=Oe(e.summary,40,2),a=Zt(e.title),o=Math.min(280,38+r.status.length*9),l=Math.min(184,36+r.dateLabel.length*9),c=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='${Ne}' y2='${ze}' gradientUnits='userSpaceOnUse'>
      <stop offset='0%' stop-color='${n.bgStart}'/>
      <stop offset='100%' stop-color='${n.bgEnd}'/>
    </linearGradient>
    <radialGradient id='portalGlow' cx='512' cy='360' r='260' gradientUnits='userSpaceOnUse'>
      <stop offset='0%' stop-color='${n.portal}' stop-opacity='0.56'/>
      <stop offset='100%' stop-color='${n.portal}' stop-opacity='0'/>
    </radialGradient>
    <pattern id='grid' width='32' height='32' patternUnits='userSpaceOnUse' patternTransform='rotate(${t*11})'>
      <path d='M16 0V32 M0 16H32' stroke='${n.trim}' stroke-opacity='0.08' stroke-width='1'/>
    </pattern>
  </defs>

  <g transform='translate(720 0) rotate(90)'>
    <rect width='${Ne}' height='${ze}' fill='url(#bg)'/>
    <rect width='${Ne}' height='${ze}' fill='url(#grid)'/>

    <rect x='20' y='20' width='984' height='680' rx='34' fill='none' stroke='${n.trim}' stroke-opacity='0.34' stroke-width='9'/>
    <rect x='20' y='20' width='984' height='680' rx='34' fill='none' stroke='${e.accent}' stroke-opacity='0.72' stroke-width='4.8'/>
    <rect x='44' y='44' width='936' height='632' rx='28' fill='none' stroke='${n.trim}' stroke-opacity='0.28' stroke-width='2.2'/>

    <ellipse cx='512' cy='360' rx='228' ry='148' fill='url(#portalGlow)'/>
    <circle cx='512' cy='360' r='108' fill='none' stroke='${e.accent}' stroke-opacity='0.44' stroke-width='4'/>
    <circle cx='512' cy='360' r='68' fill='none' stroke='${n.trim}' stroke-opacity='0.42' stroke-width='3'/>

    <path d='M84 86 H150 M84 86 V152 M940 86 H874 M940 86 V152 M84 634 H150 M84 634 V568 M940 634 H874 M940 634 V568' stroke='${e.accent}' stroke-opacity='0.62' stroke-width='2.2' stroke-linecap='round' fill='none'/>

    <text x='84' y='122' fill='${n.text}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='54' font-weight='700'>
      ${Ve(p,84,60)}
    </text>

    <g transform='translate(852 74)'>
      <rect width='96' height='96' rx='24' fill='${n.chip}'/>
      <rect x='1.5' y='1.5' width='93' height='93' rx='22.5' fill='none' stroke='${e.accent}' stroke-opacity='0.54'/>
      <text x='48' y='58' text-anchor='middle' fill='${n.chipText}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='33' font-weight='700'>${we(a)}</text>
    </g>

    <g transform='translate(84 588)'>
      <rect x='0' y='0' width='${l}' height='44' rx='22' fill='${n.chip}'/>
      <text x='18' y='29' fill='${n.muted}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='18' font-weight='600'>${we(r.dateLabel)}</text>

      <rect x='${l+12}' y='0' width='${o}' height='44' rx='22' fill='${i.bg}'/>
      <text x='${l+30}' y='29' fill='${i.fg}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='18' font-weight='700'>${we(r.status)}</text>
    </g>

    <g transform='translate(938 520)'>
      <text x='0' y='0' text-anchor='end' fill='${n.muted}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='29' font-weight='600'>
        ${Ve(d,0,34)}
      </text>
      <text x='0' y='86' text-anchor='end' fill='${n.text}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='22' font-weight='500' opacity='0.92'>
        ${Ve(h,0,28)}
      </text>
    </g>

    <path d='M98 440 H262' stroke='${e.accent}' stroke-opacity='0.5' stroke-width='3'/>
    <path d='M760 440 H924' stroke='${e.accent}' stroke-opacity='0.38' stroke-width='3'/>
  </g>
</svg>`;return`data:image/svg+xml;utf8,${encodeURIComponent(c)}`},qt=(e,t)=>{const r=e.palette,n=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'>
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
    <pattern id='grid' width='28' height='28' patternUnits='userSpaceOnUse' patternTransform='rotate(${t*9})'>
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
  <g transform='translate(360 512) rotate(${t*14})'>
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
</svg>`;return`data:image/svg+xml;utf8,${encodeURIComponent(n)}`},Kt=e=>{if(e<=0)return[];const t=Array.from({length:e},(n,i)=>i);let r=e*131+17;for(let n=t.length-1;n>0;n-=1){r=r*1664525+1013904223>>>0;const i=r%(n+1);[t[n],t[i]]=[t[i],t[n]]}return t},X=e=>Math.min(1,Math.max(0,e)),ee=e=>1-Math.pow(1-e,3),te=e=>e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2,G=(e,t,r)=>X((e-t)/(r-t)),Qt=({progress:e,items:t,onCardSelect:r,lowPowerMode:n=!1})=>{const{viewport:i,pointer:p,camera:d,gl:h}=Ue(),a=f.useRef([]),o=f.useRef(null),l=f.useRef([]),c=f.useRef([]),u=f.useRef([]),m=f.useRef(!1),y=f.useMemo(()=>t.map(S=>Je(S)),[t]),x=Math.min(i.width,i.height)*.165*1.2,$=x*1.46,j=t.length,C=f.useMemo(()=>t.map((S,g)=>({frontSrc:Xt(S,g+1),backSrc:qt(S,g+1),borderColor:"#f8fafc",edgeColor:S.accent,width:x,height:$})),[t,$,x]),I=f.useMemo(()=>Kt(j),[j]);l.current.length!==j&&(l.current=Array.from({length:j},()=>Ee(0))),c.current.length!==j&&(c.current=Array.from({length:j},()=>Ee(0))),u.current.length!==j&&(u.current=Array.from({length:j},()=>Ee(0)));const V=f.useMemo(()=>t.map((S,g)=>({x:(g%2===0?-1:1)*(.46+g*.08),y:(g%3-1)*.2,lift:.12+g*.014})),[t]),he=S=>{if(!m.current)return;const g=t[S],P=a.current[S];if(!g||!P)return;const b=new Z;P.getWorldPosition(b);const L=b.clone().project(d),M=h.domElement.getBoundingClientRect(),z=M.left+(L.x*.5+.5)*M.width,R=M.top+(-L.y*.5+.5)*M.height;r==null||r(g,{x:z,y:R})};return O(S=>{const g=o.current;if(!g)return;const P=S.clock.getElapsedTime(),b=X(e.get()),L=ee(G(b,0,.3)),M=ee(G(b,.2,.48)),z=ee(G(b,.42,.58)),R=te(G(b,.54,.68)),q=G(b,.64,.84),ue=G(b,.78,.98),Me=te(G(b,.95,1)),ke=te(G(b,.62,.78)),je=.56*te(G(b,.88,1)),B=X(Math.max(ke,je)),A=b>.64;m.current=b>.9;const me=L*(1-M),K=1-ee(G(b,.56,.72)),oe=p.x,re=p.y,E=Math.PI*.24*me,ae=-Math.PI*.035*me,Q=A?.012:0;g.rotation.x=(E+re*.03)*K+re*Q,g.rotation.y=(ae+oe*.05)*K+oe*Q;const ne=i.height*.56,U=(j-1)*ne,_=Me*U;g.position.x=oe*.16*K,g.position.y=re*.08*K+_;const ge=i.width*.24,xe=i.height*.18,ye=(z*.3+R*.48)*Math.PI*2;for(let v=0;v<j;v++){const k=a.current[v];if(!k)continue;const Pe=j>1?v/(j-1):0;if(c.current[v].set(B),A){const J=Pe*.32,F=te(X((q-J)/Math.max(.01,1-J*.55))),H=ee(G(q,.82,1)),Se=i.height*.6,be=-v*ne,$e=T.lerp(Se,be,F),Ce=Math.sin(F*Math.PI)*.3,Re=-v*.008;k.position.x=0,k.position.y=T.lerp($e,be,H),k.position.z=T.lerp(Ce,Re,H);const _e=Math.PI/2*F;k.rotation.x=0;const W=(1-F)*((v%2===0?-1:1)*.08),Be=_e+W;k.rotation.z=T.lerp(Be,Math.PI/2,H);const ve=Pe*.35,Y=te(X((ue-ve)/Math.max(.01,1-ve*.45))),Te=Math.sin(Y*Math.PI)*.7,Ie=Math.sin(Y*Math.PI)*.12;k.position.z+=Te,k.position.y+=Ie,l.current[v].set(1-Y);const Le=X((Y-.08)/.92);u.current[v].set(Le),F>.98&&Y>.98&&(k.position.y+=Math.sin(P*1.1+v*1.3)*.01,k.position.z+=Math.cos(P*.9+v*.7)*.005),k.rotation.y=0;const Ae=T.lerp(1,2.4,F);k.scale.setScalar(Ae)}else{const J=V[v],F=ee(X((L-Pe*.44)/.56)),H=Math.sin(F*Math.PI),Se=-v*.05,be=-(I[v]??v)*.055,$e=J.x*H,Ce=J.y*H,Re=T.lerp(Se,be,F)+J.lift*H,W=v/j*Math.PI*2+ye,Be=Math.sin(W)*ge,ve=Math.cos(W)*xe+.05,Y=-.06+Math.sin(W*2)*.012,Te=T.lerp($e,Be,M),Ie=T.lerp(Ce,ve,M),Le=T.lerp(Re,Y,M),Ae=i.height*.48*R,tt=Math.sin(W*1.1)*.06*R,He=.01+M*.022,st=Math.sin(P*1.65+v*.82)*He,ot=Math.cos(P*1.2+v*.58)*He*.45;k.position.x=Te+tt,k.position.y=Ie-Ae+st,k.position.z=Le-.16*R+ot,k.rotation.x=0,k.rotation.y=0,k.rotation.z=W*.1*M,l.current[v].set(1),u.current[v].set(0);const rt=1+.1*M-.12*R;k.scale.setScalar(rt)}}}),s.jsx("group",{ref:o,children:C.map((S,g)=>{const P=t[g],b=y[g];return s.jsx("group",{ref:L=>{L&&(a.current[g]=L)},position:[0,0,-g*.05],children:s.jsx(Qe,{...S,flip:l.current[g],edgeGlow:c.current[g],frontAttachment:!n&&P&&b?s.jsx("group",{rotation:[0,0,-Math.PI/2],scale:.56,children:s.jsx(zt,{preset:b.popoutPreset,accent:P.accent,palette:P.palette,reveal:u.current[g],intensity:b.popoutIntensity*.84})}):void 0,isClickable:()=>m.current,onClick:()=>he(g)})},(P==null?void 0:P.id)??`card-${g}`)})})},et=e=>Math.min(1,Math.max(0,e)),Jt=e=>{const t=et(e);return t<=.12?t:t<=.3?.12+(t-.12)/.18*.3:t<=.46?.42+(t-.3)/.16*.26:t<=.62?.68+(t-.46)/.16*.16:t<=.76?.84+(t-.62)/.14*.12:.96+(t-.76)/.24*.04},es=({scrollContainer:e,items:t,onCardSelect:r,forceLowPower:n=!1})=>{const i=f.useRef(null),p=f.useRef(0),d=Pt(0),{scrollYProgress:h}=St({container:e,target:i,offset:["start start","end end"],layoutEffect:!1});return $t(h,"change",a=>{p.current=a}),Ct((a,o)=>{const l=Jt(p.current),c=d.get(),u=l<.68,m=l<.96,y=(u?34e-5:m?5e-4:9e-4)*o,w=l-c,x=Math.sign(w)*Math.min(Math.abs(w),y),$=et(c+x);d.set($)}),s.jsx("div",{ref:i,children:s.jsx(It,{progress:d,height:560,forceLowPower:n,children:(a,o)=>s.jsx(Qt,{progress:a,items:t,onCardSelect:r,lowPowerMode:o.lowPowerMode})})})},ts=({item:e,originPos:t,onClose:r})=>(f.useEffect(()=>{if(!e)return;const n=i=>{i.key==="Escape"&&r()};return window.addEventListener("keydown",n),()=>window.removeEventListener("keydown",n)},[e,r]),s.jsx(Rt,{children:e&&t&&s.jsxs(s.Fragment,{children:[s.jsx(De.div,{className:"fixed inset-0 z-[90] bg-black/30 backdrop-blur-sm",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.28},onClick:r},"overlay-backdrop"),s.jsx(De.div,{className:"fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-8",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:r,children:s.jsxs(De.div,{className:"relative w-full max-w-[720px] max-h-[82vh] overflow-y-auto rounded-3xl border border-slate-200/80 bg-white/95 shadow-2xl backdrop-blur-xl",initial:{scale:.25,x:t.x-window.innerWidth/2,y:t.y-window.innerHeight/2,opacity:0},animate:{scale:1,x:0,y:0,opacity:1},exit:{scale:.85,opacity:0},transition:{type:"spring",damping:28,stiffness:260},onClick:n=>n.stopPropagation(),children:[s.jsx("div",{className:"h-1.5 rounded-t-3xl",style:{background:e.accent}}),s.jsxs("div",{className:"p-6 sm:p-8",children:[s.jsx("button",{onClick:r,className:"absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600","aria-label":"Close",children:s.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:s.jsx("path",{d:"M4 4l8 8M12 4l-8 8",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})})}),s.jsx("p",{className:"text-[11px] uppercase tracking-[0.24em] text-slate-500",children:e.subtitle}),s.jsx("h3",{className:"mt-2 text-[28px] font-medium leading-tight sm:text-[36px]",style:{color:e.accent},children:e.title}),s.jsx("p",{className:"mt-4 text-[15px] leading-relaxed text-slate-600",children:e.summary}),s.jsx("p",{className:"mt-3 text-[14px] leading-relaxed text-slate-700",children:e.details}),s.jsx("div",{className:"mt-5 flex flex-wrap gap-2",children:e.tags.map(n=>s.jsx("span",{className:"rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600",children:n},n))}),e.media.length>0&&s.jsx("div",{className:"mt-5 grid gap-3 sm:grid-cols-2",children:e.media.map((n,i)=>s.jsx("div",{className:"overflow-hidden rounded-2xl border border-slate-200 bg-slate-100",children:s.jsx("img",{src:n,alt:`${e.title} preview ${i+1}`,className:"h-44 w-full object-cover",loading:"lazy"})},`${e.id}-media-${i}`))}),e.links.length>0&&s.jsx("div",{className:"mt-5 flex flex-wrap items-center gap-3",children:e.links.map(n=>s.jsxs("a",{href:n.href,target:"_blank",rel:"noopener noreferrer",className:"rounded-lg border border-slate-300 px-4 py-2 text-[13px] font-medium text-slate-700 transition hover:bg-slate-100",children:[n.label," ↗"]},n.label))})]})]})},`overlay-${e.id}`)]})})),cs=()=>{const[e,t]=f.useState(!0),[r,n]=f.useState(null),[i,p]=f.useState(null);f.useEffect(()=>{const a=window.setTimeout(()=>{t(!1)},900);return()=>window.clearTimeout(a)},[]);const d=f.useCallback((a,o)=>{n(a),p(o)},[]),h=f.useCallback(()=>{n(null),p(null)},[]);return s.jsx(Bt,{backgroundClassName:"bg-slate-50",footerBackgroundColor:"#ffffff",footerRunwayVh:120,children:a=>s.jsxs(s.Fragment,{children:[s.jsxs("header",{className:"relative z-20 mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 pt-24 text-slate-900",children:[s.jsx("p",{className:"text-sm uppercase tracking-[0.22em] text-slate-500",children:"Projects"}),s.jsx("h1",{className:"text-3xl font-medium xs:text-4xl sm:text-5xl",children:"Ideas Realized."}),s.jsx("p",{className:"max-w-2xl text-slate-600",children:"A collection of my favorite projects, experiments, and prototypes."})]}),s.jsx("div",{className:"relative mt-8",children:s.jsx(es,{scrollContainer:a,items:Ht,onCardSelect:d,forceLowPower:e})}),s.jsx(ts,{item:r,originPos:i,onClose:h})]})})};export{cs as default};
