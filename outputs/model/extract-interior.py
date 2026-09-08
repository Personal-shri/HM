from pathlib import Path
import runpy,json
base=Path(__file__).resolve().parent.parent
ns=runpy.run_path(str(base/'draw_main_furniture_v3.py'))
s=ns['source']
s=s.replace("def wall(x,y,u,v):ln(*xy(x,y),*xy(u,v))", "def wall(x,y,u,v):\n  walls.append([x,y,u,v]);ln(*xy(x,y),*xy(u,v))")
s=s.replace("def opening(x,y,u,v):ln", "def opening(x,y,u,v):\n  gaps.append([x,y,u,v]);ln")
s=s.replace("def item(x,y,w,h,label):", "def item(x,y,w,h,label):\n  furniture.append([x,y,w,h,label])")
env={'__file__':str(base/'draw_american_plan.py'),'walls':[],'gaps':[],'furniture':[]}
exec(compile(s,'interior-extract','exec'),env)
# Exclude schematic stair treads and handrails from full-height wall data.
walls=[v for v in env['walls'] if not (min(v[0],v[2])>16 and max(v[0],v[2])<26 and min(v[1],v[3])>=29 and max(v[1],v[3])<=40)]
# A narrow drawn TV screen is not an architectural wall.
walls=[v for v in walls if v[0]!=.55]
(base/'model/interior-data.json').write_text(json.dumps({'walls':walls,'gaps':env['gaps'],'openings':env['openings'],'furniture':env['furniture']},indent=2))
