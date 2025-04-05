
export interface Mathematician {
  id: string;
  name: string;
  lifespan: string;
  nationality: string;
  image: string;
  knownFor: string[];
  biography: string;
  contributions: string;
  famousQuote: string;
  era: "Ancient" | "Medieval" | "Renaissance" | "Enlightenment" | "Modern" | "Contemporary";
}
