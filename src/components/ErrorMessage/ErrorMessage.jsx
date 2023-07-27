import React, { useState, useEffect } from 'react';

const ErrorMessage = ({ message }) => {
	const [showMessage, setShowMessage] = useState(false);

	useEffect(() => {
	  setShowMessage(true);
  
	  const timeout = setTimeout(() => {
		setShowMessage(false);
	  }, 3000);
  
	  return () => {
		clearTimeout(timeout);
	  };
	}, [message]);
  
	return showMessage ? (
	  <div className="error-message">
		{message}
	  </div>
	) : null;
  };

export default ErrorMessage;
