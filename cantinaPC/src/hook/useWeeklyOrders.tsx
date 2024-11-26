import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../config/firebaseconfig";
import {
  format,
  subDays,
  eachDayOfInterval,
  startOfWeek,
  isWithinInterval,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { ptBR } from "date-fns/locale";

interface OrderData {
  addedAt: any;
  orderDetails: Record<string, any>[]; // Assume orderDetails is an array of objects
  status?: string;
}

interface DayCount {
  [key: string]: number;
}

function useFirestoreWeeklyOrders(
  statusFilter?: string
): { total: number; day: string }[] {
  const [data, setData] = useState<{ total: number; day: string }[]>([]);

  useEffect(() => {
    const collectionRef = collection(database, "orders");
    const timeZone = "America/Sao_Paulo";
    const today = new Date();
    const todayInBrasilia = toZonedTime(today, timeZone);

    // Calculate the previous week's Monday to Friday
    const startOfLastWeek = startOfWeek(subDays(todayInBrasilia, 7), {
      weekStartsOn: 1,
    });
    const endOfLastWeek = subDays(startOfLastWeek, -5);

    const daysOfWeek = eachDayOfInterval({
      start: startOfLastWeek,
      end: subDays(startOfLastWeek, -4), // Limita até sexta-feira
    });

    console.log(
      "Intervalo de dias:",
      daysOfWeek.map((day) => format(day, "yyyy-MM-dd"))
    );

    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      const dayCounts: DayCount = {};

      daysOfWeek.forEach((day) => {
        dayCounts[format(day, "yyyy-MM-dd")] = 0;
      });

      querySnapshot.forEach((doc) => {
        const docData = doc.data() as OrderData;
        if (!docData.addedAt) {
          console.warn("Documento sem campo 'addedAt':", doc.id);
          return;
        }

        const docDate = docData.addedAt.toDate();
        const docDateInBrasilia = toZonedTime(docDate, timeZone);
        const docDateString = format(docDateInBrasilia, "yyyy-MM-dd");

        console.log(
          "Processando documento:",
          doc.id,
          "Data:",
          docDateString,
          "Detalhes:",
          docData.orderDetails
        );

        if (
          isWithinInterval(docDateInBrasilia, {
            start: startOfLastWeek,
            end: endOfLastWeek,
          })
        ) {
          if (!statusFilter || docData.status === statusFilter) {
            const productCount = docData.orderDetails
              ? docData.orderDetails.length
              : 0;
            dayCounts[docDateString] += productCount;
          }
        }
      });

      const result = daysOfWeek.map((day) => ({
        total: dayCounts[format(day, "yyyy-MM-dd")] || 0,
        day: format(day, "EEEE", { locale: ptBR }),
      }));

      console.log("Resultados finais:", result);
      setData(result);
    });

    return () => unsubscribe();
  }, [statusFilter]);

  return data;
}

export default useFirestoreWeeklyOrders;
