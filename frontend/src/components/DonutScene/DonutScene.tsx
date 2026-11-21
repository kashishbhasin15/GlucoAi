import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { donutSegments } from '../../data/analyticsMockData';
import './DonutScene.css';

export interface Progress { v: number }
const GAP = 0.04;
function noiseTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d')!, img = x.createImageData(128, 128);
  for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
  x.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1.4, 1.4); return t;
}
function build(lo: number, hi: number, rIn: number, rOut: number, depth: number) {
  const sh = new THREE.Shape();
  sh.absarc(0, 0, rOut, lo + GAP, hi - GAP, false); sh.absarc(0, 0, rIn, hi - GAP, lo + GAP, true); sh.closePath();
  const geo = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: true, bevelSize: 0.07, bevelThickness: 0.07, bevelSegments: 5, curveSegments: 64 });
  geo.translate(0, 0, -depth / 2); return geo;
}
function Pieces({ progress }: { progress: Progress }) {
  const group = useRef<THREE.Group>(null!), parts = useRef<THREE.Mesh[]>([]);
  const noise = useMemo(noiseTexture, []);
  useEffect(() => () => noise.dispose(), [noise]);
  const items = useMemo(() => {
    let a = Math.PI / 2;
    const ring = donutSegments.map(s => {
      const lo = a - (s.span * Math.PI) / 180, hi = a, mid = (lo + hi) / 2; a = lo;
      const geo = build(lo, hi, 1.0, 2.3, 1.0);
      return { geo, kind: s.kind as string, color: s.color, out: s.out, dist: 1.0 + (s.kind === 'frost' || s.kind === 'glass' ? 0.9 : 0.4), dx: Math.cos(mid), dy: Math.sin(mid), edges: s.kind === 'frost' || s.kind === 'glass' ? new THREE.EdgesGeometry(geo, 35) : null };
    });
    const geo = build(0.2, 1.3, 3.9, 4.7, 1.1); // oversized glass arc, top-right of the frame
    ring.push({ geo, kind: 'arc', color: "#B9A4F0", out: 0, dist: 3, dx: Math.cos(0.75), dy: Math.sin(0.75), edges: new THREE.EdgesGeometry(geo, 35) });
    return ring;
  }, []);
  useFrame((state, dt) => {
    const p = progress.v, t = state.clock.elapsedTime;
    group.current.rotation.x = THREE.MathUtils.lerp(-0.85, 0, p);
    group.current.rotation.z = THREE.MathUtils.lerp(0.2 + Math.sin(t * 0.25) * 0.08, 0, p);
    group.current.scale.setScalar(1 + p * 1.5);
    parts.current.forEach((m, i) => {
      if (!m) return; const it = items[i], d = it.out + p * it.dist;
      m.position.set(it.dx * d, it.dy * d, Math.sin(p * Math.PI) * 0.4 * (i % 2 ? 1 : -1)); m.rotation.z = (i % 2 ? 0.12 : -0.12) * p;
    });
    state.camera.position.z = THREE.MathUtils.lerp(8.6, 4.4, p);
    void dt;
  });
  return (
    <group ref={group}>
      {items.map((it, i) => (
        <mesh key={i} geometry={it.geo} ref={el => { if (el) parts.current[i] = el; }}>
          {it.kind === 'glass' || it.kind === 'arc' ? <meshPhysicalMaterial color={it.color} transmission={1} thickness={1.2} ior={1.5} roughness={0.06} clearcoat={1} iridescence={0.7} attenuationColor="#986B9F" attenuationDistance={3} />
            : it.kind === 'frost' ? <meshPhysicalMaterial color={it.color} transmission={0.85} thickness={1} ior={1.4} roughness={0.45} iridescence={1} />
            : it.kind === 'grain' ? <meshStandardMaterial color={it.color} roughness={0.75} bumpMap={noise} bumpScale={2.5} />
            : <meshPhysicalMaterial color={it.color} roughness={it.kind === 'glossy' ? 0.22 : 0.4} metalness={0.05} clearcoat={it.kind === 'glossy' ? 1 : 0.4} emissive={it.color} emissiveIntensity={0.05} />}
          {it.edges && <lineSegments geometry={it.edges}><lineBasicMaterial color="#F6CDEF" transparent opacity={0.75} /></lineSegments>}
        </mesh>
      ))}
    </group>
  );
}
export default function DonutScene({ progress }: { progress: Progress }) {
  return (
    <div className="glx-donut" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 8.6], fov: 38 }} dpr={[1, 1.6]}>
        <ambientLight intensity={0.45} />
        <directionalLight position={[-4, 6, 6]} intensity={2.4} />
        <pointLight position={[5, -3, 4]} intensity={40} color="#4448F5" />
        <pointLight position={[-5, 2, 3]} intensity={35} color="#E8A1CA" />
        <Environment preset="studio" />
        <Pieces progress={progress} />
      </Canvas>
    </div>
  );
}
