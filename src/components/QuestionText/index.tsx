import DOMpurify from "dompurify";
import { Skeleton } from "@/components/ui/skeleton";

type QuestionTextProps = {
  text: string;
  isLoading: boolean;
};

function QuestionText({ text, isLoading }: QuestionTextProps) {
  return (
    <h1 className="text-lg font-medium flex max-w-2xl">
      Question:
      {isLoading ? (
        <Skeleton className="ml-1 w-full max-w-xl bg-gray-100/10" />
      ) : (
        <span
          className="ml-1"
          dangerouslySetInnerHTML={{
            __html: DOMpurify.sanitize(text),
          }}
        />
      )}
    </h1>
  );
}

export default QuestionText;
