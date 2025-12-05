import { Dashboard } from "@/components/Dashboard";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4">
        <Dashboard />
      </main>
    </div>
  );
}
