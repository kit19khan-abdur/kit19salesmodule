import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeadDrawer from '../components/leads/LeadDrawer';

const CreateLeadPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    navigate('/leads');
  };

  return (
    <div>
      <LeadDrawer isOpen={open} onClose={handleClose} lead={null} />
    </div>
  );
};

export default CreateLeadPage;
