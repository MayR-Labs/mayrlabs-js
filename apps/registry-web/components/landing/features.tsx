import { Code2, Copy, Terminal } from "lucide-react";

export function Features() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
      {[
        {
          icon: Terminal,
          title: "CLI Integration",
          description:
            "Install components directly from your terminal using the shadcn CLI or our wrapper.",
        },
        {
          icon: Code2,
          title: "Copy & Paste",
          description:
            "Just copy the code and paste it into your project. You own the code and can customize it as you see fit.",
        },
        {
          icon: Copy,
          title: "Framework Agnostic",
          description:
            "Components available for React and Vue. Use what works for you and your team.",
        },
      ].map((feature, index) => (
        <div
          key={index}
          className="group relative p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 transition-all duration-300 hover:bg-zinc-900/60 hover:border-zinc-700 hover:shadow-2xl hover:shadow-blue-500/10"
        >
          <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-300 group-hover:border-zinc-700">
              <feature.icon className="h-6 w-6 text-zinc-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-blue-400 transition-colors">
              {feature.title}
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
