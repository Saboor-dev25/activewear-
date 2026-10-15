import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { href?: never; children: ReactNode };
type LinkButtonProps = { href: string; children: ReactNode; className?: string; target?: string; rel?: string };

export function Button(props: ButtonProps): ReactNode;
export function Button(props: LinkButtonProps): ReactNode;
export function Button(props: ButtonProps | LinkButtonProps) {
  if (typeof props.href === "string") {
    const { href, children, ...linkProps } = props;
    return <Link href={href} {...linkProps}>{children}</Link>;
  }
  return <button {...props} />;
}
