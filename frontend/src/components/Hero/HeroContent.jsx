import HeroButtons from "./HeroButtons";
import HeroStats from "./HeroStats";

export default function HeroContent() {
  return (
    <div className="max-w-7xl mx-auto w-full px-8 lg:px-20">

      <div className="w-full lg:w-[45%]">

        <p className="uppercase tracking-[5px] text-orange-500 font-semibold">
          Welcome To RunCrew
        </p>

        <h1 className="mt-6 text-7xl md:text-8xl lg:text-9xl font-black leading-none">
          RUN
          <br />
          BEYOND
          <br />
          LIMITS
        </h1>

        <p className="mt-8 text-lg text-gray-300 leading-8">
          Join India's premier marathon platform.
          Register for events, track your performance,
          compete with thousands of runners,
          and celebrate every finish line.
        </p>

        <HeroButtons />

        <div className="mt-20">
          <HeroStats />
        </div>

      </div>

    </div>
  );
}