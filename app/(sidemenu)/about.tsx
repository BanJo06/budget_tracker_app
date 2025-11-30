import React from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
  View,
} from "react-native";

const About = () => {
  const theme = useColorScheme();
  const isDark = theme === "dark";

  return (
    <View className="flex-1 bg-bgPrimary-light dark:bg-bgPrimary-dark">
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* Header / Top Section */}
      <View className="items-center justify-center pt-16 pb-8 mb-6">
        <Image
          source={require("@/assets/images/icon.png")} // Update this path to your actual file location
          className="w-24 h-24 rounded-2xl mb-4 shadow-xl"
          resizeMode="cover"
        />

        <Text className="text-2xl font-bold text-textPrimary-light dark:text-textPrimary-dark">
          PeraPal
        </Text>
        <Text className="text-textSecondary-light dark:text-textSecondary-dark mt-1 opacity-65">
          Version 0.42.2
        </Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <Text className="text-sm font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-3 uppercase tracking-wider ml-1">
          About the app
        </Text>
        <View className="overflow-hidden">
          <Text className="text-justify text-textPrimary-light dark:text-textPrimary-dark">
            <Text className="font-bold">
              PeraPal: Gamified Budget Tracking App
            </Text>{" "}
            is a capstone project developed by{" "}
            <Text className="font-bold">
              Vanne Joed T. Maranan, Christian L. Dela Sada, Marinela S. De
              Leon, and Charles Jefferson R. Icaonapo
            </Text>
            , a team of BSIT students from STI College Tanay.
          </Text>
          <Text className="text-justify text-textPrimary-light dark:text-textPrimary-dark">
            Our mission is to transform personal finance from a tedious chore
            into a rewarding habit. Recognizing that traditional budgeting tools
            often lack motivation, we designed PeraPal to combine robust expense
            tracking with engaging game mechanics. By integrating a quest-based
            system, virtual rewards, and an offline-first architecture, we aim
            to help users build consistent financial discipline and improve
            their financial awareness in a fun, interactive way.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default About;
