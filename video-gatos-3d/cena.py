"""Gato siamês 3D estilizado (Blender/bpy). Uso: python cena.py [frame_teste]"""
import bpy, math, sys, os
from mathutils import Vector

AQUI = os.path.dirname(os.path.abspath(__file__))
TESTE = int(sys.argv[1]) if len(sys.argv) > 1 else None
FPS, N = 30, 300

bpy.ops.wm.read_factory_settings(use_empty=True)
cena = bpy.context.scene
cena.render.fps = FPS
cena.frame_start, cena.frame_end = 0, N - 1

def hexc(h, a=1.0):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c) + (a,)

def mat(nome, cor, rough=0.55, sss=0.0, emis=0.0):
    m = bpy.data.materials.new(nome); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = hexc(cor)
    b.inputs['Roughness'].default_value = rough
    if sss:
        b.inputs['Subsurface Weight'].default_value = sss
        b.inputs['Subsurface Radius'].default_value = (0.3, 0.15, 0.1)
    if emis:
        b.inputs['Emission Color'].default_value = hexc(cor)
        b.inputs['Emission Strength'].default_value = emis
    return m

CREME = mat('creme', '#efdcb8', 0.6)
MARROM = mat('marrom', '#4b3022', 0.65)
ROSA = mat('rosa', '#e8879f', 0.45)
AZUL = mat('azul', '#3d8fe0', 0.15)
PRETO = mat('preto', '#111111', 0.1)
BRANCO = mat('branco', '#ffffff', 0.3, emis=2.0)
BIGODE = mat('bigode', '#fff8ec', 0.4)
CORACAO = mat('coracao', '#ff4f7b', 0.25, emis=0.25)

def liga(o, m, pai=None, suave=True):
    o.data.materials.append(m)
    if suave:
        for p in o.data.polygons: p.use_smooth = True
    if pai: o.parent = pai
    return o

def esfera(nome, loc, r, esc=(1, 1, 1), m=CREME, pai=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, radius=r, location=loc)
    o = bpy.context.object; o.name = nome; o.scale = esc
    return liga(o, m, pai)

def vazio(nome, loc, pai=None):
    o = bpy.data.objects.new(nome, None); o.location = loc
    bpy.context.collection.objects.link(o)
    if pai: o.parent = pai
    return o

# ---------- gato ----------
raiz = vazio('gato', (0, 0, 0))
corpo = esfera('corpo', (0, 0, 1.1), 1.0, (1, 0.9, 1.15), CREME, raiz)
peito = esfera('peito', (0, -0.55, 1.25), 0.62, (1, 0.6, 1.1), CREME, raiz)
for s in (-1, 1):
    esfera(f'pata{s}', (0.42 * s, -0.78, 0.14), 0.27, (1, 1.35, 0.6), MARROM, raiz)
    esfera(f'coxa{s}', (0.78 * s, -0.05, 0.42), 0.48, (0.8, 1.1, 0.75), CREME, raiz)
    esfera(f'pe{s}', (0.85 * s, -0.42, 0.1), 0.22, (1, 1.4, 0.55), MARROM, raiz)

cabeca = vazio('cabeca', (0, -0.1, 2.0), raiz)
H = Vector((0, -0.1, 2.0))
def rel(x, y, z): return Vector((x, y, z)) - H
esfera('cranio', rel(0, -0.15, 2.58), 0.85, (1.12, 0.95, 0.93), CREME, cabeca)
esfera('mascara', rel(0, -0.7, 2.5), 0.5, (1.3, 0.5, 0.95), MARROM, cabeca)
esfera('focinho', rel(0, -0.98, 2.33), 0.2, (1.4, 0.7, 0.8), MARROM, cabeca)
esfera('nariz', rel(0, -1.1, 2.44), 0.07, (1.4, 0.7, 0.8), ROSA, cabeca)
olhos = []
for s in (-1, 1):
    ol = vazio(f'olho{s}', rel(0.33 * s, -0.86, 2.7), cabeca); olhos.append(ol)
    esfera(f'iris{s}', (0, 0, 0), 0.18, (1, 0.6, 1), AZUL, ol)
    esfera(f'pupila{s}', (0, -0.095, 0), 0.1, (0.55, 0.25, 1.1), PRETO, ol)
    esfera(f'brilho{s}', (0.05 * s + 0.02, -0.12, 0.07), 0.035, (1, 0.6, 1), BRANCO, ol)
    # orelhas
    orelha = vazio(f'orelha{s}', rel(0.5 * s, -0.1, 3.1), cabeca)
    bpy.ops.mesh.primitive_cone_add(vertices=48, radius1=0.37, radius2=0.03, depth=0.72, location=(0, 0, 0.26))
    o = liga(bpy.context.object, MARROM, orelha); o.scale = (1, 0.55, 1)
    bpy.ops.mesh.primitive_cone_add(vertices=48, radius1=0.24, radius2=0.02, depth=0.5, location=(0, -0.13, 0.2))
    o = liga(bpy.context.object, ROSA, orelha); o.scale = (1, 0.3, 1)
    orelha.rotation_euler = (math.radians(-8), math.radians(22 * s), 0)
    # bigodes
    for k, ang in enumerate((-12, 0, 12)):
        bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.011, depth=0.75)
        b = liga(bpy.context.object, BIGODE, cabeca)
        b.location = rel(0.55 * s, -1.02, 2.34 + (1 - k) * 0.05)
        b.rotation_euler = (0, math.radians(90), math.radians(ang * s))

# cauda (curva animada)
cd = bpy.data.curves.new('cauda', 'CURVE'); cd.dimensions = '3D'
cd.bevel_depth = 0.13; cd.bevel_resolution = 8; cd.use_fill_caps = True
sp = cd.splines.new('NURBS'); sp.points.add(5); sp.order_u = 4; sp.use_endpoint_u = True
BASE = [(0.55, 0.65, 0.35), (1.2, 0.9, 0.3), (1.6, 0.9, 0.9), (1.55, 0.85, 1.7), (1.3, 0.8, 2.3), (1.0, 0.75, 2.45)]
cauda = bpy.data.objects.new('cauda', cd); bpy.context.collection.objects.link(cauda)
cauda.parent = raiz; cd.materials.append(MARROM)

# corações
coracoes = []
def coracao(i):
    p = vazio(f'cor{i}', (0, 0, 0))
    esfera(f'c{i}a', (-0.28, 0, 0.12), 0.34, (1, 0.6, 1), CORACAO, p)
    esfera(f'c{i}b', (0.28, 0, 0.12), 0.34, (1, 0.6, 1), CORACAO, p)
    bpy.ops.mesh.primitive_cone_add(vertices=48, radius1=0.5, radius2=0.02, depth=0.62, location=(0, 0, -0.28))
    c = liga(bpy.context.object, CORACAO, p); c.rotation_euler = (math.radians(180), 0, 0); c.scale = (1.15, 0.38, 1)
    return p
for i in range(5): coracoes.append(coracao(i))

# chão (pega-sombra) + luzes + câmera
bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 0, 0))
chao = bpy.context.object; chao.is_shadow_catcher = True
def luz(nome, tipo, loc, energia, tam=4, alvo=(0, 0, 1.5)):
    l = bpy.data.lights.new(nome, tipo); l.energy = energia
    if tipo == 'AREA': l.size = tam
    o = bpy.data.objects.new(nome, l); o.location = loc; bpy.context.collection.objects.link(o)
    o.rotation_euler = (Vector(alvo) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
luz('chave', 'AREA', (-4, -6, 6), 650, 6)
luz('preenche', 'AREA', (5, -4, 3), 160, 5)
luz('contra', 'AREA', (2, 5, 5), 500, 4)
cena.world = bpy.data.worlds.new('mundo'); cena.world.use_nodes = True
cena.world.node_tree.nodes['Background'].inputs['Color'].default_value = hexc('#fff6e6')
cena.world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.3

camd = bpy.data.cameras.new('cam'); camd.lens = 40
cam = bpy.data.objects.new('cam', camd); bpy.context.collection.objects.link(cam); cena.camera = cam
alvo = vazio('alvo', (0, 0, 1.85))
tc = cam.constraints.new('TRACK_TO'); tc.target = alvo; tc.track_axis = 'TRACK_NEGATIVE_Z'; tc.up_axis = 'UP_Y'

# ---------- animação ----------
def kf(o, prop, f, v):
    setattr(o, prop, v); o.keyframe_insert(prop, frame=f)

for f, s in ((0, 0.001), (10, 1.1), (16, 0.95), (22, 1.0)):
    kf(raiz, 'scale', f, (s, s, s))
for f, x, y in ((0, -10.5, 0.4), (N - 1, -8.6, -0.2)):
    kf(cam, 'location', f, (y, x, 2.4))
for f, a in ((0, 0), (60, 9), (125, -6), (190, 7), (250, -4), (299, 2)):
    kf(cabeca, 'rotation_euler', f, (0, math.radians(a), 0))
def pisca(f0, fecha, segura):
    for ol in olhos:
        for f, z in ((f0, 1), (f0 + fecha, 0.08), (f0 + fecha + segura, 0.08), (f0 + 2 * fecha + segura, 1)):
            kf(ol, 'scale', f, (1, 1, z))
pisca(70, 3, 1); pisca(135, 10, 18); pisca(260, 3, 1)
for o in (olhos[0], olhos[1]):
    pass
ore = cabeca.children
orelhaE = bpy.data.objects['orelha-1']
for f, a in ((215, -8), (219, -30), (224, -8), (228, -26), (233, -8)):
    kf(orelhaE, 'rotation_euler', f, (math.radians(a), math.radians(-22), 0))
for f in range(0, N, 3):
    k = 1 + 0.018 * math.sin(f / FPS * 2 * math.pi * 0.45)
    kf(corpo, 'scale', f, (1, 0.9, 1.15 * k))
    for i, (x, y, z) in enumerate(BASE):
        amp = 0.42 * (i / 5) ** 1.3
        dx = amp * math.sin(f / FPS * 2 * math.pi * 0.55 - i * 0.6)
        sp.points[i].co = (x + dx, y, z, 1)
        sp.points[i].keyframe_insert('co', frame=f)
INI = [150, 168, 186, 204, 222]
POS = [(-1.6, -0.8), (1.5, -0.6), (-1.0, -0.9), (1.9, -0.7), (-2.1, -0.5)]
for c, f0, (x, y) in zip(coracoes, INI, POS):
    for f, s, z, r in ((0, 0.001, 2.9, 0), (f0, 0.001, 2.9, 0), (f0 + 8, 0.42, 3.1, 8), (f0 + 50, 0.36, 3.9, -8), (f0 + 66, 0.001, 4.15, 6)):
        kf(c, 'scale', f, (s, s, s)); kf(c, 'location', f, (x, y, z)); kf(c, 'rotation_euler', f, (0, math.radians(r), 0))

# ---------- render ----------
r = cena.render
r.engine = 'CYCLES'; cena.cycles.device = 'CPU'; cena.cycles.samples = 14; r.use_persistent_data = True
cena.cycles.use_denoising = True; cena.cycles.max_bounces = 4
r.film_transparent = True; r.resolution_x, r.resolution_y = 1280, 720
r.image_settings.file_format = 'PNG'; r.image_settings.color_mode = 'RGBA'
cena.view_settings.view_transform = 'Standard'
os.makedirs(os.path.join(AQUI, 'out', 'quadros'), exist_ok=True)
if TESTE is not None:
    cena.frame_set(TESTE); r.filepath = os.path.join(AQUI, 'out', f'teste{TESTE}.png')
    bpy.ops.render.render(write_still=True)
else:
    r.filepath = os.path.join(AQUI, 'out', 'quadros', 'q')
    bpy.ops.render.render(animation=True)
