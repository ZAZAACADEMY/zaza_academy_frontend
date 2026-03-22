export const DotsLoader = ({ label = "Chargement…" }: { label?: string }) => (
  <div
    className="flex flex-col items-center justify-center gap-5 min-h-[60vh] w-full h-full fixed inset-0"
    role="status"
    aria-label={label}
  >
    <div className="flex items-center gap-2.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-3 h-3 rounded-full bg-[#A655F7] animate-bounce"
          style={{ animationDelay: `${i * 0.18}s`, animationDuration: "0.7s" }}
        />
      ))}
    </div>
    <p className="text-sm text-gray-400 font-medium tracking-wide">{label}</p>
  </div>
);
