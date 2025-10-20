import ShareButton from './ShareButton';

export default function ProductTitlePrice({ name, price, oldPrice, discount, installment, productUrl, productName }) {
  return (
    <>
      <h1 className="text-2xl md:text-3xl font-light text-gray-800 mb-2">{name}</h1>
      <div className="flex items-end gap-3 mb-2">
        <span className="text-2xl md:text-3xl font-bold text-gray-800">
          R${price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </span>
        {oldPrice && (
          <span className="text-sm md:text-base text-gray-500 line-through">
            R${oldPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
        )}
        {discount && (
          <span className="bg-[#ae95d9] text-white text-xs font-bold px-2 py-1 rounded">
            {discount}
          </span>
        )}
      </div>
      <span className="text-sm text-[#7a4fcf]">{installment}</span>
      <span className="text-sm text-[#7a4fcf] mb-4 block">10% de desconto no PIX</span>
      
      {/* Share Button - only show if productUrl and productName are provided */}
      {productUrl && productName && (
        <div className="mb-4">
          <ShareButton 
            productUrl={productUrl} 
            productName={productName}
          />
        </div>
      )}
    </>
  );
}