import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import apiService from '../../../Redux/apiService';

const ScreenSixth = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  
  const [bankName, setBankName] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await apiService.getProfileDetails();
      const userData = response.data || response;
      
      if (userData) {
        setBankName(userData.bankName || "");
        setIfsc(userData.ifscCode || "");
        setAccountNumber(userData.accountNumber || "");
      }
    } catch (error) {
      console.error('Failed to fetch bank details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!bankName || !ifsc || !accountNumber) {
      Alert.alert("Error", "Please fill all bank details");
      return;
    }

    setLoading(true);
    try {
      const profileData = {
        bankName,
        ifscCode: ifsc.toUpperCase(),
        accountNumber
      };
      
      await apiService.UpdateProfileData(profileData);
      Alert.alert("Success", "Bank details updated successfully!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Update bank details error:', error);
      Alert.alert("Error", "Failed to update bank details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.stepText}>Documents</Text>
        </View>
      </View>

      {/* CARD */}
      <View style={styles.card}>
        <View style={styles.iconWrapper}>
          <Text style={styles.icon}>💳</Text>
        </View>

        <Text style={styles.cardTitle}>Bank Details</Text>
        <Text style={styles.cardSub}>Update your banking information</Text>

        <Text style={styles.label}>Bank Name</Text>
        <TextInput
          placeholder="Enter bank name"
          style={styles.input}
          value={bankName}
          onChangeText={setBankName}
        />

        <Text style={styles.label}>IFSC Code</Text>
        <TextInput
          placeholder="Enter IFSC code"
          style={styles.input}
          value={ifsc}
          onChangeText={setIfsc}
          autoCapitalize="characters"
        />

        <Text style={styles.label}>Account Number</Text>
        <TextInput
          placeholder="Enter account number"
          style={styles.input}
          value={accountNumber}
          onChangeText={setAccountNumber}
          keyboardType="numeric"
        />
      </View>

      {/* SAVE BUTTON */}
      <TouchableOpacity 
        style={[styles.continueBtn, loading && styles.continueBtnDisabled]} 
        onPress={handleUpdate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.continueText}>Save Changes</Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#F4F6F5',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EDEDED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 22,
    color: '#333',
    lineHeight: 22,
  },
  stepText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 18,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSub: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
    color: '#333',
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FAFAFA',
    fontSize: 14,
  },
  continueBtn: {
    backgroundColor: '#2E7D32',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  continueBtnDisabled: {
    opacity: 0.5,
  },
  continueText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default ScreenSixth;