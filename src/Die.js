export default function Die({ value, isHeld, holdDice, dots }) {
  return (
    <div
      className={`die-face ${dots && `num${value}`} ${isHeld && "held"}`}
      onClick={holdDice}
    >
      <h2 className="die-num">{!dots && value}</h2>
    </div>
  );
}
