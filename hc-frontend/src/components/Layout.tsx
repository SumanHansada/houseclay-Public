import Footer from "@/components/Footer";
import Header from "@/components/Header";
import StickyNavbar from "@/components/StickyNavbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto my-0  min-h-screen flex-1 flex flex-wrap items-center justify-center">
        {children}
      </main>
      <Footer />
      <StickyNavbar />
    </>
  );
}
