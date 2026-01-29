import React, { useState, useRef } from 'react';

const Comment = ({ task }) => {
    const [formData, setFormData] = useState({
        comment: '',
        attachment: null
    });
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                attachment: file
            }));
            setFileName(file.name);
        }
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-5">
            {/* Comment */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comment
                </label>
                <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    placeholder="Please comment here"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 resize-y"
                />
            </div>

            {/* Attachment*/}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attachment
                </label>
                <div className="border border-gray-300 rounded-md p-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={handleBrowseClick}
                        className="px-4 py-1.5 bg-green-500 text-white text-sm font-medium rounded hover:bg-green-600 transition-colors"
                    >
                        Browse...
                    </button>
                    {fileName && (
                        <span className="ml-3 text-sm text-gray-600">{fileName}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Comment;
