import { ImageBackground, TouchableOpacity, Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";

import Avatar from "./Avatar";

export default function Board({ children }) {
  const navigation = useNavigation();
  return (
    <ImageBackground
      source={require("../../assets/backgrounds/sum_sub-bg.png")}
      style={[{ flex: 1 }, tw`justify-center `]}
      imageStyle={{ resizeMode: "stretch" }}
    >
      {/* exit button */}
      <TouchableOpacity
        style={[
          {
            transform: [{ rotate: "90deg" }],
            backgroundColor: "#6F5AC5",
            borderColor: "#6F4AC5",
            width: "15%",
            height: "8%",
            shadowColor: "rgba(65, 0, 251, 0.53)",
          },
          tw`absolute top-3 right-3 flex justify-center items-center rounded-xl border-4 shadow-xl  z-40`,
        ]}
        onPress={() => {
          navigation.replace("TasksMap");
        }}
      >
        <Text style={[tw`text-white text-4xl font-bold text-center `]}>x</Text>
      </TouchableOpacity>

      {/* Avatar view */}
      <View
        style={[
          { transform: [{ rotate: "90deg" }], marginTop: "-153%" },
          tw` w-8/12 z-30`,
        ]}
      >
        <Avatar />
      </View>
      {/* view the board */}
      <View
        style={[
          { height: "65%", width: "85%", marginTop: "-135%" },
          tw`flex self-center `,
        ]}
      >
        <ImageBackground
          source={require("../../assets/images/greenBoard.png")}
          style={[tw`w-full h-full relative`]}
        >
          {children}
        </ImageBackground>
      </View>
    </ImageBackground>
  );
}
