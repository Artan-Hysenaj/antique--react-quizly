import Header from "@/components/Header";
import { Question, QuizAction } from "@/types";
import { PropsWithChildren } from "react";
import Footer from "@/components/Footer";

type LayoutProps = {
  questionIndex: number;
  dispatch: React.Dispatch<QuizAction>;
  questions: Question[] | undefined;
};

function Layout({ children, dispatch }: PropsWithChildren<LayoutProps>) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer dispatch={dispatch} />
    </div>
  );
}

export default Layout;
