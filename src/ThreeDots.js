
import React, { useState, useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner';

const LoadingIndicator = ({ isLoading = true, timeout = 1000, ...otherProps }) => {
  const [internalIsLoading, setIsLoading] = useState(isLoading); 

  useEffect(() => {
    if (isLoading) { 
      const timer = setTimeout(() => {
        setIsLoading(false); 
      }, timeout);

      return () => clearTimeout(timer); 
    }
  }, [isLoading, timeout]); 

  return (
    <ThreeDots
      visible={internalIsLoading} 
      height={80}
      width={80}
      color="#4fa94d"
      radius={9}
      ariaLabel="three-dots-loading"
      {...otherProps} 
    />
  );
};

export default LoadingIndicator;
