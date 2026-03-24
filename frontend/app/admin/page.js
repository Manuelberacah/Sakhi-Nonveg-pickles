"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

const ADMIN_TOKEN_KEY = "sakhi_admin_token";

const emptyProduct = {
  name: "",
  nameTe: "",
  image: "",
  description: "",
  descriptionTe: "",
  prices: { "250g": "", "500g": "", "1kg": "" }
};
const emptyUpdate = { title: "", content: "", type: "update", mediaUrl: "" };

const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export default function AdminPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [checkedStorage, setCheckedStorage] = useState(false);
  const [overview, setOverview] = useState({ users: 0, orders: 0, products: 0 });
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [updateForm, setUpdateForm] = useState(emptyUpdate);
  const [editingId, setEditingId] = useState("");
  const [status, setStatus] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (saved) setToken(saved);
    setCheckedStorage(true);
  }, []);

  useEffect(() => {
    if (checkedStorage && !token) {
      router.replace("/login");
    }
  }, [checkedStorage, token, router]);

  const loadDashboard = async (adminToken) => {
    const [overviewRes, productsRes, usersRes, ordersRes, updatesRes] = await Promise.all([
      api.get("/admin/overview", authHeader(adminToken)),
      api.get("/admin/products", authHeader(adminToken)),
      api.get("/admin/users", authHeader(adminToken)),
      api.get("/admin/orders", authHeader(adminToken)),
      api.get("/updates")
    ]);

    setOverview(overviewRes.data);
    setProducts(productsRes.data || []);
    setUsers(usersRes.data || []);
    setOrders(ordersRes.data || []);
    setUpdates(updatesRes.data || []);
  };

  useEffect(() => {
    if (!token) return;
    loadDashboard(token).catch(() => {
      setToken("");
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      router.replace("/login");
    });
  }, [token, router]);

  const parsedPrices = useMemo(
    () => ({
      "250g": Number(form.prices["250g"]),
      "500g": Number(form.prices["500g"]),
      "1kg": Number(form.prices["1kg"])
    }),
    [form.prices]
  );

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    const payload = {
      name: form.name,
      nameTe: form.nameTe,
      image: form.image,
      description: form.description,
      descriptionTe: form.descriptionTe,
      prices: parsedPrices
    };

    try {
      if (editingId) {
        await api.patch(`/admin/products/${editingId}`, payload, authHeader(token));
        setStatus("Product updated");
      } else {
        await api.post("/admin/products", payload, authHeader(token));
        setStatus("Product added");
      }
      setForm(emptyProduct);
      setEditingId("");
      await loadDashboard(token);
    } catch (error) {
      setStatus(error.response?.data?.message || "Failed to save product");
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      nameTe: item.nameTe || "",
      image: item.image,
      description: item.description,
      descriptionTe: item.descriptionTe || "",
      prices: {
        "250g": item.prices["250g"],
        "500g": item.prices["500g"],
        "1kg": item.prices["1kg"]
      }
    });
  };

  const deleteProduct = async (id) => {
    await api.delete(`/admin/products/${id}`, authHeader(token));
    await loadDashboard(token);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateStatus("");
    try {
      await api.post("/updates", updateForm, authHeader(token));
      setUpdateForm(emptyUpdate);
      setUpdateStatus("Update posted");
      await loadDashboard(token);
    } catch (error) {
      setUpdateStatus(error.response?.data?.message || "Failed to post update");
    }
  };

  const deleteUpdate = async (id) => {
    try {
      await api.delete(`/updates/${id}`, authHeader(token));
      await loadDashboard(token);
    } catch (error) {
      setUpdateStatus(error.response?.data?.message || "Failed to delete update");
    }
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    router.replace("/login");
  };

  if (!token) return null;

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-brandYellow">Admin Portal</h1>
        <button type="button" onClick={logout} className="rounded-lg bg-red-600 px-4 py-2 text-sm">
          Logout
        </button>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="brand-card p-4">
          <p className="text-sm text-white/70">Users</p>
          <p className="text-3xl font-bold text-brandYellow">{overview.users}</p>
        </div>
        <div className="brand-card p-4">
          <p className="text-sm text-white/70">Orders</p>
          <p className="text-3xl font-bold text-brandYellow">{overview.orders}</p>
        </div>
        <div className="brand-card p-4">
          <p className="text-sm text-white/70">Products</p>
          <p className="text-3xl font-bold text-brandYellow">{overview.products}</p>
        </div>
      </section>

      <section className="brand-card space-y-3 p-4">
        <h2 className="text-xl font-semibold text-brandYellow">{editingId ? "Edit Product" : "Add Product"}</h2>
        <form onSubmit={handleProductSubmit} className="space-y-3">
          <input
            placeholder="Name"
            required
            className="w-full rounded-xl border border-white/20 bg-black/30 p-3"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <input
            placeholder="Name (Telugu)"
            className="w-full rounded-xl border border-white/20 bg-black/30 p-3"
            value={form.nameTe}
            onChange={(e) => setForm((prev) => ({ ...prev, nameTe: e.target.value }))}
          />
          <input
            placeholder="Image path or URL (example: /products/chicken.png.jpg)"
            required
            className="w-full rounded-xl border border-white/20 bg-black/30 p-3"
            value={form.image}
            onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
          />
          <textarea
            placeholder="Description"
            required
            className="h-20 w-full rounded-xl border border-white/20 bg-black/30 p-3"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
          <textarea
            placeholder="Description (Telugu)"
            className="h-20 w-full rounded-xl border border-white/20 bg-black/30 p-3"
            value={form.descriptionTe}
            onChange={(e) => setForm((prev) => ({ ...prev, descriptionTe: e.target.value }))}
          />
          <div className="grid gap-3 md:grid-cols-3">
            {["250g", "500g", "1kg"].map((size) => (
              <input
                key={size}
                required
                type="number"
                placeholder={`${size} price`}
                className="w-full rounded-xl border border-white/20 bg-black/30 p-3"
                value={form.prices[size]}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    prices: { ...prev.prices, [size]: e.target.value }
                  }))
                }
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="brand-btn-primary" type="submit">
              {editingId ? "Update Product" : "Add Product"}
            </button>
            {editingId ? (
              <button
                type="button"
                className="rounded-lg bg-gray-600 px-4 py-2"
                onClick={() => {
                  setEditingId("");
                  setForm(emptyProduct);
                }}
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
          {status ? <p className="text-sm text-brandYellow">{status}</p> : null}
        </form>
      </section>

      <section className="brand-card p-4">
        <h2 className="mb-3 text-xl font-semibold text-brandYellow">Products</h2>
        <div className="space-y-3">
          {products.map((item) => (
            <div key={item._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/5 p-3">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-white/70">250g: Rs.{item.prices["250g"]}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="rounded-lg bg-brandYellow px-3 py-2 text-black" onClick={() => startEdit(item)}>
                  Edit
                </button>
                <button type="button" className="rounded-lg bg-red-600 px-3 py-2" onClick={() => deleteProduct(item._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="brand-card space-y-3 p-4">
        <h2 className="text-xl font-semibold text-brandYellow">Post Update / Reel / Post</h2>
        <form onSubmit={handleUpdateSubmit} className="space-y-3">
          <input
            placeholder="Title"
            required
            className="w-full rounded-xl border border-white/20 bg-black/30 p-3"
            value={updateForm.title}
            onChange={(e) => setUpdateForm((prev) => ({ ...prev, title: e.target.value }))}
          />
          <textarea
            placeholder="Description"
            className="h-20 w-full rounded-xl border border-white/20 bg-black/30 p-3"
            value={updateForm.content}
            onChange={(e) => setUpdateForm((prev) => ({ ...prev, content: e.target.value }))}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <select
              value={updateForm.type}
              onChange={(e) => setUpdateForm((prev) => ({ ...prev, type: e.target.value }))}
              className="w-full rounded-xl border border-white/20 bg-black/30 p-3"
            >
              <option value="update" className="text-black">update</option>
              <option value="post" className="text-black">post</option>
              <option value="reel" className="text-black">reel</option>
            </select>
            <input
              placeholder="Media URL (instagram/youtube/mp4/image)"
              className="w-full rounded-xl border border-white/20 bg-black/30 p-3"
              value={updateForm.mediaUrl}
              onChange={(e) => setUpdateForm((prev) => ({ ...prev, mediaUrl: e.target.value }))}
            />
          </div>
          <button type="submit" className="brand-btn-primary">
            Post Update
          </button>
          {updateStatus ? <p className="text-sm text-brandYellow">{updateStatus}</p> : null}
        </form>
      </section>

      <section className="brand-card p-4">
        <h2 className="mb-3 text-xl font-semibold text-brandYellow">Recent Updates</h2>
        <div className="space-y-3">
          {updates.slice(0, 10).map((item) => (
            <div key={item._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/5 p-3">
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-xs uppercase text-white/60">{item.type}</p>
              </div>
              <button
                type="button"
                className="rounded-lg bg-red-600 px-3 py-2 text-sm"
                onClick={() => deleteUpdate(item._id)}
              >
                Delete
              </button>
            </div>
          ))}
          {updates.length === 0 ? <p className="text-sm text-white/70">No updates posted yet.</p> : null}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="brand-card p-4">
          <h2 className="mb-3 text-xl font-semibold text-brandYellow">Recent Users</h2>
          <div className="space-y-2">
            {users.slice(0, 8).map((item) => (
              <p key={item._id} className="text-sm">
                {item.name} -{" "}
                <span className="text-white/70">{item.email || item.phone || "-"}</span>
              </p>
            ))}
          </div>
        </div>
        <div className="brand-card p-4">
          <h2 className="mb-3 text-xl font-semibold text-brandYellow">Recent Orders</h2>
          <div className="space-y-2">
            {orders.slice(0, 8).map((item) => (
              <p key={item._id} className="text-sm">
                #{item._id.slice(-6)} - Rs.{item.totalAmount}
              </p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
