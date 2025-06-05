// components/Footer.tsx
export default function Footer() {
  const companyName = '론드코퍼레이션(Rond Corporation)';
  const companyAddress =
    'H-Tower, 12 Teheran-ro 70-gil, Gangnam-gu, Seoul, Republic of Korea'; // 주소 영문 변환
  const companyContactEmail = 'info@rondcorp.com';
  const businessInquiryEmail = 'biz@likebutter.ai';

  return (
    <footer className="snap-end flex-none bg-black/90 px-8 py-12 text-sm text-slate-400">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Column 1: Company Info */}
        <div className="space-y-3">
          <h3 className="font-semibold text-base text-accent">LIKEBUTTER</h3>
          <p className="text-slate-300">
            &copy; 2025 {companyName}. All rights reserved.
          </p>
          <p>{companyAddress}</p>
        </div>

        {/* Column 2: Links */}
        <div className="space-y-3">
          <h3 className="font-semibold text-base text-white">Navigate</h3>
          <nav className="flex flex-col space-y-2">
            <a
              href="/#features"
              className="hover:text-accent transition-colors w-fit"
            >
              Features
            </a>
            <a
              href="/pricing"
              className="hover:text-accent transition-colors w-fit"
            >
              Pricing
            </a>
            <a
              href="/studio"
              className="hover:text-accent transition-colors w-fit"
            >
              Studio Access
            </a>
          </nav>
        </div>

        {/* Column 3: Contact & Legal */}
        <div className="space-y-3">
          <h3 className="font-semibold text-base text-white">
            Contact & Legal
          </h3>
          <nav className="flex flex-col space-y-2">
            <a
              href={`mailto:${businessInquiryEmail}`}
              className="hover:text-accent transition-colors w-fit"
            >
              Business Inquiries
            </a>
            <a
              href={`mailto:${companyContactEmail}`}
              className="hover:text-accent transition-colors w-fit"
            >
              General Support
            </a>
            <a
              href="/privacy"
              className="hover:text-accent transition-colors w-fit"
            >
              Privacy Policy
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
