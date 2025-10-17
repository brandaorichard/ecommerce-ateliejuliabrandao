import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import BreadcrumbItens from "../components/BreadcrumbItens";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../redux/toastSlice";
import { login } from "../redux/authSlice";

export default function ConfirmEmailChangePage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authToken = useSelector((s) => s.auth.token);

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function confirmEmailChange() {
      try {
        const response = await fetch(
          `https://atelie-juliabrandao-backend-production.up.railway.app/api/auth/confirm-email-change/${token}`,
          { 
            method: "GET",
            credentials: 'include'
          }
        );
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email alterado e confirmado com sucesso!");
          dispatch(showToast({
            message: "Email alterado e confirmado com sucesso!",
            iconType: "success"
          }));

          // Atualiza dados do usuário se estiver logado
          if (authToken) {
            const userRes = await fetch(
              "https://atelie-juliabrandao-backend-production.up.railway.app/api/auth/user/me",
              {
                headers: { "Authorization": `Bearer ${authToken}` },
                credentials: 'include'
              }
            );
            const userData = await userRes.json();
            if (userRes.ok) {
              dispatch(login({ user: userData, token: authToken }));
            }
          }

          setTimeout(() => {
            navigate("/minha-conta");
          }, 4000);
        } else {
          setStatus("error");
          setMessage(data.message || "Erro ao confirmar alteração de email.");
          dispatch(showToast({
            message: data.message || "Erro ao confirmar alteração de email.",
            iconType: "logout"
          }));
        }
      } catch (error) {
        setStatus("error");
        setMessage("Erro de conexão com o servidor.");
        dispatch(showToast({
          message: "Erro de conexão com o servidor.",
          iconType: "logout"
        }));
      }
    }

    confirmEmailChange();
  }, [token, navigate, dispatch, authToken]);

  return (
    <div className="min-h-[55vh] flex flex-col bg-[#f9e7f6]">
      <div className="w-full max-w-2xl mx-auto pt-5 px-4">
        <BreadcrumbItens
          items={[
            { label: "Início", to: "/" },
            { label: "Confirmação de Alteração de Email" }
          ]}
        />
        {status === "loading" && <p className="text-center text-gray-700">Confirmando alteração de email, por favor aguarde...</p>}
        {status === "success" && (
          <div className="text-center px-4">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">Alteração confirmada!</h1>
            <p className="text-gray-700">{message}</p>
            <p className="mt-4 text-gray-700">Você será redirecionado para Minha Conta em instantes.</p>
            <Link to="/minha-conta" className="mt-6 inline-block text-purple-600 hover:underline font-medium">
              Ir para Minha Conta agora
            </Link>
          </div>
        )}
        {status === "error" && (
          <div className="text-center px-4">
            <h1 className="text-2xl font-semibold mb-4 text-red-600">Erro na confirmação</h1>
            <p className="text-red-600">{message}</p>
            <Link to="/minha-conta" className="mt-6 inline-block text-purple-600 hover:underline font-medium">
              Voltar para Minha Conta
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}