import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const res = await API.post('/auth/login', form);

            console.log(res.data);

            alert('Login Success');

            navigate('/dashboard');

        } catch (err) {

            console.log(err);

            console.log(err.response.data);

            alert(err.response.data.message || 'Login Failed');
        }
    };

    return (
        <div className="flex justify-center items-center h-[90vh]">

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-lg w-[400px]"
            >

                <h1 className="text-3xl font-bold mb-6 text-center">
                    Login
                </h1>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full border p-3 mb-4 rounded"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full border p-3 mb-4 rounded"
                    onChange={handleChange}
                />

                <button className="bg-black text-white w-full py-3 rounded">
                    Login
                </button>

            </form>

        </div>
    );
}