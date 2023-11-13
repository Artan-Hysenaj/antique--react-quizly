export type Question = {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
};

export type QuestionsData = {
  response_code: number;
  results: Question[];
};

export type QuizState = {
  questionIndex: number;
  questions: Question[];
  answers: Map<number, string>;
};

export type QuizAction = {
  type: "SET_ANSWER" | "NEXT_QUESTION" | "RESET_QUIZ";
  payload?: {
    [key: string]: unknown;
  };
};
