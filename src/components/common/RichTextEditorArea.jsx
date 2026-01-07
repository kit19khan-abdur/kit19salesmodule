import React, { useRef, useEffect } from 'react';

const RichTextEditorArea = ({ 
  value = '', 
  onChange, 
  placeholder = 'Start typing...', 
  className = '',
  rows = 3 
}) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (onChange && editorRef.current) {
      onChange({ target: { value: editorRef.current.innerHTML } });
    }
  };

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-1 min-h-[60px] outline-none"
        style={{ 
          minHeight: `${rows * 24}px`,
          maxHeight: '300px',
          overflowY: 'auto'
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
      
      <style>{`
        [contentEditable="true"]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          pointer-events: none;
        }
        [contentEditable="true"] {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        [contentEditable="true"] ul {
          list-style-type: disc;
          margin-left: 20px;
          padding-left: 20px;
        }
        [contentEditable="true"] ol {
          list-style-type: decimal;
          margin-left: 20px;
          padding-left: 20px;
        }
        [contentEditable="true"] li {
          margin: 4px 0;
        }
        [contentEditable="true"] a {
          color: #2563eb;
          text-decoration: underline;
          cursor: pointer;
        }
        [contentEditable="true"] a:hover {
          color: #1d4ed8;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditorArea;
