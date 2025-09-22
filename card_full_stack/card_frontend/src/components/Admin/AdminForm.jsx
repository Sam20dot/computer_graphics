import { useState } from "react";
import { createAdmin, updateAdmin, deleteAdmin } from "../../services/adminService";

export default function AdminForm({ token, adminToEdit, onSuccess }) {
  const [name, setName] = useState(adminToEdit?.name || "");
  const [email, setEmail] = useState(adminToEdit?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(adminToEdit?.role || "RECHARGE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (adminToEdit) {
        await updateAdmin(token, adminToEdit._id, { name, email, password, role });
      } else {
        await createAdmin(token, { name, email, password, role });
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!adminToEdit) return;
    if (!confirm("Are you sure you want to delete this admin?")) return;
    try {
      await deleteAdmin(token, adminToEdit._id);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Delete failed");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">{adminToEdit ? "Edit Admin" : "Create Admin"}</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required={!adminToEdit} // only required for new admin
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="ADMIN">ADMIN</option>
          <option value="RECHARGE">RECHARGE</option>
        </select>
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {adminToEdit ? "Update" : "Create"}
          </button>
          {adminToEdit && (
            <button
              type="button"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
