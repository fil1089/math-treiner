import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, LogIn, UserPlus, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthPageProps {
    onBack: () => void;
}

const C = {
    purple: "#6272A4",
    orange: "#D87233",
    teal: "#5CA7AD",
    bg: "#CDD2DA",
};

export function AuthPage({ onBack }: AuthPageProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { login: saveAuth } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const body = isLogin ? { email, password } : { email, password, username };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            if (isLogin) {
                saveAuth(data.token, data.user);
                onBack();
            } else {
                // Switch to login after successful registration
                setIsLogin(true);
                setError('Регистрация прошла успешно! Теперь войдите.');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen w-full relative overflow-hidden"
            style={{ background: "#CDD2DA", fontFamily: "'Nunito', sans-serif" }}>

            {/* Header */}
            <div className="flex items-center gap-4 px-5 pt-10 pb-4">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
                    style={{ background: C.teal, boxShadow: "0 3px 10px rgba(92,167,173,0.5)", border: "none" }}
                >
                    <ArrowLeft size={18} color="white" strokeWidth={3} />
                </button>
                <h1 className="m-0" style={{ fontSize: 24, fontWeight: 900, color: C.purple }}>
                    {isLogin ? 'Вход' : 'Регистрация'}
                </h1>
            </div>

            <div className="flex-1 px-6 flex flex-col justify-center pb-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-3xl p-6"
                    style={{ background: "#E0E5EC", boxShadow: "20px 20px 60px #bec3ca, -20px -20px 60px #fdffff" }}
                >
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {!isLogin && (
                            <div className="flex flex-col gap-1">
                                <label style={{ fontSize: 13, fontWeight: 800, color: C.purple, marginLeft: 4 }}>Имя пользователя</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required={!isLogin}
                                        placeholder="Напр. Математик2000"
                                        className="w-full rounded-2xl py-3 pl-10 pr-4 outline-none border-none text-[15px] font-bold"
                                        style={{ background: "#E0E5EC", boxShadow: "inset 6px 6px 12px #bec3ca, inset -6px -6px 12px #fdffff" }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-1">
                            <label style={{ fontSize: 13, fontWeight: 800, color: C.purple, marginLeft: 4 }}>Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="example@mail.com"
                                    className="w-full rounded-2xl py-3 pl-10 pr-4 outline-none border-none text-[15px] font-bold"
                                    style={{ background: "#E0E5EC", boxShadow: "inset 6px 6px 12px #bec3ca, inset -6px -6px 12px #fdffff" }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label style={{ fontSize: 13, fontWeight: 800, color: C.purple, marginLeft: 4 }}>Пароль</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full rounded-2xl py-3 pl-10 pr-4 outline-none border-none text-[15px] font-bold"
                                    style={{ background: "#E0E5EC", boxShadow: "inset 6px 6px 12px #bec3ca, inset -6px -6px 12px #fdffff" }}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "rgba(232, 93, 93, 0.1)", border: "1px solid rgba(232, 93, 93, 0.2)" }}>
                                <AlertCircle size={14} color="#E85D5D" strokeWidth={2.5} />
                                <p className="m-0 text-[12px] font-bold" style={{ color: "#E85D5D" }}>{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-2xl py-4 mt-2 flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-70"
                            style={{
                                background: C.orange,
                                color: 'white',
                                fontSize: 16,
                                fontWeight: 900,
                                border: 'none',
                                boxShadow: "0 6px 20px rgba(216,114,51,0.4)"
                            }}
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : (isLogin ? <LogIn size={18} strokeWidth={3} /> : <UserPlus size={18} strokeWidth={3} />)}
                            {isLogin ? 'Войти' : 'Создать аккаунт'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="bg-transparent border-none outline-none"
                            style={{ fontSize: 13, fontWeight: 800, color: C.purple, cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
