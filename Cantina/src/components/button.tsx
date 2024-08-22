import { Text, ActivityIndicator, TouchableOpacity, TouchableOpacityProps, View } from "react-native";

type Props = TouchableOpacityProps & {
    title: string
    isLoading?: boolean
}

export function Button({ title, isLoading = false, ...rest}: Props){
    return (
        <TouchableOpacity
        activeOpacity={0.7}
        disabled={isLoading}
        {...rest} >
            <View 
            className="w-full h-14 bg-white items-center justify-center rounded-lg">
            {isLoading ? ( 
                <ActivityIndicator className="text-green-500"/>
                ) : (
            <Text className="text-laranja-100 text-base font-bold uppercase">
                {title}
            </Text> 
            )}
            </View>
        </TouchableOpacity>
    )
}