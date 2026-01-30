import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch } from "react-redux";
import { logOut } from "../../../Redux/AuthSlice";
import { useTranslation } from "react-i18next";
import apiService from "../../../Redux/apiService";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";
import { API_BASE_URL } from "../../../config";
import { getAccessToken } from "../../../Redux/Storage";

const SETTINGS = [
  { id: "1", key: "notifications", icon: "notifications-outline" },
  { id: "2", key: "language", icon: "globe-outline" },
  { id: "3", key: "privacy", icon: "lock-closed-outline" },
  { id: "4", key: "help", icon: "help-circle-outline" },
];

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageNew, setProfileImageNew] = useState(null);

  /* ---------- PROFILE DATA ---------- */

  const accountDetails = profile
    ? [
        {
          id: "1",
          key: "phone",
          value: profile.phone || "-",
          icon: "call-outline",
        },
        {
          id: "2",
          key: "email",
          value: profile.emailId || "-",
          icon: "mail-outline",
        },
      ]
    : [];

  const fetchProfile = async () => {
    try {
      const res = await apiService.getProfileDetails();
      setProfile(res || null);
      
      let imageUri = null;
      if (res?.profileImage) {
        if (typeof res.profileImage === "object" && res.profileImage.url) {
          imageUri = res.profileImage.url;
        } else if (
          typeof res.profileImage === "string" &&
          res.profileImage !== "null" &&
          res.profileImage !== "undefined"
        ) {
          imageUri = res.profileImage;
        }
      }
      setProfileImage(imageUri);
    } catch (e) {
      console.log("Profile error:", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  /* ---------- IMAGE PICKER ---------- */

  const pickImage = async () => {
    launchImageLibrary(
      { mediaType: "photo", quality: 0.7, maxWidth: 400, maxHeight: 400, includeBase64: true },
      async (response) => {
        if (response.didCancel || response.errorCode) return;

        const asset = response.assets[0];
        setProfileImageNew(asset);
        setUploading(true);

        try {
          const token = await getAccessToken();

          const apiResponse = await fetch(
            `${API_BASE_URL}/api/user/update-profile`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                profileImage: `data:${asset.type};base64,${asset.base64}`,
              }),
            },
          );

          if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            throw new Error(
              errorData.message || `HTTP error! status: ${apiResponse.status}`,
            );
          }

          const data = await apiResponse.json();
          console.log("Upload successful:", data);

          setProfileImage(asset.uri);
          setProfileImageNew(null);
          await fetchProfile();
          Alert.alert("Success", "Profile image updated successfully");
        } catch (error) {
          console.error("Upload error:", error.message);
          Alert.alert("Error", error.message || "Failed to update profile");
        } finally {
          setUploading(false);
        }
      },
    );
  };

  /* ---------- LOGOUT ---------- */

  const logoutUser = () => {
    Alert.alert(
      t("logout"),
      t("profile.logout_confirm"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("logout"),
          style: "destructive",
          onPress: () => {
            dispatch(logOut());
          },
        },
      ]
    );
  };

  /* ---------- RENDERERS ---------- */

  const renderAccount = ({ item, index }) => (
    <View style={styles.row}>
      <View style={styles.iconBox}>
        <Icon name={item.icon} size={18} color="#F97316" />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.label}>
          {t(`profile.account.${item.key}`)}
        </Text>
        <Text style={styles.value}>{item.value}</Text>
      </View>
    </View>
  );

  const renderSetting = ({ item }) => (
    <TouchableOpacity style={styles.settingRow} activeOpacity={0.8}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Icon name={item.icon} size={18} color="#6B7280" />
        </View>
        <Text style={styles.settingText}>
          {t(`profile.settings.${item.key}`)}
        </Text>
      </View>
      <Icon name="chevron-forward-outline" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  /* ---------- UI ---------- */

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#F97316" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate("EditProfile")}
          activeOpacity={0.8}
        >
          <Icon name="create-outline" size={20} color="#fff" />
        </TouchableOpacity>

        <View
          style={styles.avatar}
          onPress={pickImage}
          activeOpacity={0.8}
        >
          {uploading ? (
            <ActivityIndicator color="#F97316" />
          ) : profileImageNew?.uri || profileImage ? (
            <Image
              source={{ uri: profileImageNew?.uri || profileImage }}
              style={styles.avatarImage}
            />
          ) : (
            <Icon name="person-outline" size={32} color="#F97316" />
          )}
        </View>
        <Text style={styles.name}>
          {profile?.firstName} {profile?.lastName}
        </Text>
        <Text style={styles.role}>{profile?.role}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* ACCOUNT */}
        <Text style={styles.sectionTitle}>
          {t("profile.account_details")}
        </Text>

        <View style={styles.card}>
          <FlatList
            data={accountDetails}
            keyExtractor={(item) => item.id}
            renderItem={renderAccount}
            ItemSeparatorComponent={() => (
              <View style={styles.separator} />
            )}
            scrollEnabled={false}
          />
        </View>

        {/* SETTINGS */}
        <Text style={styles.sectionTitle}>
          {t("profile.settings_title")}
        </Text>

        <View style={styles.card}>
          <FlatList
            data={SETTINGS}
            keyExtractor={(item) => item.id}
            renderItem={renderSetting}
            scrollEnabled={false}
          />
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={logoutUser}
        >
          <Text style={styles.logoutText}>
            {t("logout")}
          </Text>
        </TouchableOpacity>
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

  /* HEADER */
  header: {
    backgroundColor: "#F97316",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: "relative",
  },
  editBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFF7ED",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    overflow: "hidden",
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
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
    elevation: 2,
  },
  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  role: {
    color: "#FFE4C7",
    fontSize: 12,
    marginTop: 4,
  },

  /* CONTENT */
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    elevation: 2,
  },

  /* ROW */
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFEDD5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rowText: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
  },
  value: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111827",
  },
  separator: {
    height: 12,
  },

  /* SETTINGS */
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingText: {
    fontSize: 13,
    color: "#111827",
  },

  /* LOGOUT */
  logoutBtn: {
    backgroundColor: "#EF4444",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});

