import { ImageResponse } from "next/og"

export const runtime = "edge";

export const alt = "S-FMG | Spatial Fleet Manifest Generator Logo";
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 20,
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "24%",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        position: "relative",
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="url(#gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <path d="M18 6H10a4 4 0 0 0-4 4v0a4 4 0 0 0 4 4h4a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4H6" />
        <circle cx="18" cy="6" r="2" fill="#38bdf8" />
        <circle cx="6" cy="18" r="2" fill="#6366f1" />
      </svg>
    </div>,
    {
      ...size,
    },
  );
}