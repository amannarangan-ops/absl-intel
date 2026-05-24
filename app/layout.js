export const metadata = {
  title: "ABSL Corporate Intel & Pitch Engine",
  description: "Live AI-powered corporate treasury intelligence for ABSL AMC",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#07070f" }}>
        {children}
      </body>
    </html>
  );
}
