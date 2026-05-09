import { useState } from 'react';
import API from '../services/api';

export default function Register() {

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        profileImage: null
    });

    const handleChange = (e) => {

        const { name, value, files } = e.target;

        if (name === 'profileImage') {

            setForm({
                ...form,
                profileImage: files[0]
            });

        } else {

            setForm({
                ...form,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const formData = new FormData();

            formData.append('name', form.name);
            formData.append('email', form.email);
            formData.append('password', form.password);
            formData.append('role', form.role);

            if (form.profileImage) {
                formData.append(
                    'profileImage',
                    form.profileImage
                );
            }

            const res = await API.post(
                '/auth/register',
                formData,
                {
                    headers: {
                        'Content-Type':
                            'multipart/form-data'
                    }
                }
            );

            console.log(res.data);

            alert(res.data.message);

        } catch (err) {

            console.log(err);

            console.log(err.response?.data);

            console.log(err.response?.data);

            alert(
                err.response?.data?.message ||
                err.message
            );
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-lg w-[450px]"
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

                <select
                    name="role"
                    className="w-full border p-3 mb-4 rounded"
                    onChange={handleChange}
                >
                    <option value="">
                        Select Role
                    </option>

                    <option value="admin">
                        admin
                    </option>

                    <option value="superadmin">
                        superadmin
                    </option>
                </select>

                <input
                    type="file"
                    name="profileImage"
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