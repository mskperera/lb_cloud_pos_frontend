
import axios from 'axios';
import { getTenantId, getToken } from './authService';


export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    return await axios
      .post(`${process.env.REACT_APP_API_CDN}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error uploading image:', err);
        return err.response;
      });
  } catch (err) {
    console.error('Unexpected error in uploadImage:', err);
    return err;
  }
};



export const uploadImageResized = async (file) => {
  try {

   const tenantId = getTenantId();
      const token = getToken();

 const productImageFolderPath=`${tenantId}/productImages`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderPath', productImageFolderPath);  

    return await axios
      .post(`${process.env.REACT_APP_API_CDN}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error uploading image:', err);
        return err.response;
      });
  } catch (err) {
    console.error('Unexpected error in uploadImage:', err);
    return err;
  }
};

export const commitFile = async (fileHash) => {
  try {
   
    return await axios
      .post(`${process.env.REACT_APP_API_CDN}/imageUpload/commitFile`, {fileHash}, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error uploading image:', err);
        return err.response;
      });
  } catch (err) {
    console.error('Unexpected error in uploadImage:', err);
    return err;
  }
};


export const markFileAsTobeDeleted = async (fileHash) => {
  try {

    return await axios
      .post(`${process.env.REACT_APP_API_CDN}/imageUpload/markFileAsTobeDeleted`, {fileHash}, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error uploading image:', err);
        return err.response;
      });
  } catch (err) {
    console.error('Unexpected error in uploadImage:', err);
    return err;
  }
};


export const viewImage = async (imageHash) => {
    try {
      return await axios
        .get(`http://localhost:8000/api/${imageHash}`, {
          responseType: 'blob', // To handle image response
        })
        .then((res) => {
          return URL.createObjectURL(res.data); // Generate object URL to use in `src` attribute
        })
        .catch((err) => {
          console.error('Error fetching image:', err);
          return err.response;
        });
    } catch (err) {
      console.error('Unexpected error in viewImage:', err);
      return err;
    }
  };


  export const deleteFile = async (fileHash) => {
    try {
  
      return await axios
        .delete(`${process.env.REACT_APP_API_CDN}/imageUpload/deleteFile?fileHash=${fileHash}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => res.data)
        .catch((err) => {
          console.error( err);
          return err.response;
        });
    } catch (err) {
      console.error( err);
      return err;
    }
  };


//   // Upload an image
// const handleUpload = async (file) => {
//     const response = await uploadImage(file);
//     console.log('Upload response:', response);
//   };
  
//   // View an image
//   const handleViewImage = async (imageHash) => {
//     const imageUrl = await viewImage(imageHash);
//     console.log('Image URL:', imageUrl);
//     // Use the image URL in an `img` tag or elsewhere
//   };
  
//   // Resize an image
//   const handleResizeImage = async (imageHash) => {
//     const imageUrl = await resizeImage(imageHash, 200, 200, 80);
//     console.log('Resized Image URL:', imageUrl);
//     // Use the resized image URL in an `img` tag or elsewhere
//   };
  