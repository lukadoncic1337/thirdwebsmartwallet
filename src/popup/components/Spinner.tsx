import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'lg';
}

export function Spinner({ size }: SpinnerProps) {
  return <span className={`spinner ${size === 'lg' ? 'spinner-lg' : ''}`} />;
}
