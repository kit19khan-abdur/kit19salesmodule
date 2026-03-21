import jsPDF from "jspdf";
import "jspdf-autotable";

export function exportDetailsToPDF(details) {
  if (!details || !Array.isArray(details) || details.length === 0) {
    alert("No data to export");
    return;
  }
  const doc = new jsPDF();
  const columns = Object.keys(details[0]);
  const rows = details.map(row => columns.map(col => row[col]));
  doc.autoTable({
    head: [columns],
    body: rows,
    styles: { fontSize: 8 }
  });
  doc.save("Details.pdf");
}
