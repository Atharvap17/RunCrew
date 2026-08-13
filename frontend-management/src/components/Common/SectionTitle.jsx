export default function SectionTitle({
  subtitle,
  title,
  center = true,
  description,
}) {
  return (
    <div className={`page-header ${center ? "page-header--center" : ""}`}>
      {subtitle && <p className="section-label">{subtitle}</p>}
      <h1 className="section-title mt-3">{title}</h1>
      {description && (
        <p className="text-gray-400 mt-4 max-w-xl text-sm mx-auto">{description}</p>
      )}
    </div>
  );
}
