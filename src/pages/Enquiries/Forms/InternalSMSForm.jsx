import React, { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import RichTextEditor from '../../../components/common/RichTextEditor';
import { Grid3x3, Calendar } from 'lucide-react';
import RichTextEditorArea from '../../../components/common/RichTextEditorArea';
import { serviceInstance } from '../../../axiosinstance';
import { getSession } from '../../../getSession';

const InternalSMSForm = forwardRef(({ onClose, onSubmit }, ref) => {
  const [formData, setFormData] = useState({
    senderId: '',
    message: '',
    urlTrack: false,
    urlInput: '',
    scheduleUpdate: false,
    scheduleDateTime: '',
  });

  const [isUnicode, setIsUnicode] = useState(false);
  const [errors, setErrors] = useState({});
  const dateTimeInputRef = useRef(null);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field
    setErrors(prev => {
      if (prev[name]) {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
      return prev;
    });

    // Check if message contains unicode characters
    if (name === 'message') {
      const hasUnicode = /[^\x00-\x7F]/.test(value);
      setIsUnicode(hasUnicode);
    }
  }, []);

  const handleMessageChange = useCallback((e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      message: value,
    }));

    // Clear error for message field
    setErrors(prev => {
      if (prev.message) {
        const newErrors = { ...prev };
        delete newErrors.message;
        return newErrors;
      }
      return prev;
    });

    // Check if message contains unicode characters
    const hasUnicode = /[^\x00-\x7F]/.test(value);
    setIsUnicode(hasUnicode);
  }, []);

  // Format datetime-local (yyyy-MM-ddTHH:mm) to dd-MMM-yyyy hh:MM:ss
  const formatScheduledDate = (datetimeLocal) => {
    if (!datetimeLocal) return '';
    try {
      const [datePart, timePart] = datetimeLocal.split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      const [hour, minute] = (timePart || '').split(':').map(Number);
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const dd = String(day).padStart(2, '0');
      const MMM = months[(month || 1) - 1] || '';
      const yyyy = String(year);
      const hh = String(hour).padStart(2, '0');
      const MM = String(minute).padStart(2, '0');
      const ss = '00';
      return `${dd}-${MMM}-${yyyy} ${hh}:${MM}:${ss}`;
    } catch (e) {
      return '';
    }
  };

  const getLocalDateTimeLocal = () => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const HH = pad(d.getHours());
    const MIN = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${HH}:${MIN}`;
  };

  const parseFormattedToLocal = (formatted) => {
    if (!formatted) return '';
    try {
      const [datePart, timePart] = formatted.split(' ');
      if (!datePart || !timePart) return '';
      const [dd, MMM, yyyy] = datePart.split('-');
      const [hh, MM, ss] = timePart.split(':');
      const months = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
      const mm = months[MMM] || '01';
      const day = String(dd).padStart(2, '0');
      const hour = String(hh).padStart(2, '0');
      const minute = String(MM).padStart(2, '0');
      return `${yyyy}-${mm}-${day}T${hour}:${minute}`;
    } catch (e) {
      return '';
    }
  };

  const handlePickerChange = useCallback((e) => {
    const val = e.target.value;
    if (!val) return;
    const formatted = formatScheduledDate(val);
    setFormData(prev => ({ ...prev, scheduleDateTime: formatted }));
  }, []);

  const handleCalendarIconClick = useCallback(() => {
    if (dateTimeInputRef.current) {
      if (typeof dateTimeInputRef.current.showPicker === 'function') {
        dateTimeInputRef.current.showPicker();
      } else {
        dateTimeInputRef.current.click();
      }
    }
  }, []);

  const openPicker = useCallback(() => {
    if (dateTimeInputRef.current) {
      if (typeof dateTimeInputRef.current.showPicker === 'function') {
        dateTimeInputRef.current.showPicker();
      } else {
        dateTimeInputRef.current.click();
      }
    }
  }, []);

  useEffect(() => {
    if (formData.scheduleUpdate && !formData.scheduleDateTime) {
      const formattedNow = formatScheduledDate(getLocalDateTimeLocal());
      setFormData(prev => ({ ...prev, scheduleDateTime: formattedNow }));
    }
  }, [formData.scheduleUpdate]);

  const validateForm = async () => {
    const newErrors = {};

    // Validate sender ID
    if (!formData.senderId.trim()) {
      newErrors.senderId = "Sender ID cannot be empty.";
    }

    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = "Please enter a Message.";
    }

    // If UrlTrack is checked, validate the URL input
    if (formData.urlTrack) {
      const urlPattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;

      // Check if the URL is empty
      if (!formData.urlInput.trim()) {
        newErrors.urlInput = "Please enter a URL when UrlTrack is checked.";
      } 
      // Check if the URL format is valid
      else if (!urlPattern.test(formData.urlInput)) {
        newErrors.urlInput = "Please enter a valid URL starting with 'http://' or 'https://'.";
      } 
      // Check if the URL is included in the message text
      else if (!formData.message.includes(formData.urlInput)) {
        newErrors.urlInput = "The entered URL must be included in the message field.";
      } 
      // Validate URL exists on server
      else {
        try {
          const session = getSession();
          const response = await serviceInstance.post('/UserCRM/ValidateUrl', {
            Token: session.token,
            LoggedUserId: session.userId,
            Message: "",
            MAC_Address: "",
            IP_Address: "",
            Details: { urls: formData.urlInput }
          });

          if (!response?.Details) {
            newErrors.urlInput = "The URL you entered does not exist or is unreachable. Please enter a valid URL.";
          }
        } catch (error) {
          newErrors.urlInput = "An error occurred while validating the URL.";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(async () => {
    const isValid = await validateForm();
    console.log('Form valid:', isValid); 
    if (isValid && onSubmit) {
      onSubmit({
        ...formData,
        isUnicode,
      });
    }
  }, [formData, isUnicode, onSubmit]);

  // Expose handleSubmit to parent via ref
  useImperativeHandle(ref, () => ({
    submit: handleSubmit
  }), [handleSubmit]);

  const handleInsertPlaceholder = useCallback(() => {
    // Logic to insert placeholder - can be expanded with a dropdown/modal
    console.log('Insert placeholder clicked');
  }, []);

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
          className={`w-full px-3 py-2 text-sm border ${errors.senderId ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`}
        />
        {errors.senderId && (
          <p className="text-xs text-red-500 mt-1">{errors.senderId}</p>
        )}
      </div>

      {/* Compose SMS */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-800 mb-2">
          Compose SMS
        </label>
        <RichTextEditorArea
          className={`w-full px-3 py-2 text-sm border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none`}
          name="message"
          value={formData.message}
          onChange={handleMessageChange}
          placeholder="Message"
          rows="6"
        />
        {errors.message && (
          <p className="text-xs text-red-500 mt-1">{errors.message}</p>
        )}
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

        {/* URL Input - show only when urlTrack is checked */}
        {formData.urlTrack && (
          <div className="ml-6">
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Enter URL
            </label>
            <input
              type="text"
              name="urlInput"
              value={formData.urlInput}
              onChange={handleInputChange}
              placeholder="https://example.com"
              className={`w-full px-3 py-2 text-sm border ${errors.urlInput ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500`}
            />
            {errors.urlInput && (
              <p className="text-xs text-red-500 mt-1">{errors.urlInput}</p>
            )}
          </div>
        )}

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

        {/* Schedule DateTime Input - show only when scheduleUpdate is checked */}
        {formData.scheduleUpdate && (
          <div className="ml-6">
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Schedule Date & Time (dd-MMM-yyyy hh:MM:ss)
            </label>
            <div className="relative">
              <input
                type="text"
                name="scheduleDateTime"
                value={formData.scheduleDateTime}
                onChange={handleInputChange}
                onClick={openPicker}
                placeholder="24-Jan-2026 14:30:00"
                className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleCalendarIconClick();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-transparent"
                title="Pick date & time"
              >
                <Calendar className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
              </button>

              {/* Hidden native picker */}
              <input
                type="datetime-local"
                ref={dateTimeInputRef}
                onChange={handlePickerChange}
                value={parseFormattedToLocal(formData.scheduleDateTime)}
                min={getLocalDateTimeLocal()}
                className="sr-only"
                aria-hidden="true"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

InternalSMSForm.displayName = 'InternalSMSForm';

export default InternalSMSForm;
