import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch } from "react-redux";
import { logOut } from "../../../Redux/AuthSlice";
import { useTranslation } from "react-i18next";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import apiService from "../../../Redux/apiService";
import { API_BASE_URL } from "../../../config";
import { launchImageLibrary } from "react-native-image-picker";
import { getAccessToken } from "../../../Redux/Storage";

const FarmerProfile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageNew, setProfileImageNew] = useState("");

  const MENU_ITEMS = [
    {
      id: 1,
      title: t("personal_details"),
      icon: "person-outline",
      screen: "PersonalDetails",
    },
    {
      id: 2,
      title: t("address_details"),
      icon: "location-outline",
      screen: "AddressDetails",
    },
    {
      id: 3,
      title: t("farmer_category"),
      icon: "leaf-outline",
      screen: "FarmerCategory",
    },
    {
      id: 4,
      title: t("crops_grown"),
      icon: "flower-outline",
      screen: "CropsGrown",
    },
    {
      id: 5,
      title: t("bank_details"),
      icon: "card-outline",
      screen: "ScreenSixth",
    },
    {
      id: 6,
      title: t("documents"),
      icon: "document-outline",
      screen: "ScreenSeventh",
    },
  ];

  console.log("Base Url: ", API_BASE_URL);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);

      const response = await apiService.getProfileDetails();

      const userData = response?.data || response;

      setUserDetails(userData);

      let imageUri = null;
      if (userData?.profileImage) {
        if (
          typeof userData.profileImage === "object" &&
          userData.profileImage.url
        ) {
          imageUri = userData.profileImage.url;
        } else if (
          typeof userData.profileImage === "string" &&
          userData.profileImage !== "null" &&
          userData.profileImage !== "undefined"
        ) {
          imageUri = userData.profileImage;
        }
      }

      setProfileImage(imageUri);
    } catch (error) {
      console.log("Fetch profile error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserDetails();
    }, []),
  );

  const pickImage = async () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.7,
        maxWidth: 400,
        maxHeight: 400,
        includeBase64: true,
      },
      async (response) => {
        if (response.didCancel || response.errorCode) return;

        const asset = response.assets[0];
        setProfileImageNew(asset);
        console.log({ asset });

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
          await fetchUserDetails();
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

  const logoutUser = async () => {
    try {
      await dispatch(logOut()).unwrap();
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileRow}>
            <TouchableOpacity style={styles.avatar} onPress={pickImage}>
              {uploading ? (
                <ActivityIndicator color="#fff" />
              ) : profileImageNew?.uri || profileImage ? (
                <Image
                  source={{ uri: profileImageNew?.uri || profileImage }}
                  style={styles.avatarImage}
                />
              ) : (
                <Icon name="person-outline" size={32} color="#fff" />
              )}
              <View style={styles.cameraIcon}>
                <Icon name="camera-outline" size={14} color="#4CAF50" />
              </View>
            </TouchableOpacity>

            <View style={styles.userInfo}>
              <Text style={styles.name}>
                {loading
                  ? "Loading..."
                  : `${userDetails?.firstName || ""} ${
                      userDetails?.lastName || ""
                    }`}
              </Text>
              <Text style={styles.phone}>
                {loading ? "Loading..." : `+91 ${userDetails?.phone || "N/A"}`}
              </Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{t("role_farmer")}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editText}>{t("edit")}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listWrapper}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIcon}>
                  <Icon name={item.icon} size={20} color="#4CAF50" />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              <Icon name="chevron-forward-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logoutUser}>
          <Icon name="log-out-outline" size={18} color="#E53935" />
          <Text style={styles.logoutText}> {t("logout")}</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

export default FarmerProfile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7F6" },
  header: {
    backgroundColor: "#4CAF50",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: { width: 72, height: 72, borderRadius: 36 },
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
  userInfo: { marginLeft: 16 },
  name: { fontSize: 18, fontWeight: "700", color: "#fff" },
  phone: { fontSize: 13, color: "#E8F5E9", marginTop: 2 },
  roleBadge: {
    marginTop: 6,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  roleText: { fontSize: 12, color: "#2E7D32", fontWeight: "600" },
  editBtn: {
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  editText: { color: "#fff", fontWeight: "600" },
  listWrapper: { paddingHorizontal: 16, marginTop: 20 },
  menuItem: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    elevation: 1,
  },
  menuLeft: { flexDirection: "row", alignItems: "center" },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuText: { fontSize: 14, fontWeight: "500", color: "#111827" },
  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: "#FDECEC",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  logoutText: { color: "#E53935", fontWeight: "700", fontSize: 14 },
});
