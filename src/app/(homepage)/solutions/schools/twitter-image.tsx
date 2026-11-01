import {
  renderShareCard,
  shareCardContentType,
  shareCardSize,
} from "../../_og/share-card";
import { shareCards } from "../../_og/share-cards";

export const alt = shareCards.schools.alt;
export const size = shareCardSize;
export const contentType = shareCardContentType;

export default function Image() {
  return renderShareCard(shareCards.schools);
}
