'use client';
import { BACKGROUND_OPTIONS } from '@/components/BackgroundPatterns/backgrounds';
import Playground from '@/components/BackgroundPatterns/playground';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { useTheme } from 'next-themes'; // ✅ use next-themes

function AllGradientPatterns() {
  const [preview, setPreview] = useState<null | React.ReactNode>(null);
  const { resolvedTheme, setTheme } = useTheme(); // ✅ replaces localStorage
  const theme = (resolvedTheme as "light" | "dark") || "light";

  return (
    <>
      <Toaster position='top-right'/>
      <div className={`${theme}`}>
        <div className="fixed left-0 top-0 -z-10 h-full w-full">
          {preview ? preview : null}
        </div>
        <div className="relative mx-auto h-auto w-[90%]">
          <header className="flex items-center justify-between py-8">
            <div />
          </header>
          <div className="px-0 pb-20 pt-0">
            <div className="grid grid-cols-1 gap-6 pb-6 md:grid-cols-2 lg:grid-cols-2">
              {BACKGROUND_OPTIONS.map((background, index) => (
                <Playground
                  key={index}
                  setPreview={setPreview}
                  theme={theme}
                  setTheme={setTheme}
                >
                  {background.component}
                </Playground>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AllGradientPatterns;