
import React, { useState, useCallback, useMemo } from 'react';
import { Booking, NotificationDetails } from './types.ts';
import Header from './components/Header.tsx';
import BookingForm from './components/BookingForm.tsx';
import InfoSections from './components/InfoSections.tsx';
import Notification from './components/Notification.tsx';
import { SERVICES } from './constants.ts';

interface BookingEntry {
  time: string;
  duration: number;
}

// Mock data is used on every load for local testing.
const initialMockBookings: Booking[] = [
    { name: 'مشتری تست ۱', phone: '09120000001', service: 'کاشت', date: '2024/6/15', time: '13:00', trackingCode: 111111 },
    { name: 'مشتری تست ۲', phone: '09120000002', service: 'ژلیش پا', date: '2024/6/15', time: '15:00', trackingCode: 222222 },
    { name: 'مشتری تست ۳', phone: '09120000003', service: 'دست و پا', date: '2024/6/16', time: '12:00', trackingCode: 333333 },
    { name: 'مشتری تست ۴', phone: '09120000004', service: 'کاشت', date: '2024/6/16', time: '15:00', trackingCode: 444444 },
];

// Helper to derive simplified bookings for calendar logic
const deriveSimplifiedBookings = (fullBookings: Booking[]): Record<string, BookingEntry[]> => {
    return fullBookings.reduce((acc, booking) => {
        const service = SERVICES.find(s => s.value === booking.service);
        const duration = service ? service.duration : 120;
        const entry: BookingEntry = { time: booking.time, duration };
        if (!acc[booking.date]) {
            acc[booking.date] = [];
        }
        acc[booking.date].push(entry);
        return acc;
    }, {} as Record<string, BookingEntry[]>);
};

const App: React.FC = () => {
  const [fullBookings, setFullBookings] = useState<Booking[]>(initialMockBookings);
  const [notification, setNotification] = useState<NotificationDetails | null>(null);
  
  const simplifiedBookings = useMemo(() => deriveSimplifiedBookings(fullBookings), [fullBookings]);

  const showNotification = useCallback((details: NotificationDetails) => {
    setNotification(details);
    setTimeout(() => {
      setNotification(null);
    }, 60000); 
  }, []);
  
  const handleBookingSuccess = useCallback(async (newBooking: Booking) => {
    try {
      const response = await fetch('http://localhost:3001/api/add-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setFullBookings(prev => [...prev, newBooking]);
      
      const dateParts = newBooking.date.split('/').map(Number); // YYYY/M/D
      const gregorianDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      const dayName = new Intl.DateTimeFormat('fa-IR', { weekday: 'long' }).format(gregorianDate);

      showNotification({
        type: 'success',
        title: 'نوبت شما با موفقیت ثبت شد!',
        details: [
          { label: 'خدمت', value: newBooking.service },
          { label: 'روز', value: `${dayName} ${gregorianDate.toLocaleDateString('fa-IR')}` },
          { label: 'ساعت', value: newBooking.time },
          { label: 'کد رهگیری', value: newBooking.trackingCode.toString() },
        ]
      });

    } catch (error) {
      console.error('Failed to save booking:', error);
      showNotification({
        type: 'error',
        title: 'خطا در ثبت نوبت',
        message: 'متاسفانه مشکلی در ارتباط با سرور پیش آمده. لطفاً بعداً تلاش کنید.'
      });
    }
  }, [showNotification]);

  const findBookingByCode = useCallback((code: string): Booking | undefined => {
      const numericCode = parseInt(code, 10);
      if (isNaN(numericCode)) return undefined;
      return fullBookings.find(b => b.trackingCode === numericCode);
  }, [fullBookings]);

  const handleCancellationRequest = useCallback((booking: Booking) => {
      showNotification({ 
          type: 'success', 
          title: 'درخواست لغو ثبت شد', 
          message: `درخواست لغو برای نوبت ${booking.service} در تاریخ ${new Date(booking.date.replace(/\//g, '-')).toLocaleDateString('fa-IR')} با موفقیت ثبت شد.`
      });
  }, [showNotification]);

  return (
    <div className="min-h-screen text-slate-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#1a0b2e]/90 to-[#11071F]/90 backdrop-blur-xl border border-fuchsia-500/20 rounded-3xl shadow-2xl shadow-fuchsia-500/20 p-8 md:p-10 my-8 fade-in-up" style={{boxShadow: '0 0 0 1px rgba(255,255,255,0.1) inset, 0 25px 50px -12px rgba(0,0,0,0.4)'}}>
        <Header />
        <main>
          <BookingForm 
            existingBookings={simplifiedBookings}
            onBookingSuccess={handleBookingSuccess} 
            showNotification={showNotification}
          />
          <InfoSections 
            onTrack={findBookingByCode}
            onCancelRequest={handleCancellationRequest}
            showNotification={showNotification}
          />
        </main>
        <footer className="text-center mt-10 text-slate-400/80 text-xs space-y-1 font-semibold" style={{textShadow: '0 2px 4px rgba(0,0,0,0.6)'}}>
          <p><i className="fas fa-clock mr-1.5 opacity-80"></i> آخرین زمان رزرو: ساعت ۱۸</p>
          <p><i className="fas fa-phone-volume mr-1.5 opacity-80"></i> جهت لغو: تا ۲۴ ساعت قبل از نوبت اقدام کنید</p>
        </footer>
      </div>
      {notification && <Notification {...notification} onClose={() => setNotification(null)} />}
    </div>
  );
};

export default App;
