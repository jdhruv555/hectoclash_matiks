
import { Mathematician } from "@/types/mathematician";

export const mathematicians: Mathematician[] = [
  {
    id: "euclid",
    name: "Euclid",
    lifespan: "c. 325 BCE – c. 265 BCE",
    nationality: "Greek",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Euklid-von-Alexandria_1.jpg/330px-Euklid-von-Alexandria_1.jpg",
    knownFor: ["Elements", "Euclidean geometry", "Axiomatic method"],
    biography: "Often referred to as the 'Father of Geometry', Euclid was a Greek mathematician who taught in Alexandria, Egypt. His most famous work, 'Elements', is one of the most influential works in the history of mathematics, serving as the main textbook for teaching mathematics from its publication until the late 19th or early 20th century.",
    contributions: "Euclid's 'Elements' is a mathematical treatise consisting of 13 books that laid out the principles of mathematical proofs, solid geometry, number theory, and the theory of proportions. His axiomatic approach to geometry became the model for future mathematicians.",
    famousQuote: "There is no royal road to geometry.",
    era: "Ancient"
  },
  {
    id: "archimedes",
    name: "Archimedes",
    lifespan: "c. 287 BCE – c. 212 BCE",
    nationality: "Greek",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Domenico-Fetti_Archimedes_1620.jpg/330px-Domenico-Fetti_Archimedes_1620.jpg",
    knownFor: ["Archimedes' principle", "Archimedes' screw", "Method of exhaustion"],
    biography: "Archimedes was a Greek mathematician, physicist, engineer, astronomer, and inventor. He is considered one of the leading scientists in classical antiquity and is credited with designing innovative machines, including siege engines and the Archimedes screw for raising water.",
    contributions: "Archimedes made significant contributions to mathematics, including calculating the value of π, developing methods to determine areas and volumes of curved surfaces and solids, and establishing the principles of hydrostatics and leverage.",
    famousQuote: "Give me a place to stand, and I shall move the Earth.",
    era: "Ancient"
  },
  {
    id: "newton",
    name: "Isaac Newton",
    lifespan: "1643 – 1727",
    nationality: "English",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/GodfreyKneller-IsaacNewton-1689.jpg/330px-GodfreyKneller-IsaacNewton-1689.jpg",
    knownFor: ["Calculus", "Laws of motion", "Universal gravitation"],
    biography: "Sir Isaac Newton was an English mathematician, physicist, astronomer, and author who is widely recognized as one of the most influential scientists of all time. He was a key figure in the scientific revolution and the development of modern physics.",
    contributions: "Newton developed calculus independently of Leibniz, formulated the laws of motion and universal gravitation, and built the first reflecting telescope. His work 'Principia Mathematica' laid the groundwork for classical mechanics.",
    famousQuote: "If I have seen further it is by standing on the shoulders of Giants.",
    era: "Enlightenment"
  },
  {
    id: "euler",
    name: "Leonhard Euler",
    lifespan: "1707 – 1783",
    nationality: "Swiss",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Leonhard_Euler.jpg/330px-Leonhard_Euler.jpg",
    knownFor: ["Euler's identity", "Graph theory", "Number theory"],
    biography: "Leonhard Euler was a Swiss mathematician, physicist, astronomer, geographer, logician, and engineer who made important and influential discoveries in many branches of mathematics. He is considered to be the preeminent mathematician of the 18th century.",
    contributions: "Euler introduced much of modern mathematical terminology and notation. He made pioneering contributions to several fields, including analytical number theory and graph theory. He is known for his work in mechanics, fluid dynamics, optics, and astronomy.",
    famousQuote: "Mathematicians have tried in vain to this day to discover some order in the sequence of prime numbers, and we have reason to believe that it is a mystery into which the human mind will never penetrate.",
    era: "Enlightenment"
  },
  {
    id: "gauss",
    name: "Carl Friedrich Gauss",
    lifespan: "1777 – 1855",
    nationality: "German",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Carl_Friedrich_Gauss_1840_by_Jensen.jpg/330px-Carl_Friedrich_Gauss_1840_by_Jensen.jpg",
    knownFor: ["Number theory", "Statistics", "Differential geometry"],
    biography: "Johann Carl Friedrich Gauss was a German mathematician and physicist who made significant contributions to many fields, including number theory, algebra, statistics, analysis, differential geometry, geodesy, geophysics, mechanics, electrostatics, astronomy, and optics.",
    contributions: "Gauss proved the fundamental theorem of algebra, introduced the Gaussian distribution (bell curve) in statistics, and developed the method of least squares. His work in differential geometry laid the groundwork for Einstein's theory of general relativity.",
    famousQuote: "Mathematics is the queen of the sciences, and arithmetic the queen of mathematics.",
    era: "Modern"
  },
  {
    id: "ramanujan",
    name: "Srinivasa Ramanujan",
    lifespan: "1887 – 1920",
    nationality: "Indian",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Srinivasa_Ramanujan_-_OPC_-_1.jpg/330px-Srinivasa_Ramanujan_-_OPC_-_1.jpg",
    knownFor: ["Number theory", "Mathematical analysis", "Infinite series"],
    biography: "Srinivasa Ramanujan was an Indian mathematician who, with almost no formal training in pure mathematics, made extraordinary contributions to mathematical analysis, number theory, infinite series, and continued fractions. During his short life, he compiled over 3,900 mathematical results.",
    contributions: "Ramanujan independently compiled nearly 3,900 results in mathematics. His work on partition functions, elliptic functions, and continued fractions was groundbreaking. The Ramanujan prime, Ramanujan theta function, and mock theta functions are named after him.",
    famousQuote: "An equation means nothing to me unless it expresses a thought of God.",
    era: "Modern"
  },
  {
    id: "turing",
    name: "Alan Turing",
    lifespan: "1912 – 1954",
    nationality: "British",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Alan_Turing_Aged_16.jpg/330px-Alan_Turing_Aged_16.jpg",
    knownFor: ["Computer science", "Cryptanalysis", "The Turing machine"],
    biography: "Alan Mathison Turing was an English mathematician, computer scientist, logician, cryptanalyst, philosopher, and theoretical biologist. Turing was highly influential in the development of theoretical computer science, providing a formalization of the concepts of algorithm and computation with the Turing machine.",
    contributions: "Turing is widely considered to be the father of theoretical computer science and artificial intelligence. During World War II, he worked for the Government Code and Cypher School at Bletchley Park, where he devised techniques for breaking German ciphers.",
    famousQuote: "We can only see a short distance ahead, but we can see plenty there that needs to be done.",
    era: "Contemporary"
  },
  {
    id: "hypatia",
    name: "Hypatia",
    lifespan: "c. 360 – 415 CE",
    nationality: "Egyptian-Greek",
    image: "https://img.freepik.com/premium-photo/hypatia-s-wisdom-beacon-enlightenment-alexandria_818261-18343.jpg?w=900",
    knownFor: ["Mathematics", "Philosophy", "Astronomy"],
    biography: "Hypatia was a Hellenistic Neoplatonist philosopher, astronomer, and mathematician who lived in Alexandria, Egypt. She was the head of the Neoplatonic school in Alexandria and taught philosophy and astronomy. Hypatia is the first female mathematician whose life is reasonably well recorded.",
    contributions: "Hypatia edited the work on Apollonius's Conics. She wrote a commentary on Diophantus's Arithmetica and on Ptolemy's astronomical works. She taught students from all over the Mediterranean, and constructed astrolabes and hydrometers.",
    famousQuote: "Reserve your right to think, for even to think wrongly is better than not to think at all.",
    era: "Ancient"
  },
  {
    id: "noether",
    name: "Emmy Noether",
    lifespan: "1882 – 1935",
    nationality: "German",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Noether.jpg/330px-Noether.jpg",
    knownFor: ["Abstract algebra", "Theoretical physics", "Noether's theorem"],
    biography: "Amalie Emmy Noether was a German mathematician who made important contributions to abstract algebra and theoretical physics. She was described by Albert Einstein as the most important woman in the history of mathematics.",
    contributions: "Noether's theorem is fundamental in mathematical physics, relating symmetry and conservation laws. Her work in abstract algebra revolutionized the field, and she developed theories of rings, fields, and algebras that became foundational to modern mathematics.",
    famousQuote: "My methods are really methods of working and thinking; this is why they have crept in everywhere anonymously.",
    era: "Modern"
  }
];
