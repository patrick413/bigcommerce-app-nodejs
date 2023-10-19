import { Modal, Tooltip, Button } from '@bigcommerce/big-design';
import { AddIcon } from '@bigcommerce/big-design-icons';
import { useState } from 'react';

function ModalAdd({ collection, url, apiKey }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const submitHandler = async () => {
    try {
      if (!selectedFile) {
        console.error('No file selected');
        return;
      }

      const formData = new FormData();
      formData.append('csvFile', selectedFile);
      formData.append('collectionName', collection.id);
      formData.append('url', url);
      formData.append('apiKey', apiKey);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        console.log('File uploaded successfully');
      } else {
        console.error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <>
      <Tooltip placement="bottom" trigger={<Button onClick={() => setIsOpen(true)} iconOnly={<AddIcon />} />}>Add New</Tooltip>
      <Modal
        actions={[
          {
            text: 'Add',
            onClick: submitHandler,
          },
          {
            text: 'Close',
            variant: 'subtle',
            onClick: () => setIsOpen(false),
          }
        ]}
        closeOnClickOutside={true}
        closeOnEscKey={true}
        header="New Document"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
      </Modal>
    </>
  );
}

export default ModalAdd;
