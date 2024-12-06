import React from 'react';
import Modal from 'react-modal';

type CustomModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  contentLabel?: string;
  children?: React.ReactNode;
  minWidth?: string;
  maxWidth?: string;
};

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onRequestClose,
  children,
  contentLabel,
  minWidth = "0",
  maxWidth = "600px" }
) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={contentLabel || "Modal"}
      ariaHideApp={false}
      style={{
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        content: { padding: '16px', borderRadius: '8px', minWidth, maxWidth, height: "fit-content", maxHeight: "90vh", overflow: "auto", margin: 'auto' },
      }}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
