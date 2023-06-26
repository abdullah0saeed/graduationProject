import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchData, setAvatar } from "../store/globalSlice";
import {
  View,
  Text,
  Image,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Dimensions,
} from "react-native";
import styles from "../styles";
import tw from "tailwind-react-native-classnames";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";
import Avatar from "../components/Avatar";

const Start = ({ navigation }) => {
  // ////////////////////////// fetch data from API/////////////////////////////
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  const animation = useRef(null);

  //to get avatar from global slice
  const avatar = useSelector((state) => state.global.avatar);

  const { word_Pic } = useSelector((state) => state.global);
  //navigate to the game screen
  // const handelOnPress = () => {
  //   navigation.navigate("Connect");
  // };

  //to change lArrow backgroundColor
  const [lArrow, setLArrow] = useState(false);

  //to change rArrow backgroundColor
  const [rArrow, setRArrow] = useState(false);

  ///function to play sound\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  const playSound = async (voice) => {
    const sound = new Audio.Sound();
    try {
      await sound.loadAsync(voice);
      await sound
        .playAsync()
        .then(async (playbackStatus) => {
          setTimeout(() => {
            sound.unloadAsync();
          }, playbackStatus.playableDurationMillis);
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };
  //////////////////////////////////////////////////////////////////

  useEffect(() => {
    playSound(require("../../assets/sounds/spongebob.wav"));
  }, []);

  ///to store avatars
  const avatars = [
    "https://assets2.lottiefiles.com/packages/lf20_lc46h4dr.json",
    "https://assets6.lottiefiles.com/packages/lf20_s4tubmwg.json",
    "https://assets6.lottiefiles.com/packages/lf20_KEahK5k9Mf.json",
  ];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container, tw``]}>
        {/*************** avatar part **************/}
        <View
          style={[
            {
              transform: [{ rotate: "90deg" }],
              height: Dimensions.get("window").width,
            },
            tw`w-11/12 absolute right-8 top-0`,
          ]}
        >
          <Text style={[tw`text-xl font-bold text-white`]}>
            Choose your favorite Avatar
          </Text>
        </View>
        <View
          style={[
            { transform: [{ rotate: "90deg" }] },
            tw`w-6/12 h-2/6 absolute top-7`,
          ]}
        >
          {/** to show arrows **/}
          {/* left arrow */}
          <Pressable
            style={[
              {
                width: "20%",
                height: "15.8%",
                position: "absolute",
                top: "50%",
                left: "-1%",
              },
              tw`z-40`,
              lArrow && tw`bg-blue-500 rounded-2xl`,
            ]}
            onPress={(e) => {
              setLArrow(true);
              if (avatars.indexOf(avatar) !== 0) {
                dispatch(setAvatar(avatars[avatars.indexOf(avatar) - 1]));
              }
              setTimeout(() => {
                setLArrow(false);
              }, 100);
            }}
          >
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/2985/2985162.png",
              }}
              style={tw`w-full h-full`}
            />
          </Pressable>

          {/* right arrow */}
          <Pressable
            style={[
              {
                width: "20%",
                height: "15.8%",
                position: "absolute",
                top: "50%",
                right: "-23%",
              },
              tw`z-40`,
              rArrow && tw`bg-blue-500 rounded-2xl`,
            ]}
            onPress={() => {
              setRArrow(true);
              if (avatars.indexOf(avatar) !== avatars.length - 1) {
                dispatch(setAvatar(avatars[avatars.indexOf(avatar) + 1]));
              }
              setTimeout(() => {
                setRArrow(false);
              }, 100);
            }}
          >
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/2985/2985162.png",
              }}
              style={[
                { transform: [{ rotate: "180deg" }] },
                tw`w-full h-full `,
              ]}
            />
          </Pressable>

          <View
            style={[{ height: 0.75 * Dimensions.get("window").width }, tw``]}
          >
            {/* component to show the avatar */}
            <Avatar />

            {/* to show the circle around avatar */}
            <View style={tw`h-full `}>
              <LottieView
                autoPlay
                ref={animation}
                onLoad={() => {
                  animation.current.play();
                }}
                style={[
                  { marginTop: "-65%", marginLeft: "-5%", width: "120%" },
                  tw``,
                ]}
                // Find more Lottie files at https://lottiefiles.com/featured
                source={{
                  uri: "https://assets9.lottiefiles.com/packages/lf20_agxjuzgt.json",
                }}
              />
            </View>
          </View>
        </View>
        {/************************************************************************************/}
        {/*************** games part **************/}
        <View
          style={[
            {
              transform: [{ rotate: "90deg" }],
              height: Dimensions.get("window").width,
            },
            tw`w-11/12 mt-10 absolute right-8 bottom-4 flex items-center`,
          ]}
        >
          <Text style={[tw`text-xl font-bold text-white`]}>
            Choose your favorite game
          </Text>
        </View>
        {/* to show list of available games */}
        <ScrollView
          style={[
            {
              transform: [{ rotate: "90deg" }],
              maxHeight: 0.75 * Dimensions.get("window").width,
              backgroundColor: "#36d4ff",
              borderColor: "#3694ff",
            },
            tw`w-11/12  absolute right-6 bottom-14 rounded-lg border-2`,
          ]}
        >
          <Pressable
            style={[styles.pressable, tw`self-center`]}
            onPress={() => {
              navigation.navigate("Connect");
            }}
          >
            {/* <Image
            source={require("../../assets/game1.jpg")}
            style={styles.avatar}
          /> */}
            <Text style={{ fontSize: 35, fontWeight: "bold" }}>Connect</Text>
          </Pressable>
          <Pressable
            style={[styles.pressable, tw`self-center`]}
            onPress={() => {
              navigation.navigate("Missing-Word");
            }}
          >
            <Text style={{ fontSize: 35, fontWeight: "bold" }}>
              Missing-Word
            </Text>
          </Pressable>
          <Pressable
            style={[styles.pressable, tw`self-center`]}
            onPress={() => {
              navigation.navigate("Listen_Choose");
            }}
          >
            <Text style={{ fontSize: 35, fontWeight: "bold" }}>
              Listen_Choose
            </Text>
          </Pressable>
          <Pressable
            style={[styles.pressable, tw`self-center`]}
            onPress={() => {
              navigation.navigate("Compare");
            }}
          >
            <Text style={{ fontSize: 35, fontWeight: "bold" }}>Compare</Text>
          </Pressable>
          <Pressable
            style={[styles.pressable, tw`self-center`]}
            onPress={() => {
              navigation.navigate("Sum_Sub");
            }}
          >
            <Text style={{ fontSize: 35, fontWeight: "bold" }}>Sum_Sub</Text>
          </Pressable>
          <Pressable
            style={[styles.pressable, tw`self-center`]}
            onPress={() => {
              navigation.navigate("Arrange");
            }}
          >
            <Text style={{ fontSize: 35, fontWeight: "bold" }}>Arrange</Text>
          </Pressable>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Start;
