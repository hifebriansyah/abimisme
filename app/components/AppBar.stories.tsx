import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppBar } from "./AppBar";

const meta = { title: "Components/AppBar", component: AppBar } satisfies Meta<typeof AppBar>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
