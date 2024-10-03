// import React, { useState } from "react";
// import axios from "axios";
// import "./index.css";

// const CreateContentfulEntry = () => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [createdAt, setCreatedAt] = useState("");
//   const [image, setImage] = useState(null);
//   const [message, setMessage] = useState("");

//   const createEntry = async () => {
//     const spaceId = process.env.REACT_APP_CONTENTFUL_SPACE_ID;
//     const accessToken =
//       process.env.REACT_APP_CONTENTFUL_CONTENT_MANAGEMENT_ACCESS_TOKEN;
//     const environmentId = "master";

//     const newEntry = {
//       fields: {
//         title: { "en-US": title },
//         description: { "en-US": description },
//         createdAt: { "en-US": createdAt },
//         image: {
//           "en-US": { sys: { type: "Link", linkType: "Asset", id: "" } },
//         },
//       },
//     };

//     try {
//       // Step 1: Upload the image if provided
//       if (image) {
//         const formData = new FormData();
//         formData.append("file", image); // Append the image file

//         // Create an asset without uploading the file yet
//         const assetCreationResponse = await axios.post(
//           `https://api.contentful.com/spaces/${spaceId}/environments/${environmentId}/assets`,
//           {
//             fields: {
//               title: { "en-US": image.name },
//             },
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const assetId = assetCreationResponse.data.sys.id;

//         // Upload the file to the newly created asset
//         await axios.put(
//           `https://upload.contentful.com/spaces/${spaceId}/environments/${environmentId}/assets/${assetId}/files/en-US`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );

//         // Publish the uploaded asset
//         await axios.put(
//           `https://api.contentful.com/spaces/${spaceId}/environments/${environmentId}/assets/${assetId}/published`,
//           {},
//           {
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         newEntry.fields.image["en-US"].sys.id = assetId;
//       }

//       // Step 2: Create the new entry
//       const entryResponse = await axios.post(
//         `https://api.contentful.com/spaces/${spaceId}/environments/${environmentId}/entries`,
//         newEntry,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("Entry created successfully:", entryResponse.data);
//       setMessage("Entry created successfully!");

//       // Step 3: Publish the entry
//       const createdEntryId = entryResponse.data.sys.id;
//       await axios.put(
//         `https://api.contentful.com/spaces/${spaceId}/environments/${environmentId}/entries/${createdEntryId}/published`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setMessage("Entry created and published successfully!");
//     } catch (error) {
//       console.error(
//         "Error creating entry:",
//         error.response ? error.response.data : error.message
//       );
//       setMessage("Error creating entry. Check console for details.");
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     createEntry();
//   };

//   return (
//     <div className="container">
//       <h1>Create Contentful Entry</h1>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label className="label">Title:</label>
//           <input
//             className="input"
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label className="label">Description:</label>
//           <textarea
//             className="textarea"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label className="label">Created At:</label>
//           <input
//             className="input"
//             type="date"
//             value={createdAt}
//             onChange={(e) => setCreatedAt(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label className="label">Image:</label>
//           <input
//             className="input"
//             type="file"
//             onChange={(e) => setImage(e.target.files[0])}
//             required
//           />
//         </div>
//         <button className="button" type="submit">
//           Create Entry
//         </button>
//       </form>
//       {message && <p className="message">{message}</p>}
//     </div>
//   );
// };

// export default CreateContentfulEntry;

import React, { useState } from "react";
import { createClient } from "contentful-management";
import "./index.css"; // Assuming you have basic styles here
import Navbar from "../navbar";

const CreateContentfulEntry = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const createEntry = async () => {
    setIsLoading(true);
    setMessage("");

    // Initialize Contentful Management SDK client
    const client = createClient({
      accessToken:
        process.env.REACT_APP_CONTENTFUL_CONTENT_MANAGEMENT_ACCESS_TOKEN,
    });

    try {
      const space = await client.getSpace(
        process.env.REACT_APP_CONTENTFUL_SPACE_ID
      );
      const environment = await space.getEnvironment("master");

      // Step 1: Upload and process the image asset
      let asset = null;
      if (image) {
        const uploadedAsset = await environment.createAssetFromFiles({
          fields: {
            title: {
              "en-US": image.name,
            },
            file: {
              "en-US": {
                contentType: image.type,
                fileName: image.name,
                file: image,
              },
            },
          },
        });

        asset = await uploadedAsset.processForAllLocales();
        await asset.publish();
      }

      // Step 2: Create the entry with the image (if available)
      const entryFields = {
        title: { "en-US": title },
        description: { "en-US": description },
        createdAt: { "en-US": createdAt },
      };

      if (asset) {
        entryFields.image = {
          "en-US": {
            sys: { id: asset.sys.id, linkType: "Asset", type: "Link" },
          },
        };
      }

      const entry = await environment.createEntry("movieName", {
        fields: entryFields,
      });

      await entry.publish();

      // Success message
      setMessage("Entry created and published successfully!");
    } catch (error) {
      console.error("Error creating entry:", error);
      setMessage("Error creating entry. Please check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createEntry();
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Create Contentful Entry</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Title:</label>
            <input
              className="input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Description:</label>
            <textarea
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Created At:</label>
            <input
              className="input"
              type="date"
              value={createdAt}
              onChange={(e) => setCreatedAt(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Image:</label>
            <input className="input" type="file" onChange={handleImageChange} />
          </div>

          <button className="button" type="submit" disabled={isLoading}>
            {isLoading ? "Creating Entry..." : "Create Entry"}
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </>
  );
};

export default CreateContentfulEntry;
