// src/pages/EducationPage.jsx
import { useState, useEffect } from 'react';
import { getCollection, addItem, updateItem, deleteItem } from '../firebase/services';
import CrudModal from '../components/CrudModal';
import { Plus, Pencil, Trash2, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY = { degree: '', institution: '', year: '', grade: '', description: '' };

const DEFAULT_EDU = [
  { degree: 'Ph.D. in Computer Science & Engineering', institution: 'Anna University, Chennai', year: '2015', grade: '', description: 'Research on Blockchain and Cryptographic techniques for cloud data security.' },
  { degree: 'M.E. in Computer Science & Engineering', institution: 'Anna University, Chennai', year: '2009', grade: '8.2 CGPA', description: '' },
  { degree: 'B.E. in Computer Science & Engineering', institution: 'Manonmaniam Sundaranar University', year: '2005', grade: '72%', description: '' },
];

export default function EducationPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    let data = await getCollection('education');
    if (data.length === 0) {
      for (const e of DEFAULT_EDU) await addItem('education', e);
      data = await getCollection('education');
    }
    setItems(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (item) => { setForm(item); setEditId(item.id); setModal('edit'); };
  const closeModal = () => { setModal(null); setForm(EMPTY); setEditId(null); };

  const handleSave = async () => {
    if (!form.degree.trim()) return toast.error('Degree is required');
    setSaving(true);
    try {
      if (modal === 'add') { await addItem('education', form); toast.success('Education added!'); }
      else { await updateItem('education', editId, form); toast.success('Updated!'); }
      await load(); closeModal();
    } catch (e) { toast.error(e.message); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return;
    await deleteItem('education', id); toast.success('Deleted'); load();
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>;

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title"><GraduationCap size={22} style={{ color: '#B48C3C' }} /> Education ({items.length})</h2>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Education</button>
      </div>

      {items.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🎓</div>
          <h3>No education entries yet</h3>
          <p>Add your academic qualifications.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {items.map((edu, i) => (
          <div key={edu.id} style={{ background: 'white', borderRadius: 14, padding: '20px 22px', boxShadow: '0 2px 10px rgba(10,31,68,0.09)', display: 'flex', gap: 18, alignItems: 'flex-start', borderLeft: '4px solid #B48C3C' }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: 'linear-gradient(135deg, #0A1F44, #1E3A7A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
              🎓
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: 16, color: '#0A1F44', marginBottom: 4 }}>{edu.degree}</div>
              <div style={{ fontSize: 13.5, color: '#B48C3C', fontWeight: 600, marginBottom: 6 }}>{edu.institution}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: edu.description ? 8 : 0 }}>
                {edu.year  && <span className="badge badge-navy">{edu.year}</span>}
                {edu.grade && <span className="badge badge-gold">{edu.grade}</span>}
              </div>
              {edu.description && <div style={{ fontSize: 13, color: '#6A6560', lineHeight: 1.6 }}>{edu.description}</div>}
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button className="btn btn-outline btn-sm btn-icon" onClick={() => openEdit(edu)}><Pencil size={13} /></button>
              <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(edu.id)}><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <CrudModal title={modal === 'add' ? 'Add Education' : 'Edit Education'} onClose={closeModal} onSave={handleSave} saving={saving}>
          <div className="form-group">
            <label className="form-label">Degree / Qualification *</label>
            <input className="form-input" value={form.degree} onChange={e => setForm({ ...form, degree: e.target.value })} placeholder="e.g. Ph.D. in Computer Science & Engineering" />
          </div>
          <div className="form-group">
            <label className="form-label">Institution</label>
            <input className="form-input" value={form.institution} onChange={e => setForm({ ...form, institution: e.target.value })} placeholder="e.g. Anna University, Chennai" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Year of Completion</label>
              <input className="form-input" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="e.g. 2015" />
            </div>
            <div className="form-group">
              <label className="form-label">Grade / CGPA / Percentage</label>
              <input className="form-input" value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} placeholder="e.g. 8.5 CGPA or 78%" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description / Thesis / Notes</label>
            <textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Thesis topic, specialization, or additional notes…" />
          </div>
        </CrudModal>
      )}
    </div>
  );
}
