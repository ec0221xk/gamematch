import Link from "next/link";

const footerLinks = [
  { label: "ご利用の流れ", href: "/how-it-works" },
  { label: "よくある質問", href: "/faq" },
  { label: "安心して利用するために", href: "/safety" },
  { label: "GameMatchについて", href: "/about" },
  { label: "お問い合わせ", href: "/contact" },
  { label: "利用規約", href: "/legal/terms" },
  { label: "プライバシーポリシー", href: "/legal/privacy" },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-100 px-6 py-8">
      <div className="mx-auto max-w-5xl flex flex-col items-center gap-4">
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} GameMatch
        </p>
      </div>
    </footer>
  );
}
