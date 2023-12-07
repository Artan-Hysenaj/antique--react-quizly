import { Question } from "@/types";
import DOMpurify from "dompurify";

type QuestionInfoProps = {
  question: Question | undefined;
};

function QuestionInfo({ question }: QuestionInfoProps) {
  return (
    <div className="flex gap-4">
      <h2>
        Category:{" "}
        <span
          dangerouslySetInnerHTML={{
            __html: DOMpurify.sanitize(question?.category ?? ""),
          }}
        />
      </h2>
      <h2>Difficulty: {question?.difficulty}</h2>
      <h2>Type: {question?.type}</h2>
    </div>
  );
}

export default QuestionInfo;
