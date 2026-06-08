import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeApi } from '../services/api';
import DeptBadge from '../components/DeptBadge';

function StatCard({ label, value, icon, color, sub }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '22px 24px',
      animation: 'fadeUp 0.3s ease',
    }}>
      <div style={{
        fontSize: 11, fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 12,
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>{label.toUpperCase()}</span>
        <span style={{ fontSize: 18 }}>{icon}</span>
      </div>
      <div style={{
        fontSize: 36, fontFamily: 'var(--font-display)',
        fontWeight: 800, color, lineHeight: 1,
      }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>{sub}</div>}
    </div>
  );
}

function RecentCard({ emp }) {
  const initials = emp.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 0', borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: '50%',
        background: 'var(--accent-glow)', border: '1px solid var(--border-glow)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 700, color: 'var(--accent-light)',
        flexShrink: 0, fontFamily: 'var(--font-display)',
      }}>{initials}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{emp.name}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{emp.role || '—'}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <DeptBadge dept={emp.department} />
        <div style={{ fontSize: 12, color: 'var(--green)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
          ${emp.salary?.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    employeeApi.getAll().then(data => {
      setEmployees(Array.isArray(data) ? data : []);
    }).catch(() => setEmployees([])).finally(() => setLoading(false));
  }, []);

  const total = employees.length;
  const avgSalary = total ? Math.round(employees.reduce((s, e) => s + e.salary, 0) / total) : 0;
  const maxSalary = total ? Math.max(...employees.map(e => e.salary)) : 0;
  const depts = new Set(employees.map(e => e.department)).size;
  const recent = [...employees].sort((a, b) =>
    new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 5);

  const deptCounts = employees.reduce((acc, e) => {
    acc[e.department] = (acc[e.department] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ padding: '28px', overflowY: 'auto', height: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontSize: 10, fontFamily: 'var(--font-mono)',
          color: 'var(--accent-light)', letterSpacing: 2, marginBottom: 6,
        }}>◈ DASHBOARD</div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 28,
          fontWeight: 800, color: 'var(--text)',
        }}>Overview</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>
          Live data from PostgreSQL · nexahrdb
        </p>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
          Loading data from database…
        </div>
      ) : (
        <>
          {/* Stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16, marginBottom: 28,
          }}>
            <StatCard label="Total Employees" value={total} icon="◎" color="var(--accent-light)" sub="Across all departments" />
            <StatCard label="Avg Salary" value={`$${avgSalary.toLocaleString()}`} icon="◈" color="var(--green)" sub="Annual compensation" />
            <StatCard label="Departments" value={depts} icon="◉" color="var(--cyan)" sub="Active divisions" />
            <StatCard label="Highest Salary" value={`$${maxSalary.toLocaleString()}`} icon="▲" color="var(--amber)" sub="Top earner" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
            {/* Department breakdown */}
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '22px 24px',
            }}>
              <div style={{
                fontSize: 10, fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 16,
              }}>DEPARTMENTS</div>
              {Object.entries(deptCounts).sort((a, b) => b[1] - a[1]).map(([dept, count]) => (
                <div key={dept} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  marginBottom: 12,
                }}>
                  <DeptBadge dept={dept} />
                  <div style={{
                    flex: 1, height: 4, background: 'var(--bg-card2)',
                    borderRadius: 2, overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', borderRadius: 2,
                      background: 'linear-gradient(90deg, var(--accent), var(--cyan))',
                      width: `${(count / total) * 100}%`,
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                  <span style={{
                    fontSize: 12, fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)', minWidth: 20, textAlign: 'right',
                  }}>{count}</span>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '22px 24px',
            }}>
              <div style={{
                fontSize: 10, fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 16,
              }}>QUICK ACTIONS</div>
              {[
                { label: 'Ask AI Assistant', sub: 'Query your employee data', icon: '◉', to: '/ai', color: 'var(--accent)' },
                { label: 'Manage Employees', sub: 'Add, edit, delete records', icon: '◎', to: '/employees', color: 'var(--cyan)' },
              ].map(({ label, sub, icon, to, color }) => (
                <div key={to} onClick={() => navigate(to)} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)', background: 'var(--bg-card2)',
                  cursor: 'pointer', marginBottom: 10,
                  transition: 'border-color 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <span style={{ fontSize: 22, color }}>{icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: 'var(--text-faint)' }}>→</span>
                </div>
              ))}

              {/* AI Suggest */}
              <div style={{
                marginTop: 16, padding: '12px 14px',
                background: 'var(--accent-glow)', border: '1px solid var(--border-glow)',
                borderRadius: 'var(--radius)', fontSize: 12,
                fontFamily: 'var(--font-mono)', color: 'var(--accent-light)', lineHeight: 1.8,
              }}>
                ◉ Try asking AI:<br />
                <span style={{ color: 'var(--text-muted)' }}>
                  "Who is the highest paid employee?"<br />
                  "How many people are in HR?"
                </span>
              </div>
            </div>
          </div>

          {/* Recent Employees */}
          {recent.length > 0 && (
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '22px 24px',
            }}>
              <div style={{
                fontSize: 10, fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 16,
              }}>RECENTLY ADDED</div>
              {recent.map(emp => <RecentCard key={emp.id} emp={emp} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
