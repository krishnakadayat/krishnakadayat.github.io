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
import { Project } from "../types";

const COLLECTION_NAME = "projects";

const defaultProjects: Omit<Project, 'id'>[] = [
  {
    title: "AI IntelliCode - Smart Editor",
    description: "An AI-powered online IDE and code analyzer using Gemini 2.5 Flash to explain, optimize, and refactor code in real-time. Includes visual performance charts and interactive revision history.",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80",
    github: "https://github.com/krishnakadayat1/ai-intellicode",
    demo: "https://ai-intellicode.example.com",
    technologies: ["React", "Express", "Vite", "Gemini API", "Tailwind CSS", "Recharts"],
    featured: true,
    createdAt: new Date("2026-03-15")
  },
  {
    title: "EcoSphere - Collaborative Habit Tracker",
    description: "A real-time Gamified environmental habit tracker where users form groups to participate in sustainability challenges. Leverages Firebase Firestore for instant synchronization and real-time multiplayer boards.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    github: "https://github.com/krishnakadayat1/ecosphere",
    demo: "https://ecosphere-habit.example.com",
    technologies: ["React 19", "Firebase Auth", "Firestore", "Tailwind CSS", "Framer Motion"],
    featured: true,
    createdAt: new Date("2026-01-10")
  },
  {
    title: "DevMetrics - Git Analytics Dashboard",
    description: "A comprehensive analytics compiler that visualizes public GitHub repository health, contributions, active weeks, language diversity, and commit patterns. Uses D3.js for visual graph charts.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    github: "https://github.com/krishnakadayat1/devmetrics",
    demo: "https://devmetrics.example.com",
    technologies: ["React", "TypeScript", "GitHub API", "Tailwind CSS", "D3.js", "Express"],
    featured: false,
    createdAt: new Date("2025-11-05")
  }
];

export async function getProjects(): Promise<Project[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      // Auto-seeds Firestore on empty state so the site looks fantastic
      const seeded: Project[] = [];
      for (const p of defaultProjects) {
        const docRef = await addDoc(colRef, {
          ...p,
          createdAt: Timestamp.fromDate(p.createdAt as Date)
        });
        seeded.push({ id: docRef.id, ...p, createdAt: p.createdAt });
      }
      return seeded;
    }
    
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
        title: data.title || "",
        description: data.description || "",
        image: data.image || "",
        github: data.github || "",
        demo: data.demo || "",
        technologies: data.technologies || [],
        featured: data.featured ?? false,
        createdAt: dateVal
      } as Project;
    });
  } catch (error) {
    console.error("Error retrieving projects:", error);
    // Return default offline static values if network or firestore fails helper
    return defaultProjects.map((p, idx) => ({ id: `offline-${idx}`, ...p }));
  }
}

export async function addProject(project: Omit<Project, 'id'>): Promise<string> {
  const colRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(colRef, {
    ...project,
    createdAt: Timestamp.fromDate(new Date())
  });
  return docRef.id;
}

export async function updateProject(id: string, project: Partial<Project>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const updateData: any = { ...project };
  delete updateData.id;
  if (updateData.createdAt instanceof Date) {
    updateData.createdAt = Timestamp.fromDate(updateData.createdAt);
  }
  await updateDoc(docRef, updateData);
}

export async function deleteProject(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
