import ProductCard from "./ProductCard";

const ProductGrid = ({ products }) => {
  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
