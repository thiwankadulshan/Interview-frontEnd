import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-300">
        <h1 className="text-2xl font-bold text-center text-black mb-8">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
