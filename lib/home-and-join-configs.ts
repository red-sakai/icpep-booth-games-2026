// src/lib/constants/social-configs.ts
import { Facebook, Instagram, Linkedin } from "lucide-react";

export const SOCIAL_PLATFORMS = [
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "bg-blue-100 text-blue-600 border-blue-400",
    href: "https://www.facebook.com/icpepse.pupmanila",
    url: "/qr-codes/facebook.png",
    textColor: "text-blue-600",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "bg-pink-100 text-pink-600 border-pink-400",
    href: "https://www.instagram.com/icpep.se_pup/",
    url: "/qr-codes/instagram.png",
    textColor: "text-pink-600",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "bg-blue-100 text-blue-700 border-blue-400",
    href: "https://www.linkedin.com/company/icpepse-pupmanila/",
    url: "/qr-codes/linked-in.png",
    textColor: "text-blue-700",
  },
];

export const BACK_TO_HOME = {
  pink: "bg-white/50 backdrop-blur-sm border-pink-300 hover:bg-pink-100/70 hover:border-pink-400 text-pink-600 hover:text-pink-600",
  rose: "bg-white/50 backdrop-blur-sm border-rose-300 hover:bg-rose-50/70 hover:border-rose-400 text-rose-600 hover:text-rose-600",
  purple: "bg-white/50 backdrop-blur-sm border-purple-300 hover:bg-purple-100/70 hover:border-purple-400 text-purple-600 hover:text-purple-600",
} as const;