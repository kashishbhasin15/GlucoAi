import type { HTMLAttributes, ReactNode } from 'react';
import './GlassPanel.css';
interface Props extends HTMLAttributes<HTMLElement> { title?: string; badge?: string; flush?: boolean; children?: ReactNode }
export default function GlassPanel({ title, badge, flush = false, className = '', children, ...rest }: Props) {
  return (
    <section className={`glass ${flush ? 'glass--flush' : ''} ${className}`} {...rest}>
      {title && <header className="glass__head"><h3>{title}</h3>{badge && <em>{badge}</em>}</header>}
      {children}
    </section>
  );
}
