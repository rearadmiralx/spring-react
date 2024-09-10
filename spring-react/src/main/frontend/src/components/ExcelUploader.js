// import React, { useState } from 'react';
// import Dropzone from 'react-dropzone';
// import axios from 'axios';
// import './../App.css'

// const ExcelUploader = () => {
//   const [downloadLink, setDownloadLink] = useState('');

//   const handleFileUpload = async (acceptedFiles) => {
//     try {
//       const formData = new FormData();
//       formData.append('file', acceptedFiles[0]);

//       const response = await axios.post('/testing/csv-to-excel/convert', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       // Assuming the API returns the path to the converted Excel file
//       const excelFilePath = response.data; // Adjust this according to your API response
//       setDownloadLink(excelFilePath);
//       console.log('File uploaded successfully');
//     } catch (error) {
//       console.error('Error uploading file:', error.response ? error.response.data : error.message);
//     }
//   };

//   const handleDownload = async () => {
//     try {
//       const response = await axios({
//         url: `csv-to-excel/download?excelFilePath=${encodeURIComponent(downloadLink)}`,
//         method: 'GET',
//         responseType: 'blob', // Important
//       });

//       // Create a link to download the file
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', 'converted_file.xlsx'); // Change the filename as needed
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       console.error('Error downloading file:', error);
//     }
//   };

//   return (
//     <div>
//       <Dropzone onDrop={handleFileUpload}>
//         {({ getRootProps, getInputProps }) => (
//           <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
//             <input {...getInputProps()} />
//             <p>Drag and drop an Excel file, or click to select a file</p>
//           </div>
//         )}
//       </Dropzone>

//       {downloadLink && (
//         <button onClick={handleDownload} style={{ marginTop: '20px' }}>
//           Download Converted Excel File
//         </button>
//       )}
//     </div>
//   );
// };

// export default ExcelUploader;