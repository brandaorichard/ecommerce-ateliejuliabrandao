import hero1 from "../assets/hero1.jpeg";

export const coursesMock = [
  {
    id: "course-1",
    slug: "curso-de-enraizamento",
    name: "Curso de Enraizamento",
    category: "cursos",
    price: 199.0,
    oldPrice: null,
    discount: null,
    installment: "Em até 4x de R$ 49,75 sem juros",
    images: [hero1],
    description:
      "Aprenda os fundamentos do enraizamento com um passo a passo claro e prático para evoluir sua técnica.",
    buyUrl: null,
    sections: {
      oQueVoceVaiAprender: [
        "Materiais e ferramentas essenciais",
        "Preparação e organização do trabalho",
        "Técnicas de base e acabamento",
        "Dicas para evitar erros comuns",
      ],
      paraQuemE: [
        "Iniciantes que querem começar com segurança",
        "Quem deseja aprimorar técnica e acabamento",
        "Artesãs(os) buscando um processo mais consistente",
      ],
    },
  },
];

export function getCourseBySlug(slug) {
  return coursesMock.find((c) => c.slug === slug) || null;
}


