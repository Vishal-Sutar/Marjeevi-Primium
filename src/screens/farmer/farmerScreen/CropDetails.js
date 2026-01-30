import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView,
  SafeAreaView,
  StatusBar
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import apiService from "../../../Redux/apiService";

const CropDetails = ({ route, navigation }) => {
  const { cropId } = route.params;
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCropDetails = async () => {
      try {
        const response = await apiService.getUserCropsByUserId();
        const foundCrop = response?.data?.find(c => c._id === cropId);
        setCrop({
          ...foundCrop,
          farmName: foundCrop?.farmId?.farmName || foundCrop?.farmName || "Unknown Farm"
        });
      } catch (error) {
        console.error("Fetch crop details error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCropDetails();
  }, [cropId]);

  const calculateCropAge = (sowingDate) => {
    if (!sowingDate) return "0 days";
    const sowing = new Date(sowingDate);
    const today = new Date();
    const diffTime = Math.abs(today - sowing);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>My Crop</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cropHeaderCard}>
          <Text style={styles.cropName}>{crop?.cropName}</Text>
          <View style={styles.farmInfo}>
            <Icon name="location-on" size={16} color="#4CAF50" />
            <Text style={styles.farmName}>{crop?.farmName}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Icon name="square-foot" size={28} color="#2E7D32" style={styles.statIcon} />
            <Text style={styles.statValue}>{crop?.area || "0"} {crop?.unit || "acre"}</Text>
            <Text style={styles.statLabel}>Area</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="event" size={28} color="#2E7D32" style={styles.statIcon} />
            <Text style={styles.statValue}>
              {crop?.sowingDate ? new Date(crop.sowingDate).toLocaleDateString() : "N/A"}
            </Text>
            <Text style={styles.statLabel}>Sowing Date</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="calendar-today" size={28} color="#2E7D32" style={styles.statIcon} />
            <Text style={styles.statValue}>{calculateCropAge(crop?.sowingDate)}</Text>
            <Text style={styles.statLabel}>Crop Age</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FFF9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FFF9',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: StatusBar.currentHeight + 10 || 40,
    paddingBottom: 20,
    backgroundColor: '#4CAF50',
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
  content: {
    padding: 20,
  },
  cropHeaderCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
    backgroundColor: '#E8F5E9',
    elevation: 3,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cropName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1B5E20",
    marginBottom: 8,
  },
  farmInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  farmName: {
    fontSize: 16,
    color: "#388E3C",
    marginLeft: 5,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statCard: {
    width: '48%',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: '#F0FFF4',
    elevation: 2,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B5E20",
    marginBottom: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: "#66BB6A",
    fontWeight: '500',
  },
});

export default CropDetails;