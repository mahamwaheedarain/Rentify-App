import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Adjust this import path as needed

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products...");
        const productsCollection = collection(db, "products");
        const productsSnapshot = await getDocs(productsCollection);

        if (productsSnapshot.empty) {
          console.log("No products found in the 'products' collection.");
          setProducts([]);
          setLoading(false);
          return;
        }

        const allProducts = [];

        for (const productDoc of productsSnapshot.docs) {
          const userId = productDoc.id;
          console.log(`Fetching userProducts for userId: ${userId}`);

          const userProductsCollection = collection(
            db,
            `products/${userId}/userProducts`
          );
          const userProductsSnapshot = await getDocs(userProductsCollection);

          if (userProductsSnapshot.empty) {
            console.log(`No userProducts found for userId: ${userId}`);
            continue;
          }

          const userProducts = userProductsSnapshot.docs.map((userProductDoc) => ({
            id: userProductDoc.id,
            ...userProductDoc.data(),
          }));

          console.log(`Fetched userProducts for userId: ${userId}`, userProducts);
          allProducts.push(...userProducts);
        }

        console.log("All products fetched:", allProducts);
        setProducts(allProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderValue = (value) => (value === null || value === undefined ? "N/A" : value);

  const renderCategoryFields = (product) => {
    switch (product.category) {
      case "Household & Furniture":
        return (
          <>
            <td>{renderValue(product.household_furniture?.type)}</td>
            <td>{renderValue(product.household_furniture?.material)}</td>
            <td>{renderValue(product.household_furniture?.condition)}</td>
            <td>{renderValue(product.household_furniture?.dimensions)}</td>
          </>
        );
      case "Electronics & Tech Items":
        return (
          <>
            <td>{renderValue(product.electronics_tech?.brand)}</td>
            <td>{renderValue(product.electronics_tech?.model)}</td>
            <td>{renderValue(product.electronics_tech?.condition)}</td>
            <td>{renderValue(product.electronics_tech?.specifications)}</td>
            <td>{renderValue(product.electronics_tech?.warranty ? "Yes" : "No")}</td>
          </>
        );
      case "Fashion & Apparel Items":
        return (
          <>
            <td>{renderValue(product.fashion_apparel?.brand)}</td>
            <td>{renderValue(product.fashion_apparel?.size)}</td>
            <td>{renderValue(product.fashion_apparel?.material)}</td>
            <td>{renderValue(product.fashion_apparel?.color)}</td>
            <td>{renderValue(product.fashion_apparel?.gender)}</td>
          </>
        );
      case "Baby & Kids' Items":
        return (
          <>
            <td>{renderValue(product.baby_kids?.type)}</td>
            <td>{renderValue(product.baby_kids?.ageRange)}</td>
            <td>{renderValue(product.baby_kids?.condition)}</td>
            <td>{renderValue(product.baby_kids?.safetyFeatures)}</td>
          </>
        );
      case "vehicles":
      case "Transportation / Vehicle":
        return (
          <>
            <td>{renderValue(product.transportation_vehicle?.make)}</td>
            <td>{renderValue(product.transportation_vehicle?.model)}</td>
            <td>{renderValue(product.transportation_vehicle?.year)}</td>
            <td>{renderValue(product.transportation_vehicle?.mileage)}</td>
            <td>{renderValue(product.transportation_vehicle?.condition)}</td>
            <td>{renderValue(product.transportation_vehicle?.fuelType)}</td>
            <td>{renderValue(product.transportation_vehicle?.licensePlate)}</td>
          </>
        );
      default:
        return <td colSpan="6">No specific fields for this category</td>;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Products List</h1>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Location</th>
            <th>Availability</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Images</th>
            <th>Additional Info</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td>{renderValue(product.title)}</td>
                <td>{renderValue(product.description)}</td>
                <td>{renderValue(product.price)}</td>
                <td>{renderValue(product.category)}</td>
                <td>{renderValue(product.location)}</td>
                <td>{renderValue(product.availability)}</td>
                <td>
                  {product.createdAt
                    ? new Date(product.createdAt.seconds * 1000).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  {product.updatedAt
                    ? new Date(product.updatedAt.seconds * 1000).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  {product.images && product.images.length > 0 ? (
                    product.images.map((image, index) => (
                      <img key={index} src={image} alt="Product" width="50" />
                    ))
                  ) : (
                    "No Images"
                  )}
                </td>
                {renderCategoryFields(product)}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No products found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
