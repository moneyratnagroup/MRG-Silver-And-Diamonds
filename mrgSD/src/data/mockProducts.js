import braceletImg from '../assets/silver_charm_bracelet.png';

const baseImages = [
  braceletImg,
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1599643478514-4a1101858ff6?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600"
];

export const allProducts = [
  {
    id: 1,
    name: "Classic Silver Charm Bracelet",
    originalPrice: "₹2,999",
    price: "₹2,499",
    img: braceletImg,
    images: baseImages,
    category: "Bracelets",
    collection: "women",
    desc: "A timeless sterling silver charm bracelet perfect for any occasion. Elegantly designed to hold your most precious memories."
  },
  {
    id: 2,
    name: "Sterling Silver Teardrop Earrings",
    originalPrice: "₹2,299",
    price: "₹1,899",
    img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600", ...baseImages.slice(1)],
    category: "Earrings",
    collection: "women",
    desc: "Elegant teardrop earrings crafted from pure 925 sterling silver."
  },
  {
    id: 3,
    name: "Men's Heavy Silver Chain",
    price: "₹4,599",
    img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600", ...baseImages.slice(1)],
    category: "Chains",
    collection: "men",
    desc: "A bold and heavy sterling silver chain designed for the modern man."
  },
  {
    id: 4,
    name: "Kids Silver Anklet Set",
    price: "₹1,299",
    img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600", ...baseImages.slice(1)],
    category: "Anklets",
    collection: "kids",
    desc: "Adorable, skin-friendly silver anklets for kids with gentle chimes."
  },
  {
    id: 5,
    name: "Pure Silver Ganesh Idol",
    price: "₹5,999",
    img: "https://images.unsplash.com/photo-1599643478514-4a1101858ff6?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1599643478514-4a1101858ff6?auto=format&fit=crop&q=80&w=600", ...baseImages.slice(1)],
    category: "Idols",
    collection: "religious",
    desc: "Intricately detailed pure silver Ganesh idol for your home temple."
  },
  {
    id: 6,
    name: "10g Fine Silver Bullion",
    price: "₹1,100",
    img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600", ...baseImages.slice(1)],
    category: "Bullions",
    collection: "investment",
    desc: "99.9% pure silver bullion bar for secure investment."
  },
  {
    id: 7,
    name: "Bridal Silver Diamond Set",
    price: "₹12,999",
    img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600", ...baseImages.slice(1)],
    category: "Bridal",
    collection: "special",
    desc: "A breathtaking bridal set featuring diamond accents set in premium silver."
  }
];

export const getProductsByCollection = (collectionId) => {
  if (collectionId === 'all') return allProducts;
  return allProducts.filter(p => p.collection === collectionId);
};

export const getFeaturedProducts = () => {
  return allProducts.slice(0, 4); // Just grab the first 4 for the featured section
};
