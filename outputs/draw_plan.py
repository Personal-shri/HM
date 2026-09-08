from pathlib import Path
from html import escape

out=Path(__file__).resolve().parent
S=17
parts=['<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1040" viewBox="0 0 1400 1040">', '<rect width="1400" height="1040" fill="#faf8f3"/>']
def text(x,y,t,size=17,fill='#23352f',anchor='middle',weight=400):
 parts.append(f'<text x="{x}" y="{y}" font-family="Arial, sans-serif" font-size="{size}" fill="{fill}" text-anchor="{anchor}" font-weight="{weight}">{escape(t)}</text>')
def line(x1,y1,x2,y2,stroke='#354740',w=3):
 parts.append(f'<path d="M{x1},{y1} L{x2},{y2}" fill="none" stroke="{stroke}" stroke-width="{w}"/>')
text(65,53,'LATUR FAMILY HOME',30,anchor='start',weight=700)
text(65,83,'55 ft road frontage × 80 ft plot depth  |  Ground + one upper floor  |  ₹45 lakh budget target',18,anchor='start')
text(65,113,'CONCEPT STUDY — north unknown; site placement and setbacks not assigned',15,anchor='start',fill='#826444')

for upper,ox in [(False,100),(True,790)]:
 oy=235
 def xy(x,y):return ox+x*S,oy+y*S
 def wall(x1,y1,x2,y2):line(*xy(x1,y1),*xy(x2,y2))
 def zone(x,y,w,h,name,dim='',fill='#eee9df'):
  px,py=xy(x,y)
  parts.append(f'<rect x="{px}" y="{py}" width="{w*S}" height="{h*S}" fill="{fill}"/>')
  cy=py+h*S/2
  text(px+w*S/2,cy-3,name,15,weight=700)
  if dim:text(px+w*S/2,cy+18,dim,13)
 def door(x,y,horizontal=True,reverse=False):
  # Schematic swing with 2.7 ft opening; white gap erases wall.
  a,b=xy(x,y);r=2.7*S
  if horizontal:
   line(a,b,a+r,b,'#faf8f3',6)
   line(a,b,a,b-r,'#63756a',1.5)
   parts.append(f'<path d="M{a},{b-r} A{r},{r} 0 0 1 {a+r},{b}" fill="none" stroke="#63756a" stroke-width="1.2"/>')
  else:
   line(a,b,a,b+r,'#faf8f3',6)
   line(a,b,a-r,b,'#63756a',1.5)
   parts.append(f'<path d="M{a-r},{b} A{r},{r} 0 0 0 {a},{b+r}" fill="none" stroke="#63756a" stroke-width="1.2"/>')
 def window(x1,y1,x2,y2):
  line(*xy(x1,y1),*xy(x2,y2),'#faf8f3',7)
  line(*xy(x1,y1),*xy(x2,y2),'#5296a2',3)

 text(ox,161,'UPPER FLOOR' if upper else 'GROUND FLOOR',22,anchor='start',weight=700)
 text(ox,188,'≈870 sq ft enclosed + 90 sq ft terrace' if upper else '≈960 sq ft covered footprint',16,anchor='start')
 zone(0,0,12,12,'BEDROOM 1' if upper else 'PARENTS','12 × 12 ft zone','#e5eddf')
 zone(18,0,12,12,'BEDROOM 2' if upper else 'EXTRA BEDROOM','12 × 12 ft zone','#e5eddf')
 zone(12,0,6,6,'ATT. BATH','6 × 6 zone','#e1edf0')
 zone(12,6,6,6,'BATH','6 × 6 zone','#e1edf0')
 zone(0,12,30,4,'SHARED PASSAGE','', '#f4f0e8')
 if upper:
  zone(0,16,11,11,'BEDROOM 3','11 × 11 ft zone','#e5eddf')
  zone(11,16,7,8,'KITCHEN','7 × 8 zone','#f3e5ce')
  zone(18,16,4,16,'','', '#f4f0e8')
  zone(11,24,7,3,'','', '#f4f0e8')
  zone(0,27,18,5,'OPEN TERRACE','18 × 5 ft zone','#e2ebd6')
 else:
  zone(0,16,10,10,'KITCHEN','10 × 10 ft zone','#f3e5ce')
  zone(0,26,5,6,'STORE','5 × 6 zone','#f3e5ce')
  zone(5,26,5,6,'UTILITY','5 × 6 zone','#e1edf0')
  zone(10,16,12,16,'LIVING / DINING','12 × 16 ft zone','#f3e5ce')
 zone(22,16,8,16,'','','#e9e8e3')
 # Perimeter and rear rooms.
 wall(0,0,30,0);wall(30,0,30,32);wall(30,32,0,32);wall(0,32,0,0)
 wall(12,0,12,12);wall(18,0,18,12);wall(12,6,18,6);wall(0,12,30,12)
 wall(0,16,22,16);wall(22,16,22,32)
 if upper:
  wall(11,16,11,27);wall(18,16,18,24);wall(11,24,18,24)
  wall(0,27,18,27);wall(18,27,18,32)
  door(7,16);door(13,24);door(14,27);door(18.6,16)
 else:
  wall(10,16,10,32);wall(0,26,10,26);wall(5,26,5,32)
  door(6,16);door(1,26);door(6,26);door(15,16);door(15,32)
 door(7,12);door(20,12);door(13.5,12);door(12,2,False)
 # Staircase entered at front from living/landing; upper exit toward rear passage.
 door(22,28,False)
 for k in range(1,11):
  yy=19+k*.92
  wall(22.7,yy,25.5,yy);wall(26.5,yy,29.3,yy)
 wall(25.7,19,25.7,30);wall(26.3,19,26.3,30)
 text(*xy(26,18),'STAIR',14,weight=700)
 text(*xy(26,31.2),'8 × 16 zone',12)
 a,b=xy(24,28.5);line(a,b,a,b-95,'#63756a',1.5)
 line(a,b-95,a-5,b-86,'#63756a',1.5);line(a,b-95,a+5,b-86,'#63756a',1.5)
 window(3,0,8,0);window(21,0,27,0);window(14,0,16,0);window(0,3,0,8)
 window(30,3,30,8);window(0,19,0,23)
 if not upper:window(11,32,14,32);window(18.5,32,21,32)
 # Overall dimension labels.
 line(ox,oy-20,ox+30*S,oy-20,'#8c968e',1)
 text(ox+15*S,oy-27,'30 ft overall',14)
 text(ox-43,oy+16*S,'32 ft',14)
 text(ox+15*S,oy+32*S+31,'FRONT / ROAD SIDE',15,weight=700)

text(65,853,'READING THE PLAN',17,anchor='start',weight=700)
text(65,883,'Dimensions label planning zones, not clear finished room sizes. Wall thickness reduces usable room area.',16,anchor='start')
text(65,910,'Blue marks = windows. Curves = indicative door swings. Stair geometry and openings require detailed design.',16,anchor='start')
text(65,937,'Approx. 1,830 sq ft enclosed/covered across both floors; terrace finishing is additional. Porch and parking are outside this drawing.',16,anchor='start')
text(65,973,'For architect discussion only — not for construction, approval, structural sizing, or a fixed-price contract.',16,anchor='start',fill='#826444')
parts.append('</svg>')
(out/'latur-home-concept.svg').write_text('\n'.join(parts))
