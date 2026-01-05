import React, { useState } from 'react';
import PopUpModal from './PopUpModal';
import Button from '../common/Button';
import Input from '../common/Input';

/**
 * Example usage of PopUpModal with different forms
 */
const ExampleUsage = () => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Example 1: User Form
  const UserForm = () => (
    <form className="space-y-4">
      <Input label="Name" placeholder="Enter name" />
      <Input label="Email" type="email" placeholder="Enter email" />
      <Input label="Phone" placeholder="Enter phone number" />
    </form>
  );

  // Example 2: Product Form
  const ProductForm = () => (
    <form className="space-y-4">
      <Input label="Product Name" placeholder="Enter product name" />
      <Input label="Price" type="number" placeholder="Enter price" />
      <textarea
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        placeholder="Description"
        rows="4"
      />
    </form>
  );

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-6">PopUpModal Examples</h1>

      {/* Example Buttons */}
      <div className="flex gap-4">
        <Button onClick={() => setIsUserModalOpen(true)}>
          Open User Form
        </Button>
        <Button onClick={() => setIsProductModalOpen(true)}>
          Open Product Form
        </Button>
        <Button onClick={() => setIsConfirmModalOpen(true)}>
          Open Confirmation Modal
        </Button>
      </div>

      {/* Example 1: User Modal with Footer */}
      <PopUpModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title="Add New User"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsUserModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsUserModalOpen(false)}>
              Save User
            </Button>
          </div>
        }
      >
        <UserForm />
      </PopUpModal>

      {/* Example 2: Product Modal (Large) */}
      <PopUpModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title="Add New Product"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsProductModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsProductModalOpen(false)}>
              Create Product
            </Button>
          </div>
        }
      >
        <ProductForm />
      </PopUpModal>

      {/* Example 3: Simple Confirmation Modal */}
      <PopUpModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Action"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>
              No
            </Button>
            <Button variant="danger" onClick={() => setIsConfirmModalOpen(false)}>
              Yes, Delete
            </Button>
          </div>
        }
      >
        <p className="text-gray-600">
          Are you sure you want to delete this item? This action cannot be undone.
        </p>
      </PopUpModal>
    </div>
  );
};

export default ExampleUsage;
