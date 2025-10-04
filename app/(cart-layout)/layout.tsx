"use client";


import "../../globals.css";







export default function CartRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" dir="rtl">
            <body
                // className={`${iranSansBold.variable} ${iranSansMedium.variable} ${iranSans.variable} antialiased`}
            >
                <h1> Cart Layout </h1>
                {/* <Toaster /> */}
                {children}
            </body>
        </html>
    );
}
