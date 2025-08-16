import React from 'react'
import AppointmentCard from '../components/AppointmentCard'
import { MiniCalendar } from '../components/Calendar'
import { useApp } from '../utils/appContext'

export default function Dashboard(){
  const { user, appointments } = useApp()
  const upcoming = appointments.filter(a => new Date(a.datetime) > new Date())
  const completed = appointments.filter(a => new Date(a.datetime) <= new Date())
  const Card = ({ title, children }) => (<div className="bg-white border rounded-3xl p-4 shadow-sm"><div className="font-semibold mb-3">{title}</div>{children}</div>)
  const Empty = ({ text }) => (<div className="p-6 text-center text-gray-500 text-sm">{text}</div>)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold">Hello{user?`, ${user.username}`:''}! 👋</h2>
      <p className="text-gray-600">Here are your appointments.</p>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Upcoming appointments">
            {upcoming.length===0 ? <Empty text="No upcoming appointments"/> : (
              <div className="space-y-3">{upcoming.map(a => <AppointmentCard key={a.id} appt={a}/>) }</div>
            )}
          </Card>
          <Card title="Completed appointments">
            {completed.length===0 ? <Empty text="No completed appointments"/> : (
              <div className="space-y-3">{completed.map(a => <AppointmentCard key={a.id} appt={a}/>) }</div>
            )}
          </Card>
        </div>
        <div>
          <Card title="Calendar"><MiniCalendar/></Card>
        </div>
      </div>
    </div>
  )
}
