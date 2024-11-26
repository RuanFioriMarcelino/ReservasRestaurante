import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { database } from "../config/firebaseconfig";
import { useEffect, useState } from "react";
import { Button } from "./buttonFood";
import { Trash2 } from "lucide-react";
import BasicModal from "../modals/modalUpdateFood";
import { updateDoc } from "firebase/firestore";

interface Products {
  id: string;
  name: string;
  description: string;
  genre: string;
  value: string;
  imgURL: string;
  category: string;
}

type Props = {
  type: string;
};

export default function CardProduct(type: Props) {
  const [Products, setProducts] = useState<Products[]>([]);

  function updateProduct({ id, updatedProduct }: any) {
    const productDocRef = doc(database, "products", id);
    return updateDoc(productDocRef, updatedProduct);
  }

  useEffect(() => {
    const productCollection = query(
      collection(database, "products"),
      where("category", "==", `${type.type}`)
    );
    const unsubscribe = onSnapshot(productCollection, (query) => {
      const list: Products[] = [];
      query.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as Products);
      });
      setProducts(list);

      console.log(list.map((list) => list.name));
    });

    return () => unsubscribe();
  }, []);

  function deleteProduct(id: string) {
    const taskdocref = doc(database, "products", id);
    deleteDoc(taskdocref);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[550px] overflow-y-auto overflow-x-hidden pr-2 pb-4">
      {Products.map((product) => (
        <div
          key={product.id}
          className="  flex h-28 bg-white rounded-lg shadow-sm shadow-neutral-500"
        >
          <img
            src={product.imgURL}
            alt={product.name}
            className="rounded-s-lg w-28"
          />
          <div className="p-2 flex w-full justify-between">
            <div className="justify-evenly flex flex-col w-full">
              <p className="font-bold">{product.name}</p>
              <p className="text-sm  h-10  overflow-hidden text-ellipsis ">
                {product.description}
              </p>
              <p className="text-orange-600 font-medium text-xl">
                R$ {product.value}
              </p>
            </div>
            <div className="w-1/3 flex-col flex justify-between">
              <Button
                button
                children={<Trash2 />}
                onClick={() => deleteProduct(product.id)}
              />
              <BasicModal
                id={product.id}
                name={product.name}
                description={product.description}
                genre={product.genre}
                value={product.value}
                imgURL={product.imgURL}
                onUpdate={updateProduct}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
