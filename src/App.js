"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var Header_tsx_1 = require("./components/Header.tsx");
var BookingForm_tsx_1 = require("./components/BookingForm.tsx");
var InfoSections_tsx_1 = require("./components/InfoSections.tsx");
var Notification_tsx_1 = require("./components/Notification.tsx");
var constants_ts_1 = require("./constants.ts");
// Mock data is used on every load for local testing.
var initialMockBookings = [
    { name: 'مشتری تست ۱', phone: '09120000001', service: 'کاشت', date: '2024/6/15', time: '13:00', trackingCode: 111111 },
    { name: 'مشتری تست ۲', phone: '09120000002', service: 'ژلیش پا', date: '2024/6/15', time: '15:00', trackingCode: 222222 },
    { name: 'مشتری تست ۳', phone: '09120000003', service: 'دست و پا', date: '2024/6/16', time: '12:00', trackingCode: 333333 },
    { name: 'مشتری تست ۴', phone: '09120000004', service: 'کاشت', date: '2024/6/16', time: '15:00', trackingCode: 444444 },
];
// Helper to derive simplified bookings for calendar logic
var deriveSimplifiedBookings = function (fullBookings) {
    return fullBookings.reduce(function (acc, booking) {
        var service = constants_ts_1.SERVICES.find(function (s) { return s.value === booking.service; });
        var duration = service ? service.duration : 120;
        var entry = { time: booking.time, duration: duration };
        if (!acc[booking.date]) {
            acc[booking.date] = [];
        }
        acc[booking.date].push(entry);
        return acc;
    }, {});
};
var App = function () {
    var _a = (0, react_1.useState)(initialMockBookings), fullBookings = _a[0], setFullBookings = _a[1];
    var _b = (0, react_1.useState)(null), notification = _b[0], setNotification = _b[1];
    var simplifiedBookings = (0, react_1.useMemo)(function () { return deriveSimplifiedBookings(fullBookings); }, [fullBookings]);
    var showNotification = (0, react_1.useCallback)(function (details) {
        setNotification(details);
        setTimeout(function () {
            setNotification(null);
        }, 60000);
    }, []);
    var handleBookingSuccess = (0, react_1.useCallback)(function (newBooking) { return __awaiter(void 0, void 0, void 0, function () {
        var response, dateParts, gregorianDate, dayName, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch('http://localhost:3001/api/add-booking', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(newBooking),
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    setFullBookings(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newBooking], false); });
                    dateParts = newBooking.date.split('/').map(Number);
                    gregorianDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                    dayName = new Intl.DateTimeFormat('fa-IR', { weekday: 'long' }).format(gregorianDate);
                    showNotification({
                        type: 'success',
                        title: 'نوبت شما با موفقیت ثبت شد!',
                        details: [
                            { label: 'خدمت', value: newBooking.service },
                            { label: 'روز', value: "".concat(dayName, " ").concat(gregorianDate.toLocaleDateString('fa-IR')) },
                            { label: 'ساعت', value: newBooking.time },
                            { label: 'کد رهگیری', value: newBooking.trackingCode.toString() },
                        ]
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Failed to save booking:', error_1);
                    showNotification({
                        type: 'error',
                        title: 'خطا در ثبت نوبت',
                        message: 'متاسفانه مشکلی در ارتباط با سرور پیش آمده. لطفاً بعداً تلاش کنید.'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [showNotification]);
    var findBookingByCode = (0, react_1.useCallback)(function (code) {
        var numericCode = parseInt(code, 10);
        if (isNaN(numericCode))
            return undefined;
        return fullBookings.find(function (b) { return b.trackingCode === numericCode; });
    }, [fullBookings]);
    var handleCancellationRequest = (0, react_1.useCallback)(function (booking) {
        showNotification({
            type: 'success',
            title: 'درخواست لغو ثبت شد',
            message: "\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0644\u063A\u0648 \u0628\u0631\u0627\u06CC \u0646\u0648\u0628\u062A ".concat(booking.service, " \u062F\u0631 \u062A\u0627\u0631\u06CC\u062E ").concat(new Date(booking.date.replace(/\//g, '-')).toLocaleDateString('fa-IR'), " \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u062B\u0628\u062A \u0634\u062F.")
        });
    }, [showNotification]);
    return (<div className="min-h-screen text-slate-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#1a0b2e]/90 to-[#11071F]/90 backdrop-blur-xl border border-fuchsia-500/20 rounded-3xl shadow-2xl shadow-fuchsia-500/20 p-8 md:p-10 my-8 fade-in-up" style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.1) inset, 0 25px 50px -12px rgba(0,0,0,0.4)' }}>
        <Header_tsx_1.default />
        <main>
          <BookingForm_tsx_1.default existingBookings={simplifiedBookings} onBookingSuccess={handleBookingSuccess} showNotification={showNotification}/>
          <InfoSections_tsx_1.default onTrack={findBookingByCode} onCancelRequest={handleCancellationRequest} showNotification={showNotification}/>
        </main>
        <footer className="text-center mt-10 text-slate-400/80 text-xs space-y-1 font-semibold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
          <p><i className="fas fa-clock mr-1.5 opacity-80"></i> آخرین زمان رزرو: ساعت ۱۸</p>
          <p><i className="fas fa-phone-volume mr-1.5 opacity-80"></i> جهت لغو: تا ۲۴ ساعت قبل از نوبت اقدام کنید</p>
        </footer>
      </div>
      {notification && <Notification_tsx_1.default {...notification} onClose={function () { return setNotification(null); }}/>}
    </div>);
};
exports.default = App;
