// src/pages/AwardsPage.jsx
import { useState, useEffect } from 'react';
import { getCollection, addItem, updateItem, deleteItem, uploadPhoto } from '../firebase/services';
import CrudModal from '../components/CrudModal';
import { Plus, Pencil, Trash2, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY = { title: '', body: '', year: new Date().getFullYear(), description: '', category: 'Research Excellence', photoUrl: '' };

const CATEGORIES = ['Research Excellence', 'Research', 'Teaching', 'Service', 'Professional', 'Academic', 'Sports'];

const ICONS = { 'Research Excellence': '🏆', 'Research': '🔬', 'Teaching': '🎓', 'Service': '🤝', 'Professional': '💼', 'Academic': '📚', 'Sports': '🏅' };

export default function AwardsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await getCollection('awards');
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setPhotoFile(null); setModal('add'); };
  const openEdit = (item) => { setForm(item); setEditId(item.id); setPhotoFile(null); setModal('edit'); };
  const closeModal = () => { setModal(null); setForm(EMPTY); setEditId(null); };

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error('Title is required');
    setSaving(true);
    try {
      let photoUrl = form.photoUrl || '';
      if (photoFile) photoUrl = await uploadPhoto(photoFile, 'awards');

      if (modal === 'add') {
        await addItem('awards', { ...form, photoUrl });
        toast.success('Award added!');
      } else {
        await updateItem('awards', editId, { ...form, photoUrl });
        toast.success('Award updated!');
      }
      await load();
      closeModal();
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this award?')) return;
    try {
      await deleteItem('awards', id);
      toast.success('Deleted');
      load();
    } catch (e) { toast.error(e.message); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>;

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title"><Trophy size={22} style={{ color: '#B48C3C' }} /> Awards & Achievements ({items.length})</h2>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Award</button>
      </div>

      {items.length === 0 && (
        <div className="empty-state"><div className="empty-state-icon">🏆</div><h3>No awards yet</h3></div>
      )}

      <div className="cards-grid">
        {items.map(award => (
          <div key={award.id} className="item-card">
            <div className="item-card-accent" />
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: 'linear-gradient(135deg, #0A1F44, #1E3A7A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, flexShrink: 0,
                boxShadow: '0 4px 12px rgba(10,31,68,0.2)'
              }}>
                {award.photoUrl
                  ? <img src={award.photoUrl} alt={award.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
                  : ICONS[award.category] || '🏆'
                }
              </div>
              <div style={{ flex: 1 }}>
                <div className="item-card-title">{award.title}</div>
                <div style={{ fontSize: 12.5, color: '#B48C3C', fontWeight: 700, marginBottom: 4 }}>{award.body}</div>
                <div className="item-card-meta">
                  <span className="badge badge-navy">{award.year}</span>
                  <span className="badge badge-gold">{award.category}</span>
                </div>
                {award.description && <div className="item-card-desc">{award.description}</div>}
              </div>
            </div>
            <div className="item-card-actions">
              <button className="btn btn-outline btn-sm" onClick={() => openEdit(award)}><Pencil size={13} /> Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(award.id)}><Trash2 size={13} /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <CrudModal title={modal === 'add' ? 'Add Award' : 'Edit Award'} onClose={closeModal} onSave={handleSave} saving={saving}>
          <div className="form-group">
            <label className="form-label">Award Title *</label>
            <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Young Researcher of the Year 2025" />
          </div>
          <div className="form-group">
            <label className="form-label">Awarding Body</label>
            <input className="form-input" value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} placeholder="e.g. London School of Digital Business (UK)" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Year</label>
              <input className="form-input" type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description of the award..." />
          </div>
          <div className="form-group">
            <label className="form-label">Award Photo / Certificate</label>
            <div className="upload-zone" onClick={() => document.getElementById('award-photo').click()}>
              {photoFile
                ? <span style={{ color: '#0A1F44', fontWeight: 600 }}>📷 {photoFile.name}</span>
                : form.photoUrl
                  ? <img src={form.photoUrl} alt="Award" style={{ height: 60, objectFit: 'contain' }} />
                  : <span style={{ color: '#A09890' }}>Click to upload award photo or certificate</span>
              }
            </div>
            <input id="award-photo" type="file" accept="image/*" hidden onChange={e => setPhotoFile(e.target.files[0])} />
          </div>
        </CrudModal>
      )}
    </div>
  );
}
