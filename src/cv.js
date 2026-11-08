import D from './data.js';

// Builds the CV from data.js on every call, so it always reflects the latest content.
export async function downloadCV() {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const M = 48, PW = doc.internal.pageSize.getWidth(), PH = doc.internal.pageSize.getHeight(), CW = PW - M * 2;
  let y = M;
  const need = (h) => { if (y + h > PH - M) { doc.addPage(); y = M; } };
  const text = (s, size, style, color, indent = 0, gap = 4) => {
    doc.setFont('helvetica', style); doc.setFontSize(size); doc.setTextColor(...color);
    doc.splitTextToSize(s, CW - indent).forEach((ln) => { need(size + 3); doc.text(ln, M + indent, y + size); y += size + 3; });
    y += gap;
  };
  const section = (t) => { need(40); y += 8; text(t.toUpperCase(), 12, 'bold', [37, 99, 235], 0, 1); doc.setDrawColor(37, 99, 235); doc.line(M, y, M + CW, y); y += 8; };
  const ink = [30, 41, 59], mute = [100, 116, 139], dark = [15, 23, 42];

  text(D.name, 24, 'bold', dark, 0, 2);
  text(D.title, 12, 'normal', [71, 85, 105], 0, 2);
  text([D.email, D.github.replace('https://', ''), D.linkedin.replace('https://', ''), D.location].join('  |  '), 9, 'normal', [71, 85, 105], 0, 4);
  text(`Nationality: ${D.nationality}`, 9, 'normal', [71, 85, 105], 0, 2);
  section('Profile'); text(D.summary, 10, 'normal', ink);
  section('Education');
  D.education.forEach((e) => { text(`${e.title} — ${e.place}`, 10.5, 'bold', dark, 0, 0); text(`${e.period}  |  ${e.level}`, 9, 'normal', mute, 0, 2); e.points.forEach((p) => text('•  ' + p, 9.5, 'normal', ink, 10, 1)); y += 6; });
  section('Skills');
  const groups = {}; D.skills.forEach((s) => (groups[s.group] = groups[s.group] || []).push(s.name));
  Object.entries(groups).forEach(([g, l]) => text(`${g}: ${l.join(', ')}`, 10, 'normal', ink, 0, 2));
  section('Projects');
  D.projects.forEach((p) => { text(`${p.name}  (${p.tag})`, 10.5, 'bold', dark, 0, 0); text(p.desc, 9.5, 'normal', ink, 10, 0); text([p.live, p.link].filter(Boolean).join('  |  '), 9, 'normal', [37, 99, 235], 10, 6); });
  section('Experience & Leadership');
  D.experience.forEach((x) => { text(`${x.role} — ${x.org}`, 10.5, 'bold', dark, 0, 0); text(x.period, 9, 'normal', mute, 0, 2); text(x.desc, 9.5, 'normal', ink, 10, 6); });
  section('Goals'); D.goals.forEach((g) => text('•  ' + g, 9.5, 'normal', ink, 10, 1));
  const stamp = new Date().toISOString().slice(0, 10);
  doc.setFontSize(8); doc.setTextColor(148, 163, 184); doc.text(`Generated from live portfolio on ${stamp}`, M, PH - 24);
  doc.save(`${D.name.replace(/\s+/g, '_')}_CV_${stamp}.pdf`);
}
