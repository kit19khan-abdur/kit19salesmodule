import React, { useState, useEffect } from 'react';

import { ChevronLeft } from 'lucide-react';
import { getSession } from '../../getSession';

const SendPDFForm = ({ onClose, enquiryId, parentId = 0 }) => {
  const { userId, TokenId } = getSession();
  const [title, setTitle] = useState('');
  const [columns, setColumns] = useState([]); // Will be populated from API
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState({
    TimeStamp: false,
    Created_By: false,
    PageNo: false,
  });

   const[EnquiryIDInUse] = useState(enquiryId || 0); 
 // Fetch column preferences from API on mount
  useEffect(() => {
    const fetchPreferenceCol = async () => {
      const payload = {
        Token: TokenId,
        Details: {
          UserID: userId
        }
      };
      try {
        const response = await fetch('https://services.kit19.com/UserCRM/GetPreferenceCol', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.Status === 1 && Array.isArray(data.Details) && data.Details.length > 0) {
          // Example: ["Preference_Title,TimeStamp,Created_By,PageNo,Column1,Column2"]
          const parts = data.Details[0].split(',').map(s => s.trim());
          if (parts.length > 0) {
            setTitle(parts[0]); // First value is title
            const allPrefs = parts.slice(1); // Rest are checkboxes
            setAdditionalInfo({
              TimeStamp: allPrefs.includes('TimeStamp'),
              Created_By: allPrefs.includes('Created_By'),
              PageNo: allPrefs.includes('PageNo'),
            });
            const colList = allPrefs.filter(
              c => !['TimeStamp', 'Created_By', 'PageNo'].includes(c)
            ).map(name => ({ name }));
            setColumns(colList);
            setSelectedColumns(colList.map(col => col.name));
            setSelectAll(colList.length > 0);
          }
        }
      } catch (error) {
        console.error('Error fetching preference columns:', error);
      }
    };
    fetchPreferenceCol();
  }, [TokenId, userId]);

  // Handle additional info checkboxes
  const handleAdditionalInfoChange = (e) => {
    const { value, checked } = e.target;
    setAdditionalInfo((prev) => ({ ...prev, [value]: checked }));
  };

  // Handle column selection
  const handleColumnChange = (col) => {
    setSelectedColumns((prev) =>
      prev.includes(col)
        ? prev.filter((c) => c !== col)
        : [...prev, col]
    );
  };

  // Handle select all
  const handleSelectAll = (e) => {
    setSelectAll(e.target.checked);
    setSelectedColumns(e.target.checked ? columns.map((c) => c.name) : []);
  };

  // Save Setting logic (converted from jQuery)
  const saveEnquirySetting = async () => {
    // 1️⃣ Get Title
    const trimmedTitle = title.trim();
    // 2️⃣ Get UserID
    // userId from getSession
    // 3️⃣ Get Checked Checkboxes (selectedColumns)
    const selectedValues = selectedColumns;
    let sessionValues = getSession(); 
    // =========================
    // ✅ VALIDATION
    // =========================
    if (trimmedTitle === "") {
      window.alert("Please enter preference title");
      return;
    }
    if (selectedValues.length === 0 && Object.values(additionalInfo).every((v) => v === false)) {
      window.alert("Please select at least one column");
      return;
    }
    if (!userId || isNaN(userId)) {
      window.alert("Invalid User ID");
      return;
    }
    // =========================
    // ✅ Convert to Comma String
    // =========================
    const pdfColData =  Object.keys(additionalInfo).filter(key => additionalInfo[key]).join(",") + (selectedValues.length > 0 ? "," + selectedValues.join(",") : "");
    // =========================
    // ✅ Prepare API Object
    // =========================
    const requestData = {
      Token: sessionValues.TokenId,
      Details: {
        PreferenceTitle: trimmedTitle,
        PDFColData: pdfColData,
        UserID: parseInt(sessionValues.userId)
      }
    };
    // =========================
    // ✅ AJAX API Call
    // =========================
    try {
      const response = await fetch("http://localhost:62194/UserCRM/SaveEnquiryPDFPreference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      });
      const data = await response.json();
      if (data.Status === 1) {
        window.alert("Saved Successfully");
      } else {
        window.alert(data.Message || "Save failed");
      }
    } catch (error) {
      window.alert("Something went wrong");
      console.error(error);
    }
  };

  // PDF generation handler
  const handleGeneratePDF = async () => {
    // Prepare selected columns (including additional info)
    const selected = [
      ...Object.entries(additionalInfo)
        .filter(([key, val]) => val)
        .map(([key]) => key),
      ...selectedColumns
    ];
    if (selected.length === 0) {
      window.alert('Please select at least one column');
      return;
    }
    // Bind EnquiryID and ParentID from props

    let lesSessionValues = getSession();
    const details = {
      SelectedColumns: selected.join(','),
      EnquiryID: EnquiryIDInUse,
      ParentID: lesSessionValues.parentId
    };
    const payload = {
      Token: lesSessionValues.TokenId,
      Details: details
    };
    try {
  const response = await fetch('http://localhost:62194/UserCRM/GetEnquiryDetailsPdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.Status === 1 && data.Details) {
        // If Details is a datatable (array of objects), export as PDF (raw JSON, no formatting)
        if (Array.isArray(data.Details)) {
          // Create a PDF with raw JSON string
          const jsPDF = (await import('jspdf')).default;
          const doc = new jsPDF();
          const jsonString = JSON.stringify(data.Details, null, 2);
          const lines = doc.splitTextToSize(jsonString, 180);
          doc.text(lines, 10, 10);
          doc.save('Details.pdf');
          return;
        }
        // Otherwise, handle as before (base64 PDF)
        let pdfBase64 = '';
        if (typeof data.Details === 'string') {
          pdfBase64 = data.Details;
        } else if (typeof data.Details === 'object' && data.Details !== null) {
          pdfBase64 = data.Details?.[0] || data.Details.pdfData || data.Details.base64 || '';
        }
        if (!pdfBase64) {
          window.alert('PDF data not found in response');
          return;
        }
        const pdfWindow = window.open();
        pdfWindow.document.write(
          '<iframe width="100%" height="100%" src="data:application/pdf;base64,' + pdfBase64 + '"></iframe>'
        );
      } else {
        window.alert(data.Message || 'Failed to generate PDF');
      }
    } catch (error) {
      window.alert('Something went wrong: ' + error.message);
      console.error(error);
    }
  };

  return (
    <div id="createPDFOverlay" className="myOverlays" style={{ background: '#fff', minHeight: '100vh', padding: 24 }}>
      <div className="sidenavlead add_task_cont" style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        {/* Header row: Back to Enquiry + Additional Info */}
        <div className="width100 fl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px 8px 24px', borderBottom: '1px solid #eee' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button className="closeOverlaybtn" onClick={onClose} style={{ background: 'none', border: 'none', color: '#4CAF50', fontSize: 22, marginRight: 8 }}>
              <ChevronLeft size={22} style={{ verticalAlign: 'middle' }} />
            </button>
            <span className="textt-success" style={{ color: '#4CAF50', fontWeight: 600, fontSize: 18 }}>Back to Enquiry</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontWeight: 600, fontSize: 15 }}>Additional Information</span>
            <label className="cont-checkbox" style={{ marginRight: 8 }}>
              Time Stamp
              <input
                type="checkbox"
                name="checkboxestop"
                value="TimeStamp"
                checked={additionalInfo.TimeStamp}
                onChange={handleAdditionalInfoChange}
                style={{ marginLeft: 4 }}
              />
              <span className="checkmark"></span>
            </label>
            <label className="cont-checkbox" style={{ marginRight: 8 }}>
              Created By
              <input
                type="checkbox"
                name="checkboxestop"
                value="Created_By"
                checked={additionalInfo.Created_By}
                onChange={handleAdditionalInfoChange}
                style={{ marginLeft: 4 }}
              />
              <span className="checkmark"></span>
            </label>
            <label className="cont-checkbox">
              Page No.
              <input
                type="checkbox"
                name="checkboxestop"
                value="PageNo"
                checked={additionalInfo.PageNo}
                onChange={handleAdditionalInfoChange}
                style={{ marginLeft: 4 }}
              />
              <span className="checkmark"></span>
            </label>
          </div>
        </div>
        {/* Panel */}
        <div className="row" style={{ padding: '24px' }}>
          <div className="col-sm-12">
            <div className="panel panel-default border-radius-0 shadow" style={{ borderRadius: 8, border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div className="panel-heading px-30" style={{ padding: '16px 24px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ margin: 0, fontWeight: 600, fontSize: 17 }}>Select Title & Column</h4>
                <button className="btn btn-secondary" style={{ minWidth: 120, fontWeight: 500 }} onClick={saveEnquirySetting}>Save Setting</button>
              </div>
              <div className="panel-body" style={{ height: 'calc(100vh - 210px)', overflow: 'auto', padding: '24px' }}>
                <div className="form-group" style={{ marginBottom: 24 }}>
                  <label style={{ fontWeight: 500 }}>Title</label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="form-control"
                    placeholder="Enter Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ marginTop: 8, fontSize: 15, borderRadius: 4 }}
                  />
                </div>
                <div className="table-responsive pb-0">
                  <table className="table table-bordered table-hover" id="leadDetailsTable" style={{ border: '1px solid #ddd', borderRadius: 4 }}>
                    <thead>
                      <tr style={{ background: '#f7f7f7' }}>
                        <th style={{ fontWeight: 700, fontSize: 15, padding: '10px 16px' }}>COLUMN NAME</th>
                        <th style={{ fontWeight: 700, fontSize: 15, padding: '10px 16px', textAlign: 'center' }}>
                          <label className="cont-checkbox" style={{ fontWeight: 500 }}>
                            <input
                              type="checkbox"
                              id="selectAllCheckbox"
                              checked={selectAll}
                              onChange={handleSelectAll}
                              style={{ marginRight: 6 }}
                            />
                            SELECT ALL
                            <span className="checkmark"></span>
                          </label>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {columns.length === 0 ? (
                        <tr>
                          <td colSpan={2} style={{ textAlign: 'center', color: '#888', padding: 24 }}>No columns available</td>
                        </tr>
                      ) : (
                        columns.map((col) => (
                          <tr key={col.name}>
                            <td style={{ padding: '10px 16px', fontSize: 15 }}>{col.name}</td>
                            <td style={{ textAlign: 'center' }}>
                              <label className="cont-checkbox">
                                <input
                                  type="checkbox"
                                  checked={selectedColumns.includes(col.name)}
                                  onChange={() => handleColumnChange(col.name)}
                                  style={{ marginRight: 6 }}
                                />
                                <span className="checkmark"></span>
                              </label>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="panel-footer" style={{ padding: '16px 24px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                {/* HiddenField replaced with prop */}
                <input type="hidden" value={enquiryId} />
                <button
                  type="button"
                  className="btn btn-primary pull-right"
                  id="btnSave"
                  style={{ minWidth: 120, fontWeight: 500 }}
                  onClick={handleGeneratePDF}
                >
                  <i className="fa fa-download font18 mr-10"></i>PDF
                </button>
                {/* Optionally, add a button to export last Details as PDF if available */}
                {/*
                <button
                  type="button"
                  className="btn btn-secondary pull-right"
                  style={{ minWidth: 120, fontWeight: 500 }}
                  onClick={() => exportDetailsToPDF(lastDetails)}
                >
                  Export Table as PDF
                </button>
                */}
                <button type="button" className="cancelMergeLead btn cancel-btn" style={{ minWidth: 100 }} onClick={onClose}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendPDFForm;
