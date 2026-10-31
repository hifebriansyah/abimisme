import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { StoryBody } from "~/components/StoryBody";
import { findStory, readMins, stories } from "~/lib/content";
import { pageMeta } from "~/lib/head";
import { useShare } from "~/lib/share";
import NotFound from "./not-found";

export const meta = ({ params }: { params: Record<string, string | undefined> }) => {
  const s = findStory(params.slug ?? "");
  return pageMeta(s?.title ?? "Kisah", s?.excerpt);
};

export default function Kisah() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { share } = useShare();
  const i = stories.findIndex((s) => s.slug === slug);
  const prev = stories[i - 1];
  const next = stories[i + 1];

  // Arrow keys move between stories
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input, textarea") || e.metaKey || e.ctrlKey) return;
      const to = e.key === "ArrowLeft" ? prev : e.key === "ArrowRight" ? next : null;
      if (to) navigate(`/kisah/${to.slug}`);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [prev, next, navigate]);

  if (i < 0) return <NotFound />;
  const s = stories[i];
  return (
    <article className="reader">
      <Link className="back" to="/kisah">
        ← Semua kisah
      </Link>
      <div className="kicker" style={{ marginTop: 18 }}>
        Kisah {i + 1} dari {stories.length}
      </div>
      <h1>{s.title}</h1>
      <div className="meta">
        <span>± {readMins(s.body)} menit baca</span>
        <span>·</span>
        <span>{s.refs.length} nasihat</span>
        <Button onClick={() => share(`/kisah/${s.slug}`, s.title)}>
          <Icon name="share" /> Bagikan
        </Button>
      </div>
      <StoryBody body={s.body} />
      <nav className="pager">
        {prev && (
          <Link className="card" to={`/kisah/${prev.slug}`}>
            ← Sebelumnya<b>{prev.title}</b>
          </Link>
        )}
        {next && (
          <Link className="card next" to={`/kisah/${next.slug}`}>
            Berikutnya →<b>{next.title}</b>
          </Link>
        )}
      </nav>
    </article>
  );
}
