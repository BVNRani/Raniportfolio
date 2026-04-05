// src/pages/ProjectsPage.jsx
import { useState, useEffect } from 'react';
import { getCollection, addItem, updateItem, deleteItem } from '../firebase/services';
import CrudModal from '../components/CrudModal';
import { Plus, Pencil, Trash2, FlaskConical } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY = { title: '', area: '', status: 'In Progress', description: '', funding: '', collaborators: '', amount: '', funded: false };

const STATUS_COLORS = { 'In Progress': '#B48C3C', 'Submitted': '#2563eb', 'Completed': '#2E7D52', 'Proposal Stage': '#7c3aed' };

export default function ProjectsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setItems(await getCollection('projects'));
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
      if (modal === 'add') { await addItem('projects', form); toast.success('Project added!'); }
      else { await updateItem('projects', editId, form); toast.success('Project updated!'); }
      await load(); closeModal();
    } catch (e) { toast.error(e.message); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    await deleteItem('projects', id); toast.success('Deleted'); load();
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>;

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title"><FlaskConical size={22} style={{ color: '#B48C3C' }} /> Research Projects & Grants ({items.length})</h2>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Project</button>
      </div>
      {items.length === 0 && <div className="empty-state"><div className="empty-state-icon">🔬</div><h3>No projects yet</h3></div>}
      <div className="cards-grid">
        {items.map(proj => (
          <div key={proj.id} className="item-card">
            <div className="item-card-accent" style={{ background: `linear-gradient(180deg, ${STATUS_COLORS[proj.status] || '#0A1F44'}, transparent)` }} />
            <div className="item-card-title">{proj.title}</div>
            <div className="item-card-meta">
              <span className="badge" style={{ background: STATUS_COLORS[proj.status] + '22', color: STATUS_COLORS[proj.status], border: `1px solid ${STATUS_COLORS[proj.status]}55` }}>{proj.status}</span>
              {proj.area && <span className="badge badge-navy">{proj.area}</span>}
            </div>
            {proj.funded && <span style={{ fontSize:11, fontWeight:700, background:'#EDFAF3', color:'#2E7D52', border:'1px solid #2E7D5244', borderRadius:6, padding:'2px 8px', marginBottom:6, display:'inline-block' }}>✅ Funded</span>}
            {proj.funding && <div style={{ fontSize: 13, fontWeight: 700, color: '#2E7D52', marginBottom: 4 }}>💰 {proj.funding}</div>}
            {proj.amount && <div style={{ fontSize: 12, color: '#6A6560', marginBottom: 8 }}>₹{proj.amount} Lakhs</div>}
            {proj.description && <div className="item-card-desc">{proj.description}</div>}
            {proj.collaborators && <div style={{ fontSize: 12.5, color: '#6A6560', marginTop: 8 }}>👥 {proj.collaborators}</div>}
            <div className="item-card-actions">
              <button className="btn btn-outline btn-sm" onClick={() => openEdit(proj)}><Pencil size={13} /> Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(proj.id)}><Trash2 size={13} /> Delete</button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <CrudModal title={modal === 'add' ? 'Add Research Project' : 'Edit Project'} onClose={closeModal} onSave={handleSave} saving={saving}>
          <div className="form-group"><label className="form-label">Project Title *</label><input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Status</label><select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option>In Progress</option><option>Submitted</option><option>Completed</option><option>Proposal Stage</option></select></div>
            <div className="form-group"><label className="form-label">Research Area</label><input className="form-input" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} placeholder="AI, Blockchain, IoT..." /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Funding / Grant</label><input className="form-input" value={form.funding} onChange={e => setForm({ ...form, funding: e.target.value })} placeholder="e.g. DST India (INR 1 Crore)" /></div>
            <div className="form-group"><label className="form-label">Funding Amount (INR Lakhs)</label><input className="form-input" type="number" value={form.amount || ''} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 28" /></div>
          </div>
          <div className="form-group" style={{ display:'flex', alignItems:'center', gap:10 }}>
            <input type="checkbox" id="funded-check" checked={!!form.funded} onChange={e => setForm({ ...form, funded: e.target.checked })} style={{ width:16, height:16, cursor:'pointer' }} />
            <label htmlFor="funded-check" className="form-label" style={{ margin:0, cursor:'pointer' }}>Mark as Funded Project</label>
          </div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Collaborators</label><input className="form-input" value={form.collaborators} onChange={e => setForm({ ...form, collaborators: e.target.value })} placeholder="Collaborating institutions / persons" /></div>
        </CrudModal>
      )}
    </div>
  );
}
