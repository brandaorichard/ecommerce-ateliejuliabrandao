import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";
import { showToast } from "../redux/toastSlice";
import BreadcrumbItens from "../components/BreadcrumbItens";
import AccountBreadcrumb from "../components/AccountBreadcrumb";
import GoogleLoginButton from "../components/Auth/GoogleLoginButton";
import { useGoogleOneTap } from "../hooks/useGoogleOneTap";
import axios from "axios";

// Função para formatar CPF para 000.000.000-00
function formatCpf(cpf) {
  const digits = cpf.replace(/\D/g, "").slice(0, 11);
  if (digits.length !== 11) return cpf;
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export default function LoginPage() {
  const [identificador, setIdentificador] = useState(""); // email ou cpf
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const isAdmin = user?.role === "admin";

  // Limpar campos ao carregar a página para evitar autofill
  useEffect(() => {
    setIdentificador("");
    setSenha("");
  }, []);

  // Google One Tap automático
  useGoogleOneTap({
    onSuccess: (data) => {
      console.log('Login com Google realizado:', data);
      dispatch(login({
        user: data.user,
        token: data.token,
      }));
      dispatch(showToast({
        message: "Login realizado com sucesso!",
        iconType: "success",
      }));
      
      // Redireciona conforme role
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    },
    onError: (error) => {
      if (error.action === 'login_required') {
        setErro(error.message);
      } else {
        setErro('Erro ao fazer login com Google');
      }
    },
    disabled: false // Desabilitar se usuário já estiver logado
  });

  // Callback para botão Google
  const handleGoogleSuccess = async (response) => {
    try {
      const { data } = await axios.post('https://atelie-juliabrandao-backend-production.up.railway.app/api/auth/google', {
        credential: response.credential
      }, {
        withCredentials: true
      });

      dispatch(login({
        user: data.user,
        token: data.token,
      }));
      
      dispatch(showToast({
        message: "Login realizado com sucesso!",
        iconType: "success",
      }));

      // Redireciona conforme role
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error.response?.data?.action === 'login_required') {
        setErro(error.response.data.message);
      } else {
        setErro('Erro ao fazer login com Google');
      }
    }
  };

  const handleIdentificadorChange = (e) => {
    let value = e.target.value;
    // Se for CPF só números, formata para 000.000.000-00
    if (/^\d{11}$/.test(value)) {
      value = formatCpf(value);
    }
    setIdentificador(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    let identificadorFormatado = identificador;
    if (/^\d{11}$/.test(identificador)) {
      identificadorFormatado = formatCpf(identificador);
    }
    
    async function tryAdminLogin() {
      if (!identificadorFormatado.includes("@")) return null; // admin só por email
      const res = await fetch(
        "https://atelie-juliabrandao-backend-production.up.railway.app/api/admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
          body: JSON.stringify({ email: identificadorFormatado, senha }),
        }
      );
      if (!res.ok) return null;
      const data = await res.json();
      return {
        token: data.token,
        user: {
          nome: data.admin.nome,
            email: data.admin.email,
            role: data.admin.role || "admin",
            id: data.admin.id,
        },
      };
    }

    async function tryUserLogin() {
      const res = await fetch(
        "https://atelie-juliabrandao-backend-production.up.railway.app/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
          body: JSON.stringify({ identificador: identificadorFormatado, senha }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Erro ao fazer login");
      }
      return {
        token: data.token,
        user: {
          nome: data.nome,
          email: data.email,
          role: data.role || "user",
          _id: data._id,
          cpf: data.cpf,
          telefone: data.telefone,
        },
      };
    }

    try {
      let authData = await tryAdminLogin();
      if (!authData) authData = await tryUserLogin();

      dispatch(
        login({
          user: authData.user,
          token: authData.token,
        })
      );

      dispatch(
        showToast({
          message: "Login realizado com sucesso!",
          iconType: "success",
        })
      );

      // Redireciona conforme role
      if (authData.user.role === "admin") {
        navigate("/admin"); // ajuste se painel inicia em outra rota
      } else {
        navigate("/");
      }
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[55vh] flex flex-col bg-[#f9e7f6]">
      <div className="w-full max-w-2xl mx-auto pt-5 px-4">
        {isAdmin ? (
          <AccountBreadcrumb current="Login" />
        ) : (
          <BreadcrumbItens items={[{ label: "Início", to: "/" }, { label: "Login" }]} />
        )}
        <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-8 tracking-wide">
          Iniciar sessão
        </h1>
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
          <label className="block mb-2 text-base text-gray-800">
            E-mail ou CPF
          </label>
          <input
            type="text"
            className="w-full p-3 border border-[#e5d3e9] rounded-2xl focus:outline-none focus:border-[#ae95d9] transition"
            value={identificador}
            onChange={handleIdentificadorChange}
            required
            autoFocus
            placeholder="Digite seu e-mail ou CPF"
            autoComplete="username"
            name="username"
          />
        </div>
        <div className="mb-2 relative">
          <label className="block mb-2 text-base text-gray-800">Senha</label>
          <input
            type={showSenha ? "text" : "password"}
            className="w-full p-3 border border-[#e5d3e9] rounded-2xl focus:outline-none focus:border-[#ae95d9] transition pr-10"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            autoComplete="current-password"
            name="password"
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-[#ae95d9] hover:text-[#7a4fcf] transition"
            onClick={() => setShowSenha((s) => !s)}
            tabIndex={-1}
            aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
          >
            {showSenha ? (
              // Olho cortado
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3l18 18"
                />
              </svg>
            ) : (
              // Olho aberto
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.832-.67 1.613-1.17 2.318M15.54 15.54A5.978 5.978 0 0112 17c-1.657 0-3.156-.672-4.24-1.76"
                />
              </svg>
            )}
          </button>
          <div className="flex justify-end mt-2">
            <Link
              to="/esqueci-senha"
              className="text-xs text-[#7a4fcf] hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-3 py-3 rounded-full bg-[#ae95d9] text-white text-lg font-base hover:bg-[#7a4fcf] transition"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Iniciar sessão"}
        </button>
        
        {/* Divisor */}
        <div className="flex items-center my-6 text-gray-500">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm">OU</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Botão Google */}
        <div className="flex justify-center mb-6">
          <GoogleLoginButton 
            onSuccess={handleGoogleSuccess}
            text="signin_with"
          />
        </div>
        
        <div className="text-center mt-6 text-gray-800">
          Não possui uma conta ainda?{" "}
          <Link
            to="/register"
            className="text-[#7a4fcf] hover:underline font-medium"
          >
            Criar uma conta
          </Link>
        </div>
      </form>
    </div>
  );
}
