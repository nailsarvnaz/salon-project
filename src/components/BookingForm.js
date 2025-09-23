"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var constants_1 = require("../constants");
var PersianCalendar_1 = require("./PersianCalendar");
var serviceIcons = {
    "کاشت": "fa-hand-sparkles",
    "ترمیم و لمینت": "fa-wand-magic-sparkles",
    "ژلیش پا": "fa-feather",
    "دست و پا": "fa-spa",
};
var BookingForm = function (_a) {
    var existingBookings = _a.existingBookings, onBookingSuccess = _a.onBookingSuccess, showNotification = _a.showNotification;
    var _b = (0, react_1.useState)(''), name = _b[0], setName = _b[1];
    var _c = (0, react_1.useState)(''), phone = _c[0], setPhone = _c[1];
    var _d = (0, react_1.useState)(null), selectedService = _d[0], setSelectedService = _d[1];
    var _e = (0, react_1.useState)(null), selectedDate = _e[0], setSelectedDate = _e[1];
    var _f = (0, react_1.useState)(null), selectedTime = _f[0], setSelectedTime = _f[1];
    var _g = (0, react_1.useState)(false), isCalendarOpen = _g[0], setIsCalendarOpen = _g[1];
    var _h = (0, react_1.useState)(null), animatingService = _h[0], setAnimatingService = _h[1];
    var _j = (0, react_1.useState)({}), errors = _j[0], setErrors = _j[1];
    var formattedDate = (0, react_1.useMemo)(function () {
        if (!selectedDate)
            return 'برای انتخاب تاریخ کلیک کنید';
        return new Intl.DateTimeFormat('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(selectedDate);
    }, [selectedDate]);
    var dateKey = (0, react_1.useMemo)(function () {
        if (!selectedDate)
            return '';
        var year = selectedDate.getFullYear();
        var month = selectedDate.getMonth() + 1;
        var day = selectedDate.getDate();
        return "".concat(year, "/").concat(month, "/").concat(day);
    }, [selectedDate]);
    var handleServiceSelect = function (service) {
        if ((selectedService === null || selectedService === void 0 ? void 0 : selectedService.value) === service.value)
            return;
        setSelectedService(service);
        setAnimatingService(service.value);
        // Corresponds to animation duration in index.html
        setTimeout(function () {
            setAnimatingService(null);
        }, 400);
    };
    (0, react_1.useEffect)(function () { setSelectedTime(null); }, [selectedDate, selectedService]);
    var _k = (0, react_1.useMemo)(function () {
        if (!selectedDate || !selectedService)
            return { suggestedTimes: [], otherTimes: [] };
        var serviceDuration = selectedService.duration;
        var dayBookings = existingBookings[dateKey] || [];
        var bookedSlots = dayBookings.map(function (b) {
            var _a = b.time.split(':').map(Number), h = _a[0], m = _a[1];
            var start = h * 60 + m;
            return { start: start, end: start + b.duration };
        }).sort(function (a, b) { return a.start - b.start; });
        var dayOfWeek = selectedDate.getDay();
        var isEvenDay = constants_1.EVEN_DAYS_OF_WEEK.includes(dayOfWeek);
        var workStart = isEvenDay ? 13 * 60 : 12 * 60;
        var workEnd = 20 * 60;
        var allTimes = [];
        var _loop_1 = function (t) {
            var slotStart = t;
            var slotEnd = t + serviceDuration;
            if (slotEnd > workEnd)
                return "continue";
            var isOverlapping = bookedSlots.some(function (b) { return slotStart < b.end && slotEnd > b.start; });
            if (!isOverlapping) {
                var h = Math.floor(t / 60).toString().padStart(2, '0');
                allTimes.push("".concat(h, ":00"));
            }
        };
        for (var t = workStart; t < workEnd; t += 60) {
            _loop_1(t);
        }
        if (allTimes.length === 0)
            return { suggestedTimes: [], otherTimes: [] };
        var suggested = [];
        if (dayBookings.length === 0) {
            // Logic for an empty day: suggest specific prime times.
            var primeSuggestions = isEvenDay ? ["13:00", "15:00"] : ["12:00", "14:00"];
            suggested = primeSuggestions.filter(function (time) { return allTimes.includes(time); });
            // Fallback: If prime times are not available (e.g., for a long service), suggest the first available time.
            if (suggested.length === 0 && allTimes.length > 0) {
                suggested.push(allTimes[0]);
            }
        }
        else {
            // Logic for a day with existing bookings: suggest adjacent slots.
            var adjacentSuggestions = [];
            var _loop_2 = function (time) {
                var h = time.split(':').map(Number)[0];
                var timeInMinutes = h * 60;
                var isAdjacent = bookedSlots.some(function (b) { return timeInMinutes + serviceDuration === b.start || timeInMinutes === b.end; });
                if (isAdjacent) {
                    adjacentSuggestions.push(time);
                }
            };
            for (var _i = 0, allTimes_1 = allTimes; _i < allTimes_1.length; _i++) {
                var time = allTimes_1[_i];
                _loop_2(time);
            }
            suggested = adjacentSuggestions;
            // Fallback: If no adjacent slots are found, suggest the first available slot.
            if (suggested.length === 0 && allTimes.length > 0) {
                suggested.push(allTimes[0]);
            }
        }
        var others = allTimes.filter(function (t) { return !suggested.includes(t); });
        return { suggestedTimes: suggested, otherTimes: others };
    }, [selectedDate, selectedService, existingBookings, dateKey]), suggestedTimes = _k.suggestedTimes, otherTimes = _k.otherTimes;
    var validateName = function (value) { return (!value.trim() ? 'نام نمی‌تواند خالی باشد.' : value.trim().length < 3 ? 'نام باید حداقل ۳ حرف باشد.' : ''); };
    var validatePhone = function (value) { return (!/^09\d{9}$/.test(value) ? 'فرمت شماره موبایل صحیح نیست (مثال: 09123456789).' : ''); };
    var handleNameBlur = function () { return setErrors(function (e) { return (__assign(__assign({}, e), { name: validateName(name) })); }); };
    var handlePhoneBlur = function () { return setErrors(function (e) { return (__assign(__assign({}, e), { phone: validatePhone(phone) })); }); };
    var handleSubmit = function (e) {
        e.preventDefault();
        var nameError = validateName(name);
        var phoneError = validatePhone(phone);
        if (nameError || phoneError) {
            setErrors({ name: nameError, phone: phoneError });
            showNotification({ type: 'error', title: 'خطای فرم', message: 'لطفاً خطاهای فرم را برطرف کنید.' });
            return;
        }
        if (!selectedService || !selectedDate || !selectedTime) {
            showNotification({ type: 'error', title: 'خطای فرم', message: 'لطفاً تمام موارد را انتخاب کنید.' });
            return;
        }
        var trackingCode = Math.floor(100000 + Math.random() * 900000);
        var newBooking = { name: name.trim(), phone: phone, service: selectedService.value, date: dateKey, time: selectedTime, trackingCode: trackingCode };
        onBookingSuccess(newBooking);
        setName('');
        setPhone('');
        setSelectedService(null);
        setSelectedDate(null);
        setSelectedTime(null);
        setErrors({});
    };
    var isSubmitDisabled = !name.trim() || !phone.trim() || !selectedService || !selectedDate || !selectedTime || !!errors.name || !!errors.phone;
    return (<form onSubmit={handleSubmit} className="space-y-8">
      <fieldset className="space-y-4 fade-in-up" style={{ animationDelay: '600ms' }}>
        <legend className="text-xl font-bold text-slate-200 border-b-2 border-pink-500/50 pb-2 mb-2 w-full">۱. اطلاعات شخصی</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 pt-2">
          <div className="form-group">
            <div className="input-wrapper">
              <input type="text" id="name" value={name} onChange={function (e) { return setName(e.target.value); }} onBlur={handleNameBlur} placeholder=" " className="form-input peer"/>
              <label htmlFor="name" className="form-label">نام و نام خانوادگی:</label>
            </div>
            {errors.name && <div className="error-message"><i className="fas fa-exclamation-circle"></i>{errors.name}</div>}
          </div>
          <div className="form-group">
            <div className="input-wrapper">
              <input type="tel" id="phone" value={phone} onChange={function (e) { return setPhone(e.target.value); }} onBlur={handlePhoneBlur} placeholder=" " maxLength={11} className="form-input peer"/>
              <label htmlFor="phone" className="form-label">شماره موبایل:</label>
            </div>
            {errors.phone && <div className="error-message"><i className="fas fa-exclamation-circle"></i>{errors.phone}</div>}
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4 fade-in-up" style={{ animationDelay: '800ms' }}>
        <legend className="text-xl font-bold text-slate-200 border-b-2 border-fuchsia-500/50 pb-2 mb-4 w-full">۲. انتخاب خدمات</legend>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6 justify-items-center">
          {constants_1.SERVICES.map(function (service) { return (<div key={service.value} className="service-bubble-container" onClick={function () { return handleServiceSelect(service); }}>
              <div className={"service-bubble ".concat((selectedService === null || selectedService === void 0 ? void 0 : selectedService.value) === service.value ? 'selected' : '', " ").concat(animatingService === service.value ? 'animate-pop-select' : '')}>
                <i className={"fas ".concat(serviceIcons[service.value], " text-2xl mb-2")}></i>
                <span className="text-sm">{service.value}</span>
                <span className="text-xs opacity-80 mt-1">{service.price.toLocaleString('fa-IR')} تومان</span>
              </div>
            </div>); })}
        </div>
      </fieldset>

      <fieldset className={"space-y-4 fade-in-up ".concat(isCalendarOpen ? 'z-30' : '', " relative")} style={{ animationDelay: '1000ms' }}>
        <legend className="text-xl font-bold text-slate-200 border-b-2 border-cyan-400/50 pb-2 mb-4 w-full">۳. انتخاب زمان</legend>
        <div className="relative">
          <label className="font-semibold text-slate-400 text-sm mb-2 block">تاریخ مراجعه:</label>
          <button type="button" id="date-button" onClick={function () { return setIsCalendarOpen(function (prev) { return !prev; }); }} className="w-full p-4 bg-black/20 border-2 border-transparent focus:border-cyan-400 rounded-lg focus:outline-none transition text-right flex justify-between items-center">
            <span className={!selectedDate ? 'text-slate-400' : 'text-white font-semibold'}>{formattedDate}</span>
            <i className={"fas fa-calendar-alt text-slate-400 transition-transform ".concat(isCalendarOpen ? 'rotate-12 text-cyan-400' : '')}></i>
          </button>
          {isCalendarOpen && <PersianCalendar_1.default onSelect={function (date) { setSelectedDate(date); setIsCalendarOpen(false); }} onClose={function () { return setIsCalendarOpen(false); }} selectedDate={selectedDate}/>}
        </div>
        
        {selectedDate && selectedService && (suggestedTimes.length > 0 || otherTimes.length > 0) && (<div className="space-y-4 pt-2">
            {suggestedTimes.length > 0 && (<div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-sm text-emerald-300 font-semibold">
                <i className="fas fa-star mr-2 text-yellow-400"></i>
                برای بهینه‌سازی زمان‌بندی، لطفاً از بین ساعات پیشنهادی ما انتخاب فرمایید.
              </div>)}
            <div className="flex flex-wrap gap-3">
              {suggestedTimes.map(function (time) { return (<button key={time} type="button" onClick={function () { return setSelectedTime(time); }} className={"relative px-6 py-3 rounded-lg font-bold text-lg transition ".concat(selectedTime === time ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-white/10 text-white hover:bg-white/20', " suggested-time")}>
                  <span className="suggestion-badge">پیشنهاد ما</span>
                  {time}
                </button>); })}
            </div>
            {otherTimes.length > 0 && (<>
                {suggestedTimes.length > 0 && <div className="text-center text-sm text-slate-400 font-semibold pt-2">در صورت عدم امکان، سایر زمان‌ها:</div>}
                <div className="flex flex-wrap gap-2">
                  {otherTimes.map(function (time) { return (<button key={time} type="button" onClick={function () { return setSelectedTime(time); }} className={"px-4 py-2 rounded-lg font-semibold text-sm transition ".concat(selectedTime === time ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-700/50 text-slate-200 hover:bg-slate-700')}>
                      {time}
                    </button>); })}
                </div>
              </>)}
          </div>)}
      </fieldset>
      
      <button type="submit" disabled={isSubmitDisabled} className="w-full bg-gradient-to-br from-pink-500 to-fuchsia-600 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-fuchsia-500/30 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:-translate-y-0 disabled:shadow-none disabled:from-slate-600 disabled:to-slate-700">
        <i className="fas fa-check-circle mr-2"></i> ثبت نهایی و دریافت کد رهگیری
      </button>
    </form>);
};
exports.default = BookingForm;
