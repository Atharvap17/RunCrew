export default function Card({ children, className = "" }) {
  return (
    <div className={`panel panel-clip card-lift ${className}`}>
      {children}
    </div>
  );
}
