
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import EventChatbot from "./components/EventChatbot";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <EventChatbot />
    </AuthProvider>
  );
}

export default App;
