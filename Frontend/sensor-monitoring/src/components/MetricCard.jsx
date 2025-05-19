import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";

const MetricCard = ({ title, value, trend, icon: Icon }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
        {Icon && (
          <div className="p-2 bg-blue-100 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        )}
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-3 text-sm">
          {trend.direction === "up" ? (
            <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
          ) : (
            <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />
          )}
          <span
            className={
              trend.direction === "up" ? "text-green-600" : "text-red-600"
            }
          >
            {trend.value}
          </span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
