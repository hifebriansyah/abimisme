import type { ComponentProps } from "react";
import { Link } from "react-router";

type Props = { primary?: boolean };

export function Button({ primary, className = "", ...rest }: Props & ComponentProps<"button">) {
  return <button className={`btn${primary ? " primary" : ""} ${className}`.trim()} {...rest} />;
}

export function ButtonLink({ primary, className = "", ...rest }: Props & ComponentProps<typeof Link>) {
  return <Link className={`btn${primary ? " primary" : ""} ${className}`.trim()} {...rest} />;
}
