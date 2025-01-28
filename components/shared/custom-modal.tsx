import React from 'react';
import Modal from 'react-modal';

type CustomModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  contentLabel?: string;
  children?: React.ReactNode;
  minWidth?: string;
  maxWidth?: string;
  overflow?: string;
};

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onRequestClose,
  children,
  contentLabel,
  minWidth = "0",
  maxWidth = "600px",
  overflow = "auto",
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={contentLabel || "Modal"}
      ariaHideApp={false}
      style={{
        overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        content: {
          padding: "16px",
          borderRadius: "8px",
          minWidth,
          maxWidth,
          height: "fit-content",
          maxHeight: "auto",
          overflow,
          margin: "auto",
        },
      }}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
