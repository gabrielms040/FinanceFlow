import { useState, useEffect } from 'react';
import axios from 'axios';


const Dashboard = () => {

    const [transactions, setTransactions] = useState([]);

useEffect (() => {
    (async () => {
        try {
        const response = await axios.get('http://localhost:3001/transactions/getAll', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
        }, });
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    })();
}, []);

  return (
    <div>
        <h2>Dashboard Page</h2>
        <ul>
            {transactions.map(transaction => (
                // Display each transaction's details to the user
                <li key={transaction.id}>
                    {transaction.description} - {transaction.amount} - {transaction.type} - {transaction.transaction_date}
                </li>
            ))}
        </ul>
    </div>
  )
    };

export default Dashboard;