import React, { useEffect, useState } from 'react'
import {
  FaArrowRight,
  FaBell,
  FaCarSide,
  FaChartLine,
  FaParking,
  FaPlay,
  FaQrcode,
  FaStopwatch,
  FaUser,
  FaMobileAlt,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaCogs,
  FaTicketAlt,
  FaClock
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import BGHOME from '../images/BGHome.png'
import NavBarWeB from '../components/NavBarWeB'
import { getPackages, getAdditionalPackages } from '../apis/packageApi'
import { createMessage } from '../apis/messagesApi'

const stats = [
  {
    icon: FaParking,
    value: '500+',
    label: 'Managed Slots',
    iconClass: 'bg-[#20c466] text-white',
  },
  {
    icon: FaCarSide,
    value: '12K+',
    label: 'Monthly Parks',
    iconClass: 'bg-[#ffc928] text-[#061b45]',
  },
  {
    icon: FaClock,
    value: '99.9%',
    label: 'Uptime',
    iconClass: 'bg-[#20c466] text-white',
  },
  {
    icon: FaChartLine,
    value: '30%',
    label: 'Revenue Increase',
    iconClass: 'bg-[#ffc928] text-[#061b45]',
  },
]

const featureCards = [
  {
    icon: FaQrcode,
    title: 'Instant QR Ticketing',
    text: 'Counter operators instantly generate scannable QR tickets for quick and secure vehicle entry and exit.',
    iconClass: 'bg-[#e7f0ff] text-[#0c67d9]',
  },
  {
    icon: FaStopwatch,
    title: 'Real-Time Live Tracking',
    text: 'Customers scan their ticket to track parking duration in real-time online via a secure link.',
    iconClass: 'bg-[#e8f9ed] text-[#169443]',
  },
  {
    icon: FaCogs,
    title: 'Automated Overdue Handling',
    text: 'System automatically switches to additional pricing packages if parking exceeds the standard duration.',
    iconClass: 'bg-[#fff1c7] text-[#c28200]',
  },
  {
    icon: FaChartLine,
    title: 'Detailed Admin Dashboard',
    text: 'Admins view detailed business reports, revenue analytics, and manage spaces efficiently in real-time.',
    iconClass: 'bg-[#eeebff] text-[#5b21b6]',
  },
]

const howItWorks = [
  {
    step: '01',
    title: 'Admin Configuration',
    text: 'System Administrators securely define the parking slots and flexible pricing packages (Standard & Additional overtime rules).',
    icon: FaCogs,
  },
  {
    step: '02',
    title: 'Arrival & QR Generation',
    text: 'Upon arrival, the Counter Operator inputs vehicle details, assigns a slot & package, and hands over an auto-generated QR Ticket.',
    icon: FaTicketAlt,
  },
  {
    step: '03',
    title: 'Live Ticket Tracking',
    text: 'The driver can scan the QR code via mobile at any time. It opens a customized live viewport showing exact allotted time left.',
    icon: FaMobileAlt,
  },
  {
    step: '04',
    title: 'Exit & Auto-Calculation',
    text: 'At exit, the counter ends the session. Owed amounts, including dynamically calculated extra fees, are settled instantly.',
    icon: FaQrcode,
  }
]

export default function Home() {
  const [standardPackages, setStandardPackages] = useState([])
  const [additionalPackages, setAdditionalPackages] = useState([])
  const [loadingPricing, setLoadingPricing] = useState(true)
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', queryScope: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.queryScope) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createMessage(formData);
      toast.success('Message sent successfully!');
      setFormData({ firstName: '', lastName: '', email: '', queryScope: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    async function loadPricing() {
      try {
        const [stdPacks, addPacks] = await Promise.all([
          getPackages(),
          getAdditionalPackages()
        ])
        setStandardPackages(stdPacks || [])
        setAdditionalPackages(addPacks || [])
      } catch (error) {
        console.error("Failed to load pricing packages", error)
      } finally {
        setLoadingPricing(false)
      }
    }
    loadPricing();
  }, [])

  return (
    <div className="min-h-screen w-full bg-white text-[#071633] font-sans">
      <NavBarWeB />

      <main className="overflow-x-hidden">
        {/* HERO SECTION */}
        <section id="home" className="relative min-h-[calc(90dvh-72px)]  px-5 pb-10 sm:px-10 lg:px-12 xl:px-[7vw] 2xl:px-[8vw]">
          <div className="pointer-events-none absolute -left-16 -top-20 h-36 w-36 rounded-full bg-[#ffc400]/80 blur-lg" />
          <div className="pointer-events-none absolute left-0 top-16 h-28 w-28 opacity-20 [background-image:radial-gradient(#f7c516_2px,transparent_2px)] [background-size:12px_12px]" />
          
          <div className="relative z-[1] grid items-center gap-8 py-10 lg:min-h-[clamp(400px,calc(90vh-330px),550px)] lg:grid-cols-[0.8fr_1.2fr] lg:py-16 2xl:grid-cols-[0.7fr_1.3fr]">
            <div className="w-full max-w-[600px]">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#0c67d9]/20 bg-[#e8f1ff] px-4 py-1.5 text-[12px] font-black uppercase tracking-wider text-[#0c67d9] shadow-sm">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0c67d9] opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0c67d9]"></span>
                </span>
                Smarter Parking Management
              </span>

              <h1 className="mt-5 text-balance text-[40px] font-black leading-[1.1] text-[#071633] sm:text-[52px] lg:text-[clamp(48px,4vw,62px)] 2xl:text-[68px] tracking-tight">
                Modernizing Parking <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0c67d9] to-[#18a84b]">
                  With QR Technology
                </span>
              </h1>

              <p className="mt-5 max-w-[540px] text-pretty text-base leading-relaxed text-[#455575] lg:text-lg lg:leading-8">
                SlotGo is an end-to-end smart parking counter software tailored to streamline vehicle entries, offer accurate live time tracking, and automate billing calculations effortlessly.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-8">
                <button
                  className="inline-flex h-12 min-w-[150px] items-center justify-center gap-3 rounded-xl bg-[#0c67d9] px-6 text-sm font-black text-white shadow-[0_12px_22px_rgba(12,103,217,0.28)] transition-transform duration-200 hover:-translate-y-1"
                  type="button"
                >
                  Start Parking Now
                  <FaArrowRight className="text-[13px]" aria-hidden="true" />
                </button>

                <button
                  className="inline-flex h-12 min-w-[150px] items-center justify-center gap-3 rounded-xl border-2 border-[#dce8f7] bg-white px-6 text-sm font-black text-[#071633] transition-colors duration-200 hover:border-[#0c67d9] hover:bg-[#f8fbff]"
                  type="button"
                >
                  Book a Demo
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#18a84b] text-white shadow-sm">
                    <FaPlay className="ml-0.5 text-[10px]" aria-hidden="true" />
                  </span>
                </button>
              </div>
            </div>

            <div className="relative -mr-5 flex min-h-[250px] items-end justify-end overflow-visible pb-3 sm:-mr-10 lg:-mr-12 lg:h-full lg:min-h-0 lg:pb-0 xl:-mr-[7vw] 2xl:-mr-[8vw]">
              <div className="absolute inset-0 m-auto h-[60%] w-[80%] rounded-full bg-[#18a84b]/15 blur-3xl lg:bottom-0 z-0" />
              <div className="absolute top-0 right-10 h-32 w-[50%] rounded-full bg-[#0c67d9]/15 blur-3xl z-0" />
              <img
                className="relative z-[1] ml-auto h-auto w-full max-w-[760px] object-contain object-right lg:max-h-[clamp(330px,calc(100vh-305px),540px)] lg:max-w-[910px] xl:max-h-[clamp(360px,calc(100vh-300px),570px)] xl:max-w-[1010px] 2xl:max-h-[610px] 2xl:max-w-[1100px] hover:scale-[1.02] transition-transform duration-700"
                src={BGHOME}
                alt="Smart parking with QR mobile ticket graphic"
              />
            </div>
          </div>

          {/* STATS SECTION - Integrated */}
          <div className="relative z-10 mt-12 lg:mt-0 lg:absolute lg:bottom-0 lg:left-1/2 lg:w-[calc(100%-40px)] lg:max-w-7xl lg:-translate-x-1/2 lg:translate-y-1/2">
            <div className="grid overflow-hidden rounded-[2rem] bg-[#071633] p-4 text-white shadow-2xl sm:grid-cols-2 lg:grid-cols-4 lg:p-4">
              {stats.map(({ icon: Icon, value, label, iconClass }, index) => (
                <div
                  key={label}
                  className={`flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-5 px-6 py-5 ${
                    index !== stats.length - 1 ? 'border-b sm:border-b-0 lg:border-r border-white/10' : ''
                  }`}
                >
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${iconClass.includes('20c466') ? 'from-[#18a84b] to-[#13823a]' : 'from-[#ffc400] to-[#d4a000]'}`}>
                    <Icon className={`text-[24px] ${iconClass.includes('20c466') ? 'text-white' : 'text-[#071633]'}`} aria-hidden="true" />
                  </div>
                  <div className="text-center sm:text-left">
                    <span className="block text-3xl font-black tracking-tight">{value}</span>
                    <span className="block mt-1 text-sm font-semibold text-slate-400">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="h-20 lg:h-32"></div> {/* Spacer for overlapping stats */}

        {/* FEATURES SECTION */}
        <section id="features" className="py-16 lg:py-20 px-5 sm:px-10 lg:px-12 xl:px-[7vw] 2xl:px-[8vw] bg-[#f8fbff]">
          <div className="grid gap-12 lg:flex-1 lg:gap-8 xl:grid-cols-[0.8fr_repeat(4,minmax(0,1fr))] items-center">
            <div className="md:col-span-2 xl:col-span-1 xl:pr-6">
              <span className="inline-flex rounded-full bg-[#18a84b]/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[#18a84b]">
                Key Features
              </span>
              <h2 className="mt-4 text-3xl font-black leading-tight text-[#071633] lg:text-4xl tracking-tight">
                Designed for Flawless Operation
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[#5c6882]">
                SlotGo empowers your parking attendants with highly responsive tools, minimizing processing time and avoiding revenue losses.
              </p>
            </div>

            {featureCards.map(({ icon: Icon, title, text, iconClass }) => (
              <article
                key={title}
                className="group flex flex-col rounded-[2rem] bg-white p-7 shadow-sm hover:shadow-2xl transition-all duration-300 border border-[#edf1f7] hover:-translate-y-2"
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${iconClass} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="text-[28px]" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-lg font-black text-[#071633] tracking-tight">{title}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[#5c6882]">{text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-16 lg:py-20 px-5 sm:px-10 lg:px-12 xl:px-[7vw] 2xl:px-[8vw] bg-white overflow-hidden">
          <div className="relative max-w-2xl mx-auto mb-16 text-center">
            <div className="absolute w-40 h-40 -translate-x-1/2 rounded-full -top-10 left-1/2 bg-blue-50 blur-3xl -z-10"></div>
            <p className="text-sm font-black tracking-widest uppercase text-[#0c67d9]">The Process</p>
            <h2 className="mt-3 text-4xl font-black text-[#071633] tracking-tight">How SlotGo Connects the Pieces</h2>
            <p className="mt-4 text-[17px] text-[#5c6882] leading-relaxed">A completely unified process establishing harmony between administrative control, counter operations, and the customer experience.</p>
          </div>
          
          <div className="relative grid gap-8 mx-auto md:grid-cols-2 lg:grid-cols-4 max-w-7xl">
            <div className="hidden lg:block absolute top-[52px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-[#dce8f7] via-[#0c67d9] to-[#dce8f7] z-0 opacity-50"></div>
            {howItWorks.map((item, index) => (
              <div key={index} className="relative z-10 flex flex-col items-center mt-8 text-center group lg:mt-0">
                <div className="absolute -top-6 text-[100px] font-black text-slate-50 opacity-50 select-none pointer-events-none group-hover:-translate-y-4 transition-transform duration-500">{item.step}</div>
                <div className="w-[104px] h-[104px] bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.08)] mb-6 group-hover:scale-110 transition-transform duration-300 relative">
                  <div className="absolute inset-2 rounded-full border border-dashed border-[#0c67d9]/30 animate-[spin_10s_linear_infinite]"></div>
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#0c67d9] to-[#04359a] text-white shadow-inner">
                    <item.icon className="text-2xl" />
                  </span>
                </div>
                <h3 className="text-xl font-black text-[#10224a] mb-4 tracking-tight">{item.title}</h3>
                <p className="text-[15px] text-[#5c6882] leading-relaxed max-w-[260px]">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING SECTION - DYNAMIC */}
        <section id="pricing" className="py-16 lg:py-20 px-5 sm:px-10 lg:px-12 xl:px-[7vw] 2xl:px-[8vw] bg-gradient-to-b from-[#071633] to-[#0a1e45] text-white">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[#ffc400] mb-4 border border-white/20">
              Live Configuration
            </span>
            <h2 className="text-4xl font-black tracking-tight lg:text-5xl">Live Assigned Packaging</h2>
            <p className="mt-5 text-lg text-[#8a99ba] leading-relaxed">Below reflect the exact active standard durations and overtime penalty packages generated inside the SlotGo administration panel right now.</p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            {loadingPricing ? (
              <div className="flex justify-center py-20 text-xl font-bold text-white/50">Loading configuration from database...</div>
            ) : (
              <div className="flex flex-col gap-10 lg:flex-row">
                {/* Standard Packages Box */}
                <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 lg:p-10 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="bg-[#18a84b]/20 p-4 rounded-2xl">
                       <FaTicketAlt className="text-[#20c466] text-2xl" />
                     </div>
                     <div>
                       <h3 className="text-2xl font-black">Standard Entries</h3>
                       <p className="mt-1 text-sm text-slate-400">Default parking options</p>
                     </div>
                  </div>
                  
                  {standardPackages.length === 0 ? (
                    <div className="py-10 text-center text-white/40">No standard packages initialized.</div>
                  ) : (
                    <div className="grid gap-4">
                      {standardPackages.map(pkg => (
                        <div key={pkg.id} className="flex items-center justify-between p-5 transition-colors border group bg-white/5 border-white/10 rounded-2xl hover:bg-white/10">
                          <span className="text-lg font-bold">{pkg.timeDuration}</span>
                          <div className="text-right">
                             <div className="text-2xl font-black text-[#20c466]">Rs. {Number(pkg.packagePrice).toLocaleString('en-LK', {minimumFractionDigits: 2})}</div>
                             {pkg.offer > 0 && <div className="text-xs font-bold text-[#ffc400] bg-[#ffc400]/10 inline-block px-2 py-0.5 rounded-full mt-1">Limited {pkg.offer}% Discount Applied</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Additional Packages Box */}
                <div className="flex-1 bg-gradient-to-br from-[#0c67d9]/20 to-transparent border border-[#0c67d9]/30 rounded-[2.5rem] p-8 lg:p-10 relative">
                  <div className="absolute top-8 right-8 animate-pulse text-[#0c67d9]">
                    <FaClock size={28} />
                  </div>
                  <div className="flex items-center gap-4 mb-8">
                     <div className="bg-[#0c67d9]/20 p-4 rounded-2xl">
                       <FaStopwatch className="text-[#0c67d9] text-2xl" />
                     </div>
                     <div>
                       <h3 className="text-2xl font-black">Overdue Additionals</h3>
                       <p className="mt-1 text-sm text-blue-200">Auto-applied charges upon delayed exit</p>
                     </div>
                  </div>

                  {additionalPackages.length === 0 ? (
                    <div className="py-10 text-center text-white/40">No overtime packages initialized.</div>
                  ) : (
                     <div className="grid gap-4">
                      {additionalPackages.map(pkg => (
                        <div key={pkg.id} className="flex justify-between items-end p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-[#0c67d9]/50 transition-colors">
                          <div>
                            <span className="text-[#8a99ba] text-xs font-bold uppercase tracking-wider block mb-1">Additional</span>
                            <span className="text-lg font-bold">{pkg.hours} Hours</span>
                          </div>
                          <div className="text-right">
                             <div className="text-2xl font-black">Rs. {Number(pkg.fee).toLocaleString('en-LK', {minimumFractionDigits: 2})}</div>
                             {pkg.discount > 0 && <div className="text-xs font-bold text-[#ffc400] bg-[#ffc400]/10 inline-block px-2 py-0.5 rounded-full mt-1">-{pkg.discount}% Off</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ABOUT US & CONTACT */}
        <section id="about" className="py-16 lg:py-20 px-5 sm:px-10 lg:px-12 xl:px-[7vw] 2xl:px-[8vw] bg-[#f8fbff]">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 max-w-7xl mx-auto items-center">
            {/* About & Stats */}
            <div className="flex flex-col justify-center">
              <p className="text-sm font-black tracking-widest uppercase text-[#18a84b]">About SlotGo Core</p>
              <h2 className="mt-4 text-4xl font-black text-[#071633] tracking-tight leading-[1.15]">Engineering the Future of Traffic Fluidity & Control</h2>
              <p className="mt-6 text-[#5c6882] text-[17px] leading-relaxed">
                SlotGo is built closely aligned with modern parking administrative requirements. It replaces legacy ticket punching with cryptographic QR generations. 
                <br /><br />
                The system provides an immediate birds-eye view connecting physical ground counter terminals with remote administration screens seamlessly scaling to handle thousands of cars daily automatically allocating penalty invoices to overstayed timelines.
              </p>
              
              <div className="grid gap-5 mt-10 sm:grid-cols-2">
                <div className="bg-[#f8fbff] border border-[#dce8f7] p-6 rounded-2xl">
                  <h4 className="font-black text-[#0c67d9] text-3xl">Sub-2s</h4>
                  <p className="text-sm font-bold text-[#64748b] mt-2">QR Scan Generation</p>
                </div>
                <div className="bg-[#e8f9ed] border border-[#c1ebd0] p-6 rounded-2xl">
                  <h4 className="font-black text-[#169443] text-3xl">100%</h4>
                  <p className="text-sm font-bold text-[#64748b] mt-2">Digital Trackability</p>
                </div>
              </div>
            </div>

            {/* Premium Contact Form */}
            <div id="contact" className="bg-white border rounded-[2.5rem] p-8 sm:p-12 shadow-[0_30px_60px_rgba(12,103,217,0.08)] relative overflow-hidden flex flex-col">
              <div className="absolute rounded-full pointer-events-none -top-24 -right-24 w-60 h-60 bg-blue-50 blur-3xl"></div>
              
              <div className="relative z-10 flex-1">
                <h3 className="text-3xl font-black text-[#071633] mb-2 tracking-tight">Need Support?</h3>
                <p className="text-[#5c6882] mb-8 text-sm">Fill in the shape and we will get our team immediately.</p>
                
                <form onSubmit={handleMessageSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#10224a] uppercase tracking-wider">First Name</label>
                      <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-5 py-3.5 bg-[#f8fbff] border border-[#dce8f7] rounded-xl focus:outline-none focus:border-[#0c67d9] focus:ring-2 focus:ring-[#0c67d9]/20 transition-all font-semibold text-[#071633]" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#10224a] uppercase tracking-wider">Last Name</label>
                      <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full px-5 py-3.5 bg-[#f8fbff] border border-[#dce8f7] rounded-xl focus:outline-none focus:border-[#0c67d9] focus:ring-2 focus:ring-[#0c67d9]/20 transition-all font-semibold text-[#071633]" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#10224a] uppercase tracking-wider">Email Contact</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-3.5 bg-[#f8fbff] border border-[#dce8f7] rounded-xl focus:outline-none focus:border-[#0c67d9] focus:ring-2 focus:ring-[#0c67d9]/20 transition-all font-semibold text-[#071633]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#10224a] uppercase tracking-wider">Query Scope</label>
                    <textarea rows="3" value={formData.queryScope} onChange={e => setFormData({...formData, queryScope: e.target.value})} className="w-full px-5 py-3.5 bg-[#f8fbff] border border-[#dce8f7] rounded-xl focus:outline-none focus:border-[#0c67d9] focus:ring-2 focus:ring-[#0c67d9]/20 transition-all font-semibold text-[#071633] resize-none"></textarea>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-[#0c67d9] hover:bg-[#084da8] hover:-translate-y-0.5 active:translate-y-0 transition-all text-white font-black rounded-xl shadow-[0_8px_16px_rgba(12,103,217,0.2)] mt-2 disabled:opacity-50">
                    {isSubmitting ? 'Submitting...' : 'Submit Query'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* FAT FOOTER */}
        <footer className="bg-[#f8fbff] border-t border-[#dce8f7] pt-16 pb-8 px-5 sm:px-10 lg:px-12 xl:px-[7vw] 2xl:px-[8vw]">
          <div className="flex flex-col items-center justify-between gap-6 mx-auto mb-10 max-w-7xl md:flex-row">
            <div className="text-2xl font-black text-[#0c67d9]">SlotGo</div>
            <div className="flex flex-wrap gap-8 items-center text-sm font-bold text-[#10224a]">
              <a href="#about" className="hover:text-[#0c67d9] transition">About Us</a>
              <a href="#how-it-works" className="hover:text-[#0c67d9] transition">Workflow</a>
              <a href="#pricing" className="hover:text-[#0c67d9] transition">Configurations</a>
              <a href="#features" className="hover:text-[#0c67d9] transition">Technology</a>
              <a href="#contact" className="hover:text-[#0c67d9] transition">Support</a>
            </div>
            <div className="flex gap-4">
               <a href="mailto:support@slotgo.com" className="w-10 h-10 rounded-full bg-white border border-[#dce8f7] shadow-sm flex items-center justify-center text-[#64748b] hover:text-[#0c67d9] hover:border-[#0c67d9] transition"><FaEnvelope /></a>
               <a href="tel:000000" className="w-10 h-10 rounded-full bg-white border border-[#dce8f7] shadow-sm flex items-center justify-center text-[#64748b] hover:text-[#0c67d9] hover:border-[#0c67d9] transition"><FaPhone /></a>
            </div>
          </div>
          <div className="text-center text-xs font-semibold text-slate-400 max-w-7xl mx-auto border-t border-[#dce8f7] pt-8">
            <p>© {new Date().getFullYear()} SlotGo Automated Parking Systems. All Rights Reserved. Engineered for excellence.</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
  
