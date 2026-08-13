import { FaHeart, FaMedal, FaRunning, FaSeedling } from "react-icons/fa";
import ReadMore from "../Common/ReadMore";
import ScrollReveal from "../Common/ScrollReveal";

const reasons = [
  { title: "Find your edge", desc: "Push your limits and discover what you are capable of with each new distance.", icon: FaRunning },
  { title: "Run with purpose", desc: "Choose races that support causes and create positive change beyond the finish line.", icon: FaHeart },
  { title: "Celebrate every finish", desc: "Earn the memories, medals, and confidence that come with showing up for yourself.", icon: FaMedal },
  { title: "Build a healthier rhythm", desc: "Make movement a lasting part of your life alongside a supportive community.", icon: FaSeedling },
];

export default function WhyRunSection() {
  return (
    <section className="section-block bg-[#111]">
      <div className="section-inner">
        <ScrollReveal animation="fade-up">
          <header className="section-header flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="section-label">Why run with us</p>
              <h2 className="section-title">Every mile has meaning.</h2>
            </div>
            <p className="max-w-md text-gray-400">
              More than a race — a reason to move, grow, and make an impact with every step.
            </p>
          </header>
        </ScrollReveal>

        <div className="participant-reasons">
          {reasons.map(({ title, desc, icon: Icon }, index) => (
            <ScrollReveal key={title} animation="bubble" delay={index * 100}>
              <article className="participant-reason h-full">
                <span className="participant-reason__number">0{index + 1}</span>
                <span className="participant-reason__icon"><Icon /></span>
                <h3>{title}</h3>
                <p>{desc}</p>
                <ReadMore to="/about" />
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
