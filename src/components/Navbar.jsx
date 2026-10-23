import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { title: "Overview", path: "/dashboard" },
    { title: "Find Courses", path: "/dashboard/courses" },
    { title: "Analytics", path: "/dashboard/analytics" },
    { title: "Settings", path: "/dashboard/settings" },
  ];

  const handleLogout = () => {
    logout(); // from AuthContext
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between gap-3 border-b border-border bg-sidebar px-4 py-3 text-sidebar-foreground shadow-sm sm:px-6">
      {/* Left: Logo & App Name */}
      <div className="flex items-center gap-4">
        <img src={Logo} alt="DreamRoute Logo" className="w-10 h-10 rounded" />
        <h1 className="text-xl font-bold">DreamRoute</h1>
      </div>

      {/* Center: Nav Links */}
      <div className="hidden md:flex items-center gap-6">
        {menuItems.map((item) => (
          <button
            key={item.title}
            onClick={() => navigate(item.path)}
            className={`text-sm font-medium transition ${
              location.pathname === item.path ? "text-sidebar-ring" : "text-sidebar-foreground hover:text-sidebar-ring"
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* Right: Welcome + Logout */}
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="hidden text-sm text-sidebar-foreground/75 sm:inline">Hi, {user?.name || "User"}</span>
        <ThemeToggle className="border-sidebar-border bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80" />
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="px-3 text-sm"
        >
          Logout
        </Button>
      </div>
    </nav>
  );
}
