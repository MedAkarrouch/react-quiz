import { useEffect, useReducer } from "react";
import Header from "./Header";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Error from "./Error";
import Loader from "./Loader";
import Main from "./Main";
import FinishScreen from "./FinishScreen";
import Progress from "./Progress";
import Timer from "./Timer";
const SECS_PER_QUESTION = 30;
const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        status: "ready",
        questions: action.payload,
      };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions[state.index];
      console.log(question);
      return {
        ...state,
        answer: action.payload,
        points:
          question.correctOption === action.payload
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        ...initialState,
        status: "ready",
        highscore: state.highscore,
        questions: state.questions,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining < 1 ? "finished" : state.status,
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    default:
      throw new Error("Error");
  }
}
function App() {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (acc, curr) => curr.points + acc,
    0
  );
  useEffect(() => {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch(() => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <div className="app">
      <Header numQuestions={numQuestions} />
      <Main>
        {status === "error" && <Error />}
        {status === "loading" && <Loader />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              points={points}
              numQuestions={numQuestions}
              answer={answer}
              maxPossiblePoints={maxPossiblePoints}
            />
            <Question
              question={questions[index]}
              answer={answer}
              dispatch={dispatch}
            />
            <footer>
              <Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
              <NextButton
                index={index}
                questions={questions}
                answer={answer}
                dispatch={dispatch}
              />
            </footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            highscore={highscore}
            points={points}
            numQuestions={numQuestions}
            maxPossiblePoints={maxPossiblePoints}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
