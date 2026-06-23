import * as React from "react";

/**
 * Phone-framed preview wrapper for live demos.
 * Renders children inside an iOS-sized card so the sheet looks at home.
 */
export default function DemoBox({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="phone-preview">{children}</div>
      {title ? <p className="demo-caption">{title}</p> : null}
    </div>
  );
}
