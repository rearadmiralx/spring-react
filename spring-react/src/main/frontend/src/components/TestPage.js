import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TestPage = () => {
    const [data, setData] = useState(null);
    const navigate = useNavigate(); // Hook to programmatically navigate

    useEffect(() => {
        fetch('http://localhost:8080/test/data')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h1>Test Page</h1>
            {data ? (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            ) : (
                <p>Loading...</p>
            )}
            <button onClick={() => navigate('/excel')}>Go to Excel Uploader</button>
            <button onClick={() => navigate('/')}>Go to Home</button>
        </div>
    );
};

export default TestPage;