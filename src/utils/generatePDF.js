// src/utils/generatePDF.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generatePortfolioPDF = (data) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const margin = 18;
  let y = 0;

  const NAVY  = [10, 31, 68];
  const GOLD  = [212, 175, 55];
  const CREAM = [245, 240, 232];
  const LIGHT = [248, 249, 252];

  const addPage = () => { doc.addPage(); y = 20; };

  const checkY = (needed = 25) => { if (y + needed > 275) addPage(); };

  const pageHeader = (right) => {
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, W, 12, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...GOLD);
    doc.text('DR. VENKATA NAGA RANI BANDARU  |  ACADEMIC PORTFOLIO', margin, 7.5);
    if (right) doc.text(right, W - margin, 7.5, { align: 'right' });
  };

  const sectionHeader = (title) => {
    checkY(18);
    doc.setFillColor(...NAVY);
    doc.rect(margin, y, W - margin * 2, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...GOLD);
    doc.text(title.toUpperCase(), margin + 4, y + 6.5);
    y += 14;
  };

  const pageFooter = () => {
    const total = doc.internal.getNumberOfPages();
    for (let i = 2; i <= total; i++) {
      doc.setPage(i);
      doc.setFillColor(...NAVY);
      doc.rect(0, 288, W, 9, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...GOLD);
      doc.text('Dr. Venkata Naga Rani Bandaru  |  Vishnu Institute of Technology', margin, 293.5);
      doc.text(`Page ${i} of ${total}`, W - margin, 293.5, { align: 'right' });
    }
  };

  // ── COVER PAGE ────────────────────────────────────────────────
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, 297, 'F');

  doc.setFillColor(...GOLD);
  doc.rect(0, 0, W, 4, 'F');

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.3);
  doc.line(margin, 55, W - margin, 55);
  doc.line(margin, 57, W - margin, 57);

  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(...GOLD);
  doc.text('Curriculum Vitae', W / 2, 45, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...CREAM);
  doc.text('Dr. Venkata Naga', W / 2, 75, { align: 'center' });
  doc.text('Rani Bandaru', W / 2, 88, { align: 'center' });

  doc.setFillColor(...GOLD);
  doc.rect(W / 2 - 30, 94, 60, 1.5, 'F');

  const profile = data.profile || {};
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...GOLD);
  doc.text(profile.title || 'Associate Professor in Information Technology', W / 2, 104, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.text(profile.institution || 'Vishnu Institute of Technology, Bhimavaram', W / 2, 113, { align: 'center' });
  doc.text(profile.location ? profile.location.split(',').slice(-2).join(',').trim() : 'Andhra Pradesh, India', W / 2, 120, { align: 'center' });

  // Dynamic stats
  const stats = [
    { label: 'Years Experience', value: profile.experience || '18+' },
    { label: 'Publications',     value: String((data.publications || []).length) },
    { label: 'Patents',          value: String((data.patents || []).length) },
    { label: 'PhD Scholars',     value: profile.phdScholars || '4' },
  ];
  const statW = (W - margin * 2) / 4;
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.3);
  doc.line(margin, 145, W - margin, 145);
  stats.forEach((s, i) => {
    const x = margin + i * statW + statW / 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(...GOLD);
    doc.text(s.value, x, 163, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text(s.label.toUpperCase(), x, 170, { align: 'center' });
  });
  doc.line(margin, 177, W - margin, 177);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(200, 210, 230);
  const contacts = [
    profile.email      || 'venkatanagarani.b@vishnu.edu.in',
    profile.phone      || '+91-8668165871',
    `ORCID: ${profile.orcid         || '0000-0002-0715-9220'}`,
    `Researcher ID: ${profile.researcherId || 'PA-2013-0030'}`,
  ];
  contacts.forEach((c, i) => doc.text(c, W / 2, 190 + i * 8, { align: 'center' }));

  doc.setFont('times', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(...GOLD);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, W / 2, 280, { align: 'center' });
  doc.setFillColor(...GOLD);
  doc.rect(0, 293, W, 4, 'F');

  // ── PAGE 2: SUMMARY + EDUCATION + EXPERIENCE ─────────────────
  addPage();
  pageHeader('PROFILE & EXPERIENCE');
  y = 22;

  sectionHeader('Professional Summary');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 50, 70);
  const summary = profile.summary || 'A committed academician and researcher with over 18 years of rich experience.';
  const summaryLines = doc.splitTextToSize(summary, W - margin * 2);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 5 + 10;

  // Education
  const education = data.education || [];
  if (education.length > 0) {
    sectionHeader('Education');
    doc.autoTable({
      startY: y,
      head: [['Degree / Qualification', 'Institution', 'Year', 'Grade / CGPA']],
      body: education.map(e => [e.degree || '', e.institution || '', e.year || '', e.grade || '']),
      theme: 'grid',
      headStyles: { fillColor: NAVY, textColor: GOLD, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9, textColor: [40, 50, 70] },
      alternateRowStyles: { fillColor: LIGHT },
      margin: { left: margin, right: margin },
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  // Experience
  sectionHeader('Professional Experience');
  (data.experience || []).forEach((exp) => {
    checkY(30);
    doc.setFillColor(...LIGHT);
    doc.roundedRect(margin, y, W - margin * 2, 7, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...NAVY);
    doc.text(exp.role || '', margin + 3, y + 4.8);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(...GOLD);
    doc.text(exp.period || '', W - margin - 3, y + 4.8, { align: 'right' });
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(70, 80, 100);
    doc.text(exp.institution || '', margin + 3, y);
    y += 5;
    if (exp.description) {
      const descLines = doc.splitTextToSize(exp.description, W - margin * 2 - 6);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(70, 75, 90);
      doc.text(descLines, margin + 4, y);
      y += descLines.length * 4.5;
    }
    y += 7;
  });

  // ── PAGE 3: PUBLICATIONS ─────────────────────────────────────
  addPage();
  pageHeader('PUBLICATIONS & PATENTS');
  y = 22;

  sectionHeader('Research Publications');
  let pubIndex = 1;
  ['Journal', 'Conference', 'Book Chapter'].forEach((type) => {
    const pubs = (data.publications || []).filter(p => p.type === type);
    if (!pubs.length) return;
    checkY(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...NAVY);
    doc.text(type + ' Articles', margin, y);
    doc.setFillColor(...GOLD);
    doc.rect(margin, y + 1.5, 35, 0.5, 'F');
    y += 8;
    pubs.forEach((pub) => {
      checkY(22);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(30, 40, 80);
      const titleLines = doc.splitTextToSize(`${pubIndex}. ${pub.title || ''}`, W - margin * 2);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 4.5;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(90, 90, 110);
      doc.text(pub.authors || '', margin + 4, y);
      y += 4.5;
      const venue = [pub.journal, pub.year].filter(Boolean).join(' | ');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...NAVY);
      doc.text(venue, margin + 4, y);
      if (pub.indexed) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...GOLD);
        doc.text(`  [${pub.indexed}]`, margin + 4 + doc.getTextWidth(venue), y);
      }
      y += 7;
      pubIndex++;
    });
  });

  // ── PATENTS ──────────────────────────────────────────────────
  checkY(20);
  sectionHeader('Patents');
  (data.patents || []).forEach((p, i) => {
    checkY(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 40, 80);
    const ptitle = doc.splitTextToSize(`${i + 1}. ${p.title || ''}`, W - margin * 2);
    doc.text(ptitle, margin, y);
    y += ptitle.length * 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 100);
    // Fixed: use p.number (not p.patentNo)
    doc.text(`Patent No.: ${p.number || ''}  |  Year: ${p.year || ''}  |  Status: ${p.status || ''}`, margin + 3, y);
    y += 5;
    if (p.description) {
      const desc = doc.splitTextToSize(p.description, W - margin * 2 - 6);
      doc.setFontSize(8.5);
      doc.setTextColor(60, 65, 80);
      doc.text(desc, margin + 3, y);
      y += desc.length * 4.5;
    }
    y += 8;
  });

  // ── PAGE 4: AWARDS + PROJECTS ────────────────────────────────
  addPage();
  pageHeader('AWARDS & PROJECTS');
  y = 22;

  sectionHeader('Awards & Achievements');
  // Fixed: use a.body (not a.organization), a.category (not a.level)
  doc.autoTable({
    startY: y,
    head: [['Award / Achievement', 'Awarding Body', 'Year', 'Category']],
    body: (data.awards || []).map(a => [a.title || '', a.body || '', a.year || '', a.category || '']),
    theme: 'striped',
    headStyles: { fillColor: NAVY, textColor: GOLD, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [40, 50, 70] },
    alternateRowStyles: { fillColor: LIGHT },
    margin: { left: margin, right: margin },
    columnStyles: { 0: { cellWidth: 68 }, 2: { cellWidth: 16 }, 3: { cellWidth: 28 } },
  });
  y = doc.lastAutoTable.finalY + 10;

  // ── PROJECTS ─────────────────────────────────────────────────
  checkY(20);
  sectionHeader('Research Projects & Grant Proposals');
  (data.projects || []).forEach((proj, i) => {
    checkY(28);
    doc.setFillColor(...LIGHT);
    doc.rect(margin, y, W - margin * 2, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...NAVY);
    const ptitleLines = doc.splitTextToSize(`${i + 1}. ${proj.title || ''}`, W - margin * 2 - 35);
    doc.text(ptitleLines, margin + 3, y + 4.5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const statusColor = proj.status === 'Completed' ? [0, 140, 60] : proj.status === 'In Progress' ? [180, 140, 60] : [80, 80, 120];
    doc.setTextColor(...statusColor);
    doc.text(proj.status || '', W - margin - 3, y + 4.5, { align: 'right' });
    y += ptitleLines.length * 4.5 + 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(80, 80, 100);
    // Fixed: use proj.funding and proj.area (not proj.agency, proj.budget, proj.type)
    const meta = [proj.area, proj.funding].filter(Boolean).join('  |  ');
    if (meta) { doc.text(meta, margin + 3, y); y += 5; }
    if (proj.collaborators) { doc.text(`Collaborators: ${proj.collaborators}`, margin + 3, y); y += 5; }
    if (proj.description) {
      const descLines = doc.splitTextToSize(proj.description, W - margin * 2 - 6);
      doc.setTextColor(60, 65, 80);
      doc.text(descLines, margin + 3, y);
      y += descLines.length * 4.5;
    }
    y += 8;
  });

  pageFooter();
  doc.save('Dr_Venkata_Naga_Rani_Bandaru_Portfolio.pdf');
};
