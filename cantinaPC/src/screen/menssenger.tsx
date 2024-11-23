import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, database } from "../config/firebaseconfig";
import { Timestamp } from "firebase/firestore";

import { Trash2 } from "lucide-react";

interface Message {
  id: string;
  text: string;
  type: string;
  timestamp: Timestamp;
}

export default function Messenger() {
  const [messageText, setMessageText] = useState("");
  const [typeMessageText, setTypeMessageText] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async (e: any | false) => {
    e.preventDefault();

    if (messageText.trim() === "" || typeMessageText.trim() === "") {
      return alert("Prencha todos os campos!");
    }

    try {
      const userID = auth.currentUser?.uid;
      await addDoc(collection(database, "messages"), {
        text: messageText,
        type: typeMessageText,
        timestamp: serverTimestamp(),
        userID,
      });

      setMessageText("");
      setTypeMessageText("");
    } catch (error) {
      console.error("Erro ao enviar mensagem: ", error);
    }
  };

  useEffect(() => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const messagesQuery = query(
      collection(database, "messages"),
      where("timestamp", ">=", twentyFourHoursAgo)
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text,
          type: data.type,
          timestamp: data.timestamp as Timestamp,
        } as Message;
      });
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [database]);

  const deleteMessage = async (id: string) => {
    try {
      await deleteDoc(doc(database, "messages", id));
    } catch (error) {
      console.error("Erro ao deletar mensagem: ", error);
    }
  };

  return (
    <div className=" gap-4 min-h-[500px] grid-cols-2 flex ">
      <form onSubmit={sendMessage} className="flex flex-col  w-2/5 ">
        <select
          id="type"
          value={typeMessageText}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setTypeMessageText(e.target.value)
          }
          className="border rounded-t-lg h-16 text-center"
        >
          <option value="">Gênero Mensagem</option>
          <option value="Aviso">Aviso</option>
          <option value="Alerta">Alerta</option>
          <option value="Comunicado">Comunicado</option>
        </select>

        <textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Digite sua mensagem"
          className="border p-2 h-full"
        />
        <button
          type="submit"
          className="bg-yellow text-white p-2 rounded-b-lg h-12 *:min-w-24"
        >
          Enviar
        </button>
      </form>

      <div className="border" />
      <div className="w-3/5 gap-4 flex flex-col">
        {messages.map((message) => (
          <div
            key={message.id}
            className="bg-white shadow-sm shadow-black/30  rounded-lg h-52 sm:h-20 flex justify-between"
          >
            <span className="p-2">
              <span>
                <p className="font-medium">{message.type} </p>
                <p>{message.text}</p>
              </span>

              <small className=" text-xs whitespace-nowrap">
                {new Date(message.timestamp.toDate()).toLocaleString()}
              </small>
            </span>

            <button
              onClick={() => deleteMessage(message.id)}
              className="hover:bg-white hover:shadow-sm transform-gpu hover:shadow-black/30 h-full items-center flex justify-center px-4 rounded-r-lg"
            >
              <Trash2 className="text-red-950 " size={30} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
