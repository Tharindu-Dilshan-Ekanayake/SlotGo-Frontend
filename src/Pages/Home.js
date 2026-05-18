import React from 'react'
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
} from 'react-icons/fa'
import BGHOME from '../images/BGHome.png'
import NavBarWeB from '../components/NavBarWeB'


const quickFeatures = [
  {
    icon: FaQrcode,
    title: 'QR Based Entry',
    text: 'Scan & Park',
    iconClass: 'bg-[#ffc928] text-[#0a4fb3]',
  },
  {
    icon: FaStopwatch,
    title: 'Real-time Tracking',
    text: 'Live Updates',
    iconClass: 'bg-[#0c67d9] text-white',
  },
  {
    icon: FaBell,
    title: 'Smart Notifications',
    text: 'Stay Informed',
    iconClass: 'bg-[#20b84f] text-white',
  },
]

const stats = [
  {
    icon: FaParking,
    value: '500+',
    label: 'Parking Slots',
    iconClass: 'bg-[#20c466] text-white',
  },
  {
    icon: FaCarSide,
    value: '1200+',
    label: 'Vehicles Parked',
    iconClass: 'bg-[#ffc928] text-[#061b45]',
  },
  {
    icon: FaUser,
    value: '800+',
    label: 'Happy Users',
    iconClass: 'bg-[#20c466] text-white',
  },
  {
    icon: FaChartLine,
    value: '98%',
    label: 'Satisfaction Rate',
    iconClass: 'bg-[#ffc928] text-[#061b45]',
  },
]

const featureCards = [
  {
    icon: FaQrcode,
    title: 'QR Ticketing',
    text: 'Generate and scan QR tickets for quick and secure entry and exit.',
    iconClass: 'bg-[#e7f0ff] text-[#0c67d9]',
  },
  {
    icon: FaStopwatch,
    title: 'Live Tracking',
    text: 'Track parking duration in real time and calculate costs instantly.',
    iconClass: 'bg-[#e8f9ed] text-[#169443]',
  },
  {
    icon: FaBell,
    title: 'Smart Notifications',
    text: 'Send instant alerts for entry, exit, payment, and important updates.',
    iconClass: 'bg-[#fff1c7] text-[#c28200]',
  },
  {
    icon: FaChartLine,
    title: 'Reports & Analytics',
    text: 'View detailed reports and analytics to manage parking efficiently.',
    iconClass: 'bg-[#e7f0ff] text-[#0c67d9]',
  },
]


export default function Home() {
  return (
    <div id="home" className="min-h-screen w-full bg-[#eef6ff] text-[#071633]">
      <NavBarWeB />

      <main className="relative min-h-[calc(100dvh-72px)] overflow-x-hidden bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_60%,#eef6ff_60%,#eef6ff_100%)]">
        <div className="pointer-events-none absolute -left-16 -top-20 h-36 w-36 rounded-full bg-[#ffc400]" />
        <div className="pointer-events-none absolute left-0 top-16 h-28 w-28 opacity-30 [background-image:radial-gradient(#f7c516_1px,transparent_1px)] [background-size:10px_10px]" />
        <div className="absolute inset-x-0 top-0 pointer-events-none h-36 " />

        <section className="relative flex w-full flex-col px-5 pb-14  sm:px-10 sm:pb-16 lg:px-12 lg:pb-16  xl:min-h-[calc(100dvh-72px)] xl:px-[7vw] xl:pb-16  2xl:px-[8vw]">
          <div className="relative z-[1] grid items-center gap-8 py-2 lg:min-h-[clamp(430px,calc(100vh-330px),580px)] lg:grid-cols-[0.74fr_1.26fr] lg:py-0 2xl:grid-cols-[0.68fr_1.32fr]">
            <div className="w-full max-w-[560px]">
              <span className="inline-flex rounded-md bg-[#e8f1ff] px-3 py-1 text-[11px] font-extrabold uppercase text-[#115dcc]">
                Smarter Parking, Better Experience
              </span>

              <h1 className="mt-4 max-w-[580px] text-balance text-[40px] font-extrabold leading-[1.07] text-[#071633] sm:text-[52px] lg:text-[clamp(44px,3.8vw,58px)] 2xl:text-[62px]">
                Smart Parking
                <br />
                Made Simple
              </h1>

              <p className="mt-4 max-w-[520px] text-pretty text-[15px] leading-7 text-[#455575] lg:leading-[1.72] 2xl:text-base">
                SlotGo is a smart parking management system that makes parking easy for everyone with QR
                technology, real-time tracking, and instant notifications.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-6">
                <button
                  className="inline-flex h-11 min-w-[142px] items-center justify-center gap-3 rounded-lg bg-[#f7bd13] px-5 text-sm font-extrabold text-[#171000] shadow-[0_12px_22px_rgba(247,189,19,0.28)] transition-transform duration-200 active:translate-y-[1px]"
                  type="button"
                >
                  Get Started
                  <FaArrowRight className="text-[13px]" aria-hidden="true" />
                </button>

                <button
                  className="inline-flex h-11 min-w-[142px] items-center justify-center gap-3 rounded-lg border border-[#19ad4f] bg-white px-5 text-sm font-extrabold text-[#172342] transition-transform duration-200 active:translate-y-[1px]"
                  type="button"
                >
                  Watch Demo
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#19ad4f] text-[#19ad4f]">
                    <FaPlay className="ml-0.5 text-[9px]" aria-hidden="true" />
                  </span>
                </button>
              </div>

              <div className="mt-8 grid max-w-[650px] gap-5 sm:grid-cols-3 lg:gap-4">
                {quickFeatures.map(({ icon: Icon, title, text, iconClass }) => (
                  <div key={title} className="flex items-center min-w-0 gap-3">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconClass}`}>
                      <Icon className="text-[17px]" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[12px] font-bold text-[#1c2b55]">{title}</span>
                      <span className="block text-[11px] text-[#62708c]">{text}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative -mr-5 flex min-h-[280px] items-end justify-end overflow-visible pb-3 sm:-mr-10 lg:-mr-12 lg:h-full lg:min-h-0 lg:pb-0 xl:-mr-[7vw] 2xl:-mr-[8vw]">
              <div className="absolute bottom-7 right-4 h-24 w-[74%] rounded-full bg-[#cdddf2] blur-2xl lg:bottom-4" />
              <img
                className="relative z-[1] ml-auto h-auto w-full max-w-[760px] object-contain object-right lg:max-h-[clamp(330px,calc(100vh-305px),540px)] lg:max-w-[910px] xl:max-h-[clamp(360px,calc(100vh-300px),570px)] xl:max-w-[1010px] 2xl:max-h-[610px] 2xl:max-w-[1100px]"
                src={BGHOME}
                alt="Smart parking with QR mobile ticket"
              />
            </div>
          </div>

          <div className="relative z-10 grid shrink-0 overflow-hidden rounded-2xl bg-[linear-gradient(90deg,#075ad8_0%,#064ac2_48%,#04359a_100%)] p-3 text-white shadow-[0_24px_50px_rgba(4,53,154,0.28)] sm:grid-cols-2 lg:-mt-12 lg:grid-cols-4 lg:p-3 xl:-mt-14">
            {stats.map(({ icon: Icon, value, label, iconClass }, index) => (
              <div
                key={label}
                className={`flex items-center gap-4 px-5 py-3 ${
                  index !== stats.length - 1 ? 'lg:border-r lg:border-white/25' : ''
                }`}
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconClass}`}>
                  <Icon className="text-[19px]" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-2xl font-extrabold leading-none">{value}</span>
                  <span className="block mt-1 text-xs font-medium text-white/85">{label}</span>
                </span>
              </div>
            ))}
          </div>

          <div id="features" className="grid gap-5 pt-8 md:grid-cols-2 lg:flex-1 lg:gap-5 lg:pt-8 xl:grid-cols-[0.78fr_repeat(4,minmax(0,1fr))]">
            <div className="py-1 md:col-span-2 xl:col-span-1 xl:pr-4">
              <p className="text-xs font-bold uppercase text-[#18a84b]">Features</p>
              <h2 className="mt-2 text-balance text-[25px] font-extrabold leading-tight text-[#071633] lg:text-[22px] xl:text-[25px]">
                Everything You Need for Smart Parking
              </h2>
              <p className="mt-3 text-pretty text-sm leading-6 text-[#5c6882] lg:mt-3 lg:text-[13px] lg:leading-5">
                Powerful features for a seamless parking experience for admins, staff, and users.
              </p>
              <button
                className="mt-5 inline-flex h-11 items-center justify-center gap-3 rounded-lg bg-[#18a84b] px-5 text-sm font-bold text-white shadow-[0_12px_22px_rgba(24,168,75,0.24)] transition-transform duration-200 active:translate-y-[1px] lg:h-10"
                type="button"
              >
                Explore All Features
                <FaArrowRight className="text-[13px]" aria-hidden="true" />
              </button>
            </div>

            {featureCards.map(({ icon: Icon, title, text, iconClass }) => (
              <article
                key={title}
                className="flex min-h-[176px] flex-col rounded-2xl bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.08)] lg:min-h-0"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass}`}>
                  <Icon className="text-[22px]" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-[15px] font-extrabold text-[#172342]">{title}</h3>
                <p className="mt-2 flex-1 text-[12px] leading-5 text-[#5c6882]">{text}</p>
                <button
                  className="mt-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#e7f0ff] text-[#0c67d9]"
                  type="button"
                >
                  <span className="sr-only">Open {title}</span>
                  <FaArrowRight className="text-[12px]" aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
