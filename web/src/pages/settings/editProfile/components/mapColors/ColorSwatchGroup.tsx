type ColorSwatchGroupProps = {
  colors: string[];
};

export default function ColorSwatchGroup({ colors }: ColorSwatchGroupProps) {
  return (
    <span className="flex -space-x-1" aria-hidden="true">
      {colors.map((color, index) => (
        <span
          key={index}
          style={{ backgroundColor: color }}
          className="h-4 w-4 rounded-full ring-1 ring-black/15 transition-colors duration-200 dark:ring-white/20 motion-reduce:transition-none"
        />
      ))}
    </span>
  );
}
