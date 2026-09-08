"""Offline, one-time catalogue translation. Not part of the website build.
Requires ctranslate2 and sentencepiece in a separate environment.
Model: facebook/nllb-200-distilled-600M, converted to CT2 int8 by JustFrederik.
Use --model to point at a downloaded model directory. No visitor text is sent.
"""
from html.parser import HTMLParser
from pathlib import Path
import argparse,json,re,time
parser=argparse.ArgumentParser();parser.add_argument('--model',required=True);args=parser.parse_args()
root=Path(__file__).resolve().parent.parent
texts=set()
class P(HTMLParser):
 def __init__(self):super().__init__();self.skip=0
 def handle_starttag(self,t,attrs):
  if t in ('script','style'):self.skip+=1
  for k,v in attrs:
   if k in ('alt','title','placeholder','aria-label') and v and re.search('[A-Za-z]',v):texts.add(v.strip())
 def handle_endtag(self,t):
  if t in ('script','style'):self.skip-=1
 def handle_data(self,s):
  if not self.skip and re.search('[A-Za-z]',s):texts.add(s.strip())
for f in (root/'dist').rglob('*.html'):
 p=P();p.feed(f.read_text())
extra=[
 'Required litres (including allowance)','20-litre packs to buy','Purchased volume','Topcoat material cost','Topcoat material only. Undercoat, preparation, labour and delivery are not included.',
 'Enter non-negative values and coverage greater than zero.','Enter non-negative values, positive consumption and a pack size greater than zero.','Required material (including allowance)','Complete packs to buy','Material cost','Enter a supplier price to calculate material cost. No installed total has been calculated.','Material only. Preparation, protection, drains, labour and testing are not included.',
 'Enter non-negative values and a whole-number opening count.','Total opening area','Quoted amount including entered extras','Enter the complete quoted assembly rate to calculate an amount.','Confirm the quotation includes all required components, tax and installation. This is not a verified project total.',
 'Exterior purchasing note','Purchasing note downloaded. Nothing was sent to a supplier.','research topics','of','Selected A','front','rear','left','right','top','angle','view','drag to rotate; scroll to zoom','proposed matching elevation','selected front reference','appearance concept','Exterior preview','layout remains unchanged','Front · approved appearance reference','Left side · proposed elevation · front is on the right','Right side · proposed elevation · front is on the left','Rear · proposed elevation and patio','Main floor','Parents bedroom','Guest bedroom','Dining','Great room','Kitchen','Laundry','Store','Pantry','Stairs','Bathroom','Entrance','Overview','Walk mode','drag to look, use arrows or WASD to move','Return to walking','close overhead view; drag to rotate','actual saved photo sample; scaled model governs geometry. Utility and hall images remain finish studies.','No coordinated stair photo exists yet. The stair footprint is reserved.','Overview · drag to orbit; scroll or pinch to zoom · choose a room to walk',
]
texts.update(extra)
# Preserve identifiers and measurements. Prose containing them is still translated.
def preserve(s):
 return not re.search('[A-Za-z]',s) or bool(re.fullmatch(r'[\d\s.,₹%×/–—+():²³\-]*(?:sq ft|sq\.ft|ft|m²|m³|kg|mm|cm|m|L|W|K|IP\d+)[\d\s.,₹%×/–—+():²³\-]*',s)) or s in ['HM','RCC','SVG','PNG','HTML','IP44','IP65','IP66','English','SikaTop-107 Seal Plus IN','Apex Dust Proof Emulsion','Apex Ultima Protek'] or s.startswith(('http','₹')) and len(s)<30
texts=sorted(texts)
(root/'website/locales/source.json').write_text(json.dumps(texts,ensure_ascii=False,indent=2))
import sentencepiece as sp,ctranslate2
spm=sp.SentencePieceProcessor(model_file=str(Path(args.model)/'sentencepiece.bpe.model'))
translator=ctranslate2.Translator(args.model,device='cpu',compute_type='int8',inter_threads=1,intra_threads=6)
digits=str.maketrans('०१२३४५६७८९','0123456789')
def normalize_numbers(src,tgt):
 tgt=tgt.translate(digits).replace('⁇','–');tgt=re.sub(r'\bm2\b','m²',tgt);tgt=re.sub(r'\bm3\b','m³',tgt)
 a=re.findall(r'\d[\d,]*(?:\.\d+)?',src);b=re.findall(r'\d[\d,]*(?:\.\d+)?',tgt)
 if len(a)==len(b):
  it=iter(a);tgt=re.sub(r'\d[\d,]*(?:\.\d+)?',lambda m:next(it),tgt)
 return tgt
for lang,tag in [('hi','hin_Deva'),('mr','mar_Deva')]:
 dest=root/'website/locales'/f'{lang}.json';catalog=json.loads(dest.read_text()) if dest.exists() else {};todo=[s for s in texts if s not in catalog];errors=[];start=time.time()
 for s in todo:
  if preserve(s):catalog[s]=s
 todo=[s for s in todo if s not in catalog]
 for offset in range(0,len(todo),12):
  batch=todo[offset:offset+12];chunks=[];owners=[]
  for i,s in enumerate(batch):
   parts=re.split(r'(?<=[.!?])\s+(?=[A-Z])',s)
   for part in parts:chunks.append(['eng_Latn']+spm.encode(part,out_type=str)+['</s>']);owners.append(i)
  results=translator.translate_batch(chunks,target_prefix=[[tag] for _ in chunks],beam_size=2,max_decoding_length=320,repetition_penalty=1.1,no_repeat_ngram_size=5,max_batch_size=12)
  combined=['' for _ in batch]
  for i,r in zip(owners,results):combined[i]+=(' ' if combined[i] else '')+spm.decode(r.hypotheses[0][1:])
  for src,tgt in zip(batch,combined):
   tgt=normalize_numbers(src,tgt);catalog[src]=tgt
   a=re.findall(r'\d[\d,]*(?:\.\d+)?',src);b=re.findall(r'\d[\d,]*(?:\.\d+)?',tgt)
   if a!=b:errors.append({'en':src,lang:tgt,'reason':'numbers differ'})
  dest.write_text(json.dumps(catalog,ensure_ascii=False,indent=2))
  (root/'website/locales'/f'{lang}-review.json').write_text(json.dumps(errors,ensure_ascii=False,indent=2))
  print(f'{lang}: {min(offset+12,len(todo))}/{len(todo)} strings; {time.time()-start:.0f}s',flush=True)
 print('Completed',lang,len(catalog),flush=True)
