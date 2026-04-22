import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { backgroundsource } from '@/lib/source';
import { baseOptions, baseOptions2 } from '@/app/layout.config';
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className=''> 
          <DocsLayout tabMode='auto' tree={backgroundsource.pageTree}
            {...baseOptions}
            sidebar={{
              defaultOpenLevel: 1,
            }}
          >
             {children}
          </DocsLayout>
        </div>
  );
}