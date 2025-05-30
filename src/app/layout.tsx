import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&icon_names=favorite,home,add,settings" rel="stylesheet" />

      </head>
      <body>
        <h1 className="text-center text-3xl text-white font-extrabold mb-2">Quanto Deu</h1>
        {children}
      </body>
    </html>
  );
}
