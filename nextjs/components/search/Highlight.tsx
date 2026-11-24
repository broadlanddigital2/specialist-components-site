import { highlight } from "@/lib/search";

export function Highlight({ text, query }: { text: string; query: string }) {
  return (
    <>
      {highlight(text, query).map((p, i) =>
        p.match ? (
          <mark key={i} className="rounded-[3px] bg-[#ffe2d9] px-px text-inherit">{p.text}</mark>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}
