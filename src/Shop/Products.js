import ProductItem from "./ProductItem";
import classes from "./Products.module.css";

const DummyProduct = [
  {
    id: "p1",
    price: 10,
    title: "iron",
    description: "the life of iron man ",
  },
  {
    id: "p2",
    price: 15,
    title: "wee",
    description: "wwe streams ",
  },
];

const Products = (props) => {
  return (
    <section className={classes.products}>
      <h2>Buy your favorite shows</h2>
      <ul>
        {DummyProduct.map((product) => (
          <ProductItem
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            description={product.description}
          />
        ))}
      </ul>
    </section>
  );
};

export default Products;
