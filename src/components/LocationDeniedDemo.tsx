import LocationDeniedScreen from './LocationDeniedScreen';

export default function LocationDeniedDemo() {
  const handleRetry = () => {
    alert('Retry button clicked! This would trigger the location permission request again.');
  };

  const handleContinueWithout = () => {
    alert('Continue without location clicked! This would navigate back to the home page.');
  };

  return (
    <LocationDeniedScreen 
      onRetry={handleRetry}
      onContinueWithout={handleContinueWithout}
    />
  );
}
