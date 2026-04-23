"""Generate the Sequence diagram as a hand-crafted SVG."""
from pathlib import Path
import math

OUT = Path(__file__).parent / "03_sequence_diagram.svg"

INK = "#0A0A0B"
BONE = "#F4F1EC"
PAPER = "#FFFFFF"
BEIGE = "#EDE9E0"
EMBER = "#E34E2C"
MUTED = "#9A968E"
YELLOW = "#FFF7D6"
YELLOW_BD = "#8A7400"
PHASE_BG = "#EDE9E0"
ALT_BG = "#FAF7EF"

# Participants: (key, label, sub, kind) — kind: actor | box | db
participants = [
    ("U",    "Propriétaire",        None,       "actor"),
    ("FE",   "UI React",            None,       "box"),
    ("VC",   "VehicleController",   None,       "box"),
    ("VVS",  "VehicleVerification", "Service",  "box"),
    ("ERPR", "ErpTeslaLocal",       "Repository","db"),
    ("RL",   "RateLimiter",         "Service",  "box"),
    ("AC",   "AuthController",      None,       "box"),
    ("URS",  "UserRegistration",    "Service",  "box"),
    ("UR",   "User",                "Repository","db"),
    ("EVS",  "EmailVerification",   "Service",  "box"),
    ("SMTP", "SmtpEmailSender",     "SMTP",     "box"),
    ("OC",   "OtpController",       None,       "box"),
    ("OTP",  "OtpService",          None,       "box"),
    ("TW",   "TwilioOtpSender",     "SMS",      "box"),
    ("AS",   "AuthService",         None,       "box"),
    ("JWT",  "JwtService",          None,       "box"),
    ("RTR",  "RefreshToken",        "Repository","db"),
    ("SC",   "StationController",   None,       "box"),
    ("SR",   "Station",             "Repository","db"),
]

COL_W = 130
LEFT_PAD = 40
TOP_PAD = 170
PART_H = 80

# Compute x centers
x_of = {p[0]: LEFT_PAD + 60 + i*COL_W for i, p in enumerate(participants)}

# ————— Messages script —————
# y is a vertical cursor in "slots"
# each entry: kind=message|phase|alt_begin|alt_else|alt_end|activate|deactivate|note|self|self_loop
script = [
    ("phase", "Phase 1 · Vérification du véhicule (local)"),
    ("msg", "U", "FE", "saisit VIN, plaque, type, modèle", "sync"),
    ("msg", "FE", "VC", "POST /api/vehicles/verify/local {chassis, plate, type, model}", "sync"),
    ("act", "VC"),
    ("msg", "VC", "RL", "allow(ip)", "sync"),
    ("act", "RL"),
    ("msg", "RL", "VC", "true", "return"),
    ("deact", "RL"),
    ("msg", "VC", "VVS", "verifyLocal(cmd)", "sync"),
    ("act", "VVS"),
    ("msg", "VVS", "ERPR", "findByChassisAndPlate(vin, plate)", "sync"),
    ("act", "ERPR"),
    ("msg", "ERPR", "VVS", "ErpTeslaLocal", "return"),
    ("deact", "ERPR"),
    ("alt", "Correspondance trouvée"),
    ("msg", "VVS", "VC", "VerificationToken (value, expiresAt)", "return"),
    ("deact", "VVS"),
    ("msg", "VC", "FE", "200 { data: { verificationToken } }", "return"),
    ("deact", "VC"),
    ("self", "FE", "localStorage ← verificationToken"),
    ("alt_else", "Aucune correspondance"),
    ("msg", "VVS", "VC", "throw VerificationFailed", "return"),
    ("msg", "VC", "FE", "404 { error: 'chassis not found' }", "return"),
    ("alt_end",),

    ("phase", "Phase 2 · Création du compte"),
    ("msg", "U", "FE", "remplit le formulaire (nom, email, password, tél.)", "sync"),
    ("msg", "FE", "AC", "POST /api/auth/register { verificationToken, ... }", "sync"),
    ("act", "AC"),
    ("msg", "AC", "URS", "register(cmd)", "sync"),
    ("act", "URS"),
    ("self", "URS", "valide VerificationToken (non expiré, non consommé)"),
    ("msg", "URS", "UR", "existsByEmail(email)", "sync"),
    ("act", "UR"),
    ("msg", "UR", "URS", "false", "return"),
    ("deact", "UR"),
    ("self", "URS", "passwordHash ← BCrypt.hash(password)"),
    ("msg", "URS", "UR", "save(User{emailVerified=false})", "sync"),
    ("act", "UR"),
    ("msg", "UR", "URS", "User (id)", "return"),
    ("deact", "UR"),
    ("msg", "URS", "EVS", "dispatch(user)", "sync"),
    ("act", "EVS"),
    ("self", "EVS", "crée EmailVerificationToken"),
    ("msg", "EVS", "SMTP", "send(user.email, link)", "sync"),
    ("act", "SMTP"),
    ("msg", "SMTP", "EVS", "250 OK", "return"),
    ("deact", "SMTP"),
    ("msg", "EVS", "URS", "void", "return"),
    ("deact", "EVS"),
    ("msg", "URS", "AC", "User", "return"),
    ("deact", "URS"),
    ("msg", "AC", "FE", "201 { data: { userId } }", "return"),
    ("deact", "AC"),
    ("msg", "FE", "U", "« Vérifiez votre boîte mail »", "return"),

    ("phase", "Phase 3 · Confirmation de l'e-mail"),
    ("msg", "U", "FE", "clique sur le lien du mail", "sync"),
    ("msg", "FE", "AC", "GET /api/auth/verify-email?token=…", "sync"),
    ("act", "AC"),
    ("msg", "AC", "EVS", "confirm(token)", "sync"),
    ("act", "EVS"),
    ("self", "EVS", "charge & consomme EmailVerificationToken"),
    ("msg", "EVS", "UR", "findById(userId)", "sync"),
    ("act", "UR"),
    ("msg", "UR", "EVS", "User", "return"),
    ("deact", "UR"),
    ("msg", "EVS", "UR", "save(user.markEmailVerified())", "sync"),
    ("act", "UR"),
    ("msg", "UR", "EVS", "ok", "return"),
    ("deact", "UR"),
    ("msg", "EVS", "AC", "void", "return"),
    ("deact", "EVS"),
    ("msg", "AC", "FE", "200 { message: 'email verified' }", "return"),
    ("deact", "AC"),

    ("phase", "Phase 4 · Connexion + challenge OTP"),
    ("msg", "U", "FE", "saisit e-mail + mot de passe", "sync"),
    ("msg", "FE", "AC", "POST /api/auth/login {email, password}", "sync"),
    ("act", "AC"),
    ("msg", "AC", "RL", "allow('login:' + ip)", "sync"),
    ("act", "RL"),
    ("msg", "RL", "AC", "true", "return"),
    ("deact", "RL"),
    ("msg", "AC", "AS", "login(cmd)", "sync"),
    ("act", "AS"),
    ("msg", "AS", "UR", "findByEmail(email)", "sync"),
    ("act", "UR"),
    ("msg", "UR", "AS", "User", "return"),
    ("deact", "UR"),
    ("self", "AS", "BCrypt.verify(password, hash)"),
    ("alt", "Mot de passe correct & compte actif"),
    ("msg", "AS", "OTP", "issue(userId)", "sync"),
    ("act", "OTP"),
    ("self", "OTP", "génère 6 chiffres, hash, TTL"),
    ("msg", "OTP", "TW", "sendSms(phone, code)", "sync"),
    ("act", "TW"),
    ("msg", "TW", "OTP", "200 OK", "return"),
    ("deact", "TW"),
    ("msg", "OTP", "AS", "OtpCode (hashé en base)", "return"),
    ("deact", "OTP"),
    ("msg", "AS", "AC", "{ userId, otpRequired: true }", "return"),
    ("deact", "AS"),
    ("msg", "AC", "FE", "202 { data: { otpRequired: true } }", "return"),
    ("deact", "AC"),
    ("alt_else", "Échec"),
    ("msg", "AS", "AC", "throw InvalidCredentials", "return"),
    ("msg", "AC", "FE", "401 { error }", "return"),
    ("alt_end",),

    ("phase", "Phase 5 · Vérification OTP & émission des JWT"),
    ("msg", "U", "FE", "saisit les 6 chiffres", "sync"),
    ("msg", "FE", "OC", "POST /api/otp/verify {userId, otp}", "sync"),
    ("act", "OC"),
    ("msg", "OC", "OTP", "verify(userId, otp)", "sync"),
    ("act", "OTP"),
    ("self", "OTP", "charge dernier OtpCode non consommé"),
    ("self", "OTP", "hash(otp) == codeHash ?"),
    ("alt", "Code valide"),
    ("self", "OTP", "consume()"),
    ("msg", "OTP", "OC", "true", "return"),
    ("deact", "OTP"),
    ("msg", "OC", "AS", "issueTokens(userId)", "sync"),
    ("act", "AS"),
    ("msg", "AS", "JWT", "sign(access, claims{role})", "sync"),
    ("act", "JWT"),
    ("msg", "JWT", "AS", "accessJwt", "return"),
    ("deact", "JWT"),
    ("msg", "AS", "JWT", "sign(refresh)", "sync"),
    ("act", "JWT"),
    ("msg", "JWT", "AS", "refreshJwt", "return"),
    ("deact", "JWT"),
    ("msg", "AS", "RTR", "save(RefreshToken{hash=SHA-256(jwt)})", "sync"),
    ("act", "RTR"),
    ("msg", "RTR", "AS", "ok", "return"),
    ("deact", "RTR"),
    ("msg", "AS", "OC", "{ accessToken, refreshToken, user }", "return"),
    ("deact", "AS"),
    ("msg", "OC", "FE", "200 { data: { tokens } }", "return"),
    ("deact", "OC"),
    ("alt_else", "Code invalide"),
    ("self", "OTP", "incrementAttempts()"),
    ("msg", "OTP", "OC", "false", "return"),
    ("msg", "OC", "FE", "401 { error: 'otp invalid' }", "return"),
    ("alt_end",),

    ("phase", "Phase 6 · Accès aux ressources protégées"),
    ("msg", "U", "FE", "ouvre la carte des bornes", "sync"),
    ("msg", "FE", "SC", "GET /api/stations/nearby?lat&lng&model  Bearer <access>", "sync"),
    ("act", "SC"),
    ("msg", "SC", "JWT", "parse(access)", "sync"),
    ("act", "JWT"),
    ("msg", "JWT", "SC", "Claims { userId, role }", "return"),
    ("deact", "JWT"),
    ("msg", "SC", "SR", "findNearby(lat, lng, model)", "sync"),
    ("act", "SR"),
    ("msg", "SR", "SC", "List<Station>", "return"),
    ("deact", "SR"),
    ("msg", "SC", "FE", "200 { data: [ stations ] }", "return"),
    ("deact", "SC"),

    ("phase", "Phase 7 · Rotation du refresh token (bonus)"),
    ("msg", "FE", "AC", "POST /api/auth/refresh { refreshToken }", "sync"),
    ("act", "AC"),
    ("msg", "AC", "AS", "refresh(refreshToken)", "sync"),
    ("act", "AS"),
    ("msg", "AS", "RTR", "findByHash(SHA-256(token))", "sync"),
    ("act", "RTR"),
    ("msg", "RTR", "AS", "RefreshToken", "return"),
    ("deact", "RTR"),
    ("self", "AS", "vérifie !revoked && !expired"),
    ("msg", "AS", "RTR", "revoke(oldToken)", "sync"),
    ("act", "RTR"),
    ("msg", "RTR", "AS", "ok", "return"),
    ("deact", "RTR"),
    ("msg", "AS", "JWT", "sign(newAccess) + sign(newRefresh)", "sync"),
    ("act", "JWT"),
    ("msg", "JWT", "AS", "paire de jetons", "return"),
    ("deact", "JWT"),
    ("msg", "AS", "RTR", "save(newRefreshTokenHash)", "sync"),
    ("act", "RTR"),
    ("msg", "RTR", "AS", "ok", "return"),
    ("deact", "RTR"),
    ("msg", "AS", "AC", "{ accessToken, refreshToken }", "return"),
    ("deact", "AS"),
    ("msg", "AC", "FE", "200 { data }", "return"),
    ("deact", "AC"),
]

# Compute y positions — vertical layout
ROW_H = 28
PHASE_H = 34
ALT_HEADER_H = 26

# State: track activations to draw bars after
activations = {}   # key -> list of (y_start, y_end, depth)
active_stack = {p[0]: [] for p in participants}  # stack of y_start

body_events = []  # list of (y, 'msg'|'phase'|'alt'|'alt_else'|'alt_end'|'self'|'act'|'deact', ...)
y = TOP_PAD + PART_H + 30

# alt bracket tracking
alt_stack = []   # list of dicts {y_start, label, segments:[(y_else_start, label)], x_left, x_right, else_ys:[]}

for ev in script:
    kind = ev[0]
    if kind == "phase":
        y += 18
        body_events.append(("phase", y, ev[1]))
        y += PHASE_H
    elif kind == "alt":
        y += 6
        a = {"y_start": y, "label": ev[1], "else_ys": [], "else_labels": []}
        alt_stack.append(a)
        body_events.append(("alt_begin", y, ev[1], a))
        y += ALT_HEADER_H
    elif kind == "alt_else":
        a = alt_stack[-1]
        a["else_ys"].append(y)
        a["else_labels"].append(ev[1])
        body_events.append(("alt_else", y, ev[1], a))
        y += ALT_HEADER_H
    elif kind == "alt_end":
        a = alt_stack.pop()
        a["y_end"] = y + 4
        body_events.append(("alt_end", y, a))
        y += 8
    elif kind == "msg":
        _, src, dst, lbl, mtype = ev
        body_events.append(("msg", y, src, dst, lbl, mtype))
        y += ROW_H
    elif kind == "self":
        _, who, lbl = ev
        body_events.append(("self", y, who, lbl))
        y += ROW_H + 6
    elif kind == "act":
        who = ev[1]
        active_stack[who].append(y - 8)
    elif kind == "deact":
        who = ev[1]
        if active_stack[who]:
            ys = active_stack[who].pop()
            activations.setdefault(who, []).append((ys, y - 4, len(active_stack[who])))

# Close any remaining activations
for k, stk in active_stack.items():
    while stk:
        ys = stk.pop()
        activations.setdefault(k, []).append((ys, y, 0))

BOTTOM_PAD = 60
TOTAL_H = y + BOTTOM_PAD + 120
TOTAL_W = LEFT_PAD + 60 + (len(participants)-1)*COL_W + 80

# ————— Render —————
out = []
out.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {TOTAL_W} {TOTAL_H}" font-family="Inter Tight, sans-serif">')
out.append(f'<rect width="{TOTAL_W}" height="{TOTAL_H}" fill="{BONE}"/>')

# Title
out.append(f'<text x="{TOTAL_W/2}" y="48" text-anchor="middle" font-size="22" font-weight="800" fill="{INK}">Telsa Charging Points</text>')
out.append(f'<text x="{TOTAL_W/2}" y="72" text-anchor="middle" font-size="13" fill="{MUTED}">Diagramme de séquence — onboarding complet &amp; accès aux bornes (scénario nominal)</text>')
out.append(f'<line x1="120" y1="92" x2="{TOTAL_W-120}" y2="92" stroke="{INK}" stroke-width="0.6"/>')

# Draw lifelines (vertical dashed lines)
for p in participants:
    x = x_of[p[0]]
    out.append(f'<line x1="{x}" y1="{TOP_PAD + PART_H}" x2="{x}" y2="{y + 20}" stroke="{MUTED}" stroke-width="1" stroke-dasharray="4 4"/>')

# Draw participant heads
for p in participants:
    key, label, sub, kind = p
    x = x_of[key]
    if kind == "actor":
        # stickman
        cy = TOP_PAD + 28
        out.append(f'<circle cx="{x}" cy="{cy}" r="10" fill="{BONE}" stroke="{INK}" stroke-width="1.6"/>')
        out.append(f'<line x1="{x}" y1="{cy+10}" x2="{x}" y2="{cy+34}" stroke="{INK}" stroke-width="1.6"/>')
        out.append(f'<line x1="{x-12}" y1="{cy+18}" x2="{x+12}" y2="{cy+18}" stroke="{INK}" stroke-width="1.6"/>')
        out.append(f'<line x1="{x}" y1="{cy+34}" x2="{x-10}" y2="{cy+52}" stroke="{INK}" stroke-width="1.6"/>')
        out.append(f'<line x1="{x}" y1="{cy+34}" x2="{x+10}" y2="{cy+52}" stroke="{INK}" stroke-width="1.6"/>')
        out.append(f'<text x="{x}" y="{cy+70}" text-anchor="middle" font-size="11" font-weight="700" fill="{INK}">{label}</text>')
    else:
        fill = BEIGE if kind == "db" else PAPER
        # db shape: cylinder top; box otherwise
        bw = COL_W - 14
        bx = x - bw/2
        by = TOP_PAD + 8
        bh = PART_H - 16
        if kind == "db":
            out.append(f'<path d="M {bx} {by+10} v {bh-20} a {bw/2} 8 0 0 0 {bw} 0 v -{bh-20} a {bw/2} 8 0 0 0 -{bw} 0 z" fill="{fill}" stroke="{INK}" stroke-width="1.4"/>')
            out.append(f'<path d="M {bx} {by+10} a {bw/2} 8 0 0 0 {bw} 0" fill="none" stroke="{INK}" stroke-width="1.4"/>')
        else:
            out.append(f'<rect x="{bx}" y="{by}" width="{bw}" height="{bh}" fill="{fill}" stroke="{INK}" stroke-width="1.4"/>')
        if sub:
            out.append(f'<text x="{x}" y="{by + bh/2 - 2}" text-anchor="middle" font-size="11" font-weight="700" fill="{INK}">{label}</text>')
            out.append(f'<text x="{x}" y="{by + bh/2 + 14}" text-anchor="middle" font-size="10" fill="{MUTED}">{sub}</text>')
        else:
            out.append(f'<text x="{x}" y="{by + bh/2 + 4}" text-anchor="middle" font-size="11" font-weight="700" fill="{INK}">{label}</text>')

# Phase separators & alt frames: render under messages
for ev in body_events:
    if ev[0] == "phase":
        _, yy, label = ev
        out.append(f'<rect x="{LEFT_PAD}" y="{yy-22}" width="{TOTAL_W-2*LEFT_PAD}" height="26" fill="{PHASE_BG}" stroke="{INK}" stroke-width="1"/>')
        out.append(f'<text x="{TOTAL_W/2}" y="{yy-5}" text-anchor="middle" font-size="12" font-weight="800" fill="{INK}">≡  {label}  ≡</text>')
    elif ev[0] == "alt_begin":
        _, yy, label, a = ev
        # will draw frame at end; record boundaries
        a["x_left"] = LEFT_PAD + 20
        a["x_right"] = TOTAL_W - LEFT_PAD - 20
        a["label_begin"] = label
    elif ev[0] == "alt_else":
        _, yy, label, a = ev
    elif ev[0] == "alt_end":
        _, yy, a = ev
        x1, x2 = a["x_left"], a["x_right"]
        y1, y2 = a["y_start"], a["y_end"]
        out.append(f'<rect x="{x1}" y="{y1}" width="{x2-x1}" height="{y2-y1}" fill="none" stroke="{INK}" stroke-width="1.4" stroke-dasharray="4 3"/>')
        # label tag
        out.append(f'<path d="M {x1} {y1} h 60 l -8 16 h -52 z" fill="{BEIGE}" stroke="{INK}" stroke-width="1.2"/>')
        out.append(f'<text x="{x1+8}" y="{y1+12}" font-size="10" font-weight="700" fill="{INK}">alt</text>')
        out.append(f'<text x="{x1+80}" y="{y1+14}" font-size="11" font-style="italic" fill="{INK}">[ {a["label_begin"]} ]</text>')
        # else dividers
        for ey, el in zip(a["else_ys"], a["else_labels"]):
            out.append(f'<line x1="{x1}" y1="{ey-4}" x2="{x2}" y2="{ey-4}" stroke="{INK}" stroke-width="1" stroke-dasharray="3 3"/>')
            out.append(f'<text x="{x1+10}" y="{ey+12}" font-size="11" font-style="italic" fill="{INK}">[ else — {el} ]</text>')

# Activation bars
for who, bars in activations.items():
    x = x_of[who]
    for ys, ye, depth in bars:
        bw = 8
        out.append(f'<rect x="{x - bw/2 + depth*3}" y="{ys}" width="{bw}" height="{ye-ys}" fill="{PAPER}" stroke="{INK}" stroke-width="1.1"/>')

# Draw messages
for ev in body_events:
    if ev[0] == "msg":
        _, yy, src, dst, lbl, mtype = ev
        xs = x_of[src]
        xd = x_of[dst]
        dash = 'stroke-dasharray="5 4"' if mtype == "return" else ''
        out.append(f'<line x1="{xs}" y1="{yy}" x2="{xd}" y2="{yy}" stroke="{INK}" stroke-width="1.2" {dash}/>')
        # arrowhead at dst
        dir_x = 1 if xd > xs else -1
        ah = 7
        if mtype == "return":
            out.append(f'<polyline points="{xd - dir_x*ah},{yy-4} {xd},{yy} {xd - dir_x*ah},{yy+4}" fill="none" stroke="{INK}" stroke-width="1.2"/>')
        else:
            out.append(f'<polygon points="{xd},{yy} {xd - dir_x*ah},{yy-4} {xd - dir_x*ah},{yy+4}" fill="{INK}"/>')
        # label above line
        label_x = (xs + xd) / 2
        out.append(f'<text x="{label_x}" y="{yy-5}" text-anchor="middle" font-size="10.5" fill="{INK}">{lbl}</text>')
    elif ev[0] == "self":
        _, yy, who, lbl = ev
        x = x_of[who]
        # self-loop arrow
        out.append(f'<path d="M {x} {yy-6} h 34 v 18 h -34" fill="none" stroke="{INK}" stroke-width="1.2"/>')
        out.append(f'<polygon points="{x},{yy+12} {x+7},{yy+8} {x+7},{yy+16}" fill="{INK}"/>')
        out.append(f'<text x="{x+44}" y="{yy+2}" font-size="10.5" fill="{INK}">{lbl}</text>')

# Bottom security invariants note
note_y = y + 40
note_x = LEFT_PAD + 40
out.append(f'<rect x="{note_x}" y="{note_y}" width="{TOTAL_W - 2*note_x}" height="80" rx="6" fill="{YELLOW}" stroke="{YELLOW_BD}" stroke-width="1.4"/>')
out.append(f'<text x="{note_x + 14}" y="{note_y + 22}" font-size="12" font-weight="700" fill="{INK}">Invariants de sécurité</text>')
out.append(f'<text x="{note_x + 14}" y="{note_y + 42}" font-size="11" fill="{INK}">• Toute réponse HTTP est enveloppée : {{ success, message, data, timestamp }} — format standard du contrat API.</text>')
out.append(f'<text x="{note_x + 14}" y="{note_y + 59}" font-size="11" fill="{INK}">• Un 401 sur ressource protégée déclenche automatiquement la tentative de refresh côté client (interceptor Axios).</text>')
out.append(f'<text x="{note_x + 14}" y="{note_y + 76}" font-size="11" fill="{INK}">• Les refresh tokens sont stockés hashés (SHA-256) — jamais en clair. Rotation obligatoire à chaque usage.</text>')

out.append('</svg>')

OUT.write_text("\n".join(out), encoding="utf-8")
print(f"Wrote {OUT} ({OUT.stat().st_size} bytes), size {TOTAL_W}x{TOTAL_H}")
