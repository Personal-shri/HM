(()=>{
const catalogs=window.HMCatalogs||{hi:{},mr:{}};
const selector=document.getElementById('site-language')||(()=>{const host=document.querySelector('header');if(!host)return null;const label=document.createElement('label');label.className='language-picker';label.innerHTML='<span>Language</span> <select id="site-language" aria-label="Website language" data-no-translate><option value="en">English</option><option value="hi">हिन्दी</option><option value="mr">मराठी</option></select>';host.append(label);return label.querySelector('select');})();
let language='en';try{const chosen=localStorage.getItem('hm-language');if(['en','hi','mr'].includes(chosen))language=chosen;}catch{}
const originals=new WeakMap(),attrs=new WeakMap();const originalTitle=document.title;
const reverse={hi:new Map(Object.entries(catalogs.hi).map(([k,v])=>[v,k])),mr:new Map(Object.entries(catalogs.mr).map(([k,v])=>[v,k]))};
function t(text){if(language==='en')return text;const dict=catalogs[language]||{};if(dict[text])return dict[text];
 const count=text.match(/^(\d+) of (\d+) research topics$/);if(count)return language==='hi'?`${count[2]} में से ${count[1]} शोध विषय`:`${count[2]} पैकी ${count[1]} संशोधन विषय`;
 if(text.includes(' · '))return text.split(' · ').map(part=>t(part)).join(' · ');
 return text;
}
let running=false;
function refresh(){if(running)return;running=true;observer?.disconnect();
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
 while(node=walker.nextNode()){
  if(node.parentElement?.closest('script,style,textarea,input,[data-no-translate],code,pre'))continue;
  const value=node.nodeValue,trim=value.trim();if(!trim)continue;
  let record=originals.get(node);
  if(!record||value!==record.last){const known=reverse.hi.get(trim)||reverse.mr.get(trim);record={source:known||trim,leading:value.match(/^\s*/)[0],trailing:value.match(/\s*$/)[0]};}
  const translated=record.leading+t(record.source)+record.trailing;if(value!==translated)node.nodeValue=translated;
  record.last=translated;originals.set(node,record);
 }
 for(const el of document.querySelectorAll('[alt],[title],[placeholder],[aria-label]')){
  if(el.closest('[data-no-translate]'))continue;let map=attrs.get(el)||{};
  for(const name of ['alt','title','placeholder','aria-label']){if(!el.hasAttribute(name))continue;const val=el.getAttribute(name);let r=map[name];if(!r||r.last!==val)r={source:reverse.hi.get(val)||reverse.mr.get(val)||val};const translated=t(r.source);if(val!==translated)el.setAttribute(name,translated);r.last=translated;map[name]=r;}attrs.set(el,map);
 }
 document.title=t(originalTitle);document.documentElement.lang=language;if(selector)selector.value=language;
 const notice=document.querySelector('.translation-note');if(notice)notice.hidden=language==='en';
 observer?.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['alt','title','placeholder','aria-label']});running=false;
}
let queued=false;
const observer=new MutationObserver(()=>{if(!queued){queued=true;queueMicrotask(()=>{queued=false;refresh();});}});
function setLanguage(value){if(!['en','hi','mr'].includes(value))return;language=value;try{localStorage.setItem('hm-language',value);}catch{}refresh();document.dispatchEvent(new CustomEvent('hm-language-change',{detail:value}));for(const frame of document.querySelectorAll('iframe')){try{frame.contentWindow.HMLanguage?.set(value);}catch{}}}
selector?.addEventListener('change',e=>setLanguage(e.target.value));
window.addEventListener('storage',e=>{if(e.key==='hm-language')setLanguage(e.newValue||'en');});
window.HMLanguage={t,refresh,set:setLanguage,sourceText(el){const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n,parts=[];while(n=w.nextNode())parts.push(originals.get(n)?.source||n.nodeValue);return parts.join(' ');},get current(){return language}};
refresh();
})();
