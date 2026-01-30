import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import apiService from "../../../Redux/apiService";

const EmptyState = ({ navigation }) => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIcon}>
      <Icon name="grass" size={60} color="#E0E0E0" />
    </View>
    <Text style={styles.emptyTitle}>No Crops Yet</Text>
    <Text style={styles.emptyText}>
      Start by adding your first crop to manage
    </Text>
    <TouchableOpacity
      style={styles.emptyButton}
      onPress={() => navigation.navigate("AddCrop")}
    >
      <Icon name="add" size={20} color="#fff" />
      <Text style={styles.emptyButtonText}>Add First Crop</Text>
    </TouchableOpacity>
  </View>
);

const MyCrops = ({ navigation }) => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCrops();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUserCropsByUserId();
      const cropsData = response?.data || [];
      
      // Extract farmName from farmId object if it exists
      const cropsWithFarmNames = cropsData.map((crop) => ({
        ...crop,
        farmName: crop.farmId?.farmName || crop.farmName || "Unknown Farm"
      }));
      
      setCrops(cropsWithFarmNames);
    } catch (error) {
      console.error("Fetch crops error:", error);
      Alert.alert("Error", "Failed to load crops");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cropId) => {
    Alert.alert(
      "Delete Crop",
      "Are you sure you want to delete this crop?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await apiService.deleteCropById(cropId);
              Alert.alert("Success", "Crop deleted successfully");
              fetchCrops();
            } catch (error) {
              Alert.alert("Error", "Failed to delete crop");
            }
          },
        },
      ]
    );
  };

  const renderCropCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("CropDetails", { cropId: item._id })}
      activeOpacity={0.9}
    >
      <View style={styles.cardIcon}>
        <Icon name="grass" size={28} color="#4CAF50" />
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cropName}>{item.cropName}</Text>
        <View style={styles.farmInfo}>
          <Icon name="location-on" size={14} color="#666" />
          <Text style={styles.farmName}>{item.farmName || "Unknown Farm"}</Text>
        </View>
        <Text style={styles.cropArea}>
          {item.area || "0"} {item.unit || "acre"}
        </Text>
      </View>
      
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={(e) => {
            e.stopPropagation();
            navigation.navigate("EditCrop", { crop: item });
          }}
        >
          <Icon name="edit" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={(e) => {
            e.stopPropagation();
            handleDelete(item._id);
          }}
        >
          <Icon name="delete" size={20} color="#f44336" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Crops</Text>
        <View style={styles.headerRight} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading your crops...</Text>
        </View>
      ) : (
        <FlatList
          data={crops}
          renderItem={renderCropCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={crops.length === 0 ? styles.emptyList : styles.listContainer}
          ListEmptyComponent={<EmptyState navigation={navigation} />}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddCrop")}
        activeOpacity={0.9}
      >
        <Icon name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FFF9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    paddingTop: StatusBar.currentHeight + 10 || 40,
    paddingBottom: 20,
    backgroundColor: "#4CAF50",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  headerRight: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: '500',
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#666",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  emptyButton: {
    flexDirection: 'row',
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  listContainer: {
    padding: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    elevation: 3,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cropName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B5E20",
    marginBottom: 4,
  },
  farmInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  farmName: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  cropArea: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
  },
  cardActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default MyCrops;