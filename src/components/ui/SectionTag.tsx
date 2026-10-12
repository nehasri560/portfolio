import { SECTIONS } from "@/lib/data";

export default function SectionTag({ id, className = "" }: { id: keyof typeof SECTIONS; className?: string }) {
  const s = SECTIONS[id];
  return (
    <p className={`tag rv ${className}`}>
      <b>{s.index}</b> — {s.label}
    </p>
  );
}
