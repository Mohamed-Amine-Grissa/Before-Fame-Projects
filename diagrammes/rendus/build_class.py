"""Generate the Class diagram as a hand-crafted SVG."""
from pathlib import Path
import math

OUT = Path(__file__).parent / "02_class_diagram.svg"

INK = "#0A0A0B"
BONE = "#F4F1EC"
PAPER = "#FFFFFF"
BEIGE = "#EDE9E0"
EMBER = "#E34E2C"
MUTED = "#9A968E"
YELLOW = "#FFF7D6"
YELLOW_BD = "#8A7400"
ACCENT_BG = "#FBE3DC"

W, H = 2200, 1600

def cls(x, y, w, name, attrs, methods, kind="class", aggregate=False):
    """Draw a UML class box. kind: class | enum | service | vo."""
    stereo = {"enum": "«enum»", "service": "«service»", "vo": "«value object»"}.get(kind)
    # compute height
    pad = 6
    head_h = 40 if stereo else 28
    attr_h = 16*len(attrs) + (8 if attrs else 0)
    meth_h = 16*len(methods) + (8 if methods else 0)
    h = head_h + attr_h + meth_h
    header_fill = ACCENT_BG if aggregate else BEIGE
    s = [f'<g>']
    s.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{PAPER}" stroke="{INK}" stroke-width="1.4"/>')
    s.append(f'<rect x="{x}" y="{y}" width="{w}" height="{head_h}" fill="{header_fill}" stroke="{INK}" stroke-width="1.4"/>')
    ty = y + 16
    if stereo:
        s.append(f'<text x="{x+w/2}" y="{ty}" text-anchor="middle" font-family="Inter Tight, sans-serif" font-size="10" font-style="italic" fill="{MUTED}">{stereo}</text>')
        ty += 14
    # name
    weight = "800" if aggregate else "700"
    s.append(f'<text x="{x+w/2}" y="{ty+3}" text-anchor="middle" font-family="Inter Tight, sans-serif" font-size="13" font-weight="{weight}" fill="{INK}">{name}</text>')
    if aggregate:
        s.append(f'<circle cx="{x+w-14}" cy="{y+14}" r="6" fill="{EMBER}" stroke="{INK}" stroke-width="1"/>')
        s.append(f'<text x="{x+w-14}" y="{y+18}" text-anchor="middle" font-family="Inter Tight, sans-serif" font-size="9" font-weight="700" fill="{PAPER}">A</text>')
    # divider line
    cy = y + head_h
    if attrs:
        s.append(f'<line x1="{x}" y1="{cy}" x2="{x+w}" y2="{cy}" stroke="{INK}" stroke-width="1"/>')
        cy += 4
        for a in attrs:
            cy += 14
            s.append(f'<text x="{x+8}" y="{cy}" font-family="JetBrains Mono, Menlo, monospace" font-size="10.5" fill="{INK}">{a}</text>')
        cy += 4
    if methods:
        s.append(f'<line x1="{x}" y1="{cy}" x2="{x+w}" y2="{cy}" stroke="{INK}" stroke-width="1"/>')
        cy += 4
        for m in methods:
            cy += 14
            s.append(f'<text x="{x+8}" y="{cy}" font-family="JetBrains Mono, Menlo, monospace" font-size="10.5" fill="{INK}">{m}</text>')
    s.append('</g>')
    return "\n".join(s), h

def enum_box(x, y, w, name, values):
    pad = 6
    head_h = 40
    body = 16*len(values) + 8
    h = head_h + body
    s = [f'<g>']
    s.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{PAPER}" stroke="{INK}" stroke-width="1.4"/>')
    s.append(f'<rect x="{x}" y="{y}" width="{w}" height="{head_h}" fill="{BEIGE}" stroke="{INK}" stroke-width="1.4"/>')
    s.append(f'<text x="{x+w/2}" y="{y+16}" text-anchor="middle" font-family="Inter Tight, sans-serif" font-size="10" font-style="italic" fill="{MUTED}">«enum»</text>')
    s.append(f'<text x="{x+w/2}" y="{y+32}" text-anchor="middle" font-family="Inter Tight, sans-serif" font-size="12" font-weight="700" fill="{INK}">{name}</text>')
    cy = y + head_h + 4
    for v in values:
        cy += 14
        s.append(f'<text x="{x+w/2}" y="{cy}" text-anchor="middle" font-family="JetBrains Mono, Menlo, monospace" font-size="10.5" fill="{INK}">{v}</text>')
    s.append('</g>')
    return "\n".join(s), h

def pkg_rect(x, y, w, h, title):
    return f'''<g>
  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" ry="6" fill="{BONE}" stroke="{INK}" stroke-width="1.4"/>
  <rect x="{x}" y="{y}" width="{max(200,len(title)*8)}" height="26" rx="6" ry="6" fill="{BEIGE}" stroke="{INK}" stroke-width="1.4"/>
  <text x="{x+14}" y="{y+17}" font-family="Inter Tight, sans-serif" font-size="12" font-weight="700" fill="{INK}">{title}</text>
</g>'''

def arrow_head(x2, y2, ang, size=8, filled=True, triangle=False):
    ax1 = x2 - size*math.cos(ang - math.pi/7)
    ay1 = y2 - size*math.sin(ang - math.pi/7)
    ax2 = x2 - size*math.cos(ang + math.pi/7)
    ay2 = y2 - size*math.sin(ang + math.pi/7)
    if triangle:
        return f'<polygon points="{x2},{y2} {ax1},{ay1} {ax2},{ay2}" fill="{PAPER}" stroke="{INK}" stroke-width="1.2"/>'
    if filled:
        return f'<polygon points="{x2},{y2} {ax1},{ay1} {ax2},{ay2}" fill="{INK}"/>'
    return f'<polyline points="{ax1},{ay1} {x2},{y2} {ax2},{ay2}" fill="none" stroke="{INK}" stroke-width="1.2"/>'

def diamond(x, y, ang, size=8, filled=False):
    # diamond at (x,y) pointing along ang (backwards along the segment)
    d1x = x - size*math.cos(ang)
    d1y = y - size*math.sin(ang)
    d2x = x - size*1.6*math.cos(ang) - size*0.8*math.sin(ang)
    d2y = y - size*1.6*math.sin(ang) + size*0.8*math.cos(ang)
    d3x = x - size*2*math.cos(ang)
    d3y = y - size*2*math.sin(ang)
    d4x = x - size*1.6*math.cos(ang) + size*0.8*math.sin(ang)
    d4y = y - size*1.6*math.sin(ang) - size*0.8*math.cos(ang)
    fill = INK if filled else PAPER
    return f'<polygon points="{x},{y} {d2x},{d2y} {d3x},{d3y} {d4x},{d4y}" fill="{fill}" stroke="{INK}" stroke-width="1.2"/>'

def assoc(x1, y1, x2, y2, label=None, kind="assoc", mult_a=None, mult_b=None, dashed=False):
    """kind: assoc | composition | aggregation | dependency | generalization."""
    s = []
    dash = 'stroke-dasharray="5 4"' if (dashed or kind=="dependency") else ''
    s.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{INK}" stroke-width="1.2" {dash}/>')
    ang = math.atan2(y2-y1, x2-x1)
    if kind == "dependency":
        s.append(arrow_head(x2, y2, ang, 7, filled=False))
    elif kind == "generalization":
        s.append(arrow_head(x2, y2, ang, 12, triangle=True))
    elif kind in ("composition", "aggregation"):
        s.append(diamond(x1, y1, ang+math.pi, 6, filled=(kind=="composition")))
        s.append(arrow_head(x2, y2, ang, 7, filled=True))
    else:
        s.append(arrow_head(x2, y2, ang, 7, filled=True))
    if label:
        mx, my = (x1+x2)/2, (y1+y2)/2
        tw = len(label)*6 + 8
        s.append(f'<rect x="{mx-tw/2}" y="{my-9}" width="{tw}" height="14" rx="3" fill="{BONE}" stroke="none"/>')
        s.append(f'<text x="{mx}" y="{my+2}" text-anchor="middle" font-family="Inter Tight, sans-serif" font-size="10" font-style="italic" fill="{INK}">{label}</text>')
    if mult_a:
        s.append(f'<text x="{x1+10*math.cos(ang)}" y="{y1+10*math.sin(ang)+12}" font-family="Inter Tight, sans-serif" font-size="10" fill="{MUTED}">{mult_a}</text>')
    if mult_b:
        s.append(f'<text x="{x2-15*math.cos(ang)}" y="{y2-15*math.sin(ang)-4}" font-family="Inter Tight, sans-serif" font-size="10" fill="{MUTED}">{mult_b}</text>')
    return "\n".join(s)

parts = []
parts.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" font-family="Inter Tight, sans-serif">')
parts.append(f'<rect width="{W}" height="{H}" fill="{BONE}"/>')

# Title
parts.append(f'<text x="{W/2}" y="42" text-anchor="middle" font-family="Inter Tight, sans-serif" font-size="22" font-weight="800" fill="{INK}">Telsa Charging Points</text>')
parts.append(f'<text x="{W/2}" y="66" text-anchor="middle" font-family="Inter Tight, sans-serif" font-size="13" fill="{MUTED}">Diagramme de classes — domaine DDD, services applicatifs &amp; énumérations</text>')
parts.append(f'<line x1="120" y1="82" x2="{W-120}" y2="82" stroke="{INK}" stroke-width="0.6"/>')

# ===== ENUMS package (top) =====
parts.append(pkg_rect(40, 110, W-80, 180, "Énumérations"))
enums = [
    ("Role", ["USER", "ADMIN"]),
    ("TeslaModel", ["MODEL_3","MODEL_Y","MODEL_S","MODEL_X","CYBERTRUCK"]),
    ("PlateType", ["TN","RS","CD"]),
    ("VehicleOrigin", ["LOCAL","FOREIGN"]),
    ("ChargingPortType", ["NACS","CCS1","CCS2","CHADEMO","J1772"]),
    ("PortStatus", ["AVAILABLE","IN_USE","OUT_OF_SERVICE"]),
    ("ReviewStatus", ["PENDING","APPROVED","REJECTED"]),
]
ex = 70
for (name, vals) in enums:
    svg, h = enum_box(ex, 150, 180, name, vals)
    parts.append(svg)
    ex += 200

# ===== Package: Identité & Accès (left middle) =====
parts.append(pkg_rect(40, 320, 1060, 540, "Domaine :: Identité & Accès"))

# User (aggregate root) — centre left
user_svg, user_h = cls(80, 360, 320, "User", [
    "- id : UUID",
    "- firstName : String",
    "- lastName : String",
    "- email : String",
    "- passwordHash : String",
    "- phoneNumber : String",
    "- countryCode : String",
    "- role : Role",
    "- emailVerified : boolean",
    "- failedAttempts : int",
    "- lockedUntil : Instant",
    "- createdAt / lastLoginAt : Instant",
], [
    "+ markEmailVerified()",
    "+ changePassword(raw)",
    "+ registerFailedAttempt()",
    "+ isLocked() : boolean",
    "+ unlock()",
], aggregate=True)
parts.append(user_svg)

# RefreshToken (top right of package)
rt_svg, _ = cls(460, 360, 280, "RefreshToken", [
    "- id : UUID",
    "- tokenHash : String  (SHA-256)",
    "- expiresAt : Instant",
    "- revokedAt : Instant",
    "- createdAt : Instant",
], [
    "+ isValid(now) : boolean",
    "+ revoke()",
])
parts.append(rt_svg)

# OtpCode (right middle)
otp_svg, _ = cls(460, 545, 280, "OtpCode", [
    "- id : UUID",
    "- codeHash : String",
    "- expiresAt : Instant",
    "- attempts : int",
    "- usedAt : Instant",
], [
    "+ verify(raw) : boolean",
    "+ consume()",
    "+ incrementAttempts()",
])
parts.append(otp_svg)

# EmailVerificationToken (right lower)
evt_svg, _ = cls(460, 720, 280, "EmailVerificationToken", [
    "- id : UUID",
    "- token : String",
    "- expiresAt : Instant",
    "- usedAt : Instant",
], [
    "+ isValid(now) : boolean",
    "+ consume()",
])
parts.append(evt_svg)

# VerificationToken (far right)
vt_svg, _ = cls(780, 360, 300, "VerificationToken", [
    "- value : String",
    "- vehicleRef : String",
    "- teslaModel : TeslaModel",
    "- origin : VehicleOrigin",
    "- issuedAt : Instant",
    "- expiresAt : Instant",
    "- consumed : boolean",
], [
    "+ isUsable(now) : boolean",
], kind="vo")
parts.append(vt_svg)

# ===== Package: Véhicules (right middle) =====
parts.append(pkg_rect(1120, 320, 560, 300, "Domaine :: Véhicules"))

erp_local_svg, _ = cls(1160, 360, 240, "ErpTeslaLocal", [
    "- id : UUID",
    "- chassisNumber : String",
    "- plateNumber : String",
    "- plateType : PlateType",
    "- teslaModel : TeslaModel",
    "- registeredAt : Instant",
], [
    "+ matches(vin, plate, type)",
])
parts.append(erp_local_svg)

erp_for_svg, _ = cls(1420, 360, 240, "ErpTeslaForeign", [
    "- id : UUID",
    "- chassisNumber : String",
    "- teslaModel : TeslaModel",
    "- carteGrisePath : String",
    "- reviewStatus : ReviewStatus",
    "- submittedAt / reviewedAt",
    "- reviewerId : UUID",
    "- rejectionReason : String",
], [
    "+ approve(reviewer)",
    "+ reject(reviewer, reason)",
])
parts.append(erp_for_svg)

# ===== Package: Réseau de bornes (right lower) =====
parts.append(pkg_rect(1120, 650, 560, 210, "Domaine :: Réseau de bornes"))

st_svg, _ = cls(1160, 690, 240, "Station", [
    "- id : UUID",
    "- name / wilaya / address",
    "- latitude : double",
    "- longitude : double",
], [
    "+ distanceTo(lat, lng)",
    "+ hasPortFor(model)",
])
parts.append(st_svg)

port_svg, _ = cls(1420, 690, 240, "ChargingPort", [
    "- id : UUID",
    "- type : ChargingPortType",
    "- powerKw : int",
    "- status : PortStatus",
], [
    "+ isAvailableFor(model)",
])
parts.append(port_svg)

# ===== Package: Transverse (far right) =====
parts.append(pkg_rect(1700, 320, 460, 300, "Transverse :: Sécurité & Audit"))

rlb_svg, _ = cls(1730, 360, 200, "RateLimitBucket", [
    "- key : String",
    "- count : int",
    "- resetAt : Instant",
], [
    "+ allow() : boolean",
], kind="vo")
parts.append(rlb_svg)

audit_svg, _ = cls(1940, 360, 200, "AuditEvent", [
    "- id : UUID",
    "- timestamp : Instant",
    "- actor : String",
    "- action : String",
    "- ip : String",
    "- details : String",
], [])
parts.append(audit_svg)

# ===== Package: Services (bottom) =====
parts.append(pkg_rect(40, 890, W-80, 480, "Services du domaine"))

sx = 80
sy = 930
services = [
    ("AuthService", [
        "+ login(cmd) : LoginResult",
        "+ refresh(token) : TokenPair",
        "+ logout(userId)",
    ]),
    ("UserRegistrationService", [
        "+ register(cmd) : User",
    ]),
    ("VehicleVerificationService", [
        "+ verifyLocal(cmd) : VerificationToken",
        "+ verifyForeign(cmd) : VerificationToken",
    ]),
    ("OtpService", [
        "+ issue(userId) : OtpCode",
        "+ verify(userId, raw) : boolean",
        "+ resend(userId)",
    ]),
    ("EmailVerificationService", [
        "+ dispatch(user)",
        "+ confirm(token)",
    ]),
    ("LockService", [
        "+ registerFailure(userId)",
        "+ isLocked(userId) : boolean",
    ]),
    ("RateLimiterService", [
        "+ allow(key) : boolean",
    ]),
    ("JwtService", [
        "+ sign(user) : String",
        "+ parse(token) : Claims",
    ]),
]
# Lay out in 2 rows × 4 cols
box_w = 260
col_gap = 20
row_gap = 28
col_w = box_w + col_gap
for i, (n, ms) in enumerate(services):
    col = i % 4
    row = i // 4
    x = 80 + col*(box_w + col_gap + 32)
    y = 930 + row*220
    svg, h = cls(x, y, box_w, n, [], ms, kind="service")
    parts.append(svg)

# ===== ASSOCIATIONS =====
# User composition → RefreshToken (many)
parts.append(assoc(400, 410, 460, 410, label="émet", kind="composition", mult_a="1", mult_b="0..*"))
# User composition → OtpCode
parts.append(assoc(400, 580, 460, 590, label="reçoit", kind="composition", mult_a="1", mult_b="0..*"))
# User aggregation → EmailVerificationToken
parts.append(assoc(400, 700, 460, 760, label="confirme", kind="aggregation", mult_a="1", mult_b="0..1"))
# User → Role (via enum Role at top)
parts.append(assoc(240, 360, 150, 230, label="rôle", kind="assoc", mult_b="1"))
# VerificationToken → TeslaModel enum
parts.append(assoc(930, 360, 520, 230, kind="dependency"))
parts.append(assoc(900, 360, 700, 230, kind="dependency"))
# User ↔ VerificationToken (consomme à l'inscription)
parts.append(assoc(400, 480, 780, 420, label="consomme à l\'inscription", kind="dependency", mult_a="1", mult_b="1"))

# ErpTeslaLocal → TeslaModel
parts.append(assoc(1280, 360, 380, 230, kind="dependency"))
parts.append(assoc(1280, 360, 570, 230, kind="dependency"))
# ErpTeslaForeign → User (reviewed by)
parts.append(assoc(1540, 560, 420, 360, label="révisé par", kind="dependency"))

# Station composition → ChargingPort
parts.append(assoc(1400, 760, 1420, 760, label="contient", kind="composition", mult_a="1", mult_b="1..*"))
# ChargingPort → enum ChargingPortType & PortStatus
parts.append(assoc(1540, 690, 1075, 230, kind="dependency"))
parts.append(assoc(1540, 690, 1240, 230, kind="dependency"))

# Services → Entities (dependencies, sampling the main ones for readability)
# AuthService (col 0 row 0: x=80, y=930) → User, RefreshToken, OtpService, JwtService, LockService, RateLimiter
parts.append(assoc(200, 930, 240, 610, kind="dependency", label=""))   # → User
parts.append(assoc(240, 930, 600, 470, kind="dependency"))             # → RefreshToken
# UserRegistrationService (col 1 row 0: x=372, y=930) → User, VerificationToken, EmailVerificationService
parts.append(assoc(502, 930, 300, 610, kind="dependency"))             # → User
parts.append(assoc(502, 930, 930, 540, kind="dependency"))             # → VerificationToken
# VehicleVerificationService (col 2 row 0: x=664, y=930) → ErpTeslaLocal, ErpTeslaForeign, VerificationToken
parts.append(assoc(794, 930, 1280, 540, kind="dependency"))            # → ErpTeslaLocal
parts.append(assoc(860, 930, 1540, 540, kind="dependency"))            # → ErpTeslaForeign
# OtpService (col 3 row 0: x=956, y=930) → OtpCode
parts.append(assoc(1086, 930, 600, 680, kind="dependency"))            # → OtpCode
# EmailVerificationService (col 0 row 1: x=80, y=1150) → EmailVerificationToken
parts.append(assoc(210, 1150, 600, 830, kind="dependency"))

# Audit journalization (dashed) from services
parts.append(assoc(240, 1125, 1940, 460, kind="dependency", label="journalise"))

# ===== Notes =====
parts.append(f'''<g>
  <rect x="{W-470}" y="{H-260}" width="450" height="120" rx="8" fill="{YELLOW}" stroke="{YELLOW_BD}" stroke-width="1.4"/>
  <text x="{W-460}" y="{H-238}" font-family="Inter Tight, sans-serif" font-size="12" font-weight="700" fill="{INK}">Invariants de l\'agrégat User</text>
  <text x="{W-460}" y="{H-218}" font-family="Inter Tight, sans-serif" font-size="11" fill="{INK}">• email unique (case-insensitive)</text>
  <text x="{W-460}" y="{H-200}" font-family="Inter Tight, sans-serif" font-size="11" fill="{INK}">• passwordHash jamais en clair (BCrypt 12 rounds)</text>
  <text x="{W-460}" y="{H-182}" font-family="Inter Tight, sans-serif" font-size="11" fill="{INK}">• lockedUntil &gt; now ⟹ isLocked() == true</text>
  <text x="{W-460}" y="{H-164}" font-family="Inter Tight, sans-serif" font-size="11" fill="{INK}">• refresh token stocké hashé SHA-256 — rotation systématique</text>
</g>''')

parts.append(f'''<g>
  <rect x="40" y="{H-260}" width="500" height="150" rx="8" fill="{PAPER}" stroke="{INK}" stroke-width="1.2"/>
  <text x="54" y="{H-238}" font-family="Inter Tight, sans-serif" font-size="12" font-weight="700" fill="{INK}">Légende — notation UML</text>
  <circle cx="68" cy="{H-212}" r="6" fill="{EMBER}" stroke="{INK}"/>
  <text x="78" y="{H-212}" text-anchor="middle" font-size="9" font-weight="700" fill="{PAPER}">A</text>
  <text x="88" y="{H-208}" font-size="11" fill="{INK}">racine d\'agrégat (aggregate root)</text>
  <polygon points="56,{H-190} 64,{H-184} 72,{H-190} 64,{H-196}" fill="{INK}" stroke="{INK}"/>
  <line x1="72" y1="{H-190}" x2="130" y2="{H-190}" stroke="{INK}" stroke-width="1.2"/>
  <text x="138" y="{H-187}" font-size="11" fill="{INK}">composition (cycle de vie partagé)</text>
  <polygon points="56,{H-172} 64,{H-166} 72,{H-172} 64,{H-178}" fill="{PAPER}" stroke="{INK}"/>
  <line x1="72" y1="{H-172}" x2="130" y2="{H-172}" stroke="{INK}" stroke-width="1.2"/>
  <text x="138" y="{H-169}" font-size="11" fill="{INK}">agrégation (faible)</text>
  <line x1="56" y1="{H-154}" x2="130" y2="{H-154}" stroke="{INK}" stroke-width="1.2" stroke-dasharray="5 4"/>
  <polyline points="124,{H-158} 130,{H-154} 124,{H-150}" fill="none" stroke="{INK}" stroke-width="1.2"/>
  <text x="138" y="{H-151}" font-size="11" fill="{INK}">dépendance «use»</text>
  <line x1="56" y1="{H-136}" x2="130" y2="{H-136}" stroke="{INK}" stroke-width="1.2"/>
  <polygon points="124,{H-140} 130,{H-136} 124,{H-132}" fill="{PAPER}" stroke="{INK}" stroke-width="1.2"/>
  <text x="138" y="{H-133}" font-size="11" fill="{INK}">généralisation / héritage</text>
  <text x="300" y="{H-212}" font-family="Inter Tight, sans-serif" font-size="11" fill="{MUTED}">Stéréotypes :</text>
  <text x="300" y="{H-195}" font-family="Inter Tight, sans-serif" font-size="11" font-style="italic" fill="{MUTED}">«enum» «value object» «service»</text>
  <text x="300" y="{H-178}" font-family="Inter Tight, sans-serif" font-size="11" font-style="italic" fill="{MUTED}">Multiplicités : 1 — 0..* — 0..1 — 1..*</text>
</g>''')

parts.append('</svg>')

OUT.write_text("\n".join(parts), encoding="utf-8")
print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")
