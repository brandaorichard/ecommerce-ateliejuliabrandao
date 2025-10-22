import React from 'react';

export default function AdminHeroPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-light tracking-wide">Painel Administrativo</h1>
        <p className="text-sm text-neutral-600 mt-2">
          Bem-vindo. Selecione uma área no menu: produtos, pedidos, usuários, carrossel, categorias, destaques, analytics ou avaliações.
        </p>
      </section>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-5 rounded-lg bg-white border border-[#e0d6f7]">
          <h2 className="text-sm font-semibold mb-1 text-neutral-900">👶 Produtos</h2>
          <p className="text-xs text-neutral-600 mb-3">Gerencie o catálogo (bebês) por categoria.</p>
          <a
            href="/admin/produtos"
            className="inline-block text-xs px-3 py-1 rounded bg-[#7a4fcf] hover:bg-[#ae95d9] text-white"
          >
            Acessar
          </a>
        </div>
        <div className="p-5 rounded-lg bg-white border border-[#e0d6f7]">
          <h2 className="text-sm font-semibold mb-1 text-neutral-900">📦 Pedidos</h2>
          <p className="text-xs text-neutral-600 mb-3">Gerencie o catálogo (pedidos) por categoria.</p>
          <a
            href="/admin/pedidos"
            className="inline-block text-xs px-3 py-1 rounded bg-[#7a4fcf] hover:bg-[#ae95d9] text-white"
          >
            Acessar
          </a>
        </div>
        <div className="p-5 rounded-lg bg-white border border-[#e0d6f7]">
          <h2 className="text-sm font-semibold mb-1 text-neutral-900">👥 Usuários</h2>
          <p className="text-xs text-neutral-600 mb-3">Visualize dados completos dos usuários.</p>
          <a
            href="/admin/usuarios"
            className="inline-block text-xs px-3 py-1 rounded bg-[#7a4fcf] hover:bg-[#ae95d9] text-white"
          >
            Acessar
          </a>
        </div>
        <div className="p-5 rounded-lg bg-white border border-[#e0d6f7]">
          <h2 className="text-sm font-semibold mb-1 text-neutral-900">🎠 Carrossel</h2>
          <p className="text-xs text-neutral-600 mb-3">Gerencie os slides da página inicial.</p>
          <a
            href="/admin/carrossel"
            className="inline-block text-xs px-3 py-1 rounded bg-[#7a4fcf] hover:bg-[#ae95d9] text-white"
          >
            Acessar
          </a>
        </div>
        <div className="p-5 rounded-lg bg-white border border-[#e0d6f7]">
          <h2 className="text-sm font-semibold mb-1 text-neutral-900">🎯 Destaques</h2>
          <p className="text-xs text-neutral-600 mb-3">Gerencie produtos em destaque da homepage.</p>
          <a
            href="/admin/destaques"
            className="inline-block text-xs px-3 py-1 rounded bg-[#7a4fcf] hover:bg-[#ae95d9] text-white"
          >
            Acessar
          </a>
        </div>
        <div className="p-5 rounded-lg bg-white border border-[#e0d6f7]">
          <h2 className="text-sm font-semibold mb-1 text-neutral-900">📊 Analytics</h2>
          <p className="text-xs text-neutral-600 mb-3">Visualize estatísticas e métricas do site.</p>
          <a
            href="/admin/analytics"
            className="inline-block text-xs px-3 py-1 rounded bg-[#7a4fcf] hover:bg-[#ae95d9] text-white"
          >
            Acessar
          </a>
        </div>
        <div className="p-5 rounded-lg bg-white border border-[#e0d6f7]">
          <h2 className="text-sm font-semibold mb-1 text-neutral-900">🖼️ Categorias</h2>
          <p className="text-xs text-neutral-600 mb-3">Gerencie as imagens das categorias da homepage.</p>
          <a
            href="/admin/categorias"
            className="inline-block text-xs px-3 py-1 rounded bg-[#7a4fcf] hover:bg-[#ae95d9] text-white"
          >
            Acessar
          </a>
        </div>
        <div className="p-5 rounded-lg bg-white border border-[#e0d6f7]">
          <h2 className="text-sm font-semibold mb-1 text-neutral-900">⭐ Avaliações</h2>
          <p className="text-xs text-neutral-600 mb-3">Gerencie avaliações e comentários dos produtos.</p>
          <a
            href="/admin/avaliacoes"
            className="inline-block text-xs px-3 py-1 rounded bg-[#7a4fcf] hover:bg-[#ae95d9] text-white"
          >
            Acessar
          </a>
        </div>
      </div>
    </div>
  );
}