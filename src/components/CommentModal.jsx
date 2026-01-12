import React, { useState } from 'react';
import Modal from './common/Modal';

const CommentModal = ({ isOpen, onClose, row, onSubmit }) => {
  const [text, setText] = useState('');

  React.useEffect(() => {
    if (isOpen) setText('');
  }, [isOpen]);

  const handleSubmit = () => {
    if (onSubmit) onSubmit(text);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Comment on ${row?.title || ''}`} size="md" footer={(
      <>
        <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
      </>
    )}>
      <div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className="w-full border rounded px-3 py-2" placeholder="Write a comment..." />
      </div>
    </Modal>
  );
};

export default CommentModal;
