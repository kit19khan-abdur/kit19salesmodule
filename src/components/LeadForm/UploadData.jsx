import React, { useRef, useState } from 'react'

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const SUPPORTED_FORMATS = [
    '.bmp',
    '.csv',
    '.doc',
    '.docx',
    '.gif',
    '.jpeg',
    '.jpg',
    '.pdf',
    '.png',
    '.ppt',
    '.pptx',
    '.txt',
    '.xls',
    '.xlsx'
];

const UploadData = ({ onUpload }) => {
    const fileRef = useRef(null);
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [showFormats, setShowFormats] = useState(false);

    const handleFileSelect = (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        if (f.size > MAX_SIZE) {
            setFile(null);
            setError('File size exceeds 5 MB limit.');
            setTimeout(() => setError(''), 3000);
            return;
        }
        setFile(f);
        setError('');
    };

    const handleUpload = () => {
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }
        setError('');
        if (onUpload && typeof onUpload === 'function') {
            onUpload(file);
        } else {
            // fallback behavior: simple alert (can be replaced by API call)
            // eslint-disable-next-line no-alert
            alert(`Uploading file: ${file.name}`);
        }
    };

    const clearSelection = () => {
        setFile(null);
        setError('');
        if (fileRef.current) fileRef.current.value = '';
    };

    return (
        <div className="w-full">
            <div className="flex items-center gap-3">
                <label
                    htmlFor="upload-input"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm cursor-pointer hover:bg-gray-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V3m0 0l-3 3m3-3 3 3" />
                    </svg>
                    <span className="text-sm">Upload Document</span>
                </label>
                <input
                    id="upload-input"
                    ref={fileRef}
                    type="file"
                    accept={SUPPORTED_FORMATS.join(',')}
                    className="hidden"
                    onChange={handleFileSelect}
                />

                <div className="text-sm text-green-600">(Max File Size 5 MB)</div>
            </div>

            <div className="mt-3">
                <button
                    type="button"
                    onClick={handleUpload}
                    className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                    Upload
                </button>
                <button
                    type="button"
                    onClick={clearSelection}
                    className="ml-2 px-3 py-2 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
                >
                    Clear
                </button>
            </div>

            {file && (
                <div className="mt-3 text-sm">
                    <strong>Selected:</strong> {file.name} <span className="text-gray-500">({(file.size / 1024).toFixed(0)} KB)</span>
                </div>
            )}

            {error && (
                <div className="mt-2 text-sm text-red-600">{error}</div>
            )}

            <div className="mt-4">
                <button
                    type="button"
                    onClick={() => setShowFormats(s => !s)}
                    className="text-blue-700 text-sm font-medium underline"
                >
                    Click here to see supported file format
                </button>
                {showFormats && (
                    <div className="mt-2 bg-white border border-gray-200 rounded shadow-sm p-2 text-sm">
                        {SUPPORTED_FORMATS.map((f) => (
                            <div key={f} className="py-1">{f}</div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadData
