import "../styles/globals.css";
import Providers from "../components/Providers";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import UpdatesButton from "../components/UpdatesButton";

export const metadata = {
  title: "Sakhi Non-Veg Pickles",
  description: "Homemade premium non-veg pickles"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <UpdatesButton />
          <FloatingWhatsApp />
        </Providers>
      </body>
    </html>
  );
}
