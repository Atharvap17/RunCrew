import { Link } from "react-router-dom";
import { FaRunning, FaFacebookF, FaTwitter, FaInstagram, FaDribbble } from "react-icons/fa";

const socials = [
  { icon: FaFacebookF, href: "#" },
  { icon: FaTwitter, href: "#" },
  { icon: FaDribbble, href: "#" },
  { icon: FaInstagram, href: "#" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-inner">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-14 lg:gap-16 mb-20">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-9 h-9 bg-brand flex items-center justify-center text-white"
                style={{ clipPath: "polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)" }}>
                <FaRunning />
              </span>
              <span className="font-display text-2xl text-white">RunCrew</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              The best running club. India&apos;s premier marathon platform for events,
              registrations, and race results.
            </p>
            <div className="flex gap-3 mt-6">
              {socials.map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 flex items-center justify-center border border-white/10 text-gray-400 hover:bg-brand hover:border-brand hover:text-white transition-all"
                  style={{ clipPath: "polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)" }}
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Links</h4>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li><Link to="/" className="hover:text-brand transition-colors">Home</Link></li>
              <li><Link to="/events" className="hover:text-brand transition-colors">Events</Link></li>
              <li><Link to="/about" className="hover:text-brand transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-brand transition-colors">Contacts</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Office</h4>
            <ul className="space-y-3 text-gray-500 text-sm leading-relaxed">
              <li>Mumbai, India —</li>
              <li>Bandra Kurla Complex</li>
              <li>Office 478, MH 400051</li>
              <li className="pt-2">
                <a href="mailto:support@runcrew.com" className="hover:text-brand">support@runcrew.com</a>
              </li>
              <li>+91 98765 43210</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Get in Touch</h4>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Have questions about an event or registration? We&apos;re here to help.
            </p>
            <Link to="/contact" className="read-more">
              Contact Us
            </Link>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600 text-xs uppercase tracking-wider">
          <p>RunCrew © 2026. All rights reserved.</p>
          <p>We work with the best brands</p>
        </div>
      </div>
    </footer>
  );
}
