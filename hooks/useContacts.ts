import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact, ContactFormData } from '../types/Contact';

const CONTACTS_STORAGE_KEY = '@contacts';

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  // Load contacts from AsyncStorage on app start
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const storedContacts = await AsyncStorage.getItem(CONTACTS_STORAGE_KEY);
      if (storedContacts) {
        const parsedContacts = JSON.parse(storedContacts);
        setContacts(parsedContacts);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveContacts = async (newContacts: Contact[]) => {
    try {
      await AsyncStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(newContacts));
      setContacts(newContacts);
    } catch (error) {
      console.error('Error saving contacts:', error);
    }
  };

  const addContact = async (contactData: ContactFormData) => {
    const newContact: Contact = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: contactData.name.trim(),
      phone: contactData.phone.trim(),
      email: contactData.email.trim(),
    };

    const updatedContacts = [...contacts, newContact];
    await saveContacts(updatedContacts);
    return newContact;
  };

  const updateContact = async (contactId: string, contactData: ContactFormData) => {
    const updatedContacts = contacts.map(contact =>
      contact.id === contactId
        ? {
            ...contact,
            name: contactData.name.trim(),
            phone: contactData.phone.trim(),
            email: contactData.email.trim(),
          }
        : contact
    );

    await saveContacts(updatedContacts);
    return updatedContacts.find(contact => contact.id === contactId);
  };

  const deleteContact = async (contactId: string) => {
    const updatedContacts = contacts.filter(contact => contact.id !== contactId);
    await saveContacts(updatedContacts);
  };

  const getContactById = (contactId: string): Contact | undefined => {
    return contacts.find(contact => contact.id === contactId);
  };

  return {
    contacts,
    loading,
    addContact,
    updateContact,
    deleteContact,
    getContactById,
    loadContacts,
  };
};
