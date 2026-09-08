"""Reuse unchanged main-floor walls/openings; overlay scaled proposed furniture."""
from pathlib import Path
import re,json
base=Path(__file__).resolve().parent
wrapper=(base/'draw_dimensioned_plan.py').read_text().split('exec(compile(source,str(base')[0]
exec(compile(wrapper,str(base/'draw_dimensioned_plan.py'),'exec'))
source=source.replace('width="1600" height="1280" viewBox="0 0 1600 1280"','width="1700" height="1600" viewBox="0 0 1700 1600"').replace('width="1600" height="1280" fill','width="1700" height="1600" fill')
source=source.replace('S=14','S=22').replace('[(False,90),(True,890)]','[(False,95)]').replace('oy=300','oy=260')
source=source.replace('if labels:', 'if False:')
source=source.replace("a,b=xy(x,y+h);P.append", "if y<0 or y>=48:return\n  a,b=xy(x,y+h);P.append",1)
source=re.sub(r'^  furn\([^\n]+\n','',source,flags=re.M)
source=re.sub(r'^  txt\(\*xy\([^\n]+\n','',source,flags=re.M)
# Restore foyer geometry which formerly shared a label line? Geometry remains separate.
source=re.sub(r'^txt\(800,1[01-2][0-9][0-9],[^\n]+\n','',source,flags=re.M)
source=source.replace("'DOORS, LARGE WINDOWS & DIMENSIONS'","'MAIN FLOOR — SCALED FURNITURE STUDY'").replace("'D1: 4 × 8 ft entry • D2: 3.5 × 7 ft • D3: 3 × 7 ft • D4: 2.5 × 7 ft store slider'","'Existing room boundaries and opening coordinates retained • front / street at bottom'").replace("'W1: 8 × 6 ft • W2: 10 × 4 ft • W3: 6 × 4 ft • W4: 4 × 4 ft • V1: 2 × 2 ft • S1: 7 × 8 ft'","'Furniture drawn to the same scale • nominal zones, not finished clear dimensions'")
source=source.replace("'american-dimensioned.svg'","'main-floor-furniture-v2.svg'")
insert='''
 # Numbered furniture, in feet from front-left corner. Each object shares plan scale.
 def item(x,y,w,h,label):
  a,b=xy(x,y+h)
  P.append(f'<rect x="{a}" y="{b}" width="{w*S}" height="{h*S}" rx="3" fill="#dfc69e" stroke="#755d40" stroke-width="1.6"/>')
  txt(a+w*S/2,b+h*S/2+4,label,12,True)
 def zone(x,y,label):txt(*xy(x,y),label,13,True)
 # Main-floor furniture only; no changes to architectural geometry.
 item(1,8,1.25,5,'TV')
 item(6,13,7.5,3,'L1')
 item(14,6.5,3,6,'L2')
 item(8.5,9,3.5,2,'L3')
 item(23,1,1,3,'F1')
 item(26,0.5,15.5,2,'K1')
 item(41.5,2.5,2,8,'K2')
 item(40.5,10.5,3,3,'K3')
 item(30,6,6,3,'K4')
 item(30.5,9.3,1.5,1.5,'s');item(33.5,9.3,1.5,1.5,'s')
 item(27,18,6,3,'T1')
 for x in [27.5,30.5]:
  item(x,16,1.5,1.5,'c');item(x,21.5,1.5,1.5,'c')
 item(25,18.7,1.5,1.5,'c');item(33.5,18.7,1.5,1.5,'c')
 item(8.5,32,7,5.5,'P1')
 item(14,30,1.5,1.5,'P2');item(14,38,1.5,1.5,'P2')
 item(1,27.5,2.5,2.5,'P3')
 item(14,44,1.5,3.5,'C1')
 item(34.25,34.5,5.5,7,'G1')
 item(30.5,42,2,5,'G2')
 item(40.25,34.5,1.5,1.5,'G3')
 item(41,21,2.5,2.33,'U1');item(42,24,1.5,1.67,'U2')
 item(38.5,30,1,3.5,'ST1');item(39.5,32.5,3.5,1,'ST2')
 item(42.5,14.5,1,4.5,'A1')
 # Dashed circulation centerline, target intent rather than certified width.
 for points in [[(21,4.5),(22,8),(21,18),(16,18),(16,23),(10,23),(10,28)]]:
  coords=' '.join(f'{xy(x,y)[0]},{xy(x,y)[1]}' for x,y in points)
  P.append(f'<polyline points="{coords}" fill="none" stroke="#a67132" stroke-width="2" stroke-dasharray="6 5"/>')
 for x,y,label in [(7,18,'LIVING 24 × 20*'),(34,12.5,'KITCHEN 20 × 14'),(32,25,'DINING 14 × 14*'),(7,28,'PARENTS 16 × 16'),(37,46.5,'GUEST 14 × 14'),(5,46,'ENSUITE'),(12.8,47,'CLOSET'),(34,32,'BATH'),(41,29,'STORE'),(40,27,'LAUNDRY'),(40,19,'PANTRY')]:zone(x,y,label)
 # Nominal working-gap checks, excluding wall deductions.
 dimension(29,2.5,29,6,'3.5 ft')
 dimension(36,7.5,41.5,7.5,'5.5 ft')
 dimension(39.75,40,44,40,'4.25 ft')
'''
source=source.replace(' # Schematic dog-leg stairs;',insert+'\n # Schematic dog-leg stairs;')
footer="""
txt(1330,195,'FURNITURE KEY',23,True)
"""
keys=[('L1','Sofa 7.5 × 3 ft'),('L2','Sofa 6 × 3 ft, rotated'),('L3','Coffee table 3.5 × 2 ft'),('TV','Console 5 × 1.25 ft'),('F1','Slim foyer cabinet 3 × 1 ft'),('K1/K2','Perimeter counters, 2 ft deep'),('K3','Fridge allowance 3 × 3 ft'),('K4','Island 6 × 3 ft; stools separate'),('T1','Dining table 6 × 3 ft, six seats'),('P1','Bed frame 7 × 5.5 ft; head right'),('P2','Bedside tables 1.5 ft square'),('P3','Chair 2.5 ft square'),('C1','Shelves 3.5 × 1.5 ft, right wall'),('G1','Bed frame 5.5 × 7 ft; head front'),('G2','Wardrobe 5 × 2 ft, left wall'),('G3','Bedside table 1.5 ft square'),('U1','Washer placeholder 2.33 × 2.5 ft'),('U2','Small sink 1.67 × 1.5 ft'),('ST1/ST2','Store shelves 1 ft deep'),('A1','Pantry shelves 1 ft deep')]
for i,(k,v) in enumerate(keys):footer+=f"txt(1345,{240+i*34},{(k+' — '+v)!r},15)\n"
notes=['Brown dashed line = circulation intent.','Blue lines = original windows / sliders.','D/S opening tags retain original meanings.','Furniture IDs are separate from door IDs.','No exterior window moved or added.','Bathroom fixtures not yet laid out.','Dining-side pantry/laundry door swings', 'require coordination before fixing furniture.', 'Schematic stair/access retained, not validated.','* Foyer/dining edges require final wall check.','Do not order furniture from nominal zones.']
for i,n in enumerate(notes):footer+=f"txt(1335,{990+i*29},{n!r},14)\n"
footer+="txt(830,1510,'Scale reference: one drawn foot = 22 SVG units. Plan room zones and openings retained; furniture is proposed.',17)\ntxt(830,1545,'Next: verify finished dimensions, door operation, columns and appliances before generating matched room views.',17)\n"
source=source.replace("P.append('</svg>')",footer+"P.append('</svg>')")
exec(compile(source,str(base/'draw_american_plan.py'),'exec'))

main_openings=[o for o in openings if o['floor']=='main']
original=[o for o in json.loads((base/'opening-schedule-upper-rear.json').read_text()) if o['floor']=='main']
assert main_openings==original, 'Main floor openings changed'
print('Verified: every main-floor opening matches saved schedule.')
