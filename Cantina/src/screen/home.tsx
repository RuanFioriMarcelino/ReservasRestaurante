import { SafeAreaView, View } from "react-native";
import AvatarBar from "../components/avatarBar";


export default function Home(){
    return(
        <SafeAreaView className="flex-1">
            <AvatarBar/>
        </SafeAreaView>
    )
}