import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export default function GameMechanicsSection() {
  return (
    <Card className="overflow-hidden border-2 border-pink-300 shadow-md">
      <div className="bg-gradient-to-b from-pink-50 to-white h-full p-6">
        <h2 className="text-2xl font-bold text-pink-700 mb-4 flex items-center gap-2">
          <Trophy size={24} className="text-pink-500" />
          Game Mechanics
        </h2>

        <ul className="space-y-3 text-black text-sm">
          <li className="flex items-start gap-2">
            <span className="bg-purple-200 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
              •
            </span>
            <span>Every player starts with one sticker by default.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-purple-200 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
              •
            </span>
            <span>In each game, the player bets their stickers:</span>
          </li>
          <li className="ml-8 flex items-start gap-2">
            <span className="text-emerald-600 font-bold">Win:</span>
            <span>
              The player doubles their stickers and proceeds to the next game.
            </span>
          </li>
          <li className="ml-8 flex items-start gap-2">
            <span className="text-rose-600 font-bold">Lose:</span>
            <span>
              The player retains their starting sticker count for that game.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-purple-200 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
              •
            </span>
            <span>
              This system applies across all three games, encouraging strategic
              choices.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-purple-200 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
              •
            </span>
            <span>
              Players can choose the order of the games they want to play.
            </span>
          </li>
        </ul>
      </div>
    </Card>
  );
}