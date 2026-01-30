import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Images from "../../assets/Images/Images";

const BuyAndSell = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleNext = () => {
        navigation.navigate('Getgovt')
      };
  return (
    <View style={styles.container}>
      {/* ANIMATED APP NAME */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <Text style={styles.appName}>Marjeevi Pragatisheel FPO</Text>
        <Text style={styles.subTitle}>{t("buy_sell_subtitle")}</Text>
      </Animated.View>

      {/* ANIMATED MAIN IMAGE CARD */}
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.cardTitle}>{t("buy_sell_title")}</Text>
        <Text style={styles.cardSubtitle}>{t("buy_sell_card_subtitle")}</Text>

        <Image
          source={Images.thirdScreen}
          style={styles.mainImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* DOT INDICATOR */}
      <Animated.View
        style={[
          styles.dotContainer,
          { opacity: fadeAnim },
        ]}
      >
        <View style={styles.dotActive} />
      </Animated.View>

      {/* ANIMATED NEXT BUTTON */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <TouchableOpacity onPress={() => handleNext()} style={styles.nextButton}>
          <Text style={styles.nextText}>{t("next")}</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* ANIMATED SKIP BUTTON */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity style={styles.skipButton} onPress={() => handleNext()}>
          <Text style={styles.skipText}>{t("skip")}</Text>
        </TouchableOpacity>
      </Animated.View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9F1",
    paddingHorizontal: 22,
    paddingTop: 40,
  },

  appName: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 5,
    color: "#1FA637",
  },

  subTitle: {
    textAlign: "center",
    marginTop: 6,
    marginBottom: 4,
    color: "#6B7280",
    fontSize: 14,
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: "center",
    marginTop: 25,
    elevation: 4,
    shadowColor: "#1FA637",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1FA637",
  },

  cardSubtitle: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
  },

  mainImage: {
    width: "100%",
    height: 250,
  },

  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },

  dotActive: {
    height: 8,
    width: 25,
    borderRadius: 5,
    backgroundColor: "black",
  },

  nextButton: {
    backgroundColor: "#1FA637",
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 25,
    elevation: 4,
    shadowColor: "#1FA637",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  nextText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  skipButton: {
    marginTop: 12,
  },

  skipText: {
    textAlign: "center",
    fontSize: 14,
    color: "gray",
  },
});

export default BuyAndSell;
