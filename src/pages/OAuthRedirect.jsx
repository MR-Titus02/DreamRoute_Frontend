// ✅ Updated OAuthRedirect.jsx with full user data
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

function OAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");
    const role = params.get("role") || "student";
    const id = params.get("id") || params.get("userId");

    if (token && name && email && id) {
      const user = { id, name, email, role };
      login(user, token);

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "institution") {
        navigate("/institution");
      } else {
        navigate("/dashboard");
      }
    } else {
      navigate("/login");
    }
  }, [location.search, login, navigate]);

  return (
    <div role="status" className="min-h-screen bg-background px-4 py-10 text-center text-foreground">
      Signing in via Google…
    </div>
  );
}

export default OAuthRedirect;