// src/redirect.tsx
import React from 'react';

interface RedirectLinkProps {
  url: string;
  children: React.ReactNode;
}

const RedirectLink: React.FC<RedirectLinkProps> = ({ url, children }) => {
  return (
    <span
      onClick={() => window.open(url, '_blank')}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </span>
  );
};

export default RedirectLink;