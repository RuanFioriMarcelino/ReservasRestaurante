import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../config/firebaseconfig";
import { Button } from "../components/buttonCalendar";

interface Products {
  id: string;
  name: string;
  description: string;
  genre: string;
  value: string;
  imgURL: string;
  category: string;
  sale: boolean; // Change to boolean for logical operations
}

export default function Calendar() {
  const [products, setProducts] = useState<Products[]>([]);

  useEffect(() => {
    const productCollection = collection(database, "products");

    const unsubscribe = onSnapshot(productCollection, (querySnapshot) => {
      const list: Products[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as Products);
      });
      setProducts(list);

      console.log(list.map((product) => product.name));
    });

    return () => unsubscribe();
  }, []);

  const handleEditSale = async (
    productId: string,
    currentSaleStatus: boolean
  ) => {
    try {
      const productDoc = doc(database, "products", productId);
      await updateDoc(productDoc, {
        sale: !currentSaleStatus, // Toggle the sale status
      });
      console.log("Status de venda atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar status de venda: ", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-center h-[550px] overflow-y-auto overflow-x-hidden pr-2 pb-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex bg-white h-28 rounded-lg shadow-sm shadow-neutral-500"
        >
          <img
            src={product.imgURL}
            alt={product.name}
            className="rounded-s-lg w-28"
          />
          <div className="p-2 flex w-full justify-between">
            <div className="justify-evenly flex flex-col w-full">
              <p className="font-bold">{product.name}</p>
              <p className="text-sm h-10 overflow-hidden text-ellipsis ">
                {product.description}
              </p>
              <p className="text-orange-600 font-medium text-xl">
                R$ {product.value}
              </p>
            </div>
            <div className="w-1/3">
              <Button
                button={!product.sale}
                onClick={() => handleEditSale(product.id, product.sale)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
