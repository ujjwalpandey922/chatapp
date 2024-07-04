import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import Main from "@/components/home/Main";
import { ProtectedRoute } from "@/components/ProtectedRoute";
export default function Home() {
  return (
    <ProtectedRoute>
      <main className="flex  container mx-auto min-h-screen flex-col items-center justify-between px-4">
        <Header />
        <Main />
        <Footer />
      </main>
    </ProtectedRoute>
  );
}
