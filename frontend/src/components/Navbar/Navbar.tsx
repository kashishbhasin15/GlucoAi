import { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import './Navbar.css';
const menus = [
  { label: 'Analytics', to: '/analytics/overview', base: '/analytics', items: [['Healthcare Overview','/analytics/overview'],['Patient Analytics','/analytics/patients'],['Hospital Analytics','/analytics/hospital'],['Readmission Analytics','/analytics/readmission']] },
  { label: 'AI Prediction', to: '/prediction', base: '/prediction', items: [['Diabetes Risk Screening','/prediction/diabetes'],['Readmission Prediction','/prediction/readmission'],['Hospital Stay Prediction', '/prediction/hospital-stay']] },
];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const close = () => setOpen(false);
  return (
    <header className="glx-nav">
      <Link to="/" className="glx-nav__logo" onClick={close}>GLUCO<span>AI</span></Link>
      <button className="glx-nav__toggle" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <nav className={`glx-nav__links ${open ? 'is-open' : ''}`} aria-label="Main">
        <NavLink to="/" end onClick={close} className="glx-nav__link">Home</NavLink>
        {menus.map(m => (
          <div className="glx-nav__drop" key={m.label}>
            <Link to={m.to} onClick={close} className={`glx-nav__link ${pathname.startsWith(m.base) ? 'active' : ''}`}>{m.label}<ChevronDown size={14} /></Link>
            <div className="glx-nav__menu">{m.items.map(([l, t]) => <Link key={t} to={t} onClick={close}>{l}</Link>)}</div>
          </div>
        ))}
        {/* <NavLink to="/insights" onClick={close} className="glx-nav__link">AI Insights</NavLink> */}
        <NavLink to="/about" onClick={close} className="glx-nav__link">About</NavLink>
        <Link to="/analytics/overview" onClick={close} className="glx-nav__cta">Explore Dashboard</Link>
      </nav>
    </header>
  );
}
