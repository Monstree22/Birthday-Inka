/* Ikon-ikon stiker kecil (SVG), digambar mengikuti lembar stiker Kartu Hati Inka. */
type Nama =
  | "balon" | "hati" | "hatiDua" | "gonggong" | "luti" | "onigiri" | "jepang" | "indonesia"
  | "fuji" | "jembatan" | "bulan" | "sakura" | "pesawat" | "mik" | "surat" | "tangki" | "buku" | "bunga" | "kue";

const M = "#8E1E45", P = "#E95A86", PM = "#F6B3C8", K = "#FFF7EF", C = "#7A4A1C", CM = "#D9A464";

export default function Ikon({ n, className }: { n: Nama; className?: string }) {
  const g = (() => {
    switch (n) {
      case "balon": return <>
        <path d="M22 40 C20 48 26 52 24 60" stroke={M} strokeWidth="1.6" fill="none" /><path d="M34 40 C34 48 30 52 32 60" stroke={M} strokeWidth="1.6" fill="none" /><path d="M44 38 C46 46 40 52 42 60" stroke={M} strokeWidth="1.6" fill="none" />
        <ellipse cx="21" cy="26" rx="11" ry="13" fill={P} /><ellipse cx="44" cy="25" rx="11" ry="13" fill={PM} /><ellipse cx="33" cy="22" rx="11" ry="13" fill={K} stroke={PM} strokeWidth="2" />
        <circle cx="17" cy="21" r="2.5" fill="#fff" opacity=".7" /></>;
      case "hati": return <path d="M32 54 C10 40 6 28 12 19 C18 11 28 13 32 21 C36 13 46 11 52 19 C58 28 54 40 32 54Z" fill="#D7263D" />;
      case "hatiDua": return <>
        <path d="M24 50 C6 39 4 28 9 21 C14 14 22 16 24 22 C27 16 35 14 39 21 C44 28 42 39 24 50Z" fill={P} />
        <path d="M40 46 C24 37 22 28 26 22 C30 16 37 17 40 22 C43 17 50 16 54 22 C58 28 56 37 40 46Z" fill={PM} /></>;
      case "gonggong": return <>
        <path d="M30 6 C40 14 46 30 42 46 C40 54 28 58 22 52 C14 44 18 22 30 6Z" fill="#F4DDB8" stroke={C} strokeWidth="2" />
        <path d="M26 18 L38 22 M23 28 L42 32 M22 38 L42 42 M25 48 L38 50" stroke={C} strokeWidth="1.6" />
        <ellipse cx="30" cy="40" rx="4" ry="7" fill={P} /></>;
      case "luti": return <>
        <ellipse cx="32" cy="36" rx="24" ry="12" fill={CM} stroke={C} strokeWidth="2" />
        <path d="M14 34 C24 28 40 28 50 34" stroke={C} strokeWidth="1.6" fill="none" /></>;
      case "onigiri": return <>
        <path d="M32 8 C42 8 56 40 54 48 C52 56 12 56 10 48 C8 40 22 8 32 8Z" fill="#fff" stroke="#3A2A20" strokeWidth="2.4" />
        <rect x="20" y="38" width="24" height="16" rx="2" fill="#3A2A20" /></>;
      case "jepang": return <><rect x="6" y="14" width="52" height="36" rx="3" fill="#fff" stroke="#E5D6CC" strokeWidth="2" /><circle cx="32" cy="32" r="10" fill="#C8102E" /></>;
      case "indonesia": return <><rect x="6" y="14" width="52" height="36" rx="3" fill="#fff" stroke="#E5D6CC" strokeWidth="2" /><path d="M6 17 a3 3 0 0 1 3-3 h46 a3 3 0 0 1 3 3 V32 H6Z" fill="#CE1126" /></>;
      case "fuji": return <><path d="M4 52 L26 18 L48 52Z" fill="#3E7CC4" /><path d="M19 29 L26 18 L33 29 L29 27 L26 31 L23 27Z" fill="#fff" /></>;
      case "jembatan": return <>
        <path d="M4 46 H60" stroke="#24467A" strokeWidth="3" /><path d="M20 46 V14 M44 46 V14" stroke="#24467A" strokeWidth="3" />
        <path d="M20 16 L6 46 M20 16 L34 46 M44 16 L30 46 M44 16 L58 46 M20 24 L12 46 M20 24 L28 46 M44 24 L36 46 M44 24 L52 46" stroke="#24467A" strokeWidth="1.2" /></>;
      case "bulan": return <path d="M40 10 A22 22 0 1 0 54 44 A18 18 0 1 1 40 10Z" fill="#F7C04A" />;
      case "sakura": return <>
        {[0, 72, 144, 216, 288].map((r) => <ellipse key={r} cx="32" cy="17" rx="9" ry="12" fill={PM} transform={`rotate(${r} 32 32)`} />)}
        <circle cx="32" cy="32" r="7" fill={P} /><circle cx="32" cy="32" r="3" fill="#C2185B" /></>;
      case "pesawat": return <>
        <path d="M4 44 C14 30 26 34 34 30" stroke="#5A8FD6" strokeWidth="2" strokeDasharray="3 4" fill="none" />
        <path d="M30 24 L60 14 L44 40 L40 30Z" fill="#fff" stroke="#24467A" strokeWidth="2" strokeLinejoin="round" /><path d="M40 30 L60 14" stroke="#24467A" strokeWidth="2" />
        <path d="M44 50 C40 46 40 44 42 43 C44 42 45 44 46 45 C47 44 48 42 50 43 C52 44 52 46 44 50Z" fill={P} /></>;
      case "mik": return <>
        <rect x="24" y="8" width="16" height="28" rx="8" fill={M} /><path d="M16 30 C16 44 48 44 48 30" stroke={M} strokeWidth="3" fill="none" />
        <path d="M32 42 V54 M24 56 H40" stroke={M} strokeWidth="3" strokeLinecap="round" />
        <path d="M52 10 l2 5 5 2 -5 2 -2 5 -2-5 -5-2 5-2Z" fill="#F7C04A" /></>;
      case "surat": return <>
        <rect x="6" y="16" width="52" height="34" rx="4" fill="#fff" stroke={M} strokeWidth="2" /><path d="M6 18 L32 36 L58 18" stroke={M} strokeWidth="2" fill="none" />
        <path d="M32 44 C26 40 25 37 27 35 C29 33 31 34 32 36 C33 34 35 33 37 35 C39 37 38 40 32 44Z" fill="#D7263D" /></>;
      case "tangki": return <>
        <path d="M10 44 A22 22 0 0 1 54 44" stroke="#1F6B54" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M44 26 A22 22 0 0 1 54 44" stroke="#D7263D" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M32 44 L48 30" stroke="#1F3A33" strokeWidth="3" strokeLinecap="round" /><circle cx="32" cy="44" r="4" fill="#1F3A33" />
        <text x="54" y="58" fontSize="9" fontWeight="700" fill="#1F6B54" textAnchor="middle">F</text><text x="10" y="58" fontSize="9" fontWeight="700" fill="#1F6B54" textAnchor="middle">E</text></>;
      case "buku": return <>
        <path d="M32 16 C24 10 12 10 6 13 V50 C12 47 24 47 32 53Z" fill="#fff" stroke={M} strokeWidth="2" />
        <path d="M32 16 C40 10 52 10 58 13 V50 C52 47 40 47 32 53Z" fill={PM} stroke={M} strokeWidth="2" />
        <path d="M12 22 H26 M12 29 H26 M12 36 H22" stroke={M} strokeWidth="1.4" /></>;
      case "bunga": return <>
        <path d="M32 34 V58" stroke="#2E7D5B" strokeWidth="3" /><path d="M32 48 C24 44 20 46 18 50 C24 52 28 52 32 48Z" fill="#4CA77A" />
        {[0, 60, 120, 180, 240, 300].map((r) => <ellipse key={r} cx="32" cy="14" rx="7" ry="10" fill={P} transform={`rotate(${r} 32 24)`} />)}
        <circle cx="32" cy="24" r="6" fill="#F7C04A" /></>;
      case "kue": return <>
        <rect x="12" y="30" width="40" height="22" rx="4" fill={PM} /><path d="M12 36 Q17 42 22 36 T32 36 T42 36 T52 36" stroke="#fff" strokeWidth="3" fill="none" />
        <rect x="30" y="16" width="4" height="14" rx="1" fill="#F7C04A" /><path d="M32 6 C36 11 35 15 32 15 C29 15 28 11 32 6Z" fill="#FF8A3D" /></>;
    }
  })();
  return <svg className={className} viewBox="0 0 64 64" aria-hidden="true">{g}</svg>;
}
