import { useNavigate } from 'react-router-dom';
import { portals } from './portalConfig';
import './Login.css';

const capabilities = ['People directory', 'Attendance tracking', 'Leave approvals', 'Payroll records'];

function PortalCard({ portal, onOpen }) {
  return (
    <article className="portal-card" style={{
      '--card-accent': portal.primaryColor,
      '--card-accent-2': portal.secondaryColor,
      '--card-shadow': portal.shadowColor,
    }}>
      <div className="portal-head">
        <span className="portal-label">{portal.label}</span>
        <span className="portal-status">{portal.status}</span>
      </div>
      <div className="portal-icon">{portal.icon}</div>
      <h2>{portal.title}</h2>
      <p>{portal.description}</p>
      <div className="portal-features" aria-label={`${portal.title} features`}>
        {portal.features.map((feature) => <span key={feature} className="feature-pill">{feature}</span>)}
      </div>
      <button type="button" className="portal-button" onClick={() => onOpen(portal.loginPath)}>
        <span>Open workspace</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14M13.5 6.5 19 12l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </article>
  );
}

function Login() {
  const navigate = useNavigate();
  const openPortal = (loginPath) => navigate(loginPath);

  return (
    <div className="login-page">
      <div className="login-shell">
        <header className="hero-panel">
          <div className="hero-brand">
            <div className="hero-logo" aria-hidden="true">SS</div>
            <div className="hero-copy">
              <span className="hero-kicker">PEOPLE OPERATIONS, IN SYNC</span>
              <h1>StaffSync</h1>
              <p>One workspace for HR teams, managers, and employees.</p>
            </div>
          </div>
          <ul className="hero-capabilities" aria-label="StaffSync capabilities">
            {capabilities.map((capability) => (
              <li key={capability}><span className="capability-check" aria-hidden="true">✓</span>{capability}</li>
            ))}
          </ul>
          <p className="hero-prompt">Choose the workspace for your role</p>
        </header>
        <main className="portal-grid" aria-label="StaffSync workspaces">
          {portals.map((portal) => <PortalCard key={portal.role} portal={portal} onOpen={openPortal} />)}
        </main>
        <footer className="login-footer">
          <span className="footer-brand">StaffSync</span>
          <span>People operations, made simpler.</span>
          <span>© 2026</span>
        </footer>
      </div>
    </div>
  );
}

export default Login;
