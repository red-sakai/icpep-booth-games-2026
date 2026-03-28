"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SOCIAL_PLATFORMS } from "@/lib/home-and-join-configs";
import type { SocialQRCode } from "@/lib/types";

export default function HowToJoinSection() {
  const [openQRDialog, setOpenQRDialog] = useState(false);
  const [selectedQR, setSelectedQR] = useState<SocialQRCode | null>(null);

  const handleOpenQR = (platform: typeof SOCIAL_PLATFORMS[0]) => {
    // We transform the config data to match the expected SocialQRCode type
    setSelectedQR({
      ...platform,
      icon: <platform.icon size={24} className={platform.textColor} />
    });
    setOpenQRDialog(true);
  };

  return (
    <>
      <Card className="overflow-hidden border-2 border-purple-300 shadow-md">
        <div className="bg-gradient-to-b from-purple-50 to-white h-full p-6">
          <h2 className="text-2xl font-bold text-purple-600 mb-4 flex items-center gap-2">
            <QrCode size={24} className="text-purple-500" />
            How to Join
          </h2>

          <ol className="list-decimal pl-5 space-y-2 text-slate-700 mb-6">
            <li className="flex items-start">
              <span>
                Follow ICPEP.SE - PUP Manila on 
                {SOCIAL_PLATFORMS.map((p, i) => (
                  <span key={p.id} className={`inline-flex items-center mx-1 ${p.textColor} font-medium`}>
                    <p.icon size={16} className="mr-1" /> 
                    {p.name}{i < SOCIAL_PLATFORMS.length - 1 ? "," : ""}
                  </span>
                ))}
              </span>
            </li>
            <li>Each social media follow grants one game entry (max of 3).</li>
          </ol>

          <div className="grid grid-cols-3 gap-4">
            {SOCIAL_PLATFORMS.map((platform) => (
              <div key={platform.id} className="flex flex-col items-center">
                <button
                  onClick={() => handleOpenQR(platform)}
                  className={`border-2 border-dashed rounded-lg p-3 w-full flex flex-col items-center justify-center bg-white/80 hover:bg-white transition-all cursor-pointer ${platform.color.split(" ")[2]}`}
                >
                  <div className="mb-2">
                    <platform.icon size={24} className={platform.textColor} />
                  </div>
                  <img src={platform.url} alt={platform.name} className="w-16 h-16 object-contain" />
                </button>
                <span className={`text-xs font-medium mt-1 px-2 py-1 rounded-full ${platform.color}`}>
                  {platform.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Dialog open={openQRDialog} onOpenChange={setOpenQRDialog}>
        <DialogContent className="sm:max-w-md bg-white border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedQR?.icon}
              <span>Scan {selectedQR?.name} QR Code</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6">
             <div className="border-4 border-dashed rounded-lg p-4 border-slate-200">
                <img src={selectedQR?.url} alt={selectedQR?.name} className="w-64 h-64 object-contain" />
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}