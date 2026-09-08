"""Keep the main floor and stair stack; move upper bedrooms toward the rear."""
from pathlib import Path
import json

base=Path(__file__).resolve().parent
wrapper=(base/'draw_dimensioned_plan.py').read_text()
wrapper=wrapper[:wrapper.index('exec(compile(source,str(base')]
exec(compile(wrapper,str(base/'draw_dimensioned_plan.py'),'exec'))
upper='''
 if up:
  # Local plan coordinates: y=0 at rear, y=48 at street.
  def R(x,y,w,h,name,dim='',color='#eeeade'):
   room(x,48-y-h,w,h,name,dim,color)
  def L(x,y,u,v):wall(x,48-y,u,48-v)
  def O(x,y,u,v):opening(x,48-y,u,48-v)
  def T(x,y,label,size=14,bold=False):txt(*xy(x,48-y),label,size,bold)
  def D(x,y,width=3,vertical=False):
   a,b=xy(x,48-y);r=width*S
   if vertical:
    O(x,y,x,y+width);ln(a,b,a-r,b,'#859084',1.3)
    P.append(f'<path d="M{a-r},{b} A{r},{r} 0 0 0 {a},{b+r}" stroke="#859084" stroke-width="1.2" fill="none"/>')
   else:
    O(x,y,x+width,y);ln(a,b,a,b-r,'#859084',1.3)
    P.append(f'<path d="M{a},{b-r} A{r},{r} 0 0 1 {a+r},{b}" stroke="#859084" stroke-width="1.2" fill="none"/>')
   code='D2' if width==3.5 else 'D3'
   record(code,width,7,x,48-y)
   tag(x if vertical else x+width/2,48-y-width/2 if vertical else 48-y,code)
  def W(x,y,u,v,code='W1',height=6):glazed(x,48-y,u,48-v,code,height)
  txt(ox+22*S,156,'UPPER FLOOR — BEDROOMS TO REAR',22,True)
  txt(ox+22*S,182,'≈1,756 sq ft enclosed · staircase stays aligned',16)
  R(0,0,16,16,'BEDROOM 3','16 × 16 ft','#e3ecdc')
  R(30,0,14,16,'BEDROOM 4','14 × 16 ft','#e3ecdc')
  R(30,16,14,14,'BEDROOM 5','14 × 14 ft','#e3ecdc')
  R(16,0,14,6,'REAR LANDING','14 × 6 ft','#f6f1e7')
  R(26,6,4,28,'','','#f6f1e7')
  R(0,16,10,6,'ENSUITE','10 × 6 ft','#dcebef')
  R(10,16,6,6,'W.I.C.','6 × 6 ft','#eeeade')
  R(16,22,8,6,'BATH 2','8 × 6 ft','#dcebef')
  R(16,28,8,6,'BATH 3','8 × 6 ft','#dcebef')
  R(24,22,2,12,'','','#f6f1e7')
  R(0,22,16,16,'FAMILY LOFT','16 × 16 ft','#f2e5d0')
  R(30,30,8,4,'LINEN','8 × 4 ft','#eeeade')
  R(38,30,6,4,'LANDING','','#f6f1e7')
  R(16,34,14,14,'SECOND KITCHEN','14 × 14 ft','#f2e5d0')
  R(0,38,16,10,'FRONT BALCONY','16 × 10 ft','#e2ebd8')
  R(30,34,14,14,'FRONT TERRACE','14 × 14 ft','#e2ebd8')
  R(16,6,10,16,'','','#e8e8e1')
  for e in [(0,0,44,0),(44,0,44,48),(44,48,0,48),(0,48,0,0),
   (16,0,16,22),(26,6,26,22),(16,6,26,6),(16,22,26,22),
   (30,0,30,30),(30,16,44,16),(0,16,16,16),(0,22,24,22),
   (10,16,10,22),(16,22,16,38),(16,28,24,28),(16,34,24,34),(24,22,24,34),
   (30,30,44,30),(30,34,44,34),(30,34,30,48),(0,38,16,38),(16,38,16,48)]:L(*e)
  D(16,1,3.5,True);D(30,1,3.5,True);D(30,24,3.5,True)
  D(3,16);D(11,16);D(24,23,3,True);D(24,29,3,True)
  D(16,42,3,True);D(30,41,3,True)
  O(26,7,26,10)
  # Open front route connects the stair hall, kitchen and loft.
  O(16,34.5,16,37.5)
  slider(4,48-38,7,'S1',8)
  W(3,0,11,0);W(33,0,41,0);W(0,4,0,12);W(44,4,44,12)
  W(44,19,44,27);W(0,26,0,34);W(19,48,25,48,'W3',4);W(0,17,0,19,'V1',2)
  # Exactly the same staircase bounding box and tread positions as main floor.
  T(21,20,'STAIR',14,True);T(21,7,'10 × 16 ft',12)
  for k in range(11):
   y=48-(29+k*.9)
   L(16.8,y,20.5,y);L(21.5,y,25.2,y)
  L(20.7,19,20.7,8);L(21.3,19,21.3,8)
  dimension(-3,0,-3,48,'48 ft')
  dimension(46,48,46,32,'16 ft');dimension(46,32,46,18,'14 ft');dimension(46,18,46,0,'18 ft')
  dimension(0,-2,16,-2,'16 ft');dimension(16,-2,30,-2,'14 ft');dimension(30,-2,44,-2,'14 ft')
  tag(28,34,'4 ft')
  txt(ox+34*S,oy-15,'44 ft overall',14)
  txt(ox+22*S,oy+55*S,'FRONT / STREET',15,True)
  continue
'''
source=source.replace(' txt(ox+22*S,156,',upper+'\n txt(ox+22*S,156,',1)
source=source.replace("'Upper floor also mirrored to keep stairs aligned; its balcony and terrace now face the rear. W.I.C. = walk-in closet.'", "'Upper bedrooms occupy the rear and rear-right; loft, second kitchen, balcony and terrace face the front. Stairs stay aligned.'")
source=source.replace("'american-dimensioned.svg'", "'american-upper-rear.svg'")
exec(compile(source,str(base/'draw_american_plan.py'),'exec'))
(base/'opening-schedule-upper-rear.json').write_text(json.dumps(openings,indent=2))
