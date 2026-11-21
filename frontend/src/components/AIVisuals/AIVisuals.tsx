import './AIVisuals.css';
const layers = [[16, 36, 56], [8, 24, 40, 56], [16, 36, 56], [36]];
export function NeuralNet() {
  const xs = [20, 90, 160, 230];
  return (
    <svg className="nn" viewBox="0 0 250 70" aria-hidden="true">
      {layers.slice(0, -1).flatMap((l, li) => l.flatMap((y1, a) => layers[li + 1].map((y2, b) => <line key={`${li}${a}${b}`} x1={xs[li]} y1={y1} x2={xs[li + 1]} y2={y2} className="nn__line" style={{ animationDelay: `${(a + b) * 0.15}s` }} />)))}
      {layers.flatMap((l, li) => l.map((y, i) => <circle key={`n${li}${i}`} cx={xs[li]} cy={y} r="4" className="nn__node" style={{ animationDelay: `${(li + i) * 0.2}s` }} />))}
    </svg>
  );
}
export function OrbitRings() {
  return <div className="orbit" aria-hidden="true"><i /><i /><i /><b /></div>;
}
export function AIOrb() {
  return <div className="orb" aria-hidden="true"><span className="orb__core" /><i /><i /></div>;
}
