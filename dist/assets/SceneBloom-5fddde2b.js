import{a as T,r as l,u as y}from"./vendor-react-42df3ce4.js";import{v as M,j as w,H as P,e as S,c as E,aH as U,M as A,aN as F,m as H,O as z,t as D}from"./vendor-three-core-f6c6daec.js";import{E as O,a as W,U as _}from"./vendor-three-extras-53049b4e.js";const k=({enabled:h=!0,strength:m=.32,radius:u=.72,threshold:f=.88})=>{const{gl:i,scene:d,camera:p,size:o}=T(),b=l.useRef(!1),e=l.useMemo(()=>{try{const t=i.getPixelRatio(),r=Math.max(1,Math.floor(o.width*t)),s=Math.max(1,Math.floor(o.height*t)),g=new M(r,s,{format:w,type:P,depthBuffer:!0,stencilBuffer:!1}),n=new M(r,s,{format:w,type:P,depthBuffer:!0,stencilBuffer:!1}),a=new O(i,n);a.renderToScreen=!1;const c=new W(d,p);c.clear=!0,c.clearAlpha=0,a.addPass(c);const v=new _(new S(r,s),m,u,f);a.addPass(v);const C=new E({uniforms:{tBase:{value:g.texture},tBloomCombined:{value:a.readBuffer.texture}},vertexShader:`
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
        `,depthWrite:!1,depthTest:!1,transparent:!0,blending:U}),B=new A(new F(2,2),C),x=new H,R=new z(-1,1,1,-1,0,1);return x.add(B),{baseTarget:g,composer:a,bloomPass:v,compositeScene:x,compositeCamera:R,compositeMaterial:C,compositeMesh:B}}catch(t){return console.error("[SceneBloom] Failed to initialize bloom pipeline.",t),null}},[i,d,p,o.width,o.height,m,u,f]);return l.useEffect(()=>{b.current=!1},[e]),l.useEffect(()=>{if(!e)return;const t=i.getPixelRatio(),r=Math.max(1,Math.floor(o.width*t)),s=Math.max(1,Math.floor(o.height*t));e.baseTarget.setSize(r,s),e.composer.setSize(o.width,o.height),e.compositeMaterial.uniforms.tBase.value=e.baseTarget.texture,e.compositeMaterial.uniforms.tBloomCombined.value=e.composer.readBuffer.texture},[e,i,o.width,o.height]),l.useEffect(()=>{e&&(e.bloomPass.enabled=h,e.bloomPass.strength=m,e.bloomPass.radius=u,e.bloomPass.threshold=f)},[e,h,m,u,f]),l.useEffect(()=>()=>{e&&(e.bloomPass.dispose(),e.composer.dispose(),e.baseTarget.dispose(),e.compositeMesh.geometry.dispose(),e.compositeMaterial.dispose())},[e]),y(t=>{const r=t.gl,s=r.autoClear,g=r.getClearAlpha(),n=r.getClearColor(new D).clone(),a=()=>{r.setRenderTarget(null),r.autoClear=!0,r.setClearColor(n,0),r.clear(!0,!0,!0),r.render(d,p)};try{if(!h||!e||b.current){a();return}r.autoClear=!0,r.setRenderTarget(e.baseTarget),r.setClearColor(n,0),r.clear(!0,!0,!0),r.render(d,p),e.composer.render(),e.compositeMaterial.uniforms.tBloomCombined.value=e.composer.readBuffer.texture,r.setRenderTarget(null),r.setClearColor(n,0),r.clear(!0,!0,!0),r.render(e.compositeScene,e.compositeCamera)}catch(c){b.current=!0,console.error("[SceneBloom] Runtime bloom failure; falling back to base render.",c),a()}finally{r.setClearColor(n,g),r.autoClear=s}},1),null};export{k as S};
