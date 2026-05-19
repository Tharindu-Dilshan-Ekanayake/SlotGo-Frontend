import React, { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../../apis/userApi';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', email: '', role: 'counter', password: '' });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const itemsPerPage = 8;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handleOpenModal = (user = null) => {
    if (user) {
      setIsEditing(true);
      setFormData({ id: user.id, name: user.name || '', email: user.email || '', role: user.role || 'counter', password: '' });
    } else {
      setIsEditing(false);
      setFormData({ id: '', name: '', email: '', role: 'counter', password: '' });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        name: formData.name, 
        email: formData.email, 
        role: formData.role 
      };
      if (formData.password) {
        payload.password = formData.password;
      }
      
      if (isEditing) {
        await updateUser(formData.id, payload);
        toast.success('User updated successfully');
      } else {
        await createUser(payload);
        toast.success('User created successfully');
      }
      setModalOpen(false);
      loadUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to save user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
      loadUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
           <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#0c67d9]">Admin</p>
           <h1 className="mt-2 text-2xl font-extrabold text-[#071633] sm:text-3xl">User Management</h1>
        </div>
        <button onClick={() => handleOpenModal()} className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg bg-[#18a84b] px-4 text-sm font-extrabold text-white shadow-[0_10px_18px_rgba(24,168,75,0.22)] transition hover:bg-[#139241] active:translate-y-[1px]">Add New User</button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
        {loading ? <div className="p-8 text-center text-slate-500 font-bold">Loading...</div> : (
          <>
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 hidden md:block">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Name</div>
                <div className="col-span-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Email</div>
                <div className="col-span-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">Role</div>
                <div className="col-span-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">Actions</div>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {currentItems.map(user => (
                <div key={user.id} className="px-5 py-4 transition hover:bg-slate-50">
                  <div className="items-center hidden grid-cols-12 gap-3 md:grid">
                    <div className="col-span-4 text-[13px] font-bold text-slate-800">{user.name || 'N/A'}</div>
                    <div className="col-span-4 text-[13px] font-semibold text-slate-700">{user.email}</div>
                    <div className="col-span-2">
                       <span className={`inline-flex rounded-lg px-3 py-1.5 text-[12px] font-bold ${user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                          {user.role}
                       </span>
                    </div>
                    <div className="flex justify-end col-span-2 gap-2">
                      <button onClick={() => handleOpenModal(user)} className="rounded-lg bg-blue-600 px-4 py-2 text-[12px] font-bold text-white transition hover:bg-blue-700">Edit</button>
                      <button onClick={() => handleDelete(user.id)} className="rounded-lg bg-red-600 px-4 py-2 text-[12px] font-bold text-white transition hover:bg-red-700">Delete</button>
                    </div>
                  </div>

                  <div className="p-4 bg-white border shadow-sm md:hidden rounded-2xl border-slate-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[15px] font-bold text-slate-800">{user.name || 'N/A'}</div>
                        <div className="mt-1 text-[12px] text-slate-500">{user.email}</div>
                      </div>
                      <div className={`rounded-lg px-3 py-1 text-[11px] font-bold ${user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                        {user.role}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => handleOpenModal(user)} className="flex-1 rounded-xl bg-blue-600 py-3 text-[12px] font-bold text-white">Edit</button>
                      <button onClick={() => handleDelete(user.id)} className="flex-1 rounded-xl bg-red-600 py-3 text-[12px] font-bold text-white">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {currentItems.length === 0 && (
                <div className="px-6 py-8 text-center text-slate-500 font-bold">No users found</div>
              )}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={isEditing ? 'Edit User' : 'Create User'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold text-[#10224a] mb-1">Name</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-[#dce8f7] rounded-lg focus:outline-none focus:border-[#0c67d9]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#10224a] mb-1">Email</label>
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-[#dce8f7] rounded-lg focus:outline-none focus:border-[#0c67d9]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#10224a] mb-1">Role</label>
            <select
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
              className="w-full px-3 py-2 border border-[#dce8f7] rounded-lg focus:outline-none focus:border-[#0c67d9] bg-white"
            >
              <option value="admin">Admin</option>
              <option value="counter">Counter</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#10224a] mb-1">Password {isEditing && <span className="text-xs text-gray-400 font-normal">(Leave blank to keep current)</span>}</label>
            <input 
              type="password" 
              required={!isEditing}
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 border border-[#dce8f7] rounded-lg focus:outline-none focus:border-[#0c67d9]"
            />
          </div>
          <button type="submit" className="mt-4 bg-[#0c67d9] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#0a52b0] transition">
            {isEditing ? 'Save Changes' : 'Create User'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
