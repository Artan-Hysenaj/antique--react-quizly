import DOMpurify from "dompurify";

type QuestionTextProps = {
  text: string;
};

function QuestionText({ text }: QuestionTextProps) {
  return (
    <h1 className="text-lg font-medium">
      Question:{" "}
      <span
        dangerouslySetInnerHTML={{
          __html: DOMpurify.sanitize(text),
        }}
      />
    </h1>
  );
}

export default QuestionText;
