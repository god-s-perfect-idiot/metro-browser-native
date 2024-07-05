import { Text, TouchableWithoutFeedback, View } from "react-native";
import { fonts } from "../../styles/fonts";
import { useEffect, useState } from "react";

export const Select = ({
  options,
  onChange,
  title,
  classOverride = "",
  defaultValue,
}) => {
  const [selected, setSelected] = useState(options[0]);

  useEffect(() => {
    setSelected(options.find((option) => option.value === defaultValue));
    console.log("default value", defaultValue, options, selected);
  }, [defaultValue]);

  const [expanded, setExpanded] = useState(false);
  return (
    <View className={`flex ${classOverride}`}>
      <Text className="text-[#b0b0b0] text-[13px]" style={fonts.light}>
        {title}
      </Text>
      {expanded ? (
        <View className="bg-white mt-2 w-full py-2 pr-4 pl-2 text-base border-[#a013ec] border-2 border-solid justify-center item-center">
          {options.map((option, index) => {
            return (
              <TouchableWithoutFeedback
                key={index}
                onPress={async () => {
                  setSelected(option);
                  await onChange(option);
                  setExpanded(false);
                }}
              >
                <View
                  className={`flex flex-row items-center justify-between py-1`}
                >
                  <Text
                    className={`text-[15px] ${
                      selected.value === option.value
                        ? "text-[#a013ec]"
                        : "text-black"
                    }`}
                    style={fonts.regular}
                  >
                    {option.name}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>
      ) : (
        <View className="mt-2 w-full pr-4 pl-2 py-1 text-base border-white border-2 border-solid justify-center item-center">
          <TouchableWithoutFeedback onPress={() => setExpanded(true)}>
            <View className="flex flex-row items-center">
              <Text className="text-white text-[15px]" style={fonts.regular}>
                {selected.name}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      )}
    </View>
  );
};
