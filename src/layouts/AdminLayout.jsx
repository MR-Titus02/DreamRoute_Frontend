import WorkspaceLayout from "@/layouts/WorkspaceLayout";

export default function AdminLayout({ children }) {
  return <WorkspaceLayout role="admin">{children}</WorkspaceLayout>;
}
