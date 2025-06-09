import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <Header />
      <main className="pl-72 lg:pl-80 pt-16">{children}</main>
    </div>
  );
}
