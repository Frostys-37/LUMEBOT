import { useState } from "react";

export function Imagen({ src, alt }: {src?: string; alt: string }) {
    const [abierta, setAbierta] = useState(false);

    if(!src) return <span className="text-gray-500 text-sm">Sin evidencia</span>;
 
  return (
    <>
      <img
        src={src}
        alt={alt}
        onClick={() => setAbierta(true)}
        className="w-12 h-12 object-cover rounded cursor-zoom-in border border-discord-border hover:opacity-80 transition"
      />
      {abierta && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-zoom-out"
          onClick={() => setAbierta(false)}
        >
          <img src={src} alt={alt} className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl" />
        </div>
      )}
    </>
  );
}
