import React, { useState } from 'react';
import RichTextEditor from '../../../components/common/RichTextEditor';
import { Grid3x3 } from 'lucide-react';
import RichTextEditorArea from '../../../components/common/RichTextEditorArea';

const InternalSMSForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    senderId: '',
    message: '',
    urlTrack: false,
    scheduleUpdate: false,
  });

  const [isUnicode, setIsUnicode] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Check if message contains unicode characters
    if (name === 'message') {
      const hasUnicode = /[^\x00-\x7F]/.test(value);
      setIsUnicode(hasUnicode);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        ...formData,
        isUnicode,
      });
    }
  };

  const handleInsertPlaceholder = () => {
    // Logic to insert placeholder - can be expanded with a dropdown/modal
    console.log('Insert placeholder clicked');
  };

  return (
    <div className="bg-white">
      {/* Warning Note */}
      <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded">
        <p className="text-sm font-semibold text-gray-800">
          <span className="font-bold">Note:</span> Your wallet balance should be at least 1.5 times of the estimated batch cost to perform this action
        </p>
      </div>

      {/* SenderID */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-800 mb-2">
          SenderID
        </label>
        <input
          type="text"
          name="senderId"
          value={formData.senderId}
          onChange={handleInputChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Compose SMS */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-800 mb-2">
          Compose SMS
        </label>
        <RichTextEditorArea
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Message"
          rows="6"
        />
        {/* <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-500">
            {formData.message.length} / 2000
          </span>
        </div> */}
      </div>

      {/* Insert Placeholder */}
      <div className="mb-4">
        <button
          type="button"
          onClick={handleInsertPlaceholder}
          className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 transition"
        >
          <Grid3x3 className="w-5 h-5" />
          Click Icon to Insert Placeholder
        </button>
      </div>

      {/* IsUnicode */}
      <div className="mb-6">
        <p className="text-sm text-gray-800">
          <span className="font-semibold">IsUnicode:</span> {isUnicode ? 'True' : 'False'}
        </p>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="urlTrack"
            name="urlTrack"
            checked={formData.urlTrack}
            onChange={handleInputChange}
            className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="urlTrack" className="text-sm font-medium text-gray-800">
            UrlTrack
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="scheduleInternationalSMS"
            name="scheduleUpdate"
            checked={formData.scheduleUpdate}
            onChange={handleInputChange}
            className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="scheduleInternationalSMS" className="text-sm font-medium text-gray-800">
            On Schedule Date And Time
          </label>
        </div>
      </div>
    </div>
  );
};

export default InternalSMSForm;
