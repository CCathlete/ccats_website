// Card.tsx

import React, { useEffect, useState } from 'react';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
// import { pipe } from 'fp-ts/function';

interface CardData {
  links: string[];
}

const Card: React.FC<{ data: CardData }> = ({ data }) => {
  const [rawContent, setRawContent] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    data.links.forEach((link: string) => {
      const trimmed: string = link.trim();
      
      if (trimmed.includes('raw.githubusercontent.com')) {
        const task: TE.TaskEither<Error, string> = TE.tryCatch(
          async (): Promise<string> => {
            const response: Response = await fetch(trimmed);
            if (!response.ok) throw new Error(`Status: ${response.status}`);
            return response.text();
          },
          (reason: unknown): Error => new Error(String(reason))
        );

        task().then((result: E.Either<Error, string>) => {
          if (E.isRight(result)) {
            setRawContent((prev: Map<string, string>) => 
              new Map(prev).set(trimmed, result.right)
            );
          }
        });
      }
    });
  }, [data.links]);

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '20px',
        boxSizing: 'border-box',
        overflowY: 'auto'
      }}
    >
      {data.links.map((link: string, i: number) => {
        const trimmed: string = link.trim();

        if (trimmed.includes('raw.githubusercontent.com')) {
          return (
            <div 
              key={i} 
              style={{ 
                whiteSpace: 'pre-wrap', 
                textAlign: 'left', 
                backgroundColor: '#0d1117', 
                color: '#c9d1d9',
                padding: '15px',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '14px',
                border: '1px solid #30363d'
              }}
            >
              {rawContent.get(trimmed) || "Loading README content..."}
            </div>
          );
        }

        return (
          <iframe
            key={i}
            src={trimmed}
            style={{
              flex: '1 0 500px',
              width: '100%',
              border: 'none',
              borderRadius: '8px'
            }}
            sandbox="allow-scripts allow-same-origin allow-popups"
            title={`content-${i}`}
          />
        );
      })}
    </div>
  );
};

export default Card;
