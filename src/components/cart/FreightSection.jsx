import React from "react";
import { FaExclamationTriangle, FaHandshake } from "react-icons/fa";

export function FreightSection({
  fullWidth = false,
  cepInput,
  onCepChange,
  onCalcular,
  loadingFrete,
  erroFrete,
  opcoesFrete,
  freteSelecionado,
  onSelectFrete,
  endereco,
  showCepInput,
}) {
  return (
    <section
      className={`${
        fullWidth ? "w-full" : ""
      } bg-[#f9e7f6] border border-[#e5d6f1] rounded p-4 flex flex-col gap-3`}
    >
      {/* Linha CEP */}
      {showCepInput && (
        <div className="flex gap-2 w-full">
          <input
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-xs"
            placeholder="Digite o CEP"
            value={cepInput}
            onChange={onCepChange}
            maxLength={8}
          />
          <button
            type="button"
            onClick={onCalcular}
            disabled={loadingFrete || cepInput.length !== 8}
            className="px-4 py-2 text-xs rounded bg-purple-600 text-white disabled:opacity-50"
          >
            {loadingFrete ? "..." : "Calcular"}
          </button>
        </div>
      )}

      {erroFrete && (
        <p className="text-[11px] text-red-600">{erroFrete}</p>
      )}

      {/* Opções de frete */}
      {opcoesFrete?.length > 0 && (
        <div className="flex flex-col gap-2 w-full">
          {opcoesFrete.map((f) => {
            const selected = freteSelecionado?.name === f.name;
            const isNegotiation = f.isNegotiation;
            
            return (
              <button
                key={f.name}
                type="button"
                onClick={() => onSelectFrete(f)}
                className={`text-left border rounded px-3 py-2 text-xs w-full transition ${
                  selected
                    ? "border-purple-600 bg-[#f9e7f6] shadow"
                    : "border-gray-300 bg-[#f9e7f6] hover:bg-[#f3e1f0]"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {isNegotiation && <FaHandshake className="text-blue-400" />}
                    <span className={`font-medium ${isNegotiation ? 'text-blue-400' : ''}`}>
                      {f.name}
                    </span>
                  </div>
                  <span className={`font-semibold ${isNegotiation ? 'text-blue-400' : ''}`}>
                    {isNegotiation ? "A combinar" : f.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
                <div className={`text-[11px] ${isNegotiation ? 'text-blue-400' : 'text-gray-600'}`}>
                  {isNegotiation 
                    ? "Desconto especial para envios JadLog"
                    : f.deadline
                      ? `${f.deadline} dias úteis`
                      : "Prazo não informado"
                  }
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Aviso frete selecionado */}
      {freteSelecionado && (
        <div className={`text-[11px] mt-1 p-2 border rounded ${
          freteSelecionado.isNegotiation 
            ? "border-blue-200 bg-[#f9e7f6]" 
            : "border-purple-200 bg-[#f9e7f6]"
        }`}>
          Frete selecionado:{" "}
          <strong className={freteSelecionado.isNegotiation ? 'text-blue-400' : ''}>
            {freteSelecionado.name}
          </strong>{" "}
          {freteSelecionado.isNegotiation 
            ? "- Entre em contato para acertar os detalhes"
            : freteSelecionado.deadline && `- ${freteSelecionado.deadline} dias úteis`
          }
        </div>
      )}
    </section>
  );
}