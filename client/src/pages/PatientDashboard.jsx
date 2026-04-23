import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, UserCheck, Clock, CheckCircle2, AlertCircle, LogOut, ArrowLeft, IndianRupee } from 'lucide-react';
import API from '../api/axios';

const S = {
  page: { fontFamily: "'Inter', sans-serif", minHeight: '100vh', background: '#f0f4ff' },
  nav: { background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  body: { maxWidth: '1100px', margin: '0 auto', padding: '28px 24px' },
  statRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  statIcon: (bg) => ({ width: '44px', height: '44px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }),
  tabBar: { display: 'inline-flex', background: '#e5e7eb', borderRadius: '12px', padding: '4px', gap: '2px', marginBottom: '20px' },
  tab: (a) => ({ padding: '8px 20px', borderRadius: '9px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer', background: a ? '#fff' : 'transparent', color: a ? '#111827' : '#6b7280', boxShadow: a ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s', textTransform: 'capitalize', fontFamily: 'inherit' }),
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  emptyState: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '64px 24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  toast: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px 18px', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
};

const statusBadge = {
  pending:   { background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' },
  confirmed: { background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' },
  completed: { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
  cancelled: { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' },
};

const Avatar = ({ name, bg = 'linear-gradient(135deg,#3b82f6,#6366f1)' }) => {
  const i = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  return <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>{i}</div>;
};

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selDoctor, setSelDoctor] = useState(null);
  const [selDoctorName, setSelDoctorName] = useState('');
  const [tab, setTab] = useState('doctors');
  const [toast, setToast] = useState('');

  useEffect(() => { fetchDoctors(); fetchAppts(); }, []);

  const msg = (t) => { setToast(t); setTimeout(() => setToast(''), 3500); };
  const fetchDoctors = async () => { const { data } = await API.get('/doctors'); setDoctors(data); };
  const fetchAppts = async () => { const { data } = await API.get('/appointments'); setAppointments(data); };

  const fetchSlots = async (id, name) => {
    const { data } = await API.get(`/slots?doctorId=${id}`);
    setSlots(data); setSelDoctor(id); setSelDoctorName(name); setTab('slots');
  };

  const book = async (slotId) => {
    try { await API.post('/appointments/book', { doctorId: selDoctor, slotId }); msg('Appointment booked!'); fetchAppts(); fetchSlots(selDoctor, selDoctorName); }
    catch (e) { msg(e.response?.data?.message || 'Booking failed'); }
  };

  const cancel = async (id) => {
    try { await API.delete(`/appointments/${id}`); msg('Appointment cancelled.'); fetchAppts(); }
    catch { msg('Cancellation failed.'); }
  };

  const pending = appointments.filter(a => a.status === 'pending').length;
  const confirmed = appointments.filter(a => a.status === 'confirmed').length;

  const stats = [
    { icon: <UserCheck size={20} color="#2563eb" />, label: 'Available Doctors', value: doctors.length, bg: '#eff6ff' },
    { icon: <Clock size={20} color="#d97706" />, label: 'Pending', value: pending, bg: '#fffbeb' },
    { icon: <CheckCircle2 size={20} color="#16a34a" />, label: 'Confirmed', value: confirmed, bg: '#f0fdf4' },
  ];

  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Stethoscope size={18} color="#fff" />
          </div>
          <span style={{ fontSize: '17px', fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }}>HealthDesk</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '999px', padding: '3px 10px' }}>Patient</span>
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
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#111827' }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600, marginTop: '2px' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={S.tabBar}>
          {['doctors', 'slots', 'appointments'].map(t => (
            <button key={t} style={S.tab(tab === t)} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {/* Doctors */}
        {tab === 'doctors' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {doctors.map(doc => (
              <div key={doc._id} style={S.card}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                  <Avatar name={doc.name} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#111827' }}>{doc.name}</div>
                    <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '999px', padding: '2px 10px', marginTop: '4px' }}>{doc.specialization}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9ca3af', marginBottom: '14px' }}>
                  <span>{doc.experience} yrs experience</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#16a34a', fontWeight: 700 }}>
                    <IndianRupee size={12} />{doc.fees}
                  </span>
                </div>
                <button onClick={() => fetchSlots(doc._id, doc.name)}
                  style={{ width: '100%', padding: '10px', background: '#111827', color: '#fff', fontWeight: 700, fontSize: '13px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                  View Slots →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Slots */}
        {tab === 'slots' && (
          <div>
            <button onClick={() => setTab('doctors')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#2563eb', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px', padding: 0 }}>
              <ArrowLeft size={14} /> Back to Doctors
            </button>
            {selDoctorName && <div style={{ fontWeight: 700, fontSize: '16px', color: '#111827', marginBottom: '16px' }}>Slots — <span style={{ color: '#2563eb' }}>{selDoctorName}</span></div>}
            {slots.length === 0 ? (
              <div style={S.emptyState}><div style={{ fontSize: '32px', marginBottom: '8px' }}>🗓</div><div style={{ color: '#9ca3af', fontWeight: 600, fontSize: '14px' }}>No available slots.</div></div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                {slots.map(slot => (
                  <div key={slot._id} style={S.card}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#111827' }}>{new Date(slot.date).toDateString()}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2563eb', fontSize: '12px', fontWeight: 600, marginTop: '4px' }}>
                      <Clock size={12} /> {slot.time}
                    </div>
                    <button onClick={() => book(slot._id)}
                      style={{ width: '100%', marginTop: '12px', padding: '8px', background: '#16a34a', color: '#fff', fontWeight: 700, fontSize: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Appointments */}
        {tab === 'appointments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {appointments.length === 0 ? (
              <div style={S.emptyState}><div style={{ fontSize: '32px', marginBottom: '8px' }}>🗓</div><div style={{ color: '#9ca3af', fontWeight: 600, fontSize: '14px' }}>No appointments yet. Book from the Doctors tab!</div></div>
            ) : appointments.map(apt => (
              <div key={apt._id} style={{ ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Avatar name={apt.doctorId?.name} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#111827' }}>{apt.doctorId?.name}</div>
                    <div style={{ color: '#2563eb', fontSize: '12px', fontWeight: 600 }}>{apt.doctorId?.specialization}</div>
                    <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '2px' }}>
                      {apt.slotId?.date ? new Date(apt.slotId.date).toDateString() : '—'} · {apt.slotId?.time}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '999px', textTransform: 'capitalize', ...statusBadge[apt.status] }}>{apt.status}</span>
                  {apt.status === 'pending' && (
                    <button onClick={() => cancel(apt._id)} style={{ fontSize: '12px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}>Cancel</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
