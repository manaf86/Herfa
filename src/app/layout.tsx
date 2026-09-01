import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import "./globals.css";

const ibmPlex = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["arabic", "latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "حِرفة — سوق الخدمات المهنية العربي",
  description:
    "منصة حِرفة: سوق الخدمات المهنية العربي. مالك مضمون في الخزنة، قواعد واضحة، وجسر لغوي فوري بين العملاء والمحترفين.",
  keywords: [
    "حرفة",
    "سوق خدمات",
    "مستقلين عرب",
    "خدمات مهنية",
    "منصة عربية",
    "Herfa",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${ibmPlex.variable} ${inter.variable}`}
    >
      <head>
        {/*
          FOUC-prevention: يُنفَّذ قبل hydration لتجنّب وميض من الفاتح للداكن.
          المنطق متطابق مع src/lib/useTheme.ts:
            - saved === 'dark'  → نضبط data-theme='dark'
            - أي قيمة أخرى (بما فيها 'light'، null، أو قيمة تالفة قديمة)
              = لا نفعل شيئاً = الفاتح الافتراضي (:root).
          try/catch للأمان (localStorage قد يُرفَض في وضع خاص/iframe).
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var saved = localStorage.getItem('herfa-theme');
                  if (saved === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
