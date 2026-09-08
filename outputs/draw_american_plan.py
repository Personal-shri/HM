from pathlib import Path
from html import escape
P=['<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1280" viewBox="0 0 1600 1280"><rect width="1600" height="1280" fill="#faf8f3"/>']
S=14
def txt(x,y,t,z=16,b=False):P.append(f'<text x="{x}" y="{y}" text-anchor="middle" font-family="Arial" font-size="{z}" font-weight="{700 if b else 400}" fill="#293c35">{escape(t)}</text>')
def ln(x,y,u,v,c='#42534b',w=3):P.append(f'<path d="M{x},{y} L{u},{v}" stroke="{c}" stroke-width="{w}" fill="none"/>')
txt(800,48,'AMERICAN FAMILY HOUSE',32,True)
txt(800,80,'Five bedrooms • Main-level parents’ suite • Island kitchen • Separate laundry • Upstairs kitchenette',19)
txt(800,110,'Space-first concept: approximately 3,868 sq ft enclosed, plus porch, deck and upper outdoor areas',17)
for up,ox in [(False,90),(True,890)]:
 oy=300
 def xy(x,y):return ox+x*S,oy+y*S
 def wall(x,y,u,v):ln(*xy(x,y),*xy(u,v))
 def room(x,y,w,h,name,dim='',color='#eeeade',labels=True):
  a,b=xy(x,y);P.append(f'<rect x="{a}" y="{b}" width="{w*S}" height="{h*S}" fill="{color}"/>')
  if labels:
   txt(a+w*S/2,b+h*S/2-3,name,15,True)
   if dim:txt(a+w*S/2,b+h*S/2+17,dim,13)
 def opening(x,y,u,v):ln(*xy(x,y),*xy(u,v),'#faf8f3',7)
 def door(x,y,vertical=False):
  a,b=xy(x,y);r=3*S
  if vertical:
   opening(x,y,x,y+3);ln(a,b,a-r,b,'#859084',1.3)
   P.append(f'<path d="M{a-r},{b} A{r},{r} 0 0 0 {a},{b+r}" stroke="#859084" stroke-width="1.2" fill="none"/>')
  else:
   opening(x,y,x+3,y);ln(a,b,a,b-r,'#859084',1.3)
   P.append(f'<path d="M{a},{b-r} A{r},{r} 0 0 1 {a+r},{b}" stroke="#859084" stroke-width="1.2" fill="none"/>')
 def win(x,y,u,v):opening(x,y,u,v);ln(*xy(x,y),*xy(u,v),'#5795a0',3)
 def furn(x,y,w,h,name):
  a,b=xy(x,y);P.append(f'<rect x="{a}" y="{b}" width="{w*S}" height="{h*S}" rx="3" fill="#faf8f3" stroke="#859084" stroke-width="1.3"/>')
  if name:txt(a+w*S/2,b+h*S/2+4,name,11)
 txt(ox+22*S,156,'UPPER FLOOR' if up else 'MAIN FLOOR',23,True)
 txt(ox+22*S,182,'≈1,756 sq ft enclosed' if up else '≈2,112 sq ft enclosed',16)
 if not up:
  room(0,-7,24,7,'REAR DECK / PATIO','24 × 7 ft','#e2ebd8')
  room(0,0,24,20,'','','#f2e5d0',False)
  room(24,0,20,14,'','','#f2e5d0',False)
  room(24,14,14,14,'','','#f2e5d0',False)
  room(38,14,6,6,'PANTRY','6 × 6','#eeeade')
  room(38,20,6,8,'LAUNDRY','6 × 8','#dcebef')
  room(0,20,24,6,'FAMILY HALL','', '#f6f1e7')
  room(0,26,16,16,'PARENTS’ SUITE','16 × 16 ft','#e3ecdc')
  room(0,42,10,6,'ENSUITE','10 × 6 ft','#dcebef')
  room(10,42,6,6,'W.I.C.','6 × 6','#eeeade')
  room(26,28,4,20,'','', '#f6f1e7')
  room(30,28,8,6,'BATH','8 × 6','#dcebef')
  room(38,28,6,6,'STORE','6 × 6','#eeeade')
  room(30,34,14,14,'GUEST BEDROOM','14 × 14 ft','#e3ecdc')
  room(16,42,10,6,'FOYER','10 × 6','#f6f1e7')
  room(16,48,14,6,'COVERED FRONT PORCH','14 × 6 ft','#e2ebd8')
 else:
  room(0,0,16,16,'BEDROOM 3','16 × 16 ft','#e3ecdc')
  room(16,0,14,16,'BEDROOM 4','14 × 16 ft','#e3ecdc')
  room(30,0,14,16,'BEDROOM 5','14 × 16 ft','#e3ecdc')
  room(0,16,8,6,'ENSUITE','8 × 6','#dcebef')
  room(8,16,4,6,'CLOSET','4 × 6','#eeeade')
  room(12,16,4,6,'','', '#f6f1e7')
  room(16,16,8,6,'ENSUITE','8 × 6','#dcebef')
  room(24,16,6,6,'','', '#f6f1e7')
  room(30,16,8,6,'BATH','8 × 6','#dcebef')
  room(38,16,6,6,'','', '#f6f1e7')
  room(0,22,30,4,'SHARED HALL','', '#f6f1e7')
  room(0,26,16,12,'FAMILY LOFT','16 × 12 ft','#f2e5d0')
  room(26,26,4,22,'','', '#f6f1e7')
  room(30,22,14,12,'SMALL KITCHEN','14 × 12 ft','#f2e5d0')
  room(0,38,16,10,'COVERED BALCONY','16 × 10 ft','#e2ebd8')
  room(16,42,10,6,'LANDING','', '#f6f1e7')
  room(30,34,14,14,'OPEN TERRACE','14 × 14 ft','#e2ebd8')
 room(16,26,10,16,'','','#e8e8e1',False)
 for e in [(0,0,44,0),(44,0,44,48),(44,48,0,48),(0,48,0,0),(16,26,16,42),(26,26,26,42)]:wall(*e)
 if not up:
  for e in [(24,0,24,20),(0,20,24,20),(0,26,26,26),(0,42,16,42),(16,42,16,48),(10,42,10,48),(38,14,44,14),(38,14,38,34),(38,20,44,20),(24,28,44,28),(30,28,30,48),(30,34,44,34),(16,42,26,42)]:wall(*e)
  opening(24,5,24,12);opening(6,20,18,20);opening(24,20,24,26)
  door(9,26);door(3,42);door(11,42);door(30,38,True)
  door(30,29,True);door(39,34);door(38,16,True);door(38,23,True)
  opening(26,28,30,28);opening(26,43,26,47);door(20,48)
  txt(*xy(12,3),'GREAT ROOM · 24 × 20 ft',16,True)
  furn(5,13,10,3,'SOFA');furn(17,7,3,8,'SOFA');furn(8,8,5,3,'COFFEE TABLE');furn(1,7,1,7,'TV')
  txt(*xy(34,5),'KITCHEN · 20 × 14 ft',15,True)
  furn(27,1,14,2,'COUNTER');furn(41,3,2,9,'');furn(29,7,8,4,'ISLAND + SEATING')
  txt(*xy(31,16),'DINING · 14 × 14 ft',14,True)
  furn(27.5,19,7,4,'6–8 SEATS')
  win(3,0,9,0);win(16,0,21,0);opening(10,0,15,0)
  win(28,0,39,0);win(0,29,0,37);win(44,37,44,44);win(40,48,43,48);win(44,22,44,26)
 else:
  for e in [(16,0,16,22),(30,0,30,22),(0,16,44,16),(0,22,12,22),(16,22,24,22),(30,22,38,22),(8,16,8,22),(12,16,12,22),(24,16,24,22),(38,16,38,22),(0,26,16,26),(0,38,16,38),(16,38,16,48),(30,22,30,48),(30,34,44,34),(16,42,26,42)]:wall(*e)
  door(3,16);door(8.5,16);door(12.5,16);door(18,16);door(25,16);door(39,16);door(38,18,True)
  opening(4,26,12,26);opening(30,25,30,29);opening(26,43,26,47)
  door(16,44,True);door(30,39,True);opening(4,38,11,38)
  win(3,0,12,0);win(19,0,27,0);win(33,0,41,0);win(0,4,0,11);win(44,4,44,11);win(44,25,44,31)
 # Schematic dog-leg stairs; access and final rise/run to be resolved.
 txt(*xy(21,28),'STAIR',14,True)
 for k in range(11):
  y=29+k*.9
  wall(16.8,y,20.5,y);wall(21.5,y,25.2,y)
 wall(20.7,29,20.7,40);wall(21.3,29,21.3,40)
 opening(26,38,26,41)
 txt(*xy(21,41),'10 × 16 ft',12)
 txt(ox-36,oy+24*S,'48 ft',14)
 txt(ox+34*S,oy-15,'44 ft overall',14)
 txt(ox+22*S,oy+55*S,'FRONT / STREET',15,True)
txt(800,1112,'AMERICAN LAYOUT: welcoming foyer → open kitchen / dining / great room → rear patio',18,True)
txt(800,1145,'W.I.C. = walk-in closet. Dimensions are approximate planning zones; finished clear sizes depend on walls.',16)
txt(800,1174,'Five bedrooms, five bathrooms, two kitchens, laundry and storage. Garage is not included.',16)
txt(800,1203,'Concept only. A local architect must resolve structure, egress, ventilation, stair geometry, setbacks and plumbing.',16)
txt(800,1232,'Not constrained to the previous ₹45 lakh budget. Footprint and outdoor areas have not been approved for a specific site.',16)
P.append('</svg>')
(Path(__file__).resolve().parent / 'american-family-house.svg').write_text('\n'.join(P))
