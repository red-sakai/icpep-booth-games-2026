import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export function useGameHubTour(currentGame: string) {
  
  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
    
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
    localStorage.setItem("hasSeenTour", "true");
  };

  useEffect(() => {
    if (currentGame === "home") {
      setTimeout(() => {
        startTour();
      }, 500);
    }
  }, [currentGame]);

  return { startTour }; 
}