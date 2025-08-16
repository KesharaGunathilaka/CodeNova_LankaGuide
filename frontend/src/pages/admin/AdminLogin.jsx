import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { useApp } from '../../utils/appContext'

const Input = ({ label, ...props }) => (
    <label className="block text-sm">
        <div className="mb-1 text-gray-600">{label}</div>
        <input {...props} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-green-200" />
    </label>
)

const AuthShell = ({ title, subtitle, children }) => (
    <div className="min-h-[70vh] grid place-items-center bg-gradient-to-b from-green-50 to-white">
        <div className="w-full max-w-md bg-white border rounded-3xl p-6 shadow-xl">
            <div className="text-center">
                <div className="inline-flex p-3 bg-green-600 text-white rounded-2xl"><ShieldCheck /></div>
                <h2 className="mt-3 text-2xl font-bold">{title}</h2>
                <p className="text-gray-500 text-sm">{subtitle}</p>
            </div>
            <div className="mt-4">{children}</div>
        </div>
    </div>
)

export default function Login() {
    const { setUser } = useApp()
    const nav = useNavigate()
    const [form, setForm] = useState({ username: '', password: '' })
    const submit = (e) => { e.preventDefault(); setUser({ username: form.username }); nav('/admin') }
    return (
        <AuthShell title="Welcome back" subtitle="Sign in to continue">
            <form onSubmit={submit} className="space-y-3">
                <Input label="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
                <Input type="password" label="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button className="w-full py-2 rounded-xl bg-green-600 text-white">Sign in</button>
            </form>
        </AuthShell>
    )
}
