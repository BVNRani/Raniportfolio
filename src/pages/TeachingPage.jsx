// src/pages/TeachingPage.jsx
import { useState, useEffect } from 'react';
import { getCollection, addItem, updateItem, deleteItem } from '../firebase/services';
import CrudModal from '../components/CrudModal';
import { Plus, Pencil, Trash2, BookMarked } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY = { course: '', code: '', level: 'UG', semester: 'Odd', year: '', description: '' };

const LEVEL_COLORS = { UG: '#0A1F44', PG: '#7c3aed', PhD: '#2E7D52' };
const SEM_COLORS   = { Odd: '#B48C3C', Even: '#2563eb' };

export default function TeachingPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setItems(await getCollection('teaching'));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (item) => { setForm(item); setEditId(item.id); setModal('edit'); };
  const closeModal = () => { setModal(null); setForm(EMPTY); setEditId(null); };

  const handleSave = async () => {
    if (!form.course.trim()) return toast.error('Course name is required');
    setSaving(true);
    try {
      if (modal === 'add') { await addItem('teaching', form); toast.success('Course added!'); }
      else { await updateItem('teaching', editId, form); toast.success('Course updated!'); }
      await load(); closeModal();
    } catch (e) { toast.error(e.message); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this course?')) return;
    await deleteItem('teaching', id); toast.success('Deleted'); load();
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>;

  // Group by academic year for display
  const byYear = {};
  items.forEach(item => {
    const y = item.year || 'Unspecified';
    if (!byYear[y]) byYear[y] = [];
    byYear[y].push(item);
  });
  const years = Object.keys(byYear).sort((a, b) => b.localeCompare(a));

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">
          <BookMarked size={22} style={{ color: '#B48C3C' }} /> Teaching & Courses ({items.length})
        </h2>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Course</button>
      </div>

      {items.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h3>No courses yet</h3>
          <p>Add the courses you teach each semester.</p>
        </div>
      )}

      {years.map(year => (
        <div key={year} style={{ marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, #0A1F44, #1E3A7A)',
            color: '#D4AF37', borderRadius: 10, padding: '5px 16px',
            fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 700,
            marginBottom: 14,
          }}>
            📅 {year}
          </div>
          <div className="cards-grid">
            {byYear[year].map(item => (
              <div key={item.id} className="item-card">
                <div className="item-card-accent" style={{ background: 'linear-gradient(180deg, #B48C3C, transparent)' }} />
                <div className="item-card-title">{item.course}</div>
                <div className="item-card-meta" style={{ flexWrap: 'wrap', gap: 6 }}>
                  {item.code && (
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#6A6560', background: '#F4F3F0', borderRadius: 6, padding: '2px 8px' }}>
                      {item.code}
                    </span>
                  )}
                  {item.level && (
                    <span className="badge" style={{ background: (LEVEL_COLORS[item.level] || '#0A1F44') + '18', color: LEVEL_COLORS[item.level] || '#0A1F44', border: `1px solid ${(LEVEL_COLORS[item.level] || '#0A1F44')}44` }}>
                      {item.level}
                    </span>
                  )}
                  {item.semester && (
                    <span className="badge" style={{ background: (SEM_COLORS[item.semester] || '#B48C3C') + '18', color: SEM_COLORS[item.semester] || '#B48C3C', border: `1px solid ${(SEM_COLORS[item.semester] || '#B48C3C')}44` }}>
                      {item.semester} Sem
                    </span>
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
        </div>
      ))}

      {modal && (
        <CrudModal
          title={modal === 'add' ? 'Add Course' : 'Edit Course'}
          onClose={closeModal}
          onSave={handleSave}
          saving={saving}
        >
          <div className="form-group">
            <label className="form-label">Course Name *</label>
            <input className="form-input" value={form.course} onChange={e => setForm({ ...form, course: e.target.value })} placeholder="e.g. Artificial Intelligence" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Course Code</label>
              <input className="form-input" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="e.g. IT6001" />
            </div>
            <div className="form-group">
              <label className="form-label">Level</label>
              <select className="form-select" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                <option>UG</option>
                <option>PG</option>
                <option>PhD</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Semester</label>
              <select className="form-select" value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })}>
                <option>Odd</option>
                <option>Even</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Academic Year</label>
              <input className="form-input" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="e.g. 2024-25" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Topics covered, lab component, etc." />
          </div>
        </CrudModal>
      )}
    </div>
  );
}
