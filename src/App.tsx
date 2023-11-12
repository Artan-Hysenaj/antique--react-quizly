import { BASE_API_URL } from "@/constants";
import useSWR, { Fetcher } from "swr";
import { QuestionsData } from "@/types";
import DOMpurify from "dompurify";
import { useMemo, useState } from "react";
import { cn } from "./lib/utils";
import Layout from "@/components/Layout";

const fetcher: Fetcher<QuestionsData, string> = (...args) => {
  return fetch(BASE_API_URL + args).then((res) => res.json());
};

function App() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const { data, error } = useSWR<QuestionsData>(
    ["/api.php?amount=10"],
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
    }
  );

  const question = useMemo(
    () => data?.results[questionIndex],
    [data?.results, questionIndex]
  );
  const options = useMemo(() => {
    const randomIndex = Math.round(Math.random() * 3);
    const optionsCopy = question?.incorrect_answers.slice();
    optionsCopy?.splice(randomIndex, 0, question?.correct_answer ?? "");
    return optionsCopy;
  }, [question]);

  console.log(question, options);

  if (error) return <div>failed to load</div>;

  return (
    <Layout>
      <ol className="flex justify-around p-4 my-4">
        {data?.results.map((_, index) => (
          <li
            key={index}
            className={cn(
              "text-gray-500 border-2 border-gray-500 rounded px-4 py-1 cursor-pointer hover:border-blue-300",
              {
                "text-blue-500 border-blue-500": index === questionIndex,
              }
            )}
            onClick={() => setQuestionIndex(index)}
          >
            {index + 1}
          </li>
        ))}
      </ol>
      <h1 className="text-lg font-medium">
        Question:{" "}
        <span
          dangerouslySetInnerHTML={{
            __html: DOMpurify.sanitize(question?.question ?? ""),
          }}
        />
      </h1>
      <div className="flex gap-4">
        <h2>Category: {question?.category}</h2>
        <h2>Difficulty: {question?.difficulty}</h2>
        <h2>Type: {question?.type}</h2>
      </div>
      <ul className="font-bold space-y-2">
        {options?.map((option, index) => (
          <li
            key={index}
            className="bg-gray-100 p-4 rounded-md"
            dangerouslySetInnerHTML={{
              __html: DOMpurify.sanitize(option),
            }}
          ></li>
        ))}
      </ul>
    </Layout>
  );
}

export default App;
