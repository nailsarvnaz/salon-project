"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Header = function () {
    return (<header className="text-center py-8">
      {/* کادر دایره‌ای برای لوگو */}
      <div className="mx-auto w-32 h-32 rounded-full overflow-hidden bg-transparent">
        <img src="/logo.png" alt="لوگو" className="w-full h-full object-cover" style={{
            transform: 'scale(1.6)', // بزرگنمایی برای حذف حاشیه سفید
            transformOrigin: 'center'
        }}/>
      </div>

      {/* عنوان */}
      <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-400 via-fuchsia-400 to-cyan-400 text-transparent bg-clip-text pb-2 mt-6">
        آموزش و خدمات ناخن سروناز
      </h1>

      {/* توضیح زیر عنوان */}
      <p className="text-slate-300/90 mt-3 text-lg">
        برای رزرو نوبت، فرم زیر را با دقت تکمیل کنید
      </p>

      {/* انیمیشن‌ها */}
      <style>
        {"\n          @keyframes fadeIn {\n            0% { opacity: 0; transform: translateY(-20px); }\n            100% { opacity: 1; transform: translateY(0); }\n          }\n\n          .fade-in-up {\n            opacity: 0;\n            animation: fadeIn 0.5s ease forwards;\n          }\n        "}
      </style>
    </header>);
};
exports.default = Header;
