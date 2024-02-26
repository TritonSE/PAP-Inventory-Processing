export const metadata = {
  title: "Patriots & Paws",
  description: "Web application for Patriots & Paws",
};

export default function DummyLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
