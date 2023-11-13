import { Button, buttonVariants } from "@/components/ui/button";
import { QuizAction } from "@/types";
import { useEffect, useState } from "react";

type FooterProps = {
  dispatch: React.Dispatch<QuizAction>;
};

function Footer({ dispatch }: FooterProps) {
  const [timer, setTimer] = useState(0);
  function handleNextQuestion() {
    dispatch({ type: "NEXT_QUESTION" });
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimer((prevState) => prevState - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [setTimer, dispatch]);
  return (
    <footer className="flex justify-between">
      <div
        className={buttonVariants({
          variant: "outline",
          className: "min-w-[5rem]",
        })}
      >
        {timer}
      </div>
      <Button variant="outline" onClick={handleNextQuestion}>
        Next Question
      </Button>
    </footer>
  );
}

export default Footer;
