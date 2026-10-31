import type { ReactNode } from "react";

export function PageHead({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <div className="page-head">
      <div className="kicker">{kicker}</div>
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </div>
  );
}
