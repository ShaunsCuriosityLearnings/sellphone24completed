import LoadingScreen from "@/components/LoadingScreen";

export default function Loading() {
  return (
    <LoadingScreen
      message="Loading Page..."
      subtext="Fetching latest rates and device valuations"
      fullScreen={true}
    />
  );
}
