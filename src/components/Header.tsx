import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-8">
      {/* کادر دایره‌ای برای لوگو */}
      <div className="mx-auto w-32 h-32 rounded-full overflow-hidden bg-transparent">
        <img
          src="/logo.png"
          alt="لوگو"
          className="w-full h-full object-cover"
          style={{ 
            transform: 'scale(1.6)', // بزرگنمایی برای حذف حاشیه سفید
            transformOrigin: 'center'
          }}
        />
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
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          .fade-in-up {
            opacity: 0;
            animation: fadeIn 0.5s ease forwards;
          }
        `}
      </style>
    </header>
  );
};

export default Header;