import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";
import {
  ColorSchemeScript,
  MantineProvider,
  createTheme,
  Box,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import Header from "./components/Header";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const theme = createTheme({
  primaryColor: "blue",
  fontFamily: "var(--font-geist-sans)",
});

export const metadata: Metadata = {
  title: "Imagine AI - Text to Image Generator",
  description:
    "Generate stunning, AI-powered images from simple text prompts in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <Notifications />
          <Header />
          <Box component="main" style={{ flex: 1 }}>
            {children}
          </Box>
          <Footer />
        </MantineProvider>
      </body>
    </html>
  );
}
