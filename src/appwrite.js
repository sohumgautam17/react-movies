const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECTID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASEID;
const COLLECTION_ID = import.meta.env.VITE_COLLECTIONS_ID;


export const updateSearchCount = async () => {
    console.log(PROJECT_ID, DATABASE_ID, COLLECTION_ID);
}