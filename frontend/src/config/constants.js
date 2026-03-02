// Configuración general de la aplicación
export const APP_CONFIG = {
  siteName: 'Barbero',
  foundedYear: '1991',
  phone: '123-456-7899',
  email: 'hello@barbero.com',
  address: '192 Orchard Street, Ohio, California, 90002, Unite States',
}

// Rutas que usan el estilo de header alternativo
export const HEADER_STYLE_TWO_PAGES = ['/pricing', '/blog', '/blog-detail', '/productos', '/cart', '/checkout', '/admin']

// Enlaces de redes sociales
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/',
  behance: 'https://www.behance.net/',
  instagram: 'https://www.instagram.com/',
  youtube: 'https://www.youtube.com/',
  facebook: 'https://www.facebook.com/',
}

// Servicios principales
export const SERVICES = [
  {
    id: 1,
    title: 'Blackwork',
    description: 'Diseños en negro sólido, alto contraste y líneas contundentes.',
    image: '/images/resource/servicio-1.png',
    link: '/blog-detail',
  },
  {
    id: 2,
    title: 'Realismo',
    description: 'Tatuajes detallados que imitan imágenes reales con gran precisión.',
    image: '/images/resource/servicio-2.jpg',
    link: '/blog-detail',
  },
  {
    id: 3,
    title: 'Fine line',
    description: 'Líneas finas y delicadas, elegantes y sutiles.',
    image: '/images/resource/servicio-3.jpg',
    link: '/blog-detail',
  },
  {
    id: 4,
    title: 'Tradicional / Neotradicional',
    description: 'Colores intensos, líneas firmes y estética clásica reinterpretada.',
    image: '/images/resource/servicio-4.jpg',
    link: '/blog-detail',
  },
  {
    id: 5,
    title: 'Geométrico',
    description: 'Formas precisas, simetría y patrones con significado visual.',
    image: '/images/resource/servicio-5.jpg',
    link: '/blog-detail',
  },
  {
    id: 6,
    title: 'Lettering',
    description: 'Letras y tipografías personalizadas con mensaje propio.',
    image: '/images/resource/servicio-6.jpg',
    link: '/blog-detail',
  },
  {
    id: 7,
    title: 'Minimalista',
    description: 'Diseños simples, limpios y con intención.',
    image: '/images/resource/servicio-7.jpg',
    link: '/blog-detail',
  },
  {
    id: 8,
    title: 'Dotwork',
    description: 'Sombras y formas creadas a partir de puntos.',
    image: '/images/resource/servicio-8.jpg',
    link: '/blog-detail',
  },
  {
    id: 9,
    title: 'Tribal moderno',
    description: 'Inspiración ancestral con diseño contemporáneo.',
    image: '/images/resource/servicio-9.jpg',
    link: '/blog-detail',
  },
  {
    id: 10,
    title: 'Cover up artístico',
    description: 'Rediseño creativo para cubrir tatuajes antiguos o mal hechos.',
    image: '/images/resource/servicio-10.jpg',
    link: '/blog-detail',
  },
  {
    id: 11,
    title: 'Cover Up & Rework',
    description: 'Cubrimiento o rediseño creativo de tatuajes antiguos.',
    image: '/images/resource/servicio-11.jpg',
    link: '/blog-detail',
  },
]

// Lista de precios
export const PRICING_LIST = [
  { id: 1, title: 'Classic haircut', price: 8.5, description: 'Lorem ipsum dolor sit amet, consetetur' },
  { id: 2, title: 'Classic haircut & hair washing', price: 12.5, description: 'Lorem ipsum dolor sit amet, consetetur' },
  { id: 3, title: 'Hair washing', price: 5.5, description: 'Lorem ipsum dolor sit amet, consetetur' },
  { id: 4, title: 'Trimming & arranging long beard', price: 8.5, description: 'Lorem ipsum dolor sit amet, consetetur' },
  { id: 5, title: 'Moustache Trim', price: 2.5, description: 'Lorem ipsum dolor sit amet, consetetur' },
  { id: 6, title: 'Beard washing', price: 8.5, description: 'Lorem ipsum dolor sit amet, consetetur' },
  { id: 7, title: 'Stylization & arranging beard', price: 12.5, description: 'Lorem ipsum dolor sit amet, consetetur' },
  { id: 8, title: 'Beard & hair washing', price: 6.5, description: 'Lorem ipsum dolor sit amet, consetetur' },
  { id: 9, title: 'Facial Massage', price: 12.5, description: 'Lorem ipsum dolor sit amet, consetetur' },
  { id: 10, title: 'Clipper Cut Style', price: 8.5, description: 'Lorem ipsum dolor sit amet, consetetur' },
]

// Testimonios
export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Jonathon Doe',
    designation: 'CEO Barbero',
    rating: 5,
    text: 'Duis molestie lacus eu luctus laoreet. Phasellus pulvinar volutpat risus, ac luctus eros consequat non. Nulla et eros ex. Aliquam lobortis leo non lorem ullamcorper.',
    image: '/images/resource/author-1.jpg',
  },
  {
    id: 2,
    name: 'Michel Doe',
    designation: 'Business Man',
    rating: 5,
    text: 'Duis molestie lacus eu luctus laoreet. Phasellus pulvinar volutpat risus, ac luctus eros consequat non. Nulla et eros ex. Aliquam lobortis leo non lorem ullamcorper.',
    image: '/images/resource/author-2.jpg',
  },
  {
    id: 3,
    name: 'Kevin Doe',
    designation: 'Developer',
    rating: 5,
    text: 'Duis molestie lacus eu luctus laoreet. Phasellus pulvinar volutpat risus, ac luctus eros consequat non. Nulla et eros ex. Aliquam lobortis leo non lorem ullamcorper.',
    image: '/images/resource/author-3.jpg',
  },
]
