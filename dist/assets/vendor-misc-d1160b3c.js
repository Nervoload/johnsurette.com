import{r as D}from"./vendor-react-42df3ce4.js";import{R as Gn,I as Hn,F as ct,a as Ve,b as Y,W as qn,B as qe,S as Xt,V as k,c as Xn,U as ut,d as ft,e as Yn,M as $n,f as ce,g as Zn,h as Jn,L as Qn}from"./vendor-three-core-f6c6daec.js";function Sr(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function es(e,t){e.indexOf(t)===-1&&e.push(t)}function ts(e,t){const n=e.indexOf(t);n>-1&&e.splice(n,1)}const X=(e,t,n)=>n>t?t:n<e?e:n;let Tr=()=>{},Xe=()=>{};const oe={},ns=e=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e);function Yt(e){return typeof e=="object"&&e!==null}const ss=e=>/^0[^.\s]+$/u.test(e);function Ye(e){let t;return()=>(t===void 0&&(t=e()),t)}const ee=e=>e,is=(e,t)=>n=>t(e(n)),$e=(...e)=>e.reduce(is),$t=(e,t,n)=>{const s=t-e;return s===0?1:(n-e)/s};class rs{constructor(){this.subscriptions=[]}add(t){return es(this.subscriptions,t),()=>ts(this.subscriptions,t)}notify(t,n,s){const i=this.subscriptions.length;if(i)if(i===1)this.subscriptions[0](t,n,s);else for(let r=0;r<i;r++){const o=this.subscriptions[r];o&&o(t,n,s)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}}const te=e=>e*1e3,I=e=>e/1e3;function Zt(e,t){return t?e*(1e3/t):0}const Jt=(e,t,n)=>(((1-3*n+3*t)*e+(3*n-6*t))*e+3*t)*e,os=1e-7,as=12;function ls(e,t,n,s,i){let r,o,a=0;do o=t+(n-t)/2,r=Jt(o,s,i)-e,r>0?n=o:t=o;while(Math.abs(r)>os&&++a<as);return o}function ue(e,t,n,s){if(e===t&&n===s)return ee;const i=r=>ls(r,0,1,e,n);return r=>r===0||r===1?r:Jt(i(r),t,s)}const Qt=e=>t=>t<=.5?e(2*t)/2:(2-e(2*(1-t)))/2,en=e=>t=>1-e(1-t),tn=ue(.33,1.53,.69,.99),Ze=en(tn),nn=Qt(Ze),sn=e=>(e*=2)<1?.5*Ze(e):.5*(2-Math.pow(2,-10*(e-1))),Je=e=>1-Math.sin(Math.acos(e)),cs=en(Je),rn=Qt(Je),us=ue(.42,0,1,1),fs=ue(0,0,.58,1),on=ue(.42,0,.58,1),ds=e=>Array.isArray(e)&&typeof e[0]!="number",an=e=>Array.isArray(e)&&typeof e[0]=="number",hs={linear:ee,easeIn:us,easeInOut:on,easeOut:fs,circIn:Je,circInOut:rn,circOut:cs,backIn:Ze,backInOut:nn,backOut:tn,anticipate:sn},ps=e=>typeof e=="string",dt=e=>{if(an(e)){Xe(e.length===4);const[t,n,s,i]=e;return ue(t,n,s,i)}else if(ps(e))return hs[e];return e},he=["setup","read","resolveKeyframes","preUpdate","update","preRender","render","postRender"],ht={value:null,addProjectionMetrics:null};function ms(e,t){let n=new Set,s=new Set,i=!1,r=!1;const o=new WeakSet;let a={delta:0,timestamp:0,isProcessing:!1},l=0;function c(u){o.has(u)&&(f.schedule(u),e()),l++,u(a)}const f={schedule:(u,d=!1,m=!1)=>{const g=m&&i?n:s;return d&&o.add(u),g.has(u)||g.add(u),u},cancel:u=>{s.delete(u),o.delete(u)},process:u=>{if(a=u,i){r=!0;return}i=!0,[n,s]=[s,n],n.forEach(c),t&&ht.value&&ht.value.frameloop[t].push(l),l=0,n.clear(),i=!1,r&&(r=!1,f.process(u))}};return f}const gs=40;function ln(e,t){let n=!1,s=!0;const i={delta:0,timestamp:0,isProcessing:!1},r=()=>n=!0,o=he.reduce((v,b)=>(v[b]=ms(r,t?b:void 0),v),{}),{setup:a,read:l,resolveKeyframes:c,preUpdate:f,update:u,preRender:d,render:m,postRender:x}=o,g=()=>{const v=oe.useManualTiming?i.timestamp:performance.now();n=!1,oe.useManualTiming||(i.delta=s?1e3/60:Math.max(Math.min(v-i.timestamp,gs),1)),i.timestamp=v,i.isProcessing=!0,a.process(i),l.process(i),c.process(i),f.process(i),u.process(i),d.process(i),m.process(i),x.process(i),i.isProcessing=!1,n&&t&&(s=!1,e(g))},w=()=>{n=!0,s=!0,i.isProcessing||e(g)};return{schedule:he.reduce((v,b)=>{const p=o[b];return v[b]=(E,P=!1,y=!1)=>(n||w(),p.schedule(E,P,y)),v},{}),cancel:v=>{for(let b=0;b<he.length;b++)o[he[b]].cancel(v)},state:i,steps:o}}const{schedule:Q,cancel:cn,state:Se,steps:Er}=ln(typeof requestAnimationFrame<"u"?requestAnimationFrame:ee,!0);let ve;function ys(){ve=void 0}const F={now:()=>(ve===void 0&&F.set(Se.isProcessing||oe.useManualTiming?Se.timestamp:performance.now()),ve),set:e=>{ve=e,queueMicrotask(ys)}},un=e=>t=>typeof t=="string"&&t.startsWith(e),Ar=un("--"),vs=un("var(--"),Qe=e=>vs(e)?bs.test(e.split("/*")[0].trim()):!1,bs=/var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu,ne={test:e=>typeof e=="number",parse:parseFloat,transform:e=>e},ae={...ne,transform:e=>X(0,1,e)},pe={...ne,default:1},ie=e=>Math.round(e*1e5)/1e5,et=/-?(?:\d+(?:\.\d+)?|\.\d+)/gu;function ws(e){return e==null}const xs=/^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,tt=(e,t)=>n=>!!(typeof n=="string"&&xs.test(n)&&n.startsWith(e)||t&&!ws(n)&&Object.prototype.hasOwnProperty.call(n,t)),fn=(e,t,n)=>s=>{if(typeof s!="string")return s;const[i,r,o,a]=s.match(et);return{[e]:parseFloat(i),[t]:parseFloat(r),[n]:parseFloat(o),alpha:a!==void 0?parseFloat(a):1}},Ss=e=>X(0,255,e),_e={...ne,transform:e=>Math.round(Ss(e))},K={test:tt("rgb","red"),parse:fn("red","green","blue"),transform:({red:e,green:t,blue:n,alpha:s=1})=>"rgba("+_e.transform(e)+", "+_e.transform(t)+", "+_e.transform(n)+", "+ie(ae.transform(s))+")"};function Ts(e){let t="",n="",s="",i="";return e.length>5?(t=e.substring(1,3),n=e.substring(3,5),s=e.substring(5,7),i=e.substring(7,9)):(t=e.substring(1,2),n=e.substring(2,3),s=e.substring(3,4),i=e.substring(4,5),t+=t,n+=n,s+=s,i+=i),{red:parseInt(t,16),green:parseInt(n,16),blue:parseInt(s,16),alpha:i?parseInt(i,16)/255:1}}const Be={test:tt("#"),parse:Ts,transform:K.transform},fe=e=>({test:t=>typeof t=="string"&&t.endsWith(e)&&t.split(" ").length===1,parse:parseFloat,transform:t=>`${t}${e}`}),N=fe("deg"),J=fe("%"),h=fe("px"),Es=fe("vh"),As=fe("vw"),pt=(()=>({...J,parse:e=>J.parse(e)/100,transform:e=>J.transform(e*100)}))(),$={test:tt("hsl","hue"),parse:fn("hue","saturation","lightness"),transform:({hue:e,saturation:t,lightness:n,alpha:s=1})=>"hsla("+Math.round(e)+", "+J.transform(ie(t))+", "+J.transform(ie(n))+", "+ie(ae.transform(s))+")"},A={test:e=>K.test(e)||Be.test(e)||$.test(e),parse:e=>K.test(e)?K.parse(e):$.test(e)?$.parse(e):Be.parse(e),transform:e=>typeof e=="string"?e:e.hasOwnProperty("red")?K.transform(e):$.transform(e),getAnimatableNone:e=>{const t=A.parse(e);return t.alpha=0,A.transform(t)}},Ms=/(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;function _s(e){var t,n;return isNaN(e)&&typeof e=="string"&&(((t=e.match(et))==null?void 0:t.length)||0)+(((n=e.match(Ms))==null?void 0:n.length)||0)>0}const dn="number",hn="color",Os="var",Ps="var(",mt="${}",Ds=/var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;function le(e){const t=e.toString(),n=[],s={color:[],number:[],var:[]},i=[];let r=0;const a=t.replace(Ds,l=>(A.test(l)?(s.color.push(r),i.push(hn),n.push(A.parse(l))):l.startsWith(Ps)?(s.var.push(r),i.push(Os),n.push(l)):(s.number.push(r),i.push(dn),n.push(parseFloat(l))),++r,mt)).split(mt);return{values:n,split:a,indexes:s,types:i}}function pn(e){return le(e).values}function mn(e){const{split:t,types:n}=le(e),s=t.length;return i=>{let r="";for(let o=0;o<s;o++)if(r+=t[o],i[o]!==void 0){const a=n[o];a===dn?r+=ie(i[o]):a===hn?r+=A.transform(i[o]):r+=i[o]}return r}}const Ls=e=>typeof e=="number"?0:A.test(e)?A.getAnimatableNone(e):e;function Cs(e){const t=pn(e);return mn(e)(t.map(Ls))}const de={test:_s,parse:pn,createTransformer:mn,getAnimatableNone:Cs};function Oe(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*(2/3-n)*6:e}function Rs({hue:e,saturation:t,lightness:n,alpha:s}){e/=360,t/=100,n/=100;let i=0,r=0,o=0;if(!t)i=r=o=n;else{const a=n<.5?n*(1+t):n+t-n*t,l=2*n-a;i=Oe(l,a,e+1/3),r=Oe(l,a,e),o=Oe(l,a,e-1/3)}return{red:Math.round(i*255),green:Math.round(r*255),blue:Math.round(o*255),alpha:s}}function Te(e,t){return n=>n>0?t:e}const Me=(e,t,n)=>e+(t-e)*n,Pe=(e,t,n)=>{const s=e*e,i=n*(t*t-s)+s;return i<0?0:Math.sqrt(i)},Fs=[Be,K,$],Vs=e=>Fs.find(t=>t.test(e));function gt(e){const t=Vs(e);if(!t)return!1;let n=t.parse(e);return t===$&&(n=Rs(n)),n}const yt=(e,t)=>{const n=gt(e),s=gt(t);if(!n||!s)return Te(e,t);const i={...n};return r=>(i.red=Pe(n.red,s.red,r),i.green=Pe(n.green,s.green,r),i.blue=Pe(n.blue,s.blue,r),i.alpha=Me(n.alpha,s.alpha,r),K.transform(i))},Ue=new Set(["none","hidden"]);function Bs(e,t){return Ue.has(e)?n=>n<=0?e:t:n=>n>=1?t:e}function Us(e,t){return n=>Me(e,t,n)}function nt(e){return typeof e=="number"?Us:typeof e=="string"?Qe(e)?Te:A.test(e)?yt:ks:Array.isArray(e)?gn:typeof e=="object"?A.test(e)?yt:zs:Te}function gn(e,t){const n=[...e],s=n.length,i=e.map((r,o)=>nt(r)(r,t[o]));return r=>{for(let o=0;o<s;o++)n[o]=i[o](r);return n}}function zs(e,t){const n={...e,...t},s={};for(const i in n)e[i]!==void 0&&t[i]!==void 0&&(s[i]=nt(e[i])(e[i],t[i]));return i=>{for(const r in s)n[r]=s[r](i);return n}}function Is(e,t){const n=[],s={color:0,var:0,number:0};for(let i=0;i<t.values.length;i++){const r=t.types[i],o=e.indexes[r][s[r]],a=e.values[o]??0;n[i]=a,s[r]++}return n}const ks=(e,t)=>{const n=de.createTransformer(t),s=le(e),i=le(t);return s.indexes.var.length===i.indexes.var.length&&s.indexes.color.length===i.indexes.color.length&&s.indexes.number.length>=i.indexes.number.length?Ue.has(e)&&!i.values.length||Ue.has(t)&&!s.values.length?Bs(e,t):$e(gn(Is(s,i),i.values),n):Te(e,t)};function yn(e,t,n){return typeof e=="number"&&typeof t=="number"&&typeof n=="number"?Me(e,t,n):nt(e)(e,t)}const Ns=e=>{const t=({timestamp:n})=>e(n);return{start:(n=!0)=>Q.update(t,n),stop:()=>cn(t),now:()=>Se.isProcessing?Se.timestamp:F.now()}},vn=(e,t,n=10)=>{let s="";const i=Math.max(Math.round(t/n),2);for(let r=0;r<i;r++)s+=Math.round(e(r/(i-1))*1e4)/1e4+", ";return`linear(${s.substring(0,s.length-2)})`},Ee=2e4;function st(e){let t=0;const n=50;let s=e.next(t);for(;!s.done&&t<Ee;)t+=n,s=e.next(t);return t>=Ee?1/0:t}function Ws(e,t=100,n){const s=n({...e,keyframes:[0,t]}),i=Math.min(st(s),Ee);return{type:"keyframes",ease:r=>s.next(i*r).value/t,duration:I(i)}}const Ks=5;function bn(e,t,n){const s=Math.max(t-Ks,0);return Zt(n-e(s),t-s)}const T={stiffness:100,damping:10,mass:1,velocity:0,duration:800,bounce:.3,visualDuration:.3,restSpeed:{granular:.01,default:2},restDelta:{granular:.005,default:.5},minDuration:.01,maxDuration:10,minDamping:.05,maxDamping:1},De=.001;function js({duration:e=T.duration,bounce:t=T.bounce,velocity:n=T.velocity,mass:s=T.mass}){let i,r,o=1-t;o=X(T.minDamping,T.maxDamping,o),e=X(T.minDuration,T.maxDuration,I(e)),o<1?(i=c=>{const f=c*o,u=f*e,d=f-n,m=ze(c,o),x=Math.exp(-u);return De-d/m*x},r=c=>{const u=c*o*e,d=u*n+n,m=Math.pow(o,2)*Math.pow(c,2)*e,x=Math.exp(-u),g=ze(Math.pow(c,2),o);return(-i(c)+De>0?-1:1)*((d-m)*x)/g}):(i=c=>{const f=Math.exp(-c*e),u=(c-n)*e+1;return-De+f*u},r=c=>{const f=Math.exp(-c*e),u=(n-c)*(e*e);return f*u});const a=5/e,l=Hs(i,r,a);if(e=te(e),isNaN(l))return{stiffness:T.stiffness,damping:T.damping,duration:e};{const c=Math.pow(l,2)*s;return{stiffness:c,damping:o*2*Math.sqrt(s*c),duration:e}}}const Gs=12;function Hs(e,t,n){let s=n;for(let i=1;i<Gs;i++)s=s-e(s)/t(s);return s}function ze(e,t){return e*Math.sqrt(1-t*t)}const qs=["duration","bounce"],Xs=["stiffness","damping","mass"];function vt(e,t){return t.some(n=>e[n]!==void 0)}function Ys(e){let t={velocity:T.velocity,stiffness:T.stiffness,damping:T.damping,mass:T.mass,isResolvedFromDuration:!1,...e};if(!vt(e,Xs)&&vt(e,qs))if(e.visualDuration){const n=e.visualDuration,s=2*Math.PI/(n*1.2),i=s*s,r=2*X(.05,1,1-(e.bounce||0))*Math.sqrt(i);t={...t,mass:T.mass,stiffness:i,damping:r}}else{const n=js(e);t={...t,...n,mass:T.mass},t.isResolvedFromDuration=!0}return t}function Ae(e=T.visualDuration,t=T.bounce){const n=typeof e!="object"?{visualDuration:e,keyframes:[0,1],bounce:t}:e;let{restSpeed:s,restDelta:i}=n;const r=n.keyframes[0],o=n.keyframes[n.keyframes.length-1],a={done:!1,value:r},{stiffness:l,damping:c,mass:f,duration:u,velocity:d,isResolvedFromDuration:m}=Ys({...n,velocity:-I(n.velocity||0)}),x=d||0,g=c/(2*Math.sqrt(l*f)),w=o-r,S=I(Math.sqrt(l/f)),L=Math.abs(w)<5;s||(s=L?T.restSpeed.granular:T.restSpeed.default),i||(i=L?T.restDelta.granular:T.restDelta.default);let v;if(g<1){const p=ze(S,g);v=E=>{const P=Math.exp(-g*S*E);return o-P*((x+g*S*w)/p*Math.sin(p*E)+w*Math.cos(p*E))}}else if(g===1)v=p=>o-Math.exp(-S*p)*(w+(x+S*w)*p);else{const p=S*Math.sqrt(g*g-1);v=E=>{const P=Math.exp(-g*S*E),y=Math.min(p*E,300);return o-P*((x+g*S*w)*Math.sinh(y)+p*w*Math.cosh(y))/p}}const b={calculatedDuration:m&&u||null,next:p=>{const E=v(p);if(m)a.done=p>=u;else{let P=p===0?x:0;g<1&&(P=p===0?te(x):bn(v,p,E));const y=Math.abs(P)<=s,C=Math.abs(o-E)<=i;a.done=y&&C}return a.value=a.done?o:E,a},toString:()=>{const p=Math.min(st(b),Ee),E=vn(P=>b.next(p*P).value,p,30);return p+"ms "+E},toTransition:()=>{}};return b}Ae.applyToOptions=e=>{const t=Ws(e,100,Ae);return e.ease=t.ease,e.duration=te(t.duration),e.type="keyframes",e};function Ie({keyframes:e,velocity:t=0,power:n=.8,timeConstant:s=325,bounceDamping:i=10,bounceStiffness:r=500,modifyTarget:o,min:a,max:l,restDelta:c=.5,restSpeed:f}){const u=e[0],d={done:!1,value:u},m=y=>a!==void 0&&y<a||l!==void 0&&y>l,x=y=>a===void 0?l:l===void 0||Math.abs(a-y)<Math.abs(l-y)?a:l;let g=n*t;const w=u+g,S=o===void 0?w:o(w);S!==w&&(g=S-u);const L=y=>-g*Math.exp(-y/s),v=y=>S+L(y),b=y=>{const C=L(y),z=v(y);d.done=Math.abs(C)<=c,d.value=d.done?S:z};let p,E;const P=y=>{m(d.value)&&(p=y,E=Ae({keyframes:[d.value,x(d.value)],velocity:bn(v,y,d.value),damping:i,stiffness:r,restDelta:c,restSpeed:f}))};return P(0),{calculatedDuration:null,next:y=>{let C=!1;return!E&&p===void 0&&(C=!0,b(y),P(y)),p!==void 0&&y>=p?E.next(y-p):(!C&&b(y),d)}}}function $s(e,t,n){const s=[],i=n||oe.mix||yn,r=e.length-1;for(let o=0;o<r;o++){let a=i(e[o],e[o+1]);if(t){const l=Array.isArray(t)?t[o]||ee:t;a=$e(l,a)}s.push(a)}return s}function wn(e,t,{clamp:n=!0,ease:s,mixer:i}={}){const r=e.length;if(Xe(r===t.length),r===1)return()=>t[0];if(r===2&&t[0]===t[1])return()=>t[1];const o=e[0]===e[1];e[0]>e[r-1]&&(e=[...e].reverse(),t=[...t].reverse());const a=$s(t,s,i),l=a.length,c=f=>{if(o&&f<e[0])return t[0];let u=0;if(l>1)for(;u<e.length-2&&!(f<e[u+1]);u++);const d=$t(e[u],e[u+1],f);return a[u](d)};return n?f=>c(X(e[0],e[r-1],f)):c}function Zs(e,t){const n=e[e.length-1];for(let s=1;s<=t;s++){const i=$t(0,t,s);e.push(Me(n,1,i))}}function Js(e){const t=[0];return Zs(t,e.length-1),t}function Qs(e,t){return e.map(n=>n*t)}function ei(e,t){return e.map(()=>t||on).splice(0,e.length-1)}function re({duration:e=300,keyframes:t,times:n,ease:s="easeInOut"}){const i=ds(s)?s.map(dt):dt(s),r={done:!1,value:t[0]},o=Qs(n&&n.length===t.length?n:Js(t),e),a=wn(o,t,{ease:Array.isArray(i)?i:ei(t,i)});return{calculatedDuration:e,next:l=>(r.value=a(l),r.done=l>=e,r)}}const ti=e=>e!==null;function it(e,{repeat:t,repeatType:n="loop"},s,i=1){const r=e.filter(ti),a=i<0||t&&n!=="loop"&&t%2===1?0:r.length-1;return!a||s===void 0?r[a]:s}const ni={decay:Ie,inertia:Ie,tween:re,keyframes:re,spring:Ae};function xn(e){typeof e.type=="string"&&(e.type=ni[e.type])}class rt{constructor(){this.updateFinished()}get finished(){return this._finished}updateFinished(){this._finished=new Promise(t=>{this.resolve=t})}notifyFinished(){this.resolve()}then(t,n){return this.finished.then(t,n)}}const si=e=>e/100;class ot extends rt{constructor(t){super(),this.state="idle",this.startTime=null,this.isStopped=!1,this.currentTime=0,this.holdTime=null,this.playbackSpeed=1,this.stop=()=>{var s,i;const{motionValue:n}=this.options;n&&n.updatedAt!==F.now()&&this.tick(F.now()),this.isStopped=!0,this.state!=="idle"&&(this.teardown(),(i=(s=this.options).onStop)==null||i.call(s))},this.options=t,this.initAnimation(),this.play(),t.autoplay===!1&&this.pause()}initAnimation(){const{options:t}=this;xn(t);const{type:n=re,repeat:s=0,repeatDelay:i=0,repeatType:r,velocity:o=0}=t;let{keyframes:a}=t;const l=n||re;l!==re&&typeof a[0]!="number"&&(this.mixKeyframes=$e(si,yn(a[0],a[1])),a=[0,100]);const c=l({...t,keyframes:a});r==="mirror"&&(this.mirroredGenerator=l({...t,keyframes:[...a].reverse(),velocity:-o})),c.calculatedDuration===null&&(c.calculatedDuration=st(c));const{calculatedDuration:f}=c;this.calculatedDuration=f,this.resolvedDuration=f+i,this.totalDuration=this.resolvedDuration*(s+1)-i,this.generator=c}updateTime(t){const n=Math.round(t-this.startTime)*this.playbackSpeed;this.holdTime!==null?this.currentTime=this.holdTime:this.currentTime=n}tick(t,n=!1){const{generator:s,totalDuration:i,mixKeyframes:r,mirroredGenerator:o,resolvedDuration:a,calculatedDuration:l}=this;if(this.startTime===null)return s.next(0);const{delay:c=0,keyframes:f,repeat:u,repeatType:d,repeatDelay:m,type:x,onUpdate:g,finalKeyframe:w}=this.options;this.speed>0?this.startTime=Math.min(this.startTime,t):this.speed<0&&(this.startTime=Math.min(t-i/this.speed,this.startTime)),n?this.currentTime=t:this.updateTime(t);const S=this.currentTime-c*(this.playbackSpeed>=0?1:-1),L=this.playbackSpeed>=0?S<0:S>i;this.currentTime=Math.max(S,0),this.state==="finished"&&this.holdTime===null&&(this.currentTime=i);let v=this.currentTime,b=s;if(u){const y=Math.min(this.currentTime,i)/a;let C=Math.floor(y),z=y%1;!z&&y>=1&&(z=1),z===1&&C--,C=Math.min(C,u+1),!!(C%2)&&(d==="reverse"?(z=1-z,m&&(z-=m/a)):d==="mirror"&&(b=o)),v=X(0,1,z)*a}const p=L?{done:!1,value:f[0]}:b.next(v);r&&(p.value=r(p.value));let{done:E}=p;!L&&l!==null&&(E=this.playbackSpeed>=0?this.currentTime>=i:this.currentTime<=0);const P=this.holdTime===null&&(this.state==="finished"||this.state==="running"&&E);return P&&x!==Ie&&(p.value=it(f,this.options,w,this.speed)),g&&g(p.value),P&&this.finish(),p}then(t,n){return this.finished.then(t,n)}get duration(){return I(this.calculatedDuration)}get time(){return I(this.currentTime)}set time(t){var n;t=te(t),this.currentTime=t,this.startTime===null||this.holdTime!==null||this.playbackSpeed===0?this.holdTime=t:this.driver&&(this.startTime=this.driver.now()-t/this.playbackSpeed),(n=this.driver)==null||n.start(!1)}get speed(){return this.playbackSpeed}set speed(t){this.updateTime(F.now());const n=this.playbackSpeed!==t;this.playbackSpeed=t,n&&(this.time=I(this.currentTime))}play(){var i,r;if(this.isStopped)return;const{driver:t=Ns,startTime:n}=this.options;this.driver||(this.driver=t(o=>this.tick(o))),(r=(i=this.options).onPlay)==null||r.call(i);const s=this.driver.now();this.state==="finished"?(this.updateFinished(),this.startTime=s):this.holdTime!==null?this.startTime=s-this.holdTime:this.startTime||(this.startTime=n??s),this.state==="finished"&&this.speed<0&&(this.startTime+=this.calculatedDuration),this.holdTime=null,this.state="running",this.driver.start()}pause(){this.state="paused",this.updateTime(F.now()),this.holdTime=this.currentTime}complete(){this.state!=="running"&&this.play(),this.state="finished",this.holdTime=null}finish(){var t,n;this.notifyFinished(),this.teardown(),this.state="finished",(n=(t=this.options).onComplete)==null||n.call(t)}cancel(){var t,n;this.holdTime=null,this.startTime=0,this.tick(0),this.teardown(),(n=(t=this.options).onCancel)==null||n.call(t)}teardown(){this.state="idle",this.stopDriver(),this.startTime=this.holdTime=null}stopDriver(){this.driver&&(this.driver.stop(),this.driver=void 0)}sample(t){return this.startTime=0,this.tick(t,!0)}attachTimeline(t){var n;return this.options.allowFlatten&&(this.options.type="keyframes",this.options.ease="linear",this.initAnimation()),(n=this.driver)==null||n.stop(),t.observe(this)}}function ii(e){for(let t=1;t<e.length;t++)e[t]??(e[t]=e[t-1])}const j=e=>e*180/Math.PI,ke=e=>{const t=j(Math.atan2(e[1],e[0]));return Ne(t)},ri={x:4,y:5,translateX:4,translateY:5,scaleX:0,scaleY:3,scale:e=>(Math.abs(e[0])+Math.abs(e[3]))/2,rotate:ke,rotateZ:ke,skewX:e=>j(Math.atan(e[1])),skewY:e=>j(Math.atan(e[2])),skew:e=>(Math.abs(e[1])+Math.abs(e[2]))/2},Ne=e=>(e=e%360,e<0&&(e+=360),e),bt=ke,wt=e=>Math.sqrt(e[0]*e[0]+e[1]*e[1]),xt=e=>Math.sqrt(e[4]*e[4]+e[5]*e[5]),oi={x:12,y:13,z:14,translateX:12,translateY:13,translateZ:14,scaleX:wt,scaleY:xt,scale:e=>(wt(e)+xt(e))/2,rotateX:e=>Ne(j(Math.atan2(e[6],e[5]))),rotateY:e=>Ne(j(Math.atan2(-e[2],e[0]))),rotateZ:bt,rotate:bt,skewX:e=>j(Math.atan(e[4])),skewY:e=>j(Math.atan(e[1])),skew:e=>(Math.abs(e[1])+Math.abs(e[4]))/2};function St(e){return e.includes("scale")?1:0}function We(e,t){if(!e||e==="none")return St(t);const n=e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);let s,i;if(n)s=oi,i=n;else{const a=e.match(/^matrix\(([-\d.e\s,]+)\)$/u);s=ri,i=a}if(!i)return St(t);const r=s[t],o=i[1].split(",").map(ai);return typeof r=="function"?r(o):o[r]}const Mr=(e,t)=>{const{transform:n="none"}=getComputedStyle(e);return We(n,t)};function ai(e){return parseFloat(e.trim())}const at=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],_r=(()=>new Set(at))(),Tt=e=>e===ne||e===h,li=new Set(["x","y","z"]),ci=at.filter(e=>!li.has(e));function ui(e){const t=[];return ci.forEach(n=>{const s=e.getValue(n);s!==void 0&&(t.push([n,s.get()]),s.set(n.startsWith("scale")?1:0))}),t}const G={width:({x:e},{paddingLeft:t="0",paddingRight:n="0"})=>e.max-e.min-parseFloat(t)-parseFloat(n),height:({y:e},{paddingTop:t="0",paddingBottom:n="0"})=>e.max-e.min-parseFloat(t)-parseFloat(n),top:(e,{top:t})=>parseFloat(t),left:(e,{left:t})=>parseFloat(t),bottom:({y:e},{top:t})=>parseFloat(t)+(e.max-e.min),right:({x:e},{left:t})=>parseFloat(t)+(e.max-e.min),x:(e,{transform:t})=>We(t,"x"),y:(e,{transform:t})=>We(t,"y")};G.translateX=G.x;G.translateY=G.y;const H=new Set;let Ke=!1,je=!1,Ge=!1;function Sn(){if(je){const e=Array.from(H).filter(s=>s.needsMeasurement),t=new Set(e.map(s=>s.element)),n=new Map;t.forEach(s=>{const i=ui(s);i.length&&(n.set(s,i),s.render())}),e.forEach(s=>s.measureInitialState()),t.forEach(s=>{s.render();const i=n.get(s);i&&i.forEach(([r,o])=>{var a;(a=s.getValue(r))==null||a.set(o)})}),e.forEach(s=>s.measureEndState()),e.forEach(s=>{s.suspendedScrollY!==void 0&&window.scrollTo(0,s.suspendedScrollY)})}je=!1,Ke=!1,H.forEach(e=>e.complete(Ge)),H.clear()}function Tn(){H.forEach(e=>{e.readKeyframes(),e.needsMeasurement&&(je=!0)})}function fi(){Ge=!0,Tn(),Sn(),Ge=!1}class En{constructor(t,n,s,i,r,o=!1){this.state="pending",this.isAsync=!1,this.needsMeasurement=!1,this.unresolvedKeyframes=[...t],this.onComplete=n,this.name=s,this.motionValue=i,this.element=r,this.isAsync=o}scheduleResolve(){this.state="scheduled",this.isAsync?(H.add(this),Ke||(Ke=!0,Q.read(Tn),Q.resolveKeyframes(Sn))):(this.readKeyframes(),this.complete())}readKeyframes(){const{unresolvedKeyframes:t,name:n,element:s,motionValue:i}=this;if(t[0]===null){const r=i==null?void 0:i.get(),o=t[t.length-1];if(r!==void 0)t[0]=r;else if(s&&n){const a=s.readValue(n,o);a!=null&&(t[0]=a)}t[0]===void 0&&(t[0]=o),i&&r===void 0&&i.set(t[0])}ii(t)}setFinalKeyframe(){}measureInitialState(){}renderEndStyles(){}measureEndState(){}complete(t=!1){this.state="complete",this.onComplete(this.unresolvedKeyframes,this.finalKeyframe,t),H.delete(this)}cancel(){this.state==="scheduled"&&(H.delete(this),this.state="pending")}resume(){this.state==="pending"&&this.scheduleResolve()}}const di=e=>e.startsWith("--");function hi(e,t,n){di(t)?e.style.setProperty(t,n):e.style[t]=n}const pi=Ye(()=>window.ScrollTimeline!==void 0),mi={};function gi(e,t){const n=Ye(e);return()=>mi[t]??n()}const An=gi(()=>{try{document.createElement("div").animate({opacity:0},{easing:"linear(0, 1)"})}catch{return!1}return!0},"linearEasing"),se=([e,t,n,s])=>`cubic-bezier(${e}, ${t}, ${n}, ${s})`,Et={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",circIn:se([0,.65,.55,1]),circOut:se([.55,0,1,.45]),backIn:se([.31,.01,.66,-.59]),backOut:se([.33,1.53,.69,.99])};function Mn(e,t){if(e)return typeof e=="function"?An()?vn(e,t):"ease-out":an(e)?se(e):Array.isArray(e)?e.map(n=>Mn(n,t)||Et.easeOut):Et[e]}function yi(e,t,n,{delay:s=0,duration:i=300,repeat:r=0,repeatType:o="loop",ease:a="easeOut",times:l}={},c=void 0){const f={[t]:n};l&&(f.offset=l);const u=Mn(a,i);Array.isArray(u)&&(f.easing=u);const d={delay:s,duration:i,easing:Array.isArray(u)?"linear":u,fill:"both",iterations:r+1,direction:o==="reverse"?"alternate":"normal"};return c&&(d.pseudoElement=c),e.animate(f,d)}function _n(e){return typeof e=="function"&&"applyToOptions"in e}function vi({type:e,...t}){return _n(e)&&An()?e.applyToOptions(t):(t.duration??(t.duration=300),t.ease??(t.ease="easeOut"),t)}class bi extends rt{constructor(t){if(super(),this.finishedTime=null,this.isStopped=!1,!t)return;const{element:n,name:s,keyframes:i,pseudoElement:r,allowFlatten:o=!1,finalKeyframe:a,onComplete:l}=t;this.isPseudoElement=!!r,this.allowFlatten=o,this.options=t,Xe(typeof t.type!="string");const c=vi(t);this.animation=yi(n,s,i,c,r),c.autoplay===!1&&this.animation.pause(),this.animation.onfinish=()=>{if(this.finishedTime=this.time,!r){const f=it(i,this.options,a,this.speed);this.updateMotionValue?this.updateMotionValue(f):hi(n,s,f),this.animation.cancel()}l==null||l(),this.notifyFinished()}}play(){this.isStopped||(this.animation.play(),this.state==="finished"&&this.updateFinished())}pause(){this.animation.pause()}complete(){var t,n;(n=(t=this.animation).finish)==null||n.call(t)}cancel(){try{this.animation.cancel()}catch{}}stop(){if(this.isStopped)return;this.isStopped=!0;const{state:t}=this;t==="idle"||t==="finished"||(this.updateMotionValue?this.updateMotionValue():this.commitStyles(),this.isPseudoElement||this.cancel())}commitStyles(){var t,n;this.isPseudoElement||(n=(t=this.animation).commitStyles)==null||n.call(t)}get duration(){var n,s;const t=((s=(n=this.animation.effect)==null?void 0:n.getComputedTiming)==null?void 0:s.call(n).duration)||0;return I(Number(t))}get time(){return I(Number(this.animation.currentTime)||0)}set time(t){this.finishedTime=null,this.animation.currentTime=te(t)}get speed(){return this.animation.playbackRate}set speed(t){t<0&&(this.finishedTime=null),this.animation.playbackRate=t}get state(){return this.finishedTime!==null?"finished":this.animation.playState}get startTime(){return Number(this.animation.startTime)}set startTime(t){this.animation.startTime=t}attachTimeline({timeline:t,observe:n}){var s;return this.allowFlatten&&((s=this.animation.effect)==null||s.updateTiming({easing:"linear"})),this.animation.onfinish=null,t&&pi()?(this.animation.timeline=t,ee):n(this)}}const On={anticipate:sn,backInOut:nn,circInOut:rn};function wi(e){return e in On}function xi(e){typeof e.ease=="string"&&wi(e.ease)&&(e.ease=On[e.ease])}const At=10;class Si extends bi{constructor(t){xi(t),xn(t),super(t),t.startTime&&(this.startTime=t.startTime),this.options=t}updateMotionValue(t){const{motionValue:n,onUpdate:s,onComplete:i,element:r,...o}=this.options;if(!n)return;if(t!==void 0){n.set(t);return}const a=new ot({...o,autoplay:!1}),l=te(this.finishedTime??this.time);n.setWithVelocity(a.sample(l-At).value,a.sample(l).value,At),a.stop()}}const Mt=(e,t)=>t==="zIndex"?!1:!!(typeof e=="number"||Array.isArray(e)||typeof e=="string"&&(de.test(e)||e==="0")&&!e.startsWith("url("));function Ti(e){const t=e[0];if(e.length===1)return!0;for(let n=0;n<e.length;n++)if(e[n]!==t)return!0}function Ei(e,t,n,s){const i=e[0];if(i===null)return!1;if(t==="display"||t==="visibility")return!0;const r=e[e.length-1],o=Mt(i,t),a=Mt(r,t);return!o||!a?!1:Ti(e)||(n==="spring"||_n(n))&&s}function Pn(e){return Yt(e)&&"offsetHeight"in e}const Ai=new Set(["opacity","clipPath","filter","transform"]),Mi=Ye(()=>Object.hasOwnProperty.call(Element.prototype,"animate"));function _i(e){var c;const{motionValue:t,name:n,repeatDelay:s,repeatType:i,damping:r,type:o}=e;if(!Pn((c=t==null?void 0:t.owner)==null?void 0:c.current))return!1;const{onUpdate:a,transformTemplate:l}=t.owner.getProps();return Mi()&&n&&Ai.has(n)&&(n!=="transform"||!l)&&!a&&!s&&i!=="mirror"&&r!==0&&o!=="inertia"}const Oi=40;class Or extends rt{constructor({autoplay:t=!0,delay:n=0,type:s="keyframes",repeat:i=0,repeatDelay:r=0,repeatType:o="loop",keyframes:a,name:l,motionValue:c,element:f,...u}){var x;super(),this.stop=()=>{var g,w;this._animation&&(this._animation.stop(),(g=this.stopTimeline)==null||g.call(this)),(w=this.keyframeResolver)==null||w.cancel()},this.createdAt=F.now();const d={autoplay:t,delay:n,type:s,repeat:i,repeatDelay:r,repeatType:o,name:l,motionValue:c,element:f,...u},m=(f==null?void 0:f.KeyframeResolver)||En;this.keyframeResolver=new m(a,(g,w,S)=>this.onKeyframesResolved(g,w,d,!S),l,c,f),(x=this.keyframeResolver)==null||x.scheduleResolve()}onKeyframesResolved(t,n,s,i){this.keyframeResolver=void 0;const{name:r,type:o,velocity:a,delay:l,isHandoff:c,onUpdate:f}=s;this.resolvedAt=F.now(),Ei(t,r,o,a)||((oe.instantAnimations||!l)&&(f==null||f(it(t,s,n))),t[0]=t[t.length-1],s.duration=0,s.repeat=0);const d={startTime:i?this.resolvedAt?this.resolvedAt-this.createdAt>Oi?this.resolvedAt:this.createdAt:this.createdAt:void 0,finalKeyframe:n,...s,keyframes:t},m=!c&&_i(d)?new Si({...d,element:d.motionValue.owner.current}):new ot(d);m.finished.then(()=>this.notifyFinished()).catch(ee),this.pendingTimeline&&(this.stopTimeline=m.attachTimeline(this.pendingTimeline),this.pendingTimeline=void 0),this._animation=m}get finished(){return this._animation?this.animation.finished:this._finished}then(t,n){return this.finished.finally(t).then(()=>{})}get animation(){var t;return this._animation||((t=this.keyframeResolver)==null||t.resume(),fi()),this._animation}get duration(){return this.animation.duration}get time(){return this.animation.time}set time(t){this.animation.time=t}get speed(){return this.animation.speed}get state(){return this.animation.state}set speed(t){this.animation.speed=t}get startTime(){return this.animation.startTime}attachTimeline(t){return this._animation?this.stopTimeline=this.animation.attachTimeline(t):this.pendingTimeline=t,()=>this.stop()}play(){this.animation.play()}pause(){this.animation.pause()}complete(){this.animation.complete()}cancel(){var t;this._animation&&this.animation.cancel(),(t=this.keyframeResolver)==null||t.cancel()}}const Pi=/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;function Di(e){const t=Pi.exec(e);if(!t)return[,];const[,n,s,i]=t;return[`--${n??s}`,i]}function Dn(e,t,n=1){const[s,i]=Di(e);if(!s)return;const r=window.getComputedStyle(t).getPropertyValue(s);if(r){const o=r.trim();return ns(o)?parseFloat(o):o}return Qe(i)?Dn(i,t,n+1):i}function Pr(e,t){return(e==null?void 0:e[t])??(e==null?void 0:e.default)??e}const Li=new Set(["width","height","top","left","right","bottom",...at]),Ci={test:e=>e==="auto",parse:e=>e},Ln=e=>t=>t.test(e),Cn=[ne,h,J,N,As,Es,Ci],_t=e=>Cn.find(Ln(e));function Ri(e){return typeof e=="number"?e===0:e!==null?e==="none"||e==="0"||ss(e):!0}const Fi=new Set(["brightness","contrast","saturate","opacity"]);function Vi(e){const[t,n]=e.slice(0,-1).split("(");if(t==="drop-shadow")return e;const[s]=n.match(et)||[];if(!s)return e;const i=n.replace(s,"");let r=Fi.has(t)?1:0;return s!==n&&(r*=100),t+"("+r+i+")"}const Bi=/\b([a-z-]*)\(.*?\)/gu,He={...de,getAnimatableNone:e=>{const t=e.match(Bi);return t?t.map(Vi).join(" "):e}},Ot={...ne,transform:Math.round},Ui={rotate:N,rotateX:N,rotateY:N,rotateZ:N,scale:pe,scaleX:pe,scaleY:pe,scaleZ:pe,skew:N,skewX:N,skewY:N,distance:h,translateX:h,translateY:h,translateZ:h,x:h,y:h,z:h,perspective:h,transformPerspective:h,opacity:ae,originX:pt,originY:pt,originZ:h},zi={borderWidth:h,borderTopWidth:h,borderRightWidth:h,borderBottomWidth:h,borderLeftWidth:h,borderRadius:h,radius:h,borderTopLeftRadius:h,borderTopRightRadius:h,borderBottomRightRadius:h,borderBottomLeftRadius:h,width:h,maxWidth:h,height:h,maxHeight:h,top:h,right:h,bottom:h,left:h,padding:h,paddingTop:h,paddingRight:h,paddingBottom:h,paddingLeft:h,margin:h,marginTop:h,marginRight:h,marginBottom:h,marginLeft:h,backgroundPositionX:h,backgroundPositionY:h,...Ui,zIndex:Ot,fillOpacity:ae,strokeOpacity:ae,numOctaves:Ot},Ii={...zi,color:A,backgroundColor:A,outlineColor:A,fill:A,stroke:A,borderColor:A,borderTopColor:A,borderRightColor:A,borderBottomColor:A,borderLeftColor:A,filter:He,WebkitFilter:He},ki=e=>Ii[e];function Ni(e,t){let n=ki(e);return n!==He&&(n=de),n.getAnimatableNone?n.getAnimatableNone(t):void 0}const Wi=new Set(["auto","none","0"]);function Ki(e,t,n){let s=0,i;for(;s<e.length&&!i;){const r=e[s];typeof r=="string"&&!Wi.has(r)&&le(r).values.length&&(i=e[s]),s++}if(i&&n)for(const r of t)e[r]=Ni(n,i)}class Dr extends En{constructor(t,n,s,i,r){super(t,n,s,i,r,!0)}readKeyframes(){const{unresolvedKeyframes:t,element:n,name:s}=this;if(!n||!n.current)return;super.readKeyframes();for(let l=0;l<t.length;l++){let c=t[l];if(typeof c=="string"&&(c=c.trim(),Qe(c))){const f=Dn(c,n.current);f!==void 0&&(t[l]=f),l===t.length-1&&(this.finalKeyframe=c)}}if(this.resolveNoneKeyframes(),!Li.has(s)||t.length!==2)return;const[i,r]=t,o=_t(i),a=_t(r);if(o!==a)if(Tt(o)&&Tt(a))for(let l=0;l<t.length;l++){const c=t[l];typeof c=="string"&&(t[l]=parseFloat(c))}else G[s]&&(this.needsMeasurement=!0)}resolveNoneKeyframes(){const{unresolvedKeyframes:t,name:n}=this,s=[];for(let i=0;i<t.length;i++)(t[i]===null||Ri(t[i]))&&s.push(i);s.length&&Ki(t,s,n)}measureInitialState(){const{element:t,unresolvedKeyframes:n,name:s}=this;if(!t||!t.current)return;s==="height"&&(this.suspendedScrollY=window.pageYOffset),this.measuredOrigin=G[s](t.measureViewportBox(),window.getComputedStyle(t.current)),n[0]=this.measuredOrigin;const i=n[n.length-1];i!==void 0&&t.getValue(s,i).jump(i,!1)}measureEndState(){var a;const{element:t,name:n,unresolvedKeyframes:s}=this;if(!t||!t.current)return;const i=t.getValue(n);i&&i.jump(this.measuredOrigin,!1);const r=s.length-1,o=s[r];s[r]=G[n](t.measureViewportBox(),window.getComputedStyle(t.current)),o!==null&&this.finalKeyframe===void 0&&(this.finalKeyframe=o),(a=this.removedTransforms)!=null&&a.length&&this.removedTransforms.forEach(([l,c])=>{t.getValue(l).set(c)}),this.resolveNoneKeyframes()}}function Rn(e,t,n){if(e instanceof EventTarget)return[e];if(typeof e=="string"){let s=document;t&&(s=t.current);const i=(n==null?void 0:n[e])??s.querySelectorAll(e);return i?Array.from(i):[]}return Array.from(e)}const Lr=(e,t)=>t&&typeof e=="number"?t.transform(e):e,Pt=30,ji=e=>!isNaN(parseFloat(e)),Dt={current:void 0};class Gi{constructor(t,n={}){this.canTrackVelocity=null,this.events={},this.updateAndNotify=(s,i=!0)=>{var o,a;const r=F.now();if(this.updatedAt!==r&&this.setPrevFrameValue(),this.prev=this.current,this.setCurrent(s),this.current!==this.prev&&((o=this.events.change)==null||o.notify(this.current),this.dependents))for(const l of this.dependents)l.dirty();i&&((a=this.events.renderRequest)==null||a.notify(this.current))},this.hasAnimated=!1,this.setCurrent(t),this.owner=n.owner}setCurrent(t){this.current=t,this.updatedAt=F.now(),this.canTrackVelocity===null&&t!==void 0&&(this.canTrackVelocity=ji(this.current))}setPrevFrameValue(t=this.current){this.prevFrameValue=t,this.prevUpdatedAt=this.updatedAt}onChange(t){return this.on("change",t)}on(t,n){this.events[t]||(this.events[t]=new rs);const s=this.events[t].add(n);return t==="change"?()=>{s(),Q.read(()=>{this.events.change.getSize()||this.stop()})}:s}clearListeners(){for(const t in this.events)this.events[t].clear()}attach(t,n){this.passiveEffect=t,this.stopPassiveEffect=n}set(t,n=!0){!n||!this.passiveEffect?this.updateAndNotify(t,n):this.passiveEffect(t,this.updateAndNotify)}setWithVelocity(t,n,s){this.set(n),this.prev=void 0,this.prevFrameValue=t,this.prevUpdatedAt=this.updatedAt-s}jump(t,n=!0){this.updateAndNotify(t),this.prev=t,this.prevUpdatedAt=this.prevFrameValue=void 0,n&&this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}dirty(){var t;(t=this.events.change)==null||t.notify(this.current)}addDependent(t){this.dependents||(this.dependents=new Set),this.dependents.add(t)}removeDependent(t){this.dependents&&this.dependents.delete(t)}get(){return Dt.current&&Dt.current.push(this),this.current}getPrevious(){return this.prev}getVelocity(){const t=F.now();if(!this.canTrackVelocity||this.prevFrameValue===void 0||t-this.updatedAt>Pt)return 0;const n=Math.min(this.updatedAt-this.prevUpdatedAt,Pt);return Zt(parseFloat(this.current)-parseFloat(this.prevFrameValue),n)}start(t){return this.stop(),new Promise(n=>{this.hasAnimated=!0,this.animation=t(n),this.events.animationStart&&this.events.animationStart.notify()}).then(()=>{this.events.animationComplete&&this.events.animationComplete.notify(),this.clearAnimation()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){delete this.animation}destroy(){var t,n;(t=this.dependents)==null||t.clear(),(n=this.events.destroy)==null||n.notify(),this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}}function Cr(e,t){return new Gi(e,t)}const{schedule:Rr,cancel:Fr}=ln(queueMicrotask,!1),R={x:!1,y:!1};function Fn(){return R.x||R.y}function Vr(e){return e==="x"||e==="y"?R[e]?null:(R[e]=!0,()=>{R[e]=!1}):R.x||R.y?null:(R.x=R.y=!0,()=>{R.x=R.y=!1})}function Vn(e,t){const n=Rn(e),s=new AbortController,i={passive:!0,...t,signal:s.signal};return[n,i,()=>s.abort()]}function Lt(e){return!(e.pointerType==="touch"||Fn())}function Br(e,t,n={}){const[s,i,r]=Vn(e,n),o=a=>{if(!Lt(a))return;const{target:l}=a,c=t(l,a);if(typeof c!="function"||!l)return;const f=u=>{Lt(u)&&(c(u),l.removeEventListener("pointerleave",f))};l.addEventListener("pointerleave",f,i)};return s.forEach(a=>{a.addEventListener("pointerenter",o,i)}),r}const Bn=(e,t)=>t?e===t?!0:Bn(e,t.parentElement):!1,Hi=e=>e.pointerType==="mouse"?typeof e.button!="number"||e.button<=0:e.isPrimary!==!1,qi=new Set(["BUTTON","INPUT","SELECT","TEXTAREA","A"]);function Xi(e){return qi.has(e.tagName)||e.tabIndex!==-1}const be=new WeakSet;function Ct(e){return t=>{t.key==="Enter"&&e(t)}}function Le(e,t){e.dispatchEvent(new PointerEvent("pointer"+t,{isPrimary:!0,bubbles:!0}))}const Yi=(e,t)=>{const n=e.currentTarget;if(!n)return;const s=Ct(()=>{if(be.has(n))return;Le(n,"down");const i=Ct(()=>{Le(n,"up")}),r=()=>Le(n,"cancel");n.addEventListener("keyup",i,t),n.addEventListener("blur",r,t)});n.addEventListener("keydown",s,t),n.addEventListener("blur",()=>n.removeEventListener("keydown",s),t)};function Rt(e){return Hi(e)&&!Fn()}function Ur(e,t,n={}){const[s,i,r]=Vn(e,n),o=a=>{const l=a.currentTarget;if(!Rt(a))return;be.add(l);const c=t(l,a),f=(m,x)=>{window.removeEventListener("pointerup",u),window.removeEventListener("pointercancel",d),be.has(l)&&be.delete(l),Rt(m)&&typeof c=="function"&&c(m,{success:x})},u=m=>{f(m,l===window||l===document||n.useGlobalTarget||Bn(l,m.target))},d=m=>{f(m,!1)};window.addEventListener("pointerup",u,i),window.addEventListener("pointercancel",d,i)};return s.forEach(a=>{(n.useGlobalTarget?window:a).addEventListener("pointerdown",o,i),Pn(a)&&(a.addEventListener("focus",c=>Yi(c,i)),!Xi(a)&&!a.hasAttribute("tabindex")&&(a.tabIndex=0))}),r}function Un(e){return Yt(e)&&"ownerSVGElement"in e}const we=new WeakMap;let W;const zn=(e,t,n)=>(s,i)=>i&&i[0]?i[0][e+"Size"]:Un(s)&&"getBBox"in s?s.getBBox()[t]:s[n],$i=zn("inline","width","offsetWidth"),Zi=zn("block","height","offsetHeight");function Ji({target:e,borderBoxSize:t}){var n;(n=we.get(e))==null||n.forEach(s=>{s(e,{get width(){return $i(e,t)},get height(){return Zi(e,t)}})})}function Qi(e){e.forEach(Ji)}function er(){typeof ResizeObserver>"u"||(W=new ResizeObserver(Qi))}function tr(e,t){W||er();const n=Rn(e);return n.forEach(s=>{let i=we.get(s);i||(i=new Set,we.set(s,i)),i.add(t),W==null||W.observe(s)}),()=>{n.forEach(s=>{const i=we.get(s);i==null||i.delete(t),i!=null&&i.size||W==null||W.unobserve(s)})}}const xe=new Set;let Z;function nr(){Z=()=>{const e={get width(){return window.innerWidth},get height(){return window.innerHeight}};xe.forEach(t=>t(e))},window.addEventListener("resize",Z)}function sr(e){return xe.add(e),Z||nr(),()=>{xe.delete(e),!xe.size&&typeof Z=="function"&&(window.removeEventListener("resize",Z),Z=void 0)}}function zr(e,t){return typeof e=="function"?sr(e):tr(e,t)}function Ir(e,t){let n;const s=()=>{const{currentTime:i}=t,o=(i===null?0:i.value)/100;n!==o&&e(o),n=o};return Q.preUpdate(s,!0),()=>cn(s)}function kr(e){return Un(e)&&e.tagName==="svg"}function Nr(...e){const t=!Array.isArray(e[0]),n=t?0:-1,s=e[0+n],i=e[1+n],r=e[2+n],o=e[3+n],a=wn(i,r,o);return t?a(s):a}const ir=e=>!!(e&&e.getVelocity);function Wr(e,t,n){const s=e.get();let i=null,r=s,o;const a=typeof s=="string"?s.replace(/[\d.-]/g,""):void 0,l=()=>{i&&(i.stop(),i=null)},c=()=>{l(),i=new ot({keyframes:[Vt(e.get()),Vt(r)],velocity:e.getVelocity(),type:"spring",restDelta:.001,restSpeed:.01,...n,onUpdate:o})};e.attach((u,d)=>(r=u,o=m=>d(Ft(m,a)),Q.postRender(c),e.get()),l);let f;return ir(t)&&(f=t.on("change",u=>e.set(Ft(u,a))),e.on("destroy",f)),f}function Ft(e,t){return t?e+t:e}function Vt(e){return typeof e=="number"?e:parseFloat(e)}const rr=[...Cn,A,de],Kr=e=>rr.find(Ln(e));var or=Object.defineProperty,ar=Object.defineProperties,lr=Object.getOwnPropertyDescriptors,Bt=Object.getOwnPropertySymbols,cr=Object.prototype.hasOwnProperty,ur=Object.prototype.propertyIsEnumerable,Ut=(e,t,n)=>t in e?or(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,zt=(e,t)=>{for(var n in t||(t={}))cr.call(t,n)&&Ut(e,n,t[n]);if(Bt)for(var n of Bt(t))ur.call(t,n)&&Ut(e,n,t[n]);return e},fr=(e,t)=>ar(e,lr(t)),It,kt;typeof window<"u"&&((It=window.document)!=null&&It.createElement||((kt=window.navigator)==null?void 0:kt.product)==="ReactNative")?D.useLayoutEffect:D.useEffect;function In(e,t,n){if(!e)return;if(n(e)===!0)return e;let s=t?e.return:e.child;for(;s;){const i=In(s,t,n);if(i)return i;s=t?null:s.sibling}}function kn(e){try{return Object.defineProperties(e,{_currentRenderer:{get(){return null},set(){}},_currentRenderer2:{get(){return null},set(){}}})}catch{return e}}const Nt=console.error;console.error=function(){const e=[...arguments].join("");if(e!=null&&e.startsWith("Warning:")&&e.includes("useContext")){console.error=Nt;return}return Nt.apply(this,arguments)};const lt=kn(D.createContext(null));class dr extends D.Component{render(){return D.createElement(lt.Provider,{value:this._reactInternals},this.props.children)}}function hr(){const e=D.useContext(lt);if(e===null)throw new Error("its-fine: useFiber must be called within a <FiberProvider />!");const t=D.useId();return D.useMemo(()=>{for(const s of[e,e==null?void 0:e.alternate]){if(!s)continue;const i=In(s,!1,r=>{let o=r.memoizedState;for(;o;){if(o.memoizedState===t)return!0;o=o.next}});if(i)return i}},[e,t])}function pr(){const e=hr(),[t]=D.useState(()=>new Map);t.clear();let n=e;for(;n;){if(n.type&&typeof n.type=="object"){const i=n.type._context===void 0&&n.type.Provider===n.type?n.type:n.type._context;i&&i!==lt&&!t.has(i)&&t.set(i,D.useContext(kn(i)))}n=n.return}return t}function jr(){const e=pr();return D.useMemo(()=>Array.from(e.keys()).reduce((t,n)=>s=>D.createElement(t,null,D.createElement(n.Provider,fr(zt({},s),{value:e.get(n)}))),t=>D.createElement(dr,zt({},t))),[e])}function Wt(){return Wt=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var s in n)({}).hasOwnProperty.call(n,s)&&(e[s]=n[s])}return e},Wt.apply(null,arguments)}const Nn=(()=>parseInt(Gn.replace(/\D+/g,"")))(),Wn=Nn>=125?"uv1":"uv2",Kt=new qe,me=new k;class Kn extends Hn{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const t=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],n=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],s=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(s),this.setAttribute("position",new ct(t,3)),this.setAttribute("uv",new ct(n,2))}applyMatrix4(t){const n=this.attributes.instanceStart,s=this.attributes.instanceEnd;return n!==void 0&&(n.applyMatrix4(t),s.applyMatrix4(t),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(t){let n;t instanceof Float32Array?n=t:Array.isArray(t)&&(n=new Float32Array(t));const s=new Ve(n,6,1);return this.setAttribute("instanceStart",new Y(s,3,0)),this.setAttribute("instanceEnd",new Y(s,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(t,n=3){let s;t instanceof Float32Array?s=t:Array.isArray(t)&&(s=new Float32Array(t));const i=new Ve(s,n*2,1);return this.setAttribute("instanceColorStart",new Y(i,n,0)),this.setAttribute("instanceColorEnd",new Y(i,n,n)),this}fromWireframeGeometry(t){return this.setPositions(t.attributes.position.array),this}fromEdgesGeometry(t){return this.setPositions(t.attributes.position.array),this}fromMesh(t){return this.fromWireframeGeometry(new qn(t.geometry)),this}fromLineSegments(t){const n=t.geometry;return this.setPositions(n.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new qe);const t=this.attributes.instanceStart,n=this.attributes.instanceEnd;t!==void 0&&n!==void 0&&(this.boundingBox.setFromBufferAttribute(t),Kt.setFromBufferAttribute(n),this.boundingBox.union(Kt))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Xt),this.boundingBox===null&&this.computeBoundingBox();const t=this.attributes.instanceStart,n=this.attributes.instanceEnd;if(t!==void 0&&n!==void 0){const s=this.boundingSphere.center;this.boundingBox.getCenter(s);let i=0;for(let r=0,o=t.count;r<o;r++)me.fromBufferAttribute(t,r),i=Math.max(i,s.distanceToSquared(me)),me.fromBufferAttribute(n,r),i=Math.max(i,s.distanceToSquared(me));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(t){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(t)}}class mr extends Kn{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(t){const n=t.length-3,s=new Float32Array(2*n);for(let i=0;i<n;i+=3)s[2*i]=t[i],s[2*i+1]=t[i+1],s[2*i+2]=t[i+2],s[2*i+3]=t[i+3],s[2*i+4]=t[i+4],s[2*i+5]=t[i+5];return super.setPositions(s),this}setColors(t,n=3){const s=t.length-n,i=new Float32Array(2*s);if(n===3)for(let r=0;r<s;r+=n)i[2*r]=t[r],i[2*r+1]=t[r+1],i[2*r+2]=t[r+2],i[2*r+3]=t[r+3],i[2*r+4]=t[r+4],i[2*r+5]=t[r+5];else for(let r=0;r<s;r+=n)i[2*r]=t[r],i[2*r+1]=t[r+1],i[2*r+2]=t[r+2],i[2*r+3]=t[r+3],i[2*r+4]=t[r+4],i[2*r+5]=t[r+5],i[2*r+6]=t[r+6],i[2*r+7]=t[r+7];return super.setColors(i,n),this}fromLine(t){const n=t.geometry;return this.setPositions(n.attributes.position.array),this}}class jn extends Xn{constructor(t){super({type:"LineMaterial",uniforms:ut.clone(ut.merge([ft.common,ft.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new Yn(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
					#include <${Nn>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(n){this.uniforms.diffuse.value=n}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(n){n===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(n){this.uniforms.linewidth.value=n}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(n){!!n!="USE_DASH"in this.defines&&(this.needsUpdate=!0),n===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(n){this.uniforms.dashScale.value=n}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(n){this.uniforms.dashSize.value=n}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(n){this.uniforms.dashOffset.value=n}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(n){this.uniforms.gapSize.value=n}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(n){this.uniforms.opacity.value=n}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(n){this.uniforms.resolution.value.copy(n)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(n){!!n!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),n===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(t)}}const Ce=new ce,jt=new k,Gt=new k,M=new ce,_=new ce,V=new ce,Re=new k,Fe=new Jn,O=new Qn,Ht=new k,ge=new qe,ye=new Xt,B=new ce;let U,q;function qt(e,t,n){return B.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),B.multiplyScalar(1/B.w),B.x=q/n.width,B.y=q/n.height,B.applyMatrix4(e.projectionMatrixInverse),B.multiplyScalar(1/B.w),Math.abs(Math.max(B.x,B.y))}function gr(e,t){const n=e.matrixWorld,s=e.geometry,i=s.attributes.instanceStart,r=s.attributes.instanceEnd,o=Math.min(s.instanceCount,i.count);for(let a=0,l=o;a<l;a++){O.start.fromBufferAttribute(i,a),O.end.fromBufferAttribute(r,a),O.applyMatrix4(n);const c=new k,f=new k;U.distanceSqToSegment(O.start,O.end,f,c),f.distanceTo(c)<q*.5&&t.push({point:f,pointOnLine:c,distance:U.origin.distanceTo(f),object:e,face:null,faceIndex:a,uv:null,[Wn]:null})}}function yr(e,t,n){const s=t.projectionMatrix,r=e.material.resolution,o=e.matrixWorld,a=e.geometry,l=a.attributes.instanceStart,c=a.attributes.instanceEnd,f=Math.min(a.instanceCount,l.count),u=-t.near;U.at(1,V),V.w=1,V.applyMatrix4(t.matrixWorldInverse),V.applyMatrix4(s),V.multiplyScalar(1/V.w),V.x*=r.x/2,V.y*=r.y/2,V.z=0,Re.copy(V),Fe.multiplyMatrices(t.matrixWorldInverse,o);for(let d=0,m=f;d<m;d++){if(M.fromBufferAttribute(l,d),_.fromBufferAttribute(c,d),M.w=1,_.w=1,M.applyMatrix4(Fe),_.applyMatrix4(Fe),M.z>u&&_.z>u)continue;if(M.z>u){const v=M.z-_.z,b=(M.z-u)/v;M.lerp(_,b)}else if(_.z>u){const v=_.z-M.z,b=(_.z-u)/v;_.lerp(M,b)}M.applyMatrix4(s),_.applyMatrix4(s),M.multiplyScalar(1/M.w),_.multiplyScalar(1/_.w),M.x*=r.x/2,M.y*=r.y/2,_.x*=r.x/2,_.y*=r.y/2,O.start.copy(M),O.start.z=0,O.end.copy(_),O.end.z=0;const g=O.closestPointToPointParameter(Re,!0);O.at(g,Ht);const w=Zn.lerp(M.z,_.z,g),S=w>=-1&&w<=1,L=Re.distanceTo(Ht)<q*.5;if(S&&L){O.start.fromBufferAttribute(l,d),O.end.fromBufferAttribute(c,d),O.start.applyMatrix4(o),O.end.applyMatrix4(o);const v=new k,b=new k;U.distanceSqToSegment(O.start,O.end,b,v),n.push({point:b,pointOnLine:v,distance:U.origin.distanceTo(b),object:e,face:null,faceIndex:d,uv:null,[Wn]:null})}}}class vr extends $n{constructor(t=new Kn,n=new jn({color:Math.random()*16777215})){super(t,n),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const t=this.geometry,n=t.attributes.instanceStart,s=t.attributes.instanceEnd,i=new Float32Array(2*n.count);for(let o=0,a=0,l=n.count;o<l;o++,a+=2)jt.fromBufferAttribute(n,o),Gt.fromBufferAttribute(s,o),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+jt.distanceTo(Gt);const r=new Ve(i,2,1);return t.setAttribute("instanceDistanceStart",new Y(r,1,0)),t.setAttribute("instanceDistanceEnd",new Y(r,1,1)),this}raycast(t,n){const s=this.material.worldUnits,i=t.camera;i===null&&!s&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const r=t.params.Line2!==void 0&&t.params.Line2.threshold||0;U=t.ray;const o=this.matrixWorld,a=this.geometry,l=this.material;q=l.linewidth+r,a.boundingSphere===null&&a.computeBoundingSphere(),ye.copy(a.boundingSphere).applyMatrix4(o);let c;if(s)c=q*.5;else{const u=Math.max(i.near,ye.distanceToPoint(U.origin));c=qt(i,u,l.resolution)}if(ye.radius+=c,U.intersectsSphere(ye)===!1)return;a.boundingBox===null&&a.computeBoundingBox(),ge.copy(a.boundingBox).applyMatrix4(o);let f;if(s)f=q*.5;else{const u=Math.max(i.near,ge.distanceToPoint(U.origin));f=qt(i,u,l.resolution)}ge.expandByScalar(f),U.intersectsBox(ge)!==!1&&(s?gr(this,n):yr(this,i,n))}onBeforeRender(t){const n=this.material.uniforms;n&&n.resolution&&(t.getViewport(Ce),this.material.uniforms.resolution.value.set(Ce.z,Ce.w))}}class Gr extends vr{constructor(t=new mr,n=new jn({color:Math.random()*16777215})){super(t,n),this.isLine2=!0,this.type="Line2"}}export{Ir as $,Or as A,es as B,ts as C,F as D,cs as E,Un as F,kr as G,Er as H,Br as I,ot as J,Ur as K,En as L,oe as M,ns as N,ss as O,Kr as P,Ni as Q,Dr as R,rs as S,St as T,Mr as U,ki as V,Zt as W,wn as X,Js as Y,zr as Z,pi as _,Ar as a,Tr as a0,Dt as a1,Nr as a2,Wr as a3,Sr as a4,dr as a5,jr as a6,vr as a7,Gr as a8,jn as a9,Kn as aa,mr as ab,Wt as ac,at as b,ir as c,Cr as d,Pr as e,Q as f,Lr as g,Li as h,Pn as i,Hi as j,Me as k,$e as l,Rr as m,zi as n,cn as o,h as p,I as q,Se as r,te as s,_r as t,$t as u,X as v,Vr as w,J as x,ee as y,de as z};
