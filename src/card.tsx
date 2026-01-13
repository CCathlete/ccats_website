// Card.tsx
import React from 'react';

interface CardData {
  links: string[];
}

const Card: React.FC<{ data: CardData }> = ({ data }) => {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      {data.links.map((link, i) => (
        <iframe
          key={i}
          src={link}
          style={{
            flex: 1,
            border: 'none',
            height: '100%',
          }}
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      ))}
    </div>
  );
};

export default Card;
