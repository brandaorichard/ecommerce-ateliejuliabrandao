import React from "react";

/**
 * Componente para renderizar descrição preservando quebras de linha, parágrafos e formatação
 * Performance otimizada usando CSS white-space ao invés de processar HTML
 */
export default function FormattedDescription({ text, className = "" }) {
  if (!text || !text.trim()) return null;

  // Preserva quebras de linha, espaços múltiplos e formatação original
  // Usa white-space: pre-wrap que mantém quebras de linha e quebra texto automaticamente
  return (
    <div 
      className={`text-sm text-gray-600 whitespace-pre-wrap break-words ${className}`}
      style={{
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        lineHeight: "1.6"
      }}
    >
      {text}
    </div>
  );
}
