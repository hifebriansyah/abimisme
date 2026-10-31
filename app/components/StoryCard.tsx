import { Link } from "react-router";
import { readMins, type Story } from "~/lib/content";

export function StoryCard({ story, index }: { story: Story; index: number }) {
  const jilids = [...new Set(story.refs.map((r) => r.jilid))];
  const babs = [...new Set(story.refs.map((r) => r.bab))];
  return (
    <Link className="story-card card" to={`/kisah/${story.slug}`}>
      <div className="kicker">
        Kisah {index + 1}
        {story.who ? ` · bersama ${story.who}` : ""}
      </div>
      <h2>{story.title}</h2>
      <p>{story.excerpt}</p>
      <div className="tags">
        <span className="tag">± {readMins(story.body)} menit</span>
        <span className="tag">{story.refs.length} nasihat</span>
        {jilids.map((j) => (
          <span className="tag" key={`j${j}`}>
            Jilid {j}
          </span>
        ))}
        {babs.map((b) => (
          <span className="tag" key={`b${b}`}>
            Bab {b}
          </span>
        ))}
      </div>
    </Link>
  );
}
