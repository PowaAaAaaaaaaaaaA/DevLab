import { useEffect, useState } from "react";
import useUserAchievements from "./useUserAchievements";
import useFetchAchievements from "../BackEnd_Data/useFetchAchievements";

export default function useAchievementsProgressBar(userId, subject) {
  const { achievements: allAchievements, isLoading: loadingAll } = useFetchAchievements(subject);
  const { data: userAchievements, isLoading: loadingUser } = useUserAchievements(userId);
  const [animatedBar, setAnimatedBar] = useState(0);

  useEffect(() => {
    if (loadingAll || loadingUser || !allAchievements) return;

    // Filter unlocked achievements 
    const unlockedForSubject = Object.keys(userAchievements || {}).filter((id) =>
      id.toLowerCase().startsWith(subject.toLowerCase())
    );

    const totalAchievements = allAchievements.length;
    const unlockedCount = unlockedForSubject.length;

    const progress =
      totalAchievements > 0 ? (unlockedCount / totalAchievements) * 100 : 0;

    let current = animatedBar;
    const target = progress;

    const step = () => {
      if (current < target) {
        current = Math.min(current + 1, target);
        setAnimatedBar(current);
        requestAnimationFrame(step);
      } else {
        setAnimatedBar(target);
      }
    };

    console.log(
      `Progress [${subject}]: ${unlockedCount}/${totalAchievements} => ${progress}%`
    );

    requestAnimationFrame(step);
  }, [allAchievements, userAchievements, loadingAll, loadingUser, subject]);

  return { animatedBar };
}
