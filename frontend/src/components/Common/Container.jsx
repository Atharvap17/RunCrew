export default function Container({ children, className = "" }) {
  return (
    <div className={`section-inner ${className}`.trim()}>
      {children}
    </div>
  );
}