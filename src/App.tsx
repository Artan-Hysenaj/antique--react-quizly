import { BASE_API_URL } from "@/constants";
import { Fragment, useCallback, useEffect, useMemo, useReducer } from "react";
import Layout from "@/components/Layout";
import QuestionText from "@/components/QuestionText";
import QuestionInfo from "@/components/QuestionInfo";
import type { QuizAction, QuizState } from "@/types";
import { Skeleton } from "./components/ui/skeleton";
import QuestionOption from "./components/QuestionOption";

function reducer(state: QuizState, action: QuizAction) {
  const stateUpdater = (newState: Partial<QuizState>) => ({
    ...state,
    ...newState,
  });
  switch (action.type) {
    case "SET_QUESTION":
      return stateUpdater({
        status: "ready",
        questions: action.payload,
      });

    case "SET_ERROR":
      return stateUpdater({ status: "error" });

    case "NEXT_QUESTION":
      if (state.questionIndex + 1 === state.questions.length) {
        return stateUpdater({ status: "finished" });
      }
      return stateUpdater({ questionIndex: state.questionIndex + 1 });

    case "SET_ANSWER":
      return stateUpdater({
        answers: state.answers.set(state.questionIndex, action.payload?.answer),
      });

    case "START_QUIZ":
      return stateUpdater({
        status: "active",
      });

    case "RESET_QUIZ":
      state.answers.clear();
      return initialState;

    case "FINISH_QUIZ":
      return stateUpdater({
        status: "finished",
      });

    default:
      throw new Error("Invalid action type");
  }
}

const initialState: QuizState = {
  status: "loading",
  questionIndex: 0,
  questions: [],
  answers: new Map(),
};

function App() {
  const [{ questionIndex, answers, questions, status }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const isLoading = status === "loading";

  const question = questions?.[questionIndex];

  const options = useMemo(() => {
    const randomIndex = Math.round(Math.random() * 3);
    const optionsCopy = question?.incorrect_answers.slice();
    optionsCopy?.splice(randomIndex, 0, question?.correct_answer ?? "");
    return optionsCopy;
  }, [question]);

  const getQuestions = useCallback(() => {
    fetch(BASE_API_URL + "/api.php?amount=10")
      .then((res) => res.json())
      .then((response) => {
        dispatch({
          type: "SET_QUESTION",
          payload: response.results,
        });
        dispatch({ type: "START_QUIZ" });
      })
      .catch(() => {
        dispatch({ type: "SET_ERROR" });
      });
  }, []);

  useEffect(() => {
    if (!questions?.length) {
      getQuestions();
    }
  }, [questions, getQuestions]);

  if (status === "error") return <div>failed to load</div>;

  return (
    <Layout
      questionIndex={questionIndex}
      questions={questions}
      dispatch={dispatch}
      status={status}
    >
      {status === "finished" && (
        <div className="text-center">
          <h1 className="text-3xl font-bold">Quiz Finished!</h1>
          <p>
            You got{" "}
            {
              questions?.filter((question, index) => {
                return question.correct_answer === answers.get(index);
              }).length
            }{" "}
            / {questions?.length} correct
          </p>
          <button
            className="mt-6 bg-blue-500 text-white font-bold py-2 px-4 rounded-md"
            onClick={() => {
              dispatch({ type: "RESET_QUIZ" });
            }}
          >
            Restart
          </button>
        </div>
      )}
      {status === "loading" && (
        <Fragment>
          <Skeleton className="w-9/12 h-8 bg-gray-400 mb-2" />
          <Skeleton className="w-8/12 h-6 bg-gray-400" />
          <ul className="font-bold space-y-2 my-6">
            <li>
              <Skeleton className="h-14 bg-gray-500" />
            </li>
            <li>
              <Skeleton className="h-14 bg-gray-500" />
            </li>
            <li>
              <Skeleton className="h-14 bg-gray-500" />
            </li>
            <li>
              <Skeleton className="h-14 bg-gray-500" />
            </li>
          </ul>
        </Fragment>
      )}
      {status === "active" && (
        <Fragment>
          <QuestionText text={question?.question ?? ""} isLoading={isLoading} />
          <QuestionInfo question={question} />
          <ul className="font-bold space-y-2 my-6">
            {options?.map((option, index) => {
              return (
                <QuestionOption
                  key={index}
                  option={option}
                  questionIndex={questionIndex}
                  answers={answers}
                  question={question}
                  onClick={() => {
                    dispatch({
                      type: "SET_ANSWER",
                      payload: { questionIndex: questionIndex, answer: option },
                    });
                  }}
                />
              );
            })}
          </ul>
        </Fragment>
      )}
    </Layout>
  );
}

export default App;
