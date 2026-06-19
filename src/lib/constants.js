export const BRAND = {
  name: 'SHINING BROWS',
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

export const FOOTER_LINKS = {
  egitimler: [
    { label: 'Kaş Vitamini', href: '/courses/brow-vitamin' },
    { label: 'Kaş Kınası', href: '/courses/brow-henna' },
    { label: 'Kaş Silme', href: '/courses/brow-removal' },
    { label: 'Ürünler', href: '/products' },
  ],
  akademi: [
    { label: 'Hakkımızda', href: '/about' },
    { label: 'Uzman Haritası', href: '/experts' },
    { label: 'Shining Artist Ol', href: '/workshops' },
    {
      label: 'Uzman Portalı',
      href: 'https://experts.shiningbrowsacademy.com',
      external: true,
    },
  ],
  iletisim: [
    { label: 'Instagram', href: 'https://instagram.com/shiningbrowsturkey', external: true },
    { label: 'info@shiningbrowsacademy.com', href: 'mailto:info@shiningbrowsacademy.com' },
  ],
};
