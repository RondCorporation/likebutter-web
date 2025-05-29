export default function Footer() {
  return (
    <footer className="snap-end flex-none space-y-4 bg-black/90 px-6 py-10 text-xs text-slate-400">
      <div className="flex flex-wrap gap-8">
        <div>
          <p className="mb-2 font-semibold text-accent">LIKEBUTTER</p>
          <p>© 2025 LikeButter. All rights reserved.</p>
        </div>

        <nav className="space-y-1">
          <p className="font-semibold text-accent">Links</p>
          <a href="https://twitter.com" className="hover:text-accent">
            Twitter
          </a>
          <br />
          <a href="mailto:biz@likebutter.ai" className="hover:text-accent">
            제휴 문의
          </a>
          <br />
          <a href="/privacy" className="hover:text-accent">
            개인정보 처리방침
          </a>
        </nav>
      </div>
    </footer>
  );
}
