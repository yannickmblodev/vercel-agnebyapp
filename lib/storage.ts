import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export const uploadHotelImage = async (file: File, hotelId: string): Promise<string> => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const imageRef = ref(storage, `hotels/${hotelId}/${fileName}`);
    
    await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(imageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Erreur lors de l\'upload de l\'image:', error);
    throw error;
  }
};

export const deleteHotelImage = async (imageUrl: string) => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image:', error);
    throw error;
  }
};

export const uploadMultipleImages = async (files: FileList, hotelId: string): Promise<string[]> => {
  try {
    const uploadPromises = Array.from(files).map(file => uploadHotelImage(file, hotelId));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Erreur lors de l\'upload multiple d\'images:', error);
    throw error;
  }
};