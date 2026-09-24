const moodDefinitions = [
    { key: 'editorial', label: 'Éditorial', primary: '#173f3a', accents: ['#e7b78f', '#d7e6b7'], text: '#18211f', bg: '#f7f4ed', heads: ['DM Serif Display', 'Fraunces'], bodies: ['DM Sans', 'Manrope'] },
    { key: 'sunset', label: 'Solaire', primary: '#b8563d', accents: ['#f3b36b', '#f1dfb4'], text: '#40221c', bg: '#fff4e9', heads: ['Bodoni Moda', 'Playfair Display'], bodies: ['DM Sans', 'Nunito Sans'] },
    { key: 'ocean', label: 'Océan', primary: '#145b6b', accents: ['#80c5c2', '#e3c475'], text: '#102e35', bg: '#edf8f7', heads: ['Outfit', 'Space Grotesk'], bodies: ['Inter', 'Manrope'] },
    { key: 'nocturne', label: 'Nocturne', primary: '#29334e', accents: ['#b5a1e8', '#e58f79'], text: '#f8f5ef', bg: '#1c2235', heads: ['Cormorant Garamond', 'Bodoni Moda'], bodies: ['Manrope', 'DM Sans'] },
    { key: 'botanical', label: 'Botanique', primary: '#3e6348', accents: ['#d38d68', '#c7d88d'], text: '#1e3124', bg: '#f0f5e9', heads: ['Cormorant Garamond', 'Lora'], bodies: ['Nunito Sans', 'DM Sans'] },
    { key: 'atelier', label: 'Atelier', primary: '#704b3e', accents: ['#d9ad8c', '#ecdfc3'], text: '#35241e', bg: '#f8efe7', heads: ['Libre Baskerville', 'Lora'], bodies: ['Manrope', 'Inter'] },
    { key: 'citrus', label: 'Citrus', primary: '#52621d', accents: ['#f1c849', '#e98f55'], text: '#273016', bg: '#fbf7da', heads: ['Syne', 'Space Grotesk'], bodies: ['DM Sans', 'Manrope'] },
    { key: 'lavender', label: 'Lavande', primary: '#594b76', accents: ['#d4b7e5', '#f0c3a7'], text: '#30273d', bg: '#f7f1fa', heads: ['DM Serif Display', 'Playfair Display'], bodies: ['DM Sans', 'Nunito Sans'] },
    { key: 'brutalist', label: 'Brutaliste', primary: '#171717', accents: ['#ff5d3b', '#d7f04b'], text: '#171717', bg: '#f4f1e9', heads: ['Archivo Black', 'Space Grotesk'], bodies: ['IBM Plex Mono', 'DM Sans'] },
    { key: 'mineral', label: 'Minéral', primary: '#48616a', accents: ['#b6c8c2', '#d5a271'], text: '#24353a', bg: '#eef1ef', heads: ['Urbanist', 'Outfit'], bodies: ['Manrope', 'Inter'] }
];

const themeNames = ['Calme', 'Libre', 'Doux', 'Dense', 'Lumineux', 'Serein', 'Contrasté', 'Organique', 'Moderne', 'Signature'];

export const themes = moodDefinitions.flatMap((mood, moodIndex) => themeNames.map((name, variant) => ({
    id: `${mood.key}-${variant + 1}`,
    name: `${mood.label} ${name}`,
    mood: mood.label,
    primary: mood.primary,
    accent: mood.accents[variant % mood.accents.length],
    secondary: mood.accents[(variant + 1) % mood.accents.length],
    text: mood.text,
    bg: mood.bg,
    heading: mood.heads[(variant + moodIndex) % mood.heads.length],
    body: mood.bodies[(variant + moodIndex) % mood.bodies.length],
    radius: variant % 3 === 0 ? '0px' : variant % 3 === 1 ? '10px' : '24px',
    label: `${mood.key} ${variant + 1}`
})));
