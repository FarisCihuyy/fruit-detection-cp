import { CSSProperties } from "react";

interface Icon {
  name: string;
  src: string;
  style: CSSProperties;
}

interface Fruit {
  id: number;
  type: string;
  title: string | null;
  description: string | null;
  image?: string | null;
  icon?: Icon[] | null;
}

export const fruitGrid: Fruit[] = [
  {
    id: 1,
    type: "placeholder",
    title: null,
    description: null,
    image: "/images/fruit-1.jpg",
    icon: null,
  },
  {
    id: 2,
    type: "placeholder",
    title: null,
    description: null,
    image: "/images/fruit-2.jpg",
    icon: null,
  },
  {
    id: 3,
    type: "content",
    title: "Fresh",
    description:
      "Looks bright and well-shaped, retains natural elasticity and attractive appearance.",
    image: null,
    icon: [
      {
        name: "apple",
        src: "/icons/apple.png",
        style: {
          position: "absolute",
          width: "100px",
          height: "auto",
          top: "-80%",
          left: "10%",
          zIndex: -1,
          rotate: "9deg",
        },
      },
      {
        name: "banana",
        src: "/icons/banana.png",
        style: {
          position: "absolute",
          width: "6.25rem",
          height: "auto",
          bottom: "-60%",
          right: "10%",
          zIndex: -1,
          rotate: "12deg",
        },
      },
    ],
  },
  {
    id: 4,
    type: "placeholder",
    title: null,
    description: null,
    image: "/images/fruit-3.jpg",
    icon: null,
  },
  {
    id: 5,
    type: "placeholder",
    title: null,
    description: null,
    image: "/images/fruit-4.jpg",
    icon: null,
  },
  {
    id: 6,
    type: "placeholder",
    title: null,
    description: null,
    image: "/images/fruit-5.jpg",
    icon: null,
  },
  {
    id: 7,
    type: "content",
    title: "Rotten",
    description:
      "Shows obvious damage, often characterized by dark spots, an unpleasant texture, and signs of microbial decay.",
    image: null,
    icon: [
      {
        name: "orange",
        src: "/icons/orange.png",
        style: {
          position: "absolute",
          width: "6.25rem",
          height: "auto",
          top: "-80%",
          left: "10%",
          zIndex: -1,
          rotate: "9deg",
        },
      },
      {
        name: "dragon-fruit",
        src: "/icons/dragon-fruit.png",
        style: {
          position: "absolute",
          width: "100px",
          height: "auto",
          bottom: "-60%",
          right: "10%",
          zIndex: -1,
          rotate: "12deg",
        },
      },
    ],
  },
  {
    id: 8,
    type: "placeholder",
    title: null,
    description: null,
    image: "/images/fruit-6.jpg",
    icon: null,
  },
  {
    id: 9,
    type: "placeholder",
    title: null,
    description: null,
    image: "/images/fruit-7.jpg",
    icon: null,
  },
];
