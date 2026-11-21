import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import './ThreeDDonutChart.css';
interface Seg { label: string; value: number; color: string }
interface Props { title: string; segments: Seg[]; hole?: number; demo?: boolean }

function Ring({ segments, hole, hover, setHover }: { segments: Seg[]; hole: number; hover: number | null; setHover: (n: number | null) => void }) {
  const group = useRef<THREE.Group>(null!), meshes = useRef<THREE.Mesh[]>([]);
  const items = useMemo(() => {
    const total = segments.reduce((a, s) => a + s.value, 0); let a0 = -Math.PI / 2;
    return segments.map(s => {
      const a1 = a0 + (s.value / total) * Math.PI * 2, mid = (a0 + a1) / 2, sh = new THREE.Shape();
      if (hole > 0) { sh.absarc(0, 0, 1.6, a0 + 0.02, a1 - 0.02, false); sh.absarc(0, 0, 1.6 * hole, a1 - 0.02, a0 + 0.02, true); }
      else { sh.moveTo(0, 0); sh.absarc(0, 0, 1.6, a0 + 0.02, a1 - 0.02, false); sh.lineTo(0, 0); }
      const geo = new THREE.ExtrudeGeometry(sh, { depth: 0.7, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 3, curveSegments: 40 });
      a0 = a1; return { geo, edges: new THREE.EdgesGeometry(geo, 35), color: s.color, dx: Math.cos(mid), dy: Math.sin(mid) };
    });
  }, [segments, hole]);
  useFrame((_, dt) => {
    group.current.rotation.z += dt * 0.12;
    meshes.current.forEach((m, i) => { if (!m) return; const k = hover === i ? 0.3 : 0; m.position.x = THREE.MathUtils.damp(m.position.x, items[i].dx * k, 6, dt); m.position.y = THREE.MathUtils.damp(m.position.y, items[i].dy * k, 6, dt); });
  });
  return (
    <group rotation={[-0.95, 0, 0]}><group ref={group}>
      {items.map((it, i) => (
        <mesh key={i} geometry={it.geo} ref={el => { if (el) meshes.current[i] = el; }} onPointerOver={e => { e.stopPropagation(); setHover(i); }} onPointerOut={() => setHover(null)}>
          <meshPhysicalMaterial color={it.color} metalness={0.2} roughness={0.3} clearcoat={0.8} emissive={it.color} emissiveIntensity={hover === i ? 0.55 : 0.15} />
          <lineSegments geometry={it.edges}><lineBasicMaterial color="#F5F0FF" transparent opacity={0.45} /></lineSegments>
        </mesh>))}
    </group></group>
  );
}
export default function ThreeDDonutChart({ title, segments, hole = 0, demo = true }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <figure className="glx-pie">
      <figcaption>{title} {demo && <em>(demo)</em>}</figcaption>
      <Canvas camera={{ position: [0, 0, 5.6], fov: 40 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.6} /><pointLight position={[3, 4, 5]} intensity={60} color="#8BB9FF" /><pointLight position={[-4, -2, 4]} intensity={50} color="#E8A1CA" />
        <Ring segments={segments} hole={hole} hover={hover} setHover={setHover} />
      </Canvas>
      <ul className="glx-pie__legend">
        {segments.map((s, i) => <li key={s.label} className={hover === i ? 'is-on' : ''} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}><i style={{ background: s.color }} />{s.label}<b>{s.value}%</b></li>)}
      </ul>
    </figure>
  );
}
