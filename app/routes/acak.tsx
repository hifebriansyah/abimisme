import { redirect } from "react-router";
import { baitPath, baits } from "~/lib/content";
import { pick } from "~/lib/util";

// /acak sends you to a random bait. It is not pre-rendered: the browser picks one each time.
export function clientLoader() {
  return redirect(baitPath(pick(baits)));
}

export default function Acak() {
  return null;
}
