import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";

export default function ReadMore({ to, children = "Read more" }) {
  return (
    <Link to={to} className="read-more">
      {children}
      <HiArrowRight />
    </Link>
  );
}
