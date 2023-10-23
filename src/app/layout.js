import "./globals.css";
import Navbar from "../components/navbar/Navbar";
import { AppWrapper } from "@/provider/AppWrapper";
import {NextAuthProvider} from "@/auth-provider/NextAuthProvider";
import { ToastContainer } from "react-toastify";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
        <AppWrapper>
          <Navbar />
          {children}
        </AppWrapper>
        </NextAuthProvider>
        <ToastContainer/>
      </body>
    </html>
  );
}
