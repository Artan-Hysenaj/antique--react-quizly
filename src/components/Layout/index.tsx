import Header from "@/components/Header";
import { Question, QuizAction, QuizState } from "@/types";
import { Fragment, PropsWithChildren } from "react";
import Footer from "@/components/Footer";
import { Button } from "../ui/button";

type LayoutProps = {
  questionIndex: number;
  dispatch: React.Dispatch<QuizAction>;
  questions: Question[] | undefined;
  status: QuizState["status"];
};

function Layout({
  children,
  dispatch,
  questions,
  questionIndex,
  status,
}: PropsWithChildren<LayoutProps>) {
  const questionProgress = `${questionIndex + 1}/${questions?.length}`;

  return (
    <div className="max-w-5xl mt-36 mx-auto">
      <Header />
      {questions ? (
        <Fragment>
          <main className="min-h-[25rem]">{children}</main>
          <Footer
            dispatch={dispatch}
            questionProgress={questionProgress}
            status={status}
          />
        </Fragment>
      ) : (
        <div className="flex justify-center items-center h-[25rem]">
          <div>
            <p>
              Something went wrong, please refresh the page or try again later.
            </p>
            <Button
              variant="secondary"
              className="mx-auto mt-4 block"
              onClick={() => {
                window.location.reload();
              }}
            >
              Refresh Page
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Layout;
