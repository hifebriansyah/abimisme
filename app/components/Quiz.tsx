import { useEffect, useState } from "react";
import { Link } from "react-router";
import { asliOf, babTitle, baitPath, baits as allBaits, type Bait } from "~/lib/content";
import { store } from "~/lib/storage";
import { pick, shuffle } from "~/lib/util";
import { Button } from "./Button";
import { Icon } from "./Icon";

const BEST_KEY = "abim-best";
const key = (b: Bait) => `${b.bab}:${b.no}`;

function newQuestion(pool: Bait[]) {
  const q = pick(pool);
  const options = shuffle([q, ...shuffle(pool.filter((b) => b !== q)).slice(0, 3)]);
  return { q, options };
}

export type QuizProps = { pool?: Bait[] };

export function Quiz({ pool = allBaits }: QuizProps) {
  const [score, setScore] = useState({ right: 0, asked: 0, streak: 0, best: 0 });
  // The page is pre-rendered, so the first question is drawn once the page is in the browser.
  const [question, setQuestion] = useState<ReturnType<typeof newQuestion> | null>(null);
  useEffect(() => {
    setQuestion(newQuestion(pool));
    setScore((s) => ({ ...s, best: Number(store.get(BEST_KEY) ?? 0) }));
  }, [pool]);
  const [answer, setAnswer] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<React.ReactNode>("");

  if (!question) return <section className="quiz card" />;
  const { q, options } = question;

  const choose = (o: Bait) => {
    const right = o === q;
    const streak = right ? score.streak + 1 : 0;
    const best = Math.max(score.best, streak);
    if (best > score.best) store.set(BEST_KEY, String(best));
    setScore({ right: score.right + (right ? 1 : 0), asked: score.asked + 1, streak, best });
    setAnswer(key(o));
    setVerdict(
      right
        ? pick([
            <>
              Betul! Bapak bangga. <Icon name="thumbsUp" />
            </>,
            "Mantap, calon bapak-bapak sejati.",
            "Nah, gitu dong. Pinter.",
            <>
              Benar! {streak} beruntun. <Icon name="flame" />
            </>,
          ])
        : pick(["Salah. Kurang sering dinasihati, ya?", "Hmm, bukan itu, Nak.", "Belum tepat. Coba dengarkan bapakmu lagi."]),
    );
  };

  const next = () => {
    setQuestion(newQuestion(pool));
    setAnswer(null);
    setVerdict("");
  };

  return (
    <section className="quiz card">
      <div className="score">
        <span>
          Benar{" "}
          <b>
            {score.right}/{score.asked}
          </b>
        </span>
        <span>
          Beruntun <b>{score.streak}</b>
        </span>
        <span>
          Rekor <b>{score.best}</b>
        </span>
      </div>
      <div className="kicker">
        Jilid {q.jilid} · Bab {q.bab}: {babTitle(q.bab)}
      </div>
      <div className="poem">
        {q.verses.map((v, i) => (
          <span key={v.sub}>
            {i > 0 && <br />}
            {v.text}
          </span>
        ))}
      </div>
      <div className="opts">
        {options.map((o) => {
          const picked = answer === key(o);
          const cls = answer && key(o) === key(q) ? " right" : picked ? " wrong" : "";
          return (
            <button key={key(o)} className={`opt${cls}`} disabled={answer !== null} onClick={() => choose(o)}>
              “{asliOf(o)}”
            </button>
          );
        })}
      </div>
      <p className="verdict" aria-live="polite">
        {verdict}
      </p>
      {answer !== null && (
        <div className="row">
          <Button primary onClick={next}>
            Soal berikutnya →
          </Button>
          <Link className="btn" to={baitPath(q)}>
            Lihat di kitab
          </Link>
        </div>
      )}
    </section>
  );
}
