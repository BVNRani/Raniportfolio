// src/pages/GalleryPage.jsx
import { useState, useEffect } from 'react';
import { getCollection, addItem, deleteItem, uploadPhoto } from '../firebase/services';
import { Plus, Trash2, Image, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [caption, setCaption] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const load = async () => {
    setLoading(true);
    setPhotos(await getCollection('gallery'));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleFiles = async (files) => {
    const arr = Array.from(files);
    if (!arr.length) return;
    setUploading(true);
    try {
      for (const file of arr) {
        const url = await uploadPhoto(file, 'gallery');
        await addItem('gallery', { url, caption: caption || file.name.replace(/\.[^.]+$/, ''), name: file.name });
        toast.success(`Uploaded: ${file.name}`);
      }
      setCaption('');
      await load();
    } catch (e) { toast.error(e.message); }
    finally { setUploading(false); }
  };

  const handleDelete = async (photo) => {
    if (!confirm('Delete this photo?')) return;
    try {
      await deleteItem('gallery', photo.id);
      toast.success('Photo deleted');
      load();
    } catch (e) { toast.error(e.message); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>;

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title"><Image size={22} style={{ color: '#B48C3C' }} /> Photo Gallery ({photos.length})</h2>
      </div>

      {/* Upload Zone */}
      <div
        className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
        style={{ marginBottom: 28 }}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => document.getElementById('gallery-input').click()}
      >
        <div style={{ fontSize: 36, marginBottom: 10 }}>📷</div>
        <div style={{ fontWeight: 700, color: '#0A1F44', fontSize: 15 }}>
          {uploading ? 'Uploading photos…' : 'Click or drag & drop photos here'}
        </div>
        <div style={{ color: '#A09890', fontSize: 13, marginTop: 4 }}>Supports JPG, PNG, WebP • Multiple files allowed</div>
        {uploading && <div className="spinner" style={{ margin: '12px auto 0' }} />}
      </div>
      <input id="gallery-input" type="file" accept="image/*" multiple hidden onChange={e => handleFiles(e.target.files)} />

      {/* Optional caption */}
      <div style={{ marginBottom: 24, display: 'flex', gap: 10, alignItems: 'center' }}>
        <input
          className="form-input"
          style={{ maxWidth: 320 }}
          placeholder="Caption for next upload (optional)"
          value={caption}
          onChange={e => setCaption(e.target.value)}
        />
      </div>

      {photos.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🖼️</div>
          <h3>No photos yet</h3>
          <p>Upload photos of awards, events, conferences, and more.</p>
        </div>
      )}

      <div className="gallery-grid">
        {photos.map(photo => (
          <div key={photo.id} className="gallery-item">
            <img src={photo.url} alt={photo.caption || photo.name} onClick={() => setLightbox(photo)} />
            {photo.caption && (
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(10,31,68,0.85))',
                padding: '20px 10px 10px', color: 'white', fontSize: 12, fontWeight: 600
              }}>{photo.caption}</div>
            )}
            <div className="gallery-item-overlay">
              <button className="btn btn-danger btn-icon" onClick={() => handleDelete(photo)}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="modal-overlay" onClick={() => setLightbox(null)}>
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img src={lightbox.url} alt={lightbox.caption} style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 12, objectFit: 'contain', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} />
            {lightbox.caption && (
              <div style={{ textAlign: 'center', color: 'white', marginTop: 12, fontSize: 14, fontWeight: 600 }}>{lightbox.caption}</div>
            )}
            <button className="btn btn-outline btn-icon" onClick={() => setLightbox(null)}
              style={{ position: 'absolute', top: -14, right: -14, background: 'white' }}>
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
