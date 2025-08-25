
import type { ReactElement } from "react";

export default function AdminSectionLayout({ children }: { children: ReactElement }) {
  // The authentication logic and main layout are now handled by the root layout (src/app/layout.tsx)
  // This layout file is now just a pass-through for the children.
  return <>{children}</>;
}
