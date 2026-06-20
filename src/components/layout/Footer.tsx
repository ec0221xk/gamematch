import Link from "next/link";

const footerLinks = [
  { label: "利用規約", href: "/legal/terms" },
  { label: "プライバシーポリシー", href: "/legal/privacy" },
  { label: "運営者情報", href: "/legal/about" },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-100 px-6 py-8">
      <div className="mx-auto max-w-5xl flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} GameMatch
        </p>
        <nav className="flex gap-5">
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
      </div>
    </footer>
  );
}
