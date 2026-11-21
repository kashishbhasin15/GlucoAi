import { Link } from 'react-router-dom';
import './Footer.css';
export default function Footer() {
  return (
    <footer className="glx-footer">
      <div className="glx-footer__grid">
        <div><h3>GLUCOAI</h3><p>Visualizing Diabetes. Empowering Healthcare.</p></div>
        <nav aria-label="Footer"><Link to="/">Home</Link><Link to="/analytics/overview">Analytics</Link><Link to="/prediction">AI Prediction</Link><Link to="/insights">AI Insights</Link><Link to="/about">About</Link></nav>
        <p className="glx-footer__note">Figures describe a historical research dataset, not live hospital activity. GLUCOAI is for educational and research use only and does not provide medical advice, diagnosis, or treatment.</p>
      </div>
      <small>© 2026 GLUCOAI · Frontend demo mode</small>
    </footer>
  );
}
