import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../../../components/common/Button';

const AddImportTemplate = ({ isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [templateName, setTemplateName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFields, setUploadedFields] = useState([]);
  const [fieldMappings, setFieldMappings] = useState({});

  const existingFields = [
    { id: 'sno', label: 'Sno', required: true },
    { id: 'name', label: 'Name', required: true },
    { id: 'mobileNumber', label: 'Mobile Number', required: true },
    { id: 'emailId', label: 'Email Id', required: true },
    { id: 'source', label: 'Source', required: true },
    { id: 'medium', label: 'Medium', required: true },
    { id: 'campaign', label: 'Campaign', required: true },
    { id: 'countryCode', label: 'Country Code', required: true },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Simulate extracting fields from uploaded file
      // In real implementation, you would parse the file
      setUploadedFields([
        'Sno',
        'PersonName',
        'MobileNo',
        'EmailID',
        'SourceName',
        'MediumName',
        'CampaignName',
        'CountryCode',
      ]);
    }
  };

  const handleFieldMapping = (existingFieldId, mapping) => {
    setFieldMappings((prev) => ({
      ...prev,
      [existingFieldId]: mapping,
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    const templateData = {
      name: templateName,
      file: selectedFile,
      mappings: fieldMappings,
    };
    onSubmit(templateData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Add Import Template</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Steps Header */}
        <div className="px-6 py-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-around max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${
                  currentStep === 1
                    ? 'bg-blue-500 text-white'
                    : currentStep > 1
                    ? 'bg-gray-300 text-gray-700'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                1
              </div>
              <span
                className={`text-sm font-medium ${
                  currentStep === 1 ? 'text-blue-500' : 'text-gray-600'
                }`}
              >
                Template Name
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${
                  currentStep === 2
                    ? 'bg-blue-500 text-white'
                    : currentStep > 2
                    ? 'bg-gray-300 text-gray-700'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                2
              </div>
              <span
                className={`text-sm font-medium ${
                  currentStep === 2 ? 'text-blue-500' : 'text-gray-600'
                }`}
              >
                Map Fields
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${
                  currentStep === 3
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                3
              </div>
              <span
                className={`text-sm font-medium ${
                  currentStep === 3 ? 'text-blue-500' : 'text-gray-600'
                }`}
              >
                Review and complete
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8 min-h-[400px]">
          {/* Step 1: Template Name */}
          {currentStep === 1 && (
            <div className="w-full">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Enter Template name"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File with fields
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".xlsx,.xls,.csv"
                    className="flex-1 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:text-sm file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-50"
                  />
                  <button className="px-6 py-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600 transition">
                    Upload
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Map Fields */}
          {currentStep === 2 && (
            <div className="max-w-6xl">
              <div className="grid grid-cols-3 gap-4 mb-4 font-semibold text-sm text-gray-700">
                <div>Existing Field</div>
                <div>Uploaded Field</div>
                <div></div>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {existingFields.map((field) => (
                  <div key={field.id} className="grid grid-cols-3 gap-4 items-center">
                    {/* Existing Field */}
                    <div>
                      <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option>{field.label}</option>
                      </select>
                    </div>

                    {/* Radio Buttons */}
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`mapping-${field.id}`}
                          checked={fieldMappings[field.id]?.type === 'imported'}
                          onChange={() =>
                            handleFieldMapping(field.id, { type: 'imported', value: '' })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">From Imported File</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`mapping-${field.id}`}
                          checked={fieldMappings[field.id]?.type === 'other'}
                          onChange={() =>
                            handleFieldMapping(field.id, { type: 'other', value: '' })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">Other</span>
                      </label>
                    </div>

                    {/* Uploaded Field Dropdown */}
                    <div>
                      <select
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-500"
                        value={fieldMappings[field.id]?.value || ''}
                        onChange={(e) =>
                          handleFieldMapping(field.id, {
                            ...fieldMappings[field.id],
                            value: e.target.value,
                          })
                        }
                      >
                        <option value="">
                          {uploadedFields.length > 0 ? 'select field name' : 'Nothing selected'}
                        </option>
                        {uploadedFields.map((uploadedField, idx) => (
                          <option key={idx} value={uploadedField}>
                            {uploadedField}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-right">
                <button className="text-blue-500 text-sm font-medium hover:underline">
                  Add more Fields
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review and Complete */}
          {currentStep === 3 && (
            <div className="w-full">
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 bg-gray-100 px-4 py-2 rounded">
                  Template Name
                </h3>
                <div className="px-4">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-700">Name:</span>
                    <span className="text-gray-600">{templateName || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 bg-gray-100 px-4 py-2 rounded">
                  Map Fields
                </h3>
                <div className="px-4">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {existingFields.map((field) => (
                      <div key={field.id} className="flex items-center justify-between">
                        <span className="font-semibold text-gray-700">{field.label}</span>
                        <span className="text-gray-600">
                          {fieldMappings[field.id]?.value || 'Not Mapped'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div>
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
              >
                Previous
              </button>
            )}
          </div>
          <div>
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                disabled={currentStep === 1 && !templateName}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === 1 ? 'Proceed' : 'Next'}
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-6 py-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600 transition"
              >
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddImportTemplate;
