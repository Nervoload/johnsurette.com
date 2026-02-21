import{r as H,j as ge}from"./vendor-react-f1ef5386.js";import{v as Ve,O as Je,x as je,K as ve,$ as D,a8 as pt,C as P,Z as nt,a9 as mt,e as Pe,c as Ce,aa as Ae,a2 as De}from"./vendor-three-core-247151ed.js";const Te=Math.PI*2,re=(e,t,a)=>Math.min(a,Math.max(t,e)),Q=(e,t,a,n)=>`hsla(${(e%360+360)%360},${re(t,0,100)}%,${re(a,0,100)}%,${re(n,0,1)})`,vt=(e,t)=>{const a=e.profiles[t.classType];return a[t.profileIndex]??a[0]},Fe=e=>.55+e.z*.95,_e=(e,t)=>({hue:t.shape.hue+e.hueOffset,saturation:re(t.shape.saturation+e.saturationOffset,16,98),lightness:re(t.shape.lightness+e.lightnessOffset,22,92)}),gt=(e,t)=>({x:t.nx*e.width,y:t.ny*e.height}),Mt=(e,t,a)=>{const n=a*.5,o=Math.max(n,t*.5);e.beginPath(),e.moveTo(-o+n,-n),e.lineTo(o-n,-n),e.arc(o-n,0,n,-Math.PI/2,Math.PI/2),e.lineTo(-o+n,n),e.arc(-o+n,0,n,Math.PI/2,-Math.PI/2),e.closePath()},xt=(e,t,a,n,o,d)=>{var m;const s=Fe(a),l=((m=a.bacteria)==null?void 0:m.subCells)??[{offsetX:0,offsetY:0,vx:0,vy:0,scale:1}],i=_e(a,n),f=i.hue,u=i.saturation,c=i.lightness,r=n.shape.alpha*(.35+a.z*.75),h=a.bacteria;for(let g=0;g<l.length;g++){const v=l[g],w=(n.shape.length??n.shape.size*2.1)*v.scale*s,b=(n.shape.thickness??n.shape.size*.45)*v.scale*s,M=a.rotation+g*.2;if(e.save(),e.translate(o+v.offsetX*s,d+v.offsetY*s),e.rotate(M),Mt(e,w,b),e.fillStyle=Q(f+g*5,u,c+2,r),e.shadowColor=Q(f+8,u,c+10,r*.45),e.shadowBlur=8*s,e.fill(),e.shadowBlur=0,e.strokeStyle=Q(f-8,u-8,c-6,r*.9),e.lineWidth=Math.max(.65,b*.14),e.stroke(),h!=null&&h.hasFlagella&&g<h.flagellaCount){const y=1+g%2,S=-w*.52,x=h.flagellaLength*v.scale*s,p=h.flagellaPhase+g*.9+t.time*.35;for(let C=0;C<y;C++){const A=(C/Math.max(1,y-1)-.5)*b*.72;e.beginPath(),e.moveTo(S,A);for(let I=1;I<=6;I++){const $=I/6,Y=S-x*$,Z=Math.sin(p+$*7+C*1.4)*b*(.18+$*.44);e.lineTo(Y,A+Z)}e.strokeStyle=Q(f+18,u-8,c+6,r*.84),e.lineWidth=Math.max(.45,b*.11),e.lineCap="round",e.stroke()}}e.restore()}},bt=(e,t,a,n,o,d)=>{var y,S,x;const s=Fe(a),l=(n.shape.headRadius??n.shape.size*.5)*s,i=(n.shape.tailLength??n.shape.size*1.3)*s,f=6,u=n.shape.alpha*(.32+a.z*.72),c=Math.sin((((y=a.bacteriophage)==null?void 0:y.flutterPhase)??0)+t.time*1.2),r=_e(a,n),h=r.hue,m=r.saturation,g=r.lightness;e.save(),e.translate(o,d),e.rotate(a.rotation+c*.08),e.shadowColor=Q(h+10,m,g+8,u*.5),e.shadowBlur=7*s,e.beginPath();for(let p=0;p<8;p++){const C=p/8*Te+Math.PI/8,E=Math.cos(C)*l,A=Math.sin(C)*l;p===0?e.moveTo(E,A):e.lineTo(E,A)}e.closePath(),e.fillStyle=Q(h,m,g+6,u),e.fill(),e.shadowBlur=0,e.strokeStyle=Q(h+12,m+4,g+12,u*.95),e.lineWidth=Math.max(.9,l*.24),e.stroke();const v=l*.85,w=v+i,b=((S=a.bacteriophage)==null?void 0:S.flutterPhase)??0,M=(1.1+(((x=a.bacteriophage)==null?void 0:x.tailJitter)??.7)*1.2)*s;e.beginPath(),e.moveTo(v,0);for(let p=1;p<=f;p++){const C=p/f,E=v+(w-v)*C,A=Math.sin(t.time*3.3+b+p*.85)*M*(.2+C*.8);e.lineTo(E,A)}e.strokeStyle=Q(h+8,m-4,g+4,u*.9),e.lineWidth=Math.max(.85,l*.17),e.stroke(),e.restore()},wt=(e,t,a,n,o,d)=>{var v;const s=Fe(a),l=(n.shape.size??10)*.58*s,i=re(Math.round(n.shape.protrusions??10),6,20),f=(n.shape.protrusionLength??2.4)*s,u=n.shape.alpha*(.34+a.z*.74),c=((v=a.viralEnvelope)==null?void 0:v.protrusionWobble)??t.time,r=_e(a,n),h=r.hue,m=r.saturation,g=r.lightness;e.save(),e.translate(o,d),e.rotate(a.rotation*.4),e.strokeStyle=Q(h+8,m+4,g+8,u*.8),e.lineWidth=Math.max(.7,l*.16);for(let w=0;w<i;w++){const M=w/i*Te+c*.28,y=Math.cos(M)*l,S=Math.sin(M)*l,x=.8+Math.sin(t.time*1.6+w*.7+c)*.22,p=l+f*x,C=Math.cos(M)*p,E=Math.sin(M)*p;e.beginPath(),e.moveTo(y,S),e.lineTo(C,E),e.stroke()}e.shadowColor=Q(h+8,m+2,g+10,u*.42),e.shadowBlur=9*s,e.fillStyle=Q(h,m,g+4,u*.22),e.beginPath(),e.arc(0,0,l,0,Te),e.arc(0,0,l*.56,0,Te,!0),e.fill("evenodd"),e.shadowBlur=0,e.strokeStyle=Q(h-4,m-8,g-4,u*.92),e.lineWidth=Math.max(.9,l*.18),e.stroke(),e.restore()},yt=(e,t,a,n,o,d)=>{var w;const s=Fe(a),l=(n.shape.size??11)*.66*s,i=re(Math.round(n.shape.lobeCount??10),6,18),f=re(n.shape.roughness??.15,.02,.38),u=n.shape.alpha*(.3+a.z*.7),c=1+Math.sin((((w=a.amoeba)==null?void 0:w.pulsePhase)??0)+t.time*.8)*.1,r=_e(a,n),h=r.hue,m=r.saturation,g=r.lightness,v=[];for(let b=0;b<i;b++){const M=b/i*Te,y=Math.sin(M*2+t.time*1.4+a.id*.37),S=Math.sin(M*5-t.time*.9+a.id*.11),x=1+f*(y*.65+S*.35),p=l*c*x;v.push({x:Math.cos(M)*p,y:Math.sin(M)*p})}e.save(),e.translate(o,d),e.rotate(a.rotation*.35),e.beginPath();for(let b=0;b<v.length;b++){const M=v[b],y=v[(b+1)%v.length],S=(M.x+y.x)*.5,x=(M.y+y.y)*.5;b===0?e.moveTo(S,x):e.quadraticCurveTo(M.x,M.y,S,x)}e.closePath(),e.shadowColor=Q(h+10,m+2,g+8,u*.45),e.shadowBlur=10*s,e.fillStyle=Q(h,m,g+1,u),e.fill(),e.shadowBlur=0,e.strokeStyle=Q(h-6,m-12,g-8,u*.9),e.lineWidth=Math.max(.8,l*.16),e.stroke(),e.restore()},St=(e,t,a)=>{const n=vt(t,a),{x:o,y:d}=gt(t,a);if(a.classType==="bacteria"){xt(e,t,a,n,o,d);return}if(a.classType==="bacteriophage"){bt(e,t,a,n,o,d);return}if(a.classType==="viralEnvelope"){wt(e,t,a,n,o,d);return}yt(e,t,a,n,o,d)},Pt=e=>{const t=e.particles.slice();return t.sort((a,n)=>a.z-n.z),t},Ct=(e,t)=>{e.clearRect(0,0,t.width,t.height);const a=Pt(t);for(let n=0;n<a.length;n++)St(e,t,a[n])},ot=18,At=42,Ue={low:{areaDivisor:15e3,minParticles:80,maxParticles:130,maxAmoebaChecks:4,emissionCapPerVirus:4,bacteriaSubCellCap:3},balanced:{areaDivisor:9800,minParticles:110,maxParticles:190,maxAmoebaChecks:8,emissionCapPerVirus:6,bacteriaSubCellCap:4},high:{areaDivisor:7200,minParticles:150,maxParticles:260,maxAmoebaChecks:12,emissionCapPerVirus:10,bacteriaSubCellCap:5}},be=[{classType:"bacteria",weight:.45},{classType:"viralEnvelope",weight:.22},{classType:"amoeba",weight:.18},{classType:"bacteriophage",weight:.15}],Tt=14,Et={bacteria:{slideDurationMin:.35,slideDurationMax:1.2,pauseDurationMin:.18,pauseDurationMax:.95,impulseMin:26,impulseMax:92,dampingMin:.915,dampingMax:.965,flowScaleMin:.95,flowScaleMax:1.3,driftJitterMin:5,driftJitterMax:14},bacteriophage:{slideDurationMin:.32,slideDurationMax:1,pauseDurationMin:.24,pauseDurationMax:.85,impulseMin:22,impulseMax:68,dampingMin:.92,dampingMax:.968,flowScaleMin:.9,flowScaleMax:1.22,driftJitterMin:4,driftJitterMax:11},viralEnvelope:{slideDurationMin:.38,slideDurationMax:1.1,pauseDurationMin:.2,pauseDurationMax:.9,impulseMin:20,impulseMax:58,dampingMin:.92,dampingMax:.966,flowScaleMin:.88,flowScaleMax:1.2,driftJitterMin:4,driftJitterMax:12},amoeba:{slideDurationMin:.42,slideDurationMax:1.2,pauseDurationMin:.22,pauseDurationMax:.92,impulseMin:16,impulseMax:52,dampingMin:.93,dampingMax:.97,flowScaleMin:.86,flowScaleMax:1.1,driftJitterMin:3,driftJitterMax:9}},kt={bacteria:{sizeMin:7,sizeMax:15,trailLengthMin:8,trailLengthMax:14,trailWidthMin:1.3,trailWidthMax:2.6,lengthMin:14,lengthMax:34,thicknessMin:4,thicknessMax:10,maxSubCellsMin:2,maxSubCellsMax:4,fissionIntervalMin:1.8,fissionIntervalMax:4.2,localJitterMin:4,localJitterMax:16},bacteriophage:{sizeMin:7,sizeMax:13,trailLengthMin:5,trailLengthMax:9,trailWidthMin:1,trailWidthMax:1.9,headRadiusMin:4,headRadiusMax:8,tailLengthMin:10,tailLengthMax:18,tailLegsMin:3,tailLegsMax:6},viralEnvelope:{sizeMin:7,sizeMax:14,trailLengthMin:6,trailLengthMax:10,trailWidthMin:1,trailWidthMax:2.2,protrusionsMin:8,protrusionsMax:14,protrusionLengthMin:1.5,protrusionLengthMax:4,emissionIntervalMin:.7,emissionIntervalMax:2,emissionSpeedMin:28,emissionSpeedMax:80,emissionTTLMin:.4,emissionTTLMax:1},amoeba:{sizeMin:9,sizeMax:18,trailLengthMin:5,trailLengthMax:8,trailWidthMin:1.4,trailWidthMax:2.8,lobeCountMin:8,lobeCountMax:14,roughnessMin:.08,roughnessMax:.24,pulseSpeedMin:.8,pulseSpeedMax:1.9,senseRadiusMin:58,senseRadiusMax:126,chaseStrengthMin:18,chaseStrengthMax:56,bumpStrengthMin:40,bumpStrengthMax:88}},Lt={biotic:{bacteria:{hueMin:26,hueMax:182,saturationMin:52,saturationMax:90,lightnessMin:48,lightnessMax:74,alphaMin:.24,alphaMax:.5},bacteriophage:{hueMin:176,hueMax:340,saturationMin:60,saturationMax:92,lightnessMin:52,lightnessMax:76,alphaMin:.26,alphaMax:.48},viralEnvelope:{hueMin:0,hueMax:360,saturationMin:58,saturationMax:94,lightnessMin:50,lightnessMax:76,alphaMin:.24,alphaMax:.48},amoeba:{hueMin:72,hueMax:252,saturationMin:42,saturationMax:84,lightnessMin:42,lightnessMax:70,alphaMin:.22,alphaMax:.44}},labBlue:{bacteria:{hueMin:188,hueMax:210,saturationMin:42,saturationMax:76,lightnessMin:50,lightnessMax:74,alphaMin:.22,alphaMax:.44},bacteriophage:{hueMin:196,hueMax:230,saturationMin:52,saturationMax:84,lightnessMin:52,lightnessMax:74,alphaMin:.24,alphaMax:.46},viralEnvelope:{hueMin:184,hueMax:220,saturationMin:50,saturationMax:86,lightnessMin:52,lightnessMax:75,alphaMin:.24,alphaMax:.46},amoeba:{hueMin:176,hueMax:206,saturationMin:34,saturationMax:70,lightnessMin:46,lightnessMax:66,alphaMin:.22,alphaMax:.42}},neon:{bacteria:{hueMin:40,hueMax:320,saturationMin:62,saturationMax:96,lightnessMin:54,lightnessMax:78,alphaMin:.26,alphaMax:.54},bacteriophage:{hueMin:180,hueMax:310,saturationMin:68,saturationMax:98,lightnessMin:56,lightnessMax:80,alphaMin:.28,alphaMax:.56},viralEnvelope:{hueMin:8,hueMax:300,saturationMin:64,saturationMax:98,lightnessMin:56,lightnessMax:80,alphaMin:.28,alphaMax:.56},amoeba:{hueMin:130,hueMax:280,saturationMin:52,saturationMax:94,lightnessMin:48,lightnessMax:76,alphaMin:.24,alphaMax:.5}}},ht=(e,t)=>{const a=(e+1)*2654435761+(t+1)*1013904223>>>0;return a===0?1:a},It=e=>{const t=e*1664525+1013904223>>>0;return t===0?1:t},Oe=e=>{const t=It(e);return[t,t/4294967296]},k=(e,t,a)=>{const[n,o]=Oe(e);return[n,t+(a-t)*o]},Se=(e,t,a)=>{const[n,o]=Oe(e),d=a-t+1;return[n,t+Math.floor(o*d)]},Rt={bacteria:11,bacteriophage:29,viralEnvelope:47,amoeba:83},ut={biotic:7,labBlue:31,neon:59},zt={low:17,balanced:41,high:73},Be=72,st={bacteria:{min:-.16,max:.16},bacteriophage:{min:-.34,max:.34},viralEnvelope:{min:-.24,max:.24},amoeba:{min:-.12,max:.12}},Dt={bacteria:.34,bacteriophage:1,viralEnvelope:.7,amoeba:.52},ue=(e,t,a)=>Math.min(a,Math.max(t,e)),Bt=e=>{const[t,a]=Oe(e);let n=0;for(let o=0;o<be.length;o++)if(n+=be[o].weight,a<=n)return[t,be[o].classType];return[t,be[be.length-1].classType]},dt=(e,t,a)=>{const n=Ue[a],o=e*t;return ue(Math.floor(o/n.areaDivisor),n.minParticles,n.maxParticles)},B=e=>{const[t,a]=Oe(e.rngState);return e.rngState=t,a},L=(e,t,a)=>t+(a-t)*B(e),Ne=(e,t)=>{const a=e.profiles[t.classType];return a[t.profileIndex]??a[0]},qe=(e,t,a)=>{const n=e.reducedMotion?.52:1;return(ot+(At-ot)*t.z)*a.motion.flowScale*e.flowStrength*n},Ft=e=>{const t={bacteria:[],bacteriophage:[],viralEnvelope:[],amoeba:[]},a=["bacteria","bacteriophage","viralEnvelope","amoeba"];for(let n=0;n<a.length;n++){const o=a[n];for(let d=0;d<Tt;d++){let s=ht(d,Rt[o]+ut[e]*13);const l=Et[o],i=kt[o],f=Lt[e][o];let u,c,r,h,m,g;[s,u]=k(s,l.slideDurationMin,l.slideDurationMax),[s,c]=k(s,l.pauseDurationMin,l.pauseDurationMax),[s,r]=k(s,l.impulseMin,l.impulseMax),[s,h]=k(s,l.dampingMin,l.dampingMax),[s,m]=k(s,l.flowScaleMin,l.flowScaleMax),[s,g]=k(s,l.driftJitterMin,l.driftJitterMax);let v,w,b,M,y,S,x;[s,v]=k(s,i.sizeMin,i.sizeMax),[s,w]=k(s,i.trailLengthMin,i.trailLengthMax),[s,b]=k(s,i.trailWidthMin,i.trailWidthMax),[s,M]=k(s,f.hueMin,f.hueMax),[s,y]=k(s,f.saturationMin,f.saturationMax),[s,S]=k(s,f.lightnessMin,f.lightnessMax),[s,x]=k(s,f.alphaMin,f.alphaMax);const p={id:d,classType:o,motion:{slideDuration:u,pauseDuration:c,impulse:r,damping:h,flowScale:m,driftJitter:g},shape:{classType:o,size:v,trailLength:w,trailWidth:b,hue:M,saturation:y,lightness:S,alpha:x}};if(o==="bacteria"){let C,E,A,I,$;[s,C]=k(s,i.lengthMin??14,i.lengthMax??30),[s,E]=k(s,i.thicknessMin??4,i.thicknessMax??9),[s,A]=Se(s,i.maxSubCellsMin??2,i.maxSubCellsMax??4),[s,I]=k(s,i.fissionIntervalMin??2,i.fissionIntervalMax??4),[s,$]=k(s,i.localJitterMin??4,i.localJitterMax??12),p.shape.length=C,p.shape.thickness=E,p.shape.maxSubCells=A,p.shape.fissionInterval=I,p.shape.localJitter=$}if(o==="bacteriophage"){let C,E,A;[s,C]=k(s,i.headRadiusMin??4,i.headRadiusMax??8),[s,E]=k(s,i.tailLengthMin??10,i.tailLengthMax??18),[s,A]=Se(s,i.tailLegsMin??3,i.tailLegsMax??6),p.shape.headRadius=C,p.shape.tailLength=E,p.shape.tailLegs=A}if(o==="viralEnvelope"){let C,E,A,I,$;[s,C]=Se(s,i.protrusionsMin??8,i.protrusionsMax??14),[s,E]=k(s,i.protrusionLengthMin??1.5,i.protrusionLengthMax??4),[s,A]=k(s,i.emissionIntervalMin??.7,i.emissionIntervalMax??2),[s,I]=k(s,i.emissionSpeedMin??28,i.emissionSpeedMax??80),[s,$]=k(s,i.emissionTTLMin??.4,i.emissionTTLMax??1),p.shape.protrusions=C,p.shape.protrusionLength=E,p.shape.emissionInterval=A,p.shape.emissionSpeed=I,p.shape.emissionTTL=$,p.shape.protrusionStyle="spike"}if(o==="amoeba"){let C,E,A,I,$,Y;[s,C]=Se(s,i.lobeCountMin??8,i.lobeCountMax??14),[s,E]=k(s,i.roughnessMin??.08,i.roughnessMax??.24),[s,A]=k(s,i.pulseSpeedMin??.8,i.pulseSpeedMax??1.8),[s,I]=k(s,i.senseRadiusMin??56,i.senseRadiusMax??124),[s,$]=k(s,i.chaseStrengthMin??18,i.chaseStrengthMax??56),[s,Y]=k(s,i.bumpStrengthMin??40,i.bumpStrengthMax??88),p.shape.lobeCount=C,p.shape.roughness=E,p.shape.pulseSpeed=A,p.shape.senseRadius=I,p.shape.chaseStrength=$,p.shape.bumpStrength=Y}t[o].push(p)}}return t},_t=(e,t,a)=>{const n=B(e)*Math.PI*2,o=t.motion.impulse*(.5+B(e)*.55),d=Math.cos(n),s=Math.sin(n),l=.34+B(e)*.32,i=s<0?s*.28:s;e.slideAx=d*o/Math.max(a.width,1),e.slideAy=(i+l)*o/Math.max(a.height,1)},He=(e,t,a,n)=>{e.phase=n,e.phaseTime=0;const d=(n==="slide"?t.motion.slideDuration:t.motion.pauseDuration)*(.72+B(e)*.62);e.phaseDuration=d,n==="slide"?_t(e,t,a):(e.slideAx=0,e.slideAy=0)},Ot=(e,t)=>{const a=B(e)*Math.PI*2,n=L(e,0,8);return{offsetX:Math.cos(a)*n,offsetY:Math.sin(a)*n,vx:L(e,-12,12),vy:L(e,-12,12),scale:t}},ft=(e,t,a,n)=>{let o=ht(e+((n==null?void 0:n.respawnCount)??0),zt[t.preset]+ut[t.palette]*5),d,s,l,i,f,u,c;[o,d]=Bt(o),[o,s]=Se(o,0,t.profiles[d].length-1),[o,l]=k(o,0,1),[o,i]=k(o,-.2,1.05),[o,f]=k(o,.08,1),[o,u]=k(o,-Math.PI,Math.PI),[o,c]=k(o,st[d].min,st[d].max);const r={id:e,classType:d,profileIndex:s,rngState:o,respawnCount:(n==null?void 0:n.respawnCount)??0,hueOffset:0,saturationOffset:0,lightnessOffset:0,nx:l,ny:i,vx:0,vy:0,z:f,phase:"slide",phaseTime:0,phaseDuration:0,slideAx:0,slideAy:0,rotation:u,rotationSpeed:c,trail:[]},h=Ne(t,r),m=d==="bacteria"?58:d==="viralEnvelope"?46:34;if(r.hueOffset=L(r,-m,m),r.saturationOffset=L(r,-16,14),r.lightnessOffset=L(r,-10,12),r.vx=L(r,-.004,.004),r.vy=qe(t,r,h)/Math.max(t.height,1)*L(r,.2,.48),d==="bacteria"){const w=ue(Math.round(h.shape.maxSubCells??3),1,a.bacteriaSubCellCap),b=B(r)>.58?2:1,M=[];for(let y=0;y<b;y++){const S=.72+B(r)*.44;M.push(Ot(r,S))}r.bacteria={subCells:M,fissionTimer:L(r,.1,1.4),fissionInterval:(h.shape.fissionInterval??2.8)*(.62+B(r)*.92),maxSubCells:w,localJitter:h.shape.localJitter??8,hasFlagella:B(r)>.62,flagellaCount:1+Math.floor(B(r)*3),flagellaLength:(h.shape.length??24)*L(r,.68,1.18),flagellaPhase:L(r,0,Math.PI*2),flagellaSpeed:L(r,1.2,2.6)}}d==="viralEnvelope"&&(r.viralEnvelope={emitTimer:L(r,0,h.shape.emissionInterval??1),emitInterval:(h.shape.emissionInterval??1.1)*(.76+B(r)*.72),emissions:[],protrusionWobble:L(r,0,Math.PI*2)}),d==="amoeba"&&(r.amoeba={pulsePhase:L(r,0,Math.PI*2),senseRadius:h.shape.senseRadius??84,chaseStrength:h.shape.chaseStrength??34,bumpStrength:h.shape.bumpStrength??62}),d==="bacteriophage"&&(r.bacteriophage={flutterPhase:L(r,0,Math.PI*2),tailJitter:L(r,.35,1.1)});const g=B(r)>.92?"slide":"pause";He(r,h,t,g),r.phaseTime=L(r,0,r.phaseDuration*.5);const v=Math.max(2,Math.round((h.shape.trailLength??6)*.4));for(let w=0;w<v;w++)r.trail.push({nx:r.nx,ny:r.ny});return r},Nt=(e,t)=>{e.respawnCount+=1,e.nx=B(e),e.ny=-.1-B(e)*.26,e.vx=L(e,-.003,.003),e.vy=0,e.rotation=L(e,-Math.PI,Math.PI);const a=Ne(t,e);He(e,a,t,B(e)>.9?"slide":"pause"),e.phaseTime=L(e,0,e.phaseDuration*.5),e.viralEnvelope&&(e.viralEnvelope.emissions.length=0,e.viralEnvelope.emitTimer=L(e,0,e.viralEnvelope.emitInterval)),e.trail.length=0,e.trail.push({nx:e.nx,ny:e.ny})},$t=(e,t,a,n)=>{if(!e.bacteria)return;const o=e.bacteria,d=(t.shape.length??24)*.78,s=1.14;for(let r=0;r<o.subCells.length;r++){const h=o.subCells[r];h.vx+=(B(e)-.5)*o.localJitter*n*s,h.vy+=(B(e)-.5)*o.localJitter*n*s,h.vx*=.88,h.vy*=.88,h.offsetX+=h.vx*n,h.offsetY+=h.vy*n;const m=Math.hypot(h.offsetX,h.offsetY);m>d&&(h.offsetX=h.offsetX/m*d,h.offsetY=h.offsetY/m*d,h.vx*=.5,h.vy*=.5)}if(o.hasFlagella){const r=a.reducedMotion?o.flagellaSpeed*.45:o.flagellaSpeed;o.flagellaPhase+=n*r}if(a.reducedMotion||(o.fissionTimer+=n,o.fissionTimer<o.fissionInterval||o.subCells.length>=o.maxSubCells))return;const l=Math.floor(B(e)*o.subCells.length),i=o.subCells[l]??o.subCells[0],f=B(e)*Math.PI*2,u=L(e,4,10),c={offsetX:i.offsetX+Math.cos(f)*u,offsetY:i.offsetY+Math.sin(f)*u,vx:Math.cos(f)*L(e,8,26),vy:Math.sin(f)*L(e,8,26),scale:ue(i.scale*L(e,.78,1.18),.55,1.3)};o.subCells.push(c),o.fissionTimer=0,o.fissionInterval=(t.shape.fissionInterval??2.6)*(.62+B(e)*.88)},Wt=(e,t,a,n)=>{if(!e.viralEnvelope)return;const o=e.viralEnvelope;if(o.protrusionWobble+=n*.7,!a.reducedMotion&&(o.emitTimer+=n,o.emitTimer>=o.emitInterval)){const l=B(e)>.74?2:1;for(let i=0;i<l;i++){const f=B(e)*Math.PI*2,u=(t.shape.emissionSpeed??44)*(.62+B(e)*.88),c=(t.shape.emissionTTL??.8)*(.62+B(e)*.88),r=(t.shape.size??10)*.58+(t.shape.protrusionLength??2.2),h=e.nx+Math.cos(f)*r/Math.max(a.width,1),m=e.ny+Math.sin(f)*r/Math.max(a.height,1);o.emissions.push({nx:h,ny:m,vx:Math.cos(f)*u/Math.max(a.width,1),vy:Math.sin(f)*u/Math.max(a.height,1),ttl:c,life:c,size:(t.shape.size??10)*L(e,.12,.28),hue:t.shape.hue+e.hueOffset+L(e,-14,14),saturation:ue(t.shape.saturation+e.saturationOffset+L(e,-8,12),20,98),lightness:ue(t.shape.lightness+e.lightnessOffset+L(e,2,18),30,90),alpha:ue(t.shape.alpha+L(e,-.06,.12),.12,.8)})}for(;o.emissions.length>a.emissionCapPerVirus;)o.emissions.shift();o.emitTimer=0,o.emitInterval=(t.shape.emissionInterval??1.1)*(.74+B(e)*.95)}const s=qe(a,e,t)*.35/Math.max(a.height,1);for(let l=o.emissions.length-1;l>=0;l--){const i=o.emissions[l];i.vx*=.986,i.vy*=.986,i.vy+=s*n,i.nx+=i.vx*n,i.ny+=s*n,i.ny+=i.vy*n,i.ttl-=n,(i.ttl<=0||i.ny>1.22||i.nx<-.16||i.nx>1.16)&&o.emissions.splice(l,1)}},Xt=(e,t)=>{e.bacteriophage&&(e.bacteriophage.flutterPhase+=t*(1.4+e.bacteriophage.tailJitter),e.rotation+=Math.sin(e.bacteriophage.flutterPhase)*.02)},Gt=(e,t,a)=>{e.amoeba&&(e.amoeba.pulsePhase+=a*(t.shape.pulseSpeed??1.1))},Yt=e=>{const t=new Map;for(let a=0;a<e.particles.length;a++){const n=e.particles[a],o=n.nx*e.width,d=n.ny*e.height,s=Math.floor(o/Be),l=Math.floor(d/Be),i=`${s}:${l}`,f=t.get(i);f?f.push(a):t.set(i,[a])}return t},Vt=(e,t)=>{const a=Yt(e);for(let n=0;n<e.particles.length;n++){const o=e.particles[n];if(o.classType!=="amoeba"||!o.amoeba)continue;const d=Ne(e,o),s=o.amoeba,l=o.nx*e.width,i=o.ny*e.height,f=Math.floor(l/Be),u=Math.floor(i/Be),c=(s.senseRadius??d.shape.senseRadius??84)*(.68+o.z*.52),r=Math.max(12,c*.26);let h=-1,m=Number.POSITIVE_INFINITY,g=0;for(let v=-1;v<=1;v++){for(let w=-1;w<=1;w++){const b=`${f+v}:${u+w}`,M=a.get(b);if(M){for(let y=0;y<M.length;y++){const S=M[y];if(S===n)continue;g+=1;const x=e.particles[S],p=x.nx*e.width,C=x.ny*e.height,E=p-l,A=C-i,I=E*E+A*A;if(I<c*c&&I<m&&(m=I,h=S),I<r*r&&I>1e-4){const $=Math.sqrt(I),Y=E/$,Z=A/$,V=s.bumpStrength/Math.max(e.width,1)*t,X=s.bumpStrength/Math.max(e.height,1)*t;o.vx-=Y*V,o.vy-=Z*X,x.vx+=Y*V*.18,x.vy+=Z*X*.18}if(g>=e.maxAmoebaChecks)break}if(g>=e.maxAmoebaChecks)break}}if(g>=e.maxAmoebaChecks)break}if(h>=0&&m>1e-4){const v=e.particles[h],w=v.nx*e.width,b=v.ny*e.height,M=w-l,y=b-i,S=Math.sqrt(m),x=M/S,p=y/S,C=s.chaseStrength/Math.max(e.width,1)*t,E=s.chaseStrength/Math.max(e.height,1)*t;o.vx+=x*C,o.vy+=p*E}}},Jt=(e,t,a)=>{const n=Ne(e,t);if(t.phaseTime+=a,t.phaseTime>=t.phaseDuration&&He(t,n,e,t.phase==="slide"?"pause":"slide"),t.phase==="slide"){t.vx+=t.slideAx*a,t.vy+=t.slideAy*a;const s=(B(t)-.5)*n.motion.driftJitter/Math.max(e.width,1),l=(B(t)-.5)*n.motion.driftJitter/Math.max(e.height,1);t.vx+=s*a,t.vy+=l*a}const o=Math.pow(n.motion.damping,a*60);t.vx*=o,t.vy*=o,t.phase==="pause"&&(t.vx*=.88,t.vy*=.88);const d=qe(e,t,n)/Math.max(e.height,1);t.ny+=d*a,t.vy+=d*a*.08,t.nx+=t.vx*a,t.ny+=t.vy*a,t.rotation+=t.rotationSpeed*a*Dt[t.classType],t.nx<-.08&&(t.nx+=1.16),t.nx>1.08&&(t.nx-=1.16),t.ny>1.16&&Nt(t,e),t.classType==="bacteria"&&$t(t,n,e,a),t.classType==="viralEnvelope"&&Wt(t,n,e,a),t.classType==="bacteriophage"&&Xt(t,a),t.classType==="amoeba"&&Gt(t,n,a)},jt=e=>{const t=Ue[e.preset],a=Ft(e.palette),n={width:e.width,height:e.height,dpr:e.dpr,time:0,preset:e.preset,palette:e.palette,reducedMotion:e.reducedMotion,flowStrength:e.flowStrength,maxAmoebaChecks:t.maxAmoebaChecks,emissionCapPerVirus:t.emissionCapPerVirus,particles:[],profiles:a},o=dt(e.width,e.height,e.preset);for(let d=0;d<o;d++)n.particles.push(ft(d,n,t));return n},Ut=(e,t,a,n)=>{e.width=t,e.height=a,e.dpr=n;const o=Ue[e.preset];e.maxAmoebaChecks=o.maxAmoebaChecks,e.emissionCapPerVirus=o.emissionCapPerVirus;const d=dt(t,a,e.preset);if(e.particles.length<d){const s=e.particles.length;for(let l=s;l<d;l++)e.particles.push(ft(l,e,o))}else e.particles.length>d&&(e.particles.length=d)},qt=(e,t)=>{const a=ue(t,.001,.05);e.time+=a;for(let n=0;n<e.particles.length;n++)Jt(e,e.particles[n],a);Vt(e,a)},Ht=(e,t,a)=>Math.min(a,Math.max(t,e)),Kt=e=>e==="mobile"?"low":e==="ultra"?"high":"balanced",Qt=({quality:e,className:t,preset:a,palette:n,flowStrength:o})=>{const d=H.useRef(null),s=H.useMemo(()=>a??Kt(e),[a,e]),l=n??"biotic",i=Ht(o??1,.35,2.6);return H.useEffect(()=>{const f=d.current;if(!f)return;const u=f.getContext("2d");if(!u)return;let c=0,r=0,h=1,m=0,g=performance.now(),v=jt({width:1,height:1,dpr:1,preset:s,palette:l,reducedMotion:!1,flowStrength:i});const w=window.matchMedia("(prefers-reduced-motion: reduce)");v.reducedMotion=w.matches;const b=()=>{const x=f.getBoundingClientRect();c=Math.max(1,x.width),r=Math.max(1,x.height),h=Math.min(window.devicePixelRatio||1,2),f.width=Math.max(1,Math.floor(c*h)),f.height=Math.max(1,Math.floor(r*h)),u.setTransform(h,0,0,h,0,0),Ut(v,c,r,h)},M=x=>{v.reducedMotion=x.matches},y=x=>{const p=Math.min(.05,Math.max(.001,(x-g)/1e3));g=x,v.flowStrength=i,qt(v,p),Ct(u,v),m=window.requestAnimationFrame(y)};let S=null;return typeof window.ResizeObserver<"u"?(S=new window.ResizeObserver(b),S.observe(f)):window.addEventListener("resize",b),w.addEventListener("change",M),b(),m=window.requestAnimationFrame(y),()=>{w.removeEventListener("change",M),S?S.disconnect():window.removeEventListener("resize",b),window.cancelAnimationFrame(m)}},[i,l,s]),ge.jsx("canvas",{ref:d,className:t??"pointer-events-none absolute inset-0 h-full w-full","aria-hidden":!0})},it=24,Re=[{id:"bioelectricAmber",deep:"#0a1020",primary:"#3cd8ff",secondary:"#7dffd1",accent:"#ffb25e",highlight:"#fff2d1",dust:"#9bddff"},{id:"cytochromeAurora",deep:"#08181b",primary:"#35e3c8",secondary:"#68a9ff",accent:"#ff76b2",highlight:"#ffefd3",dust:"#b8d8ff"},{id:"aetherCopper",deep:"#08131e",primary:"#4fc3ff",secondary:"#89ffe1",accent:"#f1a15f",highlight:"#ffe7bf",dust:"#8ecaff"},{id:"ionNocturne",deep:"#0b0f1f",primary:"#7b6bff",secondary:"#5ed8ff",accent:"#f26d9d",highlight:"#c8efff",dust:"#8aa9ff"},{id:"tealMagma",deep:"#07161a",primary:"#29d4bc",secondary:"#66f0ff",accent:"#ff9f6e",highlight:"#f7ffe9",dust:"#8fe4d2"}],Ke=(e,t)=>{const a=Number.isFinite(t)?t:0,n=Math.abs(a)%997/997*it,d=Math.max(0,e+n)/it,s=Math.floor(d)%Re.length,l=(s+1)%Re.length;return{current:Re[s],next:Re[l],mix:d-Math.floor(d)}},rt={mobile:.55,balanced:1,ultra:1.35},Zt=e=>{if(e)return e;if(typeof window>"u")return"balanced";const t=window.matchMedia("(max-width: 820px)").matches,a=window.matchMedia("(pointer: coarse)").matches;return t||a?"mobile":"balanced"},ea=e=>rt[e]??rt.balanced,Ee=(e,t)=>Math.max(1,Math.floor(e*ea(t))),ta=()=>{if(typeof window>"u")return!1;try{const e=document.createElement("canvas");return e.getContext("webgl2")?!0:!!(e.getContext("webgl")||e.getContext("experimental-webgl"))}catch{return!1}},ke=`
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
`,lt=(e,t)=>{if(e==="off")return 0;const a=e==="subtle"?.36:.72;return t?a*.55:a},Qe=(e,t)=>{const a=H.useRef({x:0,y:0,targetX:0,targetY:0,clickPulse:0,active:!1,strength:lt(e,t)});return H.useEffect(()=>{a.current.strength=lt(e,t)},[e,t]),H.useEffect(()=>{const n=i=>{if(typeof window>"u")return;const f=i.clientX/Math.max(1,window.innerWidth)*2-1,u=1-i.clientY/Math.max(1,window.innerHeight)*2;a.current.targetX=Math.max(-1,Math.min(1,f)),a.current.targetY=Math.max(-1,Math.min(1,u)),a.current.active=!0},o=()=>{a.current.active=!1},d=()=>{t||e==="off"||(a.current.clickPulse=Math.min(1,a.current.clickPulse+.85))};let s=0;const l=()=>{const i=a.current,f=i.active?i.targetX:0,u=i.active?i.targetY:0,c=i.active?.12:.06;i.x+=(f-i.x)*c,i.y+=(u-i.y)*c,i.clickPulse*=t?.88:.92,i.clickPulse<.001&&(i.clickPulse=0),s=window.requestAnimationFrame(l)};return window.addEventListener("pointermove",n,{passive:!0}),window.addEventListener("pointerdown",d,{passive:!0}),window.addEventListener("pointerleave",o),window.addEventListener("blur",o),s=window.requestAnimationFrame(l),()=>{window.removeEventListener("pointermove",n),window.removeEventListener("pointerdown",d),window.removeEventListener("pointerleave",o),window.removeEventListener("blur",o),window.cancelAnimationFrame(s)}},[e,t]),a},Xe=14,Ge=48,aa=1600,na=e=>{let t=Math.floor(e)>>>0||1;return()=>(t=t*1664525+1013904223>>>0,t/4294967296)},oa=({quality:e,interactionMode:t,styleSeed:a,reducedMotion:n,className:o})=>{const d=H.useRef(null),s=Qe(t,n);return H.useEffect(()=>{const l=d.current;if(!l)return;const i=new Ve,f=new Je(-1,1,1,-1,.01,12);f.position.set(0,0,2.4);const u=new je({alpha:!0,antialias:!0,powerPreference:"high-performance"});u.setClearColor(0,0),u.domElement.style.width="100%",u.domElement.style.height="100%",u.domElement.style.display="block",u.domElement.setAttribute("aria-hidden","true"),l.appendChild(u.domElement);const c=na(a*313+79),r=[];for(let R=0;R<Xe;R++){const G=new Float32Array(Ge*3),O=new ve;O.setAttribute("position",new D(G,3));const W=new pt({color:new P("#7cd8ff"),transparent:!0,opacity:n?.24:.34,blending:nt,depthWrite:!1,depthTest:!1}),z=new mt(O,W);i.add(z),r.push({geometry:O,material:W,line:z,positions:G,phase:c()*Math.PI*2,speed:.18+c()*.24,ampX:.05+c()*.11,ampY:.03+c()*.07,laneX:-1.4+R/Math.max(1,Xe-1)*2.8,scroll:c()*2.8,depth:.06+R/Math.max(1,Xe-1)*.84,colorBias:c()})}const h=Ee(aa,e),m=new Float32Array(h*3),g=new Float32Array(h),v=new Float32Array(h),w=new Float32Array(h),b=new Float32Array(h);for(let R=0;R<h;R++){const G=R*3;m[G]=c()*3.2-1.6,m[G+1]=c()*2.8-1.4,m[G+2]=c()*.95,g[R]=1.8+c()*3.8,v[R]=.14+c()*.36,w[R]=c()*Math.PI*2,b[R]=c()}const M=new ve;M.setAttribute("position",new D(m,3)),M.setAttribute("aSize",new D(g,1)),M.setAttribute("aSpeed",new D(v,1)),M.setAttribute("aPhase",new D(w,1)),M.setAttribute("aMix",new D(b,1));const y={uTime:{value:0},uPixelRatio:{value:1},uPointer:{value:new Pe(0,0)},uPointerStrength:{value:0},uDustA:{value:new P("#8ecaff")},uDustB:{value:new P("#f7ffe9")}},S=new Ce({uniforms:y,transparent:!0,depthWrite:!1,depthTest:!1,blending:nt,vertexShader:`
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
        ${ke}

        void main() {
          vec2 uv = gl_PointCoord * 2.0 - 1.0;
          float alpha = pkPointAlpha(uv, vDepth, uTime, vMix, 0.24, 0.35);
          if (alpha <= 0.0001) discard;
          vec3 color = mix(uDustA, uDustB, vMix);
          color = pkLiftColor(color, 0.25);
          float depthAlpha = 0.2 + (1.0 - vDepth) * 0.4;

          gl_FragColor = vec4(color, min(alpha * depthAlpha, 0.78));
        }
      `}),x=new Ae(M,S);i.add(x);const p=new P,C=new P,E=new P,A=new P,I=new P,$=new P,Y=new P,Z=new P,V=new P,X=()=>{const R=l.getBoundingClientRect(),G=Math.max(1,R.width),O=Math.max(1,R.height),W=Math.min(window.devicePixelRatio||1,2);u.setPixelRatio(W),u.setSize(G,O,!1),y.uPixelRatio.value=W;const z=G/O;f.left=-z,f.right=z,f.top=1,f.bottom=-1,f.updateProjectionMatrix()};let F=null;typeof window.ResizeObserver<"u"?(F=new ResizeObserver(X),F.observe(l)):window.addEventListener("resize",X);let _=0;const J=performance.now(),j=n?.55:1,ee=R=>{const G=(R-J)/1e3,O=G*j,W=Ke(G,a+211);p.set(W.current.primary),C.set(W.next.primary),Y.copy(p).lerp(C,W.mix),E.set(W.current.secondary),A.set(W.next.secondary),Z.copy(E).lerp(A,W.mix),I.set(W.current.accent),$.set(W.next.accent),V.copy(I).lerp($,W.mix),y.uTime.value=O;const z=s.current,U=z.x*f.right,Me=z.y;y.uPointer.value.set(U,Me),y.uPointerStrength.value=z.strength,y.uDustA.value.copy(Z),y.uDustB.value.copy(V);for(let de=0;de<r.length;de++){const N=r[de];for(let le=0;le<Ge;le++){const ae=le/Math.max(1,Ge-1),Le=1.4-(N.scroll+O*N.speed+ae*2.2)%2.8;let ce=N.laneX+Math.sin(ae*6.2+N.phase+O*.44)*N.ampX+Math.sin(ae*12.5+N.phase*.6+O*.28)*N.ampX*.45,he=Le+Math.cos(ae*5.4+N.phase*1.2+O*.37)*N.ampY;const fe=ce-U,pe=he-Me,oe=Math.sqrt(fe*fe+pe*pe),se=Math.exp(-oe*4.2)*z.strength;if(se>1e-4){const ne=1/Math.max(oe,1e-4);ce+=fe*ne*se*.14,he+=pe*ne*se*.08}if(!n&&z.clickPulse>.001){const ne=Math.exp(-oe*7.2)*z.clickPulse;ce+=Math.sin(O*8+ae*14+N.phase)*ne*.03,he+=Math.cos(O*7+ae*13+N.phase)*ne*.02}const xe=le*3;N.positions[xe]=ce,N.positions[xe+1]=he,N.positions[xe+2]=N.depth}N.geometry.attributes.position.needsUpdate=!0,N.material.color.copy(Y).lerp(Z,.25+N.colorBias*.45),N.material.color.lerp(V,.1+.14*(.5+.5*Math.sin(O*.4+N.phase))),N.material.opacity=n?.2:.28+.18*(.5+.5*Math.sin(O*.62+N.phase))}u.render(i,f),_=window.requestAnimationFrame(ee)};return X(),_=window.requestAnimationFrame(ee),()=>{window.cancelAnimationFrame(_),F?F.disconnect():window.removeEventListener("resize",X);for(let R=0;R<r.length;R++)i.remove(r[R].line),r[R].geometry.dispose(),r[R].material.dispose();i.remove(x),M.dispose(),S.dispose(),u.dispose(),u.domElement.parentElement===l&&l.removeChild(u.domElement)}},[t,s,e,n,a]),ge.jsx("div",{ref:d,className:o??"pointer-events-none absolute inset-0 h-full w-full","aria-hidden":!0})},sa=4200,ia=80,ra=180,la=.34,ca=e=>{let t=Math.floor(e)>>>0||1;return()=>(t=t*1664525+1013904223>>>0,t/4294967296)},ha=({quality:e,interactionMode:t,styleSeed:a,reducedMotion:n,className:o})=>{const d=H.useRef(null),s=Qe(t,n);return H.useEffect(()=>{const l=d.current;if(!l)return;const i=new Ve,f=new Je(-1,1,1,-1,.01,14);f.position.set(0,0,3);const u=new je({alpha:!0,antialias:!0,powerPreference:"high-performance"});u.setClearColor(0,0),u.domElement.style.width="100%",u.domElement.style.height="100%",u.domElement.style.display="block",u.domElement.setAttribute("aria-hidden","true"),l.appendChild(u.domElement);const c=ca(a*571+31),r=Ee(sa,e),h=Ee(ia,e),m=Ee(ra,e),g=new Float32Array(r*3),v=new Float32Array(r),w=new Float32Array(r),b=new Float32Array(r),M=new Float32Array(r),y=new Float32Array(r),S=new Float32Array(r);for(let T=0;T<r;T++){const q=T*3;g[q]=c()*3.6-1.8,g[q+1]=c()*3-1.5,g[q+2]=c()*.98,v[T]=2.6+c()*8.2,w[T]=c(),b[T]=c()*Math.PI*2,M[T]=.12+c()*.42,y[T]=.2+c()*.8,S[T]=.2+c()*.9}const x=new ve;x.setAttribute("position",new D(g,3)),x.setAttribute("aSize",new D(v,1)),x.setAttribute("aSeed",new D(w,1)),x.setAttribute("aPhase",new D(b,1)),x.setAttribute("aDrift",new D(M,1)),x.setAttribute("aLateral",new D(y,1)),x.setAttribute("aCycle",new D(S,1));const p={uTime:{value:0},uPixelRatio:{value:1},uPointer:{value:new Pe(0,0)},uPointerStrength:{value:0},uClickPulse:{value:0},uColorA:{value:new P("#3cd8ff")},uColorB:{value:new P("#7dffd1")},uAccent:{value:new P("#ffb25e")},uHighlight:{value:new P("#fff2d1")}},C=new Ce({uniforms:p,transparent:!0,depthWrite:!1,depthTest:!1,blending:De,vertexShader:`
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
        ${ke}

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
      `}),E=new Ae(x,C);i.add(E);const A=new Float32Array(h*3),I=new Float32Array(h),$=new Float32Array(h),Y=new Float32Array(h),Z=new Float32Array(h);for(let T=0;T<h;T++){const q=T*3;A[q]=c()*3.8-1.9,A[q+1]=c()*3.2-1.6,A[q+2]=c()*.96,I[T]=24+c()*62,$[T]=c(),Y[T]=.06+c()*.2,Z[T]=c()*Math.PI*2}const V=new ve;V.setAttribute("position",new D(A,3)),V.setAttribute("aSize",new D(I,1)),V.setAttribute("aSeed",new D($,1)),V.setAttribute("aDrift",new D(Y,1)),V.setAttribute("aPhase",new D(Z,1));const X={uTime:{value:0},uPixelRatio:{value:1},uPointer:{value:new Pe(0,0)},uPointerStrength:{value:0},uColorA:{value:new P("#9ddfff")},uColorB:{value:new P("#f5fbff")}},F=new Ce({uniforms:X,transparent:!0,depthWrite:!1,depthTest:!1,blending:De,vertexShader:`
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
        ${ke}

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
      `}),_=new Ae(V,F);i.add(_);const J=new Float32Array(m*3),j=new Float32Array(m),ee=new Float32Array(m),R=new Float32Array(m),G=new Float32Array(m),O=new Float32Array(m),W=new Float32Array(m);for(let T=0;T<m;T++){const q=T*3;J[q]=c()*3.6-1.8,J[q+1]=c()*3.2-1.6,J[q+2]=c()*.95,j[T]=10+c()*22,ee[T]=c(),R[T]=Math.floor(c()*3),G[T]=c()*Math.PI*2,O[T]=c()*Math.PI*2,W[T]=.08+c()*.28}const z=new ve;z.setAttribute("position",new D(J,3)),z.setAttribute("aSize",new D(j,1)),z.setAttribute("aSeed",new D(ee,1)),z.setAttribute("aKind",new D(R,1)),z.setAttribute("aAngle",new D(G,1)),z.setAttribute("aPhase",new D(O,1)),z.setAttribute("aDrift",new D(W,1));const U={uTime:{value:0},uPixelRatio:{value:1},uPointer:{value:new Pe(0,0)},uPointerStrength:{value:0},uClickPulse:{value:0},uColorA:{value:new P("#8de1ff")},uColorB:{value:new P("#ffb973")},uAccent:{value:new P("#ffd7a1")}},Me=new Ce({uniforms:U,transparent:!0,depthWrite:!1,depthTest:!1,blending:De,vertexShader:`
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
        ${ke}

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
      `}),de=new Ae(z,Me);i.add(de);const N=new P,le=new P,ae=new P,Le=new P,ce=new P,he=new P,fe=new P,pe=new P,oe=()=>{const T=l.getBoundingClientRect(),q=Math.max(1,T.width),Ie=Math.max(1,T.height),ie=Math.min(window.devicePixelRatio||1,2);u.setPixelRatio(ie),u.setSize(q,Ie,!1),p.uPixelRatio.value=ie,X.uPixelRatio.value=ie,U.uPixelRatio.value=ie;const K=q/Ie;f.left=-K,f.right=K,f.top=1,f.bottom=-1,f.updateProjectionMatrix()};let se=null;typeof window.ResizeObserver<"u"?(se=new ResizeObserver(oe),se.observe(l)):window.addEventListener("resize",oe);const xe=n?.55:1;let ne=0,Ze=performance.now(),et=Ze;const tt=T=>{const q=Math.min(.05,Math.max(.001,(T-et)/1e3));et=T;const Ie=(T-Ze)/1e3,ie=q*xe*la;p.uTime.value+=ie,X.uTime.value+=ie,U.uTime.value+=ie;const K=Ke(Ie,a+911);N.set(K.current.primary),le.set(K.next.primary),p.uColorA.value.copy(N).lerp(le,K.mix),ae.set(K.current.secondary),Le.set(K.next.secondary),p.uColorB.value.copy(ae).lerp(Le,K.mix),ce.set(K.current.accent),he.set(K.next.accent),p.uAccent.value.copy(ce).lerp(he,K.mix),fe.set(K.current.highlight),pe.set(K.next.highlight),p.uHighlight.value.copy(fe).lerp(pe,K.mix),X.uColorA.value.copy(p.uColorA.value).lerp(p.uHighlight.value,.56),X.uColorB.value.copy(p.uColorB.value).lerp(p.uHighlight.value,.74),U.uColorA.value.copy(p.uColorB.value).lerp(p.uHighlight.value,.2),U.uColorB.value.copy(p.uAccent.value).lerp(p.uHighlight.value,.22),U.uAccent.value.copy(p.uHighlight.value);const me=s.current,$e=me.x*f.right,We=me.y;p.uPointer.value.set($e,We),X.uPointer.value.set($e,We),U.uPointer.value.set($e,We),p.uPointerStrength.value=me.strength*1.06,X.uPointerStrength.value=me.strength*.46,U.uPointerStrength.value=me.strength*.78;const at=n?0:me.clickPulse;p.uClickPulse.value=at,U.uClickPulse.value=at,u.render(i,f),ne=window.requestAnimationFrame(tt)};return oe(),ne=window.requestAnimationFrame(tt),()=>{window.cancelAnimationFrame(ne),se?se.disconnect():window.removeEventListener("resize",oe),i.remove(E),i.remove(_),i.remove(de),x.dispose(),C.dispose(),V.dispose(),F.dispose(),z.dispose(),Me.dispose(),u.dispose(),u.domElement.parentElement===l&&l.removeChild(u.domElement)}},[t,s,e,n,a]),ge.jsx("div",{ref:d,className:o??"pointer-events-none absolute inset-0 h-full w-full","aria-hidden":!0})},ze=6,ua=4200,da=.42,fa=e=>{let t=Math.floor(e)>>>0||1;return()=>(t=t*1664525+1013904223>>>0,t/4294967296)},pa=({quality:e,interactionMode:t,styleSeed:a,reducedMotion:n,className:o})=>{const d=H.useRef(null),s=Qe(t,n);return H.useEffect(()=>{const l=d.current;if(!l)return;const i=new Ve,f=new Je(-1,1,1,-1,.01,12);f.position.set(0,0,2.2);const u=new je({alpha:!0,antialias:!0,powerPreference:"high-performance"});u.setClearColor(0,0),u.domElement.style.width="100%",u.domElement.style.height="100%",u.domElement.style.display="block",u.domElement.setAttribute("aria-hidden","true"),l.appendChild(u.domElement);const c={uTime:{value:0},uPixelRatio:{value:1},uPointer:{value:new Pe(0,0)},uPointerStrength:{value:0},uClickPulse:{value:0},uColorA:{value:new P("#5ed8ff")},uColorB:{value:new P("#7b6bff")},uAccent:{value:new P("#f26d9d")}},r=`
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
    `,h=`
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform vec3 uAccent;
      uniform float uTime;
      varying float vDepth;
      varying float vSeed;
      ${ke}

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
    `,m=new Ce({uniforms:c,vertexShader:r,fragmentShader:h,transparent:!0,depthWrite:!1,depthTest:!1,blending:De}),g=[],v=Ee(ua,e),w=Math.floor(v/ze),b=v%ze;for(let F=0;F<ze;F++){const _=w+(F<b?1:0),J=fa(a*97+F*1337+17),j=new Float32Array(_*3),ee=new Float32Array(_),R=new Float32Array(_),G=new Float32Array(_);for(let z=0;z<_;z++){const U=z*3;j[U]=J()*2.6-1.3,j[U+1]=J()*2.7-1.35,j[U+2]=F/Math.max(1,ze-1),ee[z]=2.5+J()*7.5,R[z]=J()*Math.PI*2,G[z]=J()}const O=new ve;O.setAttribute("position",new D(j,3)),O.setAttribute("aSize",new D(ee,1)),O.setAttribute("aPhase",new D(R,1)),O.setAttribute("aSeed",new D(G,1));const W=new Ae(O,m);i.add(W),g.push({geometry:O,points:W})}const M=new P,y=new P,S=new P,x=new P,p=new P,C=new P,E=F=>{const _=Ke(F,a);M.set(_.current.primary),y.set(_.next.primary),c.uColorA.value.copy(M).lerp(y,_.mix),p.set(_.current.secondary),C.set(_.next.secondary),c.uColorB.value.copy(p).lerp(C,_.mix),S.set(_.current.accent),x.set(_.next.accent),c.uAccent.value.copy(S).lerp(x,_.mix)},A=()=>{const F=l.getBoundingClientRect(),_=Math.max(1,F.width),J=Math.max(1,F.height),j=Math.min(window.devicePixelRatio||1,2);u.setPixelRatio(j),u.setSize(_,J,!1),c.uPixelRatio.value=j;const ee=_/J;f.left=-ee,f.right=ee,f.top=1,f.bottom=-1,f.updateProjectionMatrix()};let I=null;typeof window.ResizeObserver<"u"?(I=new ResizeObserver(A),I.observe(l)):window.addEventListener("resize",A);const $=(n?.55:1)*da;let Y=0,Z=performance.now(),V=Z;const X=F=>{const _=Math.min(.05,Math.max(.001,(F-V)/1e3));V=F;const J=(F-Z)/1e3;c.uTime.value+=_*$,E(J);const j=s.current;c.uPointer.value.set(j.x*f.right,j.y),c.uPointerStrength.value=j.strength,c.uClickPulse.value=n?0:j.clickPulse,u.render(i,f),Y=window.requestAnimationFrame(X)};return A(),Y=window.requestAnimationFrame(X),()=>{window.cancelAnimationFrame(Y),I?I.disconnect():window.removeEventListener("resize",A);for(let F=0;F<g.length;F++)i.remove(g[F].points),g[F].geometry.dispose();m.dispose(),u.dispose(),u.domElement.parentElement===l&&l.removeChild(u.domElement)}},[t,s,e,n,a]),ge.jsx("div",{ref:d,className:o??"pointer-events-none absolute inset-0 h-full w-full","aria-hidden":!0})},ct={bioticParticles:{id:"bioticParticles",label:"Biotic Particles",requiresWebGL:!1,component:Qt},volumetricCausticDrift:{id:"volumetricCausticDrift",label:"Volumetric Caustic Drift",requiresWebGL:!0,component:pa},chromaticRibbonLattice:{id:"chromaticRibbonLattice",label:"Chromatic Ribbon Lattice",requiresWebGL:!0,component:oa},volumetricBiofield:{id:"volumetricBiofield",label:"Volumetric Biofield",requiresWebGL:!0,component:ha}},ma="bioticParticles",va=({effectId:e,quality:t,interactionMode:a="medium",styleSeed:n=17,className:o,preset:d,palette:s,flowStrength:l})=>{const[i,f]=H.useState(!1);H.useEffect(()=>{const v=window.matchMedia("(prefers-reduced-motion: reduce)");f(v.matches);const w=b=>{f(b.matches)};return v.addEventListener("change",w),()=>{v.removeEventListener("change",w)}},[]);const u=H.useMemo(()=>ta(),[]),c=H.useMemo(()=>Zt(t),[t]),h=ct[e??ma],g=(h.requiresWebGL&&!u?ct.bioticParticles:h).component;return ge.jsx(g,{quality:c,interactionMode:a,styleSeed:n,reducedMotion:i,className:o??"pointer-events-none absolute inset-0 h-full w-full",preset:d,palette:s,flowStrength:l})},Sa=({effectId:e,quality:t,interactionMode:a="medium",styleSeed:n=17,className:o,preset:d,palette:s,flowStrength:l})=>{const i=e??(d!==void 0||s!==void 0||l!==void 0?"bioticParticles":void 0);return ge.jsx(va,{effectId:i,quality:t,interactionMode:a,styleSeed:n,className:o,preset:d,palette:s,flowStrength:l})},ga=(e,t,a)=>Math.min(a,Math.max(t,e)),Ma=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&apos;"),xa=e=>{const t=e.trim().split(/\s+/).filter(Boolean);return t.length===0?"PR":t.length===1?t[0].slice(0,2).toUpperCase()||"PR":`${t[0][0]}${t[1][0]}`.toUpperCase()},ba=(e,t,a)=>{const n=Ma(xa(e));return`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96' fill='none'>
    <defs>
      <linearGradient id='monogramBg' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${t}' stop-opacity='0.92'/>
        <stop offset='100%' stop-color='${a.mid}' stop-opacity='0.92'/>
      </linearGradient>
    </defs>
    <rect x='8' y='8' width='80' height='80' rx='24' fill='url(#monogramBg)'/>
    <rect x='13' y='13' width='70' height='70' rx='20' stroke='${a.line}' stroke-opacity='0.55'/>
    <text x='48' y='58' text-anchor='middle' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='30' font-weight='700' fill='${a.line}'>${n}</text>
  </svg>`},we=(e,t,a)=>`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96' fill='none'>
  <rect x='8' y='8' width='80' height='80' rx='24' fill='${t.bright}' fill-opacity='0.92'/>
  <rect x='8' y='8' width='80' height='80' rx='24' stroke='${e}' stroke-opacity='0.42' stroke-width='2'/>
  <g stroke='${e}' fill='none' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'>
    ${a}
  </g>
</svg>`,ye={deck:(e,t)=>we(e,t,"<rect x='26' y='24' width='44' height='26' rx='8'/><rect x='22' y='40' width='52' height='30' rx='9' opacity='0.88'/><path d='M48 28v38'/><path d='M34 58h28'/>"),lens:(e,t)=>we(e,t,"<circle cx='46' cy='46' r='16'/><circle cx='46' cy='46' r='8' opacity='0.78'/><path d='M58 58 72 72'/><path d='M24 72c8-7 14-8 22-8' opacity='0.64'/>"),timeline:(e,t)=>we(e,t,`<path d='M18 28h60'/><path d='M18 48h60'/><path d='M18 68h60'/><circle cx='32' cy='28' r='4' fill='${e}'/><circle cx='58' cy='48' r='4' fill='${e}'/><circle cx='42' cy='68' r='4' fill='${e}'/>`),neural:(e,t)=>we(e,t,`<circle cx='30' cy='32' r='4' fill='${e}'/><circle cx='62' cy='30' r='4' fill='${e}'/><circle cx='28' cy='62' r='4' fill='${e}'/><circle cx='64' cy='62' r='4' fill='${e}'/><path d='M30 32 62 30 64 62 28 62 30 32'/><path d='M30 32 64 62'/><path d='M62 30 28 62'/>`),dashboard:(e,t)=>we(e,t,"<rect x='22' y='24' width='52' height='44' rx='10'/><path d='M30 60v-8'/><path d='M40 60V44'/><path d='M50 60V36'/><path d='M60 60V48'/><path d='M24 72h48' opacity='0.7'/>")},te=(e,t)=>`data:image/svg+xml;utf8,${encodeURIComponent(`
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
  `)}`,Ye={dateLabel:"TBD",status:"Active",popoutIntensity:1},Pa=e=>{var a,n;const t=e.front;return{dateLabel:((a=t.dateLabel)==null?void 0:a.trim())||Ye.dateLabel,status:t.status??Ye.status,iconSvg:((n=t.iconSvg)==null?void 0:n.trim())||ba(e.title,e.accent,e.palette),frontFamily:t.frontFamily,popoutPreset:t.popoutPreset,popoutIntensity:ga(t.popoutIntensity??Ye.popoutIntensity,.45,1.9)}},Ca=[{id:"portfolio-3d",title:"Projects",subtitle:"Ideas realized.",summary:"A collection of my favorite projects, experiments, and prototypes.",details:"Built reusable scene primitives, transition orchestration, and card-based storytelling blocks to keep animation logic composable across pages.",tags:["React","Framer Motion","Architecture"],accent:"#ffd608",palette:{deep:"#8a6b00",mid:"#d4a800",bright:"#fff8e0",line:"#fffdf2"},media:[te("#e2e8f0","#cbd5e1"),te("#1f5fd8","#1947a6")],links:[{label:"Live Site",href:"#"},{label:"Source",href:"#"}],front:{dateLabel:"2026",status:"Active",frontFamily:"atlas",popoutPreset:"orbitalCore",popoutIntensity:1.15,iconSvg:ye.deck("#ffd608",{deep:"#8a6b00",mid:"#d4a800",bright:"#fff8e0",line:"#fffdf2"})}},{id:"vision-lab",title:"Vision Lab",subtitle:"3D + Graphics Experiments",summary:"Interactive visual prototypes focused on depth, motion, and tactile interfaces.",details:"Explored lightweight approaches to visual depth where real-time 3D is used selectively and performance-first fallbacks are available for mobile devices.",tags:["Three.js","R3F","Performance"],accent:"#08c5ff",palette:{deep:"#004a6b",mid:"#0891b2",bright:"#e0f7ff",line:"#f0fbff"},media:[te("#1b2a44","#132339"),te("#0ea390","#0f6f67")],links:[{label:"Case Study",href:"#"},{label:"Prototype",href:"#"}],front:{dateLabel:"2025",status:"In Progress",frontFamily:"signal",popoutPreset:"nodeConstellation",popoutIntensity:1.24,iconSvg:ye.lens("#08c5ff",{deep:"#004a6b",mid:"#0891b2",bright:"#e0f7ff",line:"#f0fbff"})}},{id:"timeline-book",title:"Life Timeline Book",subtitle:"About Page Prototype",summary:"A layered pop-up-book timeline concept with foreground, midground, and background scenes.",details:"Designed a card scene graph that can load decade-based snapshots, crossfade layered assets, and support gradual updates without rewriting animation timelines.",tags:["Storytelling","Timeline","Design Systems"],accent:"#08ff94",palette:{deep:"#004d2d",mid:"#06b66f",bright:"#e0fff0",line:"#f0fff8"},media:[te("#b91c1c","#7f1d1d"),te("#4f46e5","#312e81")],links:[{label:"Read Notes",href:"#"},{label:"Design Doc",href:"#"}],front:{dateLabel:"Prototype",status:"Active",frontFamily:"lattice",popoutPreset:"ribbonArc",popoutIntensity:1.05,iconSvg:ye.timeline("#08ff94",{deep:"#004d2d",mid:"#06b66f",bright:"#e0fff0",line:"#f0fff8"})}},{id:"neural-search",title:"Neural Search Engine",subtitle:"Semantic Retrieval System",summary:"A vector-based search tool that understands intent, not just keywords.",details:"Built an embeddings pipeline with nearest-neighbor retrieval, query expansion, and a lightweight React front-end. Optimised for sub-100ms latency on commodity hardware.",tags:["Python","FAISS","NLP","React"],accent:"#a855f7",palette:{deep:"#4c1d95",mid:"#7c3aed",bright:"#f3e8ff",line:"#faf5ff"},media:[te("#4c1d95","#6d28d9"),te("#7c3aed","#a78bfa")],links:[{label:"Demo",href:"#"},{label:"Source",href:"#"}],front:{dateLabel:"2024",status:"Paused",frontFamily:"forge",popoutPreset:"dataSpines",popoutIntensity:1,iconSvg:ye.neural("#a855f7",{deep:"#4c1d95",mid:"#7c3aed",bright:"#f3e8ff",line:"#faf5ff"})}},{id:"homelab-dashboard",title:"Homelab Dashboard",subtitle:"Infrastructure Monitor",summary:"A real-time dashboard for self-hosted services, container health, and network metrics.",details:"Aggregates Prometheus metrics, Docker container states, and uptime checks into a single glanceable UI with WebSocket-driven live updates and alerting hooks.",tags:["TypeScript","WebSockets","Docker","Grafana"],accent:"#f97316",palette:{deep:"#7c2d12",mid:"#ea580c",bright:"#fff7ed",line:"#fffbf5"},media:[te("#7c2d12","#c2410c"),te("#ea580c","#fb923c")],links:[{label:"Live Panel",href:"#"},{label:"Source",href:"#"}],front:{dateLabel:"2026",status:"Active",frontFamily:"signal",popoutPreset:"pillarArray",popoutIntensity:1.18,iconSvg:ye.dashboard("#f97316",{deep:"#7c2d12",mid:"#ea580c",bright:"#fff7ed",line:"#fffbf5"})}}];export{Sa as D,ma as d,Ca as p,Pa as r};
