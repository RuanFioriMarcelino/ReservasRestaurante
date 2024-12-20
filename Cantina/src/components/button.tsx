import {
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

type Props = TouchableOpacityProps & {
  title: string;
  isLoading?: boolean;
  bgcolor: string;
  textColor: string;
};

export function Button({
  title,
  isLoading,
  bgcolor,
  textColor,
  ...rest
}: Props) {
  return (
    <TouchableOpacity activeOpacity={0.7} disabled={isLoading} {...rest}>
      <View
        className="w-full px-4   h-14 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${bgcolor}` }}
      >
        {isLoading ? (
          <ActivityIndicator className="text-white" />
        ) : (
          <Text
            className="text-laranja-100 text-base font-bold uppercase"
            style={{ color: `${textColor}` }}
          >
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
