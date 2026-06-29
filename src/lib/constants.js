export const BRAND = {
  name: 'Shining Brows',
  tagline: "Doğal kaş bakımında Türkiye'nin öncü akademisi.",
  founded: 2023,
  instagram: '@shiningbrows',
  locations: ['İzmir', 'KKTC', 'Amsterdam'],
};

export const NAV_LINKS = [
  { key: 'findTraining', href: '/workshops' },
  {
    key: 'courses',
    href: '/courses',
    subLinks: [
      { key: 'workshopsItem',     href: '/courses' },
      { key: 'browRemoval',       href: '/courses/brow-removal' },
      { key: 'browHenna',         href: '/courses/brow-henna' },
      { key: 'hairBrowVitamin',   href: '/courses/hair-brow-vitamin' },
    ],
  },
  { key: 'master', href: '/workshops' },
  { key: 'expertMap', href: '/experts' },
  { key: 'products', href: '/products' },
  { key: 'about', href: '/about' },
];
