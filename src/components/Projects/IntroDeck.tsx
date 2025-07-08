import React from "react";
import * as THREE from "three";
import Card3D, { Card3DProps } from "./Card3D";

export interface IntroDeckProps {
  /** List of card props defining the deck order */
  cards?: Card3DProps[];
  /** Optional ref to the deck group */
  deckRef?: React.Ref<THREE.Group>;
  /** Refs for each card wrapper for animation */
  cardRefs?: React.MutableRefObject<THREE.Group[]>;
  /** Z-spacing between stacked cards */
  spacing?: number;
}

const colors = ["red", "blue", "green", "yellow", "purple", "pink"];
const colorTex = (c: string) =>
  `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'><rect width='1' height='1' fill='${encodeURIComponent(
    c
  )}'/></svg>`;

const defaultCards: Card3DProps[] = Array.from({ length: 6 }, (_, i) => ({
  frontSrc: colorTex(colors[i % colors.length]),
}));

const IntroDeck: React.FC<IntroDeckProps> = ({
  cards = defaultCards,
  deckRef,
  cardRefs,
  spacing = 0.03,
}) => {
  if (cardRefs && cardRefs.current.length !== cards.length) {
    cardRefs.current = Array(cards.length).fill(null as unknown as THREE.Group);
  }

  return (
    <group ref={deckRef}>
      {cards.map((card, i) => (
        <group
          key={i}
          ref={cardRefs ? (el) => (cardRefs.current[i] = el!) : undefined}
          position={[0, 0, -i * spacing]}
        >
          <Card3D {...card} />
        </group>
      ))}
    </group>
  );
};

export default IntroDeck;
