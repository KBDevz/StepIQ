interface PhoneFrameProps {
  children: React.ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="page-bg theme-dark">
      <div className="phone-frame-outer">
        <div className="phone-frame-inner">
          <div className="phone-frame-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
