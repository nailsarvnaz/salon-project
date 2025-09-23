"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var InfoSections = function (_a) {
    var onTrack = _a.onTrack, onCancelRequest = _a.onCancelRequest, showNotification = _a.showNotification;
    var _b = (0, react_1.useState)('address'), openSection = _b[0], setOpenSection = _b[1]; // Default open
    // State for the tracking section
    var _c = (0, react_1.useState)(''), trackingCode = _c[0], setTrackingCode = _c[1];
    var _d = (0, react_1.useState)(null), foundBooking = _d[0], setFoundBooking = _d[1];
    var _e = (0, react_1.useState)(false), isConfirmingCancel = _e[0], setIsConfirmingCancel = _e[1];
    var toggleSection = function (sectionId) {
        setOpenSection(function (prev) { return (prev === sectionId ? null : sectionId); });
    };
    var handleTrack = function () {
        setFoundBooking(null);
        setIsConfirmingCancel(false);
        if (!trackingCode.trim()) {
            showNotification({ type: 'warning', title: 'کد رهگیری', message: 'لطفاً کد رهگیری را وارد کنید.' });
            return;
        }
        var booking = onTrack(trackingCode);
        if (booking) {
            setFoundBooking(booking);
        }
        else {
            showNotification({ type: 'error', title: 'کد رهگیری نامعتبر', message: 'نوبتی با این کد رهگیری یافت نشد.' });
        }
    };
    var handleCancel = function () {
        if (foundBooking) {
            onCancelRequest(foundBooking);
            setFoundBooking(null);
            setTrackingCode('');
            setIsConfirmingCancel(false);
        }
    };
    var sections = [
        {
            id: 'address',
            title: 'آدرس سالن',
            icon: 'fa-map-marker-alt',
            content: (<div className="text-slate-300 space-y-2 text-sm md:text-base">
          <p><strong>آدرس:</strong> میدان گلشهر،ساختمان ستاره،طبقه ۲ ، واحد ۲۰۵</p>
        </div>)
        },
        {
            id: 'training',
            title: 'اطلاعات آموزش',
            icon: 'fa-graduation-cap',
            content: (<div className="text-slate-300 space-y-2 text-sm md:text-base">
          <p>جهت اطلاع از شرایط کلاس‌های آموزشی مبتدی تا پیشرفته و ورکشاپ‌های تخصصی، لطفاً به دایرکت اینستاگرام ما پیام دهید.</p>
          <p className="pt-2 text-center">
              <a href="https://instagram.com/nail_sarvnaz" target="_blank" rel="noopener noreferrer" className="text-pink-400 font-bold hover:underline text-lg">
                  <i className="fab fa-instagram mr-2"></i> nail_sarvnaz
              </a>
          </p>
        </div>)
        },
        {
            id: 'tracking',
            title: 'پیگیری یا لغو رزرو',
            icon: 'fa-search',
            content: (<div className="space-y-4">
          <div className="form-group">
            <label htmlFor="tracking-code" className="font-semibold text-slate-400 text-sm mb-2 block">کد رهگیری خود را وارد کنید:</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="input-wrapper flex-grow min-w-0">
                <input type="text" id="tracking-code" value={trackingCode} onChange={function (e) { return setTrackingCode(e.target.value.trim()); }} onKeyDown={function (e) { return e.key === 'Enter' && handleTrack(); }} placeholder="کد ۶ رقمی" className="w-full p-3 bg-black/20 text-white border-2 border-transparent focus:border-cyan-400 rounded-lg focus:outline-none transition"/>
              </div>
              <button type="button" onClick={handleTrack} className="bg-gradient-to-br from-cyan-500 to-teal-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-cyan-500/30 transform hover:-translate-y-1 transition-all duration-300">
                <i className="fas fa-search mr-2"></i> پیگیری
              </button>
            </div>
          </div>
          {foundBooking && (<div className="p-5 bg-black/20 border border-white/10 rounded-xl shadow-lg animate-fade-in space-y-4">
              <h3 className="font-bold text-slate-100 text-lg border-b border-white/10 pb-2 mb-3">اطلاعات نوبت شما:</h3>
              <div className="text-sm text-slate-300 space-y-3">
                 <div className="flex justify-between items-center"><span><strong>نام:</strong></span> <span>{foundBooking.name}</span></div>
                 <div className="flex justify-between items-center"><span><strong>خدمت:</strong></span> <span>{foundBooking.service}</span></div>
                 <div className="flex justify-between items-center"><span><strong>تاریخ:</strong></span> <span className="font-mono">{new Date(foundBooking.date.replace(/\//g, '-')).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                 <div className="flex justify-between items-center"><span><strong>ساعت:</strong></span> <span className="font-mono">{foundBooking.time}</span></div>
              </div>
              {!isConfirmingCancel ? (<button onClick={function () { return setIsConfirmingCancel(true); }} className="w-full mt-4 bg-gradient-to-br from-red-500 to-orange-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <i className="fas fa-trash-alt mr-2"></i> درخواست لغو نوبت
                </button>) : (<div className="mt-4 p-4 bg-red-500/10 border-2 border-dashed border-red-500/30 rounded-lg text-center space-y-3">
                  <p className="text-red-300 font-semibold">آیا از لغو این نوبت اطمینان دارید؟</p>
                  <div className="flex justify-center gap-4">
                    <button onClick={handleCancel} className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition hover:bg-red-700">
                      بله، لغو کن
                    </button>
                    <button onClick={function () { return setIsConfirmingCancel(false); }} className="bg-slate-600 text-slate-100 font-bold py-2 px-6 rounded-lg transition hover:bg-slate-500">
                      انصراف
                    </button>
                  </div>
                </div>)}
            </div>)}
        </div>)
        }
    ];
    return (<section className="mt-12 pt-8 border-t border-fuchsia-500/20 space-y-3 fade-in-up" style={{ animationDelay: '1200ms' }}>
      {sections.map(function (_a) {
            var id = _a.id, title = _a.title, icon = _a.icon, content = _a.content;
            return (<div key={id} className="bg-black/20 rounded-xl overflow-hidden transition-all duration-500 ease-in-out shadow-md backdrop-blur-sm border border-white/5">
          <button onClick={function () { return toggleSection(id); }} className="w-full flex justify-between items-center p-4 text-right font-bold text-slate-200 hover:bg-white/5 transition-colors">
            <span className="text-lg"><i className={"fas ".concat(icon, " ml-3 text-fuchsia-400")}></i>{title}</span>
            <i className={"fas fa-chevron-down transition-transform duration-300 text-slate-400 ".concat(openSection === id ? 'rotate-180' : '')}></i>
          </button>
          <div className={"transition-all duration-500 ease-in-out grid ".concat(openSection === id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
            <div className="overflow-hidden">
              <div className="p-4 pt-0 text-slate-300">
                {content}
              </div>
            </div>
          </div>
        </div>);
        })}
    </section>);
};
exports.default = InfoSections;
