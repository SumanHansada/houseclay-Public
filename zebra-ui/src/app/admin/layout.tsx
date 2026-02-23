import { Header } from "@/layout-components";
import { Sidebar } from "@/layout-components";
import AuthProvider from "@/providers/AuthProvider";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="fixed inset-0 w-full bg-gray-50 flex flex-col overflow-hidden">
        <Header />
        <Sidebar />
        <main className="pl-72 lg:pl-80 pt-16 flex-1 flex flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
