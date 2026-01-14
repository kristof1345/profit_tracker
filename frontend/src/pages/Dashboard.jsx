import "./Dashboard.css";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { supabase } from '../supabaseClient';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';



const Dashboard = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState;

  useEffect(() => {
    const fetchData = async() => {
      try {
        const { data: { session } } = await.supabase.auth.getSession();
        const token = session?.access_token;

        // call go backend
        const response = await axios.get("http://localhost:8080/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setData(response.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading your profits...</div>

  return (
    <div>
      <h1>Prodit Dashboard</h1>

      {data.length === 0 ? (
        <p>No sales data found. Add something.</p>
      ) : (
        <div style={{ width: '100%', height: 400, marginTop: '2rem' }}>
                  <ResponsiveContainer>
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="profit"
                        stroke="#007bff"
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
      )}
    </div>
  );
};

export default Dashboard;
