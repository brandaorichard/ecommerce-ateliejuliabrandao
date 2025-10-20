// components/RebornSection.jsx
export default function RebornSection({
  title,
  children,
  actions,
  id,
  className = "",
}) {
  return (
    <section id={id} className={`mb-16 ${className}`}>
      <div className="w-full bg-[#f9e7f6] py-6 px-2 mt-2">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-light text-gray-800 mb-2 text-left">
            {title}
          </h2>
          {actions}
          {children}
        </div>
      </div>
    </section>
  );
}