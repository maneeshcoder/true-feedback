
import Navbar from "@/components/Navbar";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="Dashboard-layout"
      >
      <Navbar />
      {children}
    </div>
  );
}
