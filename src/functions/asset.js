
import axios from 'axios';
import { getTenantId, getToken } from './authService';
import { getAppConfigValue } from '../utils/dotEnv';

// Dynamic CDN URL එක safe විදිහට ලබාගන්නා Helper එක
const getCdnUrl = async () => {
  return (await getAppConfigValue('REACT_APP_API_CDN'));
};

// Dynamic Main API Path එක ලබාගන්නා Helper එක (viewImage සඳහා)
const getApiPath = async () => {
  return (await getAppConfigValue('REACT_APP_API_PATH'));
};

export const uploadImage = async (file) => {
  try {
    const cdnUrl = await getCdnUrl();
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${cdnUrl}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (err) {
    console.error('Error uploading image phenomenon:', err);
    return err.response || err;
  }
};

export const uploadImageResized = async (file) => {
  try {
    const cdnUrl = await getCdnUrl();
    const tenantId = getTenantId();
    const token = getToken();

    const productImageFolderPath = `${tenantId}/productImages`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderPath', productImageFolderPath);

    const response = await axios.post(`${cdnUrl}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (err) {
    console.error('Error uploading image phenomenon:', err);
    return err.response || err;
  }
};

export const commitFile = async (fileHash) => {
  try {
    const cdnUrl = await getCdnUrl();

    const response = await axios.post(
      `${cdnUrl}/imageUpload/commitFile`,
      { fileHash },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error('Error committing file phenomenon:', err);
    return err.response || err;
  }
};

export const markFileAsTobeDeleted = async (fileHash) => {
  try {
    const cdnUrl = await getCdnUrl();

    const response = await axios.post(
      `${cdnUrl}/imageUpload/markFileAsTobeDeleted`,
      { fileHash },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error('Error marking file for deletion phenomenon:', err);
    return err.response || err;
  }
};

export const viewImage = async (imageHash) => {
  try {
    const apiPath = await getApiPath();

    const response = await axios.get(`${apiPath}/${imageHash}`, {
      responseType: 'blob',
    });

    return URL.createObjectURL(response.data);
  } catch (err) {
    console.error('Error fetching image phenomenon:', err);
    return err.response || err;
  }
};

export const deleteFile = async (fileHash) => {
  try {
    const cdnUrl = await getCdnUrl();

    const response = await axios.delete(`${cdnUrl}/imageUpload/deleteFile?fileHash=${fileHash}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (err) {
    console.error('Error deleting file phenomenon:', err);
    return err.response || err;
  }
};

// import axios from 'axios';
// import { getTenantId, getToken } from './authService';
// import { getAppConfigValue } from '../utils/dotEnv';

// const cdnUrl = (await getAppConfigValue('REACT_APP_API_CDN')) || process.env.REACT_APP_API_CDN;

// export const uploadImage = async (file) => {
//   try {
//     const formData = new FormData();
//     formData.append('file', file);

//     return await axios
//       .post(`${cdnUrl}/upload`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         },
//       })
//       .then((res) => res.data)
//       .catch((err) => {
//         console.error('Error uploading image:', err);
//         return err.response;
//       });
//   } catch (err) {
//     console.error('Unexpected error in uploadImage:', err);
//     return err;
//   }
// };



// export const uploadImageResized = async (file) => {
//   try {

//    const tenantId = getTenantId();
//       const token = getToken();

//  const productImageFolderPath=`${tenantId}/productImages`;

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('folderPath', productImageFolderPath);  

//     return await axios
//       .post(`${cdnUrl}/upload-image`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         },
//       })
//       .then((res) => res.data)
//       .catch((err) => {
//         console.error('Error uploading image:', err);
//         return err.response;
//       });
//   } catch (err) {
//     console.error('Unexpected error in uploadImage:', err);
//     return err;
//   }
// };

// export const commitFile = async (fileHash) => {
//   try {
   
//     return await axios
//       .post(`${cdnUrl}/imageUpload/commitFile`, {fileHash}, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//       .then((res) => res.data)
//       .catch((err) => {
//         console.error('Error uploading image:', err);
//         return err.response;
//       });
//   } catch (err) {
//     console.error('Unexpected error in uploadImage:', err);
//     return err;
//   }
// };


// export const markFileAsTobeDeleted = async (fileHash) => {
//   try {

//     return await axios
//       .post(`${cdnUrl}/imageUpload/markFileAsTobeDeleted`, {fileHash}, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//       .then((res) => res.data)
//       .catch((err) => {
//         console.error('Error uploading image:', err);
//         return err.response;
//       });
//   } catch (err) {
//     console.error('Unexpected error in uploadImage:', err);
//     return err;
//   }
// };


// export const viewImage = async (imageHash) => {
//     try {
//       return await axios
//         .get(`http://localhost:8000/api/${imageHash}`, {
//           responseType: 'blob', // To handle image response
//         })
//         .then((res) => {
//           return URL.createObjectURL(res.data); // Generate object URL to use in `src` attribute
//         })
//         .catch((err) => {
//           console.error('Error fetching image:', err);
//           return err.response;
//         });
//     } catch (err) {
//       console.error('Unexpected error in viewImage:', err);
//       return err;
//     }
//   };


//   export const deleteFile = async (fileHash) => {
//     try {
  
//       return await axios
//         .delete(`${cdnUrl}/imageUpload/deleteFile?fileHash=${fileHash}`, {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         })
//         .then((res) => res.data)
//         .catch((err) => {
//           console.error( err);
//           return err.response;
//         });
//     } catch (err) {
//       console.error( err);
//       return err;
//     }
//   };


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
  