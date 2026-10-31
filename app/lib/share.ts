import { useCallback } from "react";
import { useToast } from "~/components/Toast";

// the site may be served from a folder (BASE_URL "/for-fun/abimisme/"); Storybook uses a relative base, so no prefix there
const folder = import.meta.env.BASE_URL.startsWith("/") ? import.meta.env.BASE_URL.replace(/\/$/, "") : "";
const linkTo = (path: string) => `${location.origin}${folder}${path}`;

/** Copy text, or share an address of the site (native share sheet on phones, copied link elsewhere). */
export function useShare() {
  const say = useToast();
  const copy = useCallback(
    async (text: string, message = "Disalin") => {
      try {
        await navigator.clipboard.writeText(text);
        say(message);
      } catch {
        say("Gagal menyalin");
      }
    },
    [say],
  );
  const share = useCallback(
    async (path: string, title: string) => {
      const url = linkTo(path);
      if (navigator.share && matchMedia("(pointer: coarse)").matches) {
        try {
          await navigator.share({ title, url });
          return;
        } catch (e) {
          if (e instanceof Error && e.name === "AbortError") return;
        }
      }
      copy(url, "Tautan disalin — tinggal tempel");
    },
    [copy],
  );
  return { copy, share, linkTo };
}
