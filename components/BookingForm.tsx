import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Booking, NotificationDetails, Service } from '../types';
import { SERVICES, ODD_DAYS_OF_WEEK, EVEN_DAYS_OF_WEEK } from '../constants';
import PersianCalendar from './PersianCalendar';

interface BookingFormProps {
  existingBookings: Record<string, { time: string; duration: number; }[]>;
  onBookingSuccess: (booking: Booking) => void;
  showNotification: (details: NotificationDetails) => void;
}

const serviceIcons: { [key: string]: string } = {
  "کاشت": "fa-hand-sparkles",
  "ترمیم و لمینت": "fa-wand-magic-sparkles",
  "ژلیش پا": "fa-feather",
  "دست و پا": "fa-spa",
};

const BookingForm: React.FC<BookingFormProps> = ({ existingBookings, onBookingSuccess, showNotification }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [animatingService, setAnimatingService] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const formattedDate = useMemo(() => {
    if (!selectedDate) return 'برای انتخاب تاریخ کلیک کنید';
    return new Intl.DateTimeFormat('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(selectedDate);
  }, [selectedDate]);

  const dateKey = useMemo(() => {
    if (!selectedDate) return '';
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();
    return `${year}/${month}/${day}`;
  }, [selectedDate]);

  const handleServiceSelect = (service: Service) => {
    if (selectedService?.value === service.value) return;

    setSelectedService(service);
    setAnimatingService(service.value);
    
    // Corresponds to animation duration in index.html
    setTimeout(() => {
        setAnimatingService(null);
    }, 400);
  };
  
  useEffect(() => { setSelectedTime(null); }, [selectedDate, selectedService]);

  const { suggestedTimes, otherTimes } = useMemo(() => {
    if (!selectedDate || !selectedService) return { suggestedTimes: [], otherTimes: [] };

    const serviceDuration = selectedService.duration;
    const dayBookings = existingBookings[dateKey] || [];
    const bookedSlots = dayBookings.map(b => {
      const [h, m] = b.time.split(':').map(Number);
      const start = h * 60 + m;
      return { start, end: start + b.duration };
    }).sort((a, b) => a.start - b.start);

    const dayOfWeek = selectedDate.getDay();
    const isEvenDay = EVEN_DAYS_OF_WEEK.includes(dayOfWeek);
    const workStart = isEvenDay ? 13 * 60 : 12 * 60;
    const workEnd = 20 * 60;
    
    const allTimes: string[] = [];
    for (let t = workStart; t < workEnd; t += 60) {
      const slotStart = t;
      const slotEnd = t + serviceDuration;
      if (slotEnd > workEnd) continue;
      const isOverlapping = bookedSlots.some(b => slotStart < b.end && slotEnd > b.start);
      if (!isOverlapping) {
        const h = Math.floor(t / 60).toString().padStart(2, '0');
        allTimes.push(`${h}:00`);
      }
    }

    if (allTimes.length === 0) return { suggestedTimes: [], otherTimes: [] };

    let suggested: string[] = [];

    if (dayBookings.length === 0) {
      // Logic for an empty day: suggest specific prime times.
      const primeSuggestions = isEvenDay ? ["13:00", "15:00"] : ["12:00", "14:00"];
      suggested = primeSuggestions.filter(time => allTimes.includes(time));
      // Fallback: If prime times are not available (e.g., for a long service), suggest the first available time.
      if (suggested.length === 0 && allTimes.length > 0) {
        suggested.push(allTimes[0]);
      }
    } else {
      // Logic for a day with existing bookings: suggest adjacent slots.
      const adjacentSuggestions: string[] = [];
      for (const time of allTimes) {
        const [h] = time.split(':').map(Number);
        const timeInMinutes = h * 60;
        const isAdjacent = bookedSlots.some(b => timeInMinutes + serviceDuration === b.start || timeInMinutes === b.end);
        if (isAdjacent) {
          adjacentSuggestions.push(time);
        }
      }
      suggested = adjacentSuggestions;
      // Fallback: If no adjacent slots are found, suggest the first available slot.
      if (suggested.length === 0 && allTimes.length > 0) {
        suggested.push(allTimes[0]);
      }
    }
    
    const others = allTimes.filter(t => !suggested.includes(t));

    return { suggestedTimes: suggested, otherTimes: others };
  }, [selectedDate, selectedService, existingBookings, dateKey]);

  const validateName = (value: string) => (!value.trim() ? 'نام نمی‌تواند خالی باشد.' : value.trim().length < 3 ? 'نام باید حداقل ۳ حرف باشد.' : '');
  const validatePhone = (value: string) => (!/^09\d{9}$/.test(value) ? 'فرمت شماره موبایل صحیح نیست (مثال: 09123456789).' : '');

  const handleNameBlur = () => setErrors(e => ({ ...e, name: validateName(name) }));
  const handlePhoneBlur = () => setErrors(e => ({ ...e, phone: validatePhone(phone) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameError = validateName(name);
    const phoneError = validatePhone(phone);
    if (nameError || phoneError) {
      setErrors({ name: nameError, phone: phoneError });
      showNotification({ type: 'error', title: 'خطای فرم', message: 'لطفاً خطاهای فرم را برطرف کنید.' });
      return;
    }
    if (!selectedService || !selectedDate || !selectedTime) {
      showNotification({ type: 'error', title: 'خطای فرم', message: 'لطفاً تمام موارد را انتخاب کنید.' });
      return;
    }
    
    const trackingCode = Math.floor(100000 + Math.random() * 900000);
    const newBooking: Booking = { name: name.trim(), phone, service: selectedService.value, date: dateKey, time: selectedTime, trackingCode };
    onBookingSuccess(newBooking);
    
    setName(''); setPhone(''); setSelectedService(null); setSelectedDate(null); setSelectedTime(null); setErrors({});
  };

  const isSubmitDisabled = !name.trim() || !phone.trim() || !selectedService || !selectedDate || !selectedTime || !!errors.name || !!errors.phone;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <fieldset className="space-y-4 fade-in-up" style={{ animationDelay: '600ms' }}>
        <legend className="text-xl font-bold text-slate-200 border-b-2 border-pink-500/50 pb-2 mb-2 w-full">۱. اطلاعات شخصی</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 pt-2">
          <div className="form-group">
            <div className="input-wrapper">
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} onBlur={handleNameBlur} placeholder=" " className="form-input peer" />
              <label htmlFor="name" className="form-label">نام و نام خانوادگی:</label>
            </div>
            {errors.name && <div className="error-message"><i className="fas fa-exclamation-circle"></i>{errors.name}</div>}
          </div>
          <div className="form-group">
            <div className="input-wrapper">
              <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} onBlur={handlePhoneBlur} placeholder=" " maxLength={11} className="form-input peer" />
              <label htmlFor="phone" className="form-label">شماره موبایل:</label>
            </div>
            {errors.phone && <div className="error-message"><i className="fas fa-exclamation-circle"></i>{errors.phone}</div>}
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4 fade-in-up" style={{ animationDelay: '800ms' }}>
        <legend className="text-xl font-bold text-slate-200 border-b-2 border-fuchsia-500/50 pb-2 mb-4 w-full">۲. انتخاب خدمات</legend>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6 justify-items-center">
          {SERVICES.map(service => (
            <div key={service.value} className="service-bubble-container" onClick={() => handleServiceSelect(service)}>
              <div className={`service-bubble ${selectedService?.value === service.value ? 'selected' : ''} ${animatingService === service.value ? 'animate-pop-select' : ''}`}>
                <i className={`fas ${serviceIcons[service.value]} text-2xl mb-2`}></i>
                <span className="text-sm">{service.value}</span>
                <span className="text-xs opacity-80 mt-1">{service.price.toLocaleString('fa-IR')} تومان</span>
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset className={`space-y-4 fade-in-up ${isCalendarOpen ? 'z-30' : ''} relative`} style={{ animationDelay: '1000ms' }}>
        <legend className="text-xl font-bold text-slate-200 border-b-2 border-cyan-400/50 pb-2 mb-4 w-full">۳. انتخاب زمان</legend>
        <div className="relative">
          <label className="font-semibold text-slate-400 text-sm mb-2 block">تاریخ مراجعه:</label>
          <button type="button" id="date-button" onClick={() => setIsCalendarOpen(prev => !prev)} className="w-full p-4 bg-black/20 border-2 border-transparent focus:border-cyan-400 rounded-lg focus:outline-none transition text-right flex justify-between items-center">
            <span className={!selectedDate ? 'text-slate-400' : 'text-white font-semibold'}>{formattedDate}</span>
            <i className={`fas fa-calendar-alt text-slate-400 transition-transform ${isCalendarOpen ? 'rotate-12 text-cyan-400' : ''}`}></i>
          </button>
          {isCalendarOpen && <PersianCalendar onSelect={(date) => { setSelectedDate(date); setIsCalendarOpen(false); }} onClose={() => setIsCalendarOpen(false)} selectedDate={selectedDate} />}
        </div>
        
        {selectedDate && selectedService && (suggestedTimes.length > 0 || otherTimes.length > 0) && (
          <div className="space-y-4 pt-2">
            {suggestedTimes.length > 0 && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-sm text-emerald-300 font-semibold">
                <i className="fas fa-star mr-2 text-yellow-400"></i>
                برای بهینه‌سازی زمان‌بندی، لطفاً از بین ساعات پیشنهادی ما انتخاب فرمایید.
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              {suggestedTimes.map(time => (
                <button key={time} type="button" onClick={() => setSelectedTime(time)} className={`relative px-6 py-3 rounded-lg font-bold text-lg transition ${selectedTime === time ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-white/10 text-white hover:bg-white/20'} suggested-time`}>
                  <span className="suggestion-badge">پیشنهاد ما</span>
                  {time}
                </button>
              ))}
            </div>
            {otherTimes.length > 0 && (
              <>
                {suggestedTimes.length > 0 && <div className="text-center text-sm text-slate-400 font-semibold pt-2">در صورت عدم امکان، سایر زمان‌ها:</div>}
                <div className="flex flex-wrap gap-2">
                  {otherTimes.map(time => (
                    <button key={time} type="button" onClick={() => setSelectedTime(time)} className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${selectedTime === time ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-700/50 text-slate-200 hover:bg-slate-700'}`}>
                      {time}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </fieldset>
      
      <button type="submit" disabled={isSubmitDisabled} className="w-full bg-gradient-to-br from-pink-500 to-fuchsia-600 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-fuchsia-500/30 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:-translate-y-0 disabled:shadow-none disabled:from-slate-600 disabled:to-slate-700">
        <i className="fas fa-check-circle mr-2"></i> ثبت نهایی و دریافت کد رهگیری
      </button>
    </form>
  );
};

export default BookingForm;