
import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { BarDatum } from '../../types';
import './ThreeDBarChart.css';

const A = new THREE.Color('#8BB9FF');
const B = new THREE.Color('#7845E8');

interface Props {
  title: string;
  data: BarDatum[];
  selected?: string | null;
  demo?: boolean;
}

interface BarProps {
  i: number;
  n: number;
  max: number;
  d: BarDatum;
  geo: THREE.BoxGeometry;
  hovered: number | null;
  setHovered: (v: number | null) => void;
  selected?: string | null;
}

function Bar({
  i,
  n,
  max,
  d,
  geo,
  hovered,
  setHovered,
  selected,
}: BarProps) {
  const ref = useRef<THREE.Mesh>(null!);

  // Horizontal spacing between bars
  const sp = Math.min(0.95, 8.2 / n);

  const h = (d.value / max) * 2.7 + 0.15;

  const active = hovered === i || selected === d.label;

  const dim =
    (hovered !== null && hovered !== i) ||
    (!!selected && selected !== d.label && hovered === null);

  useFrame((_, dt) => {
    ref.current.scale.y = THREE.MathUtils.damp(
      ref.current.scale.y,
      h + (active ? 0.22 : 0),
      6,
      dt
    );

    ref.current.position.y = ref.current.scale.y / 2;
  });

  return (
    <group position={[(i - (n - 1) / 2) * sp, 0, 0]}>

      <mesh
        ref={ref}
        geometry={geo}
        scale={[0.7 * sp, 0.01, 0.7 * sp]}
        onPointerOver={e => {
          e.stopPropagation();
          setHovered(i);
        }}
        onPointerOut={() => setHovered(null)}
      >
        <meshPhysicalMaterial
          vertexColors
          emissive="#3b2fb0"
          emissiveIntensity={active ? 1.1 : dim ? 0.05 : 0.45}
          metalness={0.3}
          roughness={0.15}
          clearcoat={1}
          transparent
          opacity={dim ? 0.35 : 0.93}
        />

        <lineSegments>
          <edgesGeometry args={[geo]} />
          <lineBasicMaterial
            color="#F5F0FF"
            transparent
            opacity={dim ? 0.2 : 0.8}
          />
        </lineSegments>
      </mesh>

      {/* X-axis labels */}

      <Html
        position={[0, 0, 0.75]}
        center
        distanceFactor={5}
        style={{
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <span className="glx-bar-label">
          {d.label}
        </span>
      </Html>

    </group>
  );
}

export default function ThreeDBarChart({
  title,
  data,
  selected,
  demo = true,
}: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  const max = Math.max(...data.map(d => d.value), 1);

  const geo = useMemo(() => {
    const g = new THREE.BoxGeometry(1, 1, 1);
    const pos = g.attributes.position;
    const col = new Float32Array(pos.count * 3);
    const c = new THREE.Color();

    for (let i = 0; i < pos.count; i++) {
      c.lerpColors(A, B, pos.getY(i) + 0.5);
      c.toArray(col, i * 3);
    }

    g.setAttribute(
      'color',
      new THREE.BufferAttribute(col, 3)
    );

    return g;
  }, []);

  const d = hovered !== null ? data[hovered] : null;

  return (
    <figure className="glx-bars">
      <figcaption>
        {title} {demo && <em>(demo data)</em>}
      </figcaption>

      <Canvas
        camera={{
          position: [3.6, 2.7, 6],
          fov: 40,
        }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.6} />

        <pointLight
          position={[4, 8, 6]}
          intensity={90}
          color="#8BB9FF"
        />

        <pointLight
          position={[-6, 3, 4]}
          intensity={70}
          color="#E8A1CA"
        />

        <pointLight
          position={[0, 2, -6]}
          intensity={40}
          color="#F4B83F"
        />

        <gridHelper
          args={[9, 18, '#B9A4F0', '#2a2070']}
        />

        {data.map((row, i) => (
          <Bar
            key={row.label}
            i={i}
            n={data.length}
            max={max}
            d={row}
            geo={geo}
            hovered={hovered}
            setHovered={setHovered}
            selected={selected}
          />
        ))}

        <OrbitControls
          target={[0, 1.1, 0]}
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={0.9}
        />
      </Canvas>

      <div
        className={`glx-bar-tip ${d ? 'is-on' : ''}`}
        aria-live="polite"
      >
        {d ? (
          <>
            <strong>{d.label}</strong>

            {d.lines.map(l => {
              const [k, v] = l.split('|');

              return (
                <span key={k}>
                  {k}
                  <b>{v}</b>
                </span>
              );
            })}

            {demo && <em>Demo data</em>}
          </>
        ) : (
          <span className="glx-bar-tip__hint">
            Hover a bar
          </span>
        )}
      </div>
    </figure>
  );
}
