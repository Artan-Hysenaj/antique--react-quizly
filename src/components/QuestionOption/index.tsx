import { cn } from "@/lib/utils";
import DOMpurify from "dompurify";
import { Question } from "@/types";
import { CheckCircledIcon } from "@radix-ui/react-icons";

type indexProps = {
  option: string;
  questionIndex: number;
  onClick: () => void;
  answers: Map<number, string>;
  question: Question;
};

function QuestionOption({
  option,
  questionIndex,
  onClick,
  answers,
  question,
}: indexProps) {
  const selectedAnswer = answers.get(questionIndex);
  const correctAnswer = selectedAnswer && option === question?.correct_answer;

  return (
    <li
      onClick={() => {
        if (selectedAnswer) {
          return;
        }
        onClick();
      }}
      className={cn(
        "relative bg-transparent border border-gray-100/10 p-4 rounded-md cursor-pointer",
        {
          "bg-green-700": correctAnswer,
          "bg-red-700": !correctAnswer && selectedAnswer,
          "bg-orange-500": !correctAnswer && selectedAnswer === option,
          "hover:bg-gray-100/10 ": !selectedAnswer,
        }
      )}
    >
      <div
        dangerouslySetInnerHTML={{
          __html: DOMpurify.sanitize(option),
        }}
      />
      {selectedAnswer === option && (
        <CheckCircledIcon className="absolute right-2 top-[calc(50%-10px)] w-5 h-5" />
      )}
    </li>
  );
}

export default QuestionOption;
