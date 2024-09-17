import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navigation from "@/components/Navigation";
import Session from "@/components/Session";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { ReactQueryClientProvider } from "@/utils/react-query";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "SchedULAr",
  description: "Scheduler created for ULA",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col justify-between`}
        >
          <Navigation />
          <div className="w-full flex flex-col items-center justify-center">
            <Session session={session}>
              <Toaster />
              {children}
            </Session>
          </div>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
