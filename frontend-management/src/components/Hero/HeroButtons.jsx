import Button from "../Common/Button";
import { useAuth } from "../../context/AuthContext";

export default function HeroButtons() {
  const { user } = useAuth();

  return (
    <div className="flex flex-wrap gap-4 mt-14 md:mt-16">
      <Button to="/events">
        Explore Events
      </Button>

      {!user && (
        <Button to="/register" variant="outline">
          Register Now
        </Button>
      )}
    </div>
  );
}