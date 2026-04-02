// src/components/Topbar.jsx
import { FileDown } from 'lucide-react';
import { useState } from 'react';
import { getCollection, getProfile } from '../firebase/services';
import { generatePortfolioPDF } from '../utils/generatePDF';
import toast from 'react-hot-toast';

export default function Topbar({ title }) {
  const [generating, setGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    setGenerating(true);
    toast.loading('Generating your portfolio PDF…');
    try {
      const [profile, publications, patents, awards, projects, experience, education] = await Promise.all([
        getProfile(),
        getCollection('publications'),
        getCollection('patents'),
        getCollection('awards'),
        getCollection('projects'),
        getCollection('experience'),
        getCollection('education'),
      ]);
      generatePortfolioPDF({ profile, publications, patents, awards, projects, experience, education });
      toast.dismiss();
      toast.success('PDF downloaded successfully!');
    } catch (e) {
      toast.dismiss();
      toast.error('PDF generation failed: ' + e.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-title">{title}</div>
      <div className="topbar-actions">
        <button
          className="btn btn-gold"
          onClick={handleGeneratePDF}
          disabled={generating}
        >
          <FileDown size={16} />
          {generating ? 'Generating…' : 'Export PDF'}
        </button>
      </div>
    </header>
  );
}
