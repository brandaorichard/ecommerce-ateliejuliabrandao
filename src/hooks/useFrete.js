import { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFreteSelecionado, setCep, setFretes, setFreteData } from "../redux/freteSlice";

export function useFrete(items) {
  const dispatch = useDispatch();
  const cep = useSelector((s) => s.frete.cep);
  const fretes = useSelector((s) => s.frete.fretes);
  const freteSelecionado = useSelector((s) => s.frete.freteSelecionado);
  const enderecoCep = useSelector((s) => s.frete.enderecoCep);
  const [freteAviso, setFreteAviso] = useState(false);

  const [cepInput, setCepInput] = useState(cep || "");
  const [loadingFrete, setLoadingFrete] = useState(false);
  const [erroFrete, setErroFrete] = useState("");

  useEffect(() => {
    setCepInput(cep || "");
  }, [cep]);

  const limparFrete = useCallback(() => {
    dispatch(setCep(""));
    dispatch(setFretes([]));
    dispatch(setFreteSelecionado(null));
  }, [dispatch]);

  const handleCepInputChange = useCallback(
    (e) => {
      const value = e.target.value.replace(/\D/g, "").slice(0, 8);
      setCepInput(value);
      if (value.length < 8) limparFrete();
    },
    [limparFrete]
  );

  const calcularFrete = useCallback(async () => {
    if (cepInput.length !== 8) {
      setErroFrete("Digite um CEP válido com 8 dígitos.");
      return;
    }
    setLoadingFrete(true);
    setErroFrete("");
    try {
      const res = await fetch(
        "https://atelie-juliabrandao-backend-production.up.railway.app/api/frete/calcular",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
          body: JSON.stringify({
            cepDestino: cepInput,
            items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
          }),
        }
      );
      const data = await res.json();
      const services = (Array.isArray(data) ? data : data.services || [])
        .filter((s) => !s.has_error && s.price)
        .map((s) => ({
          name: s.name,
          price: s.price,
          deadline:
            s.delivery_time || (s.delivery_range && s.delivery_range.max) || null,
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
      };

      const fretesComNegociacao = [...services, opcaoNegociacao];
      
      dispatch(setFretes(fretesComNegociacao));
      dispatch(setCep(cepInput));
      
      if (!services.length) setErroFrete("Nenhuma opção de frete encontrada para este CEP, mas você pode negociar diretamente com a artista.");

      const via = await fetch(`https://viacep.com.br/ws/${cepInput}/json/`);
      if (via.ok) {
        const addr = await via.json();
        if (!addr.erro) {
          dispatch(setFreteData({
            cep: cepInput,
            fretes: fretesComNegociacao,
            enderecoCep: addr,
          }));
        }
      }
    } catch {
      setErroFrete("Não foi possível calcular o frete. Verifique o CEP.");
    } finally {
      setLoadingFrete(false);
    }
  }, [cepInput, items, dispatch]);

  const handleFreteChange = useCallback(
    (frete) => {
      // Agora não é mais possível "desselecionar".
      // Se clicar novamente no mesmo, não faz nada.
      if (freteSelecionado?.name === frete.name) return;
      dispatch(
        setFreteSelecionado({
          ...frete,
          cep: cepInput || freteSelecionado?.cep || cep,
        })
      );
      setFreteAviso(false);
    },
    [dispatch, freteSelecionado, cepInput, cep]
  );

  return {
    cep,
    fretes,
    freteSelecionado,
    cepInput,
    loadingFrete,
    erroFrete,
    handleCepInputChange,
    calcularFrete,
    handleFreteChange,
    setErroFrete,
    enderecoCep,
  };
}