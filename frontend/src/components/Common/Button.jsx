import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const variantClass = {
  primary: "btn-primary",
  outline: "btn-outline",
  dark: "btn-dark",
  "outline-brand": "btn-outline-brand",
  danger: "btn-danger",
  "outline-danger": "btn-outline-danger",
};

const sizeClass = {
  sm: "btn-sm",
  lg: "btn-lg",
};

export default function Button({
  children,
  to,
  onClick,
  variant = "primary",
  size,
  className = "",
  showArrow = true,
  type = "button",
  disabled = false,
}) {
  const classes = [
    "btn",
    variantClass[variant] || variantClass.primary,
    size ? sizeClass[size] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {children}
      {showArrow && (
        <span className="btn-icon">
          <FaArrowRight />
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {content}
    </button>
  );
}
