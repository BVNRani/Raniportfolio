// src/pages/PublicationsPage.jsx
import { useState, useEffect } from 'react';
import { getCollection, addItem, updateItem, deleteItem } from '../firebase/services';
import CrudModal from '../components/CrudModal';
import { Plus, Pencil, Trash2, ExternalLink, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY = { title: '', authors: '', journal: '', year: new Date().getFullYear(), type: 'Journal', doi: '', indexed: 'Scopus' };

export default function PublicationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    const data = await getCollection('publications');
    setItems(data);
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
      if (modal === 'add') {
        await addItem('publications', form);
        toast.success('Publication added!');
      } else {
        await updateItem('publications', editId, form);
        toast.success('Publication updated!');
      }
      await load();
      closeModal();
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this publication?')) return;
    try {
      await deleteItem('publications', id);
      toast.success('Deleted');
      load();
    } catch (e) { toast.error(e.message); }
  };

  const types = ['All', 'Journal', 'Conference', 'Book Chapter'];
  const byTab = tab === 'All' ? items : items.filter(i => i.type === tab);
  const filtered = search.trim()
    ? byTab.filter(i =>
        i.title?.toLowerCase().includes(search.toLowerCase()) ||
        i.authors?.toLowerCase().includes(search.toLowerCase()) ||
        i.journal?.toLowerCase().includes(search.toLowerCase())
      )
    : byTab;

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>;

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title"><BookOpen size={22} style={{ color: '#B48C3C' }} /> Publications ({items.length})</h2>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Publication</button>
      </div>

      <div className="tabs">
        {types.map(t => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t} {t === 'All' ? `(${items.length})` : `(${items.filter(i => i.type === t).length})`}
          </button>
        ))}
      </div>

      <div className="search-bar-wrap">
        <input
          className="search-input"
          placeholder="Search by title, authors, or journal…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📄</div>
          <h3>{search ? 'No results found' : 'No publications yet'}</h3>
          <p>{search ? `No publications match "${search}"` : 'Add your first publication to get started.'}</p>
        </div>
      )}

      {filtered.map((pub, idx) => (
        <div key={pub.id} className={`pub-item ${pub.type === 'Conference' ? 'conference' : pub.type === 'Book Chapter' ? 'book-chapter' : ''}`}>
          <span className="pub-number">{idx + 1}</span>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: 15.5, color: '#0A1F44', lineHeight: 1.4, flex: 1 }}>
                {pub.title}
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {pub.doi && <a href={pub.doi} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm btn-icon"><ExternalLink size={13} /></a>}
                <button className="btn btn-outline btn-sm btn-icon" onClick={() => openEdit(pub)}><Pencil size={13} /></button>
                <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(pub.id)}><Trash2 size={13} /></button>
              </div>
            </div>
            <div style={{ fontSize: 13, color: '#6A6560', marginTop: 5, fontStyle: 'italic' }}>{pub.authors}</div>
            <div style={{ fontSize: 13, color: '#6A6560', marginTop: 3 }}>{pub.journal}{pub.year ? ` (${pub.year})` : ''}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              <span className={`badge ${pub.type === 'Journal' ? 'badge-navy' : pub.type === 'Conference' ? 'badge-blue' : 'badge-green'}`}>{pub.type}</span>
              {pub.indexed && <span className="badge badge-gold">{pub.indexed}</span>}
            </div>
          </div>
        </div>
      ))}

      {modal && (
        <CrudModal title={modal === 'add' ? 'Add Publication' : 'Edit Publication'} onClose={closeModal} onSave={handleSave} saving={saving}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <textarea className="form-textarea" style={{ minHeight: 70 }} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Full paper title" />
          </div>
          <div className="form-group">
            <label className="form-label">Authors</label>
            <input className="form-input" value={form.authors} onChange={e => setForm({ ...form, authors: e.target.value })} placeholder="Bandaru V.N.R., et al." />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option>Journal</option>
                <option>Conference</option>
                <option>Book Chapter</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Year</label>
              <input className="form-input" type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Journal / Conference / Publisher</label>
            <input className="form-input" value={form.journal} onChange={e => setForm({ ...form, journal: e.target.value })} placeholder="e.g. Concurrency and Computation: Practice and Experience" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Indexed In</label>
              <select className="form-select" value={form.indexed} onChange={e => setForm({ ...form, indexed: e.target.value })}>
                <option>Scopus</option>
                <option>Scopus/WoS</option>
                <option>IEEE</option>
                <option>Springer</option>
                <option>IGI Global</option>
                <option>Book Chapter</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">DOI / URL</label>
              <input className="form-input" value={form.doi} onChange={e => setForm({ ...form, doi: e.target.value })} placeholder="https://doi.org/..." />
            </div>
          </div>
        </CrudModal>
      )}
    </div>
  );
}
