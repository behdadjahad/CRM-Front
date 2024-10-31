// components/CustomModal.tsx
import React from 'react';
import Modal from 'react-modal';

type CustomModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  contentLabel?: string;
  children?: React.ReactNode;
};

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onRequestClose, children, contentLabel }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={contentLabel || "Modal"}
      style={{
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        content: { padding: '16px', borderRadius: '8px', minWidth: "600px", maxWidth: '600px', maxHeight: "fit-content", margin: 'auto' },
      }}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
