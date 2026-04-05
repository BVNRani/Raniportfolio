// src/pages/CollaborationsPage.jsx
import { useState, useEffect } from 'react';
import { getCollection, addItem, updateItem, deleteItem } from '../firebase/services';
import CrudModal from '../components/CrudModal';
import { Plus, Pencil, Trash2, Users, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const TABS = [
  { key: 'industry',     label: 'Industry Partners',      icon: '🏢', color: '#0A1F44' },
  { key: 'coordinator',  label: 'Research Coordination',  icon: '🎯', color: '#7c3aed' },
  { key: 'research',     label: 'Research Institutions',  icon: '🎓', color: '#2E7D52' },
];

const EMPTY = { name: '', type: 'industry', role: '', description: '', url: '' };

export default function CollaborationsPage() {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('industry');
  const [modal, setModal]   = useState(null);
  const [form, setForm]     = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setItems(await getCollection('collaborations'));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = items.filter(i => i.type === activeType);
  const activeTab = TABS.find(t => t.key === activeType);

  const openAdd  = () => { setForm({ ...EMPTY, type: activeType }); setModal('add'); };
  const openEdit = (item) => { setForm(item); setEditId(item.id); setModal('edit'); };
  const closeModal = () => { setModal(null); setForm(EMPTY); setEditId(null); };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Name is required');
    setSaving(true);
    try {
      if (modal === 'add') { await addItem('collaborations', form); toast.success('Added!'); }
      else { await updateItem('collaborations', editId, form); toast.success('Updated!'); }
      await load(); closeModal();
    } catch (e) { toast.error(e.message); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return;
    await deleteItem('collaborations', id); toast.success('Deleted'); load();
  };

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:60 }}><div className="spinner" /></div>;

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title"><Users size={22} style={{ color:'#B48C3C' }} /> Collaborations ({items.length})</h2>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add {activeTab?.label.replace(/s$/, '')}</button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
        {TABS.map(tab => {
          const count = items.filter(i => i.type === tab.key).length;
          return (
            <button key={tab.key} onClick={() => setActiveType(tab.key)}
              style={{
                display:'flex', alignItems:'center', gap:7,
                padding:'9px 18px', borderRadius:10, fontSize:13, fontWeight:700, cursor:'pointer',
                border: `1.5px solid ${activeType === tab.key ? tab.color : '#E2E0DC'}`,
                background: activeType === tab.key ? tab.color : 'white',
                color: activeType === tab.key ? 'white' : '#6A6560',
                transition:'all 0.15s',
              }}>
              {tab.icon} {tab.label}
              <span style={{ background: activeType === tab.key ? 'rgba(255,255,255,0.25)' : '#F4F3F0', borderRadius:20, padding:'1px 8px', fontSize:11 }}>{count}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">{activeTab?.icon}</div>
          <h3>No {activeTab?.label} yet</h3>
          <p>Click "Add" to get started.</p>
        </div>
      )}

      <div className="cards-grid">
        {filtered.map(item => (
          <div key={item.id} className="item-card">
            <div className="item-card-accent" style={{ background:`linear-gradient(180deg, ${activeTab?.color || '#B48C3C'}, transparent)` }} />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
              <div style={{ flex:1 }}>
                <div className="item-card-title">{item.name}</div>
                {item.role && (
                  <span className="badge" style={{ background: (activeTab?.color || '#0A1F44') + '18', color: activeTab?.color || '#0A1F44', border:`1px solid ${(activeTab?.color || '#0A1F44')}44`, marginBottom:8, display:'inline-block' }}>
                    {item.role}
                  </span>
                )}
              </div>
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer"
                  style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'#2563eb', fontWeight:700, textDecoration:'none', flexShrink:0, padding:'4px 8px', background:'#EBF0FB', borderRadius:6 }}>
                  <ExternalLink size={11} /> Visit
                </a>
              )}
            </div>
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
          title={modal === 'add' ? `Add ${activeTab?.label.replace(/s$/, '')}` : 'Edit Entry'}
          onClose={closeModal} onSave={handleSave} saving={saving}
        >
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder={activeType === 'industry' ? 'Company name' : activeType === 'coordinator' ? 'Person name' : 'Institution name'} />
          </div>
          <div className="form-group">
            <label className="form-label">{activeType === 'coordinator' ? 'Designation / Role' : 'Collaboration Type'}</label>
            <input className="form-input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
              placeholder={activeType === 'coordinator' ? 'e.g. Research Coordinator' : 'e.g. Industry Partner'} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description of the collaboration..." />
          </div>
          <div className="form-group">
            <label className="form-label">Website URL</label>
            <input className="form-input" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })}
              placeholder="https://..." />
          </div>
        </CrudModal>
      )}
    </div>
  );
}
