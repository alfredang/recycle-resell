export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8">{children}</div>
    </div>
  )
}
