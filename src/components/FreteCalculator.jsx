import React, { useState, useMemo } from "react";
import axios from "axios";
import { FaExclamationTriangle, FaHandshake } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setCep, setFreteSelecionado, setFreteData } from "../redux/freteSlice";

/**
 * FreteCalculator
 * Regras para esconder o aviso azul:
 *  - Se a prop hideProductionNote = true
 *  - OU se a prop productCategory === 'pronta_entrega'
 *  - OU se TODOS os items tiverem category === 'pronta_entrega'
 */
export default function FreteCalculator({
  items,
  onFreteSelecionado,
  hideProductionNote = false,
  productCategory // passe a categoria do produto principal quando disponível
}) {
  const dispatch = useDispatch();
  const cep = useSelector(state => state.frete.cep);
  const freteSelecionado = useSelector(state => state.frete.freteSelecionado);

  const [fretes, setFretes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  // Deriva se todos os itens são pronta_entrega (caso items tragam category)
  const allProntaEntrega = useMemo(() => {
    if (!items || items.length === 0) return false;
    return items.every(i => i.category === "pronta_entrega");
  }, [items]);

  const shouldHideNote =
    hideProductionNote ||
    productCategory === "pronta_entrega" ||
    allProntaEntrega;

  async function calcularFrete() {
    setLoading(true);
    setErro("");
    setFretes([]);
    try {
      const cepFormatado =
        cep.length === 8 ? cep.replace(/(\d{5})(\d{3})/, "$1-$2") : cep;

      const itemsFormatados = (items || []).map(item => ({
        slug: item.slug,
        quantity: item.quantity,
      }));

      const res = await axios.post(
        "https://atelie-juliabrandao-backend-production.up.railway.app/api/frete/calcular",
        { cepDestino: cepFormatado, items: itemsFormatados },
        { withCredentials: true }
      );

      const services = (Array.isArray(res.data) ? res.data : res.data.services || [])
        .filter(s => !s.has_error && s.price)
        .map(s => ({
          name: s.name,
            price: s.price,
          deadline: s.delivery_time || (s.delivery_range && s.delivery_range.max) || null,
          company: s.company?.name,
          logo: s.company?.picture,
        }));

      // Adiciona a opção de negociação direta
      const opcaoNegociacao = {
        name: "Negociar com a Artista",
        price: 0,
        deadline: null,
        company: "Ateliê Julia Brandão",
        logo: null,
        isNegotiation: true,
        description: "Transportadora parceira Jadlog com desconto especial"
      };

      const fretesComNegociacao = [...services, opcaoNegociacao];
      setFretes(fretesComNegociacao);

      // ViaCEP
      let enderecoViaCep = null;
      const via = await fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g, "")}/json/`);
      if (via.ok) {
        const addr = await via.json();
        if (!addr.erro) enderecoViaCep = addr;
      }

      dispatch(setFreteData({
        cep: cepFormatado,
        fretes: fretesComNegociacao,
        enderecoCep: enderecoViaCep,
      }));

      if (onFreteSelecionado && fretesComNegociacao[0]) {
        onFreteSelecionado(fretesComNegociacao[0]);
      }
    } catch (err) {
      console.log(err);
      setErro("Não foi possível calcular o frete. Verifique o CEP.");
    } finally {
      setLoading(false);
    }
  }

  function handleCepChange(e) {
    dispatch(setCep(e.target.value.replace(/\D/g, "").slice(0, 8)));
  }

  function handleFreteChange(frete) {
    dispatch(setFreteSelecionado(frete));
  }

  return (
    <div className="my-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Digite seu CEP"
          value={cep}
          onChange={handleCepChange}
          className="border border-[#616161] rounded-3xl px-3 py-2 w-40 h-9"
        />
        <button
          onClick={calcularFrete}
          disabled={loading || cep.length !== 8}
          className="bg-[#7a4fcf] text-white px-4 py-2 rounded-3xl disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Calculando..." : "Calcular frete"}
        </button>
      </div>

      {!shouldHideNote && (
        <div className="mt-2 flex items-center gap-2 font-light border border-[#1c70df] rounded px-3 py-2 text-[#1c70df] text-center text-xs">
          <FaExclamationTriangle className="-mr-1 h-6 w-auto" />
          O prazo da sua entrega deve ser somado com o prazo da confecção do bebê + o envio dos correios.
        </div>
      )}

      {erro && <div className="text-red-500 mt-2 text-sm">{erro}</div>}

      {fretes.length > 0 && (
        <div className="mt-2 space-y-2">
          {fretes.map(frete => (
            <label key={frete.name} className="flex items-start gap-2 text-sm">
              <input
                type="radio"
                name="frete"
                checked={freteSelecionado?.name === frete.name}
                onChange={() => handleFreteChange(frete)}
                className="mt-1"
              />
              <div className="flex flex-col">
                <div className={`flex items-center gap-2 ${frete.isNegotiation ? 'text-blue-400' : ''}`}>
                  {frete.isNegotiation && <FaHandshake className="text-blue-400" />}
                  <span>
                    {frete.name} - {frete.isNegotiation ? "A combinar" : `${frete.deadline} dias úteis - `}
                    {!frete.isNegotiation && (
                      <strong>
                        {Number(frete.price).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </strong>
                    )}
                  </span>
                </div>
                {frete.isNegotiation && (
                  <span className="text-xs text-gray-500 ml-0">
                    (Desconto especial para envios JadLog)
                  </span>
                )}
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}