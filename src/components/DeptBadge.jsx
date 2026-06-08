const COLORS = {
  Engineering: { bg: 'rgba(99,102,241,0.15)',  color: '#818cf8', border: 'rgba(99,102,241,0.3)'  },
  Marketing:   { bg: 'rgba(236,72,153,0.12)',  color: '#f472b6', border: 'rgba(236,72,153,0.3)'  },
  Finance:     { bg: 'rgba(245,158,11,0.12)',  color: '#fbbf24', border: 'rgba(245,158,11,0.3)'  },
  HR:          { bg: 'rgba(16,185,129,0.12)',  color: '#34d399', border: 'rgba(16,185,129,0.3)'  },
  Sales:       { bg: 'rgba(239,68,68,0.12)',   color: '#f87171', border: 'rgba(239,68,68,0.3)'   },
  Operations:  { bg: 'rgba(6,182,212,0.12)',   color: '#22d3ee', border: 'rgba(6,182,212,0.3)'   },
};

export default function DeptBadge({ dept }) {
  const c = COLORS[dept] || { bg: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: 'var(--border)' };
  return (
    <span style={{
      fontSize: 10, padding: '3px 9px', borderRadius: 20,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: 0.5,
    }}>{dept.toUpperCase()}</span>
  );
}
