import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllAdmins } from "../services/adminService";
import AdminList from "../components/Admin/AdminList";
import AdminForm from "../components/Admin/AdminForm";

export default function AdminDashboard() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const fetchAdmins = async () => {
    try {
      const data = await getAllAdmins(token);
      setAdmins(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="p-8 flex gap-8">
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        {loading ? <p>Loading admins...</p> : 
          <AdminList admins={admins} setSelectedAdmin={setSelectedAdmin} />}
      </div>
      <div className="w-96">
        <AdminForm
          token={token}
          adminToEdit={selectedAdmin}
          onSuccess={() => {
            setSelectedAdmin(null);
            fetchAdmins();
          }}
        />
      </div>
    </div>
  );
}
