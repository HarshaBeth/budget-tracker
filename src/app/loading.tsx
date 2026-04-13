import LoadingScreen from "@/components/ui/LoadingScreen";

export default function Loading() {
  return (
    <LoadingScreen
      title="Loading your workspace"
      description="Preparing your budget pages and syncing the latest data."
      panelCount={2}
    />
  );
}
