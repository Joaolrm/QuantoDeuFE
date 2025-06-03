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
        <h1 className="titulo-logo m-4 drop-shadow-lg text-center text-4xl text-white font-extrabold"> <a href="/">Quanto Deu </a></h1>
        {children}
      </body>
    </html>
  );
}
