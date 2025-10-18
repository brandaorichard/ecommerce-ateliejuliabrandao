import imgBaby1 from "../assets/babies/babyquin1.jpeg";
import imgBaby2 from "../assets/babies/babyquin2.jpeg";
import imgBaby3 from "../assets/babies/babyquin3.jpeg";
import imgBaby4 from "../assets/babies/babyquin4.jpeg";

import babyRaven1 from "../assets/babies/babyraven1.jpeg";
import babyRaven2 from "../assets/babies/babyraven2.jpeg";
import babyRaven3 from "../assets/babies/babyraven3.jpeg";
import babyRaven4 from "../assets/babies/babyraven4.jpeg";

import babySandie1 from "../assets/babies/babysandie1.jpeg";
import babySandie2 from "../assets/babies/babysandie2.jpeg";
import babySandie3 from "../assets/babies/babysandie3.jpeg";
import babySandie4 from "../assets/babies/babysandie4.jpeg";
import babySandie5 from "../assets/babies/babysandie5.jpeg";
import babySandie6 from "../assets/babies/babysandie6.jpeg";

import babyIsa1 from "../assets/babies/babyisa1.jpeg";
import babyIsa2 from "../assets/babies/babyisa2.jpeg";
import babyIsa3 from "../assets/babies/babyisa3.jpeg";
import babyIsa4 from "../assets/babies/babyisa4.jpeg";
import babyIsa5 from "../assets/babies/babyisa5.jpeg";
import babyIsa6 from "../assets/babies/babyisa6.jpeg";
import babyIsa7 from "../assets/babies/babyisa7.jpeg";
import babyIsa8 from "../assets/babies/babyisa8.jpeg";

import babyAvelee1 from "../assets/babies/babyavelee1.jpeg";
import babyAvelee2 from "../assets/babies/babyavelee2.jpeg";
import babyAvelee3 from "../assets/babies/babyavelee3.jpeg";
import babyAvelee4 from "../assets/babies/babyavelee4.jpeg";

import babyDelilah1 from "../assets/babies/babydelilah1.png";
import babyDelilah2 from "../assets/babies/babydelilah2.png";
import babyDelilah3 from "../assets/babies/babydelilah3.png";
import babyDelilah4 from "../assets/babies/babydelilah4.png";
import babyDelilah5 from "../assets/babies/babydelilah5.png";
import babyDelilah6 from "../assets/babies/babydelilah6.png";
import babyDelilah7 from "../assets/babies/babydelilah7.png";
import babyDelilah8 from "../assets/babies/babydelilah8.png";

import babyLaura1 from "../assets/babies/babylaura1.png";
import babyLaura2 from "../assets/babies/babylaura2.png";
import babyLaura3 from "../assets/babies/babylaura3.png";
import babyLaura4 from "../assets/babies/babylaura4.png";
import babyLaura5 from "../assets/babies/babylaura5.png";
import babyLaura6 from "../assets/babies/babylaura6.png";
import babyLaura7 from "../assets/babies/babylaura7.png";
import babyLaura8 from "../assets/babies/babylaura8.png";
import babyLaura9 from "../assets/babies/babylaura9.png";
import babyLaura10 from "../assets/babies/babylaura10.png";
import babyLaura11 from "../assets/babies/babylaura11.png";

import babyKylin1 from "../assets/babies/babykylin1.png";
import babyKylin2 from "../assets/babies/babykylin2.png";
import babyKylin3 from "../assets/babies/babykylin3.png";
import babyKylin4 from "../assets/babies/babykylin4.png";
import babyKylin5 from "../assets/babies/babykylin5.png";
import babyKylin6 from "../assets/babies/babykylin6.png";
import babyKylin7 from "../assets/babies/babykylin7.png";
import babyKylin8 from "../assets/babies/babykylin8.png";
import babyKylin9 from "../assets/babies/babykylin9.png";
import babyKylin10 from "../assets/babies/babykylin10.png";

import {
  featuresPadrao,
  enxovalPadrao,
  prazoPadrao,
  avisosPadrao
} from "./babyTexts";

const babies = [
  {
    id: 1,
    slug: "kit-quinlynn",
    name: "Bebê Reborn Kit Quinlynn",
    price: 2399.99,
    installment: "4x de R$600,00 sem juros",
    img: imgBaby1,
    images: [imgBaby1, imgBaby2, imgBaby3, imgBaby4],
    description: "Uma linda bebê, feita a partir do Kit Quinlynn versão menina ou menino sob encomenda. Cerca de 48cm e aproximadamente 2kgs",
    features: [
      "Cabelo implantado fio a fio com mohair, veias e micro veias, vasos sanguíneos, efeito de unhas crescidas, pelos nas têmporas, manchinhas, marca de vacina, teste do pezinho, manchinhas de frio, cílios micro implantados, arranhões de unha, sobrancelhas 3D, lábios umedecidos.",
      "Com todas as características de um bebê real! São molinhos e sua cabeça tomba pra trás e pros lados.",
      "Feito com corpinho de tecido para deixar bem maleável e molinho."
    ],
    dimensions: {
      height: "47cm",
      weight: "Aproximadamente 2kg"
    },
    enxoval: [...enxovalPadrao],
    deliveryTime: [...prazoPadrao],
    warnings: [...avisosPadrao]
  },
  {
    id: 2,
    slug: "kit-raven",
    name: "Bebê Reborn Kit Raven",
    price: 2499.99,
    installment: "4x de R$620,00 sem juros",
    img: babyRaven1,
    images: [babyRaven1, babyRaven2, babyRaven3, babyRaven4],
    description: "Uma linda bebê, feita a partir do Kit Quinlynn versão menina ou menino sob encomenda.",
    features: [
      "Voce pode escolher a cor do cabelo, o tipo de cabelo, cor dos olhos. Para tonalidade de pele, o preço é alterado.",
      ...featuresPadrao
    ],
    dimensions: {
      height: "47cm",
      weight: "Aproximadamente 2kg"
    },
    enxoval: [...enxovalPadrao],
    deliveryTime: [...prazoPadrao],
    warnings: [...avisosPadrao]
  },
  {
    id: 3,
    slug: "kit-sandie",
    name: "Bebê Reborn Kit Sandie (Toddler)",
    price: 3399.99,
    installment: "4x de R$850,00 sem juros",
    img: babySandie1,
    images: [babySandie1, babySandie2, babySandie3, babySandie4, babySandie5, babySandie6],
    description: "Um lindo bebê, feito a partir do Kit Sandie Feita sob encomenda",
    features: [
      ...featuresPadrao,
      "Sobre o cabelo:",
      "Nas fotos ilustrativas temos 2 tipos de cabelo, na ruiva é a fibra beautex sintética de alta qualidade, não embola com o tempo, imita cabelo humano adulto, usada para ter cabelos longos e lisos e super fácil de cuidar.",
      "Já nas fotos de cabelo curto, foi utilizado o mohair premium, é um fio natural derivado da cabra, um cabelo extremamente macio e fino, imita muito um cabelo de bebê e é mais realista, por ser natural, porém ele tem um cuidado maior para mantê-lo.",
      "Todos os bebês São molinhos e sua cabeça tomba pra trás e pros lados.",
      "Feito com corpinho de tecido para deixar bem maleavel e molinho."
    ],
    dimensions: {
      height: "65 a 68cm",
      weight: "N/A"
    },
    enxoval: [...enxovalPadrao],
    deliveryTime: [...prazoPadrao],
    warnings: [...avisosPadrao]
  },
  {
    id: 4,
    slug: "kit-isabela",
    name: "Bebê reborn Kit Isabela",
    price: 2699.99,
    installment: "4x de R$675,00 sem juros",
    img: babyIsa1,
    images: [babyIsa1, babyIsa2, babyIsa3, babyIsa4, babyIsa5, babyIsa6, babyIsa7, babyIsa8],
    description: "Um lindo bebê, feito a partir do Kit Isabela original",
    features: [
      ...featuresPadrao,
      "Todos os bebês São molinhos e sua cabeça tomba pra trás e pros lados.",
      "Feito com corpinho de tecido para deixar bem maleavel e molinho."
    ],
    dimensions: {
      height: "49cm",
      weight: "N/A"
    },
    enxoval: [...enxovalPadrao],
    deliveryTime: [...prazoPadrao],
    warnings: [...avisosPadrao]
  },
  {
    id: 5,
    slug: "kit-avelee",
    name: "Bebê reborn Kit Avelee",
    price: 2399.99,
    installment: "4x de R$600,00 sem juros",
    img: babyAvelee1,
    images: [babyAvelee1, babyAvelee2, babyAvelee3, babyAvelee4],
    description: "Um lindo bebê, feito a partir do Kit Avelee sob encomenda.",
    features: [
      ...featuresPadrao,
      "Todos os bebês São molinhos e sua cabeça tomba pra trás e pros lados.",
      "Feito com corpinho de tecido para deixar bem maleavel e molinho."
    ],
    dimensions: {
      height: "50cm",
      weight: "N/A"
    },
    enxoval: [...enxovalPadrao],
    deliveryTime: [...prazoPadrao],
    warnings: [...avisosPadrao]
  },
  {
    id: 6,
    slug: "kit-delilah",
    name: "Bebê Reborn Kit Delilah",
    price: 2399.99,
    installment: "4x de R$600,00 sem juros",
    img: babyDelilah1,
    images: [babyDelilah1, babyDelilah2, babyDelilah3, babyDelilah4, babyDelilah5, babyDelilah6, babyDelilah7, babyDelilah8],
    description: [
      "Uma linda bebê, feito a partir do Kit Delilah sob encomenda.",
      "Voce pode escolher menino ou menina,  a cor do cabelo, o tipo de cabelo. Para tonalidade de pele, o preço é alterado."
    ],
    features: [
      ...featuresPadrao,
      "Todos os bebês São molinhos e sua cabeça tomba pra trás e pros lados.",
      "Feito com corpinho de tecido para deixar bem maleavel e molinho."
    ],
    dimensions: {
      height: "44 a 46cm",
      weight: "N/A"
    },
    enxoval: [...enxovalPadrao],
    deliveryTime: [...prazoPadrao],
    warnings: [...avisosPadrao]
  },
  {
    id: 7,
    slug: "kit-laura",
    name: "Bebê Reborn kit Laura",
    price: 2399.99,
    installment: "4x de R$600,00 sem juros",
    img: babyLaura1,
    images: [babyLaura1, babyLaura2, babyLaura3, babyLaura4, babyLaura5, babyLaura6, babyLaura7, babyLaura8, babyLaura9, babyLaura10, babyLaura11],
    description: [
      "Uma linda bebê, feito a partir do Kit Delilah sob encomenda.",
      "Voce pode escolher menino ou menina,  a cor do cabelo, o tipo de cabelo. Para tonalidade de pele, o preço é alterado."
    ],
    features: [
      "Você pode escolher a cor dos cabelos.",
      ...featuresPadrao,
      "Todos os bebês São molinhos e sua cabeça tomba pra trás e pros lados.",
      "Feito com corpinho de tecido para deixar bem maleavel e molinho."
    ],
    dimensions: {
      height: "50 a 52cm",
      weight: "N/A"
    },
    enxoval: [...enxovalPadrao],
    deliveryTime: [...prazoPadrao],
    warnings: [...avisosPadrao]
  },
  {
    id: 8,
    slug: "kit-kylin",
    name: "Bebê reborn kit Kylin",
    price: 2499.99,
    installment: "4x de R$625,00 sem juros",
    img: babyKylin1,
    images: [babyKylin1, babyKylin2, babyKylin3, babyKylin4, babyKylin5, babyKylin6, babyKylin7, babyKylin8, babyKylin9, babyKylin10],
    description: [
      "Uma linda bebê, feito a partir do Kit Delilah sob encomenda.",
      "Voce pode escolher menino ou menina,  a cor do cabelo, o tipo de cabelo. Para tonalidade de pele, o preço é alterado."
    ],
    features: [
      "Você pode escolher a cor dos cabelos.",
      ...featuresPadrao,
      "Todos os bebês São molinhos e sua cabeça tomba pra trás e pros lados.",
      "Feito com corpinho de tecido para deixar bem maleavel e molinho."
    ],
    dimensions: {
      height: "51cm",
      weight: "N/A"
    },
    enxoval: [...enxovalPadrao],
    deliveryTime: [...prazoPadrao],
    warnings: [...avisosPadrao]
  },
];

export default babies;