// src/pages/ExperiencePage.jsx
import { useState, useEffect } from 'react';
import { getCollection, addItem, updateItem, deleteItem } from '../firebase/services';
import CrudModal from '../components/CrudModal';
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULT_EXP = [
  { role: 'Associate Professor – Dept. of Information Technology', institution: 'Vishnu Institute of Technology, Bhimavaram, AP', period: 'Feb 2021 – Present', description: 'Teaching AI, IoT, Compiler Design, Python, Data Visualization. Coordinating student research projects. Contributing to NBA, NAAC, NIRF. Supervising 4 Ph.D. scholars.', isCurrent: true },
  { role: 'Assistant Professor (Sr. Grade) – Dept. of CSE', institution: 'SRM Easwari Engineering College, Chennai', period: 'June 2017 – Apr 2020', description: 'Advanced lectures in OS and Software Project Management. Research proposals and IEEE publication guidance.', isCurrent: false },
  { role: 'Assistant Professor & HoD – Dept. of CSE', institution: 'Gopal Ramalingam Memorial Engineering College, Chennai', period: 'July 2012 – May 2017', description: 'Led department initiatives, NBA Coordinator, IQAC representative. Supervised projects and placements.', isCurrent: false },
  { role: 'Assistant Professor & HoD – Dept. of CSE', institution: 'RRASE College of Engineering, Chennai', period: 'June 2010 – June 2012', description: 'Academic operations, NAAC/NBA/ISO audit preparations, quality assurance.', isCurrent: false },
  { role: 'Assistant Professor – Dept. of CSE', institution: 'Sri Krishna Engineering College, Chennai', period: 'June 2009 – June 2010', description: 'Taught Programming in C, Data Structures, Internet Technologies.', isCurrent: false },
  { role: 'Lecturer – Dept. of CSE', institution: 'Sri Krishna Engineering College, Chennai', period: 'June 2005 – June 2007', description: 'Labs and tutorials in Programming, OOPs, and UNIX Systems. Managed campus intranet solutions.', isCurrent: false },
];

const EMPTY = { role: '', institution: '', period: '', description: '', isCurrent: false };

export default function ExperiencePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    let data = await getCollection('experience');
    if (data.length === 0) {
      // seed default experience
      for (const e of DEFAULT_EXP) await addItem('experience', e);
      data = await getCollection('experience');
    }
    setItems(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (item) => { setForm(item); setEditId(item.id); setModal('edit'); };
  const closeModal = () => { setModal(null); setForm(EMPTY); setEditId(null); };

  const handleSave = async () => {
    if (!form.role.trim()) return toast.error('Role is required');
    setSaving(true);
    try {
      if (modal === 'add') { await addItem('experience', form); toast.success('Experience added!'); }
      else { await updateItem('experience', editId, form); toast.success('Updated!'); }
      await load(); closeModal();
    } catch (e) { toast.error(e.message); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    await deleteItem('experience', id); toast.success('Deleted'); load();
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>;

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title"><Briefcase size={22} style={{ color: '#B48C3C' }} /> Professional Experience ({items.length})</h2>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Experience</button>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: 40 }}>
        <div style={{ position: 'absolute', left: 14, top: 0, bottom: 0, width: 2, background: 'linear-gradient(180deg, #B48C3C, #0A1F44)' }} />
        {items.map((exp, i) => (
          <div key={exp.id} style={{ position: 'relative', marginBottom: 28 }}>
            <div style={{
              position: 'absolute', left: -33, top: 12, width: 18, height: 18,
              borderRadius: '50%',
              background: exp.isCurrent ? 'linear-gradient(135deg, #B48C3C, #F0C040)' : '#0A1F44',
              border: '3px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }} />
            <div style={{ background: 'white', borderRadius: 12, padding: 22, boxShadow: '0 2px 8px rgba(10,31,68,0.1)', border: '1px solid #E2E0DC' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: 16, color: '#0A1F44' }}>{exp.role}</div>
                  <div style={{ fontSize: 13.5, color: '#B48C3C', fontWeight: 600, margin: '4px 0' }}>{exp.institution}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                    <span className="badge badge-navy">{exp.period}</span>
                    {exp.isCurrent && <span className="badge badge-gold">Current</span>}
                  </div>
                  <div style={{ fontSize: 13.5, color: '#6A6560', lineHeight: 1.6 }}>{exp.description}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button className="btn btn-outline btn-sm btn-icon" onClick={() => openEdit(exp)}><Pencil size={13} /></button>
                  <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(exp.id)}><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <CrudModal title={modal === 'add' ? 'Add Experience' : 'Edit Experience'} onClose={closeModal} onSave={handleSave} saving={saving}>
          <div className="form-group"><label className="form-label">Role / Designation *</label><input className="form-input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g. Associate Professor – Dept. of IT" /></div>
          <div className="form-group"><label className="form-label">Institution</label><input className="form-input" value={form.institution} onChange={e => setForm({ ...form, institution: e.target.value })} /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Period</label><input className="form-input" value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} placeholder="June 2021 – Present" /></div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer', paddingBottom: 10 }}>
                <input type="checkbox" checked={form.isCurrent} onChange={e => setForm({ ...form, isCurrent: e.target.checked })} />
                <span className="form-label" style={{ margin: 0 }}>Current Position</span>
              </label>
            </div>
          </div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
        </CrudModal>
      )}
    </div>
  );
}
