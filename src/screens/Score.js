import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import { BackHandler } from "react-native";
import tw from "tailwind-react-native-classnames";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Score = ({ navigation }) => {
  const route = useRoute();
  const wrong = route.params.wrong;
  const word_Pic = route.params.word_Pic;
  const path = route.params.path;

  return (
    <View style={styles.body}>
      {/* show the score */}
      <View style={styles.viewContainer}>
        <Text style={[styles.text, { width: "60%" }, tw``]}>Score</Text>
        <Text style={[styles.textContainer, { width: "40%" }]}>
          {word_Pic.length - wrong}
        </Text>
      </View>
      {/* show wrong tries */}
      <View style={[styles.viewContainer, { marginTop: "12%" }]}>
        <Text style={[styles.text, { width: "75%" }]}>Wrong Tries</Text>
        <Text style={[styles.textContainer, { width: "25%" }]}>{wrong}</Text>
      </View>
      {/* paly again */}
      <TouchableOpacity
        style={[styles.replayBtn]}
        onPress={() => navigation.replace(path, { word_Pic })}
      >
        <MaterialCommunityIcons name="replay" size={50} />
        {/* <Image
          source={require("../../assets/retry.png")}
          style={{ width: "15%", height: "70%", marginEnd: "6%" }}
        />
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
          Play again
        </Text> */}
      </TouchableOpacity>

      {/* paly another game */}
      <TouchableOpacity
        style={[
          styles.TouchableOpacity,
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          },
          tw`bg-yellow-600 `,
        ]}
        onPress={() => navigation.replace("TasksMap", { word_Pic })}
      >
        <Text
          style={[
            {
              fontSize: 20,
              fontWeight: "bold",
              color: "#fff",
              marginRight: 10,
            },
            tw``,
          ]}
        >
          Next
        </Text>
        <MaterialCommunityIcons
          name="arrow-right-thick"
          size={30}
          color="white"
        />
      </TouchableOpacity>

      {/*quit*/}
      <TouchableOpacity
        style={[
          styles.TouchableOpacity,
          { marginTop: "3%", backgroundColor: "#BA7CC8" },
        ]}
        onPress={() => {
          navigation.navigate("Start");
          BackHandler.exitApp();
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
          Quit
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: "6%",
    margin: "5%",
    marginTop: "13%",
  },
  textContainer: {
    backgroundColor: "#efe",
    textAlign: "center",
    textAlignVertical: "center",
    height: 40,
    marginTop: "2.5%",
    fontSize: 22,
    borderRadius: 5,
    color: "#000",
    fontWeight: "500",
  },
  body: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#cfc",
  },
  text: {
    color: "#000",
    fontSize: 30,
    fontWeight: "bold",
  },
  TouchableOpacity: {
    width: "82%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    margin: "12%",
    marginBottom: "3%",
  },
  replayBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1DDA99",
    flexDirection: "row",
    marginBottom: "5%",
    marginTop: 20,
    padding: 10,
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: "#0ffA99",
  },
});

export default Score;
