import React from 'react';

const Icon = ({ name, className = '', ...props }) => {
  return (
    <span 
      className={`material-symbols-outlined ${className}`} 
      data-icon={name}
      {...props}
    >
      {name}
    </span>
  );
};

export default Icon;
