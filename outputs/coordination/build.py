from pathlib import Path
import json,math,html
root=Path(__file__).resolve().parents[2]
data=json.loads((root/'outputs/model/interior-data.json').read_text())
items=data['furniture'];by={r[4]:r for r in items if r[4] not in ['c','s','P2']}
checks=[('Living: coffee table to primary sofa',by['L1'][0]-(by['L3'][0]+by['L3'][2]),'Nominal clear gap; preserve when choosing actual furniture.'),('Living: conversation sofa to rear boundary',20-(by['L2'][1]+by['L2'][3]),'Not a walking passage.'),('Kitchen: front counter to island',by['K4'][1]-(by['K1'][1]+by['K1'][3]),'Subtract handles and open drawers during use checks.'),('Kitchen: island to right counter',by['K2'][0]-(by['K4'][0]+by['K4'][2]),'Check actual appliances and door opening.'),('Guest: bed to right wall',44-(by['G1'][0]+by['G1'][2]),'Bedside table occupies part of this zone.'),('Parents: bed head to right wall',16-(by['P1'][0]+by['P1'][2]),'Headboard gap, not a passage.'),('Laundry: left boundary to washer',by['U1'][0]-38,'A geometric gap, not verified appliance service clearance.'),('Store: shelf edge to nominal x=43 reference',43-(by['ST1'][0]+by['ST1'][2]),'Cross-shelf and doorway reduce useful area locally.')]
out='# Measured planning-gap audit\n\nCalculated from interior-data.json, revision 03. Units are feet. Nominal wall lines are used; these are not finished dimensions, code clearances or proof of accessibility.\n\n| Check | Feet | Interpretation |\n| --- | ---: | --- |\n'
for name,value,note in checks:out+=f'| {name} | {value:.2f} | {note} |\n'
overlaps=[]
for i,a in enumerate(items):
 for j,b in enumerate(items[i+1:],i+1):
  w=min(a[0]+a[2],b[0]+b[2])-max(a[0],b[0]);h=min(a[1]+a[3],b[1]+b[3])-max(a[1],b[1])
  if w>1e-6 and h>1e-6:overlaps.append([i,j,a[4],b[4],w*h])
out+='\n## Static furniture overlap check\n\n'+str(len(items))+' saved furniture rectangles tested. '+str(len(overlaps))+' positive-area overlaps found. This test excludes door swings, people, pulled-out chairs, open drawers, curtains and appliance servicing. No overlaps does not mean the layout is ready to build.\n'
(root/'PLANNING-GAP-AUDIT.md').write_text(out)
(root/'outputs/coordination/audit.json').write_text(json.dumps({'checks':checks,'overlaps':overlaps},indent=2))
# Crop the actual saved drawing, preserving its geometry and door/window marks.
svg=(root/'outputs/main-floor-furniture-v3.svg').read_text();body=svg[svg.index('>')+1:svg.rindex('</svg>')]
for name,box in {'living':(0,0,24,20),'kitchen-dining':(24,0,44,28),'parents':(0,26,16,48),'guest':(30,34,44,48),'utility':(30,14,44,34)}.items():
 x0,y0,x1,y1=box;x=95+x0*22-12;y=260+(48-y1)*22-12;w=(x1-x0)*22+24;h=(y1-y0)*22+24
 (root/f'outputs/coordination/{name}.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x} {y} {w} {h}" width="900" height="{round(900*h/w)}"><title>{html.escape(name)} — crop of revision 03, front toward bottom</title>'+body+'</svg>')
print(f'Audited {len(items)} furniture footprints; {len(overlaps)} overlaps; wrote 5 unchanged-plan room crops.')
