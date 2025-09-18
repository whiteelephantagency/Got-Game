"use client";

type Props = {
  onEnd: () => void;
  /** Optional: override the default video path */
  src?: string;
  className?: string;
};

export default function StatMapTransition({ onEnd, src, className }: Props) {
  // Keep this in public/video/ to match the rest of the project
  const videoSrc = src ?? "/video/stat-map-transition.mp4";

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/95 flex items-center justify-center ${className ?? ""}`}
      aria-label="Transition animation"
      role="dialog"
      aria-modal="true"
    >
      <video
        src={videoSrc}
        autoPlay
        playsInline
        muted
        onEnded={onEnd}
        onError={() => onEnd()}      // fail-safe so you never get stuck
        onCanPlay={(e) => {
          // Some browsers block autoplay without muted; this is a nudge.
          const v = e.currentTarget;
          if (v.paused) v.play().catch(() => {});
        }}
        className="w-full max-w-3xl"
      />
    </div>
  );
}
