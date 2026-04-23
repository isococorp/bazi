import './globals.css';

export const metadata = {
  title: 'โปรแกรมผูกดวงจีน โป๊ยยี่สีเถียว Ek Maoshan',
  description: 'โปรแกรมคำนวณดวงจีน โป๊ยยี่สีเถียว (八字)',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        {/* viewport สำหรับ responsive */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
