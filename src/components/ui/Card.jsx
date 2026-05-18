const Card = ({ children, className = '', hover = false, ...props }) => {
  const baseStyles = 'bg-white rounded-xl border-2 border-gray-200';
  const hoverStyles = hover ? 'hover:border-gray-300 transition-all duration-200 cursor-pointer' : '';

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-4 sm:px-6 py-4 sm:py-5 border-b-2 border-gray-100 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`px-4 sm:px-6 py-5 sm:py-6 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-4 sm:px-6 py-4 sm:py-5 border-t-2 border-gray-100 ${className}`}>
    {children}
  </div>
);

export default Card;
