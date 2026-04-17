import Link from "next/link";
import { Trophy, Heart, Mail, Share2, Globe } from "lucide-react";

export function Footer() {
  const socialLinks = [
    { Icon: Mail, href: "#" },
    { Icon: Share2, href: "#" },
    { Icon: Globe, href: "#" },
  ];

  return (
    <footer className="bg-carbon-950 border-t border-carbon-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-gold rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-carbon-950" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Golf<span className="text-gradient-gold">Heroes</span>
              </span>
            </div>
            <p className="text-carbon-400 text-sm leading-relaxed max-w-sm">
              A platform that transforms every round of golf into an act of generosity.
              Play, win, and change lives.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 border border-carbon-700 rounded-lg flex items-center justify-center text-carbon-400 hover:text-gold hover:border-gold transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-carbon-200 mb-4 tracking-wider uppercase">
              Platform
            </h4>
            <ul className="space-y-3">
              {["How It Works", "Charities", "Prize Draws", "Subscribe"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-carbon-400 hover:text-gold transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-carbon-200 mb-4 tracking-wider uppercase">
              Legal
            </h4>
            <ul className="space-y-3">
              {["Terms of Service", "Privacy Policy", "Cookie Policy", "Responsible Play"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-carbon-400 hover:text-gold transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-carbon-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-carbon-500">
            © {new Date().getFullYear()} GolfHeroes. All rights reserved. 18+ only. Please play responsibly.
          </p>
          <div className="flex items-center gap-1 text-xs text-carbon-500">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            <span>for charity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}