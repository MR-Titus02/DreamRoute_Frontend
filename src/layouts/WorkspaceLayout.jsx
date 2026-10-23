import { createElement } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  Home,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
  Zap,
  Target,
} from "lucide-react";
import Logo from "@/assets/logo.png";
import { useAuth } from "@/context/AuthContext";
import ChatBot from "@/components/ChatBot";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const roleNavigation = {
  learner: {
    label: "Learner workspace",
    links: [
      { title: "Overview", href: "/dashboard", icon: BarChart3 },
      { title: "Find Courses", href: "/dashboard/courses", icon: BookOpen },
      { title: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
      { title: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
    settingsHref: "/dashboard/settings",
    showCareerTools: true,
    showChatBot: true,
  },
  admin: {
    label: "Admin workspace",
    links: [
      { title: "Dashboard", href: "/admin", icon: Home },
      { title: "User Management", href: "/admin/users", icon: Users },
      { title: "Course Management", href: "/admin/courses", icon: BookOpen },
      {
        title: "Institution Management",
        href: "/admin/institutions",
        icon: ShieldCheck,
      },
    ],
    settingsHref: null,
    showCareerTools: false,
    showChatBot: false,
  },
  institution: {
    label: "Institution workspace",
    links: [
      { title: "Dashboard", href: "/institution", icon: BarChart3 },
      { title: "Manage Courses", href: "/institution/courses", icon: BookOpen },
      {
        title: "Settings",
        href: "/institution/settings",
        icon: Settings,
      },
    ],
    settingsHref: "/institution/settings",
    showCareerTools: false,
    showChatBot: true,
  },
};

function WorkspaceNavigation({ links, pathname }) {
  const { isMobile, setOpenMobile } = useSidebar();
  const activeLink =
    links.find((link) => pathname === link.href) ||
    links
      .filter((link) => pathname.startsWith(`${link.href}/`))
      .sort((first, second) => second.href.length - first.href.length)[0];

  return (
    <SidebarMenu className="gap-1">
      {links.map(({ title, href, icon: Icon }) => {
        const isActive = activeLink?.href === href;

        return (
          <SidebarMenuItem key={href}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              tooltip={title}
              className="h-10 rounded-lg px-3 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
            >
              <NavLink
                to={href}
                end
                onClick={() => {
                  if (isMobile) setOpenMobile(false);
                }}
              >
                {createElement(Icon, { "aria-hidden": "true" })}
                <span>{title}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

function getPageTitle(pathname, links) {
  const currentLink =
    links.find((link) => pathname === link.href) ||
    links
      .filter((link) => pathname.startsWith(`${link.href}/`))
      .sort((first, second) => second.href.length - first.href.length)[0];

  if (currentLink) return currentLink.title;
  if (pathname === "/dashboard/roadmap" || pathname === "/roadmap") {
    return "Career roadmap";
  }
  if (pathname === "/dashboard/career-path") return "Career path";
  return "Workspace";
}

export default function WorkspaceLayout({ children, role }) {
  const navigation = roleNavigation[role] || roleNavigation.learner;
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const displayName = user?.name || (role === "admin" ? "Admin" : "User");
  const initial = displayName.trim().charAt(0).toUpperCase() || "U";

  return (
    <SidebarProvider className="min-h-svh bg-background text-foreground">
      <Sidebar
        side="left"
        variant="sidebar"
        collapsible="icon"
        className="border-sidebar-border"
      >
        <SidebarHeader className="h-16 justify-center border-b border-sidebar-border px-4">
          <NavLink
            to={role === "admin" ? "/admin" : role === "institution" ? "/institution" : "/dashboard"}
            className="flex min-w-0 items-center gap-3 rounded-md"
            aria-label={`${navigation.label} home`}
          >
            <img
              src={Logo}
              alt=""
              className="h-9 w-9 shrink-0 object-contain"
            />
            <span className="truncate text-sm font-semibold text-sidebar-foreground">
              DreamRoute
            </span>
          </NavLink>
        </SidebarHeader>

        <SidebarContent className="gap-4 p-3">
          <nav aria-label={`${navigation.label} navigation`}>
            <WorkspaceNavigation
              links={navigation.links}
              pathname={location.pathname}
            />
          </nav>

          {navigation.showCareerTools && (
            <section
              aria-labelledby="career-tools-title"
              className="space-y-2 border-t border-sidebar-border pt-4 group-data-[collapsible=icon]:hidden"
            >
              <h2
                id="career-tools-title"
                className="px-2 text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/65"
              >
                Career tools
              </h2>
              <Button
                asChild
                className="w-full justify-start bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
              >
                <NavLink to="/dashboard/career-path">
                  <Zap aria-hidden="true" />
                  Generate AI path
                </NavLink>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <NavLink to="/dashboard/roadmap">
                  <Target aria-hidden="true" />
                  View my roadmap
                </NavLink>
              </Button>
            </section>
          )}
        </SidebarContent>
      </Sidebar>

      <div className="flex min-h-svh min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-4 border-b border-border bg-card px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <SidebarTrigger className="h-10 w-10 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                {navigation.label}
              </p>
              <p className="truncate text-sm font-semibold text-foreground">
                {getPageTitle(location.pathname, navigation.links)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={`Open account menu for ${displayName}`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {initial}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-52 border-border bg-popover text-popover-foreground"
            >
              {navigation.settingsHref && (
                <>
                  <DropdownMenuItem
                    onClick={() => navigate(navigation.settingsHref)}
                  >
                    <Settings aria-hidden="true" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="text-destructive focus:text-destructive"
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </header>

        <main className="min-w-0 flex-1 bg-background p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        <footer className="border-t border-border bg-card px-4 py-3 text-center text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} DreamRoute
        </footer>
      </div>

      {navigation.showChatBot && user && <ChatBot userId={user.id} />}
    </SidebarProvider>
  );
}
