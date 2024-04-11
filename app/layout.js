import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./Providers";
import Nav from "./components/navbar";
const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "SwasthyaSamriddhi",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (    

    <html lang="en">
      <head><link rel="icon" href="/logo.png" /></head>
      <body className={inter.className}>
    
        <AuthProvider>
          <Nav />
          {children}
          </AuthProvider></body>
    </html>
      );
}
