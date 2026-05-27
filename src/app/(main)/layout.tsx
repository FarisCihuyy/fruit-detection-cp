import RandomFloatingBox from "@/components/RandomFloatingBox";
import ClientLayout from "./ClientLayout";

const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClientLayout>
      <RandomFloatingBox />
      {children}
    </ClientLayout>
  );
};

export default BlogLayout;
