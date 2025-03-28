import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Deck {
  id?: number;
  ownerID: number;
  user_saved: number[];
  Front: string[];
  Back: string[];
}

