import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ButtonLink } from "./Button";
import { Icon } from "./Icon";

const meta = { title: "Components/Button", component: Button } satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Bagikan" } };
export const Primary: Story = { args: { children: "Soal berikutnya →", primary: true } };
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Icon name="share" /> Bagikan
      </>
    ),
  },
};
export const AsLink: Story = {
  render: () => (
    <ButtonLink primary to="/kitab">
      Buka di kitab →
    </ButtonLink>
  ),
};
