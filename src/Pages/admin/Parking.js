import React, { useEffect, useState } from 'react';
import { getActiveParkingRecords, getEndedParkingRecords } from '../../apis/parkingApi';
import toast from 'react-hot-toast';
import { FaRedo } from "react-icons/fa";

export default function Parking() {
  const [activeParking, setActiveParking] = useState([]);
  const [endedParking, setEndedParking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('ongoing'); // 'ongoing' or 'ended'

  const loadData = async () => {
    setLoading(true);
    try {
      const [active, ended] = await Promise.all([
        getActiveParkingRecords(),
        getEndedParkingRecords()
      ]);
      setActiveParking(active);
      setEndedParking(ended);
    } catch (error) {
      toast.error('Failed to load parking records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const records = view === 'ongoing' ? activeParking : endedParking;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
           <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#0c67d9]">Admin</p>
           <h1 className="mt-2 text-2xl font-extrabold text-[#071633] sm:text-3xl">Parking Management</h1>
        </div>

        <div className="flex gap-2">
           <button 
             onClick={() => setView('ongoing')} 
             className={`px-4 py-2 text-sm rounded-lg font-bold transition ${view === 'ongoing' ? 'bg-[#0c67d9] text-white shadow' : 'bg-white border border-[#dce8f7] text-[#64748b]'}`}
           >
             Ongoing Parking
           </button>
           <button 
             onClick={() => setView('ended')} 
             className={`px-4 py-2 text-sm rounded-lg font-bold transition ${view === 'ended' ? 'bg-[#0c67d9] text-white shadow' : 'bg-white border border-[#dce8f7] text-[#64748b]'}`}
           >
             Old Parking
           </button>
           <button onClick={loadData} className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg border border-[#b8d5f0] bg-white px-4 text-sm font-extrabold text-[#0c67d9] transition hover:border-[#0c67d9] active:translate-y-[1px] ml-4">
             <FaRedo className="text-[13px]" />
             Refresh
           </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
        {loading ? <div className="p-8 text-center text-slate-500 font-bold">Loading...</div> : (
          <>
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 hidden md:block">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Vehicle</div>
                <div className="col-span-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">Slot</div>
                <div className="col-span-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Time</div>
                {view === 'ended' && <div className="col-span-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">Fee</div>}
                <div className={`text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right ${view === 'ended' ? 'col-span-2' : 'col-span-4'}`}>Status</div>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {records.map(record => (
                <div key={record.id} className="px-5 py-4 transition hover:bg-slate-50">
                  <div className="items-center hidden grid-cols-12 gap-3 md:grid">
                    <div className="col-span-3">
                       <div className="text-[13px] font-bold text-slate-800">{record.vehicleNumber}</div>
                       <div className="mt-1 text-[11px] text-slate-400">{record.token || '-'}</div>
                    </div>
                    <div className="col-span-2">
                       <div className="inline-flex rounded-lg bg-blue-50 px-3 py-1.5 text-[12px] font-bold text-blue-700">
                         {record.parkingSlot?.name || `Slot ${record.slotId}`}
                       </div>
                    </div>
                    <div className="col-span-3">
                       <div className="text-[12px] font-bold text-slate-700">{new Date(record.parkedTime).toLocaleString()}</div>
                       {view === 'ended' && <div className="mt-1 text-[11px] text-red-500">{new Date(record.parkEndTime).toLocaleString()}</div>}
                    </div>
                    {view === 'ended' && (
                      <div className="col-span-2">
                        <div className="text-[14px] font-extrabold text-green-700">Rs. {Number(record.fullFees || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 })}</div>
                      </div>
                    )}
                    <div className={`flex justify-end col-span-${view === 'ended' ? '2' : '4'}`}>
                       <span className={`px-3 py-1.5 rounded-lg text-[11px] font-bold ${view === 'ongoing' ? 'bg-yellow-50 text-yellow-700' : 'bg-slate-100 text-slate-600'}`}>
                          {view === 'ongoing' ? 'Ongoing' : 'Completed'}
                       </span>
                    </div>
                  </div>

                  <div className="p-4 bg-white border shadow-sm md:hidden rounded-2xl border-slate-200">
                    <div className="flex items-start justify-between">
                      <div className="text-[15px] font-bold text-slate-800">{record.vehicleNumber}</div>
                      <span className={`px-3 py-1 rounded-lg text-[11px] font-bold ${view === 'ongoing' ? 'bg-yellow-50 text-yellow-700' : 'bg-slate-100 text-slate-600'}`}>
                         {view === 'ongoing' ? 'Ongoing' : 'Completed'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="rounded-lg bg-blue-50 px-3 py-1.5 text-[12px] font-bold text-blue-700">
                        {record.parkingSlot?.name || `Slot ${record.slotId}`}
                      </div>
                      {view === 'ended' && (
                        <div className="text-[14px] font-extrabold text-green-700">Rs. {Number(record.fullFees || 0).toFixed(2)}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {records.length === 0 && (
                <div className="px-6 py-8 text-center text-slate-500 font-bold">No {view} parking records found</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
