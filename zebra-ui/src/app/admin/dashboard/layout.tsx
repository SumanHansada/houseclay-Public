import Sidebar from "@/app/components/common/Sidebar";
import Header from "@/app/components/common/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <main className="pl-72 lg:pl-80 pt-16">
        {children}
      </main>
    </div>
  );
}
