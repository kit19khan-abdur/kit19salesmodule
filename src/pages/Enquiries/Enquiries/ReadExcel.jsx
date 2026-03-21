import { useState } from "react";

// Utility: read an Excel File object and return parsed JSON rows
export async function readExcelFromFile(file) {
  if (!file) return [];

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsArrayBuffer(file);

    reader.onload = async (event) => {
      try {
        const xlsxModule = await import('xlsx').catch(err => {
          console.error('xlsx module not available:', err);
          return null;
        });

        if (!xlsxModule) {
          const msg = 'xlsx library is required to read Excel files. Install it with: npm install xlsx';
          console.error(msg);
          resolve([]);
          return;
        }

        const XLSX = xlsxModule.default || xlsxModule;

        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        let jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        // Remove Empty Rows
        jsonData = jsonData.filter(row =>
          Object.values(row).some(value =>
            value !== null && value.toString().trim() !== ""
          )
        );

        console.log(jsonData);
        resolve(jsonData);
        
      } catch (err) {
        console.error('Error reading excel file:', err);
        resolve([]);
      }
    };

    reader.onerror = (err) => {
      reject(err);
    };
  });
}

// React component wrapper that uses the utility and displays JSON (keeps existing behavior)
function ReadExcel() {
  const [excelData, setExcelData] = useState([]);

  const functionToReadDataFromExcel = async (e) => {
    const file = e.target.files[0];
    const data = await readExcelFromFile(file);
    setExcelData(data || []);
  };

  return (
    <div>
      <input type="file" accept=".xlsx,.xls" onChange={functionToReadDataFromExcel} />
      <pre>{JSON.stringify(excelData, null, 2)}</pre>
    </div>
  );
}

export default ReadExcel;