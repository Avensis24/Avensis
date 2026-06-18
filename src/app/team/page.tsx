"use client";

import { Reveal, SectionLabel } from "@/components/ui-shared";

const LEADERSHIP = [
  { name: "Shri Abhinav", role: "Founder", bio: "Building the company, the product, and the standard." },
  { name: "Sushmita Manna", role: "Co-Founder", bio: "Operations, design, and the culture that ties it all together." },
];

const TEAM_GROUPS = [
  { title: "Business Analysis", members: ["Roji"] },
  { title: "Development", members: ["Harsh Kumari", "Tripti Kumari", "Hari Krishna", "Prasanna Reddy", "Sakshi Dubey", "Poonam Singh"] },
  { title: "Marketing & Growth", members: ["Suraj Jha", "Ugan Kumar Jha"] },
  { title: "Social & Branding", members: ["Kriti Prabhakar"] },
];

export default function TeamPage() {
  return (
    <main className="relative z-10 text-foreground pt-32 pb-40 lg:pb-56 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 pt-16">
        <Reveal><SectionLabel>Our People</SectionLabel></Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-8 max-w-4xl font-display text-5xl leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
            The minds behind <span className="italic text-gold">the standard.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
            A deliberate team. Every person essential. Quietly relentless craftspeople building the future.
          </p>
        </Reveal>

        {/* Leadership Section - Text Only */}
        <div className="mt-32 border-t border-border pt-16 lg:pt-24">
          <Reveal delay={0.1}>
            <div className="flex flex-col md:flex-row gap-16 lg:gap-32">
              <div className="md:w-1/3">
                <span className="text-[10px] uppercase tracking-[0.4em] text-gold">01</span>
                <h3 className="mt-3 font-display text-3xl text-foreground">Leadership</h3>
              </div>
              <div className="md:w-2/3 grid sm:grid-cols-2 gap-12">
                {LEADERSHIP.map((l) => (
                  <div key={l.name} className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-gold">{l.role}</span>
                    <h4 className="mt-3 font-display text-3xl text-foreground lg:text-4xl">{l.name}</h4>
                    <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{l.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Team Groups Section - Text Only */}
        <div className="mt-24 space-y-16 lg:space-y-24">
          {TEAM_GROUPS.map((g, gi) => (
            <Reveal key={g.title} delay={0.1}>
              <div className="flex flex-col md:flex-row gap-16 lg:gap-32 border-t border-border pt-16 lg:pt-24">
                <div className="md:w-1/3">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-gold">0{gi + 2}</span>
                  <h3 className="mt-3 font-display text-3xl text-foreground">{g.title}</h3>
                </div>
                <div className="md:w-2/3">
                  <ul className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
                    {g.members.map((m) => (
                      <li
                        key={m}
                        className="group relative bg-background/40 backdrop-blur-sm px-6 py-7 transition-colors hover:bg-surface"
                      >
                        <p className="font-display text-2xl text-foreground">{m}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{g.title}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
