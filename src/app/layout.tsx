import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../componentes/Header";
import { Footer } from "../componentes/Footer"; // Importe o Footer
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  // ATUALIZADO
  title: "FreshMarket - Produtos Frescos Direto do Campo",
  description: "Qualidade, frescor e sabor em cada produto. Apoie produtores locais!",
  keywords: ["fruta", "hortifruti", "legumes", "verduras", "orgânicos", "delivery"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer /> {/* ADICIONADO */}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}