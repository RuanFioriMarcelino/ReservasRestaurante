import { ReactNode } from "react";
import { colors } from "../styles/colors";
import { TextInput, View, TextInputProps } from 'react-native';

function Input({children}:{children: ReactNode}){
    return(
        <View className="w-full h-14 flex-row items-center gap-3 p-3 border border-laranja-200 rounded-lg bg-white">{children}</View>
    )
}


function Field({...rest}: TextInputProps){
    return <TextInput className="flex-1 text-orange-900 text-base font-regular" 
    placeholderTextColor={colors.laranja[200]} {...rest}/>
}

Input.Field = Field

export { Input}