function Progress({ index, points, numQuestions, answer, maxPossiblePoints }) {
  return (
    <header className="progress">
      <progress
        value={index + Number(answer !== null)}
        max={numQuestions}
      ></progress>
      <p>
        Question <strong>{index + 1}</strong> /15
      </p>
      <p>
        <strong>{points}</strong> / {maxPossiblePoints}
      </p>
    </header>
  );
}

export default Progress;
