import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Download, Check, ChevronDown, ChevronUp } from 'lucide-react';
import AddImportTemplate from '../../pages/Enquiries/Forms/AddImportTemplate';
import { serviceInstance } from '../../axiosinstance';
import { getSession } from '../../getSession';
import { readExcelFromFile } from '../../pages/Enquiries/Enquiries/ReadExcel';
import toast from 'react-hot-toast';

const ImportData = ({ isOpen, onClose, onSubmit }) => {
  const [importMode, setImportMode] = useState('bulk-import');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFields, setSelectedFields] = useState([]);
  const [isFieldDropdownOpen, setIsFieldDropdownOpen] = useState(false);
  const [fieldSearchTerm, setFieldSearchTerm] = useState('');
  const [isAddTemplateModalOpen, setIsAddTemplateModalOpen] = useState(false);
  const [isInstructionCollapsed, setIsInstructionCollapsed] = useState(false);

  const [mappingOptions, setMappingOptions] = useState([]);
  const [isLoadingMappings, setIsLoadingMappings] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  // fallback templates if API returns nothing
  const templatesFallback = [
    { value: 'predefined', label: 'PredefinedField' },
    { value: 'custom', label: 'Custom Template' },
  ];

  // Fetch predefined mappings for import templates
  useEffect(() => {
    const fetchMappings = async () => {
      try {
        setIsLoadingMappings(true);
        const session = getSession();

        const requestData = {
          Token: session.token,
          Details: JSON.stringify({ ParentId: session.parentId })
        };

        const response = await serviceInstance.post('http://localhost:62194/UserCRM/GetEnquiryPredefinedMappings', requestData);

        if (response?.data?.Status === 1) {
          const details = response.data.Details || [];
          console.log('Enquiry predefined mappings response:', details);
          // map to { value, label }
          const mapped = details.map((m) => ({
            value: m.MappingId || m.Id || m.Code || m.MappingID,
            label: m.MappingName || m.Text || m.Name || m.Mapping_Name || 'Unknown',
          }));

          setMappingOptions(mapped);
        } else if (response?.data?.Status === -1) {
          console.error('Invalid token while fetching mappings');
        } else {
          console.error('Failed to fetch mappings:', response?.data?.Message);
        }
      } catch (err) {
        console.error('Error fetching mappings:', err);
      } finally {
        setIsLoadingMappings(false);
      }
    };

    fetchMappings();
  }, []);

  const bulkUpdateFields = [
    { value: 'PersonName', label: 'PersonName' },
    { value: 'CompanyName', label: 'CompanyName' },
    { value: 'City', label: 'City' },
    { value: 'State', label: 'State' },
    { value: 'Country', label: 'Country' },
    { value: 'PinCode', label: 'PinCode' },
  ];

  const filteredFields = bulkUpdateFields.filter((field) =>
    field.label.toLowerCase().includes(fieldSearchTerm.toLowerCase())
  );

  const handleFieldToggle = (fieldValue) => {
    setSelectedFields((prev) =>
      prev.includes(fieldValue)
        ? prev.filter((f) => f !== fieldValue)
        : [...prev, fieldValue]
    );
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    try {
      if (!selectedFile) {
        toast.error('Please select a file first');
        return;
      }

      const session = getSession();

      // Parse the file using the shared utility
      const rows = await readExcelFromFile(selectedFile);
      console.log('Parsed rows from Excel:', rows);

      // Build EnquiryImportBO
      const importBo = {
        JsonImportData: JSON.stringify(rows || []),
        UserId: session.userId || 0,
        RowCount: (rows && rows.length) || 0,
        FileName: selectedFile.name || '',
        IsUpdate: false,
        AutoLeadDistribution: false,
        SelectedValue: parseInt(selectedTemplate, 10) || 0
      };

      const payload = {
        Token: session.token,
        Details: JSON.stringify(importBo)
      };

      const resp = await serviceInstance.post('http://localhost:62194/UserCRM/ImportEnquiry', payload);
      console.log('ImportEnquiry response:', resp?.data);

      if (resp?.data?.Status === 1) {
        toast.success(resp.data.Message || 'Import started successfully');
        // call parent submit handler if provided
        if (typeof onSubmit === 'function') onSubmit(resp.data);
        if (typeof onClose === 'function') onClose();
      } else if (resp?.data?.Status === -1) {
        toast.error('Invalid token. Please login again.');
      } else {
        toast.error(resp?.data?.Message || 'Import failed');
      }
    } catch (err) {
      console.error('Error during import upload:', err);
      toast.error('Failed to import the file');
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      setIsDownloadingTemplate(true);
      const session = getSession();
      if (!session?.parentId) {
        toast.error('Unable to download template: missing session info');
        setIsDownloadingTemplate(false);
        return;
      }

      const response = await serviceInstance.get(`http://localhost:62194//UserCRM/DownloadImportTemplate/${session.parentId}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: response.data.type || 'application/octet-stream' });

      let filename = 'import_template.xlsx';
      const contentDisposition = response.headers && (response.headers['content-disposition'] || response.headers['Content-Disposition']);
      if (contentDisposition) {
        const match = /filename\*=UTF-8''(.+)$/.exec(contentDisposition) || /filename="?([^";]+)"?/.exec(contentDisposition);
        if (match && match[1]) {
          filename = decodeURIComponent(match[1]);
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Template download started');
    } catch (err) {
      console.error('Error downloading template:', err);
      toast.error('Failed to download template');
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  const handleTemplateSubmit = (templateData) => {
    console.log('Template created:', templateData);
    // Add template to the templates list
    setIsAddTemplateModalOpen(false);
    alert('Template created successfully!');
  };

  const getSelectedFieldsDisplay = () => {
    if (selectedFields.length === 0) return 'Nothing selected';
    return selectedFields
      .map((value) => bulkUpdateFields.find((f) => f.value === value)?.label)
      .join(', ');
  };

  return (
    <div className="w-full">
      {/* Radio Buttons */}
      <div className="flex items-center gap-6 mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="importMode"
            value="bulk-import"
            checked={importMode === 'bulk-import'}
            onChange={(e) => setImportMode(e.target.value)}
            className="w-4 h-4 text-blue-500"
          />
          <span className="text-sm font-medium text-gray-800">Bulk Import</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="importMode"
            value="bulk-update"
            checked={importMode === 'bulk-update'}
            onChange={(e) => setImportMode(e.target.value)}
            className="w-4 h-4 text-blue-500"
          />
          <span className="text-sm font-medium text-gray-800">Bulk Update</span>
        </label>
      </div>

      {/* Template/Field Selection Section */}
      <div className="mb-6">
        {importMode === 'bulk-import' ? (
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Import Template :
            </label>
            <div className="flex-1 flex items-center gap-2">
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isLoadingMappings}
              >
                <option value="">
                  {isLoadingMappings ? 'Loading mappings...' : 'PredefinedField'}
                </option>
                {(mappingOptions.length > 0 ? mappingOptions : templatesFallback).map((template) => (
                  <option key={template.value} value={template.value}>
                    {template.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setIsAddTemplateModalOpen(true)}
                className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                title="Add Template"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
              <button
                className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={handleDownloadTemplate}
                disabled={isDownloadingTemplate}
                className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download Template"
              >
                <Download className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <div
                onClick={() => setIsFieldDropdownOpen(!isFieldDropdownOpen)}
                className="px-3 py-2 text-sm border border-gray-300 rounded cursor-pointer bg-white hover:border-gray-400 transition text-gray-700"
              >
                {getSelectedFieldsDisplay()}
              </div>

              {isFieldDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-64 overflow-auto">
                  {/* Search Input */}
                  <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                    <input
                      type="text"
                      value={fieldSearchTerm}
                      onChange={(e) => setFieldSearchTerm(e.target.value)}
                      placeholder="Search fields..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Field Options */}
                  <div>
                    {filteredFields.map((field) => (
                      <div
                        key={field.value}
                        onClick={() => handleFieldToggle(field.value)}
                        className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between transition ${
                          selectedFields.includes(field.value)
                            ? 'bg-blue-400 text-white hover:bg-blue-500'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span>{field.label}</span>
                        {selectedFields.includes(field.value) && (
                          <Check className="w-4 h-4" />
                        )}
                      </div>
                    ))}
                    {filteredFields.length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        No fields found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleDownloadTemplate}
              disabled={isDownloadingTemplate}
              className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600 transition whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloadingTemplate ? 'Downloading...' : 'Download Template'}
            </button>
          </div>
        )}
      </div>

      {/* File Selection */}
      <div className="flex items-center gap-3 mb-6">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Select file :
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".xlsx,.xls,.csv"
          className="flex-1 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
        />
        <button
          onClick={handleUpload}
          className="px-6 py-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600 transition"
        >
          Upload
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-orange-50 border border-orange-200 rounded p-4">
        <div 
          className="flex items-start gap-2 mb-3 cursor-pointer"
          onClick={() => setIsInstructionCollapsed(!isInstructionCollapsed)}
        >
          <div className="w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <h3 className="text-sm font-semibold text-orange-800 flex-1">Instruction</h3>
          {isInstructionCollapsed ? (
            <ChevronDown className="w-5 h-5 text-orange-600" />
          ) : (
            <ChevronUp className="w-5 h-5 text-orange-600" />
          )}
        </div>
        {!isInstructionCollapsed && (
          <div className="space-y-2 text-sm text-orange-700">
          {importMode === 'bulk-import' ? (
            <>
              <div className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">☛</span>
                <p>
                  If any discrepancy is found in no. of records uploaded then, please try
                  saving file in proprietary Microsoft Excel Format & try again. If problem
                  persists then please contact Kit19 support.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">☛</span>
                <p>Name of the field should be in same sequence as in sample format.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">☛</span>
                <p>1st row of excel file will be considered as a header row.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">☛</span>
                <p>Keep Sno. Column values sequential</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">☛</span>
                <p>
                  Always enter matching CountryCode against entered MobileNo in corresponding
                  CountryCode Column
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">☛</span>
                <p>Always enter in each row either MobileNo/EmailID or Both</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">☛</span>
                <p>Please keep Date Format as DD-MMM-YYYY e.g. 03-Apr-2006</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">☛</span>
                <p>
                  Please ensure that Custom Field Names contains Alphabets[A-Z], Numbers[0-9]
                  or Underscore[_] only. No special characters other than Underscore[_] is
                  allowed.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">☛</span>
                <p>Please ensure maximum 10000 records in sheet.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">☛</span>
                <p>
                  Please specify which Column (i.e MobileNo/MobileNo1/MobileNo2) contains
                  WhatsApp No for the column WhatsAppNoColName as value.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">☛</span>
                <button
                  id="lnkImportTemplate"
                  type="button"
                  className="text-blue-600 hover:underline font-medium bg-transparent p-0"
                  onClick={() => handleDownloadTemplate()}
                >
                  Download Import Template
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">☛</span>
                <p>
                  If any discrepancy is found in no. of records uploaded, then please try
                  saving file in proprietary Microsoft Excel Format & try again. If problem
                  persists then please contact Kit19 support.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">☛</span>
                <p>Name of the field should be in the sequence as follows as in sample</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">☛</span>
                <p>1st row of excel file will be considered as a header row.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">☛</span>
                <p>Keep Sno. Column values sequential</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">☛</span>
                <p>
                  Always enter matching CountryCode against entered MobileNo in corresponding
                  CountryCode Column
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">☛</span>
                <p>Always enter in each row either EnquiryID</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">☛</span>
                <p>Please keep Date Format as DD-MMM-YYYY e.g. 03-Apr-2005</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">☛</span>
                <p>
                  Please ensure that all Products are already entered else those rows will not
                  be Uploaded.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">☛</span>
                <p>
                  Please ensure that Custom Field Names contains Alphabets[A-Z], Numbers[0-9]
                  or Underscore[_] only. No special characters other than Underscore[_] is
                  allowed.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">☛</span>
                <p>Please ensure maximum 100 records in sheet.</p>
              </div>
            </>
          )}
        </div>
        )}
      </div>

      {/* Add Import Template Modal */}
      <AddImportTemplate
        isOpen={isAddTemplateModalOpen}
        onClose={() => setIsAddTemplateModalOpen(false)}
        onSubmit={handleTemplateSubmit}
      />
    </div>
  );
};

export default ImportData;
