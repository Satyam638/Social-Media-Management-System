import { useState } from 'react';
import API from '../services/api';

export default function Register() {

    const [form, setForm] = useState({
        name: '',
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

            const res = await API.post('/auth/register', form);

            alert(res.data.message);

        } catch (err) {
            console.log(err);
            alert('Registration Failed');
        }
    };

    return (
        <div className="flex justify-center items-center h-[90vh]">

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-lg w-[400px]"
            >

                <h1 className="text-3xl font-bold mb-6 text-center">
                    Register
                </h1>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="w-full border p-3 mb-4 rounded"
                    onChange={handleChange}
                />

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
                    Register
                </button>

            </form>

        </div>
    );
}