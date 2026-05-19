import React, { useEffect, useState } from 'react';
import { getAvailableSlots, getSlots, createSlot, updateSlot, deleteSlot } from '../../apis/slotApi';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';

export default function Slot() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '' });

  const loadSlots = async () => {
    setLoading(true);
    try {
      const data = await getSlots();
      setSlots(data);
    } catch (error) {
      toast.error('Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const itemsPerPage = 8;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = slots.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(slots.length / itemsPerPage);

  const handleOpenModal = (slot = null) => {
    if (slot) {
      setIsEditing(true);
      setFormData({ id: slot.id, name: slot.name || '' });
    } else {
      setIsEditing(false);
      setFormData({ id: '', name: '' });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { name: formData.name };
      if (isEditing) {
        await updateSlot(formData.id, payload);
        toast.success('Slot updated successfully');
      } else {
        await createSlot(payload);
        toast.success('Slot created successfully');
      }
      setModalOpen(false);
      loadSlots();
    } catch (error) {
      toast.error('Failed to save slot');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slot?')) return;
    try {
      await deleteSlot(id);
      toast.success('Slot deleted');
      loadSlots();
    } catch (error) {
      toast.error('Failed to delete slot');
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
           <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#0c67d9]">Admin</p>
           <h1 className="mt-2 text-2xl font-extrabold text-[#071633] sm:text-3xl">Slot Management</h1>
        </div>
        <button onClick={() => handleOpenModal()} className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg bg-[#18a84b] px-4 text-sm font-extrabold text-white shadow-[0_10px_18px_rgba(24,168,75,0.22)] transition hover:bg-[#139241] active:translate-y-[1px]">Add New Slot</button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
        {loading ? <div className="p-8 text-center text-slate-500 font-bold">Loading...</div> : (
          <>
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 hidden md:block">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">ID</div>
                <div className="col-span-8 text-[11px] font-bold uppercase tracking-wider text-slate-500">Name</div>
                <div className="col-span-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">Actions</div>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {currentItems.map(slot => (
                <div key={slot.id} className="px-5 py-4 transition hover:bg-slate-50">
                  <div className="items-center hidden grid-cols-12 gap-3 md:grid">
                    <div className="col-span-2 text-[13px] font-bold text-slate-800">{slot.id}</div>
                    <div className="col-span-8 text-[13px] font-semibold text-slate-700">{slot.name || `Slot ${slot.id}`}</div>
                    <div className="flex justify-end col-span-2 gap-2">
                      <button onClick={() => handleOpenModal(slot)} className="rounded-lg bg-blue-600 px-4 py-2 text-[12px] font-bold text-white transition hover:bg-blue-700">Edit</button>
                      <button onClick={() => handleDelete(slot.id)} className="rounded-lg bg-red-600 px-4 py-2 text-[12px] font-bold text-white transition hover:bg-red-700">Delete</button>
                    </div>
                  </div>

                  <div className="p-4 bg-white border shadow-sm md:hidden rounded-2xl border-slate-200">
                    <div className="flex items-start justify-between">
                      <div className="text-[15px] font-bold text-slate-800">{slot.name || `Slot ${slot.id}`}</div>
                      <div className="rounded-lg bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-500">ID: {slot.id}</div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => handleOpenModal(slot)} className="flex-1 rounded-xl bg-blue-600 py-3 text-[12px] font-bold text-white">Edit</button>
                      <button onClick={() => handleDelete(slot.id)} className="flex-1 rounded-xl bg-red-600 py-3 text-[12px] font-bold text-white">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {currentItems.length === 0 && (
                <div className="px-6 py-8 text-center text-slate-500 font-bold">No slots found</div>
              )}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={isEditing ? 'Edit Slot' : 'Create Slot'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold text-[#10224a] mb-1">Slot Name</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-[#dce8f7] rounded-lg focus:outline-none focus:border-[#0c67d9]"
              placeholder="e.g. VIP Slot A"
            />
          </div>
          <button type="submit" className="mt-4 bg-[#0c67d9] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#0a52b0] transition">
            {isEditing ? 'Save Changes' : 'Create Slot'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
