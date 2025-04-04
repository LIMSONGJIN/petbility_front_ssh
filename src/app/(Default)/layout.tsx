import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="pt-[68px] bg-violet-100 h-full min-h-screen">
        {children}
      </div>
      <Footer />
    </>
  );
}
