import { useEffect } from 'react';

export default function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, [onClose]);

  const isErr = type === 'error';
  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 9999,
      background: isErr ? '#1f0909' : '#091f14',
      border: `1px solid ${isErr ? 'var(--red)' : 'var(--green)'}`,
      color: isErr ? '#fca5a5' : '#6ee7b7',
      borderRadius: 'var(--radius)', padding: '12px 18px',
      fontSize: 13, fontFamily: 'var(--font-mono)',
      maxWidth: 380, display: 'flex', gap: 10, alignItems: 'center',
      boxShadow: 'var(--shadow)',
      animation: 'slideIn 0.25s ease',
    }}>
      <span style={{ flex: 1 }}>{msg}</span>
      <button onClick={onClose} style={{
        background: 'none', border: 'none', color: 'inherit',
        cursor: 'pointer', fontSize: 18, lineHeight: 1,
      }}>×</button>
    </div>
  );
}
