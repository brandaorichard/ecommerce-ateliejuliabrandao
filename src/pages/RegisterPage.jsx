import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BreadcrumbItens from "../components/BreadcrumbItens";

// Máscaras e validações simples
const onlyDigits = (v) => v.replace(/\D/g, "");
const maskPhone = (v) => {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  return d.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4");
};
const maskCPF = (v) =>
  onlyDigits(v)
    .slice(0, 11)
    .replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, a, b, c, d) =>
      d ? `${a}.${b}.${c}-${d}` : `${a}.${b}.${c}`
    );

export default function RegisterPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [confirmarEmail, setConfirmarEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  // Validações
  const emailMatch = email && confirmarEmail && email === confirmarEmail;
  const senhaMatch = senha && confirmarSenha && senha === confirmarSenha;
  const telefoneValido = /^\(\d{2}\) \d \d{4}-\d{4}$/.test(telefone);
  const cpfValido = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    if (!nome.trim() || !email || !confirmarEmail || !telefone || !cpf || !senha || !confirmarSenha) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }
    if (!emailMatch) {
      setErro("Os e-mails não coincidem.");
      return;
    }
    if (!senhaMatch) {
      setErro("As senhas não coincidem.");
      return;
    }
    if (!telefoneValido) {
      setErro("Telefone inválido. Use o formato (00) 0 0000-0000.");
      return;
    }
    if (!cpfValido) {
      setErro("CPF inválido. Use o formato 000.000.000-00.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://atelie-juliabrandao-backend-production.up.railway.app/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          nome,
          email,
          senha,
          confirmarSenha,
          telefone,
          cpf,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.message || "Erro ao criar conta");
        setLoading(false);
        return;
      }

      navigate("/confirm-email");
    } catch (err) {
      setErro("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[55vh] flex flex-col bg-[#f9e7f6]">
      <div className="w-full max-w-2xl mx-auto pt-5 px-4">
        <BreadcrumbItens
          items={[
            { label: "Início", to: "/" },
            { label: "Cadastre-se" }
          ]}
        />
        <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-2 tracking-wide">
          Criar uma conta
        </h1>
        <p className="text-base text-gray-700 mb-8">
          Compre mais rápido e acompanhe seus pedidos em um só lugar!
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl mx-auto bg-[#f9e7f6] px-4"
        autoComplete="off"
      >
        {erro && (
          <div className="mb-4 text-red-600 text-sm text-center">{erro}</div>
        )}
        <div className="mb-4">
          <label className="block mb-2 text-base text-gray-800">Nome completo *</label>
          <input
            type="text"
            className="w-full p-3 border border-[#e5d3e9] rounded-2xl focus:outline-none focus:border-[#ae95d9] transition placeholder:text-gray-400"
            placeholder="ex.: Maria Perez"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-base text-gray-800">E-mail *</label>
          <input
            type="email"
            className={`w-full p-3 border rounded-2xl focus:outline-none transition placeholder:text-gray-400 ${
              email && confirmarEmail && !emailMatch
                ? "border-red-500 focus:border-red-500"
                : "border-[#e5d3e9] focus:border-[#ae95d9]"
            }`}
            placeholder="ex.: seunome@email.com.br"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-base text-gray-800">Confirmar e-mail *</label>
          <input
            type="email"
            className={`w-full p-3 border rounded-2xl focus:outline-none transition placeholder:text-gray-400 ${
              email && confirmarEmail && !emailMatch
                ? "border-red-500 focus:border-red-500"
                : "border-[#e5d3e9] focus:border-[#ae95d9]"
            }`}
            placeholder="Confirme seu e-mail"
            value={confirmarEmail}
            onChange={e => setConfirmarEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-base text-gray-800">Telefone *</label>
          <input
            type="tel"
            className={`w-full p-3 border rounded-2xl focus:outline-none transition placeholder:text-gray-400 ${
              telefone && !telefoneValido
                ? "border-red-500 focus:border-red-500"
                : "border-[#e5d3e9] focus:border-[#ae95d9]"
            }`}
            placeholder="ex.: (11) 9 1234-5678"
            value={telefone}
            onChange={e => setTelefone(maskPhone(e.target.value))}
            required
            maxLength={16}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-base text-gray-800">CPF *</label>
          <input
            type="text"
            className={`w-full p-3 border rounded-2xl focus:outline-none transition placeholder:text-gray-400 ${
              cpf && !cpfValido
                ? "border-red-500 focus:border-red-500"
                : "border-[#e5d3e9] focus:border-[#ae95d9]"
            }`}
            placeholder="000.000.000-00"
            value={cpf}
            onChange={e => setCpf(maskCPF(e.target.value))}
            required
            maxLength={14}
          />
        </div>
        <div className="mb-4 relative">
          <label className="block mb-2 text-base text-gray-800">Senha *</label>
          <input
            type={showSenha ? "text" : "password"}
            className="w-full p-3 border border-[#e5d3e9] rounded-2xl focus:outline-none focus:border-[#ae95d9] transition pr-10"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-[#ae95d9] hover:text-[#7a4fcf] transition"
            onClick={() => setShowSenha(s => !s)}
            tabIndex={-1}
            aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
          >
            {showSenha ? "🙈" : "👁️"}
          </button>
        </div>
        <div className="mb-4 relative">
          <label className="block mb-2 text-base text-gray-800">Confirmar senha *</label>
          <input
            type={showConfirmarSenha ? "text" : "password"}
            className={`w-full p-3 border rounded-2xl focus:outline-none transition pr-10 ${
              senha && confirmarSenha && !senhaMatch
                ? "border-red-500 focus:border-red-500"
                : "border-[#e5d3e9] focus:border-[#ae95d9]"
            }`}
            value={confirmarSenha}
            onChange={e => setConfirmarSenha(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-[#ae95d9] hover:text-[#7a4fcf] transition"
            onClick={() => setShowConfirmarSenha(s => !s)}
            tabIndex={-1}
            aria-label={showConfirmarSenha ? "Ocultar senha" : "Mostrar senha"}
          >
            {showConfirmarSenha ? "🙈" : "👁️"}
          </button>
        </div>
        <button
          type="submit"
          className="w-full mt-5 py-3 rounded-full bg-[#ae95d9] text-white text-lg font-base hover:bg-[#7a4fcf] transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Criando conta..." : "Criar uma conta"}
        </button>
        <div className="text-center mt-6 text-gray-800">
          Já possui uma conta?{" "}
          <Link to="/login" className="text-[#7a4fcf] hover:underline font-medium">
            Iniciar sessão
          </Link>
        </div>
      </form>
    </div>
  );
}