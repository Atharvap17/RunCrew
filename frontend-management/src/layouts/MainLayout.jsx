import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import FloatingBubbles from "../components/Common/FloatingBubbles";

export default function MainLayout() {
  return (
    <div className="relative min-h-screen">
      <FloatingBubbles />
      <Navbar />
      <main className="relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}