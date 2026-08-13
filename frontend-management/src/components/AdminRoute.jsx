// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function AdminRoute({ children }) {
//   const { user, loading, isAdmin } = useAuth();

//   console.log("========== ADMIN ROUTE ==========");
//   console.log("Loading:", loading);
//   console.log("User:", user);
//   console.log("isAdmin:", isAdmin);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         Loading...
//       </div>
//     );
//   }

//   if (!user) {
//     console.log("❌ Redirecting to LOGIN");
//     return <Navigate to="/login" replace />;
//   }

//   if (!isAdmin) {
//     console.log("❌ Redirecting to HOME");
//     return <Navigate to="/" replace />;
//   }

//   console.log("✅ Admin access granted");
//   return children;
// }

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();

  console.log({
    loading,
    user,
    isAdmin,
  });

  if (loading) return <h1>Loading...</h1>;

  if (!user) {
    console.log("Redirect -> Login");
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    console.log("Redirect -> Home");
    return <Navigate to="/" replace />;
  }

  console.log("Access Granted");
  return children;
}