import type { HTMLAttributes } from 'react';
import './NeumorphicCard.css';
interface Props extends HTMLAttributes<HTMLDivElement> { variant?: 'raised' | 'inset'; tilt?: boolean }
export default function NeumorphicCard({ variant = 'raised', tilt = false, className = '', children, ...rest }: Props) {
  return <div className={`neu neu--${variant} ${tilt ? 'neu--tilt' : ''} ${className}`} {...rest}>{children}</div>;
}
