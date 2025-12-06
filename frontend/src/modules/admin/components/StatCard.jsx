const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500',
      lightBg: 'bg-blue-50',
      text: 'text-blue-600',
      ring: 'ring-blue-200'
    },
    green: {
      bg: 'bg-green-500',
      lightBg: 'bg-green-50',
      text: 'text-green-600',
      ring: 'ring-green-200'
    },
    yellow: {
      bg: 'bg-yellow-500',
      lightBg: 'bg-yellow-50',
      text: 'text-yellow-600',
      ring: 'ring-yellow-200'
    },
    purple: {
      bg: 'bg-purple-500',
      lightBg: 'bg-purple-50',
      text: 'text-purple-600',
      ring: 'ring-purple-200'
    },
    red: {
      bg: 'bg-red-500',
      lightBg: 'bg-red-50',
      text: 'text-red-600',
      ring: 'ring-red-200'
    },
    indigo: {
      bg: 'bg-indigo-500',
      lightBg: 'bg-indigo-50',
      text: 'text-indigo-600',
      ring: 'ring-indigo-200'
    }
  };

  const selectedColor = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2 font-medium">
            {title}
          </p>
          <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
            {value}
          </p>
          
          {/* Trend indicator (optional) */}
          {trend && trendValue && (
            <div className="mt-2 flex items-center">
              <span className={`text-xs md:text-sm font-medium ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </span>
              <span className="text-xs text-gray-500 ml-2">vs last month</span>
            </div>
          )}
        </div>
        
        {/* Icon */}
        <div className={`
          ${selectedColor.bg} 
          p-3 md:p-4 rounded-lg md:rounded-xl 
          shadow-sm
          flex items-center justify-center
        `}>
          <Icon className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;