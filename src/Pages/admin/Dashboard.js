import React, { useEffect, useState } from 'react';
import { getActiveParkingRecords, getEndedParkingRecords } from '../../apis/parkingApi';
import { FaMoneyBillWave, FaCar, FaRegCalendarAlt, FaCalendarDay } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({
    monthlyIncome: 0,
    dailyIncome: 0,
    totalParked: 0,
    ongoingCount: 0,
    totalIncome: 0,
    weeklyData: [],
    recentActivity: []
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

        // Weekly chart data preparation
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          return {
            date: d.toLocaleDateString('en-US', { weekday: 'short' }),
            dateStr: d.toISOString().split('T')[0],
            income: 0
          };
        }).reverse();

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

          // Populate weekly data
          const recordDateStr = recordDate.toISOString().split('T')[0];
          const dayData = last7Days.find(d => d.dateStr === recordDateStr);
          if (dayData) {
            dayData.income += fee;
          }
        });

        // Recent activity
        const combined = [...active.map(r => ({ ...r, status: 'Ongoing', date: new Date(r.parkedTime) })),
                         ...ended.map(r => ({ ...r, status: 'Completed', date: new Date(r.parkEndTime) }))];
        
        combined.sort((a, b) => b.date - a.date);
        const recentActivity = combined.slice(0, 5);

        setStats({ monthlyIncome, dailyIncome, totalParked, ongoingCount, totalIncome, weeklyData: last7Days, recentActivity });
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

  const pieData = [
    { name: 'Ongoing', value: stats.ongoingCount },
    { name: 'Completed', value: stats.totalParked - stats.ongoingCount }
  ];
  const COLORS = ['#0c67d9', '#18a84b'];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#071633] sm:text-3xl mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-[#dce8f7] p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-[#071633] mb-4">Last 7 Days Revenue</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `Rs ${value}`} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="income" fill="#0c67d9" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-[#dce8f7] p-6">
          <h2 className="text-lg font-bold text-[#071633] mb-4">Parking Status Overview</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{fontSize: '12px', fontWeight: 'bold', color: '#64748b'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-[#dce8f7] lg:col-span-2 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#dce8f7]">
            <h2 className="text-lg font-bold text-[#071633]">Recent Activity</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition">
                <div>
                  <div className="font-bold text-[#071633] text-sm">{activity.vehicleNumber}</div>
                  <div className="text-xs text-slate-500 mt-1">{new Date(activity.date).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${activity.status === 'Ongoing' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>
                    {activity.status}
                  </span>
                  {activity.status === 'Completed' && (
                    <div className="font-extrabold text-green-700 text-sm mt-1">Rs. {Number(activity.fullFees).toFixed(2)}</div>
                  )}
                </div>
              </div>
            ))}
            {stats.recentActivity.length === 0 && (
              <div className="p-6 text-center text-slate-500 text-sm font-bold">No recent activity</div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0c67d9] to-[#18a84b] rounded-xl shadow-lg p-8 text-white flex flex-col justify-center">
           <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2 text-blue-100">Total Accumulated Revenue</p>
           <h2 className="text-4xl font-black mb-6">{formatCurrency(stats.totalIncome)}</h2>
           <FaMoneyBillWave size={64} className="opacity-20 absolute bottom-4 right-4" />
        </div>
      </div>
    </div>
  );
}
