import { collection, onSnapshot } from "firebase/firestore";
import { database } from "../config/firebaseconfig";
import { useEffect, useState } from "react";

interface Foods {
  id: string;
  name: string;
  description: string;
  valor: string;
  imgURL: string;
}

export default function Card() {
  const [foods, setFoods] = useState<Foods[]>([]);

  useEffect(() => {
    const productCollection = collection(database, "foods");
    const unsubscribe = onSnapshot(productCollection, (query) => {
      const list: Foods[] = [];
      query.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as Foods);
      });
      setFoods(list);
      console.log(list.map((list) => list.name));
    });

    return () => unsubscribe();
  }, []);
  return (
    <ul className="flex flex-wrap gap-8">
      {foods.map((food) => (
        <li key={food.id} className="basis-[250px] bg-white rounded-lg p-2  ">
          <p className="font-bold">{food.name}</p>
          <div className=" flex">
            <div className="text-center font-bold">
              <img src={food.imgURL} alt={food.name} className="w-16 h-16 " />
              <p className="text-orange-600  ">R$ {food.valor}</p>
            </div>

            <p className="text-sm w-4/5 text-center   ">{food.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
