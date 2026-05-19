import React, { useEffect, useState } from 'react';
import { getActiveParkingRecords, getEndedParkingRecords } from '../../apis/parkingApi';
import { FaMoneyBillWave, FaCar, FaRegCalendarAlt, FaCalendarDay } from 'react-icons/fa';

export default function Dashboard() {
  const [stats, setStats] = useState({
    monthlyIncome: 0,
    dailyIncome: 0,
    totalParked: 0,
    ongoingCount: 0,
    totalIncome: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [active, ended] = await Promise.all([
          getActiveParkingRecords(),
          getEndedParkingRecords()
        ]);

        const ongoingCount = active.length;
        const totalParked = ongoingCount + ended.length;

        let totalIncome = 0;
        let monthlyIncome = 0;
        let dailyIncome = 0;

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        ended.forEach(record => {
          const fee = Number(record.fullFees || 0);
          totalIncome += fee;

          const recordDate = new Date(record.parkEndTime);
          if (recordDate >= startOfMonth) {
            monthlyIncome += fee;
          }
          if (recordDate >= startOfDay) {
            dailyIncome += fee;
          }
        });

        setStats({ monthlyIncome, dailyIncome, totalParked, ongoingCount, totalIncome });
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (loading) return <div className="text-center py-10 font-bold text-gray-500">Loading Dashboard...</div>;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#071633] sm:text-3xl mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-xl shadow-sm border border-[#dce8f7] p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#64748b] uppercase tracking-wider mb-1">Monthly Income</p>
            <h3 className="text-2xl font-black text-[#10224a]">{formatCurrency(stats.monthlyIncome)}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <FaRegCalendarAlt size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#dce8f7] p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#64748b] uppercase tracking-wider mb-1">Daily Income</p>
            <h3 className="text-2xl font-black text-[#10224a]">{formatCurrency(stats.dailyIncome)}</h3>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <FaCalendarDay size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#dce8f7] p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#64748b] uppercase tracking-wider mb-1">Total Vehicles</p>
            <h3 className="text-2xl font-black text-[#10224a]">{stats.totalParked}</h3>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <FaCar size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#dce8f7] p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#64748b] uppercase tracking-wider mb-1">Ongoing Parkings</p>
            <h3 className="text-2xl font-black text-[#10224a]">{stats.ongoingCount}</h3>
          </div>
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
            <FaCar size={24} />
          </div>
        </div>
        
      </div>
      
      <div className="mt-6 bg-gradient-to-r from-[#0c67d9] to-[#18a84b] rounded-xl shadow-lg p-8 text-white flex items-center justify-between">
        <div>
           <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2">Total Accumulated Revenue</p>
           <h2 className="text-4xl font-black">{formatCurrency(stats.totalIncome)}</h2>
        </div>
        <div>
           <FaMoneyBillWave size={64} className="opacity-20" />
        </div>
      </div>
    </div>
  );
}
