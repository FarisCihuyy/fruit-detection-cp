const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="px-3 md:px-6 *:border-b *:border-primary *:py-12 *:last:border-b-0">
      {children}
    </main>
  );
};

export default BlogLayout;
