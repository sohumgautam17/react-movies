import {Client, Databases, ID, Query} from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECTID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASEID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTIONID;

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(PROJECT_ID)

const databases = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal("movie_id", movie.id) // Check if the movie exists
        ]);

        if (response.documents.length > 0) {
            // Movie exists, update search count
            const docId = response.documents[0].$id;
            await databases.updateDocument(DATABASE_ID, COLLECTION_ID, docId, {
                count: response.documents[0].count + 1
            });
        } else {
            // Movie doesn't exist, create a new document
            await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                count: 1 // Start search count at 1
            });
        }

        console.log("Successfully updated/created movie:", movie.title);
    } catch (error) {
        console.error("Error updating search count:", error);
    }
};

export const getTrendingMovies = async () => {
    try {
        if (!DATABASE_ID || !COLLECTION_ID) {
            throw new Error('Database or Collection ID is missing');
        }

        console.log('Fetching with IDs:', {
            DATABASE_ID,
            COLLECTION_ID
        });

        const results = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('count')
        ]);

        console.log('Appwrite Results:', results); // Log the entire results object

        return results.documents || [];

    } catch (error) {
        console.error('Error in getTrendingMovies:', error);
        return []; // Make sure we return an empty array on error
    }
}