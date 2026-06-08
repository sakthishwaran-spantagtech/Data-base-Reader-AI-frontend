import { useState, useEffect, useCallback, useRef } from 'react';
import { employeeApi } from '../services/api';
import DeptBadge from '../components/DeptBadge';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';

const EMPTY = { name: '', department: '', role: '', salary: '' };
const DEPARTMENTS = ['Engineering', 'Marketing', 'Finance', 'HR', 'Sales', 'Operations'];

// ── Employee Card ────────────────────────────────────────────────────────────

function AiModal({ employee, onClose }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer('');
    try {
      const data = await employeeApi.ask(employee.id, question);
      setAnswer(data.answer || data.error || 'No response.');
    } catch {
      setAnswer('Failed to reach AI. Ensure Ollama is running.');
    }
    setLoading(false);
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 28, width: 'min(520px, 95vw)',
        maxHeight: '85vh', overflowY: 'auto',
        boxShadow: 'var(--shadow)',
        animation: 'fadeUp 0.2s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--accent-light)', marginBottom: 4 }}>
              ◉ ASK AI ABOUT EMPLOYEE
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
              {employee.name}
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
              {employee.role} · {employee.department} · ${employee.salary?.toLocaleString()}/yr
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 22, cursor: 'pointer',
          }}>×</button>
        </div>

        <textarea
          rows={3} value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); }}}
          placeholder="What skills might suit this employee? What are their growth areas?"
          style={{ marginBottom: 10, resize: 'vertical' }}
        />

        <button onClick={ask} disabled={loading || !question.trim()} style={{
          width: '100%', padding: '11px 0',
          background: loading || !question.trim() ? 'var(--bg-card2)' : 'linear-gradient(135deg, var(--accent), #4f46e5)',
          color: loading || !question.trim() ? 'var(--text-faint)' : '#fff',
          border: '1px solid var(--border)', borderRadius: 'var(--radius)',
          fontSize: 14, fontWeight: 600,
        }}>
          {loading ? <><Spinner />Thinking…</> : 'Ask AI ◉'}
        </button>

        {answer && (
          <div style={{
            marginTop: 14, background: 'var(--bg-card2)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius)',
            padding: '14px 16px',
          }}>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--accent-light)', marginBottom: 8 }}>
              AI RESPONSE
            </div>
            <p style={{ fontSize: 13, fontFamily: 'var(--font-mono)', lineHeight: 1.8, color: 'var(--text)' }}>
              {answer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function EmployeeCard({ emp, onEdit, onDelete, onAsk }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const initials = emp.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-card)', border: `1px solid ${hovered ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)', padding: 20,
        display: 'flex', flexDirection: 'column', gap: 12,
        transition: 'border-color 0.2s, transform 0.15s, box-shadow 0.2s',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? 'var(--shadow-glow)' : 'none',
        animation: 'fadeUp 0.25s ease',
      }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'var(--accent-glow)', border: '1px solid var(--border-glow)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 800, color: 'var(--accent-light)',
          fontFamily: 'var(--font-display)', flexShrink: 0,
        }}>{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-faint)' }}>
            #{emp.id}
          </span>
          <h3 style={{
            fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)',
            color: 'var(--text)', margin: 0,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{emp.name}</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{emp.role || '—'}</p>
        </div>
        <span style={{
          color: 'var(--green)', fontWeight: 700, fontFamily: 'var(--font-mono)',
          fontSize: 13, flexShrink: 0,
        }}>
          ${emp.salary?.toLocaleString()}
        </span>
      </div>

      <div><DeptBadge dept={emp.department} /></div>

      {emp.aiBio && (
        <div style={{
          background: 'var(--bg-card2)', borderRadius: 8, padding: '10px 12px',
          fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7,
          fontFamily: 'var(--font-mono)',
          borderLeft: '2px solid var(--accent)',
        }}>
          {expanded ? emp.aiBio : emp.aiBio.slice(0, 100) + (emp.aiBio.length > 100 ? '…' : '')}
          {emp.aiBio.length > 100 && (
            <button onClick={() => setExpanded(!expanded)} style={{
              background: 'none', border: 'none', color: 'var(--accent-light)',
              cursor: 'pointer', fontSize: 11, marginLeft: 4,
            }}>{expanded ? 'less' : 'more'}</button>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => onAsk(emp)} style={{
          flex: 1, background: 'var(--accent-glow)', border: '1px solid var(--border-glow)',
          color: 'var(--accent-light)', borderRadius: 8, padding: '7px 0',
          fontSize: 12, fontWeight: 600,
        }}>◉ Ask AI</button>
        <button onClick={() => onEdit(emp)} style={{
          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
          color: 'var(--green)', borderRadius: 8, padding: '7px 12px', fontSize: 13,
        }}>✏</button>
        <button onClick={() => onDelete(emp.id)} style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          color: 'var(--red)', borderRadius: 8, padding: '7px 12px', fontSize: 13,
        }}>✕</button>
      </div>
    </div>
  );
}

// ── Main Employees Page ───────────────────────────────────────────────────────

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [toast, setToast] = useState(null);
  const [aiTarget, setAiTarget] = useState(null);
  const formRef = useRef();

  const notify = (msg, type = 'success') => setToast({ msg, type });

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const url = search.trim()
        ? `http://localhost:8085/api/employees/search?name=${encodeURIComponent(search)}`
        : 'http://localhost:8085/api/employees';
      const res = await fetch(url);
      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch {
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  const handleSubmit = async () => {
    if (!form.name.trim()) return notify('Name is required.', 'error');
    if (!form.department) return notify('Select a department.', 'error');
    if (!form.salary || parseFloat(form.salary) <= 0) return notify('Salary must be > 0.', 'error');

    setFormLoading(true);
    try {
      const body = {
        name: form.name.trim(), department: form.department,
        role: form.role.trim() || null, salary: parseFloat(form.salary),
      };

      if (editId) {
        await employeeApi.update(editId, body);
        notify('✓ Employee updated!');
      } else {
        await employeeApi.create(body);
        notify('✦ Employee added with AI bio!');
      }

      setForm(EMPTY);
      setEditId(null);
      fetchEmployees();
    } catch (e) {
      notify(e.message || 'Request failed.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (emp) => {
    setEditId(emp.id);
    setForm({ name: emp.name, department: emp.department, role: emp.role || '', salary: emp.salary });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    await employeeApi.delete(id);
    notify('Employee removed.');
    fetchEmployees();
  };

  const filtered = filterDept === 'All' ? employees : employees.filter(e => e.department === filterDept);

  return (
    <div style={{ padding: 28, overflowY: 'auto', height: '100%' }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {aiTarget && <AiModal employee={aiTarget} onClose={() => setAiTarget(null)} />}

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontSize: 10, fontFamily: 'var(--font-mono)',
          color: 'var(--accent-light)', letterSpacing: 2, marginBottom: 6,
        }}>◎ EMPLOYEES</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 }}>
          Manage Employees
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>
          {employees.length} records · PostgreSQL · AI bios via Ollama
        </p>
      </div>

      {/* Form */}
      <div ref={formRef} style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: 24,
      }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{
            fontSize: 10, color: 'var(--accent-light)', fontFamily: 'var(--font-mono)',
            letterSpacing: 2, marginBottom: 4,
          }}>{editId ? 'EDITING EMPLOYEE' : 'NEW EMPLOYEE'}</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800 }}>
            {editId ? 'Update employee details' : 'Add employee — AI bio auto-generated'}
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          {[
            ['FULL NAME *', 'name', 'text', 'e.g. Sarah Johnson'],
            ['ANNUAL SALARY (USD) *', 'salary', 'number', 'e.g. 85000'],
            ['JOB ROLE', 'role', 'text', 'e.g. Senior Software Engineer'],
          ].map(([label, field, type, placeholder]) => (
            <div key={field}>
              <label style={{
                fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
                display: 'block', marginBottom: 6, letterSpacing: 1,
              }}>{label}</label>
              <input
                type={type} value={form[field]} placeholder={placeholder}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
              />
            </div>
          ))}
          <div>
            <label style={{
              fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
              display: 'block', marginBottom: 6, letterSpacing: 1,
            }}>DEPARTMENT *</label>
            <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
              <option value="">Select department…</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleSubmit} disabled={formLoading} style={{
            background: formLoading ? 'var(--bg-card2)' : 'linear-gradient(135deg, var(--accent), #4f46e5)',
            color: formLoading ? 'var(--text-muted)' : '#fff',
            border: 'none', borderRadius: 'var(--radius)', padding: '11px 24px',
            fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center',
          }}>
            {formLoading ? <><Spinner />Generating AI bio…</> : editId ? 'Update Employee' : 'Save + Generate AI Bio ◉'}
          </button>
          {editId && (
            <button onClick={() => { setEditId(null); setForm(EMPTY); }} style={{
              background: 'transparent', border: '1px solid var(--border)',
              color: 'var(--text-muted)', borderRadius: 'var(--radius)', padding: '11px 18px', fontSize: 14,
            }}>Cancel</button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap',
      }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name…"
          style={{ width: 200 }}
        />
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)} style={{ width: 160 }}>
          <option value="All">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <span style={{
          fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
          alignSelf: 'center',
        }}>
          {filtered.length} of {employees.length} records
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
          Loading employees from database…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', color: 'var(--text-faint)',
          fontFamily: 'var(--font-mono)', fontSize: 14, padding: 60,
        }}>
          {employees.length === 0 ? 'No employees yet. Add one above ↑' : 'No employees match the filter.'}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: 16,
        }}>
          {filtered.map(emp => (
            <EmployeeCard key={emp.id} emp={emp}
              onEdit={handleEdit} onDelete={handleDelete} onAsk={setAiTarget} />
          ))}
        </div>
      )}
    </div>
  );
}
