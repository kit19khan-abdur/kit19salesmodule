import React, { useState } from 'react'

const AddNotes = () => {
    const [noteText, setNoteText] = useState('');
    const [noteError, setNoteError] = useState('');


    return (
        <div>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Note <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={noteText}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 12000) {
                                setNoteText(value);
                                setNoteError('');
                            }
                        }}
                        placeholder="Enter your note here..."
                        maxLength={12000}
                        rows={8}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${noteError ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    <div className="flex justify-between items-center mt-2">
                        {noteError && (
                            <p className="text-sm text-red-500">{noteError}</p>
                        )}
                        <p className="text-sm text-gray-500 ml-auto">
                            {noteText.length} / 12000 characters
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddNotes
