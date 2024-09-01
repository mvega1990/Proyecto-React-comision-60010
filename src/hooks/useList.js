
  import { useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from '../firebase/firebase.js'; 

export const useList = (categoryId) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refCollection = !categoryId
      ? collection(db, "Items")
      : query(collection(db, "Items"), where("categoryId", "==", categoryId));

    getDocs(refCollection)
      .then((snapshot) => {
        if (snapshot.empty) {
          console.log("No results");
          setList([]);
        } else {
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setList(items);
        }
      })
      .catch((error) => {
        console.error("Error fetching documents: ", error);
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

  return { list, loading };
};
