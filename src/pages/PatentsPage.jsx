// src/pages/PatentsPage.jsx
import { useState, useEffect } from 'react';
import { getCollection, addItem, updateItem, deleteItem } from '../firebase/services';
import CrudModal from '../components/CrudModal';
import { Plus, Pencil, Trash2, Shield, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY = { number: '', title: '', description: '', year: 2022, status: 'Granted', url: '' };

export default function PatentsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setItems(await getCollection('patents'));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (item) => { setForm(item); setEditId(item.id); setModal('edit'); };
  const closeModal = () => { setModal(null); setForm(EMPTY); setEditId(null); };

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error('Title is required');
    setSaving(true);
    try {
      if (modal === 'add') { await addItem('patents', form); toast.success('Patent added!'); }
      else { await updateItem('patents', editId, form); toast.success('Patent updated!'); }
      await load(); closeModal();
    } catch (e) { toast.error(e.message); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this patent?')) return;
    await deleteItem('patents', id); toast.success('Deleted'); load();
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>;

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title"><Shield size={22} style={{ color: '#2563eb' }} /> Patents ({items.length})</h2>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Patent</button>
      </div>
      {items.length === 0 && <div className="empty-state"><div className="empty-state-icon">🛡️</div><h3>No patents yet</h3></div>}
      <div className="cards-grid">
        {items.map(patent => (
          <div key={patent.id} className="item-card">
            <div className="item-card-accent" style={{ background: 'linear-gradient(180deg, #2563eb, #60a5fa)' }} />
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🛡️</div>
              <div style={{ flex: 1 }}>
                <div className="item-card-title">{patent.title}</div>
                <div className="item-card-meta">
                  <span className="badge badge-blue">Patent No: {patent.number}</span>
                  <span className="badge badge-navy">{patent.year}</span>
                  <span className="badge badge-green">{patent.status}</span>
                </div>
                {patent.description && <div className="item-card-desc">{patent.description}</div>}
                {patent.url && <a href={patent.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ marginTop: 10 }}><ExternalLink size={12} /> View Patent</a>}
              </div>
            </div>
            <div className="item-card-actions">
              <button className="btn btn-outline btn-sm" onClick={() => openEdit(patent)}><Pencil size={13} /> Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(patent.id)}><Trash2 size={13} /> Delete</button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <CrudModal title={modal === 'add' ? 'Add Patent' : 'Edit Patent'} onClose={closeModal} onSave={handleSave} saving={saving}>
          <div className="form-group"><label className="form-label">Patent Title *</label><textarea className="form-textarea" style={{ minHeight: 70 }} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Patent Number</label><input className="form-input" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} placeholder="202221000262" /></div>
            <div className="form-group"><label className="form-label">Year</label><input className="form-input" type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Status</label><select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option>Granted</option><option>Published</option><option>Filed</option><option>Pending</option></select></div>
            <div className="form-group"><label className="form-label">Patent URL</label><input className="form-input" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></div>
          </div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
        </CrudModal>
      )}
    </div>
  );
}
