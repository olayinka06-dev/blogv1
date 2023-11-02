"use client";
import React, { useEffect, useState } from 'react'
import UserSearch from '../../components/users/Search';
import UserList from "@/components/users/UserList"

const Users = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const resp = await fetch("/api/users", {
          method: "GET",
          cache: "no-store",
        });

        if (resp.ok) {
          const data = await resp.json(); // Parse the JSON response
          setUsers(data.data); // Update the state with the user data
        }
        else{
          
        }
      } catch (error) {
        console.error(error);
      }
    }
    getAllUsers()
  }, []);

  const handleSearch = (data) => {
    setUsers(data)
  }

  return (
    <section className='container'>
      <div className="container md:w-[70%] mx-auto p-4">
      <UserSearch onSearch={handleSearch} users={users}/>
      <UserList users={users}/>
      </div>
    </section>
  )
}

export default Users;