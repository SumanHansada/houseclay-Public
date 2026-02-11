import { Header } from "@/layout-components";
import { Sidebar } from "@/layout-components";
import AuthProvider from "@/providers/AuthProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="w-full h-full min-h-screen">
        <Header />
        <Sidebar />
        <main className="pl-72 lg:pl-80 pt-16">{children}</main>
      </div>
    </AuthProvider>
  );
}
