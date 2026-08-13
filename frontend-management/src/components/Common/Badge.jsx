export default function Badge({ children }) {
  return (
    <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
      {children}
    </span>
  );
}