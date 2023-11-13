import { Question } from "@/types";

type QuestionInfoProps = {
  question: Question | undefined;
};

function QuestionInfo({ question }: QuestionInfoProps) {
  return (
    <div className="flex gap-4">
      <h2>Category: {question?.category}</h2>
      <h2>Difficulty: {question?.difficulty}</h2>
      <h2>Type: {question?.type}</h2>
    </div>
  );
}

export default QuestionInfo;
