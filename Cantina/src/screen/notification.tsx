import { ScrollView, Text, View, Image } from "react-native";
import AvatarBar from "../components/avatarBar";
import * as React from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { database } from "../config/firebaseconfig";
import { Timestamp } from "firebase/firestore";

interface Message {
  id: string;
  text: string;
  type: string;
  timestamp: Timestamp;
  userID: string;
}

interface User {
  id: string;
  name: string;
  photoURL: string;
}

export default function Notification() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [usersMap, setUsersMap] = React.useState<Record<string, User>>({});

  React.useEffect(() => {
    const fetchData = async () => {
      // Fetch users and create a map
      const userQuery = query(collection(database, "user"));
      const userSnapshot = await getDocs(userQuery);

      const users: Record<string, User> = {};
      userSnapshot.forEach((doc) => {
        const data = doc.data() as User;
        users[doc.id] = { ...data, id: doc.id };
      });

      setUsersMap(users);

      // Fetch messages
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
            userID: data.userID,
            timestamp: data.timestamp as Timestamp,
          } as Message;
        });
        setMessages(newMessages);
      });

      return () => unsubscribe();
    };

    fetchData();
  }, []);

  return (
    <View className="bg-laranja-100 flex-1">
      <View className="bg-laranja-100">
        <AvatarBar />
      </View>
      <Text className="bg-white mt-4 h-9 text-center align-middle text-laranja-100 font-bold text-xl">
        AVISOS
      </Text>
      <ScrollView className="px-4">
        {messages.map((message) => {
          const messageUser = usersMap[message.userID];
          return (
            <View
              key={message.id}
              className="bg-white shadow-sm shadow-black/30 rounded-lg h-24 mt-4 p-2 flex-row "
            >
              {messageUser && (
                <View className="items-center justify-around mr-4">
                  <Image
                    source={{ uri: messageUser.photoURL }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                    }}
                  />
                  <Text className="font-bold text-center text-laranja-100">
                    {messageUser.name}
                  </Text>
                </View>
              )}
              <View className="flex-1 justify-around">
                <Text className="font-bold">{message.type}</Text>
                <Text>{message.text}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
