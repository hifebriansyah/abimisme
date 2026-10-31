import { Link } from "react-router";
import { Icon } from "~/components/Icon";
import { ButtonLink } from "~/components/Button";
import { pageMeta } from "~/lib/head";

export const meta = () => [...pageMeta("Tidak ditemukan"), { name: "robots", content: "noindex" }];

export default function NotFound() {
  return (
    <div className="page-head" style={{ textAlign: "center", padding: "40px 0" }}>
      <div style={{ fontSize: "3rem", color: "var(--accent)" }}>
        <Icon name="compass" />
      </div>
      <h1>Nyasar, Nak?</h1>
      <p>
        Tatkala simpang jalan mengaburkan arah, rendahkanlah hati untuk bertanya. <Link to="/kitab/1/1/3/1-2">(1:1:3:1–2)</Link>
      </p>
      <p style={{ marginTop: 20 }}>
        <ButtonLink primary to="/">
          Pulang ke beranda
        </ButtonLink>
      </p>
    </div>
  );
}
