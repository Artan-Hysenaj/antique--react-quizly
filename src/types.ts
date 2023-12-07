export type Question = {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: "boolean" | "multiple";
};

export type QuestionsData = {
  response_code: number;
  results: Question[];
};

export type QuizState = {
  status: "loading" | "error" | "ready" | "active" | "finished";
  questionIndex: number;
  questions: Question[];
  answers: Map<number, string>;
};

export type QuizAction = {
  type:
    | "SET_QUESTION"
    | "SET_ERROR"
    | "SET_ANSWER"
    | "NEXT_QUESTION"
    | "START_QUIZ"
    | "RESET_QUIZ"
    | "FINISH_QUIZ";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
};
