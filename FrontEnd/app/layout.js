import './globals.css';
import UserProvider from './Context/UserContext';
export const metadata = {
  title: "InstaGram",
  description: "InstaGram Clone",
};    

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
};
