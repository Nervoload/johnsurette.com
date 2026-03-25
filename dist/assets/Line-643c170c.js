import{b9 as de,aK as te,ba as ne,bb as ue,bc as pe,aL as he,bd as T,be as me,a as y,aJ as ve,bf as ge,bg as ye,aY as G,bh as H,az as z,bi as Se,aE as j,aF as ie,V as x,aZ as be,a_ as F,bj as q,n as se,M as we,bk as B,y as xe,$ as _e,bl as Ee,g as Ae,f as Le,b7 as k}from"./index-9319dafc.js";import{a as oe}from"./use-motion-value-c5f9e984.js";function Ue(...o){const e=!Array.isArray(o[0]),t=e?0:-1,i=o[0+t],n=o[1+t],s=o[2+t],a=o[3+t],r=de(n,s,a);return e?r(i):r}function Me(o,e,t){const i=o.get();let n=null,s=i,a;const r=typeof i=="string"?i.replace(/[\d.-]/g,""):void 0,f=()=>{n&&(n.stop(),n=null)},m=()=>{f(),n=new ue({keyframes:[$(o.get()),$(s)],velocity:o.getVelocity(),type:"spring",restDelta:.001,restSpeed:.01,...t,onUpdate:a})};o.attach((l,g)=>(s=l,a=_=>g(J(_,r)),te.postRender(m),o.get()),f);let d;return ne(e)&&(d=e.on("change",l=>o.set(J(l,r))),o.on("destroy",d)),d}function J(o,e){return e?o+e:o}function $(o){return typeof o=="number"?o:parseFloat(o)}function re(o,e){const t=oe(e()),i=()=>t.set(e());return i(),pe(()=>{const n=()=>te.preRender(i,!1,!0),s=o.map(a=>a.on("change",n));return()=>{s.forEach(a=>a()),he(i)}}),t}function ze(o){T.current=[],o();const e=re(T.current,o);return T.current=void 0,e}function Be(o,e,t,i){if(typeof o=="function")return ze(o);const n=typeof e=="function"?e:Ue(e,t,i);return Array.isArray(o)?K(o,n):K([o],([s])=>n(s))}function K(o,e){const t=me(()=>[]);return re(o,()=>{t.length=0;const i=o.length;for(let n=0;n<i;n++)t[n]=o[n].get();return e(t)})}function Ie(o,e={}){const{isStatic:t}=y.useContext(ve),i=()=>ne(o)?o.get():o;if(t)return Be(i);const n=oe(i());return y.useInsertionEffect(()=>Me(n,o,e),[n,JSON.stringify(e)]),n}const ae=(()=>parseInt(ge.replace(/\D+/g,"")))(),ce=ae>=125?"uv1":"uv2",X=new j,C=new x;class N extends ye{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],i=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(i),this.setAttribute("position",new G(e,3)),this.setAttribute("uv",new G(t,2))}applyMatrix4(e){const t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const i=new H(t,6,1);return this.setAttribute("instanceStart",new z(i,3,0)),this.setAttribute("instanceEnd",new z(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));const n=new H(i,t*2,1);return this.setAttribute("instanceColorStart",new z(n,t,0)),this.setAttribute("instanceColorEnd",new z(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new Se(e.geometry)),this}fromLineSegments(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new j);const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),X.setFromBufferAttribute(t),this.boundingBox.union(X))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ie),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){const i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let s=0,a=e.count;s<a;s++)C.fromBufferAttribute(e,s),n=Math.max(n,i.distanceToSquared(C)),C.fromBufferAttribute(t,s),n=Math.max(n,i.distanceToSquared(C));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}class le extends N{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){const t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e,t=3){const i=e.length-t,n=new Float32Array(2*i);if(t===3)for(let s=0;s<i;s+=t)n[2*s]=e[s],n[2*s+1]=e[s+1],n[2*s+2]=e[s+2],n[2*s+3]=e[s+3],n[2*s+4]=e[s+4],n[2*s+5]=e[s+5];else for(let s=0;s<i;s+=t)n[2*s]=e[s],n[2*s+1]=e[s+1],n[2*s+2]=e[s+2],n[2*s+3]=e[s+3],n[2*s+4]=e[s+4],n[2*s+5]=e[s+5],n[2*s+6]=e[s+6],n[2*s+7]=e[s+7];return super.setColors(n,t),this}fromLine(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class W extends be{constructor(e){super({type:"LineMaterial",uniforms:F.clone(F.merge([q.common,q.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new se(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${ae>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(t){this.uniforms.diffuse.value=t}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(t){this.uniforms.linewidth.value=t}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(t){!!t!="USE_DASH"in this.defines&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(t){this.uniforms.dashScale.value=t}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(t){this.uniforms.dashSize.value=t}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(t){this.uniforms.dashOffset.value=t}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(t){this.uniforms.gapSize.value=t}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(t){this.uniforms.opacity.value=t}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(t){this.uniforms.resolution.value.copy(t)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(t){!!t!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),t===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}const I=new B,Y=new x,Z=new x,u=new B,p=new B,S=new B,R=new x,V=new _e,h=new Ee,Q=new x,O=new j,D=new ie,b=new B;let w,L;function ee(o,e,t){return b.set(0,0,-e,1).applyMatrix4(o.projectionMatrix),b.multiplyScalar(1/b.w),b.x=L/t.width,b.y=L/t.height,b.applyMatrix4(o.projectionMatrixInverse),b.multiplyScalar(1/b.w),Math.abs(Math.max(b.x,b.y))}function Ce(o,e){const t=o.matrixWorld,i=o.geometry,n=i.attributes.instanceStart,s=i.attributes.instanceEnd,a=Math.min(i.instanceCount,n.count);for(let r=0,f=a;r<f;r++){h.start.fromBufferAttribute(n,r),h.end.fromBufferAttribute(s,r),h.applyMatrix4(t);const m=new x,d=new x;w.distanceSqToSegment(h.start,h.end,d,m),d.distanceTo(m)<L*.5&&e.push({point:d,pointOnLine:m,distance:w.origin.distanceTo(d),object:o,face:null,faceIndex:r,uv:null,[ce]:null})}}function Oe(o,e,t){const i=e.projectionMatrix,s=o.material.resolution,a=o.matrixWorld,r=o.geometry,f=r.attributes.instanceStart,m=r.attributes.instanceEnd,d=Math.min(r.instanceCount,f.count),l=-e.near;w.at(1,S),S.w=1,S.applyMatrix4(e.matrixWorldInverse),S.applyMatrix4(i),S.multiplyScalar(1/S.w),S.x*=s.x/2,S.y*=s.y/2,S.z=0,R.copy(S),V.multiplyMatrices(e.matrixWorldInverse,a);for(let g=0,_=d;g<_;g++){if(u.fromBufferAttribute(f,g),p.fromBufferAttribute(m,g),u.w=1,p.w=1,u.applyMatrix4(V),p.applyMatrix4(V),u.z>l&&p.z>l)continue;if(u.z>l){const c=u.z-p.z,v=(u.z-l)/c;u.lerp(p,v)}else if(p.z>l){const c=p.z-u.z,v=(p.z-l)/c;p.lerp(u,v)}u.applyMatrix4(i),p.applyMatrix4(i),u.multiplyScalar(1/u.w),p.multiplyScalar(1/p.w),u.x*=s.x/2,u.y*=s.y/2,p.x*=s.x/2,p.y*=s.y/2,h.start.copy(u),h.start.z=0,h.end.copy(p),h.end.z=0;const U=h.closestPointToPointParameter(R,!0);h.at(U,Q);const M=xe.lerp(u.z,p.z,U),A=M>=-1&&M<=1,P=R.distanceTo(Q)<L*.5;if(A&&P){h.start.fromBufferAttribute(f,g),h.end.fromBufferAttribute(m,g),h.start.applyMatrix4(a),h.end.applyMatrix4(a);const c=new x,v=new x;w.distanceSqToSegment(h.start,h.end,v,c),t.push({point:v,pointOnLine:c,distance:w.origin.distanceTo(v),object:o,face:null,faceIndex:g,uv:null,[ce]:null})}}}class fe extends we{constructor(e=new N,t=new W({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let a=0,r=0,f=t.count;a<f;a++,r+=2)Y.fromBufferAttribute(t,a),Z.fromBufferAttribute(i,a),n[r]=r===0?0:n[r-1],n[r+1]=n[r]+Y.distanceTo(Z);const s=new H(n,2,1);return e.setAttribute("instanceDistanceStart",new z(s,1,0)),e.setAttribute("instanceDistanceEnd",new z(s,1,1)),this}raycast(e,t){const i=this.material.worldUnits,n=e.camera;n===null&&!i&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const s=e.params.Line2!==void 0&&e.params.Line2.threshold||0;w=e.ray;const a=this.matrixWorld,r=this.geometry,f=this.material;L=f.linewidth+s,r.boundingSphere===null&&r.computeBoundingSphere(),D.copy(r.boundingSphere).applyMatrix4(a);let m;if(i)m=L*.5;else{const l=Math.max(n.near,D.distanceToPoint(w.origin));m=ee(n,l,f.resolution)}if(D.radius+=m,w.intersectsSphere(D)===!1)return;r.boundingBox===null&&r.computeBoundingBox(),O.copy(r.boundingBox).applyMatrix4(a);let d;if(i)d=L*.5;else{const l=Math.max(n.near,O.distanceToPoint(w.origin));d=ee(n,l,f.resolution)}O.expandByScalar(d),w.intersectsBox(O)!==!1&&(i?Ce(this,t):Oe(this,n,t))}onBeforeRender(e){const t=this.material.uniforms;t&&t.resolution&&(e.getViewport(I),this.material.uniforms.resolution.value.set(I.z,I.w))}}class De extends fe{constructor(e=new le,t=new W({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type="Line2"}}const Re=y.forwardRef(function({points:e,color:t=16777215,vertexColors:i,linewidth:n,lineWidth:s,segments:a,dashed:r,...f},m){var d,l;const g=Ae(A=>A.size),_=y.useMemo(()=>a?new fe:new De,[a]),[E]=y.useState(()=>new W),U=(i==null||(d=i[0])==null?void 0:d.length)===4?4:3,M=y.useMemo(()=>{const A=a?new N:new le,P=e.map(c=>{const v=Array.isArray(c);return c instanceof x||c instanceof B?[c.x,c.y,c.z]:c instanceof se?[c.x,c.y,0]:v&&c.length===3?[c[0],c[1],c[2]]:v&&c.length===2?[c[0],c[1],0]:c});if(A.setPositions(P.flat()),i){t=16777215;const c=i.map(v=>v instanceof Le?v.toArray():v);A.setColors(c.flat(),U)}return A},[e,a,i,U]);return y.useLayoutEffect(()=>{_.computeLineDistances()},[e,_]),y.useLayoutEffect(()=>{r?E.defines.USE_DASH="":delete E.defines.USE_DASH,E.needsUpdate=!0},[r,E]),y.useEffect(()=>()=>{M.dispose(),E.dispose()},[M]),y.createElement("primitive",k({object:_,ref:m},f),y.createElement("primitive",{object:M,attach:"geometry"}),y.createElement("primitive",k({object:E,attach:"material",color:t,vertexColors:!!i,resolution:[g.width,g.height],linewidth:(l=n??s)!==null&&l!==void 0?l:1,dashed:r,transparent:U===4},f)))});export{Re as L,Be as a,Ie as u};
