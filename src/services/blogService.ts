import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  where, 
  limit, 
  Timestamp 
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Blog } from "../types";

const COLLECTION_NAME = "blogs";

const defaultBlogs: Omit<Blog, 'id'>[] = [
  {
    title: "Mastering React 19 State Management & Action Hooks",
    slug: "mastering-react-19-state-management",
    content: "With the final release of React 19, multiple revolutionary features like the useTransition hook, Actions API, and the new use() API are here to streamline async code. Now instead of manually toggling loading states, we can pass async functions directly to form actions and let React coordinate the pending states, optimistic updates, and error boundaries automatically. In this blog, we explore how this enhances the user experience and cleans up the architecture.",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
    author: "Krishna Kadayat",
    createdAt: new Date("2026-05-20")
  },
  {
    title: "Integrating Gemini 2.5 Flash Into Your Developer Workflow",
    slug: "integrating-gemini-2-5-into-workflow",
    content: "Artificial Intelligence has transitioned from simple lookup answers to structured task agents. Utilizing the new official Google GenAI SDK (`@google/genai`), developers can harness capabilities like structured JSON output, system instruction tunings, and Google Search Grounding with minimal overhead. In this entry, we build a lightweight code synthesizer and explore best-practices for keeping your API keys hidden safely from the client using Express server routing.",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
    author: "Krishna Kadayat",
    createdAt: new Date("2026-04-12")
  }
];

export async function getBlogs(): Promise<Blog[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      // Auto-seeds blogs
      const seeded: Blog[] = [];
      for (const b of defaultBlogs) {
        const docRef = await addDoc(colRef, {
          ...b,
          createdAt: Timestamp.fromDate(b.createdAt as Date)
        });
        seeded.push({ id: docRef.id, ...b, createdAt: b.createdAt });
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
        slug: data.slug || "",
        content: data.content || "",
        coverImage: data.coverImage || "",
        author: data.author || "Krishna Kadayat",
        createdAt: dateVal
      } as Blog;
    });
  } catch (error) {
    console.error("Error retrieving blogs:", error);
    return defaultBlogs.map((b, idx) => ({ id: `offline-${idx}`, ...b }));
  }
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, where("slug", "==", slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      // Look in offline cache fallback
      const cached = defaultBlogs.find(b => b.slug === slug);
      if (cached) return { id: "offline", ...cached };
      return null;
    }
    const docObj = snapshot.docs[0];
    const data = docObj.data();
    let dateVal = data.createdAt;
    if (dateVal && typeof dateVal.toDate === "function") {
      dateVal = dateVal.toDate();
    } else if (dateVal && dateVal.seconds) {
      dateVal = new Date(dateVal.seconds * 1000);
    } else {
      dateVal = new Date(dateVal);
    }
    return {
      id: docObj.id,
      title: data.title || "",
      slug: data.slug || "",
      content: data.content || "",
      coverImage: data.coverImage || "",
      author: data.author || "Krishna Kadayat",
      createdAt: dateVal
    };
  } catch (err) {
    console.error("Error getting blog by slug:", err);
    const cached = defaultBlogs.find(b => b.slug === slug);
    if (cached) return { id: "offline", ...cached };
    return null;
  }
}

export async function addBlog(blog: Omit<Blog, 'id'>): Promise<string> {
  const colRef = collection(db, COLLECTION_NAME);
  // Guarantee slug
  const slug = blog.title.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .trim();
    
  const docRef = await addDoc(colRef, {
    ...blog,
    slug: slug || `post-${Date.now()}`,
    createdAt: Timestamp.fromDate(new Date())
  });
  return docRef.id;
}

export async function updateBlog(id: string, blog: Partial<Blog>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const updateData: any = { ...blog };
  delete updateData.id;
  if (updateData.createdAt instanceof Date) {
    updateData.createdAt = Timestamp.fromDate(updateData.createdAt);
  }
  await updateDoc(docRef, updateData);
}

export async function deleteBlog(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
