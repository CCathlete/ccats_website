// src/copy_to_clipboard.tsx
import React from 'react';

interface CopyToClipboardProps {
  text: string;
  children: React.ReactNode;
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ text, children }) => {
  return (
    <span
      onClick={() => navigator.clipboard.writeText(text)}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </span>
  );
};

export default CopyToClipboard;