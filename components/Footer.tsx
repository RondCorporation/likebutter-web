export default function Footer() {
  return (
    <footer className="snap-end flex-none space-y-4 bg-black/90 px-6 py-10 text-xs text-slate-400">
      <div className="flex flex-wrap gap-8">
        <div>
          <p className="mb-2 font-semibold text-white">ROND CORPORATION</p>
          <p>© 2025 Rond Corp. All rights reserved.</p>
        </div>

        <nav className="space-y-1">
          <p className="font-semibold text-white">Links</p>
          <a href="https://twitter.com" className="hover:text-white">
            Twitter
          </a>
          <br />
          <a href="mailto:biz@rond.ai" className="hover:text-white">
            제휴 문의
          </a>
          <br />
          <a href="/privacy" className="hover:text-white">
            개인정보 처리방침
          </a>
        </nav>
      </div>
    </footer>
  );
}
