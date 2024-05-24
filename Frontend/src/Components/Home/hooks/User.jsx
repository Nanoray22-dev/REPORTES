import  { useState } from 'react'

function User() {
    const [users, setUsers] = useState([]);
    const [totalUsersCount, setTotalUsersCount] = useState(0);
    const [usersByMonth, setUsersByMonth] = useState({});
    const [usersByDay, setUsersByDay] = useState({});
    const [usersByWeek, setUsersByWeek] = useState({});
  return {
    users, setUsers,
    totalUsersCount, setTotalUsersCount,
    usersByMonth, setUsersByMonth,
    usersByDay, setUsersByDay,
    usersByWeek, setUsersByWeek


  }
}

export default User