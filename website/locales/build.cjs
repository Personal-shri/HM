const fs=require('node:fs'),path=require('node:path');
module.exports=function(out){const catalogs={};for(const lang of ['hi','mr']){const source=path.join(__dirname,lang+'.json');catalogs[lang]=fs.existsSync(source)?JSON.parse(fs.readFileSync(source,'utf8')):{};for(const name of ['overrides.json','reviewed.json','reviewed-more.json','guide-review.json']){const override=path.join(__dirname,name);if(fs.existsSync(override))Object.assign(catalogs[lang],JSON.parse(fs.readFileSync(override,'utf8'))[lang]||{});}}
const code='window.HMCatalogs='+JSON.stringify(catalogs).replace(/<\//g,'<\\/')+';';fs.mkdirSync(path.join(out,'locales'),{recursive:true});fs.writeFileSync(path.join(out,'locales/catalog.js'),code);
const runtime=fs.readFileSync(path.join(__dirname,'../i18n.js'),'utf8');
for(const file of fs.readdirSync(path.join(out,'outputs/model')).filter(f=>f.endsWith('.html'))){const p=path.join(out,'outputs/model',file);let html=fs.readFileSync(p,'utf8');html=html.replace('</body>',`<script>${code}</script><script>${runtime}</script></body>`);fs.writeFileSync(p,html);}
};
