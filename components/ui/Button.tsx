import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/utils";

type Variant = "primary" | "coral" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary: "btn-primary",
  coral: "btn-coral",
  outline: "btn-outline",
  ghost: "btn-ghost",
};
const SIZE: Record<Size, string> = { sm: "btn-sm", md: "", lg: "btn-lg" };

type Common = {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  children: ReactNode;
  className?: string;
};

type ButtonProps = Common &
  Omit<ComponentProps<"button">, "className"> & { href?: undefined };
type LinkProps = Common &
  Omit<ComponentProps<typeof Link>, "className"> & { href: string };

export function Button(props: ButtonProps | LinkProps) {
  const {
    variant = "primary",
    size = "md",
    block,
    className,
    children,
    ...rest
  } = props;
  const cls = cx("btn", VARIANT[variant], SIZE[size], block && "btn-block", className);

  if ("href" in props && props.href !== undefined) {
    const { href, ...linkRest } = rest as LinkProps;
    return (
      <Link href={href} className={cls} {...linkRest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} {...(rest as ComponentProps<"button">)}>
      {children}
    </button>
  );
}
