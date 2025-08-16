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
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const loginOfficer = async (email, password) => {
        const response = await fetch('http://localhost:5000/api/auth/officer/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        return response.json();
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await loginOfficer(form.email, form.password);
            setUser({ 
                id: result.officer.id, 
                email: result.officer.email,
                name: result.officer.name,
                username: result.officer.name, // For compatibility with existing navbar
                type: 'officer' 
            });
            nav('/admin');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthShell title="Welcome back" subtitle="Sign in to continue">
            <form onSubmit={submit} className="space-y-3">
                {error && (
                    <div className="text-red-600 text-sm text-center p-2 bg-red-50 rounded-xl">
                        {error}
                    </div>
                )}
                <Input 
                    label="Email" 
                    type="email" 
                    value={form.email} 
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required 
                />
                <Input 
                    type="password" 
                    label="Password" 
                    value={form.password} 
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required 
                />
                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 rounded-xl bg-green-600 text-white disabled:opacity-50"
                >
                    {loading ? 'Signing in...' : 'Sign in'}
                </button>
            </form>
        </AuthShell>
    )
}
