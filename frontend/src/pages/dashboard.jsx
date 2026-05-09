import { useEffect, useState } from 'react';
import API from '../services/api';

export default function Dashboard() {

    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [linkedinName, setLinkedinName] = useState('');

    useEffect(() => {

        const params = new URLSearchParams(window.location.search);

        const connected = params.get('connected');
        const name = params.get('name');

        if (connected === 'true') {

            setIsConnected(true);
            setLinkedinName(name);

            // remove query params from URL
            window.history.replaceState({}, document.title, '/dashboard');
        }

    }, []);

    const connectLinkedIn = () => {

        window.location.href =
            'http://localhost:3000/api/linkedin/auth';
    };

    const handlePost = async () => {

        try {

            const formData = new FormData();

            formData.append('content', content);

            formData.append(
                'platforms',
                JSON.stringify({
                    linkedin: true
                })
            );

            if (image) {
                formData.append('image', image);
            }

            const res = await API.post(
                '/api/posts/create-post',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log(res.data);

            alert(res.data.message);

        } catch (err) {

            console.log(err);

            console.log(err.response?.data);

            alert(
                err.response?.data?.message ||
                'Post Failed'
            );
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-6">

            <h1 className="text-4xl font-bold mb-8">
                SMMS Dashboard
            </h1>

            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">

                <h2 className="text-2xl font-semibold mb-4">
                    Connect Platforms
                </h2>

                <button
                    onClick={connectLinkedIn}
                    className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
                >
                    Connect LinkedIn
                </button>

            </div>

            {
                isConnected && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-4 rounded-xl mb-8">

                        <p className="text-lg font-semibold">
                            LinkedIn Connected Successfully ✅
                        </p>

                        <p className="mt-2">
                            Connected as{' '}
                            <span className="font-bold">
                                {linkedinName}
                            </span>
                        </p>

                        <p className="mt-3 font-medium text-green-800">
                            Let's create post 🚀
                        </p>

                    </div>
                )
            }

            <div className="bg-white p-6 rounded-xl shadow-lg">

                <h2 className="text-2xl font-semibold mb-4">
                    Create Post
                </h2>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your content..."
                    className="w-full border p-4 rounded mb-4 h-40 outline-none focus:ring-2 focus:ring-green-500"
                />

                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="mb-4"
                />

                <button
                    onClick={handlePost}
                    className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
                >
                    Publish Post
                </button>

            </div>

        </div>
    );
}