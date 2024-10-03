import React, { useState } from "react";
import axios from "axios";
import Navbar from "../navbar";

const UpdateContentfulEntry = () => {
  const [entryId, setEntryId] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");
  const [message, setMessage] = useState("");

  const updateEntry = async () => {
    const spaceId = process.env.REACT_APP_CONTENTFUL_SPACE_ID;
    const accessToken =
      process.env.REACT_APP_CONTENTFUL_CONTENT_MANAGEMENT_ACCESS_TOKEN;
    const environmentId = "master";

    try {
      // Fetch the existing entry
      const entryResponse = await axios.get(
        `https://api.contentful.com/spaces/${spaceId}/environments/${environmentId}/entries/${entryId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const entry = entryResponse.data;

      // Check if the 'title' field exists and update it
      if (entry.fields.title && entry.fields.title["en-US"]) {
        entry.fields.title["en-US"] = newFieldValue; // Update the title field
      } else {
        console.error("Title field is not defined.");
        setMessage("Error: Title field is not defined.");
        return;
      }

      // Send the updated entry back to Contentful
      await axios.put(
        `https://api.contentful.com/spaces/${spaceId}/environments/${environmentId}/entries/${entryId}`,
        entry,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "X-Contentful-Version": entry.sys.version, // Required for versioning
          },
        }
      );

      setMessage("Entry updated successfully!");
    } catch (error) {
      console.error("Error updating entry:", error);
      setMessage("Error updating entry. Check console for details.");
    }
  };

  //////////////////////////////////////////////////////

  //   const updateEntry = async () => {
  //     const spaceId = process.env.REACT_APP_CONTENTFUL_SPACE_ID;
  //     const accessToken =
  //       process.env.REACT_APP_CONTENTFUL_CONTENT_MANAGEMENT_ACCESS_TOKEN;
  //     const environmentId = "master";

  //     try {
  //       // Fetch the existing entry
  //       const entryResponse = await axios.get(
  //         `https://api.contentful.com/spaces/${spaceId}/environments/${environmentId}/entries/${entryId}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       const entry = entryResponse.data;

  //       // Update the field value
  //       if (entry.fields.title && entry.fields.title["en-US"]) {
  //         entry.fields.title["en-US"] = newFieldValue; // Update the title field
  //       } else {
  //         console.error("Title field is not defined.");
  //         setMessage("Error: Title field is not defined.");
  //         return;
  //       }

  //       // Send the updated entry back to Contentful
  //       const updatedEntryResponse = await axios.put(
  //         `https://api.contentful.com/spaces/${spaceId}/environments/${environmentId}/entries/${entryId}`,
  //         entry,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //             "Content-Type": "application/json",
  //             "X-Contentful-Version": entry.sys.version, // Required for versioning
  //           },
  //         }
  //       );

  //       // Check if the entry is already published and has a new version
  //       console.log("Published entry", entryResponse.data.sys.publishedAt);
  //       console.log(
  //         "Updated entry version",
  //         updatedEntryResponse.data.sys.version
  //       );
  //       console.log("Previous version", entry.sys.version);
  //       if (
  //         entryResponse.data.sys.publishedAt &&
  //         updatedEntryResponse.data.sys.version > entry.sys.version
  //       ) {
  //         // Publish the entry
  //         await axios.put(
  //           `https://api.contentful.com/spaces/${spaceId}/environments/${environmentId}/entries/${entryId}/published`,
  //           {},
  //           {
  //             headers: {
  //               Authorization: `Bearer ${accessToken}`,
  //               "Content-Type": "application/json",
  //             },
  //           }
  //         );
  //         setMessage("Entry updated and published successfully!");
  //       } else {
  //         console.log(
  //           "Entry is already published and does not need to be republished."
  //         );
  //         setMessage("Entry updated successfully but was already published.");
  //       }
  //     } catch (error) {
  //       if (error.response && error.response.status === 409) {
  //         console.error("Conflict error: Entry may already be published.", error);
  //         setMessage("Error: Entry may already be published.");
  //       } else {
  //         console.error("Error updating or publishing entry:", error);
  //         setMessage("Error updating entry. Check console for details.");
  //       }
  //     }
  //   };

  return (
    <>
      <Navbar />
      <div>
        <h1>Update Contentful Entry</h1>
        <input
          type="text"
          placeholder="Entry ID"
          value={entryId}
          onChange={(e) => setEntryId(e.target.value)}
        />
        <input
          type="text"
          placeholder="New Field Value"
          value={newFieldValue}
          onChange={(e) => setNewFieldValue(e.target.value)}
        />
        <button onClick={updateEntry}>Update Entry</button>
        {message && <p>{message}</p>}
      </div>
    </>
  );
};

export default UpdateContentfulEntry;
