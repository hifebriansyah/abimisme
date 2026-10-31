import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "~/components/Button";
import { Icon, type IconName } from "~/components/Icon";
import { Wordmark, logoSrc } from "~/components/AppBar";
import {
  asliOf,
  babTitle,
  babs,
  baitCode,
  baitPagePath,
  baitPath,
  baits,
  dailyBaits,
  jilids,
  stories,
  type Bait,
} from "~/lib/content";
import { pageMeta } from "~/lib/head";
import { useShare } from "~/lib/share";
import { pick } from "~/lib/util";

export const meta = () => pageMeta();

const DOORS: { to: string; icon: IconName; title: string; text: string }[] = [
  { to: "/kitab", icon: "scroll", title: "Kitab", text: "Jilid, bab, bait, dan baris. Pilih baris, bagikan tautannya." },
  { to: "/kisah", icon: "coffee", title: "Kisah", text: "Cerita Pak Abi dan anak-anaknya, lengkap dengan rujukan." },
  { to: "/kata-bapak", icon: "quote", title: "Kutipan", text: "Kutipan aslinya. Balik kartunya, lihat versi kitabnya." },
  { to: "/tebak", icon: "target", title: "Tebak", text: "Bait puitis ini aslinya bapak ngomong apa?" },
];

export function Daily({ bait, onAgain }: { bait: Bait; onAgain: () => void }) {
  const { share } = useShare();
  const [poem, setPoem] = useState(false);
  const code = baitCode(bait);
  return (
    <section className="daily card">
      <div className="kicker">Nasihat hari ini</div>
      <p className="quote">{bait.verses.map((v) => v.text).join(" ")}</p>
      {poem && <p className="poem">“{asliOf(bait)}”</p>}
      <div className="row">
        <Button primary onClick={() => setPoem(!poem)}>
          <Icon name="quote" /> {poem ? "Sembunyikan" : "Kutipan"}
        </Button>
        <Button
          onClick={() => {
            setPoem(false);
            onAgain();
          }}
        >
          <Icon name="dice" /> Lainnya
        </Button>
        <Button onClick={() => share(baitPagePath(bait), `Nasihat ${code}`)}>
          <Icon name="share" /> Bagikan
        </Button>
        <Link className="ref" to={baitPath(bait)} style={{ marginLeft: "auto" }}>
          {babTitle(bait.bab)} · {code} →
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  // The page is pre-rendered, so it starts on a fixed bait and swaps to a random one once it is in the browser.
  const [today, setToday] = useState<Bait>(() => dailyBaits()[0]);
  useEffect(() => setToday(pick(dailyBaits())), []);
  const again = () => {
    const pool = dailyBaits();
    let next: Bait;
    do next = pick(pool);
    while (pool.length > 1 && next === today);
    setToday(next);
  };
  return (
    <>
      <section className="hero">
        <img className="hero-logo" src={logoSrc} alt="Logo abimisme" width="640" height="538" />
        <div className="kicker">Kitab Nasihat Bapak-Bapak</div>
        <h1>
          <Wordmark />
        </h1>
        <p>
          Nasihat bapak-bapak Indonesia yang bijak, nyeleneh dan bikin “iya juga ya”. Dikompilasi jadi kitab puitis, lengkap
          dengan kisahnya.
        </p>
      </section>
      <Daily bait={today} onAgain={again} />
      <div className="doors">
        {DOORS.map((d) => (
          <Link className="door card" to={d.to} key={d.to}>
            <div className="emo">
              <Icon name={d.icon} />
            </div>
            <h3>{d.title}</h3>
            <p>{d.text}</p>
          </Link>
        ))}
      </div>
      <div className="stats">
        <div>
          <b>{jilids.length}</b>jilid
        </div>
        <div>
          <b>{babs.length}</b>bab
        </div>
        <div>
          <b>{baits.length}</b>nasihat
        </div>
        <div>
          <b>{stories.length}</b>kisah
        </div>
      </div>
    </>
  );
}
