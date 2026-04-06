import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export function useGameHubTour(currentGame: string) {
  
  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      // Optional: popoverClass: "game-hub-tour", 
      steps: [
        {
          element: '#how-to-join-section', 
          popover: { 
            title: 'Welcome to the Game Hub!', 
            description: 'Here you can learn how to join the fun.' 
          }
        },
        {
          element: '#game-selector',
          popover: { 
            title: 'Choose a Game', 
            description: 'Swipe through and select which game you want to play.' 
          }
        },
        {
          element: '#leaderboard-section',
          popover: { 
            title: 'Check the Standings', 
            description: 'Keep an eye on who is leading the pack here.' 
          }
        }
      ]
    });

    driverObj.drive();
    
    // Save to sessionStorage so it resets when the tab is closed
    sessionStorage.setItem("hasSeenTourSession", "true");
  };

  useEffect(() => {
    // Only attempt to start if we are on the home screen
    if (currentGame === "home") {
      const hasSeenTour = sessionStorage.getItem("hasSeenTourSession");

      // Only auto-start if the session flag doesn't exist
      if (!hasSeenTour) {
        const timer = setTimeout(() => {
          startTour();
        }, 500);

        // Cleanup timer if the component unmounts or currentGame changes
        return () => clearTimeout(timer);
      }
    }
  }, [currentGame]);

  return { startTour }; 
}