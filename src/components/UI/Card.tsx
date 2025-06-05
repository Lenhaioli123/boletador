import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

const Card = ({ title, children, className = '' }: CardProps) => {
  return (
    <div className={`card ${className}`}>
      {title && <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;