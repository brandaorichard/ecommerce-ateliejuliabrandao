import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BreadcrumbItensAdmin from "../../components/BreadcrumbItensAdmin";
import { motion } from "framer-motion";
import { FaImage } from "react-icons/fa";

export default function AdminCategoriesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      <BreadcrumbItensAdmin
        items={[
          { label: "Início", to: "/admin" },
          { label: "Categorias", to: "/admin/categorias" }
        ]}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-light tracking-wide text-neutral-900">
          Gerenciar Imagens das Categorias
        </h1>
      </div>

      <div className="bg-white border border-[#e0d6f7] rounded-lg p-6">
        <h2 className="text-base font-semibold mb-4 text-neutral-900">
          🖼️ Imagens das Categorias da Homepage
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card Categoria 1 - Sob Encomenda */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="p-4 rounded-lg border border-gray-200 bg-gray-50"
          >
            <div className="mb-3">
              <div className="w-full h-32 bg-gray-200 rounded border border-[#e0d6f7] flex items-center justify-center">
                <FaImage className="text-gray-400 text-2xl" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-sm text-gray-900">
                  Sob Encomenda
                </h3>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">Inativo</span>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                <p>Categoria: 1</p>
                <p>Rota: /categoria1</p>
                <p>Tipo: encomenda</p>
              </div>
            </div>
          </motion.div>

          {/* Card Categoria 2 - A Pronta Entrega */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-4 rounded-lg border border-gray-200 bg-gray-50"
          >
            <div className="mb-3">
              <div className="w-full h-32 bg-gray-200 rounded border border-[#e0d6f7] flex items-center justify-center">
                <FaImage className="text-gray-400 text-2xl" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-sm text-gray-900">
                  A Pronta Entrega
                </h3>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">Inativo</span>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                <p>Categoria: 2</p>
                <p>Rota: /categoria2</p>
                <p>Tipo: pronta_entrega</p>
              </div>
            </div>
          </motion.div>

          {/* Card Categoria 3 - Por Semelhança */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="p-4 rounded-lg border border-gray-200 bg-gray-50"
          >
            <div className="mb-3">
              <div className="w-full h-32 bg-gray-200 rounded border border-[#e0d6f7] flex items-center justify-center">
                <FaImage className="text-gray-400 text-2xl" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-sm text-gray-900">
                  Por Semelhança
                </h3>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">Inativo</span>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                <p>Categoria: 3</p>
                <p>Rota: /categoria3</p>
                <p>Tipo: semelhanca</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
