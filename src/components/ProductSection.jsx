export default function ProductSection({ title, items }) {
  if (!items) return null;
  
  // Se for string, renderizar como texto formatado
  if (typeof items === 'string') {
    return (
      <>
        <h2 className="text-lg font-bold text-gray-800 mt-6 mb-2">{title}:</h2>
        <div 
          className="text-sm text-gray-600 mb-4 whitespace-pre-wrap"
          style={{ lineHeight: '1.6' }}
        >
          {items}
        </div>
      </>
    );
  }
  
  // Se for array, renderizar como lista
  return (
    <>
      <h2 className="text-lg font-medium text-gray-800 mt-6 mb-2">{title}</h2>
      <ul className="list-disc pl-5 text-sm text-gray-600 mb-4">
        {items.map((item, idx) => (
          <li key={idx} className="mb-1">{item}</li>
        ))}
      </ul>
    </>
  );
}