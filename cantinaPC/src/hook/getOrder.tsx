import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../config/firebaseconfig";
import { format, toZonedTime } from "date-fns-tz";

function useFirestoreCollectionForToday<
  T extends { addedAt: any; status?: string },
>(collectionName: string, statusFilter?: string): T[] {
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    const collectionRef = collection(database, collectionName);

    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      const items: T[] = [];
      const timeZone = "America/Sao_Paulo";
      const today = new Date();
      const todayInBrasilia = toZonedTime(today, timeZone);
      const todayString = format(todayInBrasilia, "yyyy-MM-dd");

      querySnapshot.forEach((doc) => {
        const docData = doc.data() as T;
        const docDate = docData.addedAt.toDate(); // Convert Firestore Timestamp to Date
        const docDateInBrasilia = toZonedTime(docDate, timeZone);
        const docDateString = format(docDateInBrasilia, "yyyy-MM-dd");

        // Verifica se a data corresponde ao dia atual
        if (docDateString === todayString) {
          // Verifica o status caso o filtro seja fornecido
          if (!statusFilter || docData.status === statusFilter) {
            items.push({ ...docData, id: doc.id });
          }
        }
      });

      setData(items);
    });

    return () => unsubscribe();
  }, [collectionName, statusFilter]);

  return data;
}

export default useFirestoreCollectionForToday;
