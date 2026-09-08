"""Front-living alternative; preserve the earlier American-house concept."""
from pathlib import Path

base = Path(__file__).resolve().parent
source = (base / 'draw_american_plan.py').read_text()
source = source.replace("'AMERICAN FAMILY HOUSE'", "'AMERICAN HOUSE — FRONT LIVING'")
source = source.replace("'Five bedrooms • Main-level parents’ suite • Island kitchen • Separate laundry • Upstairs kitchenette'", "'Great room and kitchen face the street • Bedrooms behind • Rear patio + front-left sitting patio'")
# Mirror both stories front-to-back, keeping the staircase vertically aligned.
source = source.replace('def xy(x,y):return ox+x*S,oy+y*S', 'def xy(x,y):return ox+x*S,oy+(48-y)*S')
source = source.replace('a,b=xy(x,y);P.append', 'a,b=xy(x,y+h);P.append')
source = source.replace("opening(x,y,x,y+3);ln(a,b,a-r,b", "opening(x,y,x,y+3);ln(a,b,a-r,b")
source = source.replace('0 0 0 {a},{b+r}', '0 0 1 {a},{b-r}')
source = source.replace('ln(a,b,a,b-r', 'ln(a,b,a,b+r')
source = source.replace('M{a},{b-r} A{r},{r} 0 0 1', 'M{a},{b+r} A{r},{r} 0 0 0')
source = source.replace("room(0,-7,24,7,'REAR DECK / PATIO','24 × 7 ft'", "room(0,-8,24,8,'FRONT-LEFT SITTING PATIO','24 × 8 ft'")
source = source.replace("room(16,48,14,6,'COVERED FRONT PORCH','14 × 6 ft'", "room(10,48,24,8,'REAR DECK / PATIO','24 × 8 ft'")
source = source.replace("room(16,42,10,6,'FOYER','10 × 6'", "room(16,42,10,6,'REAR ENTRY','10 × 6'")
source = source.replace("room(24,0,20,14,'','','#f2e5d0',False)", "room(24,0,20,14,'','','#f2e5d0',False)\n  room(18,0,6,6,'FOYER','6 × 6','#f6f1e7')")
source = source.replace('opening(24,5,24,12);', 'opening(24,8,24,14);')
source = source.replace("txt(*xy(12,3),'GREAT ROOM · 24 × 20 ft',16,True)", "txt(*xy(9,3),'GREAT ROOM',16,True)\n  txt(*xy(9,4.5),'24 × 20 ft overall*',13)\n  wall(18,0,18,6);wall(18,6,24,6)\n  opening(21,6,24,6);opening(20,0,23,0)")
source = source.replace('win(16,0,21,0);', 'win(16,0,17.5,0);')
source = source.replace("'AMERICAN LAYOUT: welcoming foyer → open kitchen / dining / great room → rear patio'", "'FRONT: patio + foyer + great room + kitchen     |     REAR: bedrooms + services + rear patio'")
source = source.replace("'W.I.C. = walk-in closet. Dimensions are approximate planning zones; finished clear sizes depend on walls.'", "'*Great-room zone includes a 6 × 6 ft foyer. Dimensions are planning zones; finished clear sizes depend on walls.'")
source = source.replace("'Five bedrooms, five bathrooms, two kitchens, laundry and storage. Garage is not included.'", "'Upper floor also mirrored to keep stairs aligned; its balcony and terrace now face the rear. W.I.C. = walk-in closet.'")
source = source.replace("'american-family-house.svg'", "'american-front-living.svg'")
exec(compile(source, str(base / 'draw_american_plan.py'), 'exec'))
