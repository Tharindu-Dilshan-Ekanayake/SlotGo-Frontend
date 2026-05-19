import React, { useEffect, useState } from 'react';
import { getPackages, createPackage, updatePackage, deletePackage, getAdditionalPackages, createAdditionalPackage, updateAdditionalPackage, deleteAdditionalPackage } from '../../apis/packageApi';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';

export default function Package() {
  const [packages, setPackages] = useState([]);
  const [additionalPackages, setAdditionalPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('standard'); // 'standard' or 'additional'
  const [currentPage, setCurrentPage] = useState(1);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // Shared structural state, map dynamically below
  const [formData, setFormData] = useState({ id: '', duration: '', price: '', discount: 0, activeStatus: true });

  const loadData = async () => {
    setLoading(true);
    try {
      const [packs, additionalPacks] = await Promise.all([
        getPackages(),
        getAdditionalPackages()
      ]);
      setPackages(packs);
      setAdditionalPackages(additionalPacks);
    } catch (error) {
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [view]);

  const handleOpenModal = (pkg = null) => {
    if (pkg) {
      setIsEditing(true);
      if (view === 'standard') {
        setFormData({ 
          id: pkg.id, 
          duration: pkg.timeDuration || '', 
          price: pkg.packagePrice || '', 
          discount: pkg.offer || 0,
          activeStatus: pkg.activeStatus !== false 
        });
      } else {
        setFormData({ 
          id: pkg.id, 
          duration: pkg.hours || '', 
          price: pkg.fee || '', 
          discount: pkg.discount || 0,
          activeStatus: true // Not used for additional, just default
        });
      }
    } else {
      setIsEditing(false);
      setFormData({ id: '', duration: '', price: '', discount: 0, activeStatus: true });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (view === 'standard') {
        const payload = { 
          timeDuration: String(formData.duration),
          packagePrice: Number(formData.price),
          offer: Number(formData.discount),
          activeStatus: formData.activeStatus
        };
        if (isEditing) {
          await updatePackage(formData.id, payload);
          toast.success('Package updated');
        } else {
          await createPackage(payload);
          toast.success('Package created');
        }
      } else {
        const payload = { 
          hours: Number(formData.duration),
          fee: Number(formData.price),
          discount: Number(formData.discount)
        };
        if (isEditing) {
          await updateAdditionalPackage(formData.id, payload);
          toast.success('Additional Package updated');
        } else {
          await createAdditionalPackage(payload);
          toast.success('Additional Package created');
        }
      }
      setModalOpen(false);
      loadData();
    } catch (error) {
      toast.error('Failed to save package');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      if (view === 'standard') {
        await deletePackage(id);
      } else {
        await deleteAdditionalPackage(id);
      }
      toast.success('Package deleted');
      loadData();
    } catch (error) {
      toast.error('Failed to delete package');
    }
  };

  const currentList = view === 'standard' ? packages : additionalPackages;
  const itemsPerPage = 8;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = currentList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(currentList.length / itemsPerPage);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
           <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#0c67d9]">Admin</p>
           <h1 className="mt-2 text-2xl font-extrabold text-[#071633] sm:text-3xl">Packages</h1>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setView('standard')} className={`px-4 py-2 text-sm rounded-lg font-bold transition ${view === 'standard' ? 'bg-[#0c67d9] text-white shadow' : 'bg-white border border-[#dce8f7] text-[#64748b]'}`}>
             Standard
          </button>
          <button onClick={() => setView('additional')} className={`px-4 py-2 text-sm rounded-lg font-bold transition ${view === 'additional' ? 'bg-[#0c67d9] text-white shadow' : 'bg-white border border-[#dce8f7] text-[#64748b]'}`}>
             Additional
          </button>
          <button onClick={() => handleOpenModal()} className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg bg-[#18a84b] px-4 text-sm font-extrabold text-white shadow-[0_10px_18px_rgba(24,168,75,0.22)] transition hover:bg-[#139241] active:translate-y-[1px] ml-4">
             Add {view === 'standard' ? 'Package' : 'Extra'}
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
        {loading ? <div className="p-8 text-center text-slate-500 font-bold">Loading...</div> : (
          <>
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 hidden md:block">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Duration</div>
                <div className="col-span-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Price</div>
                <div className="col-span-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">Discount</div>
                {view === 'standard' && <div className="col-span-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</div>}
                <div className={`text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right ${view === 'standard' ? 'col-span-2' : 'col-span-4'}`}>Actions</div>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {currentItems.map(pkg => {
                const duration = view === 'standard' ? pkg.timeDuration : `${pkg.hours} hours`;
                const price = view === 'standard' ? Number(pkg.packagePrice) : Number(pkg.fee);
                const discount = view === 'standard' ? pkg.offer : pkg.discount;

                return (
                  <div key={pkg.id} className="px-5 py-4 transition hover:bg-slate-50">
                    <div className="items-center hidden grid-cols-12 gap-3 md:grid">
                      <div className="col-span-3 text-[13px] font-bold text-slate-800">{duration}</div>
                      <div className="col-span-3 text-[13px] font-semibold text-slate-700">Rs. {price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</div>
                      <div className="col-span-2 text-[13px] font-semibold text-slate-500">{discount}%</div>
                      {view === 'standard' && (
                        <div className="col-span-2">
                          <span className={`px-2 py-1 rounded-lg text-[11px] font-bold ${pkg.activeStatus !== false ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {pkg.activeStatus !== false ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      )}
                      <div className={`flex justify-end gap-2 ${view === 'standard' ? 'col-span-2' : 'col-span-4'}`}>
                        <button onClick={() => handleOpenModal(pkg)} className="rounded-lg bg-blue-600 px-4 py-2 text-[12px] font-bold text-white transition hover:bg-blue-700">Edit</button>
                        <button onClick={() => handleDelete(pkg.id)} className="rounded-lg bg-red-600 px-4 py-2 text-[12px] font-bold text-white transition hover:bg-red-700">Delete</button>
                      </div>
                    </div>

                    <div className="p-4 bg-white border shadow-sm md:hidden rounded-2xl border-slate-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-[15px] font-bold text-slate-800">{duration}</div>
                          <div className="mt-1 text-[12px] text-slate-500">Rs. {price.toFixed(2)}</div>
                        </div>
                        {view === 'standard' && (
                          <div className={`rounded-lg px-3 py-1 text-[11px] font-bold ${pkg.activeStatus !== false ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {pkg.activeStatus !== false ? 'Active' : 'Inactive'}
                          </div>
                        )}
                        {view === 'additional' && (
                          <div className="rounded-lg bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
                            Disc: {discount}%
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => handleOpenModal(pkg)} className="flex-1 rounded-xl bg-blue-600 py-3 text-[12px] font-bold text-white">Edit</button>
                        <button onClick={() => handleDelete(pkg.id)} className="flex-1 rounded-xl bg-red-600 py-3 text-[12px] font-bold text-white">Delete</button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {currentItems.length === 0 && (
                <div className="px-6 py-8 text-center text-slate-500 font-bold">No packages found</div>
              )}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={isEditing ? 'Edit Package' : 'Create Package'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold text-[#10224a] mb-1">
               {view === 'standard' ? 'Time Duration Name (e.g., "2 Hours")' : 'Time Duration in Hours (e.g., 2)'}
            </label>
            <input 
              required
              type={view === 'standard' ? "text" : "number"}
              value={formData.duration}
              onChange={e => setFormData({...formData, duration: e.target.value})}
              className="w-full px-3 py-2 border border-[#dce8f7] rounded-lg focus:outline-none focus:border-[#0c67d9]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#10224a] mb-1">Price (Rs)</label>
            <input 
              required
              type="number" 
              step="0.01"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
              className="w-full px-3 py-2 border border-[#dce8f7] rounded-lg focus:outline-none focus:border-[#0c67d9]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#10224a] mb-1">Discount/Offer (%)</label>
            <input 
              required
              type="number" 
              min="0" max="100"
              value={formData.discount}
              onChange={e => setFormData({...formData, discount: e.target.value})}
              className="w-full px-3 py-2 border border-[#dce8f7] rounded-lg focus:outline-none focus:border-[#0c67d9]"
            />
          </div>
          {view === 'standard' && (
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={formData.activeStatus}
                onChange={e => setFormData({...formData, activeStatus: e.target.checked})}
                id="activeStatusCheckbox"
              />
              <label htmlFor="activeStatusCheckbox" className="text-sm font-bold text-[#10224a]">Is Active</label>
            </div>
          )}
          <button type="submit" className="mt-4 bg-[#0c67d9] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#0a52b0] transition">
            {isEditing ? 'Save Changes' : 'Submit'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
