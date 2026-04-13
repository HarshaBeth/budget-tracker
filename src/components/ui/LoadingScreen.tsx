type LoadingScreenProps = {
  title: string;
  description?: string;
  variant?: "page" | "section";
  panelCount?: number;
};

function LoadingScreen({
  title,
  description,
  variant = "page",
  panelCount = 2,
}: LoadingScreenProps) {
  const isPage = variant === "page";

  return (
    <div
      className={
        isPage
          ? "min-h-screen w-full flex items-center justify-center bg-gray-200 px-6 py-12"
          : "w-full"
      }
    >
      <div className={isPage ? "w-full max-w-5xl" : "w-full"}>
        <div className="mb-6 flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500/60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-600" />
          </span>
          <div>
            <h2 className="text-2xl font-bold font-serif text-gray-900">
              {title}
            </h2>
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>
        </div>

        <div
          className={
            isPage ? "grid gap-4 md:grid-cols-2" : "grid gap-4 lg:grid-cols-2"
          }
        >
          {Array.from({ length: panelCount }).map((_, index) => (
            <div
              key={`${title}-${index}`}
              className="overflow-hidden rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm"
            >
              <div className="animate-pulse space-y-4">
                <div className="h-3 w-20 rounded-full bg-black/10" />
                <div className="h-8 w-3/4 rounded-full bg-black/10" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="h-11 rounded-2xl bg-gray-100" />
                  <div className="h-11 rounded-2xl bg-gray-100" />
                </div>
                <div className="h-32 rounded-3xl bg-gray-100" />
                <div className="space-y-3">
                  <div className="h-4 w-full rounded-full bg-gray-100" />
                  <div className="h-4 w-5/6 rounded-full bg-gray-100" />
                  <div className="h-4 w-2/3 rounded-full bg-gray-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
