/**
 * PDF Generator Utility
 * Generates professional PDF reports from analysis results.
 * Uses jsPDF v4 (named export) + jspdf-autotable v5 (functional API).
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateAnalysisPDF = (analysisData) => {
  if (!analysisData || !analysisData.analysisResult) {
    throw new Error('No analysis data available to export');
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 20;

  const checkPage = (needed = 20) => {
    if (y + needed > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
  };

  const result = analysisData.analysisResult || {};
  const score = analysisData.finalScore ?? result.rubricScore ?? result.score ?? 0;
  const label = result.scoreLabel ?? result.label ?? 'N/A';
  const justification = analysisData.finalAssessment ?? result.justification ?? 'No assessment provided.';
  const evidence = result.evidence || [];
  const kpis = result.kpiMapping || result.kpis || [];
  const gaps = result.gaps || [];
  const questions = result.followUpQuestions || [];
  const fellowName = analysisData.fellowName || 'Fellow';

  // ── Header ──────────────────────────────────────────────────────────────────
  doc.setFillColor(137, 77, 0); // primary brand color
  doc.rect(0, 0, pageWidth, 42, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Trinethra Analysis Report', pageWidth / 2, 18, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString()}  |  Fellow: ${fellowName}`, pageWidth / 2, 30, { align: 'center' });

  y = 54;

  // ── Score block ─────────────────────────────────────────────────────────────
  checkPage(32);
  doc.setFillColor(255, 241, 232);
  doc.rect(16, y, pageWidth - 32, 28, 'F');
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(137, 77, 0);
  doc.text('Assessment Score', 22, y + 10);
  doc.setFontSize(20);
  doc.setTextColor(137, 77, 0);
  doc.text(`${score} / 10`, pageWidth - 22, y + 12, { align: 'right' });
  doc.setFontSize(10);
  doc.setTextColor(83, 68, 55);
  doc.text(label, pageWidth - 22, y + 22, { align: 'right' });
  y += 38;

  // ── Justification ────────────────────────────────────────────────────────────
  checkPage(30);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Assessment Summary', 16, y);
  y += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const splitJust = doc.splitTextToSize(justification, pageWidth - 32);
  doc.text(splitJust, 16, y);
  y += splitJust.length * 5 + 10;

  // ── Behavioral Evidence ──────────────────────────────────────────────────────
  if (evidence.length > 0) {
    checkPage(20);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Behavioral Evidence', 16, y);
    y += 10;

    for (const item of evidence) {
      checkPage(30);
      const itemType = item.type || 'Neutral';

      if (itemType === 'Positive') {
        doc.setFillColor(209, 232, 207);
        doc.setTextColor(46, 125, 50);
      } else if (itemType === 'Negative') {
        doc.setFillColor(250, 219, 216);
        doc.setTextColor(211, 47, 47);
      } else {
        doc.setFillColor(250, 210, 177);
        doc.setTextColor(230, 126, 34);
      }

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.rect(16, y - 4, 24, 6, 'F');
      doc.text(itemType, 28, y, { align: 'center' });

      doc.setTextColor(150, 150, 150);
      doc.text(item.time || '00:00', pageWidth - 16, y, { align: 'right' });
      y += 8;

      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'italic');
      const splitQ = doc.splitTextToSize(`"${item.quote || ''}"`, pageWidth - 36);
      doc.text(splitQ, 20, y);
      y += splitQ.length * 4 + 4;

      if (item.tags?.length) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Tags: ${item.tags.join(', ')}`, 20, y);
        y += 7;
      }
      y += 4;
    }
  }

  // ── KPI Connections ──────────────────────────────────────────────────────────
  if (kpis.length > 0) {
    checkPage(20);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('KPI Connections', 16, y);
    y += 8;

    autoTable(doc, {
      startY: y,
      head: [['Metric', 'Value', 'Status']],
      body: kpis.map(k => [k.label || '', k.value || '', k.status || '']),
      theme: 'striped',
      headStyles: { fillColor: [137, 77, 0] },
      margin: { left: 16, right: 16 },
      styles: { fontSize: 9 },
    });

    y = doc.lastAutoTable.finalY + 14;
  }

  // ── Gap Analysis ─────────────────────────────────────────────────────────────
  if (gaps.length > 0) {
    checkPage(20);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Gap Analysis', 16, y);
    y += 10;

    gaps.forEach((gap, i) => {
      checkPage(25);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(gap.type === 'Critical' ? 186 : 63, gap.type === 'Critical' ? 26 : 81, gap.type === 'Critical' ? 26 : 181);
      doc.text(`${i + 1}. ${gap.title || 'Gap'}`, 20, y);
      y += 6;
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const splitDesc = doc.splitTextToSize(gap.desc || gap.description || '', pageWidth - 40);
      doc.text(splitDesc, 20, y);
      y += splitDesc.length * 4 + 8;
    });
  }

  // ── Follow-up Questions ──────────────────────────────────────────────────────
  if (questions.length > 0) {
    checkPage(20);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Follow-up Questions', 16, y);
    y += 10;

    questions.forEach((q, i) => {
      checkPage(15);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const splitQ = doc.splitTextToSize(`${i + 1}. ${typeof q === 'string' ? q : ''}`, pageWidth - 36);
      doc.text(splitQ, 20, y);
      y += splitQ.length * 5 + 4;
    });
  }

  // ── Page footers ─────────────────────────────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
    doc.text('Trinethra — AI-Powered Interview Analysis', pageWidth - 16, pageHeight - 8, { align: 'right' });
  }

  const filename = `${fellowName.replace(/\s+/g, '_')}_Analysis_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
  return true;
};
