import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { database } from "../config/firebaseconfig";
import { useEffect, useState } from "react";
import { Button } from "./buttonCard";
import { Trash2 } from "lucide-react";
import BasicModal from "../modals/modalUpdateFood";

interface Foods {
  id: string;
  name: string;
  description: string;
  genre: string;
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

  function deleteFood(id: string) {
    const taskdocref = doc(database, "foods", id);
    deleteDoc(taskdocref);
  }

  return (
    <div className="flex flex-wrap gap-6 justify-center  max-h-[450px] overflow-y-scroll ">
      {foods.map((food) => (
        <div
          key={food.id}
          className="basis-[550px] flex bg-white rounded-lg h-28  "
        >
          <img
            src={food.imgURL}
            alt={food.name}
            className="h-full rounded-s-lg "
          />
          <div className="p-2 flex w-full justify-between">
            <div className="">
              <p className="font-bold">{food.name}</p>
              <p className="text-sm w-4/5    ">{food.description}</p>
              <p className="text-orange-600 font-medium text-xl ">
                R$ {food.valor}
              </p>
            </div>
            <div className="w-1/3 flex-col flex justify-between  ">
              <Button
                button
                children={<Trash2 />}
                onClick={() => deleteFood(food.id)}
              />
              <BasicModal
                name={food.name}
                description={food.description}
                genre={food.genre}
                value={food.valor}
                imgURL={food.imgURL}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
