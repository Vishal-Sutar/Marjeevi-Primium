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
import Images from "../../assets/Images/Images";
import { useTranslation } from "react-i18next";


const Getgovt = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

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
    navigation.navigate('Roll');
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
        <Text style={styles.appName}>Kissan Parivar</Text>
        <Text style={styles.subTitle}>{t("get_govt_subtitle")}</Text>
      </Animated.View>

      {/* ANIMATED IMAGE CARD */}
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={Images.forthScreen}
          style={styles.mainImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* DOT INDICATOR */}
      <Animated.View style={[styles.dotContainer, { opacity: fadeAnim }]}>
        <View style={styles.dotInactive} />
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
        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('Roll')}>
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
    marginBottom: 20,
    color: "#6B7280",
    fontSize: 14,
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#1FA637",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  mainImage: {
    width: "100%",
    height: 260,
  },

  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 6,
  },

  dotInactive: {
    height: 7,
    width: 7,
    backgroundColor: "#C8C8C8",
    borderRadius: 10,
  },

  dotActive: {
    height: 7,
    width: 25,
    backgroundColor: "black",
    borderRadius: 10,
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

export default Getgovt;
