"""Generate the Use Case diagram as a hand-crafted SVG.
Telsa Charging Points — Conception de Données."""
from pathlib import Path

OUT = Path(__file__).parent / "01_use_case.svg"

# Design tokens (matches project palette: Ink/Bone/Ember)
INK = "#0A0A0B"
BONE = "#F4F1EC"
PAPER = "#FFFFFF"
BEIGE = "#EDE9E0"
EMBER = "#E34E2C"
MUTED = "#9A968E"
YELLOW = "#FFF7D6"
YELLOW_BD = "#8A7400"

W, H = 1600, 1200

def stick_figure(cx, cy, label, sublabel=None):
    """Draw a stickman UML actor."""
    r = 14
    s = []
    s.append(f'<circle cx="{cx}" cy="{cy-36}" r="{r}" fill="{BONE}" stroke="{INK}" stroke-width="2"/>')
    # body
    s.append(f'<line x1="{cx}" y1="{cy-22}" x2="{cx}" y2="{cy+12}" stroke="{INK}" stroke-width="2"/>')
    # arms
    s.append(f'<line x1="{cx-16}" y1="{cy-10}" x2="{cx+16}" y2="{cy-10}" stroke="{INK}" stroke-width="2"/>')
    # legs
    s.append(f'<line x1="{cx}" y1="{cy+12}" x2="{cx-14}" y2="{cy+34}" stroke="{INK}" stroke-width="2"/>')
    s.append(f'<line x1="{cx}" y1="{cy+12}" x2="{cx+14}" y2="{cy+34}" stroke="{INK}" stroke-width="2"/>')
    s.append(f'<text x="{cx}" y="{cy+56}" text-anchor="middle" font-family="Inter Tight, sans-serif" font-size="13" font-weight="600" fill="{INK}">{label}</text>')
    if sublabel:
        s.append(f'<text x="{cx}" y="{cy+72}" text-anchor="middle" font-family="Inter Tight, sans-serif" font-size="11" fill="{MUTED}">{sublabel}</text>')
    return "\n".join(s)

def usecase_ellipse(cx, cy, rx, ry, text, sub=None, accent=False):
    fill = EMBER if accent else PAPER
    stroke = INK
    col = PAPER if accent else INK
    s = [f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{fill}" stroke="{stroke}" stroke-width="1.6"/>']
    if sub:
        s.append(f'<text x="{cx}" y="{cy-4}" text-anchor="middle" font-family="Inter Tight, sans-serif" font-size="12" font-weight="600" fill="{col}">{text}</text>')
        s.append(f'<text x="{cx}" y="{cy+12}" text-anchor="middle" font-family="Inter Tight, sans-serif" font-size="11" fill="{col}">{sub}</text>')
    else:
        s.append(f'<text x="{cx}" y="{cy+4}" text-anchor="middle" font-family="Inter Tight, sans-serif" font-size="12" font-weight="600" fill="{col}">{text}</text>')
    return "\n".join(s)

def pkg_rect(x, y, w, h, title):
    return f'''<g>
  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" ry="6" fill="{BEIGE}" stroke="{INK}" stroke-width="1.4"/>
  <path d="M {x} {y+22} L {x+w} {y+22}" stroke="{INK}" stroke-width="1.2"/>
  <text x="{x+14}" y="{y+16}" font-family="Inter Tight, sans-serif" font-size="12" font-weight="700" fill="{INK}">{title}</text>
</g>'''

def line(x1, y1, x2, y2, dashed=False, label=None, label_bg=True):
    dash = 'stroke-dasharray="5 4"' if dashed else ''
    s = [f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{INK}" stroke-width="1.2" {dash}/>']
    if label:
        mx, my = (x1+x2)/2, (y1+y2)/2
        tw = len(label)*6 + 10
        if label_bg:
            s.append(f'<rect x="{mx-tw/2}" y="{my-9}" width="{tw}" height="14" rx="3" fill="{BONE}" stroke="none"/>')
        s.append(f'<text x="{mx}" y="{my+2}" text-anchor="middle" font-family="Inter Tight, sans-serif" font-size="10" font-style="italic" fill="{INK}">{label}</text>')
    return "\n".join(s)

def arrow(x1, y1, x2, y2, dashed=False, label=None):
    """Line with arrowhead at (x2,y2)."""
    s = [line(x1,y1,x2,y2,dashed,label)]
    # arrowhead
    import math
    ang = math.atan2(y2-y1, x2-x1)
    ah = 8
    ax1 = x2 - ah*math.cos(ang - math.pi/7)
    ay1 = y2 - ah*math.sin(ang - math.pi/7)
    ax2 = x2 - ah*math.cos(ang + math.pi/7)
    ay2 = y2 - ah*math.sin(ang + math.pi/7)
    s.append(f'<polygon points="{x2},{y2} {ax1},{ay1} {ax2},{ay2}" fill="{INK}"/>')
    return "\n".join(s)

def generalization(x1, y1, x2, y2, label=None):
    """Inheritance arrow (empty triangle at x2,y2)."""
    import math
    s = [f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{INK}" stroke-width="1.2"/>']
    ang = math.atan2(y2-y1, x2-x1)
    ah = 12
    ax1 = x2 - ah*math.cos(ang - math.pi/7)
    ay1 = y2 - ah*math.sin(ang - math.pi/7)
    ax2 = x2 - ah*math.cos(ang + math.pi/7)
    ay2 = y2 - ah*math.sin(ang + math.pi/7)
    s.append(f'<polygon points="{x2},{y2} {ax1},{ay1} {ax2},{ay2}" fill="{PAPER}" stroke="{INK}" stroke-width="1.2"/>')
    if label:
        mx, my = (x1+x2)/2, (y1+y2)/2
        s.append(f'<text x="{mx+6}" y="{my}" font-family="Inter Tight, sans-serif" font-size="10" font-style="italic" fill="{MUTED}">{label}</text>')
    return "\n".join(s)

parts = []
parts.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" font-family="Inter Tight, sans-serif">')
parts.append(f'<rect width="{W}" height="{H}" fill="{BONE}"/>')

# Title block
parts.append(f'<text x="{W/2}" y="42" text-anchor="middle" font-family="Inter Tight, sans-serif" font-size="22" font-weight="800" fill="{INK}">Telsa Charging Points</text>')
parts.append(f'<text x="{W/2}" y="66" text-anchor="middle" font-family="Inter Tight, sans-serif" font-size="13" fill="{MUTED}">Diagramme de cas d\'utilisation — acteurs, frontières &amp; relations</text>')
parts.append(f'<line x1="120" y1="82" x2="{W-120}" y2="82" stroke="{INK}" stroke-width="0.6"/>')

# Primary actors left side
parts.append(stick_figure(90, 260, "Visiteur"))
parts.append(stick_figure(90, 520, "Propriétaire", "vérifié"))
parts.append(stick_figure(90, 780, "Administrateur"))

# Generalization arrows
parts.append(generalization(90, 480, 90, 330, "hérite de"))
parts.append(generalization(90, 740, 90, 590, "hérite de"))

# Secondary actors right side
parts.append(stick_figure(W-90, 260, "Registre ERP", "«system»"))
parts.append(stick_figure(W-90, 420, "Stockage fichiers", "«system»"))
parts.append(stick_figure(W-90, 580, "SMTP", "«system»"))
parts.append(stick_figure(W-90, 740, "Twilio SMS", "«system»"))
parts.append(stick_figure(W-90, 900, "Réviseur", "«humain»"))

# System boundary
parts.append(f'<rect x="200" y="120" width="{W-400}" height="{H-240}" rx="10" ry="10" fill="{PAPER}" stroke="{INK}" stroke-width="1.8" stroke-dasharray="2 0"/>')
parts.append(f'<text x="220" y="150" font-family="Inter Tight, sans-serif" font-size="13" font-weight="700" fill="{INK}">Système :: Telsa Charging Points</text>')

# Package: Vérification (top)
parts.append(pkg_rect(240, 170, 540, 240, "Vérification du véhicule"))
parts.append(usecase_ellipse(370, 230, 110, 30, "Vérifier véhicule local", "(chassis + plaque)"))
parts.append(usecase_ellipse(650, 230, 110, 30, "Vérifier véhicule", "étranger (carte grise)"))
parts.append(usecase_ellipse(320, 320, 70, 22, "Consulter ERP"))
parts.append(usecase_ellipse(500, 320, 90, 22, "Rate-limit IP"))
parts.append(usecase_ellipse(660, 320, 90, 22, "Téléverser carte grise"))
parts.append(usecase_ellipse(750, 380, 70, 22, "Arbitrer dossier", ""))
# Actually replace the last one
# (use case accent for pending admin arbitration)

# Package: Authentification (middle)
parts.append(pkg_rect(240, 430, 540, 340, "Compte & Authentification"))
parts.append(usecase_ellipse(370, 490, 100, 26, "Créer un compte"))
parts.append(usecase_ellipse(650, 490, 110, 26, "Confirmer e-mail"))
parts.append(usecase_ellipse(370, 560, 100, 26, "Se connecter"))
parts.append(usecase_ellipse(650, 560, 90, 26, "Vérifier OTP"))
parts.append(usecase_ellipse(370, 625, 100, 22, "Renvoyer OTP"))
parts.append(usecase_ellipse(650, 625, 110, 22, "Rafraîchir session"))
parts.append(usecase_ellipse(370, 685, 100, 22, "Se déconnecter"))
parts.append(usecase_ellipse(650, 685, 110, 22, "Verrouiller compte", accent=True))
parts.append(usecase_ellipse(510, 735, 85, 20, "Limiter débit"))

# Package: Usage (lower left)
parts.append(pkg_rect(240, 790, 260, 260, "Usage authentifié"))
parts.append(usecase_ellipse(370, 860, 110, 26, "Consulter bornes", "à proximité"))
parts.append(usecase_ellipse(370, 960, 100, 26, "Consulter compte"))

# Package: Admin (lower right)
parts.append(pkg_rect(520, 790, 260, 260, "Administration"))
parts.append(usecase_ellipse(650, 840, 100, 22, "Statistiques"))
parts.append(usecase_ellipse(650, 885, 100, 22, "Lister utilisateurs"))
parts.append(usecase_ellipse(650, 930, 100, 22, "Consulter utilisateur"))
parts.append(usecase_ellipse(650, 975, 100, 22, "Supprimer utilisateur"))
parts.append(usecase_ellipse(650, 1020, 110, 22, "Ajouter entrée ERP"))

# Actor → Use case associations (Visitor)
parts.append(line(125, 260, 260, 230))
parts.append(line(125, 260, 540, 230))
parts.append(line(125, 260, 270, 490))
parts.append(line(125, 260, 550, 490))
parts.append(line(125, 260, 270, 560))

# Propriétaire
parts.append(line(125, 520, 260, 860))
parts.append(line(125, 520, 270, 960))
parts.append(line(125, 520, 550, 625))
parts.append(line(125, 520, 270, 625))
parts.append(line(125, 520, 270, 685))

# Admin
parts.append(line(125, 780, 550, 840))
parts.append(line(125, 780, 550, 885))
parts.append(line(125, 780, 550, 930))
parts.append(line(125, 780, 550, 975))
parts.append(line(125, 780, 540, 1020))

# Secondary actors arrows (into system)
parts.append(arrow(W-125, 260, 390, 320, dashed=True))
parts.append(arrow(W-125, 420, 730, 320, dashed=True))
parts.append(arrow(W-125, 580, 760, 490, dashed=True, label="«invoque»"))
parts.append(arrow(W-125, 740, 740, 560, dashed=True, label="«invoque»"))
parts.append(arrow(W-125, 900, 790, 400, dashed=True))

# Include/extend relations inside packages
parts.append(arrow(370, 260, 320, 308, dashed=True, label="«include»"))
parts.append(arrow(370, 260, 480, 308, dashed=True, label="«include»"))
parts.append(arrow(650, 260, 660, 308, dashed=True, label="«include»"))
parts.append(arrow(650, 260, 730, 370, dashed=True, label="«include»"))
parts.append(arrow(370, 516, 370, 540, dashed=True, label=""))
parts.append(arrow(370, 540, 370, 540, dashed=True))
parts.append(arrow(370, 516, 650, 478, dashed=True, label="«include»"))
# login → OTP
parts.append(arrow(420, 560, 600, 560, dashed=True, label="«include»"))
# login → rate-limit
parts.append(arrow(420, 572, 475, 735, dashed=True, label="«include»"))
# OTP → rate-limit
parts.append(arrow(650, 580, 540, 735, dashed=True, label="«include»"))
# lock extends login
parts.append(arrow(600, 685, 420, 575, dashed=True, label="«extend»"))
# register → verify local (precondition)
parts.append(arrow(320, 478, 340, 260, dashed=True, label="«precondition»"))

# Legend & notes
parts.append(f'''<g>
  <rect x="{W-430}" y="1050" width="410" height="130" rx="8" fill="{YELLOW}" stroke="{YELLOW_BD}" stroke-width="1.4"/>
  <text x="{W-420}" y="1075" font-family="Inter Tight, sans-serif" font-size="12" font-weight="700" fill="{INK}">Sécurité &amp; gouvernance</text>
  <text x="{W-420}" y="1095" font-family="Inter Tight, sans-serif" font-size="11" fill="{INK}">• JWT stateless (access + refresh) — rotation systématique</text>
  <text x="{W-420}" y="1112" font-family="Inter Tight, sans-serif" font-size="11" fill="{INK}">• Refresh stocké hashé SHA-256, jamais en clair</text>
  <text x="{W-420}" y="1129" font-family="Inter Tight, sans-serif" font-size="11" fill="{INK}">• OTP à durée limitée, verrouillage après N échecs</text>
  <text x="{W-420}" y="1146" font-family="Inter Tight, sans-serif" font-size="11" fill="{INK}">• Rate-limit IP sur toute porte d\'entrée publique</text>
  <text x="{W-420}" y="1163" font-family="Inter Tight, sans-serif" font-size="11" fill="{INK}">• Administration réservée à ROLE_ADMIN (SecurityConfig)</text>
</g>''')

parts.append(f'''<g>
  <rect x="20" y="1050" width="380" height="130" rx="8" fill="{PAPER}" stroke="{INK}" stroke-width="1.2"/>
  <text x="30" y="1075" font-family="Inter Tight, sans-serif" font-size="12" font-weight="700" fill="{INK}">Légende</text>
  <ellipse cx="55" cy="1098" rx="25" ry="9" fill="{PAPER}" stroke="{INK}" stroke-width="1.2"/>
  <text x="90" y="1102" font-size="11" fill="{INK}">cas d\'utilisation</text>
  <line x1="30" y1="1125" x2="60" y2="1125" stroke="{INK}" stroke-width="1.2"/>
  <text x="70" y="1128" font-size="11" fill="{INK}">association</text>
  <line x1="200" y1="1125" x2="230" y2="1125" stroke="{INK}" stroke-width="1.2" stroke-dasharray="5 4"/>
  <text x="240" y="1128" font-size="11" fill="{INK}">«include» / «extend»</text>
  <polygon points="30,1150 50,1145 50,1155" fill="{PAPER}" stroke="{INK}" stroke-width="1.2"/>
  <line x1="50" y1="1150" x2="80" y2="1150" stroke="{INK}" stroke-width="1.2"/>
  <text x="90" y="1153" font-size="11" fill="{INK}">généralisation (héritage d\'acteur)</text>
</g>''')

parts.append('</svg>')

OUT.write_text("\n".join(parts), encoding="utf-8")
print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")
