import { AdminMainContent, Header, Sidebar } from "@/layout-components";
import AuthProvider from "@/providers/AuthProvider";
import { SidebarProvider } from "@/providers/SidebarContext";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <div className="fixed inset-0 w-full bg-gray-50 flex flex-col overflow-hidden">
          <Header />
          <Sidebar />
          <AdminMainContent>{children}</AdminMainContent>
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}
