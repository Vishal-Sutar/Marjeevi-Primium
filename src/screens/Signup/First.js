import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Images from '../../assets/Images/Images';
import { useTranslation } from 'react-i18next';
import { useLanguage } from "../../context/LanguageProvider";
import i18n from '../../i18n'; 

const First = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

 const languages = useMemo(
    () => [
      { id: "en", name: "English", sub: t("lang_en_sub") },
      { id: "hi", name: "हिंदी", sub: t("lang_hi_sub") },
    ],
    [t]
  );

  const handleLanguageSelect = async (code) => {
    setSelectedLanguage(code);      // UI state
     await i18n.changeLanguage(code);   // i18n global change
  };

  const handleNext = () => {
    if (selectedLanguage) {
      navigation.navigate('BuyAndSell');
    }
  };

  return (
    <View style={styles.container}>
      {/* ANIMATED TITLE */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <Text style={styles.title}>{t("welcome")}</Text>
        <Text style={styles.subTitle}>{t("select_language")}</Text>
      </Animated.View>

      {/* ANIMATED IMAGE */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Image
          source={Images.secondScreen}
          style={styles.mainImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* ANIMATED LANGUAGE OPTIONS */}
      {languages.map((language, index) => (
        <Animated.View
          key={language.id}
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateX: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [index % 2 === 0 ? -50 : 50, 0],
                }),
              },
            ],
          }}
        >
          <TouchableOpacity
            style={[
              styles.languageBox,
              selectedLanguage === language.id && styles.selectedLanguageBox,
            ]}
            onPress={() => handleLanguageSelect(language.id)}
            activeOpacity={0.7}
          >
            <View>
              <Text style={styles.languageText}>{language.name}</Text>
              <Text style={styles.languageSub}>{language.sub}</Text>
            </View>

            <View
              style={[
                styles.radioCircle,
                selectedLanguage === language.id && styles.selectedRadioCircle,
              ]}
            >
              {selectedLanguage === language.id && (
                <View style={styles.radioInnerCircle} />
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}

      {/* ANIMATED CONTINUE BUTTON */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <TouchableOpacity
          onPress={handleNext}
          style={[
            styles.continueBtn,
            !selectedLanguage && styles.disabledContinueBtn,
          ]}
          disabled={!selectedLanguage}
        >
          <Text
            style={[
              styles.continueText,
              !selectedLanguage && styles.disabledContinueText,
            ]}
          >
            {t("continue")}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default First;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9F1",
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 10,
    color: "#1FA637",
  },

  subTitle: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 20,
  },

  mainImage: {
    width: "100%",
    height: 220,
    alignSelf: "center",
    marginBottom: 25,
  },

  languageBox: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#CFCFCF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  selectedLanguageBox: {
    borderColor: "#1FA637",
    backgroundColor: "#F0F9F1",
    borderWidth: 3,
    elevation: 4,
  },

  languageText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  languageSub: {
    fontSize: 12,
    color: "gray",
    marginTop: 3,
  },

  radioCircle: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#CFCFCF",
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedRadioCircle: {
    borderColor: "#1FA637",
  },

  radioInnerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#1FA637",
  },

  continueBtn: {
    backgroundColor: "#1FA637",
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 20,
    elevation: 4,
    shadowColor: "#1FA637",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  disabledContinueBtn: {
    backgroundColor: "#E0E0E0",
  },

  continueText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  disabledContinueText: {
    color: "#9E9E9E",
  },
});
