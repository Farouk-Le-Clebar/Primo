
export default function HeroSection() {
  return (
    <section
      className="h-auto flex flex-col items-start"
    >
      {/* Ligne des 4 petits carrés */}
      <div className="flex gap-3.5 ">
        {[1, 2, 3, 4].map((_, i) => (
          <div
            key={i}
            className="w-65 h-14 bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-xl"
          ></div>
        ))}
      </div>

      {/* Grand carré en dessous */}
      <div className="w-270 h-140 mt-6 bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-3xl"></div>
      <div className="w-270 h-140 mt-6 mb-6 bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-3xl"></div>
    </section>
  );
}
