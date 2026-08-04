export function LogoMarquee({ logos }: { logos: string[] }) {
  const items = [...logos, ...logos];
  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max animate-marquee gap-16 hover:[animation-play-state:paused]">
        {items.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="flex shrink-0 items-center whitespace-nowrap font-heading text-2xl font-medium text-primary/35 sm:text-3xl"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
