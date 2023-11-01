"use client";
import React, { useState } from 'react';

function UserSearch({ users, onSearch }) {
  const [searchText, setSearchText] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = () => {
    // Implement the search logic here
    const filteredUsers = users?.filter((user) => {
      // Check if the name, email, or phone number contains the search text
      const nameIncludesSearchText = user?.username.toLowerCase().includes(searchText.toLowerCase());
      const emailIncludesSearchText = user?.email.toLowerCase().includes(searchText.toLowerCase());
      const phoneIncludesSearchText = user?.phoneNumber.toLowerCase().includes(searchText.toLowerCase());

      // Check if the role matches the selected role (if any)
      const roleMatches = !selectedRole || user.role === selectedRole;

      return (nameIncludesSearchText || emailIncludesSearchText || phoneIncludesSearchText) && roleMatches;
    });

    setSearchResults(filteredUsers);
    onSearch(searchResults);
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search by name, email, or phone number"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-48 sm:w-64 border rounded-md p-2 focus:outline-none"
        />
        <select
          onChange={(e) => setSelectedRole(e.target.value)}
          value={selectedRole}
          className="border rounded-md p-2 focus:outline-none"
        >
          <option value="">All Roles</option>
          <option value="Front-End Developers">Front-End Developers</option>
          <option value="Back-End Developers">Back-End Developers</option>
          <option value="Full-Stack Developers">Full-Stack Developers</option>
        </select>
        <button
          onClick={handleSearch}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default UserSearch;


// // UserSearch.js
// import React, { useState } from 'react';

// function UserSearch({ users }) {
//   const [searchText, setSearchText] = useState('');
//   const [selectedRole, setSelectedRole] = useState('');
//   const [searchResults, setSearchResults] = useState([]);

//   const handleSearch = () => {
//     // Implement the search logic here
//     const filteredUsers = users.filter((user) => {
//       // Check if the name, email, or phone number contains the search text
//       const nameIncludesSearchText = user.name.toLowerCase().includes(searchText.toLowerCase());
//       const emailIncludesSearchText = user.email.toLowerCase().includes(searchText.toLowerCase());
//       const phoneIncludesSearchText = user.phone.toLowerCase().includes(searchText.toLowerCase());

//       // Check if the role matches the selected role (if any)
//       const roleMatches = !selectedRole || user.role === selectedRole;

//       return (nameIncludesSearchText || emailIncludesSearchText || phoneIncludesSearchText) && roleMatches;
//     });

//     setSearchResults(filteredUsers);
//   };

//   return (
//     <div className="p-4 bg-white shadow rounded-lg">
//       <div className="flex items-center space-x-4">
//         <input
//           type="text"
//           placeholder="Search by name, email, or phone number"
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           className="w-48 sm:w-64 border rounded-md p-2 focus:outline-none"
//         />
//         <select
//           onChange={(e) => setSelectedRole(e.target.value)}
//           value={selectedRole}
//           className="border rounded-md p-2 focus:outline-none"
//         >
//           <option value="">All Roles</option>
//           <option value="Front-End Developers">Front-End Developers</option>
//           <option value="Back-End Developers">Back-End Developers</option>
//           <option value="Full-Stack Developers">Full-Stack Developers</option>
//         </select>
//         <button
//           onClick={handleSearch}
//           className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
//         >
//           Search
//         </button>
//       </div>
//       <div className="mt-4">
//         <ul>
//           {searchResults.map((user) => (
//             <li key={user.id}>
//               {user.name} - Role: {user.role}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default UserSearch;
