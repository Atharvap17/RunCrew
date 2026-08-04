import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import heroImage from "../../assets/images/hero-bg.jpg";
import Button from "../Common/Button";
import HeroScroll from "./HeroScroll";
import { useAuth } from "../../context/AuthContext";

const slides = [
  {
    image: heroImage,
    tagline: "Participate in the ultimate marathon",
    title: ["RACING", "FOR A", "CAUSE"],
    subtitle:
      "Join thousands of runners across India. Register for world-class marathon events and celebrate every finish line.",
  },
  {
    image: "https://images.unsplash.com/photo-1571008887538-b36bb08f4571?w=1920&q=80",
    tagline: "Join the ultimate marathon",
    title: ["RUN", "BEYOND", "LIMITS"],
    subtitle:
      "From coastal routes to historic boulevards — discover events designed for every pace and ambition.",
  },
  {
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1920&q=80",
    tagline: "Fundraising marathon",
    title: ["MILES", "OF", "TRIUMPH"],
    subtitle:
      "Every stride counts. Become part of India's fastest growing running community.",
  },
];

export default function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="hero-swiper h-full min-h-screen"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div
              className="relative min-h-screen bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/25" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

              <div className="relative z-10 min-h-screen flex items-center pt-28 pb-32">
                <div className="section-inner w-full">
                  <div className="max-w-3xl">
                    <p className="section-label">{slide.tagline}</p>

                    <h1 className="font-display text-[clamp(3.25rem,9vw,7rem)] leading-[0.95] text-white space-y-1">
                      {slide.title.map((line, j) => (
                        <span key={j} className="block">
                          {line}
                        </span>
                      ))}
                    </h1>

                    <p className="mt-10 text-base md:text-lg text-gray-300/90 leading-[1.8] max-w-xl">
                      {slide.subtitle}
                    </p>

                    <div className="flex flex-wrap gap-5 mt-14 md:mt-16">
                      <Button to="/events" variant="primary" size="lg">
                        Explore Events
                      </Button>
                      {!user && (
                        <Button to="/register" variant="outline" size="lg">
                          Register Now
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <HeroScroll />
    </section>
  );
}
