
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { pick, types } from '@react-native-documents/picker';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { getAccessToken } from '../../../Redux/Storage';
import { API_BASE_URL } from '../../../config';
import Icon from 'react-native-vector-icons/Ionicons';

const ScreenSeventh = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [soilCard, setSoilCard] = useState(null);
  const [labReport, setLabReport] = useState(null);
  const [govDoc, setGovDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log("Base Url: ",API_BASE_URL)

  const pickDocument = async (setter) => {
    try {
      const result = await pick({
        type: [types.pdf, types.allFiles],
        allowMultiSelection: false,
      });
      
      const file = result[0];
      setter({
        uri: file.uri || file.fileCopyUri,
        name: file.name || file.fileName,
        type: file.type || file.mime,
        size: file.size,
      });
    } catch (error) {
      if (error.code === "DOCUMENT_PICKER_CANCELED") {
        return;
      } else {
        console.log('Picker error:', error);
        Alert.alert('Error', 'Failed to pick document');
      }
    }
  };

  const handleSave = async () => {
    if (!soilCard && !labReport && !govDoc) {
      Alert.alert('Error', 'Please upload at least one document');
      return;
    }

    setLoading(true);
    
    try {
      const token = await getAccessToken();
      const payload = {};
      
      if (soilCard) {
        const base64 = await ReactNativeBlobUtil.fs.readFile(soilCard.uri, 'base64');
        payload.soilHealthCard = `data:${soilCard.type || 'application/pdf'};base64,${base64}`;
      }
      
      if (labReport) {
        const base64 = await ReactNativeBlobUtil.fs.readFile(labReport.uri, 'base64');
        payload.labReport = `data:${labReport.type || 'application/pdf'};base64,${base64}`;
      }
      
      if (govDoc) {
        const base64 = await ReactNativeBlobUtil.fs.readFile(govDoc.uri, 'base64');
        payload.governmentDocument = `data:${govDoc.type || 'application/pdf'};base64,${base64}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/user/update-profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Upload failed: ${response.status}`);
      }
      
      Alert.alert('Success', 'Documents uploaded successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Upload error:', error.message);
      Alert.alert('Error', error.message || 'Failed to upload documents');
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
          <Text style={styles.stepText}>Document Upload</Text>
        </View>
      </View>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Upload Documents</Text>
        <Text style={styles.cardSub}>Upload your supporting documents (Optional)</Text>

        {/* Soil Health Card */}
        <View style={styles.uploadContainer}>
          <TouchableOpacity
            style={[styles.uploadBox, soilCard && styles.uploadBoxActive]}
            onPress={() => pickDocument(setSoilCard)}
          >
            <Text style={styles.uploadText}>
              {soilCard ? soilCard.name : 'Upload Soil Health Card'}
            </Text>
          </TouchableOpacity>
          {soilCard && (
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => setSoilCard(null)}
            >
              <Icon name="close-circle" size={20} color="#D32F2F" />
            </TouchableOpacity>
          )}
        </View>

        {/* Lab Report */}
        <View style={styles.uploadContainer}>
          <TouchableOpacity
            style={[styles.uploadBox, labReport && styles.uploadBoxActive]}
            onPress={() => pickDocument(setLabReport)}
          >
            <Text style={styles.uploadText}>
              {labReport ? labReport.name : 'Upload Lab Report'}
            </Text>
          </TouchableOpacity>
          {labReport && (
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => setLabReport(null)}
            >
              <Icon name="close-circle" size={20} color="#D32F2F" />
            </TouchableOpacity>
          )}
        </View>

        {/* Government Document */}
        <View style={styles.uploadContainer}>
          <TouchableOpacity
            style={[styles.uploadBox, govDoc && styles.uploadBoxActive]}
            onPress={() => pickDocument(setGovDoc)}
          >
            <Text style={styles.uploadText}>
              {govDoc ? govDoc.name : 'Upload Government Document'}
            </Text>
          </TouchableOpacity>
          {govDoc && (
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => setGovDoc(null)}
            >
              <Icon name="close-circle" size={20} color="#D32F2F" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* SAVE BUTTON */}
      <TouchableOpacity
        style={[styles.completeBtn, loading && styles.completeBtnDisabled]}
        disabled={loading}
        onPress={handleSave}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.completeText}>Save Documents</Text>
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSub: {
    fontSize: 12,
    color: '#666',
    marginBottom: 14,
  },
  uploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadBox: {
    flex: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#C8E6C9',
    borderRadius: 12,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  removeBtn: {
    marginLeft: 8,
    padding: 4,
  },
  uploadBoxActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
  },
  uploadText: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '600',
  },
  completeBtn: {
    backgroundColor: '#2E7D32',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  completeBtnDisabled: {
    opacity: 0.5,
  },
  completeText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default ScreenSeventh;
