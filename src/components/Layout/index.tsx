import Header from "@/components/Header";
import { PropsWithChildren } from "react";

function Layout({ children }: PropsWithChildren) {
  return (
    <div className="container">
      <Header />
      <main>{children}</main>
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;
