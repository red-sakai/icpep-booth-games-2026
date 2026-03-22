"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { QrCode, Facebook, Instagram, Linkedin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SocialQRCode } from "@/lib/types";

export default function HowToJoinSection() {
  const [openQRDialog, setOpenQRDialog] = useState(false);
  const [selectedQR, setSelectedQR] = useState<SocialQRCode | null>(null);

  const socialQRCodes: SocialQRCode[] = [
    {
      name: "Facebook",
      icon: <Facebook size={24} className="text-blue-600" />,
      color: "bg-blue-100 text-blue-600 border-blue-400",
      url: "/qr-codes/facebook.png",
    },
    {
      name: "Instagram",
      icon: <Instagram size={24} className="text-pink-600" />,
      color: "bg-pink-100 text-pink-600 border-pink-400",
      url: "/qr-codes/instagram.png",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={24} className="text-blue-600" />,
      color: "bg-blue-100 text-blue-700 border-blue-400",
      url: "/qr-codes/linked-in.png",
    },
  ];

  const openQRCodeDialog = (qrCode: SocialQRCode) => {
    setSelectedQR(qrCode);
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
                <span className="inline-flex items-center mx-1 text-blue-600 font-medium">
                  <Facebook size={16} className="mr-1" /> Facebook,
                </span>
                <span className="inline-flex items-center mx-1 text-pink-600 font-medium">
                  <Instagram size={16} className="mr-1" /> Instagram,
                </span>
                and
                <span className="inline-flex items-center mx-1 text-blue-700 font-medium">
                  <Linkedin size={16} className="mr-1" /> LinkedIn
                </span>
              </span>
            </li>
            <li>
              Each social media follow grants one game entry (maximum of three
              entries per player).
            </li>
          </ol>

          <div className="grid grid-cols-3 gap-4">
            {socialQRCodes.map((qrCode, index) => (
              <div key={index} className="flex flex-col items-center">
                <button
                  onClick={() => openQRCodeDialog(qrCode)}
                  className={`border-2 border-dashed rounded-lg p-3 w-full flex flex-col items-center justify-center bg-white/80 hover:bg-white transition-all cursor-pointer ${
                    qrCode.color.split(" ")[2]
                  }`}
                  aria-label={`Scan QR code for ${qrCode.name}`}
                >
                  <div className="mb-2">{qrCode.icon}</div>
                  <img
                    src={qrCode.url || "/placeholder.svg"}
                    alt={`QR code for ${qrCode.name}`}
                    className="w-16 h-16 object-contain"
                  />
                </button>
                <span
                  className={`text-xs font-medium mt-1 px-2 py-1 rounded-full ${qrCode.color}`}
                >
                  {qrCode.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* QR Code Dialog */}
      <Dialog open={openQRDialog} onOpenChange={setOpenQRDialog}>
        <DialogContent className="sm:max-w-md bg-white border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedQR?.icon}
              <span>Scan {selectedQR?.name} QR Code</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6">
            <div
              className={`border-4 border-dashed rounded-lg p-4 ${
                selectedQR?.color.split(" ")[2]
              }`}
            >
              <img
                src={selectedQR?.url || "/placeholder.svg"}
                alt={`QR code for ${selectedQR?.name}`}
                className="w-64 h-64 object-contain"
              />
            </div>
            <p className="mt-4 text-center text-slate-600">
              Scan this QR code to follow us on {selectedQR?.name}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}