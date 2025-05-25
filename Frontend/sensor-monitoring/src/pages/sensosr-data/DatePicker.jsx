import React, { useState } from 'react';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isBefore, isAfter, addDays, subDays } from 'date-fns';

const DatePicker = ({ startDate, endDate, onChange, onCancel }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempStartDate, setTempStartDate] = useState(startDate ? new Date(startDate) : null);
  const [tempEndDate, setTempEndDate] = useState(endDate ? new Date(endDate) : null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleDateClick = (day) => {
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      setTempStartDate(day);
      setTempEndDate(null);
    } else if (isBefore(day, tempStartDate)) {
      setTempStartDate(day);
      setTempEndDate(null);
    } else {
      setTempEndDate(day);
    }
  };

  const handleApply = () => {
    if (tempStartDate && tempEndDate) {
      onChange(format(tempStartDate, 'yyyy-MM-dd'), format(tempEndDate, 'yyyy-MM-dd'));
    } else if (tempStartDate) {
      onChange(format(tempStartDate, 'yyyy-MM-dd'), format(tempStartDate, 'yyyy-MM-dd'));
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const isDateSelected = (day) => {
    if (!tempStartDate) return false;
    if (tempStartDate && !tempEndDate) return isSameDay(day, tempStartDate);
    return (
      isSameDay(day, tempStartDate) ||
      isSameDay(day, tempEndDate) ||
      (isAfter(day, tempStartDate) && isBefore(day, tempEndDate))
    );
  };

  const isStartDate = (day) => tempStartDate && isSameDay(day, tempStartDate);
  const isEndDate = (day) => tempEndDate && isSameDay(day, tempEndDate);
  
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-64">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="Previous month"
        >
          <FiChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h3 className="text-sm font-semibold text-gray-700">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={nextMonth}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="Next month"
        >
          <FiChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="text-xs text-center text-gray-500 font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((day) => {
          const dayFormatted = format(day, 'd');
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = isDateSelected(day);
          const isStart = isStartDate(day);
          const isEnd = isEndDate(day);

          return (
            <button
              key={day.toString()}
              onClick={() => isCurrentMonth && handleDateClick(day)}
              disabled={!isCurrentMonth}
              className={`h-8 w-8 rounded-full text-sm flex items-center justify-center
                ${!isCurrentMonth ? 'text-gray-300 cursor-default' : ''}
                ${isSelected ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}
                ${isStart ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                ${isEnd ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                ${isSelected && !isStart && !isEnd ? 'bg-blue-100' : ''}
              `}
              aria-label={`Select ${format(day, 'MMMM d, yyyy')}`}
            >
              {dayFormatted}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={handleCancel}
          className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          disabled={!tempStartDate}
          className={`px-3 py-1 text-sm rounded ${tempStartDate ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
        >
          Apply
        </button>
      </div>

      {tempStartDate && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          {tempEndDate ? (
            <>
              {format(tempStartDate, 'MMM d')} - {format(tempEndDate, 'MMM d, yyyy')}
            </>
          ) : (
            format(tempStartDate, 'MMM d, yyyy')
          )}
        </div>
      )}
    </div>
  );
};

export default DatePicker;