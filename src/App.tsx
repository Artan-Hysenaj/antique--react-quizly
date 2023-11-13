import { BASE_API_URL } from "@/constants";
import useSWR, { Fetcher } from "swr";
import { QuestionsData, QuizAction, QuizState } from "@/types";
import DOMpurify from "dompurify";
import { useMemo, useReducer } from "react";
import Layout from "@/components/Layout";
import QuestionText from "@/components/QuestionText";
import QuestionInfo from "@/components/QuestionInfo/QuestionInfo";
import { cn } from "./lib/utils";

const fetcher: Fetcher<QuestionsData, string> = (...args) => {
  return fetch(BASE_API_URL + args).then((res) => res.json());
};

function reducer(state: QuizState, action: QuizAction) {
  const stateUpdater = (newState: Partial<QuizState>) => ({
    ...state,
    ...newState,
  });
  switch (action.type) {
    case "NEXT_QUESTION":
      return stateUpdater({ questionIndex: state.questionIndex + 1 });

    case "SET_ANSWER":
      return stateUpdater({
        answers: state.answers.set(
          state.questionIndex,
          action.payload?.answer as string
        ),
      });

    default:
      throw new Error("Invalid action type");
  }
}

const initialState: QuizState = {
  questionIndex: 0,
  questions: [],
  answers: new Map(),
};

function App() {
  const [{ questionIndex, answers }, dispatch] = useReducer(
    reducer,
    initialState
  );

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

  if (error) return <div>failed to load</div>;

  return (
    <Layout
      questionIndex={questionIndex}
      questions={data?.results}
      dispatch={dispatch}
    >
      <QuestionText text={question?.question ?? ""} />
      <QuestionInfo question={question} />
      <ul className="font-bold space-y-2 my-6">
        {options?.map((option, index) => {
          const selectedAnswer = answers.get(questionIndex);
          const correctAnswer =
            selectedAnswer && option === question?.correct_answer;
          return (
            <li
              key={index}
              onClick={() => {
                if (selectedAnswer) {
                  return;
                }
                dispatch({
                  type: "SET_ANSWER",
                  payload: { questionIndex: questionIndex, answer: option },
                });
              }}
              className={cn("bg-gray-100 p-4 rounded-md cursor-pointer", {
                "bg-green-600": correctAnswer,
                "bg-red-600": !correctAnswer,
                "translate-x-2": selectedAnswer === option,
                "hover:translate-x-2": !selectedAnswer,
              })}
              dangerouslySetInnerHTML={{
                __html: DOMpurify.sanitize(option),
              }}
            ></li>
          );
        })}
      </ul>
    </Layout>
  );
}

export default App;
