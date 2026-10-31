import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "./Icon";

const NAMES = [
  "share",
  "copy",
  "sun",
  "moon",
  "scroll",
  "coffee",
  "quote",
  "target",
  "dice",
  "book",
  "flip",
  "compass",
  "close",
  "thumbsUp",
  "flame",
] as const;

const meta = { title: "Components/Icon", component: Icon } satisfies Meta<typeof Icon>;
export default meta;

export const All: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 28, color: "var(--accent)" }}>
      {NAMES.map((n) => (
        <span key={n} title={n}>
          <Icon name={n} />
        </span>
      ))}
    </div>
  ),
};
