import Link from 'next/link';

export default function Footer() {
  const companyName = '론드코퍼레이션(Rond Corporation)';
  const companyAddress =
    'H-Tower, 12 Teheran-ro 70-gil, Gangnam-gu, Seoul, Republic of Korea';
  const companyContactEmail = 'info@rondcorp.com';
  const businessInquiryEmail = 'biz@likebutter.ai';

  return (
    <footer className="snap-end flex-none bg-black/90 px-8 py-12 text-sm text-slate-400">
      <div className="container mx-auto grid grid-cols-1 gap-10 md:grid-cols-4">
        {/* Column 1: Company Info */}
        <div className="space-y-3 md:col-span-2">
          <h3 className="font-semibold text-base text-accent">LIKEBUTTER</h3>
          <p className="text-slate-300">
            © {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
          <p>{companyAddress}</p>
        </div>

        {/* Column 2: Links */}
        <div className="space-y-3">
          <h3 className="font-semibold text-base text-white">Navigate</h3>
          <nav className="flex flex-col space-y-2">
            <Link
              href="/#features"
              className="w-fit transition-colors hover:text-accent"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="w-fit transition-colors hover:text-accent"
            >
              Pricing
            </Link>
            <Link
              href="/studio"
              className="w-fit transition-colors hover:text-accent"
            >
              Studio Access
            </Link>
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
              className="w-fit transition-colors hover:text-accent"
            >
              Business Inquiries
            </a>
            <a
              href={`mailto:${companyContactEmail}`}
              className="w-fit transition-colors hover:text-accent"
            >
              General Support
            </a>
            <Link
              href="/privacy"
              className="w-fit transition-colors hover:text-accent"
            >
              Privacy Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
