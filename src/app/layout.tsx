import AuthContext from '@/context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'Web IDE',
  description: 'Web IDE',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <AuthContext>{children}</AuthContext>
      </body>
    </html>
  );
}
