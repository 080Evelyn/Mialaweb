import React, { useState } from "react";
import UserContext from "./UserContext";

const UserProvider = ({ children }) => {
  const [role, setRole] = useState("sup");

  // Later on, we will fetch the role from API and set it here
  return (
    <UserContext.Provider value={{ role, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
