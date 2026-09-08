"""Add opening schedules and dimension chains to the latest concept."""
from pathlib import Path
import json

base = Path(__file__).resolve().parent
wrapper = (base / 'draw_american_front_living.py').read_text()
# Obtain the composed source without executing it yet.
wrapper = wrapper[:wrapper.index('exec(compile(source')]
exec(compile(wrapper, str(base / 'draw_american_front_living.py'), 'exec'))
source = source.replace("P=['<svg", "openings=[]\nP=['<svg", 1)
helpers = '''
 def tag(x,y,label,color='#42534b'):
  a,b=xy(x,y)
  width=len(label)*7+8
  P.append(f'<rect x="{a-width/2}" y="{b-10}" width="{width}" height="15" rx="2" fill="#faf8f3"/>')
  P.append(f'<text x="{a}" y="{b+1}" text-anchor="middle" font-family="Arial" font-size="11" fill="{color}">{label}</text>')
 def record(code,w,h,x,y):
  openings.append(dict(floor='upper' if up else 'main',code=code,width_ft=w,height_ft=h,x=x,y=y))
 def glazed(x,y,u,v,code,h):
  win(x,y,u,v)
  w=abs(u-x)+abs(v-y)
  record(code,w,h,x,y)
  if y==v:tag((x+u)/2,y,code,'#237889')
  else:tag(x,(y+v)/2,code,'#237889')
 def slider(x,y,w,code,h):
  opening(x,y,x+w,y)
  ln(*xy(x,y+.12),*xy(x+w*.55,y+.12),'#5795a0',2)
  ln(*xy(x+w*.45,y-.12),*xy(x+w,y-.12),'#5795a0',2)
  record(code,w,h,x,y);tag(x+w/2,y,code,'#237889')
 def dimension(x,y,u,v,label):
  a,b=xy(x,y);c,d=xy(u,v)
  ln(a,b,c,d,'#9a9f97',1)
  if y==v:
   ln(a,b-4,a,b+4,'#9a9f97',1);ln(c,d-4,c,d+4,'#9a9f97',1)
   tag((x+u)/2,y,label)
  else:
   ln(a-4,b,a+4,b,'#9a9f97',1);ln(c-4,d,c+4,d,'#9a9f97',1)
   tag(x,(y+v)/2,label)
'''
source=source.replace(' txt(ox+22*S,156,',helpers+'\n txt(ox+22*S,156,')
# Nominal opening widths; operation and clear widths require a detailed plan.
source=source.replace('a,b=xy(x,y);r=3*S', '''width = 3.5 if (not up and ((x,y)==(9,26) or (x,y)==(30,38))) or (up and (x,y) in [(12.5,16),(25,16),(39,16)]) else 3
  if not up and (x,y)==(20,48):width=3.5
  code='D2' if width==3.5 else 'D3'
  a,b=xy(x,y);r=width*S''')
source=source.replace('opening(x,y,x,y+3);','opening(x,y,x,y+width);')
source=source.replace('opening(x,y,x+3,y);','opening(x,y,x+width,y);')
source=source.replace(' def win(x,y,u,v):', '''  record(code,width,7,x,y)
  tag(x if vertical else x+width/2, y+width/2 if vertical else y,code)
 def win(x,y,u,v):''')
source=source.replace('opening(20,0,23,0)', '''opening(19,0,23,0)
  ln(*xy(19,0),*xy(19,4),'#859084',1.3)
  a,b=xy(19,0);r=4*S
  P.append(f'<path d="M{a},{b-r} A{r},{r} 0 0 1 {a+r},{b}" stroke="#859084" stroke-width="1.2" fill="none"/>')
  record('D1',4,8,19,0);tag(21,0,'D1')''')
source=source.replace('opening(40.5,28,43,28);', "record('D4',2.5,7,40.5,28);opening(40.5,28,43,28);tag(41.75,28,'D4');")
start=source.index('  win(3,0,9,0)')
end=source.index('\n else:',start)
source=source[:start]+'''  glazed(1,0,9,0,'W1',6);slider(10,0,17-10,'S1',8)
  glazed(28,0,38,0,'W2',4);glazed(44,3,44,9,'W3',4)
  glazed(0,29,0,37,'W1',6);glazed(44,37,44,45,'W1',6)
  glazed(32,48,40,48,'W1',6);glazed(44,22,44,26,'W4',4)
  glazed(0,43,0,45,'V1',2);glazed(44,29,44,31,'V1',2)
'''+source[end:]
start=source.index('  win(3,0,12,0)')
end=source.index('\n # Schematic',start)
source=source[:start]+'''  glazed(3,0,11,0,'W1',6);glazed(19,0,27,0,'W1',6);glazed(33,0,41,0,'W1',6)
  glazed(0,4,0,12,'W1',6);glazed(44,4,44,12,'W1',6)
  glazed(44,25,44,31,'W3',4);glazed(0,28,0,36,'W1',6);glazed(0,17,0,19,'V1',2)
  slider(4,38,7,'S1',8)
'''+source[end:]
source=source.replace(" txt(ox-36,oy+24*S,'48 ft',14)", ''' dimension(-3,0,-3,48,'48 ft')
 dimension(46,0,46,14,'14 ft');dimension(46,14,46,28,'14 ft');dimension(46,28,46,48,'20 ft')
 dimension(0,-2,24,-2,'24 ft');dimension(24,-2,44,-2,'20 ft')
 if not up:
  tag(28,36,'4 ft')
 else:
  tag(28,32,'4 ft')''')
source=source.replace("'AMERICAN HOUSE — FRONT LIVING'", "'DOORS, LARGE WINDOWS & DIMENSIONS'")
source=source.replace("'Great room and kitchen face the street • Bedrooms behind • Rear patio + front-left sitting patio'", "'D1: 4 × 8 ft entry • D2: 3.5 × 7 ft • D3: 3 × 7 ft • D4: 2.5 × 7 ft store slider'")
source=source.replace("'Space-first concept: approximately 3,868 sq ft enclosed, plus porch, deck and upper outdoor areas'", "'W1: 8 × 6 ft • W2: 10 × 4 ft • W3: 6 × 4 ft • W4: 4 × 4 ft • V1: 2 × 2 ft • S1: 7 × 8 ft'")
source=source.replace("'FRONT: patio + foyer + great room + kitchen     |     REAR: bedrooms + services + rear patio'", "'All opening sizes are width × height. Blank internal gaps are open connections; D / S labels identify doors.'")
source=source.replace("'Concept only. A local architect must resolve structure, egress, ventilation, stair geometry, setbacks and plumbing.'", "'Windows are proposed openings: engineer to check lintels, glass design and openable/escape portions. Internal baths need exhaust.'")
source=source.replace("'american-front-living.svg'", "'american-dimensioned.svg'")
exec(compile(source,str(base/'draw_american_plan.py'),'exec'))
(base/'opening-schedule.json').write_text(json.dumps(openings,indent=2))
