// src/pages/SessionChairPage.jsx
import { useState, useEffect } from 'react';
import { getCollection, addItem, updateItem, deleteItem } from '../firebase/services';
import CrudModal from '../components/CrudModal';
import { Plus, Pencil, Trash2, Mic2 } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY = { conference: '', year: new Date().getFullYear(), location: '', topic: '', description: '' };

export default function SessionChairPage() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [editId,  setEditId]  = useState(null);
  const [saving,  setSaving]  = useState(false);

  const load = async () => {
    setLoading(true);
    setItems(await getCollection('sessionChairs'));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (item) => { setForm(item); setEditId(item.id); setModal('edit'); };
  const closeModal = () => { setModal(null); setForm(EMPTY); setEditId(null); };

  const handleSave = async () => {
    if (!form.conference.trim()) return toast.error('Conference name is required');
    setSaving(true);
    try {
      if (modal === 'add') { await addItem('sessionChairs', form); toast.success('Session Chair entry added!'); }
      else { await updateItem('sessionChairs', editId, form); toast.success('Updated!'); }
      await load(); closeModal();
    } catch (e) { toast.error(e.message); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return;
    await deleteItem('sessionChairs', id); toast.success('Deleted'); load();
  };

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:60 }}><div className="spinner" /></div>;

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title"><Mic2 size={22} style={{ color:'#B48C3C' }} /> Conference Session Chair ({items.length})</h2>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Entry</button>
      </div>

      {items.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🎤</div>
          <h3>No session chair entries yet</h3>
          <p>Add conferences where you served as Session Chair.</p>
        </div>
      )}

      <div className="cards-grid">
        {items.map(item => (
          <div key={item.id} className="item-card">
            <div className="item-card-accent" />
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
              <div style={{ width:44, height:44, borderRadius:11, background:'linear-gradient(135deg,#0A1F44,#1E3A7A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                🎤
              </div>
              <div style={{ flex:1 }}>
                <div className="item-card-title" style={{ marginBottom:4 }}>{item.conference}</div>
                <div className="item-card-meta">
                  {item.year     && <span className="badge badge-navy">{item.year}</span>}
                  {item.location && <span className="badge badge-gold">{item.location}</span>}
                </div>
              </div>
            </div>
            {item.topic && (
              <div style={{ fontSize:13, fontWeight:700, color:'#B48C3C', marginBottom:6 }}>📌 {item.topic}</div>
            )}
            {item.description && <div className="item-card-desc">{item.description}</div>}
            <div className="item-card-actions">
              <button className="btn btn-outline btn-sm" onClick={() => openEdit(item)}><Pencil size={13} /> Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}><Trash2 size={13} /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <CrudModal
          title={modal === 'add' ? 'Add Session Chair Entry' : 'Edit Entry'}
          onClose={closeModal} onSave={handleSave} saving={saving}
        >
          <div className="form-group">
            <label className="form-label">Conference Name *</label>
            <input className="form-input" value={form.conference} onChange={e => setForm({ ...form, conference: e.target.value })}
              placeholder="e.g. EAI IC4S 2023 – Cognitive Computing" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Year</label>
              <input className="form-input" type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Online / Chennai, India" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Session Topic</label>
            <input className="form-input" value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })}
              placeholder="e.g. AI and Cybersecurity in Cyber-Physical Systems" />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Details about your role and the session..." />
          </div>
        </CrudModal>
      )}
    </div>
  );
}
