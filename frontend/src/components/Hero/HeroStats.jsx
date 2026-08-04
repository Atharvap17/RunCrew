export default function HeroStats() {
  const stats = [
    { value: "50K+", label: "Active Runners" },
    { value: "120+", label: "Events" },
    { value: "15+", label: "Cities" },
  ];

  return (
    <div className="grid grid-cols-3 gap-10">

      {stats.map((item) => (

        <div key={item.label}>

          <h2 className="text-5xl font-bold text-orange-500">
            {item.value}
          </h2>

          <p className="mt-2 text-gray-300">
            {item.label}
          </p>

        </div>

      ))}

    </div>
  );
}