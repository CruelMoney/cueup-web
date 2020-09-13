import * as THREE from 'three';
import { easings } from 'utils/easings';
import { numbers } from 'utils/numbers';
import { timings } from 'utils/timings';
import discTexture from '../resources/disc_texture.png';
import mapFill from '../resources/map_fill.png';

/* eslint-disable no-unused-expressions, no-sequences, babel/no-invalid-this */

const Dh = {
    ad: [42.5, 1.5],
    ae: [24, 54],
    af: [33, 65],
    al: [41, 20],
    am: [40, 45],
    an: [12.25, -68.75],
    ao: [-12.5, 18.5],
    ap: [35, 105],
    aq: [-90, 0],
    ar: [-34, -64],
    at: [47.3333, 13.3333],
    au: [-27, 133],
    aw: [12.5, -69.9667],
    az: [40.5, 47.5],
    ba: [44, 18],
    bd: [24, 90],
    be: [50.8333, 4],
    bf: [13, -2],
    bg: [43, 25],
    bh: [26, 50.55],
    bi: [-3.5, 30],
    bj: [9.5, 2.25],
    bn: [4.5, 114.6667],
    bo: [-17, -65],
    br: [-10, -55],
    bt: [27.5, 90.5],
    bv: [-54.4333, 3.4],
    bw: [-22, 24],
    bz: [17.25, -88.75],
    ca: [54, -100],
    cd: [0, 25],
    cf: [7, 21],
    ch: [47, 8],
    cl: [-30, -71],
    cm: [6, 12],
    cn: [35, 105],
    co: [4, -72],
    cr: [10, -84],
    cy: [35, 33],
    cz: [49.75, 15.5],
    de: [51, 9],
    dj: [11.5, 43],
    dk: [56, 10],
    do: [19, -70.6667],
    dz: [28, 3],
    ec: [-2, -77.5],
    ee: [59, 26],
    eg: [27, 30],
    eh: [24.5, -13],
    er: [15, 39],
    es: [40, -4],
    et: [8, 38],
    eu: [47, 8],
    fi: [64, 26],
    fo: [62, -7],
    fr: [46, 2],
    ga: [-1, 11.75],
    gb: [54, -2],
    ge: [42, 43.5],
    gf: [4, -53],
    gh: [8, -2],
    gi: [36.1833, -5.3667],
    gl: [72, -40],
    gm: [13.4667, -16.5667],
    gn: [11, -10],
    gq: [2, 10],
    gr: [39, 22],
    gt: [15.5, -90.25],
    gw: [12, -15],
    gy: [5, -59],
    hk: [22.25, 114.1667],
    hn: [15, -86.5],
    hr: [45.1667, 15.5],
    ht: [19, -72.4167],
    hu: [47, 20],
    id: [-5, 120],
    ie: [53, -8],
    il: [31.5, 34.75],
    in: [20, 77],
    is: [65, -18],
    it: [42.8333, 12.8333],
    jm: [18.25, -77.5],
    jo: [31, 36],
    jp: [36, 138],
    ke: [1, 38],
    kg: [41, 75],
    kh: [13, 105],
    kr: [37, 127.5],
    kw: [29.3375, 47.6581],
    kz: [48, 68],
    la: [18, 105],
    lb: [33.8333, 35.8333],
    li: [47.1667, 9.5333],
    lk: [7, 81],
    ls: [-29.5, 28.5],
    lt: [56, 24],
    lu: [49.75, 6.1667],
    lv: [57, 25],
    ly: [25, 17],
    ma: [32, -5],
    mc: [43.7333, 7.4],
    md: [47, 29],
    me: [42, 19],
    mg: [-20, 47],
    mk: [41.8333, 22],
    ml: [17, -4],
    mn: [46, 105],
    mo: [22.1667, 113.55],
    mr: [20, -12],
    mw: [-13.5, 34],
    mx: [23, -102],
    my: [2.5, 112.5],
    mz: [-18.25, 35],
    na: [-22, 17],
    ne: [16, 8],
    ng: [10, 8],
    ni: [13, -85],
    nl: [52.5, 5.75],
    no: [62, 10],
    np: [28, 84],
    nz: [-41, 174],
    om: [21, 57],
    pa: [9, -80],
    pe: [-10, -76],
    pg: [-6, 147],
    ph: [13, 122],
    pk: [30, 70],
    pl: [52, 20],
    pm: [46.8333, -56.3333],
    ps: [32, 35.25],
    pt: [39.5, -8],
    py: [-23, -58],
    qa: [25.5, 51.25],
    ro: [46, 25],
    rs: [44, 21],
    ru: [60, 100],
    rw: [-2, 30],
    sa: [25, 45],
    se: [62, 15],
    sg: [1.3667, 103.8],
    si: [46, 15],
    sj: [78, 20],
    sk: [48.6667, 19.5],
    sl: [8.5, -11.5],
    sm: [43.7667, 12.4167],
    sn: [14, -14],
    so: [10, 49],
    sr: [4, -56],
    sv: [13.8333, -88.9167],
    sz: [-26.5, 31.5],
    td: [15, 19],
    tg: [8, 1.1667],
    th: [15, 100],
    tj: [39, 71],
    tn: [34, 9],
    tr: [39, 35],
    tt: [11, -61],
    tw: [23.5, 121],
    tz: [-6, 35],
    ua: [49, 32],
    ug: [1, 32],
    us: [38, -97],
    uy: [-33, -56],
    uz: [41, 64],
    va: [41.9, 12.45],
    ve: [8, -66],
    vn: [16, 106],
    ye: [15, 48],
    za: [-29, 24],
    zm: [-15, 30],
};
const Nh = Math.PI;
const zh = Nh / 2;
const Uh = 180 / Nh;
const Fh = Nh / 180;
const Bh = Math.atan2;
const Gh = Math.cos;
const Hh = Math.sin;
const kh = Math.sqrt;
function Vh(t) {
    return (t = Hh(t / 2)) * t;
}
function jh(t, e) {
    const i = t[0] * Fh;
    const n = t[1] * Fh;
    const r = e[0] * Fh;
    const a = e[1] * Fh;
    const o = Gh(n);
    const s = Hh(n);
    const c = Gh(a);
    const h = Hh(a);
    const l = o * Gh(i);
    const u = o * Hh(i);
    const d = c * Gh(r);
    const p = c * Hh(r);
    const f = 2 * ((m = kh(Vh(a - n) + o * c * Vh(r - i))) > 1 ? zh : m < -1 ? -zh : Math.asin(m));
    let m;
    const g = Hh(f);
    const v = f
        ? function (t) {
              const e = Hh((t *= f)) / g;
              const i = Hh(f - t) / g;
              const n = i * l + e * d;
              const r = i * u + e * p;
              const a = i * s + e * h;
              return [Bh(r, n) * Uh, Bh(a, kh(n * n + r * r)) * Uh];
          }
        : function () {
              return [i * Uh, n * Uh];
          };
    return (v.distance = f), v;
}
const Wh = Math.PI / 180;
function qh(t, e, i) {
    const n = (90 - t) * Wh;
    const r = e * Wh;
    return new THREE.Vector3(
        -i * Math.sin(n) * Math.cos(r),
        i * Math.cos(n),
        i * Math.sin(n) * Math.sin(r)
    );
}
class Xh extends THREE.Group {
    constructor(e, n, a, _o, s, c, h) {
        super(),
            (this.animationFrame = undefined),
            (this.drawAnimatedLine = () => {
                if (!this.active) {
                    return;
                }
                let t = this.geometry.drawRange.count;
                const e = performance.now() - this.startTime;
                this.material.uniforms.u_time.value = e;
                const n = easings.easeOutQuart(e, 0, 1, 2500);
                if (((t = Math.min(3e3, Math.ceil(3e3 * n))), this.active && t < 3e3)) {
                    const e = this.circle1.scale.x;
                    if (
                        (e < 0.35 && this.circle1.scale.set(e + 0.01, e + 0.01, e + 0.01), t > 1500)
                    ) {
                        const t = this.circle2.scale.x;
                        t < 0.35 && this.circle2.scale.set(t + 0.015, t + 0.015, t + 0.015);
                    }
                    this.geometry.setDrawRange(0, t);
                }
                this.animationFrame = requestAnimationFrame(this.drawAnimatedLine);
            }),
            (this.drawStaticLine = () => {
                this.geometry.setDrawRange(0, 3e3),
                    this.circle1.scale.set(0.35, 0.35, 0.35),
                    this.circle2.scale.set(0.35, 0.35, 0.35);
            }),
            (this.eraseLine = () => {
                const t = this.geometry.drawRange.count;
                const e = this.geometry.drawRange.start;
                if (
                    ((this.material.uniforms.u_time.value = performance.now() - this.startTime),
                    e > t)
                ) {
                    return;
                }
                const i = this.circle1.scale.x;
                const n = this.circle2.scale.x;
                if (i > 0.03) {
                    const t = i - 0.01;
                    this.circle1.scale.set(t, t, t);
                }
                if (e > 1500 && n > 0.03) {
                    const t = n - 0.015;
                    this.circle2.scale.set(t, t, t);
                }
                this.geometry.setDrawRange(e + 48, t),
                    (this.animationFrame = requestAnimationFrame(this.eraseLine));
            }),
            (this.colors = a),
            (this.isStatic = h),
            (this.startLat = e[0]),
            (this.startLng = e[1]);
        const l = n[0];
        const u = n[1];
        const d = qh(this.startLat, this.startLng, c);
        const p = qh(l, u, 1.002 * c);
        const f = numbers.clamp(0.5 * d.distanceTo(p), 160, 500);
        const m = jh([this.startLng, this.startLat], [u, l]);
        const g = m(0.25);
        const v = m(0.75);
        const y = new THREE.CubicBezierCurve3(d, qh(g[1], g[0], c + f), qh(v[1], v[0], c + f), p);
        (this.geometry = new THREE.TubeBufferGeometry(y, 44, 0.2 + c / 1200, 8, !1)),
            (this.material = new THREE.ShaderMaterial({
                uniforms: {
                    u_time: { type: 'f', value: 0 },
                    u_texture: { type: 't', value: null },
                    speedEpsilon: { type: 'f', value: 4e-4 },
                },
                vertexShader:
                    '\n        varying vec2 vUv;\n\n        void main() {\n          vUv = uv;\n          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);\n        }\n      ',
                fragmentShader:
                    '\n        uniform float u_time;\n        uniform sampler2D u_texture;\n        varying vec2 vUv;\n        uniform float speedEpsilon;\n\n        void main() {\n          float ramp = vUv.x * 0.5;\n          float pct = fract(ramp - u_time * speedEpsilon);\n          vec4 color = vec4(0.0, 0.0, 0.0, 1.0);\n          color = texture2D(u_texture, vec2(pct, 0.6));\n          gl_FragColor = vec4(color);\n        }\n      ',
            })),
            (this.active = !1),
            (this.mesh = new THREE.Mesh(this.geometry, this.material)),
            // this.add(this.mesh),
            (this.material.uniforms.u_texture.value = this.texture),
            (this.circleMaterial1 = new THREE.MeshBasicMaterial({
                map: s,
                color: a[0],
                transparent: !0,
                opacity: 1,
                side: 2,
            })),
            (this.circleMaterial2 = new THREE.MeshBasicMaterial({
                map: s,
                color: a[1],
                transparent: !0,
                opacity: 1,
                side: 2,
            })),
            (this.circleGeometry = new THREE.PlaneGeometry(0.1 * c, 0.1 * c, 2)),
            (this.circle1 = new THREE.Mesh(this.circleGeometry, this.circleMaterial1)),
            (this.circle2 = new THREE.Mesh(this.circleGeometry, this.circleMaterial2)),
            this.circle1.scale.set(0.01, 0.01, 0.01),
            this.circle2.scale.set(0.01, 0.01, 0.01),
            this.circle1.position.set(d.x, d.y, d.z),
            this.circle2.position.set(p.x, p.y, p.z),
            this.circle1.rotation.set(Math.PI, Math.PI, Math.PI),
            this.circle2.rotation.set(Math.PI, Math.PI, Math.PI),
            this.circle1.lookAt(new THREE.Vector3(0, 0, 0)),
            this.circle2.lookAt(new THREE.Vector3(0, 0, 0)),
            this.add(this.circle1),
            this.add(this.circle2),
            this.showLine();
    }
    showLine() {
        (this.active = !0),
            this.geometry.setDrawRange(0, 1),
            this.isStatic
                ? this.drawStaticLine()
                : ((this.startTime = performance.now()), this.drawAnimatedLine());
    }
    hideLine() {
        (this.active = !1), this.eraseLine();
    }
    disposeLine() {
        this.mesh.geometry.dispose(),
            this.texture.dispose(),
            this.mesh.material.dispose(),
            this.circle1.geometry.dispose(),
            this.circle1.material.dispose(),
            this.circle2.geometry.dispose(),
            this.circle2.material.dispose(),
            (this.children = null);
    }
    pause() {
        cancelAnimationFrame(this.animationFrame);
    }
    play() {
        this.isStatic
            ? this.drawStaticLine()
            : this.active
            ? (this.animationFrame = requestAnimationFrame(this.drawAnimatedLine))
            : (this.animationFrame = requestAnimationFrame(this.eraseLine));
    }
}
function Yh(t, e) {
    const i = new THREE.Vector3();
    return (
        i.subVectors(e, t).normalize(),
        new THREE.Vector2(
            1 - (0.5 + Math.atan2(i.z, i.x) / (2 * Math.PI)),
            0.5 + Math.asin(i.y) / Math.PI
        )
    );
}
function Zh(t, e) {
    const i = e.width;
    const n = e.height;
    const r = 4 * Math.floor(t.x * i) + Math.floor(t.y * n) * (4 * i);
    return e.data.slice(r, r + 4);
}
class Jh extends THREE.Group {
    constructor(e, i, n) {
        super(),
            (this.callback = undefined),
            (this.callback = i),
            (this.isStatic = n),
            (this.rotation.x = -Math.PI),
            (this.rotation.z = -Math.PI),
            (this.radius = e),
            (this.isDragging = !1),
            (this.dragTime = 0),
            new THREE.ImageLoader().load(mapFill, (t) => {
                const e = (function (t) {
                    const e = t.width;
                    const i = t.height;
                    const n = document.createElement('canvas');
                    (n.width = e), (n.height = i);
                    const r = n.getContext('2d');
                    return r.drawImage(t, 0, 0), r.getImageData(0, 0, e, i);
                })(t);
                this.mapLoaded(e);
            });
    }
    mapLoaded(t) {
        const e = this.radius / 450;
        const i = 1e4 + Math.floor((this.radius / 600) * 7e4);
        const n = this.radius;
        const r = new THREE.CircleGeometry(1.8 * e, 5);
        const a = new THREE.Geometry();
        const o = [];
        const s = [];
        const c = new THREE.Vector3();
        for (let e = i; e >= 0; e -= 1) {
            const h = Math.acos((2 * e) / i - 1);
            const l = Math.sqrt(i * Math.PI) * h;
            if (
                (c.setFromSphericalCoords(n, h, l),
                a.copy(r),
                a.lookAt(c),
                a.translate(c.x, c.y, c.z),
                a.computeBoundingSphere(),
                Zh(Yh(a.boundingSphere.center, this.position), t)[3] > 0)
            ) {
                const t = Math.random();
                for (let e = 0; e < a.faces.length; e += 1) {
                    const i = a.faces[e];
                    o.push(
                        a.vertices[i.a].x,
                        a.vertices[i.a].y,
                        a.vertices[i.a].z,
                        a.vertices[i.b].x,
                        a.vertices[i.b].y,
                        a.vertices[i.b].z,
                        a.vertices[i.c].x,
                        a.vertices[i.c].y,
                        a.vertices[i.c].z
                    ),
                        s.push(t, t, t);
                }
            }
        }
        const h = new THREE.BufferGeometry();
        h.setAttribute('position', new THREE.BufferAttribute(new Float32Array(o), 3)),
            h.setAttribute('rndId', new THREE.BufferAttribute(new Float32Array(s), 1)),
            (this.material = new THREE.ShaderMaterial({
                transparent: !0,
                uniforms: {
                    u_time: { type: 'f', value: 0 },
                    u_drag_time: { type: 'f', value: 0 },
                    u_resolution: { type: 'v2', value: new THREE.Vector2() },
                },
                vertexShader:
                    '\n        uniform float u_time;\n        uniform float u_drag_time;\n        uniform vec2 u_resolution;\n        attribute float rndId;\n        varying float vRndId;\n\n        varying float pct;\n\n        void main() {\n          vRndId = rndId;\n          vec2 st = position.xy/u_resolution;\n\n          pct = min(1.0, u_time / (1000. / max(0.2, 0.2 * sin(fract(rndId)))));\n          float vNormal = rndId + ((1.0 - rndId) * pct);\n          vNormal = rndId + ((1.0 - rndId));\n          vNormal = smoothstep(0., 1.0, vNormal);\n          if (u_drag_time > 0.) {\n            vNormal -= ((sin(u_time / 400.0 * vRndId) + 1.0) * 0.02) * min(1., u_drag_time / 1200.0);\n          }\n          vec4 modelViewPosition = modelViewMatrix * vec4(position, vNormal);\n          gl_Position = projectionMatrix * modelViewPosition;\n        }\n    ',
                fragmentShader:
                    '\n        uniform bool u_dragging;\n        uniform float u_time;\n        uniform float u_drag_time;\n        varying float vRndId;\n        varying float pct;\n\n        void main() {\n          float v = sin(u_time / 200.0 * vRndId);\n          float alpha = pct * 0.4 + v * 0.2;\n          float r = 0.3;\n          float g = 0.392;\n          float b = 0.5;\n          float dragDur = 1200.0;\n          vec3 color = vec3(r, g, b);\n          float rInc = min(1.0, u_drag_time / dragDur) * (sin(u_drag_time / (dragDur * 0.5) + 1.0) * 0.1);\n          float gInc = min(1.0, u_drag_time / dragDur) * (sin(u_drag_time / (dragDur * 0.75) - 1.0) * 0.1);\n          float bInc = min(1.0, u_drag_time / dragDur) * (sin(u_drag_time / dragDur) * 0.1);\n          if (u_dragging) {\n            color.r = r + rInc;\n            color.g = g + gInc;\n            color.b = b + bInc;\n          }\n\n          gl_FragColor = vec4(color, alpha);\n        }\n    ',
            })),
            (this.material.side = 2);
        const u = new THREE.Mesh(h, this.material);
        this.add(u),
            (this.material.uniforms.u_resolution.value.x = window.innerWidth),
            (this.material.uniforms.u_resolution.value.y = window.innerHeight),
            (this.startTime = performance.now()),
            (this.dragStartTime = 0),
            this.callback();
    }
    startDragging() {
        this.material &&
            !this.isStatic &&
            ((this.isDragging = !0),
            (this.dragStartTime = performance.now()),
            (this.material.uniforms.u_time.value = performance.now() - this.dragStartTime));
    }
    stopDragging() {
        this.isDragging = !1;
    }
    updateDragTimer() {
        this.isDragging
            ? (this.dragTime = performance.now() - this.dragStartTime)
            : this.dragTime > 0.1 && (this.dragTime = Math.max(0, 0.9 * this.dragTime));
    }
    animate() {
        if ((this.updateDragTimer(), !this.material)) {
            return;
        }
        this.material.uniforms.u_drag_time.value = this.dragTime;
        const t = this.isStatic ? 3e3 : performance.now() - this.startTime;
        this.material.uniforms.u_time.value = t;
    }
}
const Qh = 2 * Math.PI;
const Kh = 0.1111 * Math.PI;
const $h = Math.PI;
const tl = 0.1 * Math.PI;
const el = -0.5 * Math.PI;
const il = 0.25 * Math.PI;

class Globe {
    constructor(i) {
        (this.el = undefined),
            (this.eastCountryList = ['my', 'sg', 'au', 'nz', 'hk', 'jp', 'in']),
            (this.westCountryList = ['ca', 'mx', 'us', 'br']),
            (this.middleCountryList = [
                'be',
                'gb',
                'at',
                'dk',
                'ee',
                'fi',
                'fr',
                'gr',
                'de',
                'ie',
                'it',
                'lv',
                'lt',
                'lu',
                'nl',
                'no',
                'pl',
                'pt',
                'es',
                'sk',
                'si',
                'se',
                'ch',
                'cy',
                'bg',
                'ro',
                'cz',
            ]),
            (this.liveCountryList = [
                ...this.eastCountryList,
                ...this.westCountryList,
                ...this.middleCountryList,
            ]),
            (this.countryList = Object.keys(Dh)),
            (this.origin = new THREE.Vector3(0, 0, 0)),
            (this.dom = {}),
            (this.mouse = new THREE.Vector2()),
            (this.isDragging = !1),
            (this.isStatic = false),
            (this.isDiscTextureLoaded = !1),
            (this.arcTexturesLoaded = 0),
            (this.globeOff = !1),
            (this.scrollTop = 0),
            (this.globeOpacity = 0),
            (this.lineCount = 0),
            (this.arcColors = [
                [0x00d1ff, 0x00d1ff],
                [0x00d1ff, 0x00d1ff],
                [0x00d1ff, 0x00d1ff],
                [0x00d1ff, 0x00d1ff],
            ]),
            (this.scene = new THREE.Scene()),
            (this.globeRadius = 250 + 0.3 * Math.min(document.documentElement.clientWidth, 1080)),
            (this.globeSegments = Math.floor((this.globeRadius / 250) * 10) + 20),
            (this.isLoaded = !1),
            (this.loaded = []),
            (this.loading = []),
            (this.isScrolling = !1),
            (this.isRevealed = !1),
            (this.frame = 0),
            (this.touchDistanceX = undefined),
            (this.touchStartX = undefined),
            (this.touchDistanceY = undefined),
            (this.touchStartY = undefined),
            (this.oldRotationY = 0),
            (this.oldRotationX = 0),
            (this.newRotationY = 0),
            (this.newRotationX = 0),
            (this.globeRotationIncrement = 0.02),
            (this.targetScale = 1),
            (this.scale = 1),
            (this.oldMouseX = 0),
            (this.oldMouseY = 0),
            (this.moveX = 0),
            (this.moveY = 0),
            (this.tension = 1),
            (this.arcTextures = undefined),
            (this.windowW = undefined),
            (this.windowH = undefined),
            (this.aspectRatio = undefined),
            (this.oldInnerWidth = undefined),
            (this.camera = undefined),
            (this.renderer = undefined),
            (this.globeContainer = undefined),
            (this.globeDots = undefined),
            (this.globeFillMaterial = undefined),
            (this.globeFillSphere = undefined),
            (this.globeFill = undefined),
            (this.globeMap = undefined),
            (this.circleTexture = undefined),
            (this.linesContainer = undefined),
            (this.lineInterval = undefined),
            (this.renderAnimationFrame = undefined),
            (this.throwAnimationFrame = undefined),
            (this.initialized = !1),
            (this.currentLines = []),
            (this.handleDragStart = () => {
                this.globeDots.startDragging(),
                    (this.isDragging = !0),
                    (this.oldRotationX = this.globeContainer.rotation.x),
                    (this.oldRotationY = this.globeContainer.rotation.y),
                    (this.targetScale = this.isStatic ? 1 : 0.98),
                    document.documentElement.classList.add('is-globe-dragging');
            }),
            (this.handleTouchStart = (t) => {
                const e = t.touches[0] || t.changedTouches[0];
                (this.oldMouseX = e.pageX),
                    (this.oldMouseY = e.pageY),
                    (this.mouse.x = e.pageX),
                    (this.mouse.y = e.pageY),
                    (this.touchStartX = e.pageX),
                    (this.touchStartY = e.pageY),
                    this.handleDragStart();
            }),
            (this.handleMouseMove = (t) => {
                (this.mouse.x = t.clientX), (this.mouse.y = t.clientY), this.handleDragging();
            }),
            (this.handleTouchMove = (t) => {
                const e = t.touches[0] || t.changedTouches[0];
                (this.touchDistanceX = Math.abs(this.touchStartX - e.pageX)),
                    (this.touchDistanceY = Math.abs(this.touchStartY - e.pageY)),
                    this.touchDistanceY > this.touchDistanceX ||
                        ((this.mouse.x = e.pageX), (this.mouse.y = e.pageY), this.handleDragging());
            }),
            (this.handleMouseUp = () => {
                setTimeout(() => {
                    document.documentElement.classList.remove('is-globe-dragging');
                }, 20),
                    (this.isDragging = !1),
                    (this.moveX !== 0 || Math.abs(this.moveY) > 0) &&
                        this.throwGlobe(this.moveX, this.moveY),
                    (this.oldMouseX = 0),
                    (this.oldMouseY = 0),
                    (this.moveX = 0),
                    (this.moveY = 0),
                    (this.targetScale = 1),
                    this.globeDots.stopDragging();
            }),
            (this.handleMouseDown = (t) => {
                document.documentElement.classList.add('is-globe-dragging'),
                    (this.oldMouseX = t.clientX),
                    (this.oldMouseY = t.clientY),
                    this.handleDragStart();
            }),
            (this.handleDragging = () => {
                this.isDragging &&
                    ((this.tension = 1 + Math.abs(this.oldRotationX)),
                    (this.tension **= this.tension),
                    (this.moveX = -0.003 * (this.oldMouseX - this.mouse.x)),
                    (this.moveY = (-0.003 * (this.oldMouseY - this.mouse.y)) / this.tension),
                    (this.newRotationY = this.resetRevolutions(this.oldRotationY + this.moveX)),
                    (this.newRotationX = Math.max(
                        el,
                        Math.min(il, this.oldRotationX + this.moveY)
                    )),
                    (this.globeContainer.rotation.y = this.newRotationY),
                    (this.globeContainer.rotation.x = this.newRotationX),
                    (this.oldRotationY = this.newRotationY),
                    (this.oldRotationX = this.newRotationX),
                    (this.oldMouseX = this.mouse.x),
                    (this.oldMouseY = this.mouse.y));
            }),
            (this.setWindowSize = () => {
                (this.windowW = document.documentElement.clientWidth),
                    (this.windowH = this.el.offsetHeight),
                    (this.aspectRatio = this.windowW / this.windowH),
                    this.renderer.setSize(this.windowW, this.windowH),
                    (this.oldInnerWidth = this.windowW);
            }),
            (this.handleResize = () => {
                const t = document.documentElement.clientWidth;
                (this.oldInnerWidth !== t || t > 512) && (this.setWindowSize(), this.addCamera());
            }),
            (this.el = i);
    }
    load() {
        return (
            this.loading.push('scene'),
            (this.el.style.height = window.outerHeight),
            (this.dom.container = this.el),
            this.addRenderer(),
            this.addLighting(),
            this.addGlobe(),
            this.addListeners(),
            this.setWindowSize(),
            this.addCamera(),
            this.objectLoaded('scene'),
            !0
        );
    }
    play() {
        this.initialized && !this.isStatic
            ? (this.currentLines.forEach((t) => t.play()), this.drawLines())
            : this.addLines(),
            (this.initialized && this.isStatic) || this.render(this.frame),
            (this.initialized = !0);
    }
    pause() {
        this.currentLines.forEach((t) => t.pause()),
            cancelAnimationFrame(this.renderAnimationFrame),
            clearInterval(this.lineInterval);
    }
    disconnect() {
        clearInterval(this.lineInterval),
            cancelAnimationFrame(this.renderAnimationFrame),
            cancelAnimationFrame(this.throwAnimationFrame),
            window.removeEventListener('resize', this.handleResize),
            this.isStatic ||
                (window.removeEventListener('mouseup', this.handleMouseUp),
                window.removeEventListener('mousemove', this.handleMouseMove),
                this.el.removeEventListener('touchstart', this.handleTouchStart),
                window.removeEventListener('touchmove', this.handleTouchMove),
                window.removeEventListener('touchend', this.handleMouseUp),
                this.el.removeEventListener('mousedown', this.handleMouseDown));
    }
    setCountryList(t) {
        this.countryList = t;
    }
    addCamera() {
        const t = 0.5 * this.windowH;
        const e = -this.aspectRatio * this.windowH * 0.5;
        const i = 4 * this.globeRadius;
        this.camera || (this.camera = new THREE.OrthographicCamera(0, 0, 0, 0, 0, 0)),
            (this.camera.left = e),
            (this.camera.right = -e),
            (this.camera.top = t),
            (this.camera.bottom = -t),
            (this.camera.near = -i),
            (this.camera.far = i),
            this.shiftCamera(),
            this.camera.updateProjectionMatrix();
    }
    shiftCamera() {
        const t = 1.05 * -this.globeRadius;
        (this.camera.position.x = t), (this.camera.position.y = 0.2 * this.globeRadius);
    }
    addRenderer() {
        (this.renderer = new THREE.WebGLRenderer({ antialias: !1, alpha: !0 })),
            this.renderer.setPixelRatio(window.devicePixelRatio),
            this.renderer.setClearColor(14540253, 0),
            (this.renderer.sortObjects = !1),
            this.dom.container.appendChild(this.renderer.domElement);
    }
    addLighting() {
        const t = new THREE.AmbientLight(0xf7fafc, 1);
        this.scene.add(t);
        const e = new THREE.PointLight(0xffffff, 2, 0, 2);
        e.position.set(-1e3, -1100, -3300), this.scene.add(e);
        const i = new THREE.PointLight(10593711, 0.1, 0, 20);
        i.position.set(-3e3, 3e3, 3300), this.scene.add(i);
    }
    addGlobe() {
        (this.globeContainer = new THREE.Group()),
            this.scene.add(this.globeContainer),
            this.addGlobeMap(),
            this.addGlobeDots(),
            this.addGlobeFill(),
            (this.globeContainer.position.z = 2 * -this.globeRadius),
            (this.globeContainer.rotation.x = Kh),
            (this.globeContainer.rotation.y = this.isStatic ? tl : $h);
    }
    addGlobeDots() {
        this.loading.push('globeDots'),
            (this.globeDots = new Jh(
                this.globeRadius,
                () => {
                    this.objectLoaded('globeDots');
                },
                this.isStatic
            )),
            this.globeMap.add(this.globeDots);
    }
    addGlobeFill() {
        (this.globeFillMaterial = new THREE.MeshLambertMaterial({
            transparent: !0,
            opacity: 0,
            color: 0xf7f9fc,
        })),
            (this.globeFillSphere = new THREE.SphereGeometry(
                this.globeRadius - 0.1,
                this.globeSegments,
                this.globeSegments
            )),
            (this.globeFill = new THREE.Mesh(this.globeFillSphere, this.globeFillMaterial)),
            this.globeMap.add(this.globeFill);
    }
    addGlobeMap() {
        (this.globeMap = new THREE.Group()), this.globeContainer.add(this.globeMap);
    }
    throwGlobe(t, e) {
        const i = 0.94 * t;
        const n = 0.94 * e;
        const r = this.globeContainer.rotation.y + i;
        const a = Math.max(el, Math.min(il, this.globeContainer.rotation.x + n));
        (this.globeContainer.rotation.y = this.resetRevolutions(r)),
            (this.globeContainer.rotation.x = a),
            (Math.abs(i) > 0.001 || Math.abs(n) > 0.001) &&
                !1 === this.isDragging &&
                (this.throwAnimationFrame = requestAnimationFrame(() => {
                    this.throwGlobe(i, n);
                }));
    }
    addLines() {
        (this.circleTexture = new THREE.TextureLoader().load(discTexture, () => {
            this.isDiscTextureLoaded = !0;
        })),
            (this.linesContainer = new THREE.Group()),
            this.globeContainer.add(this.linesContainer),
            this.drawLines();
    }
    drawLines() {
        if (!this.isStatic) {
            return (
                clearInterval(this.lineInterval),
                (this.lineInterval = setInterval(() => {
                    this.drawLine();
                }, 1e3))
            );
        }
        if (this.lineCount === 0) {
            for (let t = 0; t < 5; t += 1) {
                this.drawLine();
            }
        }
    }
    drawLine() {
        this.lineCount += 1;
        const t = this.resetRevolutions(this.globeContainer.rotation.y);
        let e = this.countryList[this.lineCount % this.countryList.length];
        let i = this.liveCountryList[this.lineCount % this.liveCountryList.length];
        if (
            ((t < 5.7 && t > 4.4) || (t > -2 && t < -0.2)
                ? (i = this.eastCountryList[this.lineCount % this.eastCountryList.length])
                : (t < 4.2 && t > 2.2) || (t > -4 && t < -1.7)
                ? (((t < -1.7 && t > -3) || (t > 3 && t < 4.2)) &&
                      (e = this.eastCountryList[this.lineCount % this.eastCountryList.length]),
                  (i = this.westCountryList[this.lineCount % this.westCountryList.length]))
                : ((t < 2.2 && t > 0.3) || (t > -6.28 && t < -4)) &&
                  (i = this.middleCountryList[this.lineCount % this.middleCountryList.length]),
            e === i)
        ) {
            return this.drawLine();
        }
        const r = Dh[e];
        const a = Dh[i];
        const o = this.lineCount % this.arcColors.length;
        const s = this.arcColors[o];
        const c = new Xh(
            r,
            a,
            s,
            null,
            this.circleTexture,
            1.001 * this.globeRadius + 0.01 * Math.random(),
            this.isStatic
        );
        this.linesContainer.add(c),
            this.currentLines.push(c),
            this.isStatic ||
                timings.delay(() => {
                    this.hideLine(c);
                    const t = this.currentLines.indexOf(c);
                    t > -1 && this.currentLines.splice(t, 1);
                }, 4e3);
    }
    hideLine(t) {
        t.hideLine(),
            timings.delay(() => {
                t.disposeLine(), this.linesContainer.remove(t);
            }, 1500);
    }
    objectLoaded(t = 'x') {
        this.loaded.push(t), this.loaded.length === this.loading.length && (this.isLoaded = !0);
    }
    resetRevolutions(t) {
        if (Math.abs(t / Qh) === 0) {
            return t;
        }
        return t - Math.floor(Math.abs(t / Qh)) * Math.sign(t) * Qh;
    }
    addListeners() {
        window.addEventListener('resize', this.handleResize),
            this.isStatic ||
                (window.addEventListener('mouseup', this.handleMouseUp),
                window.addEventListener('mousemove', this.handleMouseMove),
                this.el.addEventListener('touchstart', this.handleTouchStart, { passive: !0 }),
                window.addEventListener('touchmove', this.handleTouchMove),
                window.addEventListener('touchend', this.handleMouseUp),
                this.el.addEventListener('mousedown', this.handleMouseDown));
    }
    revealAnimation() {
        const t = this.isStatic ? 1 : easings.easeOutQuart(this.globeOpacity, 0, 1, 1);
        (this.globeOpacity += 0.005),
            (this.globeFillMaterial.opacity = 0.94 * t),
            (this.globeRotationIncrement = 0.02 * (1 - t) + 0.001 * t),
            t > 0.999 && (this.isRevealed = !0);
    }
    autoRotateGlobe() {
        this.isDragging ||
            this.isScrolling ||
            this.isStatic ||
            (this.globeContainer.rotation.y -= this.globeRotationIncrement);
    }
    render(t = 0) {
        (this.frame = t),
            this.autoRotateGlobe(),
            Math.abs(this.scale - this.targetScale) > 0.001 &&
                ((this.scale -= 0.1 * (this.scale - this.targetScale)),
                this.globeFill.scale.set(this.scale, this.scale, this.scale)),
            !this.globeOff &&
                this.isLoaded &&
                (this.globeDots.animate(),
                this.isRevealed || this.revealAnimation(),
                this.renderer.render(this.scene, this.camera)),
            (this.renderAnimationFrame = requestAnimationFrame(() => {
                this.isRevealed && this.isStatic && this.isDiscTextureLoaded
                    ? this.renderer.render(this.scene, this.camera)
                    : this.render(t + 1);
            }));
    }
}
export default Globe;
