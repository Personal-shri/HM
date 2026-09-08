const views={front:['front-approved.png','Front · approved appearance reference'],left:['left-side.png','Left side · proposed elevation · front is on the right'],right:['right-side.png','Right side · proposed elevation · front is on the left'],rear:['rear.png','Rear · proposed elevation and patio']};
const photo=document.getElementById('exterior-photo');
document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{const [file,caption]=views[button.dataset.image];photo.src='/outputs/elevations/selected-a/'+file;photo.alt=caption;document.getElementById('image-caption').textContent=caption;document.getElementById('image-download').href=photo.src;document.querySelectorAll('[data-image]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
const dialog=document.getElementById('image-dialog');document.getElementById('enlarge-exterior')?.addEventListener('click',()=>{document.getElementById('dialog-image').src=photo.src;document.getElementById('dialog-image').alt=photo.alt;document.getElementById('dialog-caption').textContent=photo.alt;dialog.showModal();});document.getElementById('close-dialog')?.addEventListener('click',()=>dialog.close());dialog?.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
document.getElementById('load-model')?.addEventListener('click',()=>{const frame=document.createElement('iframe');frame.src='/outputs/model/house-3d.html';frame.title='Interactive HM exterior model';frame.allow='fullscreen';document.getElementById('model-shell').replaceChildren(frame);});

const oldRoutes={exterior:'exterior',plans:'plans',explore:'explore',budget:'budget',library:'library'};if(location.pathname==='/'||location.pathname==='/index.html'){const route=oldRoutes[location.hash.slice(1)];if(route)location.replace('/'+route+'.html');}
const researchTopics=[...document.querySelectorAll('.research-topic')];
researchTopics.forEach(t=>t.dataset.searchOriginal=(window.HMLanguage?.sourceText(t)||t.textContent).toLowerCase());
if(researchTopics.length){
 const search=document.getElementById('research-search');
 search.addEventListener('input',()=>{const q=search.value.trim().toLowerCase();let count=0;researchTopics.forEach(topic=>{topic.hidden=!!q&&!(topic.textContent.toLowerCase()+' '+topic.dataset.searchOriginal).includes(q);if(!topic.hidden){count++;if(q)topic.open=true;}});document.getElementById('research-count').textContent=count+' of '+researchTopics.length+' research topics';document.getElementById('research-empty').hidden=count!==0;});
 document.getElementById('expand-research').addEventListener('click',()=>researchTopics.filter(t=>!t.hidden).forEach(t=>t.open=true));
 document.getElementById('collapse-research').addEventListener('click',()=>researchTopics.forEach(t=>t.open=false));
 function revealTopic(){const topic=researchTopics.find(t=>'#'+t.id===location.hash);if(topic){search.value='';search.dispatchEvent(new Event('input'));topic.open=true;topic.scrollIntoView({block:'start'});}}
 document.querySelectorAll('.topic-links a').forEach(a=>a.addEventListener('click',()=>{const topic=document.getElementById(a.hash.slice(1));search.value='';search.dispatchEvent(new Event('input'));topic.open=true;}));
 window.addEventListener('hashchange',revealTopic);revealTopic();
}
const siteHeader=document.querySelector('.topbar');if(siteHeader)new ResizeObserver(()=>document.documentElement.style.setProperty('--nav-height',siteHeader.offsetHeight+'px')).observe(siteHeader);
