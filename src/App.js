// import React, { useEffect, useState } from "react";
// import client from "./contentfulClient";

// function App() {
//   const [entries, setEntries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchEntries = async () => {
//       try {
//         const response = await client.getEntries({ content_type: "movieName" });
//         setEntries(response.items);
//         console.log(response, "Fetched entries");
//       } catch (err) {
//         setError(err);
//         console.error("Error fetching entries:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEntries();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;

//   return (
//     <div>
//       <h1>Contentful POC</h1>
//       <ul>
//         {entries.map((entry) => (
//           <li key={entry.sys.id}>
//             <h2>{entry.fields.title}</h2>
//             <p>{entry.fields.description}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import client from "./contentfulClient";
import Navbar from "./components/navbar";

function App() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await client.getEntries({ content_type: "movieName" });
        setEntries(response.items);
        console.log(response, "Fetched entries");
      } catch (err) {
        setError(err);
        console.error("Error fetching entries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Navbar />
      <div>
        <h1>Contentful POC</h1>
        <ul>
          {entries.map((entry) => (
            <li key={entry.sys.id}>
              <h2>{entry.fields.title}</h2>
              <p>{entry.fields.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
