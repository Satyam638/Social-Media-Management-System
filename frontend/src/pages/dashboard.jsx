import { useState } from 'react';
import API from '../services/api';

export default function Dashboard() {

    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);

    const connectLinkedIn = () => {

        window.location.href =
            'http://localhost:3000/api/linkedin/auth';
    };

    const handlePost = async () => {

        try {

            const formData = new FormData();

            formData.append('content', content);

            formData.append('platforms[linkedin]', true);

            if (image) {
                formData.append('image', image);
            }

            const res = await API.post(
                '/posts/create-post',
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
            alert('Post Failed');
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
                    className="bg-blue-600 text-white px-6 py-3 rounded"
                >
                    Connect LinkedIn
                </button>

            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">

                <h2 className="text-2xl font-semibold mb-4">
                    Create Post
                </h2>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your content..."
                    className="w-full border p-4 rounded mb-4 h-40"
                />

                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="mb-4"
                />

                <button
                    onClick={handlePost}
                    className="bg-green-600 text-white px-6 py-3 rounded"
                >
                    Publish Post
                </button>

            </div>

        </div>
    );
}