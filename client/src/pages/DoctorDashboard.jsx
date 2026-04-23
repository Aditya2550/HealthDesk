import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Clock, CheckCircle2, Pencil, Trash2, LogOut, Plus } from 'lucide-react';
import API from '../api/axios';

const S = {
  page: { fontFamily: "'Inter', sans-serif", minHeight: '100vh', background: '#f0f4ff' },
  nav: { background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  body: { maxWidth: '1100px', margin: '0 auto', padding: '28px 24px' },
  statRow: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  statIcon: (bg) => ({ width: '44px', height: '44px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }),
  tabBar: { display: 'inline-flex', background: '#e5e7eb', borderRadius: '12px', padding: '4px', gap: '2px', marginBottom: '20px' },
  tab: (a) => ({ padding: '8px 20px', borderRadius: '9px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer', background: a ? '#fff' : 'transparent', color: a ? '#111827' : '#6b7280', boxShadow: a ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s', textTransform: 'capitalize', fontFamily: 'inherit' }),
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  toast: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px 18px', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  input: { width: '100%', padding: '10px 14px', background: '#f9fafb', border: '1.5px solid #d1d5db', borderRadius: '10px', fontSize: '13px', color: '#111827', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
};

const statusBadge = {
  pending:   { background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' },
  confirmed: { background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' },
  completed: { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
  cancelled: { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' },
};

const Avatar = ({ name, bg = 'linear-gradient(135deg,#8b5cf6,#6366f1)' }) => {
  const i = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  return <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>{i}</div>;
};

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [tab, setTab] = useState('appointments');
  const [slotForm, setSlotForm] = useState({ date: '', time: '' });
  const [editingSlot, setEditingSlot] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => { fetchAppointments(); fetchSlots(); }, []);

  const msg = (t) => { setToast(t); setTimeout(() => setToast(''), 3500); };
  const fetchAppointments = async () => { const { data } = await API.get('/appointments'); setAppointments(data); };
  const fetchSlots = async () => { const { data } = await API.get(`/slots?doctorId=${user._id}`); setSlots(data); };

  const updateStatus = async (id, status) => {
    await API.put(`/appointments/${id}/status`, { status }); msg(`Status updated to "${status}"`); fetchAppointments();
  };

  const addSlot = async (e) => {
    e.preventDefault();
    try { await API.post('/slots', slotForm); msg('Slot added!'); setSlotForm({ date: '', time: '' }); fetchSlots(); }
    catch (err) { msg(err.response?.data?.message || 'Failed'); }
  };

  const deleteSlot = async (id) => { await API.delete(`/slots/${id}`); msg('Slot deleted.'); fetchSlots(); };
  const startEdit = (slot) => setEditingSlot({ id: slot._id, date: slot.date?.slice(0, 10) || '', time: slot.time });
  const cancelEdit = () => setEditingSlot(null);
  const saveSlot = async (e) => {
    e.preventDefault();
    try { await API.put(`/slots/${editingSlot.id}`, { date: editingSlot.date, time: editingSlot.time }); msg('Slot updated!'); setEditingSlot(null); fetchSlots(); }
    catch (err) { msg(err.response?.data?.message || 'Update failed'); }
  };

  const pending = appointments.filter(a => a.status === 'pending').length;
  const completed = appointments.filter(a => a.status === 'completed').length;

  const stats = [
    { icon: <span style={{ fontSize: '20px' }}>🗓</span>, label: 'Total Appointments', value: appointments.length, bg: '#eff6ff' },
    { icon: <Clock size={20} color="#d97706" />, label: 'Pending', value: pending, bg: '#fffbeb' },
    { icon: <CheckCircle2 size={20} color="#16a34a" />, label: 'Completed', value: completed, bg: '#f0fdf4' },
  ];

  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Stethoscope size={18} color="#fff" />
          </div>
          <span style={{ fontSize: '17px', fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }}>HealthDesk</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#7c3aed', background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '999px', padding: '3px 10px' }}>Doctor</span>
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
          {['appointments', 'manage slots'].map(t => (
            <button key={t} style={S.tab(tab === t)} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {/* Appointments */}
        {tab === 'appointments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {appointments.length === 0 ? (
              <div style={{ ...S.card, padding: '64px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🗓</div>
                <div style={{ color: '#9ca3af', fontWeight: 600, fontSize: '14px' }}>No appointments yet.</div>
              </div>
            ) : appointments.map(apt => (
              <div key={apt._id} style={{ ...S.card, padding: '18px 20px' }}>
                {/* Top row: patient info + status + action buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <Avatar name={apt.patientId?.name} bg="linear-gradient(135deg,#3b82f6,#06b6d4)" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#111827' }}>{apt.patientId?.name}</div>
                      <div style={{ color: '#6b7280', fontSize: '12px' }}>{apt.patientId?.email} · {apt.patientId?.phone}</div>
                      <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '2px' }}>
                        {apt.slotId?.date ? new Date(apt.slotId.date).toDateString() : '—'} · {apt.slotId?.time}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '999px', textTransform: 'capitalize', ...statusBadge[apt.status] }}>{apt.status}</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {['confirmed', 'completed', 'cancelled'].map(s => (
                        <button key={s} onClick={() => updateStatus(apt._id, s)}
                          style={{ fontSize: '11px', background: '#f3f4f6', color: '#374151', fontWeight: 600, border: '1px solid #e5e7eb', borderRadius: '8px', padding: '4px 10px', cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'inherit' }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Patient-submitted pre-booking info */}
                {apt.reason && (
                  <div style={{ marginTop: '14px', borderTop: '1px solid #f3f4f6', paddingTop: '12px', background: '#f9fafb', borderRadius: '10px', padding: '12px 14px', marginTop: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Patient Information</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <div style={{ fontSize: '13px' }}><span style={{ fontWeight: 700, color: '#374151' }}>Reason: </span><span style={{ color: '#374151' }}>{apt.reason}</span></div>
                      {apt.symptoms && <div style={{ fontSize: '13px' }}><span style={{ fontWeight: 700, color: '#374151' }}>Symptoms: </span><span style={{ color: '#6b7280' }}>{apt.symptoms}</span></div>}
                      {apt.notes && <div style={{ fontSize: '13px' }}><span style={{ fontWeight: 700, color: '#374151' }}>Notes: </span><span style={{ color: '#6b7280' }}>{apt.notes}</span></div>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Manage Slots */}
        {tab === 'manage slots' && (
          <div>
            <div style={{ ...S.card, marginBottom: '16px' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#111827', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} /> Add New Slot
              </div>
              <form onSubmit={addSlot} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Date</label>
                  <input type="date" value={slotForm.date} onChange={e => setSlotForm({ ...slotForm, date: e.target.value })} required style={S.input} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Time</label>
                  <input type="text" placeholder="e.g. 10:00 AM" value={slotForm.time} onChange={e => setSlotForm({ ...slotForm, time: e.target.value })} required style={S.input} />
                </div>
                <button type="submit" style={{ padding: '10px 24px', background: '#111827', color: '#fff', fontWeight: 700, fontSize: '13px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Add Slot</button>
              </form>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: '12px' }}>
              {slots.length === 0 ? (
                <div style={{ gridColumn: '1/-1', ...S.card, textAlign: 'center', padding: '40px' }}>
                  <div style={{ color: '#9ca3af', fontSize: '14px', fontWeight: 600 }}>No slots added yet.</div>
                </div>
              ) : slots.map(slot => (
                <div key={slot._id} style={{ ...S.card, ...(editingSlot?.id === slot._id ? { gridColumn: '1/-1' } : {}) }}>
                  {editingSlot?.id === slot._id ? (
                    <form onSubmit={saveSlot}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#111827', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Pencil size={14} /> Edit Slot
                      </div>
                      <div style={{ display: 'flex', gap: '14px', marginBottom: '14px', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1', minWidth: '160px' }}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Date</label>
                          <input type="date" value={editingSlot.date} onChange={e => setEditingSlot({ ...editingSlot, date: e.target.value })} required style={S.input} />
                        </div>
                        <div style={{ flex: '1', minWidth: '160px' }}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Time</label>
                          <input type="text" placeholder="e.g. 10:00 AM" value={editingSlot.time} onChange={e => setEditingSlot({ ...editingSlot, time: e.target.value })} required style={S.input} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="submit" style={{ padding: '9px 20px', background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: '13px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Save Changes</button>
                        <button type="button" onClick={cancelEdit} style={{ padding: '9px 20px', background: '#f3f4f6', color: '#374151', fontWeight: 700, fontSize: '13px', borderRadius: '10px', border: '1px solid #e5e7eb', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: '#111827' }}>{new Date(slot.date).toDateString()}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2563eb', fontSize: '12px', fontWeight: 600, marginTop: '3px' }}>
                          <Clock size={12} /> {slot.time}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button onClick={() => startEdit(slot)} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}>
                          <Pencil size={12} /> Edit
                        </button>
                        <button onClick={() => deleteSlot(slot._id)} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
