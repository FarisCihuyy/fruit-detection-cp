const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="grid grid-cols-12 min-h-screen bg-secondary">
      {children}
    </main>
  );
};

export default AuthLayout;
