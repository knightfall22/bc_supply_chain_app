"use client";

const AppLoader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex items-end gap-2">
        <span className="loader-cube animate-cube-delay-1" />
        <span className="loader-cube animate-cube-delay-2" />
        <span className="loader-cube animate-cube-delay-3" />
      </div>
    </div>
  );
};

export default AppLoader;
