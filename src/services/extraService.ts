import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  Timestamp 
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Certificate, GalleryItem } from "../types";

// Dynamic Certificates DB
const CERTS_COLLECTION = "certificates";
const GALLERY_COLLECTION = "gallery";

const defaultCertificates: Omit<Certificate, 'id'>[] = [
  {
    title: "Google Cloud Certified Associate Cloud Engineer",
    issuer: "Google Cloud",
    issueDate: "Feb 2026",
    credentialUrl: "https://www.credential.net/example-gcp-engineer",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80"
  },
  {
    title: "Meta Front-End Developer Professional Certificate",
    issuer: "Meta / Coursera",
    issueDate: "Oct 2025",
    credentialUrl: "https://coursera.org/verify/example-meta-frontend",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=80"
  },
  {
    title: "Advanced React & TypeScript Architect",
    issuer: "Frontend Masters",
    issueDate: "Aug 2025",
    credentialUrl: "https://frontendmasters.com/certificates/react-ts-arch",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80"
  }
];

const defaultGallery: Omit<GalleryItem, 'id'>[] = [
  {
    name: "Visual IDE Mockup",
    url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80",
    uploadedAt: new Date("2026-03-15")
  },
  {
    name: "Habit Tracker Mobile Concept",
    url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
    uploadedAt: new Date("2026-01-10")
  },
  {
    name: "Workspace setup",
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    uploadedAt: new Date("2025-11-05")
  }
];

export async function getCertificates(): Promise<Certificate[]> {
  try {
    const colRef = collection(db, CERTS_COLLECTION);
    const snapshot = await getDocs(colRef);
    
    if (snapshot.empty) {
      const seeded: Certificate[] = [];
      for (const c of defaultCertificates) {
        const docRef = await addDoc(colRef, {
          ...c,
          createdAt: Timestamp.fromDate(new Date())
        });
        seeded.push({ id: docRef.id, ...c });
      }
      return seeded;
    }
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        issuer: data.issuer || "",
        issueDate: data.issueDate || "",
        credentialUrl: data.credentialUrl || "",
        image: data.image || ""
      };
    });
  } catch (err) {
    console.error("Error retrieving certificates:", err);
    return defaultCertificates.map((c, idx) => ({ id: `offline-${idx}`, ...c }));
  }
}

export async function addCertificate(cert: Omit<Certificate, 'id'>): Promise<string> {
  const colRef = collection(db, CERTS_COLLECTION);
  const docRef = await addDoc(colRef, {
    ...cert,
    createdAt: Timestamp.fromDate(new Date())
  });
  return docRef.id;
}

export async function deleteCertificate(id: string): Promise<void> {
  const docRef = doc(db, CERTS_COLLECTION, id);
  await deleteDoc(docRef);
}

// Gallery functions
export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const colRef = collection(db, GALLERY_COLLECTION);
    const q = query(colRef, orderBy("uploadedAt", "desc"));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      const seeded: GalleryItem[] = [];
      for (const g of defaultGallery) {
        const docRef = await addDoc(colRef, {
          ...g,
          uploadedAt: Timestamp.fromDate(g.uploadedAt as Date)
        });
        seeded.push({ id: docRef.id, ...g });
      }
      return seeded;
    }
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      let dateVal = data.uploadedAt;
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
        url: data.url || "",
        uploadedAt: dateVal
      };
    });
  } catch (err) {
    console.error("Error retrieving gallery:", err);
    return defaultGallery.map((g, idx) => ({ id: `offline-${idx}`, ...g }));
  }
}

export async function addGalleryItem(g: Omit<GalleryItem, 'id' | 'uploadedAt'>): Promise<string> {
  const colRef = collection(db, GALLERY_COLLECTION);
  const docRef = await addDoc(colRef, {
    ...g,
    uploadedAt: Timestamp.fromDate(new Date())
  });
  return docRef.id;
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const docRef = doc(db, GALLERY_COLLECTION, id);
  await deleteDoc(docRef);
}
