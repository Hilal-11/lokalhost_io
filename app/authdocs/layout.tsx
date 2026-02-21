import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { authsource } from '@/lib/source';
import { baseOptions2 } from '../layout.config';
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className=''> 
      <DocsLayout tabMode='auto' tree={authsource.pageTree}
        {...baseOptions2}
        sidebar={{
          defaultOpenLevel: 1,
        }}
      >
         {children}
      </DocsLayout>
    </div>
  );
}



