export default function Input({
  label,
  error,
  className = "",
  containerClassName = "",
  center = false,
  ...props
}) {
  const labelClass = center ? "form-label form-label--center" : "form-label";
  const inputClass = [
    "form-input",
    center ? "form-input--center" : "",
    error ? "form-input--error" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`form-field ${containerClassName}`.trim()}>
      {label && <label className={labelClass}>{label}</label>}
      <input className={inputClass} {...props} />
      {error && (
        <p className={`text-rose-400 text-xs font-medium ${center ? "text-center" : ""}`}>
          {error}
        </p>
      )}
    </div>
  );
}
