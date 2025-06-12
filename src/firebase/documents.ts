import { db } from './config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { ExtractedData } from '@/utils/textParser';

export interface DocumentData extends ExtractedData {
  id?: string;
  userId: string;
  timestamp: string;
  documentType: string;
  originalText?: string;
}

export const saveDocument = async (data: Omit<DocumentData, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'documents'), data);
    return docRef.id;
  } catch (error) {
    console.error('Error saving document:', error);
    throw new Error('Failed to save document');
  }
};

export const getUserDocuments = async (userId: string): Promise<DocumentData[]> => {
  try {
    const q = query(
      collection(db, 'documents'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as DocumentData));
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw new Error('Failed to fetch documents');
  }
};

export const deleteDocument = async (documentId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'documents', documentId));
  } catch (error) {
    console.error('Error deleting document:', error);
    throw new Error('Failed to delete document');
  }
};

export const updateDocument = async (documentId: string, data: Partial<DocumentData>): Promise<void> => {
  try {
    const docRef = doc(db, 'documents', documentId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error updating document:', error);
    throw new Error('Failed to update document');
  }
}; 