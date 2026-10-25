/* ==========================================================================
   BUNT ELEGANCE — catalogue & site configuration
   Edit this file to add artworks, change prices or update contact details.
   ========================================================================== */
window.BE = window.BE || {};

BE.config = {
  brand: "BUNT ELEGANCE",
  tagline: "ART THAT DEFINES YOUR SPACE",
  email: "buntelegance@gmail.com",
  website: "www.buntelegance.com",
  whatsapp: "919081608190", // international format, no "+" or spaces
  phoneDisplay: "+91 90816 08190",
  currency: "INR",
  locale: "en-IN",
  social: {
    instagram: "https://www.instagram.com/buntelegance",
    pinterest: "https://pin.it/69ib4QuIH",
  },
  // Optional: paste a Formspree / Getform / Basin endpoint to receive forms directly.
  // Left empty, forms fall back to opening the visitor's email app, pre-filled.
  formEndpoint: "",
  newsletterEndpoint: "",
};

BE.categories = [
  { id: "texture", name: "Texture Art", line: "Sculpted surfaces that hold light" },
  { id: "wooden", name: "Wooden Art", line: "Grain, relief and warmth" },
  { id: "thread", name: "Thread Art", line: "Geometry drawn in tension" },
  { id: "glass", name: "Glass Art", line: "Translucence, layered" },
  { id: "stone", name: "Stone Art", line: "Weight, patience, permanence" },
  { id: "3d", name: "3D Art", line: "Relief that steps off the wall" },
  { id: "painting", name: "Painting", line: "Gesture and pigment" },
  { id: "paper", name: "Paper Art", line: "Folded, cut, quietly precise" },
  { id: "coal", name: "Coal Art", line: "Depth in the darkest tone" },
  { id: "sand", name: "Sand Art", line: "Grain by grain, a landscape" },
  { id: "straw", name: "Straw Art", line: "Natural fibre, golden rhythm" },
  { id: "mixed_media", name: "Mixed Media Art", line: "Light forms, carved volume" },
];

BE.rooms = [
  { id: "living", name: "Living Room" },
  { id: "bedroom", name: "Bedroom" },
  { id: "dining", name: "Dining" },
  { id: "office", name: "Office & Studio" },
  { id: "entry", name: "Entrance & Stairway" },
  { id: "hotel", name: "Hotel & Resort" },
];

const IMG = "assets/img/";

BE.artworks = [
  {
    id: "BE-2026-001",
    name: "Flowing Balance",
    archiveId: "BE-2026-001",
    year: 2026,
    collection: "Original",
    category: "texture",
    price: 24600,
    format: "Original",
    dimensions: "18 × 24 inches",
    size: { w: 46, h: 61 },
    depth: "Black frame",
    materials: "Textured black and ivory relief on canvas. Black frame.",
    edition: "Original",
    editionNote: "",
    availability: "Available — ships in 2–3 weeks",
    status: "available",
    rooms: ["living", "bedroom", "office", "entry"],
    palette: "Black & ivory",
    featured: true,
    signature: true,
    images: [
      IMG + "art/flowing-balance-4.jpeg",
      IMG + "art/flowing-balance-1.jpeg",
      IMG + "art/flowing-balance-2.jpeg",
      IMG + "art/flowing-balance-3.jpeg",
    ],
    excerpt: "Balance is not stillness. It is the harmony of movement.",
    story:
      "This artwork explores the balance between movement and stillness.\n\nThe flowing black and ivory forms move around one another like natural currents, creating a sense of continuous movement, connection, and harmony. No shape follows a perfectly straight path — just like life.\n\nThe black represents depth, strength, and stillness, while the ivory represents light, clarity, and calm. Together, they create a quiet contrast that feels both modern and timeless.\n\nWhat makes the artwork engaging is the way the shapes seem to move, separate, reconnect, and flow into one another. The longer you look, the more relationships between the forms you begin to notice.\n\n“Balance is not stillness. It is the harmony of movement.”",
  },
  {
    id: "BE-2026-002",
    name: "Interwoven Rhythm",
    archiveId: "BE-2026-002",
    year: 2026,
    collection: "Original",
    category: "texture",
    categories: ["texture", "thread", "mixed_media"],
    price: 32700,
    format: "Original",
    dimensions: "18 × 24 inches",
    size: { w: 46, h: 61 },
    depth: "Black frame",
    materials: "Textured deep-green surface with raised threadwork on canvas. Black frame.",
    edition: "Original",
    editionNote: "",
    availability: "Available — ships in 2–3 weeks",
    status: "available",
    rooms: ["living", "bedroom", "office", "entry"],
    palette: "Deep green & silver",
    featured: true,
    images: [
      IMG + "art/interwoven-rhythm-1.jpeg",
      IMG + "art/interwoven-rhythm-2.jpeg",
      IMG + "art/interwoven-rhythm-3.jpeg",
      IMG + "art/interwoven-rhythm-4.jpeg",
    ],
    excerpt: "Different paths. One rhythm.",
    story:
      "Interwoven Rhythm explores the beauty of finding balance within complexity.\n\nThe flowing lines represent the different paths, experiences, emotions, and connections that shape our lives. Each line moves in its own direction, yet together they create one continuous rhythm.\n\nThe deep textured surface represents stillness and depth, while the raised lines bring movement, energy, and expression.\n\nWhat may first appear chaotic slowly reveals a sense of harmony — reminding us that life doesn’t always follow a straight path, but every path has a purpose.\n\n“Different paths. One rhythm.”",
  },
  {
    id: "BE-2026-003",
    name: "Fragments of Stillness",
    archiveId: "BE-2026-003",
    year: 2026,
    collection: "Original",
    category: "texture",
    price: 39300,
    format: "Original",
    dimensions: "24 × 24 inches",
    size: { w: 61, h: 61 },
    depth: "Brown frame",
    materials: "Sculpted ivory forms on a textured surface, on canvas. Brown frame.",
    edition: "Original",
    editionNote: "",
    availability: "Available — ships in 2–3 weeks",
    status: "available",
    rooms: ["living", "bedroom", "office", "entry"],
    palette: "Ivory & taupe",
    featured: true,
    images: [
      IMG + "art/fragments-of-stillness-1.jpeg",
      IMG + "art/fragments-of-stillness-2.jpeg",
      IMG + "art/fragments-of-stillness-3.jpeg",
      IMG + "art/fragments-of-stillness-4.jpeg",
    ],
    excerpt: "Beauty is not found in perfection, but in the way each piece finds its place.",
    story:
      "This artwork explores the beauty of imperfection, individuality, and quiet moments.\n\nNine sculptural forms sit within a calm, textured surface. Although they share a similar shape, each one bends, folds, and moves differently — suggesting that no two experiences, moments, or people are exactly the same.\n\nThe soft ivory forms represent clarity, calm, and individuality, while the single dark form introduces contrast, depth, and the idea of embracing difference.\n\nThe empty space between each form is just as important as the forms themselves. It creates silence, balance, and breathing room, allowing every individual piece to exist without competing with the others.\n\n“Beauty is not found in perfection, but in the way each piece finds its place.”",
  },
];

/* Rooms used by the "View in Interior" feature.
   x / bottom are % of the photo; cmToPct = % of photo width per centimetre of artwork. */
BE.viewRooms = [
  {
    id: "lounge",
    name: "Living Room",
    src: IMG + "stock/room-sofa",
    x: 42.5,
    bottom: 41,
    cmToPct: 0.17,
  },
  {
    id: "gallery",
    name: "Gallery Wall",
    src: null,
    x: 50,
    bottom: 36,
    cmToPct: 0.22,
  },
  {
    id: "suite",
    name: "Open Suite",
    src: IMG + "stock/room-empty",
    x: 72.5,
    bottom: 48,
    cmToPct: 0.1,
  },
];

BE.stories = [
  { id: "BE-2026-001" },
  { id: "BE-2026-002" },
  { id: "BE-2026-003" },
];

BE.journal = [
  {
    id: "choosing-scale",
    title: "The Art of Scale: Choosing a Statement Piece",
    tag: "Interiors",
    image: IMG + "brand/int-dining",
    read: "4 min read",
    body: [
      "A statement work should occupy roughly two-thirds of the furniture beneath it. Above a 240 cm sofa, look for a piece — or a diptych — of around 160 cm. Above a console, allow the art to rise taller than it is wide.",
      "Hang the centre of the work at eye level, approximately 150 cm from the floor, unless it sits above furniture. Then leave a breathing space of 20–30 cm between the top of the furniture and the bottom of the frame.",
      "When in doubt, go larger. A generous work calms a room; a small one on a large wall makes the whole space feel unfinished.",
    ],
  },
  {
    id: "light-and-texture",
    title: "Light & Texture: How Relief Art Changes Through the Day",
    tag: "Craft",
    image: IMG + "brand/craft-macro",
    read: "3 min read",
    body: [
      "Textured art is never the same work twice. Morning light raking from a window reveals every ridge; evening lamps soften the surface into colour and shadow.",
      "For the most dramatic effect, light a relief work from above at a shallow angle — a picture light or a ceiling spot 50–70 cm out from the wall. Avoid flat, frontal light, which hides the sculpture in the surface.",
      "Warm light (2700–3000K) flatters umber, ivory and gold. Keep direct sunlight away from any artwork for long periods.",
    ],
  },
  {
    id: "collecting-editions",
    title: "Collecting Editions: What “Limited” Really Means",
    tag: "Collecting",
    image: IMG + "brand/int-gallery",
    read: "5 min read",
    body: [
      "Every Bunt Elegance limited edition is produced in a fixed number that is never extended. Once an edition closes, the work is retired.",
      "Each eligible piece is numbered, signed and accompanied by a Certificate of Authenticity that records the title, edition number, dimensions and date. Keep the certificate with the artwork — it is part of the work’s provenance.",
      "Earlier edition numbers are not more valuable than later ones; what matters is that the edition is genuinely limited and documented.",
    ],
  },
];

BE.findArtwork = (id) => BE.artworks.find((a) => a.id === id);
BE.findCategory = (id) => BE.categories.find((c) => c.id === id);
