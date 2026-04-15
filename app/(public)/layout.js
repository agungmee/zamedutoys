import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="has-nav">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

