import "../styles/globals.css";
import Providers from "../components/Providers";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import UpdatesButton from "../components/UpdatesButton";
import PageTransition from "../components/PageTransition";
import { Noto_Sans_Telugu, Sora } from "next/font/google";

const sans = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans"
});

const telugu = Noto_Sans_Telugu({
  subsets: ["telugu", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-telugu"
});

export const metadata = {
  title: "Sakhi Non-Veg Pickles",
  description: "Homemade premium non-veg pickles"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${telugu.variable}`}>
        <Providers>
          <PageTransition>{children}</PageTransition>
          <UpdatesButton />
          <FloatingWhatsApp />
        </Providers>
      </body>
    </html>
  );
}
