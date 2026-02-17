import{r as M,j as o,C as Pt,u as Fe,S as Ct}from"./vendor-react-dd4faaa1.js";import{s as Je,u as At}from"./index-0d06e1ea.js";import{S as Ke,O as Qe,W as Ze,k as be,r as z,s as _t,h as C,p as we,t as Tt,e as Ae,i as _e,u as Te,v as De,M as ye,q as jt,d as je}from"./vendor-three-core-95690918.js";import{C as Nt}from"./CanvasErrorBoundary-ed8965f4.js";import{a as Et,b as ne,m as $}from"./vendor-motion-67d84b2b.js";import{P as It}from"./PageScaffold-cf994b92.js";import"./vendor-misc-72c8405f.js";const Rt=["Initializing interactive showcase...","Quantum display matrix online.","Signal harmonics synced.","Rotate, hover, and click to shape the field."],kt=52,Lt=26,zt=1200,Dt=({activeSection:e})=>{const t=M.useMemo(()=>[...Rt,...Je.map(c=>`Open ${c.name} -> ${c.path}`)],[]),a=M.useMemo(()=>e?[`Focused route: ${e}`,...t]:t,[e,t]),[n,s]=M.useState(0),[h,r]=M.useState(0),[u,i]=M.useState(!1),[m,f]=M.useState(!1);M.useEffect(()=>{s(0),r(0),i(!1),f(!1)},[a]),M.useEffect(()=>{if(m)return;const c=a[n]??a[0],p=h>=c.length,g=h<=0;if(!u&&p){f(!0);const b=window.setTimeout(()=>{f(!1),i(!0)},zt);return()=>window.clearTimeout(b)}if(u&&g){i(!1),s(b=>(b+1)%a.length);return}const x=window.setTimeout(()=>{r(b=>b+(u?-1:1))},u?Lt:kt);return()=>window.clearTimeout(x)},[u,m,n,a,h]);const l=(a[n]??a[0]).slice(0,Math.max(0,h));return o.jsxs("div",{className:"pointer-events-none absolute left-1/2 top-[67%] z-30 w-[min(84vw,670px)] -translate-x-1/2 rounded-xl border border-cyan-200/35 bg-slate-950/60 px-4 py-3 shadow-[0_16px_52px_-26px_rgba(14,116,144,0.85),0_0_28px_rgba(56,189,248,0.18)] backdrop-blur-xl sm:px-5",children:[o.jsxs("div",{className:"mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-cyan-100/70",children:[o.jsx("span",{className:"h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]"}),o.jsx("span",{children:"signal terminal"})]}),o.jsxs("p",{className:"min-h-[1.5rem] font-mono text-sm text-cyan-50 sm:text-base",children:[o.jsx("span",{children:l}),o.jsx("span",{className:"ml-[1px] inline-block h-[1.1em] w-[0.6ch] translate-y-[2px] animate-pulse bg-cyan-300/90 shadow-[0_0_8px_rgba(103,232,249,0.9)]"})]})]})},Bt=1700,Ot=e=>1-Math.pow(1-e,3),Ft=({activeSection:e,centerpiece:t})=>{const a=M.useRef(null),[n,s]=M.useState({x:0,y:0}),[h,r]=M.useState(!1),[u,i]=M.useState(!1),[m,f]=M.useState(0);M.useEffect(()=>{let l=0;const c=performance.now(),p=g=>{const x=Math.min(1,(g-c)/Bt);f(Ot(x)),x<1&&(l=window.requestAnimationFrame(p))};return l=window.requestAnimationFrame(p),()=>window.cancelAnimationFrame(l)},[]);const d=l=>{var x;const c=(x=a.current)==null?void 0:x.getBoundingClientRect();if(!c)return;const p=(l.clientX-c.left)/c.width*2-1,g=(l.clientY-c.top)/c.height*2-1;s({x:Math.max(-1,Math.min(1,p)),y:Math.max(-1,Math.min(1,g))})};return o.jsxs("div",{className:"relative h-[clamp(220px,65vmin,720px)] w-[clamp(220px,65vmin,720px)] sm:h-[clamp(260px,74vmin,720px)] sm:w-[clamp(260px,74vmin,720px)]",children:[o.jsx("div",{className:"pointer-events-none absolute inset-[-24%] rounded-full bg-[radial-gradient(circle_at_40%_30%,rgba(56,189,248,0.25),rgba(99,102,241,0.17)_36%,rgba(217,70,239,0.14)_54%,rgba(2,6,23,0)_75%)] blur-[40px]"}),o.jsx("div",{className:"pointer-events-none absolute inset-[-8%] stage-flow-ring"}),o.jsx("div",{className:"pointer-events-none absolute inset-[2%] stage-flow-ring-alt"}),o.jsxs("div",{ref:a,className:"relative h-full w-full touch-pan-y overflow-hidden rounded-full border border-cyan-200/10 bg-[radial-gradient(circle_at_50%_36%,rgba(30,41,59,0.72),rgba(15,23,42,0.62)_44%,rgba(2,6,23,0.42)_100%)] shadow-[0_55px_140px_-85px_rgba(14,116,144,0.82),inset_0_0_80px_rgba(56,189,248,0.08)]",onPointerEnter:()=>r(!0),onPointerLeave:()=>{r(!1),i(!1),s({x:0,y:0})},onPointerDown:()=>i(!0),onPointerUp:()=>i(!1),onPointerMove:d,children:[o.jsx("div",{className:"pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_50%_34%,rgba(56,189,248,0.06),rgba(15,23,42,0.03)_46%,rgba(2,6,23,0.08)_100%)] backdrop-blur-[1px]"}),o.jsx("div",{className:"absolute inset-0 z-10",children:o.jsx(t,{activeSection:e,pointer:n,hovering:h,pressed:u,introProgress:m})})]}),o.jsx(Dt,{activeSection:e})]})},Ne=Math.PI*2,ce=(e,t,a)=>Math.min(a,Math.max(t,e)),ee=(e,t,a,n)=>`hsla(${(e%360+360)%360},${ce(t,0,100)}%,${ce(a,0,100)}%,${ce(n,0,1)})`,Vt=(e,t)=>{const a=e.profiles[t.classType];return a[t.profileIndex]??a[0]},Ve=e=>.55+e.z*.95,We=(e,t)=>({hue:t.shape.hue+e.hueOffset,saturation:ce(t.shape.saturation+e.saturationOffset,16,98),lightness:ce(t.shape.lightness+e.lightnessOffset,22,92)}),Wt=(e,t)=>({x:t.nx*e.width,y:t.ny*e.height}),$t=(e,t,a)=>{const n=a*.5,s=Math.max(n,t*.5);e.beginPath(),e.moveTo(-s+n,-n),e.lineTo(s-n,-n),e.arc(s-n,0,n,-Math.PI/2,Math.PI/2),e.lineTo(-s+n,n),e.arc(-s+n,0,n,Math.PI/2,-Math.PI/2),e.closePath()},Ht=(e,t,a,n,s,h)=>{var p;const r=Ve(a),u=((p=a.bacteria)==null?void 0:p.subCells)??[{offsetX:0,offsetY:0,vx:0,vy:0,scale:1}],i=We(a,n),m=i.hue,f=i.saturation,d=i.lightness,l=n.shape.alpha*(.35+a.z*.75),c=a.bacteria;for(let g=0;g<u.length;g++){const x=u[g],b=(n.shape.length??n.shape.size*2.1)*x.scale*r,w=(n.shape.thickness??n.shape.size*.45)*x.scale*r,y=a.rotation+g*.2;if(e.save(),e.translate(s+x.offsetX*r,h+x.offsetY*r),e.rotate(y),$t(e,b,w),e.fillStyle=ee(m+g*5,f,d+2,l),e.shadowColor=ee(m+8,f,d+10,l*.45),e.shadowBlur=8*r,e.fill(),e.shadowBlur=0,e.strokeStyle=ee(m-8,f-8,d-6,l*.9),e.lineWidth=Math.max(.65,w*.14),e.stroke(),c!=null&&c.hasFlagella&&g<c.flagellaCount){const S=1+g%2,A=-b*.52,P=c.flagellaLength*x.scale*r,v=c.flagellaPhase+g*.9+t.time*.35;for(let _=0;_<S;_++){const T=(_/Math.max(1,S-1)-.5)*w*.72;e.beginPath(),e.moveTo(A,T);for(let R=1;R<=6;R++){const W=R/6,G=A-P*W,te=Math.sin(v+W*7+_*1.4)*w*(.18+W*.44);e.lineTo(G,T+te)}e.strokeStyle=ee(m+18,f-8,d+6,l*.84),e.lineWidth=Math.max(.45,w*.11),e.lineCap="round",e.stroke()}}e.restore()}},Xt=(e,t,a,n,s,h)=>{var S,A,P;const r=Ve(a),u=(n.shape.headRadius??n.shape.size*.5)*r,i=(n.shape.tailLength??n.shape.size*1.3)*r,m=6,f=n.shape.alpha*(.32+a.z*.72),d=Math.sin((((S=a.bacteriophage)==null?void 0:S.flutterPhase)??0)+t.time*1.2),l=We(a,n),c=l.hue,p=l.saturation,g=l.lightness;e.save(),e.translate(s,h),e.rotate(a.rotation+d*.08),e.shadowColor=ee(c+10,p,g+8,f*.5),e.shadowBlur=7*r,e.beginPath();for(let v=0;v<8;v++){const _=v/8*Ne+Math.PI/8,N=Math.cos(_)*u,T=Math.sin(_)*u;v===0?e.moveTo(N,T):e.lineTo(N,T)}e.closePath(),e.fillStyle=ee(c,p,g+6,f),e.fill(),e.shadowBlur=0,e.strokeStyle=ee(c+12,p+4,g+12,f*.95),e.lineWidth=Math.max(.9,u*.24),e.stroke();const x=u*.85,b=x+i,w=((A=a.bacteriophage)==null?void 0:A.flutterPhase)??0,y=(1.1+(((P=a.bacteriophage)==null?void 0:P.tailJitter)??.7)*1.2)*r;e.beginPath(),e.moveTo(x,0);for(let v=1;v<=m;v++){const _=v/m,N=x+(b-x)*_,T=Math.sin(t.time*3.3+w+v*.85)*y*(.2+_*.8);e.lineTo(N,T)}e.strokeStyle=ee(c+8,p-4,g+4,f*.9),e.lineWidth=Math.max(.85,u*.17),e.stroke(),e.restore()},Ut=(e,t,a,n,s,h)=>{var x;const r=Ve(a),u=(n.shape.size??10)*.58*r,i=ce(Math.round(n.shape.protrusions??10),6,20),m=(n.shape.protrusionLength??2.4)*r,f=n.shape.alpha*(.34+a.z*.74),d=((x=a.viralEnvelope)==null?void 0:x.protrusionWobble)??t.time,l=We(a,n),c=l.hue,p=l.saturation,g=l.lightness;e.save(),e.translate(s,h),e.rotate(a.rotation*.4),e.strokeStyle=ee(c+8,p+4,g+8,f*.8),e.lineWidth=Math.max(.7,u*.16);for(let b=0;b<i;b++){const y=b/i*Ne+d*.28,S=Math.cos(y)*u,A=Math.sin(y)*u,P=.8+Math.sin(t.time*1.6+b*.7+d)*.22,v=u+m*P,_=Math.cos(y)*v,N=Math.sin(y)*v;e.beginPath(),e.moveTo(S,A),e.lineTo(_,N),e.stroke()}e.shadowColor=ee(c+8,p+2,g+10,f*.42),e.shadowBlur=9*r,e.fillStyle=ee(c,p,g+4,f*.22),e.beginPath(),e.arc(0,0,u,0,Ne),e.arc(0,0,u*.56,0,Ne,!0),e.fill("evenodd"),e.shadowBlur=0,e.strokeStyle=ee(c-4,p-8,g-4,f*.92),e.lineWidth=Math.max(.9,u*.18),e.stroke(),e.restore()},Gt=(e,t,a,n,s,h)=>{var b;const r=Ve(a),u=(n.shape.size??11)*.66*r,i=ce(Math.round(n.shape.lobeCount??10),6,18),m=ce(n.shape.roughness??.15,.02,.38),f=n.shape.alpha*(.3+a.z*.7),d=1+Math.sin((((b=a.amoeba)==null?void 0:b.pulsePhase)??0)+t.time*.8)*.1,l=We(a,n),c=l.hue,p=l.saturation,g=l.lightness,x=[];for(let w=0;w<i;w++){const y=w/i*Ne,S=Math.sin(y*2+t.time*1.4+a.id*.37),A=Math.sin(y*5-t.time*.9+a.id*.11),P=1+m*(S*.65+A*.35),v=u*d*P;x.push({x:Math.cos(y)*v,y:Math.sin(y)*v})}e.save(),e.translate(s,h),e.rotate(a.rotation*.35),e.beginPath();for(let w=0;w<x.length;w++){const y=x[w],S=x[(w+1)%x.length],A=(y.x+S.x)*.5,P=(y.y+S.y)*.5;w===0?e.moveTo(A,P):e.quadraticCurveTo(y.x,y.y,A,P)}e.closePath(),e.shadowColor=ee(c+10,p+2,g+8,f*.45),e.shadowBlur=10*r,e.fillStyle=ee(c,p,g+1,f),e.fill(),e.shadowBlur=0,e.strokeStyle=ee(c-6,p-12,g-8,f*.9),e.lineWidth=Math.max(.8,u*.16),e.stroke(),e.restore()},Yt=(e,t,a)=>{const n=Vt(t,a),{x:s,y:h}=Wt(t,a);if(a.classType==="bacteria"){Ht(e,t,a,n,s,h);return}if(a.classType==="bacteriophage"){Xt(e,t,a,n,s,h);return}if(a.classType==="viralEnvelope"){Ut(e,t,a,n,s,h);return}Gt(e,t,a,n,s,h)},qt=e=>{const t=e.particles.slice();return t.sort((a,n)=>a.z-n.z),t},Jt=(e,t)=>{e.clearRect(0,0,t.width,t.height);const a=qt(t);for(let n=0;n<a.length;n++)Yt(e,t,a[n])},ct=18,Kt=42,et={low:{areaDivisor:15e3,minParticles:80,maxParticles:130,maxAmoebaChecks:4,emissionCapPerVirus:4,bacteriaSubCellCap:3},balanced:{areaDivisor:9800,minParticles:110,maxParticles:190,maxAmoebaChecks:8,emissionCapPerVirus:6,bacteriaSubCellCap:4},high:{areaDivisor:7200,minParticles:150,maxParticles:260,maxAmoebaChecks:12,emissionCapPerVirus:10,bacteriaSubCellCap:5}},Pe=[{classType:"bacteria",weight:.45},{classType:"viralEnvelope",weight:.22},{classType:"amoeba",weight:.18},{classType:"bacteriophage",weight:.15}],Qt=14,Zt={bacteria:{slideDurationMin:.35,slideDurationMax:1.2,pauseDurationMin:.18,pauseDurationMax:.95,impulseMin:26,impulseMax:92,dampingMin:.915,dampingMax:.965,flowScaleMin:.95,flowScaleMax:1.3,driftJitterMin:5,driftJitterMax:14},bacteriophage:{slideDurationMin:.32,slideDurationMax:1,pauseDurationMin:.24,pauseDurationMax:.85,impulseMin:22,impulseMax:68,dampingMin:.92,dampingMax:.968,flowScaleMin:.9,flowScaleMax:1.22,driftJitterMin:4,driftJitterMax:11},viralEnvelope:{slideDurationMin:.38,slideDurationMax:1.1,pauseDurationMin:.2,pauseDurationMax:.9,impulseMin:20,impulseMax:58,dampingMin:.92,dampingMax:.966,flowScaleMin:.88,flowScaleMax:1.2,driftJitterMin:4,driftJitterMax:12},amoeba:{slideDurationMin:.42,slideDurationMax:1.2,pauseDurationMin:.22,pauseDurationMax:.92,impulseMin:16,impulseMax:52,dampingMin:.93,dampingMax:.97,flowScaleMin:.86,flowScaleMax:1.1,driftJitterMin:3,driftJitterMax:9}},ea={bacteria:{sizeMin:7,sizeMax:15,trailLengthMin:8,trailLengthMax:14,trailWidthMin:1.3,trailWidthMax:2.6,lengthMin:14,lengthMax:34,thicknessMin:4,thicknessMax:10,maxSubCellsMin:2,maxSubCellsMax:4,fissionIntervalMin:1.8,fissionIntervalMax:4.2,localJitterMin:4,localJitterMax:16},bacteriophage:{sizeMin:7,sizeMax:13,trailLengthMin:5,trailLengthMax:9,trailWidthMin:1,trailWidthMax:1.9,headRadiusMin:4,headRadiusMax:8,tailLengthMin:10,tailLengthMax:18,tailLegsMin:3,tailLegsMax:6},viralEnvelope:{sizeMin:7,sizeMax:14,trailLengthMin:6,trailLengthMax:10,trailWidthMin:1,trailWidthMax:2.2,protrusionsMin:8,protrusionsMax:14,protrusionLengthMin:1.5,protrusionLengthMax:4,emissionIntervalMin:.7,emissionIntervalMax:2,emissionSpeedMin:28,emissionSpeedMax:80,emissionTTLMin:.4,emissionTTLMax:1},amoeba:{sizeMin:9,sizeMax:18,trailLengthMin:5,trailLengthMax:8,trailWidthMin:1.4,trailWidthMax:2.8,lobeCountMin:8,lobeCountMax:14,roughnessMin:.08,roughnessMax:.24,pulseSpeedMin:.8,pulseSpeedMax:1.9,senseRadiusMin:58,senseRadiusMax:126,chaseStrengthMin:18,chaseStrengthMax:56,bumpStrengthMin:40,bumpStrengthMax:88}},ta={biotic:{bacteria:{hueMin:26,hueMax:182,saturationMin:52,saturationMax:90,lightnessMin:48,lightnessMax:74,alphaMin:.24,alphaMax:.5},bacteriophage:{hueMin:176,hueMax:340,saturationMin:60,saturationMax:92,lightnessMin:52,lightnessMax:76,alphaMin:.26,alphaMax:.48},viralEnvelope:{hueMin:0,hueMax:360,saturationMin:58,saturationMax:94,lightnessMin:50,lightnessMax:76,alphaMin:.24,alphaMax:.48},amoeba:{hueMin:72,hueMax:252,saturationMin:42,saturationMax:84,lightnessMin:42,lightnessMax:70,alphaMin:.22,alphaMax:.44}},labBlue:{bacteria:{hueMin:188,hueMax:210,saturationMin:42,saturationMax:76,lightnessMin:50,lightnessMax:74,alphaMin:.22,alphaMax:.44},bacteriophage:{hueMin:196,hueMax:230,saturationMin:52,saturationMax:84,lightnessMin:52,lightnessMax:74,alphaMin:.24,alphaMax:.46},viralEnvelope:{hueMin:184,hueMax:220,saturationMin:50,saturationMax:86,lightnessMin:52,lightnessMax:75,alphaMin:.24,alphaMax:.46},amoeba:{hueMin:176,hueMax:206,saturationMin:34,saturationMax:70,lightnessMin:46,lightnessMax:66,alphaMin:.22,alphaMax:.42}},neon:{bacteria:{hueMin:40,hueMax:320,saturationMin:62,saturationMax:96,lightnessMin:54,lightnessMax:78,alphaMin:.26,alphaMax:.54},bacteriophage:{hueMin:180,hueMax:310,saturationMin:68,saturationMax:98,lightnessMin:56,lightnessMax:80,alphaMin:.28,alphaMax:.56},viralEnvelope:{hueMin:8,hueMax:300,saturationMin:64,saturationMax:98,lightnessMin:56,lightnessMax:80,alphaMin:.28,alphaMax:.56},amoeba:{hueMin:130,hueMax:280,saturationMin:52,saturationMax:94,lightnessMin:48,lightnessMax:76,alphaMin:.24,alphaMax:.5}}},vt=(e,t)=>{const a=(e+1)*2654435761+(t+1)*1013904223>>>0;return a===0?1:a},aa=e=>{const t=e*1664525+1013904223>>>0;return t===0?1:t},$e=e=>{const t=aa(e);return[t,t/4294967296]},E=(e,t,a)=>{const[n,s]=$e(e);return[n,t+(a-t)*s]},Ce=(e,t,a)=>{const[n,s]=$e(e),h=a-t+1;return[n,t+Math.floor(s*h)]},na={bacteria:11,bacteriophage:29,viralEnvelope:47,amoeba:83},bt={biotic:7,labBlue:31,neon:59},sa={low:17,balanced:41,high:73},Be=72,ut={bacteria:{min:-.16,max:.16},bacteriophage:{min:-.34,max:.34},viralEnvelope:{min:-.24,max:.24},amoeba:{min:-.12,max:.12}},oa={bacteria:.34,bacteriophage:1,viralEnvelope:.7,amoeba:.52},me=(e,t,a)=>Math.min(a,Math.max(t,e)),ia=e=>{const[t,a]=$e(e);let n=0;for(let s=0;s<Pe.length;s++)if(n+=Pe[s].weight,a<=n)return[t,Pe[s].classType];return[t,Pe[Pe.length-1].classType]},yt=(e,t,a)=>{const n=et[a],s=e*t;return me(Math.floor(s/n.areaDivisor),n.minParticles,n.maxParticles)},D=e=>{const[t,a]=$e(e.rngState);return e.rngState=t,a},I=(e,t,a)=>t+(a-t)*D(e),He=(e,t)=>{const a=e.profiles[t.classType];return a[t.profileIndex]??a[0]},tt=(e,t,a)=>{const n=e.reducedMotion?.52:1;return(ct+(Kt-ct)*t.z)*a.motion.flowScale*e.flowStrength*n},ra=e=>{const t={bacteria:[],bacteriophage:[],viralEnvelope:[],amoeba:[]},a=["bacteria","bacteriophage","viralEnvelope","amoeba"];for(let n=0;n<a.length;n++){const s=a[n];for(let h=0;h<Qt;h++){let r=vt(h,na[s]+bt[e]*13);const u=Zt[s],i=ea[s],m=ta[e][s];let f,d,l,c,p,g;[r,f]=E(r,u.slideDurationMin,u.slideDurationMax),[r,d]=E(r,u.pauseDurationMin,u.pauseDurationMax),[r,l]=E(r,u.impulseMin,u.impulseMax),[r,c]=E(r,u.dampingMin,u.dampingMax),[r,p]=E(r,u.flowScaleMin,u.flowScaleMax),[r,g]=E(r,u.driftJitterMin,u.driftJitterMax);let x,b,w,y,S,A,P;[r,x]=E(r,i.sizeMin,i.sizeMax),[r,b]=E(r,i.trailLengthMin,i.trailLengthMax),[r,w]=E(r,i.trailWidthMin,i.trailWidthMax),[r,y]=E(r,m.hueMin,m.hueMax),[r,S]=E(r,m.saturationMin,m.saturationMax),[r,A]=E(r,m.lightnessMin,m.lightnessMax),[r,P]=E(r,m.alphaMin,m.alphaMax);const v={id:h,classType:s,motion:{slideDuration:f,pauseDuration:d,impulse:l,damping:c,flowScale:p,driftJitter:g},shape:{classType:s,size:x,trailLength:b,trailWidth:w,hue:y,saturation:S,lightness:A,alpha:P}};if(s==="bacteria"){let _,N,T,R,W;[r,_]=E(r,i.lengthMin??14,i.lengthMax??30),[r,N]=E(r,i.thicknessMin??4,i.thicknessMax??9),[r,T]=Ce(r,i.maxSubCellsMin??2,i.maxSubCellsMax??4),[r,R]=E(r,i.fissionIntervalMin??2,i.fissionIntervalMax??4),[r,W]=E(r,i.localJitterMin??4,i.localJitterMax??12),v.shape.length=_,v.shape.thickness=N,v.shape.maxSubCells=T,v.shape.fissionInterval=R,v.shape.localJitter=W}if(s==="bacteriophage"){let _,N,T;[r,_]=E(r,i.headRadiusMin??4,i.headRadiusMax??8),[r,N]=E(r,i.tailLengthMin??10,i.tailLengthMax??18),[r,T]=Ce(r,i.tailLegsMin??3,i.tailLegsMax??6),v.shape.headRadius=_,v.shape.tailLength=N,v.shape.tailLegs=T}if(s==="viralEnvelope"){let _,N,T,R,W;[r,_]=Ce(r,i.protrusionsMin??8,i.protrusionsMax??14),[r,N]=E(r,i.protrusionLengthMin??1.5,i.protrusionLengthMax??4),[r,T]=E(r,i.emissionIntervalMin??.7,i.emissionIntervalMax??2),[r,R]=E(r,i.emissionSpeedMin??28,i.emissionSpeedMax??80),[r,W]=E(r,i.emissionTTLMin??.4,i.emissionTTLMax??1),v.shape.protrusions=_,v.shape.protrusionLength=N,v.shape.emissionInterval=T,v.shape.emissionSpeed=R,v.shape.emissionTTL=W,v.shape.protrusionStyle="spike"}if(s==="amoeba"){let _,N,T,R,W,G;[r,_]=Ce(r,i.lobeCountMin??8,i.lobeCountMax??14),[r,N]=E(r,i.roughnessMin??.08,i.roughnessMax??.24),[r,T]=E(r,i.pulseSpeedMin??.8,i.pulseSpeedMax??1.8),[r,R]=E(r,i.senseRadiusMin??56,i.senseRadiusMax??124),[r,W]=E(r,i.chaseStrengthMin??18,i.chaseStrengthMax??56),[r,G]=E(r,i.bumpStrengthMin??40,i.bumpStrengthMax??88),v.shape.lobeCount=_,v.shape.roughness=N,v.shape.pulseSpeed=T,v.shape.senseRadius=R,v.shape.chaseStrength=W,v.shape.bumpStrength=G}t[s].push(v)}}return t},la=(e,t,a)=>{const n=D(e)*Math.PI*2,s=t.motion.impulse*(.5+D(e)*.55),h=Math.cos(n),r=Math.sin(n),u=.34+D(e)*.32,i=r<0?r*.28:r;e.slideAx=h*s/Math.max(a.width,1),e.slideAy=(i+u)*s/Math.max(a.height,1)},at=(e,t,a,n)=>{e.phase=n,e.phaseTime=0;const h=(n==="slide"?t.motion.slideDuration:t.motion.pauseDuration)*(.72+D(e)*.62);e.phaseDuration=h,n==="slide"?la(e,t,a):(e.slideAx=0,e.slideAy=0)},ca=(e,t)=>{const a=D(e)*Math.PI*2,n=I(e,0,8);return{offsetX:Math.cos(a)*n,offsetY:Math.sin(a)*n,vx:I(e,-12,12),vy:I(e,-12,12),scale:t}},wt=(e,t,a,n)=>{let s=vt(e+((n==null?void 0:n.respawnCount)??0),sa[t.preset]+bt[t.palette]*5),h,r,u,i,m,f,d;[s,h]=ia(s),[s,r]=Ce(s,0,t.profiles[h].length-1),[s,u]=E(s,0,1),[s,i]=E(s,-.2,1.05),[s,m]=E(s,.08,1),[s,f]=E(s,-Math.PI,Math.PI),[s,d]=E(s,ut[h].min,ut[h].max);const l={id:e,classType:h,profileIndex:r,rngState:s,respawnCount:(n==null?void 0:n.respawnCount)??0,hueOffset:0,saturationOffset:0,lightnessOffset:0,nx:u,ny:i,vx:0,vy:0,z:m,phase:"slide",phaseTime:0,phaseDuration:0,slideAx:0,slideAy:0,rotation:f,rotationSpeed:d,trail:[]},c=He(t,l),p=h==="bacteria"?58:h==="viralEnvelope"?46:34;if(l.hueOffset=I(l,-p,p),l.saturationOffset=I(l,-16,14),l.lightnessOffset=I(l,-10,12),l.vx=I(l,-.004,.004),l.vy=tt(t,l,c)/Math.max(t.height,1)*I(l,.2,.48),h==="bacteria"){const b=me(Math.round(c.shape.maxSubCells??3),1,a.bacteriaSubCellCap),w=D(l)>.58?2:1,y=[];for(let S=0;S<w;S++){const A=.72+D(l)*.44;y.push(ca(l,A))}l.bacteria={subCells:y,fissionTimer:I(l,.1,1.4),fissionInterval:(c.shape.fissionInterval??2.8)*(.62+D(l)*.92),maxSubCells:b,localJitter:c.shape.localJitter??8,hasFlagella:D(l)>.62,flagellaCount:1+Math.floor(D(l)*3),flagellaLength:(c.shape.length??24)*I(l,.68,1.18),flagellaPhase:I(l,0,Math.PI*2),flagellaSpeed:I(l,1.2,2.6)}}h==="viralEnvelope"&&(l.viralEnvelope={emitTimer:I(l,0,c.shape.emissionInterval??1),emitInterval:(c.shape.emissionInterval??1.1)*(.76+D(l)*.72),emissions:[],protrusionWobble:I(l,0,Math.PI*2)}),h==="amoeba"&&(l.amoeba={pulsePhase:I(l,0,Math.PI*2),senseRadius:c.shape.senseRadius??84,chaseStrength:c.shape.chaseStrength??34,bumpStrength:c.shape.bumpStrength??62}),h==="bacteriophage"&&(l.bacteriophage={flutterPhase:I(l,0,Math.PI*2),tailJitter:I(l,.35,1.1)});const g=D(l)>.92?"slide":"pause";at(l,c,t,g),l.phaseTime=I(l,0,l.phaseDuration*.5);const x=Math.max(2,Math.round((c.shape.trailLength??6)*.4));for(let b=0;b<x;b++)l.trail.push({nx:l.nx,ny:l.ny});return l},ua=(e,t)=>{e.respawnCount+=1,e.nx=D(e),e.ny=-.1-D(e)*.26,e.vx=I(e,-.003,.003),e.vy=0,e.rotation=I(e,-Math.PI,Math.PI);const a=He(t,e);at(e,a,t,D(e)>.9?"slide":"pause"),e.phaseTime=I(e,0,e.phaseDuration*.5),e.viralEnvelope&&(e.viralEnvelope.emissions.length=0,e.viralEnvelope.emitTimer=I(e,0,e.viralEnvelope.emitInterval)),e.trail.length=0,e.trail.push({nx:e.nx,ny:e.ny})},da=(e,t,a,n)=>{if(!e.bacteria)return;const s=e.bacteria,h=(t.shape.length??24)*.78,r=1.14;for(let l=0;l<s.subCells.length;l++){const c=s.subCells[l];c.vx+=(D(e)-.5)*s.localJitter*n*r,c.vy+=(D(e)-.5)*s.localJitter*n*r,c.vx*=.88,c.vy*=.88,c.offsetX+=c.vx*n,c.offsetY+=c.vy*n;const p=Math.hypot(c.offsetX,c.offsetY);p>h&&(c.offsetX=c.offsetX/p*h,c.offsetY=c.offsetY/p*h,c.vx*=.5,c.vy*=.5)}if(s.hasFlagella){const l=a.reducedMotion?s.flagellaSpeed*.45:s.flagellaSpeed;s.flagellaPhase+=n*l}if(a.reducedMotion||(s.fissionTimer+=n,s.fissionTimer<s.fissionInterval||s.subCells.length>=s.maxSubCells))return;const u=Math.floor(D(e)*s.subCells.length),i=s.subCells[u]??s.subCells[0],m=D(e)*Math.PI*2,f=I(e,4,10),d={offsetX:i.offsetX+Math.cos(m)*f,offsetY:i.offsetY+Math.sin(m)*f,vx:Math.cos(m)*I(e,8,26),vy:Math.sin(m)*I(e,8,26),scale:me(i.scale*I(e,.78,1.18),.55,1.3)};s.subCells.push(d),s.fissionTimer=0,s.fissionInterval=(t.shape.fissionInterval??2.6)*(.62+D(e)*.88)},ha=(e,t,a,n)=>{if(!e.viralEnvelope)return;const s=e.viralEnvelope;if(s.protrusionWobble+=n*.7,!a.reducedMotion&&(s.emitTimer+=n,s.emitTimer>=s.emitInterval)){const u=D(e)>.74?2:1;for(let i=0;i<u;i++){const m=D(e)*Math.PI*2,f=(t.shape.emissionSpeed??44)*(.62+D(e)*.88),d=(t.shape.emissionTTL??.8)*(.62+D(e)*.88),l=(t.shape.size??10)*.58+(t.shape.protrusionLength??2.2),c=e.nx+Math.cos(m)*l/Math.max(a.width,1),p=e.ny+Math.sin(m)*l/Math.max(a.height,1);s.emissions.push({nx:c,ny:p,vx:Math.cos(m)*f/Math.max(a.width,1),vy:Math.sin(m)*f/Math.max(a.height,1),ttl:d,life:d,size:(t.shape.size??10)*I(e,.12,.28),hue:t.shape.hue+e.hueOffset+I(e,-14,14),saturation:me(t.shape.saturation+e.saturationOffset+I(e,-8,12),20,98),lightness:me(t.shape.lightness+e.lightnessOffset+I(e,2,18),30,90),alpha:me(t.shape.alpha+I(e,-.06,.12),.12,.8)})}for(;s.emissions.length>a.emissionCapPerVirus;)s.emissions.shift();s.emitTimer=0,s.emitInterval=(t.shape.emissionInterval??1.1)*(.74+D(e)*.95)}const r=tt(a,e,t)*.35/Math.max(a.height,1);for(let u=s.emissions.length-1;u>=0;u--){const i=s.emissions[u];i.vx*=.986,i.vy*=.986,i.vy+=r*n,i.nx+=i.vx*n,i.ny+=r*n,i.ny+=i.vy*n,i.ttl-=n,(i.ttl<=0||i.ny>1.22||i.nx<-.16||i.nx>1.16)&&s.emissions.splice(u,1)}},ma=(e,t)=>{e.bacteriophage&&(e.bacteriophage.flutterPhase+=t*(1.4+e.bacteriophage.tailJitter),e.rotation+=Math.sin(e.bacteriophage.flutterPhase)*.02)},fa=(e,t,a)=>{e.amoeba&&(e.amoeba.pulsePhase+=a*(t.shape.pulseSpeed??1.1))},pa=e=>{const t=new Map;for(let a=0;a<e.particles.length;a++){const n=e.particles[a],s=n.nx*e.width,h=n.ny*e.height,r=Math.floor(s/Be),u=Math.floor(h/Be),i=`${r}:${u}`,m=t.get(i);m?m.push(a):t.set(i,[a])}return t},xa=(e,t)=>{const a=pa(e);for(let n=0;n<e.particles.length;n++){const s=e.particles[n];if(s.classType!=="amoeba"||!s.amoeba)continue;const h=He(e,s),r=s.amoeba,u=s.nx*e.width,i=s.ny*e.height,m=Math.floor(u/Be),f=Math.floor(i/Be),d=(r.senseRadius??h.shape.senseRadius??84)*(.68+s.z*.52),l=Math.max(12,d*.26);let c=-1,p=Number.POSITIVE_INFINITY,g=0;for(let x=-1;x<=1;x++){for(let b=-1;b<=1;b++){const w=`${m+x}:${f+b}`,y=a.get(w);if(y){for(let S=0;S<y.length;S++){const A=y[S];if(A===n)continue;g+=1;const P=e.particles[A],v=P.nx*e.width,_=P.ny*e.height,N=v-u,T=_-i,R=N*N+T*T;if(R<d*d&&R<p&&(p=R,c=A),R<l*l&&R>1e-4){const W=Math.sqrt(R),G=N/W,te=T/W,Y=r.bumpStrength/Math.max(e.width,1)*t,X=r.bumpStrength/Math.max(e.height,1)*t;s.vx-=G*Y,s.vy-=te*X,P.vx+=G*Y*.18,P.vy+=te*X*.18}if(g>=e.maxAmoebaChecks)break}if(g>=e.maxAmoebaChecks)break}}if(g>=e.maxAmoebaChecks)break}if(c>=0&&p>1e-4){const x=e.particles[c],b=x.nx*e.width,w=x.ny*e.height,y=b-u,S=w-i,A=Math.sqrt(p),P=y/A,v=S/A,_=r.chaseStrength/Math.max(e.width,1)*t,N=r.chaseStrength/Math.max(e.height,1)*t;s.vx+=P*_,s.vy+=v*N}}},ga=(e,t,a)=>{const n=He(e,t);if(t.phaseTime+=a,t.phaseTime>=t.phaseDuration&&at(t,n,e,t.phase==="slide"?"pause":"slide"),t.phase==="slide"){t.vx+=t.slideAx*a,t.vy+=t.slideAy*a;const r=(D(t)-.5)*n.motion.driftJitter/Math.max(e.width,1),u=(D(t)-.5)*n.motion.driftJitter/Math.max(e.height,1);t.vx+=r*a,t.vy+=u*a}const s=Math.pow(n.motion.damping,a*60);t.vx*=s,t.vy*=s,t.phase==="pause"&&(t.vx*=.88,t.vy*=.88);const h=tt(e,t,n)/Math.max(e.height,1);t.ny+=h*a,t.vy+=h*a*.08,t.nx+=t.vx*a,t.ny+=t.vy*a,t.rotation+=t.rotationSpeed*a*oa[t.classType],t.nx<-.08&&(t.nx+=1.16),t.nx>1.08&&(t.nx-=1.16),t.ny>1.16&&ua(t,e),t.classType==="bacteria"&&da(t,n,e,a),t.classType==="viralEnvelope"&&ha(t,n,e,a),t.classType==="bacteriophage"&&ma(t,a),t.classType==="amoeba"&&fa(t,n,a)},va=e=>{const t=et[e.preset],a=ra(e.palette),n={width:e.width,height:e.height,dpr:e.dpr,time:0,preset:e.preset,palette:e.palette,reducedMotion:e.reducedMotion,flowStrength:e.flowStrength,maxAmoebaChecks:t.maxAmoebaChecks,emissionCapPerVirus:t.emissionCapPerVirus,particles:[],profiles:a},s=yt(e.width,e.height,e.preset);for(let h=0;h<s;h++)n.particles.push(wt(h,n,t));return n},ba=(e,t,a,n)=>{e.width=t,e.height=a,e.dpr=n;const s=et[e.preset];e.maxAmoebaChecks=s.maxAmoebaChecks,e.emissionCapPerVirus=s.emissionCapPerVirus;const h=yt(t,a,e.preset);if(e.particles.length<h){const r=e.particles.length;for(let u=r;u<h;u++)e.particles.push(wt(u,e,s))}else e.particles.length>h&&(e.particles.length=h)},ya=(e,t)=>{const a=me(t,.001,.05);e.time+=a;for(let n=0;n<e.particles.length;n++)ga(e,e.particles[n],a);xa(e,a)},wa=(e,t,a)=>Math.min(a,Math.max(t,e)),Ma=e=>e==="mobile"?"low":e==="ultra"?"high":"balanced",Sa=({quality:e,className:t,preset:a,palette:n,flowStrength:s})=>{const h=M.useRef(null),r=M.useMemo(()=>a??Ma(e),[a,e]),u=n??"biotic",i=wa(s??1,.35,2.6);return M.useEffect(()=>{const m=h.current;if(!m)return;const f=m.getContext("2d");if(!f)return;let d=0,l=0,c=1,p=0,g=performance.now(),x=va({width:1,height:1,dpr:1,preset:r,palette:u,reducedMotion:!1,flowStrength:i});const b=window.matchMedia("(prefers-reduced-motion: reduce)");x.reducedMotion=b.matches;const w=()=>{const P=m.getBoundingClientRect();d=Math.max(1,P.width),l=Math.max(1,P.height),c=Math.min(window.devicePixelRatio||1,2),m.width=Math.max(1,Math.floor(d*c)),m.height=Math.max(1,Math.floor(l*c)),f.setTransform(c,0,0,c,0,0),ba(x,d,l,c)},y=P=>{x.reducedMotion=P.matches},S=P=>{const v=Math.min(.05,Math.max(.001,(P-g)/1e3));g=P,x.flowStrength=i,ya(x,v),Jt(f,x),p=window.requestAnimationFrame(S)};let A=null;return typeof window.ResizeObserver<"u"?(A=new window.ResizeObserver(w),A.observe(m)):window.addEventListener("resize",w),b.addEventListener("change",y),w(),p=window.requestAnimationFrame(S),()=>{b.removeEventListener("change",y),A?A.disconnect():window.removeEventListener("resize",w),window.cancelAnimationFrame(p)}},[i,u,r]),o.jsx("canvas",{ref:h,className:t??"pointer-events-none absolute inset-0 h-full w-full","aria-hidden":!0})},dt=24,Le=[{id:"bioelectricAmber",deep:"#0a1020",primary:"#3cd8ff",secondary:"#7dffd1",accent:"#ffb25e",highlight:"#fff2d1",dust:"#9bddff"},{id:"cytochromeAurora",deep:"#08181b",primary:"#35e3c8",secondary:"#68a9ff",accent:"#ff76b2",highlight:"#ffefd3",dust:"#b8d8ff"},{id:"aetherCopper",deep:"#08131e",primary:"#4fc3ff",secondary:"#89ffe1",accent:"#f1a15f",highlight:"#ffe7bf",dust:"#8ecaff"},{id:"ionNocturne",deep:"#0b0f1f",primary:"#7b6bff",secondary:"#5ed8ff",accent:"#f26d9d",highlight:"#c8efff",dust:"#8aa9ff"},{id:"tealMagma",deep:"#07161a",primary:"#29d4bc",secondary:"#66f0ff",accent:"#ff9f6e",highlight:"#f7ffe9",dust:"#8fe4d2"}],nt=(e,t)=>{const a=Number.isFinite(t)?t:0,n=Math.abs(a)%997/997*dt,h=Math.max(0,e+n)/dt,r=Math.floor(h)%Le.length,u=(r+1)%Le.length;return{current:Le[r],next:Le[u],mix:h-Math.floor(h)}},ht={mobile:.55,balanced:1,ultra:1.35},Pa=e=>{if(e)return e;if(typeof window>"u")return"balanced";const t=window.matchMedia("(max-width: 820px)").matches,a=window.matchMedia("(pointer: coarse)").matches;return t||a?"mobile":"balanced"},Ca=e=>ht[e]??ht.balanced,Ee=(e,t)=>Math.max(1,Math.floor(e*Ca(t))),Aa=()=>{if(typeof window>"u")return!1;try{const e=document.createElement("canvas");return e.getContext("webgl2")?!0:!!(e.getContext("webgl")||e.getContext("experimental-webgl"))}catch{return!1}},Ie=`
float pkHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float pkGaussian(float r2, float sharpness) {
  return exp(-r2 * sharpness);
}

float pkRadialShimmer(float r, float theta, float time, float phase) {
  float ring = sin(r * 9.0 - time * 1.1 + phase * 6.28318);
  float swirl = cos(theta * 4.0 + time * 0.76 + phase * 12.0);
  return 0.78 + 0.22 * ring * swirl;
}

float pkGrain(vec2 fragCoord, float phase) {
  float n = pkHash(fragCoord * 0.52 + phase * 17.0);
  return (n - 0.5) * 0.08;
}

float pkPointAlpha(vec2 uv, float depth, float time, float phase, float baseStrength, float depthBoost) {
  float r2 = dot(uv, uv);
  if (r2 > 1.0) {
    return -1.0;
  }

  float r = sqrt(max(r2, 0.00001));
  float theta = atan(uv.y, uv.x);
  float core = pkGaussian(r2, 4.8);
  float halo = pkGaussian(r2, 1.45) * (1.0 - smoothstep(0.62, 1.0, r));
  float shimmer = pkRadialShimmer(r, theta, time, phase);
  float depthTerm = baseStrength + (1.0 - depth) * depthBoost;
  float grain = pkGrain(gl_FragCoord.xy, phase);
  float alpha = (core * 0.78 + halo * 0.46) * shimmer * depthTerm + grain;

  return clamp(alpha, 0.0, 0.95);
}

vec3 pkLiftColor(vec3 color, float floorLuma) {
  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  float needLift = clamp((floorLuma - luma) / max(floorLuma, 0.0001), 0.0, 1.0);
  vec3 lifted = mix(color, color + vec3(0.16, 0.14, 0.1), needLift);
  return clamp(lifted, 0.0, 1.0);
}
`,mt=(e,t)=>{if(e==="off")return 0;const a=e==="subtle"?.36:.72;return t?a*.55:a},st=(e,t)=>{const a=M.useRef({x:0,y:0,targetX:0,targetY:0,clickPulse:0,active:!1,strength:mt(e,t)});return M.useEffect(()=>{a.current.strength=mt(e,t)},[e,t]),M.useEffect(()=>{const n=i=>{if(typeof window>"u")return;const m=i.clientX/Math.max(1,window.innerWidth)*2-1,f=1-i.clientY/Math.max(1,window.innerHeight)*2;a.current.targetX=Math.max(-1,Math.min(1,m)),a.current.targetY=Math.max(-1,Math.min(1,f)),a.current.active=!0},s=()=>{a.current.active=!1},h=()=>{t||e==="off"||(a.current.clickPulse=Math.min(1,a.current.clickPulse+.85))};let r=0;const u=()=>{const i=a.current,m=i.active?i.targetX:0,f=i.active?i.targetY:0,d=i.active?.12:.06;i.x+=(m-i.x)*d,i.y+=(f-i.y)*d,i.clickPulse*=t?.88:.92,i.clickPulse<.001&&(i.clickPulse=0),r=window.requestAnimationFrame(u)};return window.addEventListener("pointermove",n,{passive:!0}),window.addEventListener("pointerdown",h,{passive:!0}),window.addEventListener("pointerleave",s),window.addEventListener("blur",s),r=window.requestAnimationFrame(u),()=>{window.removeEventListener("pointermove",n),window.removeEventListener("pointerdown",h),window.removeEventListener("pointerleave",s),window.removeEventListener("blur",s),window.cancelAnimationFrame(r)}},[e,t]),a},Ge=14,Ye=48,_a=1600,Ta=e=>{let t=Math.floor(e)>>>0||1;return()=>(t=t*1664525+1013904223>>>0,t/4294967296)},ja=({quality:e,interactionMode:t,styleSeed:a,reducedMotion:n,className:s})=>{const h=M.useRef(null),r=st(t,n);return M.useEffect(()=>{const u=h.current;if(!u)return;const i=new Ke,m=new Qe(-1,1,1,-1,.01,12);m.position.set(0,0,2.4);const f=new Ze({alpha:!0,antialias:!0,powerPreference:"high-performance"});f.setClearColor(0,0),f.domElement.style.width="100%",f.domElement.style.height="100%",f.domElement.style.display="block",f.domElement.setAttribute("aria-hidden","true"),u.appendChild(f.domElement);const d=Ta(a*313+79),l=[];for(let k=0;k<Ge;k++){const U=new Float32Array(Ye*3),F=new be;F.setAttribute("position",new z(U,3));const H=new _t({color:new C("#7cd8ff"),transparent:!0,opacity:n?.24:.34,blending:we,depthWrite:!1,depthTest:!1}),L=new Tt(F,H);i.add(L),l.push({geometry:F,material:H,line:L,positions:U,phase:d()*Math.PI*2,speed:.18+d()*.24,ampX:.05+d()*.11,ampY:.03+d()*.07,laneX:-1.4+k/Math.max(1,Ge-1)*2.8,scroll:d()*2.8,depth:.06+k/Math.max(1,Ge-1)*.84,colorBias:d()})}const c=Ee(_a,e),p=new Float32Array(c*3),g=new Float32Array(c),x=new Float32Array(c),b=new Float32Array(c),w=new Float32Array(c);for(let k=0;k<c;k++){const U=k*3;p[U]=d()*3.2-1.6,p[U+1]=d()*2.8-1.4,p[U+2]=d()*.95,g[k]=1.8+d()*3.8,x[k]=.14+d()*.36,b[k]=d()*Math.PI*2,w[k]=d()}const y=new be;y.setAttribute("position",new z(p,3)),y.setAttribute("aSize",new z(g,1)),y.setAttribute("aSpeed",new z(x,1)),y.setAttribute("aPhase",new z(b,1)),y.setAttribute("aMix",new z(w,1));const S={uTime:{value:0},uPixelRatio:{value:1},uPointer:{value:new Ae(0,0)},uPointerStrength:{value:0},uDustA:{value:new C("#8ecaff")},uDustB:{value:new C("#f7ffe9")}},A=new _e({uniforms:S,transparent:!0,depthWrite:!1,depthTest:!1,blending:we,vertexShader:`
        attribute float aSize;
        attribute float aSpeed;
        attribute float aPhase;
        attribute float aMix;
        uniform float uTime;
        uniform float uPixelRatio;
        uniform vec2 uPointer;
        uniform float uPointerStrength;
        varying float vMix;
        varying float vDepth;

        void main() {
          float y = mod(position.y - uTime * aSpeed + 1.4, 2.8) - 1.4;
          float x = position.x + sin(uTime * 0.7 + aPhase + y * 2.6) * 0.025;
          vec2 pos = vec2(x, y);

          vec2 delta = pos - uPointer;
          float dist = length(delta);
          float influence = exp(-dist * 4.2) * uPointerStrength;
          vec2 dir = normalize(delta + vec2(0.0001));
          pos += dir * influence * 0.08;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.x, pos.y, position.z, 1.0);
          gl_PointSize = aSize * uPixelRatio * (1.12 - position.z * 0.45);

          vMix = aMix;
          vDepth = position.z;
        }
      `,fragmentShader:`
        uniform vec3 uDustA;
        uniform vec3 uDustB;
        uniform float uTime;
        varying float vMix;
        varying float vDepth;
        ${Ie}

        void main() {
          vec2 uv = gl_PointCoord * 2.0 - 1.0;
          float alpha = pkPointAlpha(uv, vDepth, uTime, vMix, 0.24, 0.35);
          if (alpha <= 0.0001) discard;
          vec3 color = mix(uDustA, uDustB, vMix);
          color = pkLiftColor(color, 0.25);
          float depthAlpha = 0.2 + (1.0 - vDepth) * 0.4;

          gl_FragColor = vec4(color, min(alpha * depthAlpha, 0.78));
        }
      `}),P=new Te(y,A);i.add(P);const v=new C,_=new C,N=new C,T=new C,R=new C,W=new C,G=new C,te=new C,Y=new C,X=()=>{const k=u.getBoundingClientRect(),U=Math.max(1,k.width),F=Math.max(1,k.height),H=Math.min(window.devicePixelRatio||1,2);f.setPixelRatio(H),f.setSize(U,F,!1),S.uPixelRatio.value=H;const L=U/F;m.left=-L,m.right=L,m.top=1,m.bottom=-1,m.updateProjectionMatrix()};let B=null;typeof window.ResizeObserver<"u"?(B=new ResizeObserver(X),B.observe(u)):window.addEventListener("resize",X);let O=0;const q=performance.now(),J=n?.55:1,ae=k=>{const U=(k-q)/1e3,F=U*J,H=nt(U,a+211);v.set(H.current.primary),_.set(H.next.primary),G.copy(v).lerp(_,H.mix),N.set(H.current.secondary),T.set(H.next.secondary),te.copy(N).lerp(T,H.mix),R.set(H.current.accent),W.set(H.next.accent),Y.copy(R).lerp(W,H.mix),S.uTime.value=F;const L=r.current,K=L.x*m.right,Me=L.y;S.uPointer.value.set(K,Me),S.uPointerStrength.value=L.strength,S.uDustA.value.copy(te),S.uDustB.value.copy(Y);for(let fe=0;fe<l.length;fe++){const V=l[fe];for(let ue=0;ue<Ye;ue++){const se=ue/Math.max(1,Ye-1),Re=1.4-(V.scroll+F*V.speed+se*2.2)%2.8;let de=V.laneX+Math.sin(se*6.2+V.phase+F*.44)*V.ampX+Math.sin(se*12.5+V.phase*.6+F*.28)*V.ampX*.45,he=Re+Math.cos(se*5.4+V.phase*1.2+F*.37)*V.ampY;const pe=de-K,xe=he-Me,ie=Math.sqrt(pe*pe+xe*xe),re=Math.exp(-ie*4.2)*L.strength;if(re>1e-4){const oe=1/Math.max(ie,1e-4);de+=pe*oe*re*.14,he+=xe*oe*re*.08}if(!n&&L.clickPulse>.001){const oe=Math.exp(-ie*7.2)*L.clickPulse;de+=Math.sin(F*8+se*14+V.phase)*oe*.03,he+=Math.cos(F*7+se*13+V.phase)*oe*.02}const Se=ue*3;V.positions[Se]=de,V.positions[Se+1]=he,V.positions[Se+2]=V.depth}V.geometry.attributes.position.needsUpdate=!0,V.material.color.copy(G).lerp(te,.25+V.colorBias*.45),V.material.color.lerp(Y,.1+.14*(.5+.5*Math.sin(F*.4+V.phase))),V.material.opacity=n?.2:.28+.18*(.5+.5*Math.sin(F*.62+V.phase))}f.render(i,m),O=window.requestAnimationFrame(ae)};return X(),O=window.requestAnimationFrame(ae),()=>{window.cancelAnimationFrame(O),B?B.disconnect():window.removeEventListener("resize",X);for(let k=0;k<l.length;k++)i.remove(l[k].line),l[k].geometry.dispose(),l[k].material.dispose();i.remove(P),y.dispose(),A.dispose(),f.dispose(),f.domElement.parentElement===u&&u.removeChild(f.domElement)}},[t,r,e,n,a]),o.jsx("div",{ref:h,className:s??"pointer-events-none absolute inset-0 h-full w-full","aria-hidden":!0})},Na=4200,Ea=80,Ia=180,Ra=.34,ka=e=>{let t=Math.floor(e)>>>0||1;return()=>(t=t*1664525+1013904223>>>0,t/4294967296)},La=({quality:e,interactionMode:t,styleSeed:a,reducedMotion:n,className:s})=>{const h=M.useRef(null),r=st(t,n);return M.useEffect(()=>{const u=h.current;if(!u)return;const i=new Ke,m=new Qe(-1,1,1,-1,.01,14);m.position.set(0,0,3);const f=new Ze({alpha:!0,antialias:!0,powerPreference:"high-performance"});f.setClearColor(0,0),f.domElement.style.width="100%",f.domElement.style.height="100%",f.domElement.style.display="block",f.domElement.setAttribute("aria-hidden","true"),u.appendChild(f.domElement);const d=ka(a*571+31),l=Ee(Na,e),c=Ee(Ea,e),p=Ee(Ia,e),g=new Float32Array(l*3),x=new Float32Array(l),b=new Float32Array(l),w=new Float32Array(l),y=new Float32Array(l),S=new Float32Array(l),A=new Float32Array(l);for(let j=0;j<l;j++){const Q=j*3;g[Q]=d()*3.6-1.8,g[Q+1]=d()*3-1.5,g[Q+2]=d()*.98,x[j]=2.6+d()*8.2,b[j]=d(),w[j]=d()*Math.PI*2,y[j]=.12+d()*.42,S[j]=.2+d()*.8,A[j]=.2+d()*.9}const P=new be;P.setAttribute("position",new z(g,3)),P.setAttribute("aSize",new z(x,1)),P.setAttribute("aSeed",new z(b,1)),P.setAttribute("aPhase",new z(w,1)),P.setAttribute("aDrift",new z(y,1)),P.setAttribute("aLateral",new z(S,1)),P.setAttribute("aCycle",new z(A,1));const v={uTime:{value:0},uPixelRatio:{value:1},uPointer:{value:new Ae(0,0)},uPointerStrength:{value:0},uClickPulse:{value:0},uColorA:{value:new C("#3cd8ff")},uColorB:{value:new C("#7dffd1")},uAccent:{value:new C("#ffb25e")},uHighlight:{value:new C("#fff2d1")}},_=new _e({uniforms:v,transparent:!0,depthWrite:!1,depthTest:!1,blending:De,vertexShader:`
        attribute float aSize;
        attribute float aSeed;
        attribute float aPhase;
        attribute float aDrift;
        attribute float aLateral;
        attribute float aCycle;
        uniform float uTime;
        uniform float uPixelRatio;
        uniform vec2 uPointer;
        uniform float uPointerStrength;
        uniform float uClickPulse;
        varying float vDepth;
        varying float vSeed;
        varying float vPhase;

        void main() {
          vec3 p = position;
          float cycle = fract(uTime * (0.08 + aCycle * 0.16) + aPhase * 0.3);
          float active = smoothstep(0.04, 0.2, cycle) * (1.0 - smoothstep(0.68, 0.9, cycle));

          float y = mod(p.y - uTime * (aDrift + p.z * 0.08) + 1.5, 3.0) - 1.5;
          float xSlide = sin(uTime * (0.42 + aSeed * 0.4) + aPhase + y * 2.4) * (0.02 + aLateral * 0.06) * active;
          float ySlide = cos(uTime * (0.32 + aSeed * 0.3) + aPhase * 1.2) * (0.015 + aLateral * 0.04) * active;

          vec2 pos = vec2(p.x + xSlide, y + ySlide);
          vec2 curl = vec2(
            sin((pos.y * 3.1) + (uTime * 0.32) + aSeed * 5.0),
            cos((pos.x * 2.7) - (uTime * 0.28) + aSeed * 4.0)
          ) * (0.006 + p.z * 0.012);
          pos += curl;

          vec2 delta = pos - uPointer;
          float dist = length(delta);
          float influence = exp(-dist * 3.2) * uPointerStrength;
          vec2 dir = normalize(delta + vec2(0.0001));
          pos += dir * influence * 0.14;

          float clickInfluence = exp(-dist * 6.8) * uClickPulse;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.x, pos.y, p.z, 1.0);
          gl_PointSize = aSize * uPixelRatio * (1.18 - p.z * 0.5) * (1.0 + clickInfluence * 0.18);
          vDepth = p.z;
          vSeed = aSeed;
          vPhase = aPhase;
        }
      `,fragmentShader:`
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uAccent;
        uniform vec3 uHighlight;
        uniform float uTime;
        varying float vDepth;
        varying float vSeed;
        varying float vPhase;
        ${Ie}

        void main() {
          vec2 uv = gl_PointCoord * 2.0 - 1.0;
          float phase = vSeed + vPhase * 0.27;
          float alpha = pkPointAlpha(uv, vDepth, uTime, phase, 0.46, 0.62);
          if (alpha <= 0.0001) discard;

          vec3 base = mix(uColorA, uColorB, clamp(vDepth * 1.08, 0.0, 1.0));
          float accentMix = 0.14 + 0.14 * sin(uTime * 0.52 + vSeed * 10.0);
          float hiMix = 0.06 + 0.07 * cos(uTime * 0.34 + vPhase * 1.5);
          base = mix(base, uAccent, accentMix);
          base = mix(base, uHighlight, hiMix);
          base = pkLiftColor(base, 0.34);

          gl_FragColor = vec4(base, min(alpha, 0.9));
        }
      `}),N=new Te(P,_);i.add(N);const T=new Float32Array(c*3),R=new Float32Array(c),W=new Float32Array(c),G=new Float32Array(c),te=new Float32Array(c);for(let j=0;j<c;j++){const Q=j*3;T[Q]=d()*3.8-1.9,T[Q+1]=d()*3.2-1.6,T[Q+2]=d()*.96,R[j]=24+d()*62,W[j]=d(),G[j]=.06+d()*.2,te[j]=d()*Math.PI*2}const Y=new be;Y.setAttribute("position",new z(T,3)),Y.setAttribute("aSize",new z(R,1)),Y.setAttribute("aSeed",new z(W,1)),Y.setAttribute("aDrift",new z(G,1)),Y.setAttribute("aPhase",new z(te,1));const X={uTime:{value:0},uPixelRatio:{value:1},uPointer:{value:new Ae(0,0)},uPointerStrength:{value:0},uColorA:{value:new C("#9ddfff")},uColorB:{value:new C("#f5fbff")}},B=new _e({uniforms:X,transparent:!0,depthWrite:!1,depthTest:!1,blending:De,vertexShader:`
        attribute float aSize;
        attribute float aSeed;
        attribute float aDrift;
        attribute float aPhase;
        uniform float uTime;
        uniform float uPixelRatio;
        uniform vec2 uPointer;
        uniform float uPointerStrength;
        varying float vDepth;
        varying float vSeed;

        void main() {
          vec3 p = position;
          float y = mod(p.y - uTime * (aDrift + p.z * 0.04) + 1.6, 3.2) - 1.6;
          float x = p.x + sin(uTime * (0.15 + aSeed * 0.2) + aPhase + y * 1.8) * (0.04 + p.z * 0.08);
          vec2 pos = vec2(x, y);

          vec2 delta = pos - uPointer;
          float dist = length(delta);
          float influence = exp(-dist * 3.2) * uPointerStrength;
          vec2 dir = normalize(delta + vec2(0.0001));
          pos += dir * influence * 0.045;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.x, pos.y, p.z, 1.0);
          gl_PointSize = aSize * uPixelRatio * (1.4 - p.z * 0.5);
          vDepth = p.z;
          vSeed = aSeed;
        }
      `,fragmentShader:`
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        varying float vDepth;
        varying float vSeed;
        ${Ie}

        void main() {
          vec2 uv = gl_PointCoord * 2.0 - 1.0;
          float r2 = dot(uv, uv);
          if (r2 > 1.0) discard;
          float r = sqrt(r2);

          float softCore = exp(-r2 * 2.1);
          float shell = exp(-r2 * 0.55) * (1.0 - smoothstep(0.1, 0.9, r));
          float fade = 0.05 + (1.0 - vDepth) * 0.1;
          float grain = pkGrain(gl_FragCoord.xy, vSeed) * 0.2;
          float alpha = clamp((softCore * 0.28 + shell * 0.16) * fade + grain, 0.0, 0.12);

          vec3 color = mix(uColorA, uColorB, vSeed * 0.8 + vDepth * 0.2);
          color = pkLiftColor(color, 0.42);
          gl_FragColor = vec4(color, alpha);
        }
      `}),O=new Te(Y,B);i.add(O);const q=new Float32Array(p*3),J=new Float32Array(p),ae=new Float32Array(p),k=new Float32Array(p),U=new Float32Array(p),F=new Float32Array(p),H=new Float32Array(p);for(let j=0;j<p;j++){const Q=j*3;q[Q]=d()*3.6-1.8,q[Q+1]=d()*3.2-1.6,q[Q+2]=d()*.95,J[j]=10+d()*22,ae[j]=d(),k[j]=Math.floor(d()*3),U[j]=d()*Math.PI*2,F[j]=d()*Math.PI*2,H[j]=.08+d()*.28}const L=new be;L.setAttribute("position",new z(q,3)),L.setAttribute("aSize",new z(J,1)),L.setAttribute("aSeed",new z(ae,1)),L.setAttribute("aKind",new z(k,1)),L.setAttribute("aAngle",new z(U,1)),L.setAttribute("aPhase",new z(F,1)),L.setAttribute("aDrift",new z(H,1));const K={uTime:{value:0},uPixelRatio:{value:1},uPointer:{value:new Ae(0,0)},uPointerStrength:{value:0},uClickPulse:{value:0},uColorA:{value:new C("#8de1ff")},uColorB:{value:new C("#ffb973")},uAccent:{value:new C("#ffd7a1")}},Me=new _e({uniforms:K,transparent:!0,depthWrite:!1,depthTest:!1,blending:De,vertexShader:`
        attribute float aSize;
        attribute float aSeed;
        attribute float aKind;
        attribute float aAngle;
        attribute float aPhase;
        attribute float aDrift;
        uniform float uTime;
        uniform float uPixelRatio;
        uniform vec2 uPointer;
        uniform float uPointerStrength;
        uniform float uClickPulse;
        varying float vDepth;
        varying float vSeed;
        varying float vKind;
        varying float vAngle;
        varying float vPhase;

        void main() {
          vec3 p = position;
          float y = mod(p.y - uTime * (aDrift + p.z * 0.05) + 1.6, 3.2) - 1.6;
          float x = p.x + sin(uTime * (0.22 + aSeed * 0.2) + aPhase + y * 2.1) * 0.03;
          vec2 pos = vec2(x, y);

          vec2 delta = pos - uPointer;
          float dist = length(delta);
          float influence = exp(-dist * 3.4) * uPointerStrength;
          vec2 dir = normalize(delta + vec2(0.0001));
          pos += dir * influence * 0.08;

          float clickInfluence = exp(-dist * 7.5) * uClickPulse;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.x, pos.y, p.z, 1.0);
          gl_PointSize = aSize * uPixelRatio * (1.1 - p.z * 0.3) * (1.0 + clickInfluence * 0.12);
          vDepth = p.z;
          vSeed = aSeed;
          vKind = aKind;
          vAngle = aAngle + sin(uTime * 0.2 + aSeed * 6.0) * 0.2;
          vPhase = aPhase;
        }
      `,fragmentShader:`
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uAccent;
        varying float vDepth;
        varying float vSeed;
        varying float vKind;
        varying float vAngle;
        varying float vPhase;
        ${Ie}

        float sdfCapsule(vec2 p, vec2 a, vec2 b, float r) {
          vec2 pa = p - a;
          vec2 ba = b - a;
          float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
          return length(pa - ba * h) - r;
        }

        void main() {
          vec2 uv = gl_PointCoord * 2.0 - 1.0;
          float s = sin(vAngle);
          float c = cos(vAngle);
          vec2 p = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);

          float shapeAlpha = 0.0;
          if (vKind < 0.5) {
            float d = sdfCapsule(p, vec2(-0.58, 0.0), vec2(0.58, 0.0), 0.28);
            shapeAlpha = smoothstep(0.09, -0.03, d);
          } else if (vKind < 1.5) {
            float theta = atan(p.y, p.x);
            float radius = length(p);
            float boundary = 0.52 + sin(theta * 8.0 + vPhase * 4.0) * 0.06;
            float shell = smoothstep(boundary + 0.05, boundary - 0.02, radius);
            float inner = smoothstep(0.22, 0.17, radius);
            shapeAlpha = max(shell - inner * 0.65, 0.0);
          } else {
            float theta = atan(p.y, p.x);
            float radius = length(p);
            float boundary =
              0.56 +
              sin(theta * 3.0 + vPhase * 2.4) * 0.08 +
              sin(theta * 7.0 - vPhase * 1.6) * 0.05;
            shapeAlpha = smoothstep(boundary + 0.05, boundary - 0.02, radius);
          }

          if (shapeAlpha <= 0.0001) discard;
          float kernel = pkPointAlpha(uv, vDepth, uTime, vSeed + vPhase * 0.2, 0.6, 0.2);
          float alpha = shapeAlpha * (0.2 + (1.0 - vDepth) * 0.24) * (0.82 + kernel * 0.38);

          vec3 color = mix(uColorA, uColorB, fract(vSeed * 1.7 + vKind * 0.23));
          color = mix(color, uAccent, 0.16 + 0.08 * sin(uTime * 0.4 + vSeed * 8.0));
          color = pkLiftColor(color, 0.33);

          gl_FragColor = vec4(color, min(alpha, 0.62));
        }
      `}),fe=new Te(L,Me);i.add(fe);const V=new C,ue=new C,se=new C,Re=new C,de=new C,he=new C,pe=new C,xe=new C,ie=()=>{const j=u.getBoundingClientRect(),Q=Math.max(1,j.width),ke=Math.max(1,j.height),le=Math.min(window.devicePixelRatio||1,2);f.setPixelRatio(le),f.setSize(Q,ke,!1),v.uPixelRatio.value=le,X.uPixelRatio.value=le,K.uPixelRatio.value=le;const Z=Q/ke;m.left=-Z,m.right=Z,m.top=1,m.bottom=-1,m.updateProjectionMatrix()};let re=null;typeof window.ResizeObserver<"u"?(re=new ResizeObserver(ie),re.observe(u)):window.addEventListener("resize",ie);const Se=n?.55:1;let oe=0,ot=performance.now(),it=ot;const rt=j=>{const Q=Math.min(.05,Math.max(.001,(j-it)/1e3));it=j;const ke=(j-ot)/1e3,le=Q*Se*Ra;v.uTime.value+=le,X.uTime.value+=le,K.uTime.value+=le;const Z=nt(ke,a+911);V.set(Z.current.primary),ue.set(Z.next.primary),v.uColorA.value.copy(V).lerp(ue,Z.mix),se.set(Z.current.secondary),Re.set(Z.next.secondary),v.uColorB.value.copy(se).lerp(Re,Z.mix),de.set(Z.current.accent),he.set(Z.next.accent),v.uAccent.value.copy(de).lerp(he,Z.mix),pe.set(Z.current.highlight),xe.set(Z.next.highlight),v.uHighlight.value.copy(pe).lerp(xe,Z.mix),X.uColorA.value.copy(v.uColorA.value).lerp(v.uHighlight.value,.56),X.uColorB.value.copy(v.uColorB.value).lerp(v.uHighlight.value,.74),K.uColorA.value.copy(v.uColorB.value).lerp(v.uHighlight.value,.2),K.uColorB.value.copy(v.uAccent.value).lerp(v.uHighlight.value,.22),K.uAccent.value.copy(v.uHighlight.value);const ge=r.current,Xe=ge.x*m.right,Ue=ge.y;v.uPointer.value.set(Xe,Ue),X.uPointer.value.set(Xe,Ue),K.uPointer.value.set(Xe,Ue),v.uPointerStrength.value=ge.strength*1.06,X.uPointerStrength.value=ge.strength*.46,K.uPointerStrength.value=ge.strength*.78;const lt=n?0:ge.clickPulse;v.uClickPulse.value=lt,K.uClickPulse.value=lt,f.render(i,m),oe=window.requestAnimationFrame(rt)};return ie(),oe=window.requestAnimationFrame(rt),()=>{window.cancelAnimationFrame(oe),re?re.disconnect():window.removeEventListener("resize",ie),i.remove(N),i.remove(O),i.remove(fe),P.dispose(),_.dispose(),Y.dispose(),B.dispose(),L.dispose(),Me.dispose(),f.dispose(),f.domElement.parentElement===u&&u.removeChild(f.domElement)}},[t,r,e,n,a]),o.jsx("div",{ref:h,className:s??"pointer-events-none absolute inset-0 h-full w-full","aria-hidden":!0})},ze=6,za=4200,Da=.42,Ba=e=>{let t=Math.floor(e)>>>0||1;return()=>(t=t*1664525+1013904223>>>0,t/4294967296)},Oa=({quality:e,interactionMode:t,styleSeed:a,reducedMotion:n,className:s})=>{const h=M.useRef(null),r=st(t,n);return M.useEffect(()=>{const u=h.current;if(!u)return;const i=new Ke,m=new Qe(-1,1,1,-1,.01,12);m.position.set(0,0,2.2);const f=new Ze({alpha:!0,antialias:!0,powerPreference:"high-performance"});f.setClearColor(0,0),f.domElement.style.width="100%",f.domElement.style.height="100%",f.domElement.style.display="block",f.domElement.setAttribute("aria-hidden","true"),u.appendChild(f.domElement);const d={uTime:{value:0},uPixelRatio:{value:1},uPointer:{value:new Ae(0,0)},uPointerStrength:{value:0},uClickPulse:{value:0},uColorA:{value:new C("#5ed8ff")},uColorB:{value:new C("#7b6bff")},uAccent:{value:new C("#f26d9d")}},l=`
      attribute float aSize;
      attribute float aPhase;
      attribute float aSeed;
      uniform float uTime;
      uniform float uPixelRatio;
      uniform vec2 uPointer;
      uniform float uPointerStrength;
      uniform float uClickPulse;
      varying float vDepth;
      varying float vSeed;

      void main() {
        vec3 p = position;
        float drift = mod(p.y - uTime * (0.12 + aSeed * 0.2 + p.z * 0.08) + 1.35, 2.7) - 1.35;
        float waveA = sin((p.x * 3.1) + (uTime * (0.2 + aSeed * 0.15)) + aPhase);
        float waveB = cos((p.y * 2.7) - (uTime * (0.14 + aSeed * 0.11)) + aPhase * 1.3);
        vec2 pos = vec2(
          p.x + waveA * (0.03 + p.z * 0.014),
          drift + waveB * (0.035 + p.z * 0.015)
        );

        vec2 delta = pos - uPointer;
        float dist = length(delta);
        float influence = exp(-dist * 3.8) * uPointerStrength;
        vec2 dir = normalize(delta + vec2(0.0001));
        pos += dir * influence * 0.11;

        float clickInfluence = exp(-dist * 6.0) * uClickPulse;
        float depthScale = 1.25 - p.z * 0.55;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.x, pos.y, p.z, 1.0);
        gl_PointSize = aSize * uPixelRatio * depthScale * (1.0 + clickInfluence * 0.22);
        vDepth = clamp(p.z, 0.0, 1.0);
        vSeed = aSeed;
      }
    `,c=`
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform vec3 uAccent;
      uniform float uTime;
      varying float vDepth;
      varying float vSeed;
      ${Ie}

      void main() {
        vec2 uv = gl_PointCoord * 2.0 - 1.0;
        float alpha = pkPointAlpha(uv, vDepth, uTime, vSeed, 0.34, 0.44);
        if (alpha <= 0.0001) discard;

        vec3 base = mix(uColorA, uColorB, clamp(vDepth * 1.1, 0.0, 1.0));
        float accentBlend = 0.24 + 0.16 * sin(uTime * 0.6 + vSeed * 8.0);
        base = mix(base, uAccent, accentBlend);
        base = pkLiftColor(base, 0.24);

        gl_FragColor = vec4(base, min(alpha, 0.84));
      }
    `,p=new _e({uniforms:d,vertexShader:l,fragmentShader:c,transparent:!0,depthWrite:!1,depthTest:!1,blending:De}),g=[],x=Ee(za,e),b=Math.floor(x/ze),w=x%ze;for(let B=0;B<ze;B++){const O=b+(B<w?1:0),q=Ba(a*97+B*1337+17),J=new Float32Array(O*3),ae=new Float32Array(O),k=new Float32Array(O),U=new Float32Array(O);for(let L=0;L<O;L++){const K=L*3;J[K]=q()*2.6-1.3,J[K+1]=q()*2.7-1.35,J[K+2]=B/Math.max(1,ze-1),ae[L]=2.5+q()*7.5,k[L]=q()*Math.PI*2,U[L]=q()}const F=new be;F.setAttribute("position",new z(J,3)),F.setAttribute("aSize",new z(ae,1)),F.setAttribute("aPhase",new z(k,1)),F.setAttribute("aSeed",new z(U,1));const H=new Te(F,p);i.add(H),g.push({geometry:F,points:H})}const y=new C,S=new C,A=new C,P=new C,v=new C,_=new C,N=B=>{const O=nt(B,a);y.set(O.current.primary),S.set(O.next.primary),d.uColorA.value.copy(y).lerp(S,O.mix),v.set(O.current.secondary),_.set(O.next.secondary),d.uColorB.value.copy(v).lerp(_,O.mix),A.set(O.current.accent),P.set(O.next.accent),d.uAccent.value.copy(A).lerp(P,O.mix)},T=()=>{const B=u.getBoundingClientRect(),O=Math.max(1,B.width),q=Math.max(1,B.height),J=Math.min(window.devicePixelRatio||1,2);f.setPixelRatio(J),f.setSize(O,q,!1),d.uPixelRatio.value=J;const ae=O/q;m.left=-ae,m.right=ae,m.top=1,m.bottom=-1,m.updateProjectionMatrix()};let R=null;typeof window.ResizeObserver<"u"?(R=new ResizeObserver(T),R.observe(u)):window.addEventListener("resize",T);const W=(n?.55:1)*Da;let G=0,te=performance.now(),Y=te;const X=B=>{const O=Math.min(.05,Math.max(.001,(B-Y)/1e3));Y=B;const q=(B-te)/1e3;d.uTime.value+=O*W,N(q);const J=r.current;d.uPointer.value.set(J.x*m.right,J.y),d.uPointerStrength.value=J.strength,d.uClickPulse.value=n?0:J.clickPulse,f.render(i,m),G=window.requestAnimationFrame(X)};return T(),G=window.requestAnimationFrame(X),()=>{window.cancelAnimationFrame(G),R?R.disconnect():window.removeEventListener("resize",T);for(let B=0;B<g.length;B++)i.remove(g[B].points),g[B].geometry.dispose();p.dispose(),f.dispose(),f.domElement.parentElement===u&&u.removeChild(f.domElement)}},[t,r,e,n,a]),o.jsx("div",{ref:h,className:s??"pointer-events-none absolute inset-0 h-full w-full","aria-hidden":!0})},ft={bioticParticles:{id:"bioticParticles",label:"Biotic Particles",requiresWebGL:!1,component:Sa},volumetricCausticDrift:{id:"volumetricCausticDrift",label:"Volumetric Caustic Drift",requiresWebGL:!0,component:Oa},chromaticRibbonLattice:{id:"chromaticRibbonLattice",label:"Chromatic Ribbon Lattice",requiresWebGL:!0,component:ja},volumetricBiofield:{id:"volumetricBiofield",label:"Volumetric Biofield",requiresWebGL:!0,component:La}},Mt="bioticParticles",Fa=({effectId:e,quality:t,interactionMode:a="medium",styleSeed:n=17,className:s,preset:h,palette:r,flowStrength:u})=>{const[i,m]=M.useState(!1);M.useEffect(()=>{const x=window.matchMedia("(prefers-reduced-motion: reduce)");m(x.matches);const b=w=>{m(w.matches)};return x.addEventListener("change",b),()=>{x.removeEventListener("change",b)}},[]);const f=M.useMemo(()=>Aa(),[]),d=M.useMemo(()=>Pa(t),[t]),c=ft[e??Mt],g=(c.requiresWebGL&&!f?ft.bioticParticles:c).component;return o.jsx(g,{quality:d,interactionMode:a,styleSeed:n,reducedMotion:i,className:s??"pointer-events-none absolute inset-0 h-full w-full",preset:h,palette:r,flowStrength:u})},Va=({effectId:e,quality:t,interactionMode:a="medium",styleSeed:n=17,className:s,preset:h,palette:r,flowStrength:u})=>{const i=e??(h!==void 0||r!==void 0||u!==void 0?"bioticParticles":void 0);return o.jsx(Fa,{effectId:i,quality:t,interactionMode:a,styleSeed:n,className:s,preset:h,palette:r,flowStrength:u})},St="landing_onboarding_seen",Wa=15552e3,$a=e=>{if(typeof document>"u")return null;const t=`${encodeURIComponent(e)}=`,a=document.cookie.split(";");for(let n=0;n<a.length;n++){const s=a[n].trim();if(s.startsWith(t))return decodeURIComponent(s.slice(t.length))}return null},Ha=()=>$a(St)==="1",Xa=()=>{typeof document>"u"||(document.cookie=`${encodeURIComponent(St)}=1; Path=/; SameSite=Lax; Max-Age=${Wa}`)},Ua=3e4,Ga=8e3,Ya=6e3,qa=18e3,Ja=96,Ka=72,pt=()=>({visibleUntil:0,cooldownUntil:0}),Qa=e=>({firstVisit:!1,firstVisitLockUntil:0,scrollCompleted:!1,navCompleted:!1,lastActivityAt:e,scrollTop:0}),Za=({scrollContainerRef:e,navInteractionTick:t})=>{const[a,n]=M.useState(!1),[s,h]=M.useState(!1),[r,u]=M.useState({scroll:!1,nav:!1}),i=M.useRef(Qa(Date.now())),m=M.useRef({scroll:pt(),nav:pt()}),f=M.useRef(t??0);return M.useEffect(()=>{if(typeof window>"u")return;const d=Date.now(),l=!Ha();l&&Xa(),i.current.firstVisit=l,i.current.firstVisitLockUntil=l?d+Ua:0,i.current.lastActivityAt=d,i.current.scrollCompleted=!1,i.current.navCompleted=!1,n(l),h(l),u({scroll:l,nav:l})},[]),M.useEffect(()=>{if(typeof window>"u")return;const d=t??0;d!==f.current&&(f.current=d,i.current.navCompleted=!0,i.current.lastActivityAt=Date.now())},[t]),M.useEffect(()=>{const d=e.current;if(!d)return;const l=()=>{const c=d.scrollTop;i.current.scrollTop=c,i.current.lastActivityAt=Date.now(),c>=Ka&&(i.current.scrollCompleted=!0)};return l(),d.addEventListener("scroll",l,{passive:!0}),()=>d.removeEventListener("scroll",l)},[e]),M.useEffect(()=>{if(typeof window>"u")return;const d=(c,p)=>{const g=i.current,x=m.current[c];if((c==="scroll"?g.scrollCompleted:g.navCompleted)||g.scrollTop>Ja)return!1;if(x.visibleUntil>p)return!0;x.visibleUntil!==0&&x.visibleUntil<=p&&(x.visibleUntil=0,x.cooldownUntil=p+qa);const w=Math.max(g.lastActivityAt+Ga,x.cooldownUntil);return p>=w?(x.visibleUntil=p+Ya,!0):!1},l=window.setInterval(()=>{const c=Date.now(),p=i.current,g=p.firstVisit&&c<p.firstVisitLockUntil;if(h(b=>b===g?b:g),p.firstVisit){const b={scroll:!p.scrollCompleted,nav:!p.navCompleted};u(w=>w.scroll===b.scroll&&w.nav===b.nav?w:b);return}const x={scroll:d("scroll",c),nav:d("nav",c)};u(b=>b.scroll===x.scroll&&b.nav===x.nav?b:x)},180);return()=>window.clearInterval(l)},[]),{firstVisit:a,firstVisitLockActive:s,scroll:r.scroll,nav:r.nav}},xt=e=>e?"translate-y-0 opacity-100":"translate-y-2 opacity-0",gt=({direction:e})=>o.jsxs("svg",{viewBox:"0 0 28 28",className:`onboarding-arrow-asset ${e==="down"?"rotate-180":""}`,fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[o.jsx("path",{d:"M14 22V8.2",className:"onboarding-arrow-core"}),o.jsx("path",{d:"M9 9.6L14 4.4L19 9.6",className:"onboarding-arrow-core"})]}),en=({scrollContainerRef:e,navInteractionTick:t,isTouch:a})=>{const n=Za({scrollContainerRef:e,navInteractionTick:t});return!n.scroll&&!n.nav?null:o.jsx("div",{className:"pointer-events-none absolute inset-0 z-[60]","aria-hidden":!0,children:o.jsxs("div",{className:"sticky top-0 h-[100dvh] w-full",children:[o.jsx("div",{className:`absolute left-1/2 top-8 -translate-x-1/2 transform-gpu transition-all duration-500 ${xt(n.nav)}`,children:o.jsxs("div",{className:"onboarding-guide-stack",children:[o.jsx(gt,{direction:"up"}),o.jsx("p",{className:"onboarding-liquid-chip onboarding-copy text-xs font-medium tracking-[0.02em] sm:text-[13px]",children:a?"Tap or drag up":"Hover for more"})]})}),o.jsx("div",{className:`absolute bottom-8 left-1/2 -translate-x-1/2 transform-gpu transition-all duration-500 ${xt(n.scroll)}`,children:o.jsxs("div",{className:"onboarding-guide-stack",children:[o.jsx("p",{className:"onboarding-liquid-chip onboarding-copy text-xs font-medium tracking-[0.02em] sm:text-[13px]",children:"Scroll"}),o.jsx(gt,{direction:"down"})]})})]})})},ve=e=>Math.min(1,Math.max(0,e)),tn=e=>e*e*(3-2*e),Oe=()=>{const e=Math.random()*2-1,t=Math.random()*Math.PI*2,a=Math.sqrt(1-e*e);return new je(a*Math.cos(t),e,a*Math.sin(t))},an=e=>{const t=Math.abs(e.y)>.8?new je(1,0,0):new je(0,1,0);return new je().crossVectors(e,t).normalize()},nn=`
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vEnergy;
  uniform float uTime;
  uniform float uBeat;
  uniform float uIntro;
  uniform float uInteraction;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float n000 = hash(i + vec3(0.0, 0.0, 0.0));
    float n100 = hash(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash(i + vec3(1.0, 1.0, 1.0));

    float nx00 = mix(n000, n100, f.x);
    float nx10 = mix(n010, n110, f.x);
    float nx01 = mix(n001, n101, f.x);
    float nx11 = mix(n011, n111, f.x);
    float nxy0 = mix(nx00, nx10, f.y);
    float nxy1 = mix(nx01, nx11, f.y);
    return mix(nxy0, nxy1, f.z);
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amp = 0.56;
    float freq = 1.0;
    for (int i = 0; i < 4; i++) {
      value += noise(p * freq) * amp;
      amp *= 0.5;
      freq *= 2.0;
    }
    return value;
  }

  void main() {
    vec3 p = position;
    float n = fbm(normal * 2.7 + p * 0.8 + vec3(uTime * 0.26, uTime * 0.21, uTime * 0.19));
    float angular = atan(p.z, p.x);
    float spikes = pow(max(0.0, sin(angular * 12.0 + uTime * 2.5 + n * 7.0)), 4.0);
    float ripples = abs(sin((p.y + uTime * 0.28) * 14.0)) * 0.06;
    float interactionBoost = 1.0 + uInteraction * 1.6;
    float displacement = (0.05 + uBeat * 0.07) * n + spikes * (0.08 + uBeat * 0.08) * interactionBoost + ripples;
    displacement *= mix(0.16, 1.0, uIntro);

    vec3 displaced = p + normal * displacement;
    vec4 worldPos = modelMatrix * vec4(displaced, 1.0);

    vWorldPos = worldPos.xyz;
    vNormal = normalize(normalMatrix * normal);
    vEnergy = n + spikes;

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`,sn=`
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vEnergy;
  uniform float uTime;
  uniform float uBeat;
  uniform float uIntro;
  uniform float uInteraction;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform vec3 uDeepColor;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPos);

    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.8);
    float turbulence = 0.5 + 0.5 * sin((vWorldPos.x + vWorldPos.z) * 3.8 + uTime * 2.0 + vEnergy * 10.0);
    float scan = 0.5 + 0.5 * sin((vWorldPos.y * 18.0) + uTime * 3.2 + vEnergy * 12.0);
    float heat = smoothstep(0.28, 1.28, vEnergy);

    vec3 base = mix(uDeepColor, uColorA, heat);
    base = mix(base, uColorB, turbulence * 0.52);
    base = mix(base, uColorC, scan * 0.36);

    vec3 rim = fresnel * (uColorC * 1.8 + uColorB * 0.5);
    vec3 pulse = uColorB * (0.12 + uBeat * 0.34 + uInteraction * 0.28);
    vec3 color = base + rim + pulse + uColorC * (uInteraction * 0.18);

    float alpha = (0.78 + fresnel * 0.2) * uIntro;
    gl_FragColor = vec4(color, alpha);
  }
`,on=({introProgress:e,palette:t})=>{const a=M.useRef(null),n=M.useRef(null),s=M.useMemo(()=>{const r=new Float32Array(4200),u=new Float32Array(1400*3),i=new Float32Array(1400);for(let m=0;m<1400;m++){const f=Oe(),d=Oe(),l=3.8+Math.random()*4.6,c=.9+Math.pow(Math.random(),1.25)*1.2;r[m*3]=f.x*l,r[m*3+1]=f.y*l,r[m*3+2]=f.z*l,u[m*3]=d.x*c,u[m*3+1]=d.y*c,u[m*3+2]=d.z*c,i[m]=Math.random()*Math.PI*2}return{starts:r,targets:u,seeds:i,initial:r.slice(),count:1400}},[]);return Fe(({clock:h})=>{const r=a.current;if(!r)return;const u=tn(ve(e)),i=r.geometry.getAttribute("position"),m=i.array,f=h.elapsedTime;for(let d=0;d<s.count;d++){const l=d*3,c=s.seeds[d],p=s.starts[l],g=s.starts[l+1],x=s.starts[l+2],b=s.targets[l],w=s.targets[l+1],y=s.targets[l+2],S=(1-u)*(.38+.18*Math.sin(f*1.8+c));m[l]=ye.lerp(p,b,u)+Math.cos(f*2.1+c)*S,m[l+1]=ye.lerp(g,w,u)+Math.sin(f*1.7+c*1.3)*S,m[l+2]=ye.lerp(x,y,u)+Math.cos(f*2.3+c*.7)*S}i.needsUpdate=!0,n.current&&(n.current.opacity=Math.max(0,.95-u*.92),n.current.size=.03+(1-u)*.02,n.current.color.set(u<.55?t.accentHex:t.glowHex))}),o.jsxs("points",{ref:a,frustumCulled:!1,renderOrder:4,children:[o.jsx("bufferGeometry",{children:o.jsx("bufferAttribute",{attach:"attributes-position",array:s.initial,itemSize:3,count:s.count})}),o.jsx("pointsMaterial",{ref:n,color:t.accentHex,size:.04,transparent:!0,opacity:.95,sizeAttenuation:!0,blending:we,depthWrite:!1})]})},rn=({introProgress:e,hovering:t,palette:a})=>{const n=M.useRef(null),s=M.useRef(null),h=M.useMemo(()=>{const u=new Float32Array(3300),i=new Float32Array(1100),m=new Float32Array(1100),f=new Float32Array(1100*3);for(let d=0;d<1100;d++){const l=Oe(),c=1.08+Math.pow(Math.random(),1.5)*.68;u[d*3]=l.x,u[d*3+1]=l.y,u[d*3+2]=l.z,i[d]=c,m[d]=Math.random()*Math.PI*2,f[d*3]=l.x*c,f[d*3+1]=l.y*c,f[d*3+2]=l.z*c}return{directions:u,bases:i,seeds:m,initial:f,count:1100}},[]);return Fe(({clock:r})=>{const u=n.current;if(!u)return;const i=u.geometry.getAttribute("position"),m=i.array,f=r.elapsedTime;for(let d=0;d<h.count;d++){const l=d*3,c=h.seeds[d],p=h.directions[l],g=h.directions[l+1],x=h.directions[l+2],b=.06*Math.sin(f*2.3+c)+.04*Math.sin(f*4.9+c*.6),w=(1-e)*.36,y=h.bases[d]+b+w;m[l]=p*y,m[l+1]=g*y,m[l+2]=x*y}i.needsUpdate=!0,s.current&&(s.current.opacity=(t?.68:.56)*(.5+e*.5),s.current.size=t?.028:.024)}),o.jsxs("points",{ref:n,frustumCulled:!1,renderOrder:3,children:[o.jsx("bufferGeometry",{children:o.jsx("bufferAttribute",{attach:"attributes-position",array:h.initial,itemSize:3,count:h.count})}),o.jsx("pointsMaterial",{ref:s,color:a.glowHex,size:.024,transparent:!0,opacity:.6,sizeAttenuation:!0,blending:we,depthWrite:!1})]})},ln=({introProgress:e,hovering:t,palette:a})=>{const n=M.useRef(null),s=M.useRef(null),h=M.useMemo(()=>{const i=[],m=new Float32Array(1872);for(let f=0;f<24;f++){const d=Oe(),l=an(d),c=new je().crossVectors(d,l).normalize();i.push({anchor:d,tangent:l,bitangent:c,span:.8+Math.random()*.8,height:.18+Math.random()*.72,phase:Math.random()*Math.PI*2,speed:.16+Math.random()*.42})}return{streams:i,streamCount:24,trailLength:26,initial:m,count:24*26}},[]);return Fe(({clock:r})=>{const u=n.current;if(!u)return;const i=u.geometry.getAttribute("position"),m=i.array,f=r.elapsedTime;let d=0;for(let l=0;l<h.streamCount;l++){const c=h.streams[l],p=(f*c.speed+c.phase/(Math.PI*2))%1;for(let g=0;g<h.trailLength;g++){let x=p-g/h.trailLength*.18;x<0&&(x+=1);const b=(x-.5)*c.span,w=4*x*(1-x)*c.height,y=Math.sin(x*Math.PI*2+f*2.2+c.phase)*.07,S=c.anchor.x*(1.03+w)+c.tangent.x*b+c.bitangent.x*y,A=c.anchor.y*(1.03+w)+c.tangent.y*b+c.bitangent.y*y,P=c.anchor.z*(1.03+w)+c.tangent.z*b+c.bitangent.z*y;m[d]=S,m[d+1]=A,m[d+2]=P,d+=3}}i.needsUpdate=!0,s.current&&(s.current.opacity=(t?.9:.72)*Math.max(.2,e),s.current.size=t?.038:.032,s.current.color.set(t?a.accentHex:a.baseHex))}),o.jsxs("points",{ref:n,frustumCulled:!1,renderOrder:5,children:[o.jsx("bufferGeometry",{children:o.jsx("bufferAttribute",{attach:"attributes-position",array:h.initial,itemSize:3,count:h.count})}),o.jsx("pointsMaterial",{ref:s,color:a.baseHex,size:.032,transparent:!0,opacity:.74,sizeAttenuation:!0,blending:we,depthWrite:!1})]})},cn=({pointer:e,hovering:t,pressed:a,introProgress:n,palette:s})=>{const h=M.useRef(null),r=M.useRef(null),u=M.useRef(null),i=M.useRef(null),m=M.useMemo(()=>({uTime:{value:0},uBeat:{value:0},uIntro:{value:0},uInteraction:{value:0},uColorA:{value:s.baseColor.clone()},uColorB:{value:s.glowColor.clone()},uColorC:{value:s.accentColor.clone()},uDeepColor:{value:s.deepColor.clone()}}),[s]);return Fe((f,d)=>{const l=f.clock.elapsedTime;if(h.current&&(h.current.rotation.y=ye.lerp(h.current.rotation.y,e.x*.55,.07),h.current.rotation.x=ye.lerp(h.current.rotation.x,-e.y*.42,.07),h.current.rotation.z+=d*.03),i.current){const c=.5+.5*Math.sin(l*2.6),p=(t?.55:0)+(a?.9:0),g=ye.lerp(i.current.uniforms.uInteraction.value,p,.1);i.current.uniforms.uTime.value=l,i.current.uniforms.uBeat.value=c,i.current.uniforms.uIntro.value=Math.max(.08,n),i.current.uniforms.uInteraction.value=g}if(r.current){const c=(t?.06:0)+(a?.1:0),p=Math.sin(l*1.5)*.025,g=.62+n*.42+c+p;r.current.scale.setScalar(g),r.current.rotation.y+=d*.1,r.current.rotation.x+=d*.04}if(u.current){const c=1+Math.sin(l*1.8)*.03;u.current.scale.setScalar(c);const p=u.current.material;p instanceof jt&&(p.opacity=(t?.22:.16)*Math.max(.2,n))}}),o.jsxs(o.Fragment,{children:[o.jsx("ambientLight",{intensity:.24}),o.jsx("pointLight",{position:[3.2,2.1,3.8],color:s.accentColor,intensity:2}),o.jsx("pointLight",{position:[-3.4,-2.3,-2.5],color:s.glowColor,intensity:1.6}),o.jsx("pointLight",{position:[0,3.2,-4],color:s.baseColor,intensity:1.35}),o.jsxs("group",{ref:h,children:[o.jsxs("mesh",{ref:r,children:[o.jsx("icosahedronGeometry",{args:[1.06,42]}),o.jsx("shaderMaterial",{ref:i,uniforms:m,vertexShader:nn,fragmentShader:sn,transparent:!0})]}),o.jsxs("mesh",{ref:u,scale:1.24,children:[o.jsx("sphereGeometry",{args:[1.1,40,40]}),o.jsx("meshBasicMaterial",{color:s.glowColor,transparent:!0,opacity:.16,blending:we,depthWrite:!1})]}),o.jsx(rn,{introProgress:n,hovering:t,palette:s}),o.jsx(ln,{introProgress:n,hovering:t,palette:s}),o.jsx(on,{introProgress:n,palette:s}),o.jsx(Ct,{count:150,size:2.4,speed:.5,scale:4.8,color:s.accentHex,opacity:.45,noise:1})]})]})},un=({activeSection:e,...t})=>{const a=M.useMemo(()=>{var i;const n=new C(((i=Je.find(m=>m.name===e))==null?void 0:i.color)??"#06b6d4"),s={h:0,s:0,l:0};n.getHSL(s);const h=new C().setHSL((s.h+.09)%1,ve(s.s*.95+.18),ve(s.l+.18)),r=new C().setHSL((s.h+.25)%1,ve(s.s+.28),ve(s.l+.14)),u=new C().setHSL((s.h+.58)%1,ve(s.s*.62+.2),.08);return{baseHex:`#${n.getHexString()}`,glowHex:`#${h.getHexString()}`,accentHex:`#${r.getHexString()}`,deepHex:`#${u.getHexString()}`,baseColor:n,glowColor:h,accentColor:r,deepColor:u}},[e]);return o.jsx(Nt,{children:o.jsx(Pt,{camera:{position:[0,0,5],fov:45},dpr:[1,2],gl:{antialias:!0,alpha:!0,powerPreference:"high-performance"},className:"h-full w-full",children:o.jsx(cn,{activeSection:e,palette:a,...t})})})},dn={waveOrb:{id:"waveOrb",label:"Wave Orb",component:un}},hn="waveOrb",mn=({kind:e})=>{const t=M.useRef(null),{scrollYProgress:a}=Et({target:t,offset:["start end","end start"],layoutEffect:!1}),n=ne(a,[0,.2,.5,.8,1],[0,.4,1,.4,0]),s=ne(a,[0,.2,.5,.8,1],[0,.25,.55,.25,0]),h=ne(a,[0,1],[34,-34]),r=ne(a,[0,1],[-16,16]),u=ne(a,[0,.5,1],[.4,1,.55]),i=ne(a,[0,1],[-220,-62]),m=ne(a,[0,1],[220,62]),f=ne(a,[0,1],[0,180]),d=ne(a,[0,1],[-120,120]),l=ne(a,[0,1],[58,-72]);return e==="cell-split"?o.jsxs("div",{ref:t,className:"relative h-56 overflow-visible",children:[o.jsx($.div,{className:"absolute inset-x-[12%] top-1/2 h-[2px] -translate-y-1/2 bg-gradient-to-r from-cyan-200/0 via-cyan-300/70 to-cyan-200/0",style:{opacity:n,scaleX:u}}),o.jsx($.div,{className:"absolute left-1/2 top-1/2 h-44 w-44 rounded-full border border-cyan-300/45 bg-cyan-300/12 blur-[1px]",style:{x:i,y:h,opacity:n,rotate:r}}),o.jsx($.div,{className:"absolute left-1/2 top-1/2 h-44 w-44 rounded-full border border-violet-300/45 bg-violet-300/12 blur-[1px]",style:{x:m,y:h,opacity:n,rotate:f}})]}):e==="ring-mesh"?o.jsxs("div",{ref:t,className:"relative h-56 overflow-visible",children:[o.jsx($.div,{className:"absolute left-1/2 top-1/2 h-36 w-[78vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-300/38",style:{opacity:n,rotate:r,scaleX:u}}),o.jsx($.div,{className:"absolute left-1/2 top-1/2 h-24 w-[58vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-300/28",style:{opacity:n,rotate:f}}),o.jsx($.div,{className:"absolute left-1/2 top-1/2 h-[2px] w-56 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-200/0 via-cyan-200/80 to-cyan-200/0",style:{opacity:n,x:d}})]}):e==="synapse-grid"?o.jsxs("div",{ref:t,className:"relative h-56 overflow-visible",children:[o.jsx($.div,{className:"absolute inset-0 story-transition-grid",style:{opacity:s,rotate:r}}),Array.from({length:8}).map((c,p)=>o.jsx($.div,{className:"absolute h-[2px] w-28 bg-gradient-to-r from-cyan-300/0 via-cyan-300/80 to-violet-300/10",style:{top:`${12+p*9}%`,left:`${8+p%4*22}%`,opacity:n,scaleX:u}},`path-${p}`))]}):o.jsx("div",{ref:t,className:"relative h-56 overflow-visible",children:Array.from({length:18}).map((c,p)=>o.jsx($.div,{className:"absolute bottom-[-26px] w-[2px] rounded-full bg-gradient-to-t from-cyan-300/0 via-cyan-300/75 to-cyan-100/0",style:{left:`${4+p*5.2}%`,height:`${42+p%4*21}px`,opacity:n,y:l}},`ascend-${p}`))})},fn=[{id:"cellular-dawn",eyebrow:"01 · Cellular Dawn",title:"I study life extension as a systems design problem.",summary:"Longevity is not one breakthrough. It is the choreography of repair, resilience, and adaptation across scales.",focusAreas:["Mitochondrial function","Cellular senescence","Epigenetic drift","Inflammaging","Regeneration dynamics"],accent:"#22d3ee",glow:"#818cf8",deep:"#0f172a"},{id:"repair-stack",eyebrow:"02 · The Repair Stack",title:"Biology can be approached as layered protocol design.",summary:"Interventions become stronger when staged together: diagnostics, metabolic tuning, regenerative inputs, and behavioral feedback loops.",focusAreas:["Sensing","Nutrient signaling","Autophagy","Neuroplasticity","Recovery loops","Behavioral control"],accent:"#38bdf8",glow:"#a78bfa",deep:"#111827"},{id:"neural-atlas",eyebrow:"03 · Neural Atlas",title:"Neuroscience is my map for cognition and identity.",summary:"I am interested in how memory, prediction, and attention can be understood as dynamic networks rather than isolated modules.",focusAreas:["Predictive processing","Memory encoding","Network plasticity","Cortical rhythms","Neuro-interface pathways"],accent:"#06b6d4",glow:"#f472b6",deep:"#020617"},{id:"human-machine",eyebrow:"04 · Human x Machine",title:"Transhumanism for me is practical augmentation, not aesthetics.",summary:"Tools should extend agency, cognition, and healthspan while preserving autonomy, dignity, and ethical guardrails.",focusAreas:["BCI pathways","Neural prosthetics","AI co-intelligence","Bio-sensing wearables","Ethical constraints","Distributed cognition"],accent:"#0ea5e9",glow:"#2dd4bf",deep:"#0b1120"},{id:"future-protocol",eyebrow:"05 · Future Protocol",title:"I am building a long-horizon research and design practice.",summary:"The mission is to translate frontier science into usable interfaces, narratives, and systems people can actually live with.",focusAreas:["Current explorations","Open collaborations","Research notes","Prototype builds","Public writing"],accent:"#22d3ee",glow:"#a855f7",deep:"#020617"}],pn=["cell-split","ring-mesh","synapse-grid","grid-ascend"],xn=({section:e})=>o.jsxs("section",{className:"relative isolate min-h-[100dvh] overflow-hidden px-4 py-24 xs:px-6 sm:px-10 lg:px-16",children:[o.jsx("div",{className:"absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(34,211,238,0.16),rgba(15,23,42,0)_42%),radial-gradient(circle_at_84%_14%,rgba(129,140,248,0.14),rgba(15,23,42,0)_44%),linear-gradient(160deg,rgba(248,250,252,0.72),rgba(236,254,255,0.64)_40%,rgba(238,242,255,0.74))]"}),o.jsxs("div",{className:"relative mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.08fr_1fr] lg:items-center",children:[o.jsxs($.div,{initial:{opacity:0,y:36},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.3},transition:{duration:.65},children:[o.jsx("p",{className:"text-xs uppercase tracking-[0.28em] text-slate-500",children:e.eyebrow}),o.jsx("h2",{className:"mt-4 max-w-2xl text-3xl font-semibold leading-tight text-slate-900 xs:text-4xl sm:text-5xl",children:e.title}),o.jsx("p",{className:"mt-6 max-w-xl text-lg leading-relaxed text-slate-600",children:e.summary}),o.jsx("div",{className:"mt-8 grid gap-3 sm:grid-cols-2",children:e.focusAreas.map(t=>o.jsx("div",{className:"rounded-2xl border border-slate-200/80 bg-white/75 px-4 py-3 text-sm text-slate-700 shadow-sm backdrop-blur-sm",children:t},t))})]}),o.jsxs($.div,{className:"relative h-[420px] rounded-[2rem] border border-cyan-200/60 bg-slate-950/72 p-5 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.85)] backdrop-blur-xl",initial:{opacity:0,scale:.92},whileInView:{opacity:1,scale:1},viewport:{once:!0,amount:.22},transition:{duration:.8},children:[o.jsxs("div",{className:"absolute inset-0 overflow-hidden rounded-[inherit]",children:[o.jsx("div",{className:"absolute left-[8%] top-[16%] h-40 w-40 rounded-full bg-cyan-300/20 blur-2xl story-blob-drift"}),o.jsx("div",{className:"absolute right-[12%] top-[30%] h-36 w-36 rounded-full bg-indigo-300/18 blur-2xl story-blob-drift-rev"}),o.jsx("div",{className:"absolute bottom-[12%] left-[34%] h-32 w-32 rounded-full bg-teal-200/18 blur-2xl story-blob-drift"}),o.jsx("div",{className:"absolute inset-[14%] rounded-[1.35rem] border border-cyan-100/30"}),o.jsx("div",{className:"absolute inset-[18%] rounded-[1.1rem] bg-[radial-gradient(circle_at_50%_30%,rgba(34,211,238,0.2),rgba(15,23,42,0.45)_65%)]"})]}),o.jsxs("div",{className:"relative z-10 flex h-full flex-col justify-between",children:[o.jsx("div",{className:"inline-flex w-fit items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-cyan-100/90",children:"Biofield Playback"}),o.jsx("div",{className:"rounded-2xl border border-cyan-100/20 bg-slate-900/45 p-4 text-cyan-50/90",children:o.jsx("p",{className:"text-sm leading-relaxed",children:"Abstract stage for cellular behavior clips, protocol overlays, and context notes."})})]})]})]})]}),gn=({section:e})=>{const t=e.focusAreas.slice(0,6);return o.jsxs("section",{className:"relative isolate min-h-[100dvh] overflow-hidden px-4 py-24 xs:px-6 sm:px-10 lg:px-16",children:[o.jsx("div",{className:"absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(56,189,248,0.18),rgba(15,23,42,0)_46%),radial-gradient(circle_at_30%_86%,rgba(167,139,250,0.14),rgba(15,23,42,0)_40%),linear-gradient(180deg,rgba(2,6,23,0.72),rgba(15,23,42,0.68)_65%,rgba(17,24,39,0.74))]"}),o.jsx("div",{className:"absolute inset-0 story-flow-lines opacity-35"}),o.jsxs("div",{className:"relative mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center",children:[o.jsxs($.div,{initial:{opacity:0,x:-28},whileInView:{opacity:1,x:0},viewport:{once:!0,amount:.3},transition:{duration:.7},children:[o.jsx("p",{className:"text-xs uppercase tracking-[0.28em] text-cyan-100/70",children:e.eyebrow}),o.jsx("h2",{className:"mt-4 text-3xl font-semibold leading-tight text-slate-100 xs:text-4xl sm:text-5xl",children:e.title}),o.jsx("p",{className:"mt-6 max-w-xl text-lg leading-relaxed text-slate-300",children:e.summary}),o.jsx("div",{className:"mt-8 space-y-3",children:t.map((a,n)=>o.jsxs("div",{className:"flex items-center gap-3 rounded-xl border border-slate-700/70 bg-slate-900/55 px-4 py-3 text-sm text-slate-200",children:[o.jsx("span",{className:"inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-300/20 text-xs text-cyan-100",children:n+1}),o.jsx("span",{children:a})]},a))})]}),o.jsxs($.div,{className:"relative mx-auto h-[480px] w-full max-w-[520px]",initial:{opacity:0,scale:.9},whileInView:{opacity:1,scale:1},viewport:{once:!0,amount:.2},transition:{duration:.85},children:[o.jsx("div",{className:"absolute inset-0 rounded-full border border-cyan-300/18 story-rotate-slow"}),o.jsx("div",{className:"absolute inset-[10%] rounded-full border border-violet-300/22 story-rotate-reverse"}),o.jsx("div",{className:"absolute inset-[18%] rounded-full border border-cyan-200/15"}),o.jsx("div",{className:"absolute inset-[32%] rounded-full border border-cyan-200/25 bg-slate-900/72 backdrop-blur-sm"}),o.jsx("div",{className:"absolute inset-[36%] flex items-center justify-center rounded-full border border-cyan-100/30 bg-cyan-300/8 text-center text-slate-100",children:o.jsxs("div",{children:[o.jsx("p",{className:"text-xs uppercase tracking-[0.2em] text-cyan-100/70",children:"Core Loop"}),o.jsx("p",{className:"mt-2 text-sm",children:"Sense → Model → Repair → Adapt"})]})}),t.map((a,n)=>{const s=n/t.length*Math.PI*2-Math.PI/2,h=44,r=50+Math.cos(s)*h,u=50+Math.sin(s)*h;return o.jsx($.div,{className:"absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border border-cyan-200/30 bg-slate-900/78 px-3 py-2 text-xs text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.15)]",style:{left:`${r}%`,top:`${u}%`},whileInView:{y:[0,-8,0]},viewport:{once:!1,amount:.1},transition:{duration:3.4+n*.35,repeat:1/0,ease:"easeInOut"},children:a},a)})]})]})]})},qe=[{id:"predictive",x:14,y:42,label:"Prediction"},{id:"attention",x:30,y:24,label:"Attention"},{id:"memory",x:48,y:50,label:"Memory"},{id:"encoding",x:64,y:28,label:"Encoding"},{id:"motor",x:74,y:62,label:"Motor"},{id:"interface",x:40,y:74,label:"Interface"},{id:"plasticity",x:24,y:66,label:"Plasticity"}],vn=[[0,1],[1,2],[2,3],[2,4],[0,6],[6,5],[5,2],[3,4]],bn=({section:e})=>o.jsxs("section",{className:"relative isolate min-h-[100dvh] overflow-hidden px-4 py-24 xs:px-6 sm:px-10 lg:px-16",children:[o.jsx("div",{className:"absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(20,184,166,0.14),rgba(2,6,23,0)_44%),radial-gradient(circle_at_88%_14%,rgba(236,72,153,0.12),rgba(2,6,23,0)_42%),linear-gradient(170deg,rgba(2,6,23,0.74),rgba(11,17,32,0.7)_60%,rgba(15,23,42,0.74))]"}),o.jsxs("div",{className:"relative mx-auto flex w-full max-w-7xl flex-col gap-10",children:[o.jsxs($.div,{initial:{opacity:0,y:24},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.3},transition:{duration:.62},className:"max-w-3xl",children:[o.jsx("p",{className:"text-xs uppercase tracking-[0.28em] text-cyan-100/70",children:e.eyebrow}),o.jsx("h2",{className:"mt-4 text-3xl font-semibold leading-tight text-slate-100 xs:text-4xl sm:text-5xl",children:e.title}),o.jsx("p",{className:"mt-6 text-lg leading-relaxed text-slate-300",children:e.summary})]}),o.jsxs($.div,{className:"relative h-[540px] overflow-hidden rounded-[2rem] border border-cyan-200/20 bg-slate-900/45 shadow-[0_25px_90px_-50px_rgba(6,182,212,0.55)]",initial:{opacity:0,scale:.95},whileInView:{opacity:1,scale:1},viewport:{once:!0,amount:.2},transition:{duration:.8},children:[o.jsx("div",{className:"absolute inset-0 story-neural-noise opacity-35"}),vn.map(([t,a],n)=>{const s=qe[t],h=qe[a],r=h.x-s.x,u=h.y-s.y,i=Math.sqrt(r*r+u*u),m=Math.atan2(u,r)*(180/Math.PI);return o.jsx("div",{className:"absolute h-[2px] origin-left bg-gradient-to-r from-cyan-300/10 via-cyan-300/60 to-violet-300/20",style:{left:`${s.x}%`,top:`${s.y}%`,width:`${i}%`,transform:`rotate(${m}deg)`}},`link-${n}`)}),qe.map((t,a)=>o.jsx($.div,{className:"absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border border-cyan-200/25 bg-slate-950/72 px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-cyan-100",style:{left:`${t.x}%`,top:`${t.y}%`},whileInView:{boxShadow:["0 0 0 rgba(34,211,238,0)","0 0 24px rgba(34,211,238,0.45)","0 0 0 rgba(34,211,238,0)"]},viewport:{once:!1,amount:.1},transition:{duration:2.2+a*.2,repeat:1/0,ease:"easeInOut"},children:t.label},t.id)),o.jsx("div",{className:"absolute right-6 top-6 max-w-xs rounded-2xl border border-slate-700/80 bg-slate-900/72 p-4 text-sm text-slate-200 backdrop-blur",children:"Signal paths represent how perception, memory, and interface design can be mapped as one adaptive network."}),o.jsx("div",{className:"absolute bottom-6 left-6 grid gap-2 sm:grid-cols-2",children:e.focusAreas.map(t=>o.jsx("div",{className:"rounded-xl border border-slate-700/70 bg-slate-900/65 px-3 py-2 text-xs text-slate-200",children:t},t))})]})]})]}),yn=({section:e})=>{const t=e.focusAreas.slice(0,6);return o.jsxs("section",{className:"relative isolate min-h-[100dvh] overflow-hidden px-4 py-24 xs:px-6 sm:px-10 lg:px-16",children:[o.jsx("div",{className:"absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(14,165,233,0.18),rgba(15,23,42,0)_44%),radial-gradient(circle_at_88%_88%,rgba(45,212,191,0.14),rgba(15,23,42,0)_42%),linear-gradient(150deg,rgba(15,23,42,0.72),rgba(17,24,39,0.7)_46%,rgba(11,17,32,0.74))]"}),o.jsxs("div",{className:"relative mx-auto w-full max-w-7xl",children:[o.jsxs($.div,{className:"max-w-3xl",initial:{opacity:0,y:28},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.25},transition:{duration:.65},children:[o.jsx("p",{className:"text-xs uppercase tracking-[0.28em] text-cyan-100/75",children:e.eyebrow}),o.jsx("h2",{className:"mt-4 text-3xl font-semibold leading-tight text-slate-100 xs:text-4xl sm:text-5xl",children:e.title}),o.jsx("p",{className:"mt-6 text-lg leading-relaxed text-slate-300",children:e.summary})]}),o.jsxs("div",{className:"mt-12 grid auto-rows-[170px] gap-4 sm:grid-cols-2 lg:grid-cols-4",children:[o.jsxs($.article,{className:"relative overflow-hidden rounded-2xl border border-sky-200/25 bg-slate-900/70 p-5 shadow-[0_20px_60px_-40px_rgba(14,165,233,0.7)] sm:col-span-2 sm:row-span-2",initial:{opacity:0,y:26},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.3},transition:{duration:.68},children:[o.jsx("div",{className:"absolute inset-0 story-circuit-grid opacity-45"}),o.jsx("h3",{className:"relative text-xl font-semibold text-cyan-100",children:"Augmentation Principle"}),o.jsx("p",{className:"relative mt-3 max-w-md text-sm leading-relaxed text-slate-300",children:"Build interfaces that increase agency and clarity. Hardware, AI, and biology should compose into understandable systems."})]}),t.map((a,n)=>o.jsxs($.article,{className:"relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/68 p-4",initial:{opacity:0,y:24},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.28},transition:{duration:.6,delay:n*.05},children:[o.jsx("div",{className:"absolute inset-0 story-circuit-grid opacity-30"}),o.jsx("h4",{className:"relative text-sm font-semibold uppercase tracking-[0.12em] text-slate-100",children:a}),o.jsx("p",{className:"relative mt-2 text-xs leading-relaxed text-slate-300",children:"Design notes and experiments mapped to human outcomes."})]},a))]})]})]})},wn=({section:e,onNavigate:t})=>o.jsxs("section",{className:"relative isolate min-h-[100dvh] overflow-hidden px-4 pb-28 pt-24 xs:px-6 sm:px-10 lg:px-16",children:[o.jsx("div",{className:"absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,0.15),rgba(2,6,23,0)_45%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.13),rgba(2,6,23,0)_45%),linear-gradient(180deg,rgba(2,6,23,0.76),rgba(15,23,42,0.68)_52%,rgba(248,250,252,0.8)_100%)]"}),o.jsxs("div",{className:"relative mx-auto flex w-full max-w-5xl flex-col items-center text-center",children:[o.jsxs($.div,{className:"max-w-3xl",initial:{opacity:0,y:24},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.3},transition:{duration:.65},children:[o.jsx("p",{className:"text-xs uppercase tracking-[0.28em] text-cyan-100/70",children:e.eyebrow}),o.jsx("h2",{className:"mt-4 text-3xl font-semibold leading-tight text-slate-100 xs:text-4xl sm:text-5xl",children:e.title}),o.jsx("p",{className:"mt-6 text-lg leading-relaxed text-slate-300",children:e.summary})]}),o.jsxs($.div,{className:"relative mt-12 w-full overflow-hidden rounded-[2rem] border border-cyan-200/30 bg-slate-950/70 p-8 shadow-[0_30px_90px_-50px_rgba(34,211,238,0.65)]",initial:{opacity:0,scale:.95},whileInView:{opacity:1,scale:1},viewport:{once:!0,amount:.2},transition:{duration:.72},children:[o.jsx("div",{className:"absolute inset-0 story-terminal-haze"}),o.jsx("div",{className:"relative z-10 grid gap-3 sm:grid-cols-2",children:e.focusAreas.map(a=>o.jsx("div",{className:"rounded-xl border border-cyan-200/20 bg-slate-900/66 px-4 py-3 text-left text-sm text-cyan-50/95",children:a},a))}),o.jsx("div",{className:"relative z-10 mt-7 flex flex-wrap items-center justify-center gap-3",children:Je.map(a=>o.jsxs("button",{type:"button",className:"rounded-full border px-4 py-2 text-sm font-medium transition hover:scale-[1.02]",style:{borderColor:`${a.color}88`,color:a.color,backgroundColor:"rgba(15, 23, 42, 0.55)"},onClick:()=>t(a.path,{color:a.color}),children:["Open ",a.name]},a.path))}),o.jsx("div",{className:"pointer-events-none absolute inset-0",children:Array.from({length:8}).map((a,n)=>o.jsx("span",{className:"absolute story-token-orbit rounded-full border border-cyan-200/35 bg-cyan-300/8",style:{width:`${18+n%3*8}px`,height:`${18+n%3*8}px`,left:`${8+n*11}%`,top:`${18+n%2*50}%`,animationDelay:`${n*.35}s`}},`token-${n}`))})]})]})]}),Mn=({section:e,onNavigate:t})=>e.id==="cellular-dawn"?o.jsx(xn,{section:e}):e.id==="repair-stack"?o.jsx(gn,{section:e}):e.id==="neural-atlas"?o.jsx(bn,{section:e}):e.id==="human-machine"?o.jsx(yn,{section:e}):o.jsx(wn,{section:e,onNavigate:t}),Sn=({onNavigate:e})=>o.jsx("section",{className:"relative z-10",children:fn.map((t,a)=>o.jsxs("div",{className:`relative ${a===0?"":"-mt-24"}`,children:[a>0?o.jsx("div",{className:"pointer-events-none absolute inset-x-0 top-[-7rem] z-30",children:o.jsx(mn,{kind:pn[a-1]})}):null,o.jsx(Mn,{section:t,onNavigate:e})]},t.id))}),En=({onNavigate:e,navInteractionTick:t})=>{const a=dn[hn].component,n=At();return o.jsx(It,{backgroundClassName:"bg-[radial-gradient(circle_at_20%_0%,rgba(186,230,253,0.55),rgba(224,231,255,0.42)_34%,rgba(248,250,252,1)_78%)]",footerBackgroundColor:"#ffffff",children:s=>o.jsxs("div",{className:"relative isolate",children:[o.jsx("div",{className:"pointer-events-none absolute inset-0 z-0","aria-hidden":!0,children:o.jsx("div",{className:"sticky top-0 h-[100dvh]",children:o.jsx(Va,{effectId:Mt,quality:"balanced",interactionMode:"medium",styleSeed:37})})}),o.jsx(en,{scrollContainerRef:s,navInteractionTick:t,isTouch:n}),o.jsxs("div",{className:"relative z-10",children:[o.jsx("section",{className:"relative flex min-h-[100dvh] items-center justify-center",children:o.jsx("div",{className:"relative z-10 px-4 sm:px-6",children:o.jsx(Ft,{activeSection:null,centerpiece:a})})}),o.jsx(Sn,{onNavigate:e})]})]})})};export{En as default};
