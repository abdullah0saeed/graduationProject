import { useState } from "react";
import {
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { FlashList } from "@shopify/flash-list";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { fetchData, setWordPic } from "../store/globalSlice";
import { useRef } from "react";

// const data = [
//   {
//     taskId: 1,
//     gameName: [0, 1, 2],
//     done: [true, true, false],
//     data: [
//       {
//         dataId: 0,
//         defintioninEn: "apple",
//         imageUrl:
//           "https://thumbs.dreamstime.com/b/red-apple-isolated-clipping-path-19130134.jpg",
//       },
//       {
//         dataId: 1,
//         defintioninEn: "bat",
//         imageUrl:
//           "https://thumbs.dreamstime.com/b/flying-vampire-bat-isolated-white-background-d-rendering-77923549.jpg",
//       },
//       {
//         dataId: 2,
//         defintioninEn: "cat",
//         imageUrl:
//           "https://thumbs.dreamstime.com/b/cat-laughing-very-happy-54680614.jpg",
//       },
//       {
//         dataId: 3,
//         defintioninEn: "door",
//         imageUrl:
//           "https://thumbs.dreamstime.com/b/door-you-can-use-clean-interior-31806445.jpg",
//       },
//       {
//         dataId: 4,
//         defintioninEn: "egg",
//         imageUrl: "https://thumbs.dreamstime.com/b/egg-9804046.jpg",
//       },
//       {
//         dataId: 5,
//         defintioninEn: "fork",
//         imageUrl: "https://thumbs.dreamstime.com/b/fork-6231372.jpg",
//       },
//     ],
//   },
// { taskNumber: 2, gameName: [0], done: [false] },
// { taskNumber: 3, gameName: [2], done: [false] },
// { taskNumber: 4, gameName: [1], done: [false] },
// { taskNumber: 5, gameName: [0], done: [false] },
// { taskNumber: 6, gameName: [2], done: [false] },
// { taskNumber: 7, gameName: [0], done: [false] },
// { taskNumber: 8, gameName: [0], done: [false] },
// { taskNumber: 9, gameName: [0], done: [false] },
// { taskNumber: 10, gameName: [0], done: [false] },
// ];

//array to hold games routes
const games = [
  "Connect",
  "Listen_Choose",
  "Arrange",
  "Compare",
  "Sum_Sub",
  "Missing-Word",
  "QuestionsAr",
];

export default function TasksMap({ navigation }) {
  const dispatch = useDispatch();
  const listRef = useRef();

  const word_Pic = useSelector((state) => state.global.word_Pic);

  // console.log("data:", word_Pic);

  const [connected, setConnected] = useState(false);

  //to refresh when needed
  const [refreshing, setRefreshing] = useState(false);

  const checkNet = async () => {
    try {
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected && netInfo.isInternetReachable) {
        setConnected(true);
        dispatch(fetchData());
        await AsyncStorage.setItem("data", JSON.stringify(word_Pic));
      } else {
        setConnected(false);
        getStoreData();
      }
    } catch (er) {
      console.log(er);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      checkNet();
    });

    return unsubscribe;
  }, [navigation, dispatch]);

  const getStoreData = async () => {
    try {
      let data = await AsyncStorage.getItem("data");
      data = await JSON.parse(data);
      console.log(data);
      if (data) dispatch(setWordPic(data));
    } catch (error) {
      console.log(error);
    }
  };

  //create new array with all tasks and levels needed
  let count = 0;
  let allLevels = [];

  connected && word_Pic.length > 0
    ? word_Pic.forEach((el) => {
        el.gameName.forEach((game, i) => {
          count += 1;
          allLevels.push({
            taskNumber: count,
            gameName: game,
            done: el.done[i],
            word_Pic: el.data,
            taskId: el.taskId,
          });
        });
      })
    : null;

  !connected && word_Pic.length > 0
    ? word_Pic.forEach((el) => {
        el.gameName.forEach((game, i) => {
          if (el.done[i] === true) {
            count += 1;
            allLevels.push({
              taskNumber: count,
              gameName: game,
              done: el.done[i],
              word_Pic: el.data,
              taskId: el.taskId,
            });
          }
        });
      })
    : null;

  return (
    <ImageBackground
      style={styles.background}
      source={require("../../assets/backgrounds/tasksMap.png")}
      imageStyle={{ resizeMode: "stretch" }}
    >
      {/* settings button */}
      <TouchableOpacity
        style={styles.settingsIconContainer}
        onPress={() => {
          navigation.navigate("Settings");
        }}
      >
        <Ionicons name="md-settings-sharp" size={45} color="white" />
      </TouchableOpacity>

      {/* reload list button */}

      <TouchableOpacity
        style={styles.reloadIconContainer}
        onPress={() => {
          if (connected) {
            setRefreshing(true);
            dispatch(fetchData());
            setTimeout(() => {
              setRefreshing(false);
            }, 1000);
          } else {
            checkNet();
          }
        }}
      >
        <Ionicons name="reload" size={35} color="white" />
      </TouchableOpacity>

      <FlashList
        ref={listRef}
        data={allLevels}
        renderItem={({ item, index }) => {
          let imgSource =
            (index + 1) % 8 === 1
              ? require("../../assets/backgrounds/taskMapSplitted/taskMap1.png")
              : (index + 1) % 8 === 2
              ? require("../../assets/backgrounds/taskMapSplitted/taskMap2.png")
              : (index + 1) % 8 === 3
              ? require("../../assets/backgrounds/taskMapSplitted/taskMap3.png")
              : (index + 1) % 8 === 4
              ? require("../../assets/backgrounds/taskMapSplitted/taskMap4.png")
              : (index + 1) % 8 === 5
              ? require("../../assets/backgrounds/taskMapSplitted/taskMap5.png")
              : (index + 1) % 8 === 6
              ? require("../../assets/backgrounds/taskMapSplitted/taskMap6.png")
              : (index + 1) % 8 === 7
              ? require("../../assets/backgrounds/taskMapSplitted/taskMap7.png")
              : (index + 1) % 8 === 0
              ? require("../../assets/backgrounds/taskMapSplitted/taskMap8.png")
              : null;

          return (
            <ImageBackground
              source={imgSource}
              style={[styles.image, tw`justify-center `]}
              imageStyle={{
                resizeMode: "stretch",
              }}
              key={index}
            >
              {index === 0 ? (
                //first element
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(games[item.gameName], {
                      word_Pic: item.word_Pic,
                      taskId: item.taskId,
                    });
                  }}
                >
                  <Text style={[styles.text, { marginLeft: "45%" }]}>
                    {item.taskNumber}
                  </Text>
                </TouchableOpacity>
              ) : (
                //the rest elements
                <TouchableOpacity
                  disabled={!allLevels[index - 1].done ? true : false}
                  onPress={() => {
                    navigation.navigate(games[item.gameName], {
                      word_Pic: item.word_Pic,
                      taskId: item.taskId,
                    });
                  }}
                >
                  <Text
                    style={[
                      styles.text,
                      (index + 1) % 8 === 1 && { marginLeft: "45%" },
                      (index + 1) % 8 === 3 && { marginLeft: "40%" },
                      (index + 1) % 8 === 4 && { marginLeft: "30%" },
                      (index + 1) % 8 === 5 && { marginLeft: "25%" },
                      (index + 1) % 8 === 6 && { marginLeft: "-40%" },
                      (index + 1) % 8 === 0 && { marginLeft: "47%" },
                      !allLevels[index - 1].done && {
                        backgroundColor: "#929495",
                      },
                    ]}
                  >
                    {item.taskNumber}
                  </Text>
                </TouchableOpacity>
              )}
            </ImageBackground>
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              if (connected) {
                setRefreshing(true);
                dispatch(fetchData());
                setRefreshing(false);
              } else {
                checkNet();
              }
            }}
          />
        }
        estimatedItemSize={50}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#98F1F2",
    borderWidth: 10,
    borderColor: "#08f1F2",
  },
  background: {
    flex: 1,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  },
  text: {
    fontSize: 35,
    color: "#fff",
    fontWeight: "bold",
    width: 90,
    height: 100,
    textAlign: "center",
    textAlignVertical: "center",
    borderWidth: 7,
    borderColor: "#FFFFFF",
    borderRadius: 12.75,
    backgroundColor: "#05FF00",
  },
  image: {
    flex: 1,
    height: Dimensions.get("screen").height / 4,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsIconContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1000,
    borderWidth: 4,
    backgroundColor: "#05f600",
    borderRadius: 10,
    borderColor: "#eee",
    padding: 4,
  },
  reloadIconContainer: {
    position: "absolute",
    top: 90,
    left: 10,
    zIndex: 1000,
    borderWidth: 4,
    backgroundColor: "#05f600",
    borderRadius: 10,
    borderColor: "#eee",
    padding: 4,
  },
});
