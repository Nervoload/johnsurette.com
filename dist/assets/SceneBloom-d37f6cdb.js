import{r as f,ay as X,j as B,aN as Y,aO as W,aP as Z,aQ as q,aR as J,aS as ee,a5 as I,Z as te,aT as j,$ as N,aU as M,aV as L,y as x,aW as P,H as R,aX as se,aY as ie,C as E,V as D,as as re,v as ae,d as oe,aZ as H,a_ as le,a$ as ne,b0 as ue,e as he}from"./index-55238d0b.js";class fe extends f.Component{getSnapshotBeforeUpdate(e){const t=this.props.childRef.current;if(t&&e.isPresent&&!this.props.isPresent){const i=t.offsetParent,r=Y(i)&&i.offsetWidth||0,s=this.props.sizeRef.current;s.height=t.offsetHeight||0,s.width=t.offsetWidth||0,s.top=t.offsetTop,s.left=t.offsetLeft,s.right=r-s.width-s.left}return null}componentDidUpdate(){}render(){return this.props.children}}function ce({children:c,isPresent:e,anchorX:t}){const i=f.useId(),r=f.useRef(null),s=f.useRef({width:0,height:0,top:0,left:0,right:0}),{nonce:o}=f.useContext(X);return f.useInsertionEffect(()=>{const{width:u,height:n,top:l,left:h,right:a}=s.current;if(e||!r.current||!u||!n)return;const d=t==="left"?`left: ${h}`:`right: ${a}`;r.current.dataset.motionPopId=i;const m=document.createElement("style");return o&&(m.nonce=o),document.head.appendChild(m),m.sheet&&m.sheet.insertRule(`
          [data-motion-pop-id="${i}"] {
            position: absolute !important;
            width: ${u}px !important;
            height: ${n}px !important;
            ${d}px !important;
            top: ${l}px !important;
          }
        `),()=>{document.head.contains(m)&&document.head.removeChild(m)}},[e]),B.jsx(fe,{isPresent:e,childRef:r,sizeRef:s,children:f.cloneElement(c,{ref:r})})}const de=({children:c,initial:e,isPresent:t,onExitComplete:i,custom:r,presenceAffectsLayout:s,mode:o,anchorX:u})=>{const n=W(me),l=f.useId();let h=!0,a=f.useMemo(()=>(h=!1,{id:l,initial:e,isPresent:t,custom:r,onExitComplete:d=>{n.set(d,!0);for(const m of n.values())if(!m)return;i&&i()},register:d=>(n.set(d,!1),()=>n.delete(d))}),[t,n,i]);return s&&h&&(a={...a}),f.useMemo(()=>{n.forEach((d,m)=>n.set(m,!1))},[t]),f.useEffect(()=>{!t&&!n.size&&i&&i()},[t]),o==="popLayout"&&(c=B.jsx(ce,{isPresent:t,anchorX:u,children:c})),B.jsx(Z.Provider,{value:a,children:c})};function me(){return new Map}const A=c=>c.key||"";function k(c){const e=[];return f.Children.forEach(c,t=>{f.isValidElement(t)&&e.push(t)}),e}const Me=({children:c,custom:e,initial:t=!0,onExitComplete:i,presenceAffectsLayout:r=!0,mode:s="sync",propagate:o=!1,anchorX:u="left"})=>{const[n,l]=q(o),h=f.useMemo(()=>k(c),[c]),a=o&&!n?[]:h.map(A),d=f.useRef(!0),m=f.useRef(h),g=W(()=>new Map),[C,T]=f.useState(h),[b,U]=f.useState(h);J(()=>{d.current=!1,m.current=h;for(let v=0;v<b.length;v++){const p=A(b[v]);a.includes(p)?g.delete(p):g.get(p)!==!0&&g.set(p,!1)}},[b,a.length,a.join("-")]);const w=[];if(h!==C){let v=[...h];for(let p=0;p<b.length;p++){const y=b[p],F=A(y);a.includes(F)||(v.splice(p,0,y),w.push(y))}return s==="wait"&&w.length&&(v=w),U(k(v)),T(h),null}const{forceRender:S}=f.useContext(ee);return B.jsx(B.Fragment,{children:b.map(v=>{const p=A(v),y=o&&!n?!1:h===b||a.includes(p),F=()=>{if(g.has(p))g.set(p,!0);else return;let V=!0;g.forEach(G=>{G||(V=!1)}),V&&(S==null||S(),U(m.current),o&&(l==null||l()),i&&i())};return B.jsx(de,{isPresent:y,initial:!d.current||t?void 0:!1,custom:e,presenceAffectsLayout:r,mode:s,onExitComplete:y?void 0:F,anchorX:u,children:v},p)})})},$={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class z{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const pe=new I(-1,1,1,-1,0,1),Q=new te;Q.setAttribute("position",new j([-1,3,0,-1,-1,0,3,-1,0],3));Q.setAttribute("uv",new j([0,2,0,0,2,0],2));class K{constructor(e){this._mesh=new N(Q,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,pe)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class ge extends z{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof M?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=L.clone(e.uniforms),this.material=new M({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new K(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class O extends z{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const r=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let o,u;this.inverse?(o=0,u=1):(o=1,u=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),s.buffers.stencil.setFunc(r.ALWAYS,o,4294967295),s.buffers.stencil.setClear(u),s.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(r.EQUAL,1,4294967295),s.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),s.buffers.stencil.setLocked(!0)}}class ve extends z{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class xe{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new x);this._width=i.width,this._height=i.height,t=new P(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:R}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new ge($),this.copyPass.material.blending=se,this.clock=new ie}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let r=0,s=this.passes.length;r<s;r++){const o=this.passes[r];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(r),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),o.needsSwap){if(i){const u=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(u.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(u.EQUAL,1,4294967295)}this.swapBuffers()}O!==void 0&&(o instanceof O?i=!0:o instanceof ve&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new x);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(i,r),this.renderTarget2.setSize(i,r);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(i,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Ce extends z{constructor(e,t,i=null,r=null,s=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=r,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new E}render(e,t,i){const r=e.autoClear;e.autoClear=!1;let s,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor)),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=r}}const be={shaderID:"luminosityHighPass",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new E(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );

			float v = dot( texel.xyz, luma );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class _ extends z{constructor(e,t,i,r){super(),this.strength=t!==void 0?t:1,this.radius=i,this.threshold=r,this.resolution=e!==void 0?new x(e.x,e.y):new x(256,256),this.clearColor=new E(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new P(s,o,{type:R}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let a=0;a<this.nMips;a++){const d=new P(s,o,{type:R});d.texture.name="UnrealBloomPass.h"+a,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);const m=new P(s,o,{type:R});m.texture.name="UnrealBloomPass.v"+a,m.texture.generateMipmaps=!1,this.renderTargetsVertical.push(m),s=Math.round(s/2),o=Math.round(o/2)}const u=be;this.highPassUniforms=L.clone(u.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new M({uniforms:this.highPassUniforms,vertexShader:u.vertexShader,fragmentShader:u.fragmentShader}),this.separableBlurMaterials=[];const n=[3,5,7,9,11];s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let a=0;a<this.nMips;a++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(n[a])),this.separableBlurMaterials[a].uniforms.invSize.value=new x(1/s,1/o),s=Math.round(s/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const h=$;this.copyUniforms=L.clone(h.uniforms),this.blendMaterial=new M({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:re,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new E,this.oldClearAlpha=1,this.basic=new ae,this.fsQuad=new K(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(i,r);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(i,r),this.renderTargetsVertical[s].setSize(i,r),this.separableBlurMaterials[s].uniforms.invSize.value=new x(1/i,1/r),i=Math.round(i/2),r=Math.round(r/2)}render(e,t,i,r,s){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=i.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let u=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this.fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=u.texture,this.separableBlurMaterials[n].uniforms.direction.value=_.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[n]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=_.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[n]),e.clear(),this.fsQuad.render(e),u=this.renderTargetsVertical[n];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(i),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=o}getSeperableBlurMaterial(e){const t=[];for(let i=0;i<e;i++)t.push(.39894*Math.exp(-.5*i*i/(e*e))/e);return new M({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new x(.5,.5)},direction:{value:new x(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new M({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}_.BlurDirectionX=new x(1,0);_.BlurDirectionY=new x(0,1);const we=({enabled:c=!0,strength:e=.32,radius:t=.72,threshold:i=.88})=>{const{gl:r,scene:s,camera:o,size:u}=oe(),n=f.useRef(!1),l=f.useMemo(()=>{try{const h=r.getPixelRatio(),a=Math.max(1,Math.floor(u.width*h)),d=Math.max(1,Math.floor(u.height*h)),m=new P(a,d,{format:H,type:R,depthBuffer:!0,stencilBuffer:!1}),g=new P(a,d,{format:H,type:R,depthBuffer:!0,stencilBuffer:!1}),C=new xe(r,g);C.renderToScreen=!1;const T=new Ce(s,o);T.clear=!0,T.clearAlpha=0,C.addPass(T);const b=new _(new x(a,d),e,t,i);C.addPass(b);const U=new M({uniforms:{tBase:{value:m.texture},tBloomCombined:{value:C.readBuffer.texture}},vertexShader:`
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
        `,depthWrite:!1,depthTest:!1,transparent:!0,blending:le}),w=new N(new ne(2,2),U),S=new ue,v=new I(-1,1,1,-1,0,1);return S.add(w),{baseTarget:m,composer:C,bloomPass:b,compositeScene:S,compositeCamera:v,compositeMaterial:U,compositeMesh:w}}catch(h){return console.error("[SceneBloom] Failed to initialize bloom pipeline.",h),null}},[r,s,o,u.width,u.height,e,t,i]);return f.useEffect(()=>{n.current=!1},[l]),f.useEffect(()=>{if(!l)return;const h=r.getPixelRatio(),a=Math.max(1,Math.floor(u.width*h)),d=Math.max(1,Math.floor(u.height*h));l.baseTarget.setSize(a,d),l.composer.setSize(u.width,u.height),l.compositeMaterial.uniforms.tBase.value=l.baseTarget.texture,l.compositeMaterial.uniforms.tBloomCombined.value=l.composer.readBuffer.texture},[l,r,u.width,u.height]),f.useEffect(()=>{l&&(l.bloomPass.enabled=c,l.bloomPass.strength=e,l.bloomPass.radius=t,l.bloomPass.threshold=i)},[l,c,e,t,i]),f.useEffect(()=>()=>{l&&(l.bloomPass.dispose(),l.composer.dispose(),l.baseTarget.dispose(),l.compositeMesh.geometry.dispose(),l.compositeMaterial.dispose())},[l]),he(h=>{const a=h.gl,d=a.autoClear,m=a.getClearAlpha(),g=a.getClearColor(new E).clone(),C=()=>{a.setRenderTarget(null),a.autoClear=!0,a.setClearColor(g,0),a.clear(!0,!0,!0),a.render(s,o)};try{if(!c||!l||n.current){C();return}a.autoClear=!0,a.setRenderTarget(l.baseTarget),a.setClearColor(g,0),a.clear(!0,!0,!0),a.render(s,o),l.composer.render(),l.compositeMaterial.uniforms.tBloomCombined.value=l.composer.readBuffer.texture,a.setRenderTarget(null),a.setClearColor(g,0),a.clear(!0,!0,!0),a.render(l.compositeScene,l.compositeCamera)}catch(T){n.current=!0,console.error("[SceneBloom] Runtime bloom failure; falling back to base render.",T),C()}finally{a.setClearColor(g,m),a.autoClear=d}},1),null};export{Me as A,we as S};
