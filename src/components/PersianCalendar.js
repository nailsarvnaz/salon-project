"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var constants_1 = require("../constants");
var PersianCalendar = function (_a) {
    var onSelect = _a.onSelect, onClose = _a.onClose, selectedDate = _a.selectedDate;
    var _b = (0, react_1.useState)(selectedDate || new Date()), viewDate = _b[0], setViewDate = _b[1];
    var calendarRef = (0, react_1.useRef)(null);
    // Close calendar on outside click
    (0, react_1.useEffect)(function () {
        var handleClickOutside = function (event) {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                // Also check if the click was on the date button that opens the calendar to prevent immediate closing.
                var dateButton = document.getElementById('date-button');
                if (dateButton && !dateButton.contains(event.target)) {
                    onClose();
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);
    var changeMonth = function (amount) {
        setViewDate(function (prev) {
            var newDate = new Date(prev);
            newDate.setDate(1); // Set to first of month to avoid skipping months
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };
    var _c = (0, react_1.useMemo)(function () {
        var _a, _b;
        var formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
            year: 'numeric',
            month: 'long',
        });
        var parts = formatter.formatToParts(viewDate);
        return {
            persianYear: ((_a = parts.find(function (p) { return p.type === 'year'; })) === null || _a === void 0 ? void 0 : _a.value) || '',
            persianMonth: ((_b = parts.find(function (p) { return p.type === 'month'; })) === null || _b === void 0 ? void 0 : _b.value) || '',
        };
    }, [viewDate]), persianYear = _c.persianYear, persianMonth = _c.persianMonth;
    var calendarGrid = (0, react_1.useMemo)(function () {
        var today = new Date();
        var now = new Date();
        var isTodayDisabled = now.getHours() >= 10;
        today.setHours(0, 0, 0, 0);
        var year = viewDate.getFullYear();
        var month = viewDate.getMonth();
        var firstDayOfMonth = new Date(year, month, 1);
        var daysInMonth = new Date(year, month + 1, 0).getDate();
        // Persian week starts Saturday. JS getDay() is 6 for Sat. Grid index should be 0.
        // Map: Sat(6)->0, Sun(0)->1, Mon(1)->2, Tue(2)->3, Wed(3)->4, Thu(4)->5, Fri(5)->6
        var dayOfWeekOffset = (firstDayOfMonth.getDay() + 1) % 7;
        var days = [];
        for (var i = 0; i < dayOfWeekOffset; i++) {
            days.push({ key: "prev-".concat(i), isEmpty: true });
        }
        var workingDays = __spreadArray(__spreadArray([], constants_1.EVEN_DAYS_OF_WEEK, true), constants_1.ODD_DAYS_OF_WEEK, true);
        for (var day = 1; day <= daysInMonth; day++) {
            var date = new Date(year, month, day);
            var isPast = date < today;
            var isToday = today.getFullYear() === date.getFullYear() &&
                today.getMonth() === date.getMonth() &&
                today.getDate() === date.getDate();
            var dayOfWeek = date.getDay();
            var isWorkingDay = workingDays.includes(dayOfWeek);
            var isDisabled = isPast || !isWorkingDay || (isToday && isTodayDisabled);
            var isSelected = selectedDate ?
                date.getFullYear() === selectedDate.getFullYear() &&
                    date.getMonth() === selectedDate.getMonth() &&
                    date.getDate() === selectedDate.getDate()
                : false;
            days.push({
                key: date.toISOString(),
                date: date,
                persianDay: new Intl.DateTimeFormat('fa-IR', { day: 'numeric' }).format(date),
                isDisabled: isDisabled,
                isSelected: isSelected,
                isToday: isToday,
            });
        }
        // Pad the grid to ensure a fixed height of 6 rows (42 cells total)
        // This prevents the calendar from changing height between months.
        var totalCells = days.length;
        var cellsToPad = 42 - totalCells;
        if (cellsToPad > 0) {
            for (var i = 0; i < cellsToPad; i++) {
                days.push({ key: "next-".concat(i), isEmpty: true });
            }
        }
        return days;
    }, [viewDate, selectedDate]);
    var handleDayClick = function (day) {
        if (!day.isDisabled) {
            onSelect(day.date);
        }
    };
    return (<div className="absolute top-full left-0 right-0 mt-2 z-20">
      <div ref={calendarRef} className="bg-slate-900/95 backdrop-blur-md border border-fuchsia-500/30 rounded-2xl shadow-2xl p-4 animate-fade-in-up-sm" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <div className="flex items-center justify-between px-2 mb-3">
          <button type="button" onClick={function () { return changeMonth(-1); }} className="p-2 rounded-full hover:bg-white/10 transition">
            <i className="fas fa-chevron-left text-slate-300"></i>
          </button>
          <div className="font-bold text-lg text-white text-center">
            {persianMonth} {persianYear}
          </div>
          <button type="button" onClick={function () { return changeMonth(1); }} className="p-2 rounded-full hover:bg-white/10 transition">
            <i className="fas fa-chevron-right text-slate-300"></i>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
          {constants_1.PERSIAN_WEEK_DAYS_SHORT.map(function (day) { return (<div key={day} className="p-1">{day}</div>); })}
        </div>
        <div className="grid grid-cols-7 gap-1 place-items-center">
          {calendarGrid.map(function (day) {
            return day.isEmpty ? (<div key={day.key} className="w-10 h-10"></div>) : (<button key={day.key} type="button" onClick={function () { return handleDayClick(day); }} disabled={day.isDisabled} className={"w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center font-semibold\n                  ".concat(day.isDisabled ? 'text-slate-600 cursor-not-allowed' : 'hover:bg-fuchsia-500/20', "\n                  ").concat(day.isToday && !day.isSelected ? 'border-2 border-cyan-400 text-cyan-300' : '', "\n                  ").concat(day.isSelected ? 'bg-fuchsia-600 text-white font-bold shadow-lg shadow-fuchsia-500/30 transform scale-110' : 'text-slate-200', "\n                ")}>
                {day.persianDay}
              </button>);
        })}
        </div>
      </div>
    </div>);
};
exports.default = PersianCalendar;
