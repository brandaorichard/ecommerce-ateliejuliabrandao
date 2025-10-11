import { useSelector, useDispatch } from 'react-redux';
import { toggleMaintenance } from '../../redux/maintenanceSlice';

export default function AdminHeroPage() {
  const dispatch = useDispatch();
  const maintenanceEnabled = useSelector(state => state.maintenance.enabled);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-light tracking-wide">Painel Administrativo</h1>
        <p className="text-sm text-neutral-600 mt-2">
          Bem-vindo. Selecione uma área no menu: produtos, pedidos ou usuários.
        </p>

        {/* Card de Controle de Manutenção */}
        <div className="mt-6 p-5 rounded-lg bg-white border border-[#e0d6f7]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">Status do Site</h2>
              <p className="text-xs text-neutral-600 mt-1">
                {maintenanceEnabled 
                  ? "🔧 Site em manutenção - Apenas administradores podem acessar" 
                  : "✨ Site online - Todos os usuários podem acessar"}
              </p>
            </div>
            <button
              onClick={() => dispatch(toggleMaintenance())}
              className={`
                px-4 py-2 rounded-lg text-xs font-medium transition-colors
                ${maintenanceEnabled 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-[#7a4fcf] hover:bg-[#ae95d9] text-white'}
              `}
            >
              {maintenanceEnabled ? 'Desativar Manutenção' : 'Ativar Manutenção'}
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="p-5 rounded-lg bg-white border border-[#e0d6f7]">
          <h2 className="text-sm font-semibold mb-1 text-neutral-900">Produtos</h2>
          <p className="text-xs text-neutral-600 mb-3">Gerencie o catálogo (bebês) por categoria.</p>
          <a
            href="/admin/produtos"
            className="inline-block text-xs px-3 py-1 rounded bg-[#7a4fcf] hover:bg-[#ae95d9] text-white"
          >
            Acessar
          </a>
        </div>
        <div className="p-5 rounded-lg bg-white border border-[#e0d6f7]">
          <h2 className="text-sm font-semibold mb-1 text-neutral-900">Pedidos</h2>
          <p className="text-xs text-neutral-600 mb-3">Gerencie o catálogo (pedidos) por categoria.</p>
          <a
            href="/admin/pedidos"
            className="inline-block text-xs px-3 py-1 rounded bg-[#7a4fcf] hover:bg-[#ae95d9] text-white"
          >
            Acessar
          </a>
        </div>
        <div className="p-5 rounded-lg bg-[#f7f3fa] border border-[#e0d6f7]">
          <h2 className="text-sm font-semibold mb-1 text-neutral-900">Usuários</h2>
          <p className="text-xs text-neutral-600 mb-3">Visualize dados completos dos usuários.</p>
          <a
            href="/admin/usuarios"
            className="inline-block text-xs px-3 py-1 rounded bg-[#7a4fcf] hover:bg-[#ae95d9] text-white"
          >
            Acessar
          </a>
        </div>
      </div>
    </div>
  );
}