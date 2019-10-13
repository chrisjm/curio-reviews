const products = [
  { name: 'Maple CURIO', value: 'maple', url: 'https://curiomodern.com/products/maple' },
  {
    name: 'Maple + Pattern CURIO',
    value: 'maple-pattern',
    url: 'https://curiomodern.com/products/maple-pattern',
  },
  { name: 'Walnut CURIO', value: 'walnut', url: 'https://curiomodern.com/products/walnut' },
  {
    name: 'Walnut + Pattern CURIO',
    value: 'walnut-pattern',
    url: 'https://curiomodern.com/products/walnut-pattern',
  },
  {
    name: 'Litter Liner',
    value: 'litter-liner',
    url: 'https://curiomodern.com/products/litter-liner',
  },
];

const productNameFromUrl = url => {
  const product = products.find(p => p.url === url);
  if (product) return product.name;
};

const productUrlFromValue = value => {
  const product = products.find(p => p.value === value);
  if (product) return product.url;
};

const productValueFromUrl = url => {
  const product = products.find(p => p.url === url);
  if (product) return product.value;
};

module.exports = {
  products,
  productNameFromUrl,
  productUrlFromValue,
  productValueFromUrl,
};
