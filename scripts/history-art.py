# Original illustrations for History Archive stories (no copied images). Run: python3 scripts/history-art.py
import os
OUT="public/img/history"; W,H=800,450
G="#0f5132"; G2="#1a7a4c"; GL="#e8f3ec"; GOLD="#c9a227"; SAND="#e9dcc0"; EARTH="#8a6a3b"; INK="#1d2b24"
def svg(name, body, sky=("#f6e7c1","#f3d9a0")):
    s=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{sky[0]}"/><stop offset="1" stop-color="{sky[1]}"/></linearGradient></defs><rect width="{W}" height="{H}" fill="url(#sky)"/>{body}</svg>'''
    open(os.path.join(OUT,name+".svg"),"w").write(s)
def hut(x,y,s=1,wall="#b98a55",roof="#6b4f2a"):
    return f'<g transform="translate({x},{y}) scale({s})"><rect x="-40" y="-50" width="80" height="50" fill="{wall}"/><rect x="-10" y="-30" width="20" height="30" fill="#4a3620"/><path d="M-55 -48 L0 -105 L55 -48 Z" fill="{roof}"/><path d="M-55 -48 L0 -105 L55 -48" fill="none" stroke="#4a3620" stroke-width="3"/></g>'
def tree(x,y,s=1,c=G2):
    return f'<g transform="translate({x},{y}) scale({s})"><rect x="-5" y="-40" width="10" height="40" fill="#5b4a2e"/><ellipse cx="0" cy="-62" rx="46" ry="30" fill="{c}"/><ellipse cx="-22" cy="-52" rx="26" ry="18" fill="{c}"/><ellipse cx="24" cy="-50" rx="26" ry="18" fill="{c}"/></g>'
def hills(c="#c9b07a",y=300): return f'<path d="M0 {y} Q120 {y-70} 240 {y-20} T480 {y-30} T800 {y-50} V{H} H0Z" fill="{c}"/>'
def ground(c=SAND,y=330): return f'<rect y="{y}" width="{W}" height="{H-y}" fill="{c}"/>'
def sun(x=650,y=110,r=48,c="#f2b632"): return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}" opacity=".9"/>'
def label(t): return f'<rect x="24" y="{H-62}" rx="8" width="{len(t)*13+28}" height="40" fill="{G}" opacity=".92"/><text x="38" y="{H-35}" font-family="Georgia,serif" font-size="22" font-weight="700" fill="#fff">{t}</text>'

# 1 Marghi plains
b=sun()+hills("#d2b783",290)+ground()+hut(220,360)+hut(330,375,.8)+hut(470,365,.9,"#c49a63")+tree(620,370,1.1)+tree(90,365,.9)
b+='<path d="M0 410 C200 395 600 425 800 400 V450 H0Z" fill="#cfa95f"/>'+''.join(f'<path d="M{x} 420 l6 -26 l6 26" stroke="{G2}" stroke-width="3" fill="none"/>' for x in range(30,780,38))+label("The Marghi plains")
svg("marghi-plains",b)
# 2 calabash
def cal(x,y,r,c="#d9a441",band=True):
    s=f'<g><ellipse cx="{x}" cy="{y}" rx="{r}" ry="{r*.62}" fill="{c}"/><ellipse cx="{x}" cy="{y-r*.42}" rx="{r*.82}" ry="{r*.2}" fill="#a8742a"/>'
    if band:
        s+=f'<path d="M{x-r*.9} {y} Q{x} {y+r*.35} {x+r*.9} {y}" stroke="#5b3a14" stroke-width="3" fill="none"/>'
        s+=''.join(f'<path d="M{x-r*.7+i*r*.28} {y+r*.12} l{r*.07} {r*.14} l{r*.07} -{r*.14}" stroke="#5b3a14" stroke-width="2.5" fill="none"/>' for i in range(6))
    return s+'</g>'
b=ground("#efe2c4",300)+'<rect y="300" width="800" height="12" fill="#d8c59c"/>'+cal(210,330,110)+cal(430,350,80,"#e0b35a")+cal(600,320,95,"#cf9a3b")+cal(330,395,55,"#e6be6b",False)+cal(700,400,50,"#d9a441",False)+label("The calabash trade")
svg("calabash",b,("#fbf1dc","#f4e2bb"))
# 3 smiths: anvil + hammer + fire
b=ground("#6b5a45",320)+'<rect width="800" height="320" fill="#3b2f25"/>'
b+='<ellipse cx="160" cy="300" rx="110" ry="40" fill="#e0752d" opacity=".55"/><path d="M110 300 q20 -90 50 -40 q15 -70 40 0 q20 -50 30 10z" fill="#f2b632"/><path d="M135 300 q15 -50 30 -20 q12 -40 25 5z" fill="#ffe08a"/>'
b+='<path d="M380 250 h260 q-30 20 -60 25 v45 h40 v30 h-180 v-30 h40 v-45 q-70 -5 -100 -25z" fill="#2a2a2a"/><path d="M380 250 h260" stroke="#555" stroke-width="4"/>'
b+='<g transform="rotate(-30 560 190)"><rect x="500" y="100" width="14" height="150" rx="6" fill="#8a5a2b"/><rect x="470" y="80" width="75" height="34" rx="5" fill="#4a4a4a"/></g>'
b+=''.join(f'<circle cx="{510+i*17}" cy="{230-(i%3)*14}" r="3" fill="#ffcf4a"/>' for i in range(6))+label("Smiths and hunters")
svg("smiths",b,("#3b2f25","#3b2f25"))
# 4 1976 document
b=f'<rect width="800" height="450" fill="{GL}"/><rect x="230" y="40" width="340" height="360" fill="#fff" stroke="#cfd8d2" stroke-width="3"/>'
b+=''.join(f'<rect x="270" y="{120+i*30}" width="{260 - (i%3)*40}" height="8" rx="4" fill="#cfd8d2"/>' for i in range(7))
b+=f'<text x="400" y="100" text-anchor="middle" font-family="Georgia,serif" font-size="40" font-weight="700" fill="{G}">1976</text><circle cx="490" cy="350" r="38" fill="{GOLD}"/><circle cx="490" cy="350" r="28" fill="none" stroke="#fff" stroke-width="3"/><path d="M478 350 l9 9 l17 -19" stroke="#fff" stroke-width="5" fill="none"/>'
b+=f'<rect x="80" y="120" width="110" height="70" fill="{G}"/><rect x="116" y="120" width="38" height="70" fill="#fff"/><rect x="78" y="110" width="4" height="200" fill="#555"/>'+label("Damboa LGA is created")
svg("lga-1976",b)
# 5 Sambisa
def ele(x,y,s=1): return f'<g transform="translate({x},{y}) scale({s})" fill="#5d6560"><ellipse cx="0" cy="-60" rx="70" ry="45"/><rect x="-55" y="-35" width="20" height="45"/><rect x="-20" y="-35" width="20" height="45"/><rect x="20" y="-35" width="20" height="45"/><rect x="45" y="-35" width="18" height="45"/><circle cx="72" cy="-78" r="32"/><path d="M95 -70 q25 30 10 70 h-12 q12 -35 -10 -60z"/><path d="M62 -95 q-30 0 -25 40 q25 -5 25 -40z" fill="#4c534f"/></g>'
b=sun(150,100,40,"#f5c443")+hills("#9cb57a",300)+ground("#b8c98c",320)+''.join(tree(x,330+(i%2)*15,.9+((i*7)%5)/10,["#2f6b3a","#3b7d45","#1f5a2e"][i%3]) for i,x in enumerate(range(20,820,90)))+ele(430,400,1)+'<g fill="#3a2a1a">'+''.join(f'<path d="M{x} {y} q8 -8 16 0 q8 -8 16 0" stroke="#3a2a1a" stroke-width="3" fill="none"/>' for x,y in [(520,90),(570,120),(480,130)])+'</g>'+label("Sambisa Forest")
svg("sambisa",b,("#cfe6f2","#eef6e8"))
# 6 2014 remembrance
b='<rect width="800" height="450" fill="#1d2b24"/>'+''.join(f'<g transform="translate({x},300)"><rect x="-12" y="-60" width="24" height="90" rx="4" fill="#efe6d2"/><path d="M0 -95 q14 18 0 32 q-14 -14 0 -32z" fill="#f2b632"/><circle cx="0" cy="-75" r="26" fill="#f2b632" opacity=".18"/></g>' for x in (250,330,400,470,550))
b+='<text x="400" y="140" text-anchor="middle" font-family="Georgia,serif" font-size="30" fill="#efe6d2">We remember</text>'+label("2014")
svg("remember-2014",b,("#1d2b24","#1d2b24"))
# 7 retaken: sunrise flag
b=sun(400,300,120,"#f4a73b")+'<rect y="300" width="800" height="150" fill="#3d4a3a"/>'+''.join(hut(x,330,.55,"#6c5a45","#3b2f25") for x in (120,220,560,660))
b+=f'<rect x="396" y="120" width="8" height="190" fill="#333"/><rect x="404" y="120" width="40" height="60" fill="{G}"/><rect x="417" y="120" width="14" height="60" fill="#fff"/><rect x="444" y="120" width="40" height="60" fill="{G}"/>'+label("August 2014")
svg("retaken",b,("#f9d9a6","#f2b46b"))
# 8 road home
b=sun(660,90,40)+hills("#d7c08f",280)+'<path d="M330 450 L390 290 H410 L470 450Z" fill="#6f6a62"/><path d="M398 300 v20 M398 340 v28 M398 390 v40" stroke="#f5f0e6" stroke-width="6"/>'+ground("#e5d3a7",290).replace('<rect','<rect opacity="0"')
b+='<g transform="translate(250,350)"><rect x="0" y="0" width="120" height="50" rx="6" fill="#2f6b9a"/><rect x="120" y="15" width="40" height="35" rx="5" fill="#2f6b9a"/><rect x="128" y="20" width="22" height="14" fill="#cfe6f2"/><rect x="5" y="-30" width="110" height="30" fill="#c9a227"/><circle cx="30" cy="55" r="12" fill="#222"/><circle cx="130" cy="55" r="12" fill="#222"/></g>'+tree(110,330)+tree(700,320,.8)+label("The road home")
svg("road-home",b)
# 9 market 2016
def stall(x,c): return f'<g transform="translate({x},330)"><rect x="-60" y="-10" width="120" height="60" fill="#8a6a3b"/><path d="M-70 -10 L-55 -60 H55 L70 -10Z" fill="{c}"/><path d="M-55 -60 H55" stroke="#fff" stroke-width="4" stroke-dasharray="14 10"/>'+''.join(f'<circle cx="{-40+i*20}" cy="-18" r="9" fill="{["#e2a23b","#c0392b","#6b8e23","#d4a017","#8e5a2b"][i]}"/>' for i in range(5))+'</g>'
b=sun(700,90,40)+ground("#e5d3a7",330)+stall(150,G)+stall(400,"#c0392b")+stall(650,GOLD)+label("Market reopens, 2016")
svg("market-2016",b,("#d8eef7","#f4ead4"))
# 10 livestock 2024
def cow(x,y,s=1,c="#7a5230"): return f'<g transform="translate({x},{y}) scale({s})" fill="{c}"><ellipse cx="0" cy="-45" rx="55" ry="28"/><rect x="-42" y="-25" width="12" height="35"/><rect x="-20" y="-25" width="12" height="35"/><rect x="14" y="-25" width="12" height="35"/><rect x="34" y="-25" width="12" height="35"/><ellipse cx="62" cy="-58" rx="18" ry="14"/><path d="M58 -70 q-10 -22 -26 -18 M70 -70 q14 -20 26 -14" stroke="#e9dcc0" stroke-width="5" fill="none"/><path d="M-55 -50 q-15 10 -10 30" stroke="{c}" stroke-width="4" fill="none"/></g>'
b=sun(120,90,40)+hills("#d2b783",300)+ground("#e2cc98",320)+cow(230,400,1)+cow(450,390,.9,"#e9e2d6")+cow(640,405,1.05,"#4b3621")+tree(760,330,.8)+label("Monday Market returns, 2024")
svg("livestock-2024",b,("#d8eef7","#f4ead4"))
print("ok")
