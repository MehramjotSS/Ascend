function getYouTubeVideoId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    /youtube\.com\/embed\/([^&\s]+)/,
     /youtube\.com\/shorts\/([^&\s]+)/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

function getYouTubeThumbnail(url) {
  const id = getYouTubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
}

// YouTube brand icon (simplified "play in rectangle")
function YouTubeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function ExerciseCard({ exercise, index, onUpdate, onRemove, viewMode = false }) {
  const thumbnailUrl = getYouTubeThumbnail(exercise.youtubeLink);
  const hasVideo = Boolean(getYouTubeVideoId(exercise.youtubeLink));

  function openVideo() {
    if (exercise.youtubeLink) {
      window.open(exercise.youtubeLink, '_blank', 'noopener,noreferrer');
    }
  }

  // ── VIEW MODE ─────────────────────────────────────────────────────────────
  if (viewMode) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3.5">
        <div className="flex items-center justify-between gap-3">
          {/* Left: index + name + muscle */}
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px] font-medium text-slate-400">
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-100">{exercise.name}</p>
              {exercise.primaryMuscle && (
                <p className="text-[10px] text-slate-500">{exercise.primaryMuscle}</p>
              )}
            </div>
          </div>

          {/* Right: sets × reps + optional YouTube icon */}
          <div className="flex items-center gap-2.5 shrink-0">
            {(exercise.sets || exercise.reps) && (
              <span className="text-xs text-slate-400">
                {exercise.sets || '—'} × {exercise.reps || '—'}
              </span>
            )}
            {hasVideo && (
              <button
                type="button"
                onClick={openVideo}
                aria-label={`Watch ${exercise.name} tutorial on YouTube`}
                className="flex items-center justify-center rounded-md p-1.5 text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <YouTubeIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── EDIT MODE ─────────────────────────────────────────────────────────────
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-3 space-y-3">
      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px] font-medium text-slate-400">
            {index + 1}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-100">{exercise.name}</p>
            {exercise.primaryMuscle && (
              <p className="text-[10px] text-slate-500">{exercise.primaryMuscle}</p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 rounded px-2 py-1 text-[10px] text-red-400 hover:bg-red-900/20 hover:text-red-300"
        >
          Remove
        </button>
      </div>

      {/* YouTube thumbnail (edit mode only) */}
      {thumbnailUrl && (
        <button
          type="button"
          onClick={openVideo}
          className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-700 hover:border-emerald-500/60 transition-colors group"
        >
          <img
            src={thumbnailUrl}
            alt={`${exercise.name} tutorial`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <svg className="h-5 w-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      )}

      {/* Sets & Reps */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1 block text-[11px] text-slate-400">Sets</label>
          <input
            type="number"
            inputMode="numeric"
            value={exercise.sets}
            onChange={(e) => onUpdate(index, 'sets', e.target.value)}
            min="1"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="3"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] text-slate-400">Reps</label>
          <input
            type="number"
            inputMode="numeric"
            value={exercise.reps}
            onChange={(e) => onUpdate(index, 'reps', e.target.value)}
            min="1"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="10"
          />
        </div>
      </div>

      {/* YouTube link */}
      <div>
        <label className="mb-1 block text-[11px] text-slate-400">
          YouTube link <span className="text-slate-600">(optional)</span>
        </label>
        <input
          type="url"
          value={exercise.youtubeLink}
          onChange={(e) => onUpdate(index, 'youtubeLink', e.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="https://youtube.com/watch?v=…"
        />
      </div>
    </div>
  );
}

export default ExerciseCard;