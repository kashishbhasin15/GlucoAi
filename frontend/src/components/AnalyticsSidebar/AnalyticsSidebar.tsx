import { NavLink } from 'react-router-dom';
import { Activity, Building2, HeartPulse, Users } from 'lucide-react';
import './AnalyticsSidebar.css';
const items = [['Healthcare Overview', '/analytics/overview', Activity], ['Patient Analytics', '/analytics/patients', Users], ['Hospital Analytics', '/analytics/hospital', Building2], ['Readmission Analytics', '/analytics/readmission', HeartPulse]] as const;
export default function AnalyticsSidebar() {
  return (
    <nav className="asb" aria-label="Analytics">
      {items.map(([label, to, Icon]) => <NavLink key={to} to={to} className={({ isActive }) => `asb__link ${isActive ? 'is-active' : ''}`}><Icon size={18} />{label}</NavLink>)}
    </nav>
  );
}
