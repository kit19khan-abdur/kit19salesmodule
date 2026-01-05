import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomFieldModal from './Enquiries/CustomFieldModal';

const CustomFieldsPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Reuse the CustomFieldModal as a full-page manager. Close navigates back. */}
      <CustomFieldModal
        open={true}
        onClose={() => navigate(-1)}
        onCreated={() => { /* nothing special here */ }}
      />
    </div>
  );
};

export default CustomFieldsPage;
