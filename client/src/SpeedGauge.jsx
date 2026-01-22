const SpeedGauge = ({ label, value, unit, color, max = 300 }) => {
  const radius = 90;
  const circumference = Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const offset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-medium text-gray-600 mb-2">{label}</h2>

      <svg width="220" height="120" viewBox="0 0 220 120">
        {/* Background arc */}
        <path
          d="M20 110 A90 90 0 0 1 200 110"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="14"
        />

        {/* Progress arc */}
        <path
          d="M20 110 A90 90 0 0 1 200 110"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>

      <div className="-mt-16 text-center">
        <div className="text-3xl font-semibold text-gray-900">
          {value.toFixed(2)}
        </div>
        <div className="text-sm text-gray-500">{unit}</div>
      </div>
    </div>
  );
};

export default SpeedGauge;
