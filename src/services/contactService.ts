import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  Timestamp 
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Message } from "../types";

const COLLECTION_NAME = "messages";

export async function getMessages(): Promise<Message[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      let dateVal = data.createdAt;
      if (dateVal && typeof dateVal.toDate === "function") {
        dateVal = dateVal.toDate();
      } else if (dateVal && dateVal.seconds) {
        dateVal = new Date(dateVal.seconds * 1000);
      } else {
        dateVal = new Date(dateVal);
      }
      return {
        id: doc.id,
        name: data.name || "",
        email: data.email || "",
        subject: data.subject || "",
        message: data.message || "",
        createdAt: dateVal,
        read: data.read ?? false
      };
    });
  } catch (err) {
    console.error("Error retrieving messages:", err);
    return [];
  }
}

export async function addMessage(message: Omit<Message, 'id' | 'createdAt' | 'read'>): Promise<string> {
  const colRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(colRef, {
    ...message,
    read: false,
    createdAt: Timestamp.fromDate(new Date())
  });
  return docRef.id;
}

export async function markMessageRead(id: string, read: boolean = true): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, { read });
}

export async function deleteMessage(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
