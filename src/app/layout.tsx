import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atlas de procesos | Diagnóstico operativo",
  description: "Entrevista escrita para descubrir oportunidades de mejora en procesos empresariales.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
