import React, { useState } from 'react'
import RichTextEditor from '../common/RichTextEditor'
import RichTextEditorArea from '../common/RichTextEditorArea';

const AddNotes = () => {
    const [noteText, setNoteText] = useState('');


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
                        onChange={(e) => {
                            const value = e.target.value;
                            setNoteText(value);
                        }}
                        placeholder="Enter your note here..."
                        rows="8"
                    />
                </div>
            </div>
        </div>
    )
}

export default AddNotes
