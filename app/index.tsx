import * as React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Contact, ContactFormData } from '../types/Contact';
import { ContactListItem } from '../components/ContactListItem';
import { ContactForm } from '../components/ContactForm';
import { useContacts } from '../hooks/useContacts';

export default function ContactManager() {
  const {
    contacts,
    loading,
    addContact,
    updateContact,
    deleteContact,
  } = useContacts();

  const [showForm, setShowForm] = React.useState(false);
  const [editingContact, setEditingContact] = React.useState<Contact | null>(null);

  const handleAddContact = () => {
    setEditingContact(null);
    setShowForm(true);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleSaveContact = async (contactData: ContactFormData) => {
    try {
      if (editingContact) {
        await updateContact(editingContact.id, contactData);
        Alert.alert('Thành công', 'Liên hệ đã được cập nhật!');
      } else {
        await addContact(contactData);
        Alert.alert('Thành công', 'Liên hệ mới đã được thêm!');
      }
      setShowForm(false);
      setEditingContact(null);
    } catch {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi lưu liên hệ!');
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      await deleteContact(contactId);
      Alert.alert('Thành công', 'Liên hệ đã được xóa!');
    } catch {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi xóa liên hệ!');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingContact(null);
  };

  const renderContactItem = ({ item }: { item: Contact }) => (
    <ContactListItem
      contact={item}
      onPress={handleEditContact}
      onDelete={handleDeleteContact}
    />
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Chưa có liên hệ nào</Text>
      <Text style={styles.emptySubtitle}>
        Nhấn nút &quot;Thêm mới&quot; để tạo liên hệ đầu tiên
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Danh bạ</Text>
        <Text style={styles.subtitle}>
          {contacts.length} liên hệ
        </Text>
      </View>

      <FlatList
        data={contacts}
        renderItem={renderContactItem}
        keyExtractor={(item: Contact) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddContact}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <ContactForm
        visible={showForm}
        contact={editingContact}
        onSave={handleSaveContact}
        onCancel={handleCancelForm}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
});
