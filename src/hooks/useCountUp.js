import { useState, useEffect } from 'react';

export function useCountUp(end, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const numericEnd = typeof end === 'number' ? end : parseFloat(String(end).replace(/[^0-9.-]/g, ''));
    if (isNaN(numericEnd) || numericEnd === 0) {
      setCount(0);
      return;
    }

    let startTimestamp = null;
    let rafId;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * numericEnd * 10) / 10);
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setCount(numericEnd);
      }
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [end, duration]);

  return count;
}
