import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  slotId?: string;
  className?: string;
}

export const AdUnit: React.FC<AdUnitProps> = ({ slotId = "1234567890", className = "" }) => {
  const adInitialized = useRef(false);

  useEffect(() => {
    // If already initialized in this lifecycle, skip
    if (adInitialized.current) return;

    // Delay execution to ensure the DOM element has a width (fixes availableWidth=0 error)
    const timer = setTimeout(() => {
      try {
        // @ts-ignore
        if (window.adsbygoogle) {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          adInitialized.current = true;
        }
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }, 500); // 500ms delay to ensure layout is stable

    return () => clearTimeout(timer);
  }, [slotId]);

  return (
    <div className={`w-full flex flex-col items-center justify-center my-8 ${className}`}>
       <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">Advertisement</div>
       
       <div className="w-full max-w-[728px] min-h-[100px] bg-slate-50 flex items-center justify-center overflow-hidden rounded-lg">
          <ins className="adsbygoogle"
              style={{ display: 'block', width: '100%' }}
              data-ad-client="ca-pub-5261393249672605"
              data-ad-slot={slotId}
              data-ad-format="auto"
              data-full-width-responsive="true"></ins>
       </div>
    </div>
  );
};