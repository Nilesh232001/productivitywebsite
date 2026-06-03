import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal OS",
  description: "A unified productivity and time management platform."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('pos-theme');if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`
          }}
        />
      </head>
      <body className="min-h-screen bg-mist text-ink antialiased">{children}</body>
    </html>
  );
}
