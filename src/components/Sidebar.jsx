import { NavLink } from 'react-router-dom';

const NAV = [
  { to: '/',        icon: '◈', label: 'Dashboard'  },
  { to: '/ai',      icon: '◉', label: 'AI Assistant' },
  { to: '/employees', icon: '◎', label: 'Employees' },
];

const S = {
  sidebar: {
    width: 220,
    flexShrink: 0,
    background: 'var(--bg-card)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 0',
    position: 'sticky',
    top: 0,
    height: '100vh',
  },
  logo: {
    padding: '0 22px 28px',
    borderBottom: '1px solid var(--border)',
    marginBottom: 16,
  },
  logoTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 22,
    fontWeight: 800,
    color: 'var(--text)',
    letterSpacing: '-0.5px',
  },
  logoSub: {
    fontSize: 10,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    marginTop: 3,
    letterSpacing: 1,
  },
  navItem: (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 22px',
    margin: '2px 10px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: isActive ? 600 : 400,
    color: isActive ? 'var(--text)' : 'var(--text-muted)',
    background: isActive ? 'var(--accent-glow)' : 'transparent',
    border: isActive ? '1px solid var(--border-glow)' : '1px solid transparent',
    textDecoration: 'none',
    transition: 'all 0.15s',
  }),
  icon: {
    fontSize: 16,
    width: 20,
    textAlign: 'center',
    color: 'var(--accent-light)',
  },
  footer: {
    marginTop: 'auto',
    padding: '16px 22px',
    borderTop: '1px solid var(--border)',
    fontSize: 10,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-faint)',
    lineHeight: 1.8,
  },
};

export default function Sidebar({ connected }) {
  return (
    <nav style={S.sidebar}>
      <div style={S.logo}>
        <div style={S.logoTitle}>
          Nexa<span style={{ color: 'var(--accent)' }}>HR</span>
        </div>
        <div style={S.logoSub}>AI EMPLOYEE MGMT v2.0</div>
      </div>

      {NAV.map(({ to, icon, label }) => (
        <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => S.navItem(isActive)}>
          <span style={S.icon}>{icon}</span>
          {label}
        </NavLink>
      ))}

      <div style={S.footer}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: connected ? 'var(--green)' : 'var(--red)',
            display: 'inline-block',
            boxShadow: connected ? '0 0 8px var(--green)' : 'none',
          }} />
          <span>{connected ? 'CONNECTED' : 'OFFLINE'}</span>
        </div>
        SPRING BOOT 3.3<br />
        POSTGRESQL<br />
        OLLAMA · LLAMA3.2<br />
        REACT 18
      </div>
    </nav>
  );
}
