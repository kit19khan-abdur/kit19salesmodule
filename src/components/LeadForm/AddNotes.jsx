import React, { useState, useEffect } from 'react'
import RichTextEditorArea from '../common/RichTextEditorArea';

// Accepts controlled props: `value` and `onChange`.
const AddNotes = ({ value = '', onChange = () => {} }) => {
    const [noteText, setNoteText] = useState(value);

    useEffect(() => {
        setNoteText(value);
    }, [value]);

    const handleChange = (e) => {
        const v = e.target.value;
        setNoteText(v);
        onChange(v);
    }

    return (
        <div>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Note <span className="text-red-500">*</span>
                    </label>
                    <RichTextEditorArea
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none`}
                        value={noteText}
                        onChange={handleChange}
                        placeholder="Enter your note here..."
                        rows="8"
                    />
                </div>
            </div>
        </div>
    )
}

export default AddNotes
