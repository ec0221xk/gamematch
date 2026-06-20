const stats = [
  { icon: "🎮", value: "120+", label: "Creator" },
  { icon: "🤝", value: "1,500+", label: "マッチング" },
  { icon: "🔥", value: "6", label: "タイトル対応" },
];

export function HeroStats() {
  return (
    <section className="border-y border-gray-100 px-6 py-5">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 px-4 text-center sm:flex-row sm:justify-center sm:gap-3">
              <span className="text-xl sm:text-2xl">{stat.icon}</span>
              <div>
                <span
                  className="block font-bold"
                  style={{
                    fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                    background: "linear-gradient(135deg, #4F46E5, #8B5CF6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {stat.value}
                </span>
                <span className="text-xs text-gray-500 sm:text-sm">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
