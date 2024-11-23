import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { database } from "../config/firebaseconfig";

interface ProductCount {
  name: string;
  totalOrdered: number;
}

export function useProductOrders() {
  const [productCounts, setProductCounts] = useState<ProductCount[]>([]);

  useEffect(() => {
    const fetchProductsAndOrders = async () => {
      // Fetch products that are on sale
      const productsCollection = collection(database, "products");
      const productsQuery = query(
        productsCollection,
        where("sale", "==", true)
      );
      const productsSnapshot = await getDocs(productsQuery);
      const productsMap = new Map();

      productsSnapshot.forEach((doc) => {
        const data = doc.data();
        productsMap.set(doc.id, { name: data.name, totalOrdered: 0 });
      });

      // Fetch orders and calculate the quantity of each product ordered
      const ordersCollection = collection(database, "orders");
      const ordersQuery = query(ordersCollection);
      onSnapshot(ordersQuery, (querySnapshot) => {
        // Reinicialize o mapa de contagens
        const updatedProductCounts = new Map();

        // Inicialize novamente o mapa a cada novo snapshot
        productsSnapshot.forEach((doc) => {
          const data = doc.data();
          updatedProductCounts.set(doc.id, {
            name: data.name,
            totalOrdered: 0,
          });
        });

        querySnapshot.forEach((doc) => {
          const orderData = doc.data();
          if (Array.isArray(orderData.orderDetails)) {
            orderData.orderDetails.forEach((item: any) => {
              const product = updatedProductCounts.get(item.id);
              if (product) {
                // Certifique-se de adicionar como um número
                product.totalOrdered += Number(item.quantity);
              }
            });
          }
        });

        console.log(
          "Updated product counts:",
          Array.from(updatedProductCounts.values())
        );
        setProductCounts(Array.from(updatedProductCounts.values()));
      });
    };

    fetchProductsAndOrders();
  }, []);

  return { productCounts };
}
