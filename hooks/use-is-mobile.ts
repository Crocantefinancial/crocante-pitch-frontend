import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 1024) {
  // Always start with false to avoid hydration mismatches
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Only check after mount to avoid hydration issues
    function checkIsMobile() {
      setIsMobile(window.innerWidth < breakpoint);
    }

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, [breakpoint]);

  return isMobile;
}
