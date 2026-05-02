import React from "react";
import { SlideUp } from "@/components/animations/SlideUp";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <SlideUp>
      <div
        className={cn(
          "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8",
          className
        )}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-text-muted mt-1">{description}</p>
          )}
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </SlideUp>
  );
}
