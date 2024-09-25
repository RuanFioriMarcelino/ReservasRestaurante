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
import { Button } from "./buttonCard";
import { Trash2 } from "lucide-react";
import BasicModal from "../modals/modalUpdateFood";

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
  const [scroll, setScroll] = useState(false);

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
      if (list.length <= 4) {
        setScroll(false);
        console.log("é falso: ", list.length);
      }
      console.log(list.map((list) => list.name));
    });

    return () => unsubscribe();
  }, []);

  function deleteProduct(id: string) {
    const taskdocref = doc(database, "products", id);
    deleteDoc(taskdocref);
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-center max-h-[450px] overflow-y-auto overflow-x-hidden pr-2">
        {Products.map((product) => (
          <div key={product.id} className="  flex bg-black/10 rounded-lg ">
            <img
              src={product.imgURL}
              alt={product.name}
              className="rounded-s-lg w-28"
            />
            <div className="p-2 flex w-full justify-between">
              <div className="justify-evenly flex flex-col w-full">
                <p className="font-bold">{product.name}</p>
                <p className="text-sm w-4/5">{product.description}</p>
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
                  name={product.name}
                  description={product.description}
                  genre={product.genre}
                  value={product.value}
                  imgURL={product.imgURL}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
