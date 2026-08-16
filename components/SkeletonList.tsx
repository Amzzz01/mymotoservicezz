import React from 'react';
import SkeletonCard from './SkeletonCard';

interface SkeletonListProps {
  count?: number;
  className?: string;
}

const SkeletonList: React.FC<SkeletonListProps> = ({ count = 3, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);

export default SkeletonList;
