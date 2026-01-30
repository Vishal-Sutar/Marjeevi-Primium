import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { logOut } from "../../../Redux/AuthSlice";
import { useTranslation } from "react-i18next";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import apiService from "../../../Redux/apiService";
import Icon from "react-native-vector-icons/Ionicons";

/* ---------------- DUMMY DATA (API READY) ---------------- */


const FEATURES = [
  { id: "1", key: "field_crop_mapping", icon: "map-outline" },
  { id: "2", key: "schemes_subsidies", icon: "gift-outline" },
];


const SETTINGS = [
  { id: "1", key: "notifications", badge: "1" },
  { id: "2", key: "language", value: "English" },
  { id: "3", key: "privacy" },
  { id: "4", key: "help" },
];


/* ---------------- SCREEN ---------------- */

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation()
   const { t } = useTranslation();

  const [account, setAccount] = useState([]);
  const [features, setFeatures] = useState([]);
  const [settings, setSettings] = useState([]);
   const [profile, setProfile] = useState(null);

useEffect(() => {  
   setFeatures(FEATURES);
    setSettings(SETTINGS); }, 
    []);


const accountDetails = profile
  ? [
      {
        id: "1",
        label: "phone",
        value: profile?.phone,
        icon: "call-outline",
      },
      {
        id: "2",
        label: "email",
        value: profile?.emailId,
        icon: "mail-outline",
      },
      {
        id: "3",
        label: "shop",
        value: profile?.shopName,
        icon: "storefront-outline",
      },
    ]
  : [];

  
  /* ---------------- LOGOUT LOGIC ---------------- */

 const ProfileData = async () => {
  try {
    const response = await apiService.getProfileDetails();
    console.log("PROFILE RESPONSE 👉", response);

    if (response) {
      setProfile(response);
    } else {
      console.log("Profile response is null");
      setProfile(null);
    }
  } catch (error) {
    console.log("Profile API Error 👉", error);
  }
};

useFocusEffect(
  useCallback(() => {
    ProfileData();
  }, [])
);



const handleFeaturePress = (key) => {
  switch (key) {
    case "field_crop_mapping":
      navigation.navigate("FieldCropMapping");
      break;

    case "schemes_subsidies":
      navigation.navigate("SchemesSubsidies");
      break;
  }
};


  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(logOut()).unwrap();
            } catch (error) {
              console.error("Logout failed:", error);
            }
          },
        },
      ]
    );
  };

  /* ---------------- AVATAR LOGIC ---------------- */

  const renderAvatar = () => {
    if (profile.profileImage) {
      return (
        <Image
          source={{ uri: profile.profileImage }}
          style={styles.avatar}
        />
      );
    }

    return (
      <View style={styles.avatarFallback}>
        <Text style={styles.avatarLetter}>
          {profile.name.charAt(0).toUpperCase()}
        </Text>
      </View>
    );
  };

  /* ---------------- RENDERERS ---------------- */

const renderAccount = ({ item }) => (
  <View style={styles.accountRow}>
    <Icon name={item.icon} size={18} color="#2563EB" style={styles.accountIcon} />

    <View>
      <Text style={styles.accountLabel}>
        {t(`profile.account.${item.label}`)}
      </Text>

      <Text style={styles.accountValue}>
        {item.value || "-"}
      </Text>
    </View>
  </View>
);


  const renderFeature = useCallback(({ item }) => (
  <TouchableOpacity
    style={styles.featureCard}
    activeOpacity={0.8}
    onPress={() => handleFeaturePress(item.key)}
  >
    <Icon name={item.icon} size={22} color="#2563EB" style={styles.featureIcon} />

    <View style={{ flex: 1 }}>
      <Text style={styles.featureTitle}>
        {t(`profile.features.${item.key}.title`)}
      </Text>
      <Text style={styles.featureSub}>
        {t(`profile.features.${item.key}.sub`)}
      </Text>
    </View>

    <Icon name="chevron-forward" size={20} color="#9CA3AF" />
  </TouchableOpacity>
), []);


 const renderSetting = useCallback(({ item }) => (
  <TouchableOpacity
    style={styles.settingRow}
    activeOpacity={0.8}
  >
    <Text style={styles.settingText}>
      {t(`profile.settings.${item.key}`)}
    </Text>

    <View style={styles.settingRight}>
      {item.value && (
        <Text style={styles.settingValue}>{item.value}</Text>
      )}

      {item.badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      )}

      <Icon name="chevron-forward" size={20} color="#9CA3AF" />
    </View>
  </TouchableOpacity>
), []);


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
      {/* HEADER */}
<View style={styles.header}>
  <View style={styles.profileRow}>
    {/* AVATAR */}
    <View
      activeOpacity={0.8}
      style={styles.avatar}
      onPress={() => console.log("Change photo")}
    >
      {profile?.profileImage ? (
        <Image
          source={{
            uri:
              typeof profile.profileImage === "object"
                ? profile.profileImage.url
                : profile.profileImage,
          }}
          style={styles.avatarImage}
        />
      ) : (
        <Text style={styles.avatarLetter}>
          {profile?.firstName?.charAt(0).toUpperCase() || "U"}
        </Text>
      )}
    </View>

    {/* USER INFO */}
    <View style={styles.userInfo}>
      <Text style={styles.name}>{profile?.firstName} {profile?.lastName} </Text>
      <Text style={styles.phone}>+91{profile?.phone}</Text>

      <View style={styles.roleBadge}>
        <Text style={styles.roleText}> {t(`roles.${profile?.role.toLowerCase()}`)}</Text>
      </View>
    </View>
  </View>

  {/* EDIT BUTTON */}
  <TouchableOpacity
    style={styles.editBtn}
    activeOpacity={0.8}
    // onPress={() => navigation.navigate('UpdateProfile')}
    onPress={() =>
  navigation.navigate("UpdateProfile", {
    profileData: profile, // ✅ MUST exist
  })
}
  >
    <Text style={styles.editText}> {t("profile.edit")}</Text>
  </TouchableOpacity>
</View>


        <View style={styles.container}>
          {/* ACCOUNT DETAILS */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}> {t("profile.account_details")}</Text>
            <FlatList
  data={accountDetails}
  keyExtractor={(item) => item.id}
  renderItem={renderAccount}
  scrollEnabled={false}
/>

          </View>

          {/* FEATURES */}
          <FlatList
            data={features}
            keyExtractor={(item) => item.id}
            renderItem={renderFeature}
            scrollEnabled={false}
          />

          {/* SETTINGS */}
          <View style={styles.settingsCard}>
            <FlatList
              data={settings}
              keyExtractor={(item) => item.id}
              renderItem={renderSetting}
              scrollEnabled={false}
            />
          </View>

          {/* LOGOUT BUTTON */}
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.8}
            onPress={handleLogout}
          >
            <Icon name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutButtonText}>{t("profile.settings.logout")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  scrollContent: {
    paddingBottom: 30,
    backgroundColor: "#F7F9FC",
  },

header: {
  backgroundColor: "#2563EB",
  paddingTop: 20,
  paddingBottom: 20,
  paddingHorizontal: 16,
  borderBottomLeftRadius: 30,
  borderBottomRightRadius: 30,
},

profileRow: {
  flexDirection: "row",
  alignItems: "center",
},

avatar: {
  width: 72,
  height: 72,
  borderRadius: 36,
  backgroundColor: "rgba(255,255,255,0.3)",
  justifyContent: "center",
  alignItems: "center",
},

avatarImage: {
  width: 72,
  height: 72,
  borderRadius: 36,
},

avatarLetter: {
  fontSize: 32,
  fontWeight: "700",
  color: "#fff",
},

cameraIcon: {
  position: "absolute",
  bottom: -2,
  right: -2,
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor: "#fff",
  justifyContent: "center",
  alignItems: "center",
  elevation: 3,
},

userInfo: {
  marginLeft: 16,
},

name: {
  fontSize: 18,
  fontWeight: "700",
  color: "#fff",
},

phone: {
  fontSize: 13,
  color: "#E8F5E9",
  marginTop: 2,
},

roleBadge: {
  marginTop: 6,
  backgroundColor: "#E8F5E9",
  paddingHorizontal: 10,
  paddingVertical: 3,
  borderRadius: 12,
  alignSelf: "flex-start",
},

roleText: {
  fontSize: 12,
  color: "#2E7D32",
  fontWeight: "600",
},

editBtn: {
  marginTop: 16,
  backgroundColor: "rgba(255,255,255,0.25)",
  paddingVertical: 10,
  borderRadius: 12,
  alignItems: "center",
},

editText: {
  color: "#fff",
  fontWeight: "600",
},

 
  container: {
    backgroundColor: "#F7F9FC",
    padding: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontWeight: "600",
    marginBottom: 10,
  },

  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  accountIcon: {
    marginRight: 10,
  },
  accountLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  accountValue: {
    fontSize: 13,
    fontWeight: "500",
  },

  featureCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
  },
  featureIcon: {
    marginRight: 12,
  },
  featureTitle: {
    fontWeight: "600",
  },
  featureSub: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },

  settingsCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginTop: 12,
    elevation: 2,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  settingText: {
    fontSize: 13,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingValue: {
    fontSize: 12,
    color: "#6B7280",
    marginRight: 6,
  },

  badge: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 6,
    borderRadius: 10,
    marginRight: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
  },

  logoutButton: {
    backgroundColor: "#DC2626",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 14,
    marginTop: 16,
    elevation: 2,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});