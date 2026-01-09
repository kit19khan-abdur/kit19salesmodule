import React, { useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

const RichTextEditor = ({ 
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

  const execCommand = (command, value = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleInput(); // Update the value after command execution
  };

  const createLink = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    
    if (!selectedText) {
      alert('Please select some text first to create a link');
      return;
    }
    
    const url = prompt('Enter URL:', 'https://');
    if (url && url.trim()) {
      document.execCommand('createLink', false, url);
      handleInput();
    }
  };

  const ToolbarButton = ({ onClick, icon: Icon, title }) => (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className="p-2 hover:bg-gray-100 rounded transition-colors"
      onMouseDown={(e) => e.preventDefault()}
    >
      <Icon className="w-4 h-4 text-gray-600" />
    </button>
  );

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-50 border-b border-gray-300 flex-wrap">
        <ToolbarButton 
          onClick={() => execCommand('bold')} 
          icon={Bold} 
          title="Bold" 
        />
        <ToolbarButton 
          onClick={() => execCommand('italic')} 
          icon={Italic} 
          title="Italic" 
        />
        <ToolbarButton 
          onClick={() => execCommand('underline')} 
          icon={Underline} 
          title="Underline" 
        />
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <ToolbarButton 
          onClick={() => execCommand('insertUnorderedList')} 
          icon={List} 
          title="Bullet List" 
        />
        <ToolbarButton 
          onClick={() => execCommand('insertOrderedList')} 
          icon={ListOrdered} 
          title="Numbered List" 
        />
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <ToolbarButton 
          onClick={() => execCommand('justifyLeft')} 
          icon={AlignLeft} 
          title="Align Left" 
        />
        <ToolbarButton 
          onClick={() => execCommand('justifyCenter')} 
          icon={AlignCenter} 
          title="Align Center" 
        />
        <ToolbarButton 
          onClick={() => execCommand('justifyRight')} 
          icon={AlignRight} 
          title="Align Right" 
        />
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <ToolbarButton 
          onClick={createLink} 
          icon={Link} 
          title="Insert Link" 
        />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="px-3 py-2 min-h-[60px] outline-none rounded-b-[10px] focus:ring-2 focus:ring-blue-500 focus:ring-inset"
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

export default RichTextEditor;
