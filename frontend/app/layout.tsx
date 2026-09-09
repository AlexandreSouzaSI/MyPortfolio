import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { themeInitScript } from "@/lib/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteTitle = "Alexandre Moura — Desenvolvedor Full Stack";
const siteDescription =
  "Portfólio de Alexandre Moura: sistemas construídos e em uso real, experiência, formação e projetos de um desenvolvedor Full Stack Node.js/NestJS/Next.js/Prisma.";
// Troque pela URL real quando o domínio do portfólio estiver definido —
// necessário pra imagem de preview (og:image) resolver certo em links
// compartilhados (WhatsApp, LinkedIn, etc.).
const siteUrl = "https://amsx.online";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "Alexandre Moura",
    locale: "pt_BR",
    type: "website",
    // Usando o print do NuGalho Hub como imagem provisória — troque por
    // uma banner/foto de perfil dedicada quando tiver uma.
    images: ["/projects/nugalho-hub.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/projects/nugalho-hub.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
