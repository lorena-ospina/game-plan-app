export const metadata = {
  title: 'Game Plan',
  description: 'Sports creative direction knowledge repository',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
