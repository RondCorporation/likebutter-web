'use client';

import { ReactNode } from 'react';

export default function StudioMainClient({
  children,
  lang,
}: {
  children: ReactNode;
  lang: string;
}) {
  return (
    <section className="flex flex-1 flex-col overflow-hidden">
      <header className="hidden h-[73px] flex-shrink-0 items-center justify-between border-b border-white/10 p-6 md:flex">
        <h2 className="text-2xl font-semibold">Studio2</h2>
      </header>
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-6">{children}</div>
      </main>
    </section>
  );
}
