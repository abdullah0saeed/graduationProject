import { ImageBackground, TouchableOpacity, Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRoute } from "@react-navigation/native";

import Avatar from "../components/Avatar";
import { sendAttempts } from "../store/globalSlice";
import { soundEffects } from "../modules";

const any = [
  {
    _id: 0,
    num1: 10,
    num2: 3,
    operator: "*",
    choices: [12, 28, 30],
  },
  {
    _id: 1,
    num1: 4,
    num2: 54,
    operator: "+",
    choices: [52, 58, 20],
  },
  {
    _id: 2,
    num1: 28,
    num2: 3,
    operator: "-",
    choices: [25, 38, 97],
  },
  {
    _id: 3,
    num1: 9,
    num2: 3,
    operator: "/",
    choices: [46, 234, 3],
  },
];

export default function Sum_Sub({ navigation }) {
  const dispatch = useDispatch();
  const route = useRoute();

  const { taskId } = route.params;
  const data = route.params.word_Pic;
  // console.log(data);

  //to store data array length
  const dataLength = data.length;

  //to store how many objects of data is already done
  const [done, setDone] = useState(0);

  //to store the chosen answer
  const [chosenAns, setChosenAns] = useState(null);

  //to edit styles if correct or not
  const [correct, setCorrect] = useState(false);

  //to store wrong attempts
  const [attempts, setAttempts] = useState([]);

  //to store wrong count
  const [wrong, setWrong] = useState(0);

  ///refresh on navigating back from Score screen///\\\\
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setDone(0);
      setChosenAns(null);
      setCorrect(false);
      setAttempts([]);
      setWrong(0);
    });
    return unsubscribe;
  }, [navigation]);

  ///handel press function
  const handelPress = async (choice) => {
    const num1 = parseInt(data[done].numbers.num1);
    const num2 = parseInt(data[done].numbers.num2);
    const op = data[done].numbers.operator;
    let answer = 0;

    //calculate the right answer
    op == "+"
      ? (answer = num1 + num2)
      : op == "-"
      ? (answer = num1 - num2)
      : op == "*" || op == "x" || op == "X"
      ? (answer = num1 * num2)
      : op == "/"
      ? (answer = num1 / num2)
      : (answer = null);

    setChosenAns(choice);

    if (choice == answer) {
      setCorrect(true);
      if (done !== data.length - 1) {
        soundEffects(0);
        setTimeout(() => {
          setChosenAns(null);
          setDone(done + 1);
        }, 600);
      } else {
        soundEffects(2);

        //to send feedback
        let sentData = {};
        data?.forEach((el, i) => {
          sentData[`data${i + 1}Attempts`] =
            attempts[i] !== (null || undefined) ? attempts[i] : 0;
        });
        dispatch(sendAttempts({ sentData, gameId: "4", taskId }));

        setTimeout(() => {
          navigation.replace("Score", {
            wrong,
            word_Pic: data,
            path: "Sum_Sub",
          });
        }, 1600);
      }
    } else {
      setCorrect(false);
      soundEffects(1);

      setWrong(wrong + 1);

      //edit the wrong attempts array
      let inCorrect = attempts;
      if (inCorrect[done] == null) {
        inCorrect[done] = 1;
      } else {
        inCorrect[done] = inCorrect[done] + 1;
      }
      setAttempts(inCorrect);

      setTimeout(() => {
        setChosenAns(null);
      }, 400);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/backgrounds/sum_sub-bg.png")}
      style={[{ flex: 1 }, tw`justify-center`]}
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
          {/* show question */}
          <View
            style={[
              { transform: [{ rotate: "90deg" }], top: "45%", right: "-23%" },
              tw`absolute  flex flex-row `,
            ]}
          >
            <View style={[tw`w-3/12`]}>
              <Text
                style={[
                  tw`text-4xl font-bold text-white text-center w-full`,
                  // { fontFamily: "finger-paint" },
                ]}
              >
                {data[done].numbers.num1}
              </Text>
            </View>
            <View style={[tw`w-1/12`]}>
              <Text style={[tw`text-4xl font-bold text-white text-center`]}>
                {data[done].numbers.operator === "*"
                  ? "x"
                  : data[done].numbers.operator}
              </Text>
            </View>
            <View style={[tw`w-3/12`]}>
              <Text style={[tw`text-4xl font-bold text-white text-center`]}>
                {data[done].numbers.num2}
              </Text>
            </View>
            <View style={[tw`w-1/12`]}>
              <Text style={[tw`text-4xl font-bold text-white text-center`]}>
                =
              </Text>
            </View>
            <View
              style={[
                tw`w-4/12 flex justify-center items-center rounded-md`,
                { backgroundColor: "rgba(0, 0, 0, 0.53)" },
              ]}
            >
              <Text
                style={[
                  tw`text-4xl font-bold text-white w-full text-center pt-1`,
                  chosenAns !== null &&
                    !correct &&
                    tw`bg-red-400 border-2 border-red-500 rounded-md text-black`,
                  chosenAns !== null &&
                    correct &&
                    tw`bg-green-400 border-2 border-green-500 rounded-md text-black`,
                ]}
              >
                {chosenAns === null ? "?" : chosenAns}
              </Text>
            </View>
          </View>
          {/* show choices */}
          <View
            style={[
              {
                transform: [{ rotate: "90deg" }],
                top: "41%",
                right: "13%",
                height: "15%",
              },
              tw`absolute  flex flex-row`,
            ]}
          >
            <TouchableOpacity
              style={[
                tw`w-1/3 flex justify-center items-center mr-2 rounded-xl shadow-xl`,
                { backgroundColor: "#F5F5FD" },
              ]}
              onPress={() => {
                handelPress(data[done].choices[0]);
              }}
            >
              <Text
                style={[
                  tw`text-4xl font-bold text-white text-center text-black`,
                ]}
              >
                {data[done].choices[0]}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                tw`w-1/3 flex justify-center items-center rounded-xl shadow-xl`,
                { backgroundColor: "#F5F5FD" },
              ]}
              onPress={() => {
                handelPress(data[done].choices[1]);
              }}
            >
              <Text
                style={[
                  tw`text-4xl font-bold text-white text-center text-black`,
                ]}
              >
                {data[done].choices[1]}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                tw`w-1/3 flex justify-center items-center ml-2 rounded-xl shadow-xl`,
                { backgroundColor: "#F5F5FD" },
              ]}
              onPress={() => {
                handelPress(data[done].choices[2]);
              }}
            >
              <Text
                style={[
                  tw`text-4xl font-bold text-white text-center text-black`,
                ]}
              >
                {data[done].choices[2]}
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </ImageBackground>
  );
}
