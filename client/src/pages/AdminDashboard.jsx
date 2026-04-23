import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, UserCheck, Clock, CheckCircle2, IndianRupee, LogOut, Plus, Trash2, AlertCircle } from 'lucide-react';
import API from '../api/axios';

const S = {
  page: { fontFamily: "'Inter', sans-serif", minHeight: '100vh', background: '#f0f4ff' },
  nav: { background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  body: { maxWidth: '1100px', margin: '0 auto', padding: '28px 24px' },
  statRow: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  statIcon: (bg) => ({ width: '44px', height: '44px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }),
  tabBar: { display: 'inline-flex', background: '#e5e7eb', borderRadius: '12px', padding: '4px', gap: '2px', marginBottom: '20px' },
  tab: (a) => ({ padding: '8px 18px', borderRadius: '9px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer', background: a ? '#fff' : 'transparent', color: a ? '#111827' : '#6b7280', boxShadow: a ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s', textTransform: 'capitalize', fontFamily: 'inherit' }),
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  toast: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px 18px', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  input: { width: '100%', padding: '10px 14px', background: '#f9fafb', border: '1.5px solid #d1d5db', borderRadius: '10px', fontSize: '13px', color: '#111827', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
  label: { display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' },
};

const statusBadge = {
  pending:   { background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' },
  confirmed: { background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' },
  completed: { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
  cancelled: { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' },
};

const Avatar = ({ name, bg = 'linear-gradient(135deg,#f59e0b,#ef4444)' }) => {
  const i = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  return <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>{i}</div>;
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [tab, setTab] = useState('doctors');
  const [toast, setToast] = useState('');
  const [reports, setReports] = useState({ perDoctor: [], byStatus: [], revenue: [] });
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', gender: 'male', specialization: '', experience: '', fees: '' });

  useEffect(() => { fetchDoctors(); fetchAppointments(); fetchReports(); }, []);

  const msg = (t) => { setToast(t); setTimeout(() => setToast(''), 3500); };
  const fetchDoctors = async () => { const { data } = await API.get('/doctors'); setDoctors(data); };
  const fetchAppointments = async () => { const { data } = await API.get('/appointments'); setAppointments(data); };
  const fetchReports = async () => {
    try {
      const [r1, r2, r3] = await Promise.all([API.get('/reports/appointments-per-doctor'), API.get('/reports/appointments-by-status'), API.get('/reports/revenue-per-doctor')]);
      setReports({ perDoctor: r1.data, byStatus: r2.data, revenue: r3.data });
    } catch {}
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addDoctor = async (e) => {
    e.preventDefault();
    try { await API.post('/doctors', form); msg('Doctor added!'); setForm({ name: '', email: '', password: '', phone: '', gender: 'male', specialization: '', experience: '', fees: '' }); fetchDoctors(); }
    catch (err) { msg(err.response?.data?.message || 'Failed'); }
  };

  const deleteDoctor = async (id) => { await API.delete(`/doctors/${id}`); msg('Doctor removed.'); fetchDoctors(); };
  const totalRevenue = reports.revenue.reduce((s, r) => s + r.totalRevenue, 0);

  const stats = [
    { icon: <UserCheck size={20} color="#2563eb" />, label: 'Total Doctors', value: doctors.length, bg: '#eff6ff' },
    { icon: <span style={{ fontSize: '20px' }}>🗓</span>, label: 'Total Appointments', value: appointments.length, bg: '#f5f3ff' },
    { icon: <IndianRupee size={20} color="#16a34a" />, label: 'Total Revenue', value: `₹${totalRevenue}`, bg: '#f0fdf4' },
  ];

  const fields = [
    { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Dr. John Doe' },
    { label: 'Email', name: 'email', type: 'email', placeholder: 'doctor@example.com' },
    { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••' },
    { label: 'Phone', name: 'phone', type: 'text', placeholder: '9876543210' },
    { label: 'Specialization', name: 'specialization', type: 'text', placeholder: 'Cardiologist' },
    { label: 'Experience (yrs)', name: 'experience', type: 'number', placeholder: '5' },
    { label: 'Fees (₹)', name: 'fees', type: 'number', placeholder: '500' },
  ];

  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Stethoscope size={18} color="#fff" />
          </div>
          <span style={{ fontSize: '17px', fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }}>HealthDesk</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '999px', padding: '3px 10px' }}>Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar name={user?.name} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{user?.name}</span>
          <button onClick={() => { logout(); navigate('/login'); }}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#9ca3af', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px' }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </nav>

      <div style={S.body}>
        {toast && <div style={S.toast}>{toast}</div>}

        <div style={S.statRow}>
          {stats.map(s => (
            <div key={s.label} style={S.statCard}>
              <div style={S.statIcon(s.bg)}>{s.icon}</div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#111827' }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600, marginTop: '2px' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={S.tabBar}>
          {['doctors', 'add doctor', 'appointments', 'reports'].map(t => (
            <button key={t} style={S.tab(tab === t)} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {/* Doctors */}
        {tab === 'doctors' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '16px' }}>
            {doctors.map(doc => (
              <div key={doc._id} style={{ ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 700, flexShrink: 0 }}>
                    {doc.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#111827' }}>{doc.name}</div>
                    <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '999px', padding: '2px 10px', marginTop: '4px' }}>{doc.specialization}</span>
                    <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>{doc.email}</div>
                    <div style={{ color: '#9ca3af', fontSize: '12px' }}>Exp: {doc.experience} yrs · ₹{doc.fees}</div>
                  </div>
                </div>
                <button onClick={() => deleteDoctor(doc._id)} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0, flexShrink: 0 }}>
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Doctor */}
        {tab === 'add doctor' && (
          <div style={S.card}>
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} /> Add New Doctor
            </div>
            <form onSubmit={addDoctor} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {fields.map(({ label, name, type, placeholder }) => (
                <div key={name}>
                  <label style={S.label}>{label}</label>
                  <input type={type} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} required style={S.input} />
                </div>
              ))}
              <div>
                <label style={S.label}>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} style={S.input}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <button type="submit" style={{ width: '100%', padding: '12px', background: '#111827', color: '#fff', fontWeight: 700, fontSize: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(17,24,39,0.2)' }}>
                  Add Doctor →
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Appointments */}
        {tab === 'appointments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {appointments.length === 0 ? (
              <div style={{ ...S.card, padding: '64px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🗓</div>
                <div style={{ color: '#9ca3af', fontWeight: 600, fontSize: '14px' }}>No appointments yet.</div>
              </div>
            ) : appointments.map(apt => (
              <div key={apt._id} style={{ ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#111827' }}>
                    {apt.patientId?.name} <span style={{ color: '#d1d5db', fontWeight: 400 }}>→</span> {apt.doctorId?.name}
                  </div>
                  <div style={{ color: '#2563eb', fontSize: '12px', fontWeight: 600, marginTop: '2px' }}>{apt.doctorId?.specialization}</div>
                  <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '2px' }}>{apt.slotId?.date ? new Date(apt.slotId.date).toDateString() : '—'} · {apt.slotId?.time}</div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '999px', textTransform: 'capitalize', ...statusBadge[apt.status] }}>{apt.status}</span>
              </div>
            ))}
          </div>
        )}

        {/* Reports */}
        {tab === 'reports' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={S.card}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#111827', marginBottom: '14px' }}>Appointments by Status</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: '10px' }}>
                {reports.byStatus.map(item => (
                  <div key={item.status} style={{ textAlign: 'center', padding: '16px 8px', borderRadius: '12px', border: '1px solid', ...statusBadge[item.status] }}>
                    <div style={{ fontSize: '24px', fontWeight: 800 }}>{item.count}</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'capitalize', marginTop: '4px' }}>{item.status}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={S.card}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#111827', marginBottom: '14px' }}>Appointments per Doctor</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                    {['Doctor', 'Specialization', 'Total'].map(h => (
                      <th key={h} style={{ textAlign: h === 'Total' ? 'right' : 'left', padding: '8px 0', fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reports.perDoctor.map(item => (
                    <tr key={item._id} style={{ borderBottom: '1px solid #f9fafb' }}>
                      <td style={{ padding: '12px 0', fontWeight: 700, color: '#111827' }}>{item.doctorName}</td>
                      <td style={{ color: '#9ca3af', fontSize: '12px' }}>{item.specialization}</td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: '#2563eb' }}>{item.totalAppointments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={S.card}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#111827', marginBottom: '4px' }}>Revenue per Doctor</div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '14px' }}>Confirmed + completed only</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                    {['Doctor', 'Specialization', 'Appts', 'Revenue'].map(h => (
                      <th key={h} style={{ textAlign: ['Appts', 'Revenue'].includes(h) ? 'right' : 'left', padding: '8px 0', fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reports.revenue.map(item => (
                    <tr key={item._id} style={{ borderBottom: '1px solid #f9fafb' }}>
                      <td style={{ padding: '12px 0', fontWeight: 700, color: '#111827' }}>{item.doctorName}</td>
                      <td style={{ color: '#9ca3af', fontSize: '12px' }}>{item.specialization}</td>
                      <td style={{ textAlign: 'right', color: '#6b7280' }}>{item.appointmentCount}</td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px', padding: '12px 0' }}>
                        <IndianRupee size={12} />{item.totalRevenue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
