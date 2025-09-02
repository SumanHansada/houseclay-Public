import Footer from "@/layout-components/Footer";

export default function BuyConnectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
