export default function ClerkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="grid h-full place-content-center">{children}</div>
}
