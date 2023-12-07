import { Button, buttonVariants } from "@/components/ui/button";
import { QuizAction, QuizState } from "@/types";
import { useDeferredValue, useEffect, useState } from "react";

type FooterProps = {
  dispatch: React.Dispatch<QuizAction>;
  questionProgress: string;
  status: QuizState["status"];
};

// 5 minutes in seconds
const MAX_TIME = 5 * 60;

function Footer({ dispatch, questionProgress, status }: FooterProps) {
  const [timer, setTimer] = useState(MAX_TIME);
  const deferredQuestionProgress = useDeferredValue(questionProgress);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  function handleNextQuestion() {
    dispatch({ type: "NEXT_QUESTION" });
  }

  useEffect(() => {
    if (status !== "active") {
      setTimer(MAX_TIME);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prevState) => {
        if (prevState === 0) {
          dispatch({ type: "FINISH_QUIZ" });
          return MAX_TIME;
        }
        return prevState - 1;
      });
    }, 1000);
    return () => clearTimeout(interval);
  }, [status, setTimer, dispatch]);

  return (
    <footer className="flex justify-between">
      <div
        className={buttonVariants({
          size: "default",
          className: "min-w-[5rem] border",
        })}
      >
        <span className="font-medium">
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </span>
      </div>
      <div className="space-x-2">
        <div
          className={buttonVariants({
            size: "default",
            className: "min-w-[5rem] border",
          })}
        >
          {deferredQuestionProgress}
        </div>
        <Button variant="outline" onClick={handleNextQuestion}>
          Next Question
        </Button>
      </div>
    </footer>
  );
}

export default Footer;
