from pathlib import Path

original=(Path(__file__).resolve().parent / 'draw_plan.py').read_text()
header=original[:original.index(' text(ox,161')]
header=header.replace('S=17','S=15').replace('LATUR FAMILY HOME','LATUR FAMILY HOME — LARGER ROOMS').replace('₹45 lakh budget target','Larger-room option; budget revision needed')
exec(header+'''
 text(ox,161,'UPPER FLOOR' if upper else 'GROUND FLOOR',22,anchor='start',weight=700)
 text(ox,188,'≈1,092 sq ft enclosed + 132 sq ft terrace' if upper else '≈1,224 sq ft covered footprint',16,anchor='start')
 zone(0,0,14,14,'BEDROOM 1' if upper else 'PARENTS','14 × 14 ft zone','#e5eddf')
 zone(20,0,14,14,'BEDROOM 2' if upper else 'EXTRA BEDROOM','14 × 14 ft zone','#e5eddf')
 zone(14,0,6,7,'ATT. BATH','6 × 7 zone','#e1edf0')
 zone(14,7,6,7,'BATH','6 × 7 zone','#e1edf0')
 zone(0,14,34,4,'SHARED PASSAGE','', '#f4f0e8')
 if upper:
  zone(0,18,14,12,'BEDROOM 3','14 × 12 ft zone','#e5eddf')
  zone(14,18,8,9,'KITCHEN','8 × 9 zone','#f3e5ce')
  zone(22,18,4,18,'','', '#f4f0e8')
  zone(14,27,8,3,'','', '#f4f0e8')
  zone(0,30,22,6,'OPEN TERRACE','22 × 6 ft zone','#e2ebd6')
 else:
  zone(0,18,12,12,'KITCHEN','12 × 12 ft zone','#f3e5ce')
  zone(0,30,6,6,'STORE','6 × 6 zone','#f3e5ce')
  zone(6,30,6,6,'LAUNDRY','6 × 6 zone','#d7e9ef')
  zone(12,18,14,18,'LIVING / DINING','14 × 18 ft zone','#f3e5ce')
 zone(26,18,8,18,'','','#e9e8e3')
 wall(0,0,34,0);wall(34,0,34,36);wall(34,36,0,36);wall(0,36,0,0)
 wall(14,0,14,14);wall(20,0,20,14);wall(14,7,20,7);wall(0,14,34,14)
 wall(0,18,26,18);wall(26,18,26,36)
 if upper:
  wall(14,18,14,30);wall(22,18,22,27);wall(14,27,22,27)
  wall(0,30,22,30);wall(22,30,22,36)
  door(8,18);door(16,27);door(18,30);door(22.5,18)
 else:
  wall(12,18,12,36);wall(0,30,12,30);wall(6,30,6,36)
  door(7,18);door(1,30);door(7,30);door(17,18);door(18,36)
  # Open connection between kitchen and living/dining.
  line(*xy(12,22),*xy(12,26),'#faf8f3',6)
  window(8,36,11,36)
 door(8,14);door(22,14);door(15.5,14);door(14,2,False)
 door(26,32,False)
 for k in range(1,12):
  yy=21+k*.95
  wall(26.7,yy,29.5,yy);wall(30.5,yy,33.3,yy)
 wall(29.7,21,29.7,33);wall(30.3,21,30.3,33)
 text(*xy(30,20),'STAIR',14,weight=700)
 text(*xy(30,35),'8 × 18 zone',12)
 a,b=xy(28,31.5);line(a,b,a,b-95,'#63756a',1.5)
 line(a,b-95,a-5,b-86,'#63756a',1.5);line(a,b-95,a+5,b-86,'#63756a',1.5)
 window(3,0,9,0);window(23,0,30,0);window(16,0,18,0);window(0,3,0,9)
 window(34,3,34,9);window(0,21,0,27)
 if not upper:window(14,36,17,36);window(22,36,25,36)
 line(ox,oy-20,ox+34*S,oy-20,'#8c968e',1)
 text(ox+17*S,oy-27,'34 ft overall',14)
 text(ox-43,oy+18*S,'36 ft',14)
 text(ox+17*S,oy+36*S+31,'FRONT / ROAD SIDE',15,weight=700)

text(65,853,'LARGER-ROOM OPTION',17,anchor='start',weight=700)
text(65,883,'Planning-zone dimensions, not finished clear sizes. Total covered/enclosed area ≈2,316 sq ft, plus open terrace.',16,anchor='start')
text(65,910,'Laundry: washer, compact sink/counter, floor drain and front window; outdoor drying space to be placed on the site plan.',16,anchor='start')
text(65,937,'Door swings are indicative. Architect to resolve wall thickness, bathroom/kitchen exhaust, stairs, structure and setbacks.',16,anchor='start')
text(65,973,'Concept only — not for construction. This enlarged option has not been verified to fit the ₹45 lakh total budget.',16,anchor='start',fill='#826444')
parts.append('</svg>')
(out/'latur-home-larger-rooms.svg').write_text(chr(10).join(parts))
''')
