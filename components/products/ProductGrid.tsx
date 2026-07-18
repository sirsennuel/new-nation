import ProductCard from '@/components/products/ProductCard';

export default function ProductGrid({ products }: { products: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {products.map(p => (
        <ProductCard key={p.id} p={{ id: p.id, slug: p.slug, name: p.name, category: p.category, price: p.price, image: p.images?.[0] || '/placeholder-product.png' }} />
      ))}
    </div>
  );
}
