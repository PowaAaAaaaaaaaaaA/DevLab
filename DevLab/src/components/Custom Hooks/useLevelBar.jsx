// for Level Bar Anomation

import { useState, useEffect } from "react";
import useUserDetails from "./useUserDetails";

export default function useLevelBar() {
  const [animatedExp, setAnimatedExp] = useState(0);
  const { Userdata, isLoading } = useUserDetails();

  useEffect(() => {
    if (Userdata?.exp >= 0) {
      let start = animatedExp;
      const target = Userdata.exp;
      const step = () => {
        if (start < target) {
          start = Math.min(start + 0.4, target);
          setAnimatedExp(start);
          requestAnimationFrame(step);
        } else {
          setAnimatedExp(target);
        }
      };
      requestAnimationFrame(step);
    }
  }, [Userdata?.exp]);

  return { animatedExp, isLoading };

}
