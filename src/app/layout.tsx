import { AuthProvider } from "@/components/auth-provider";
import { Navigation } from "@/components/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Catálogo de Filmes",
  description: "Seu catálogo pessoal de filmes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <main className="min-h-screen bg-background">
              <Navigation />
              {children}
            </main>
            <Toaster richColors closeButton theme="dark" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
