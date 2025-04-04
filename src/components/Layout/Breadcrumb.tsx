// components/ui/breadcrumb.tsx
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  crumbs: Crumb[];
}

export function Breadcrumb({ crumbs }: BreadcrumbProps) {
  return (
    <>
      {" "}
      <nav
        className="flex items-center text-base text-muted-foreground space-x-1 mt-6 mb-4 px-6 "
        aria-label="Breadcrumb"
      >
        {crumbs.map((crumb, index) => (
          <span key={index} className="flex items-center space-x-1">
            {index > 0 && <ChevronRight className="w-4 h-4" />}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="hover:font-semibold text-foreground"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="font-semibold text-foreground">
                {crumb.label}
              </span>
            )}
          </span>
        ))}
      </nav>
      <div className="h-0.5 bg-black/30 mx-6 rounded-full" />
    </>
  );
}
