import { Link } from "react-router-dom";
import Button from "../../components/Common/Button";

export default function NotFound() {
  return (
    <div className="loading-center flex-col px-6">
      <p className="section-label">Error</p>
      <h1 className="font-display text-[clamp(6rem,20vw,12rem)] text-brand leading-none">404</h1>
      <h2 className="font-display text-3xl text-white mt-4">Page Not Found</h2>
      <p className="text-gray-400 mt-2 mb-10 text-center max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button to="/" variant="primary" size="lg" showArrow={false}>
        Back to Home
      </Button>
    </div>
  );
}
