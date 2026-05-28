const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="px-3 md:px-6 pt-12 md:pt-0 *:border-b-[1.5px] *:border-primary/10 *:py-12 *:last:border-b-0">
      {children}
    </main>
  );
};

export default BlogLayout;
