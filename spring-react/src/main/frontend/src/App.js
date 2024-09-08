import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ExcelUploader from './components/ExcelUploader';
import TestPage from './components/TestPage';

const App = () => {
    return (
        <Router>
            <div>
                <nav>
                    <Link to="/excel">
                        <button>Go to Excel Uploader</button>
                    </Link>
                    <Link to="/test">
                        <button>Go to Test Page</button>
                    </Link>
                </nav>
                <Routes>
                    <Route path="/excel" element={<ExcelUploader />} />
                    <Route path="/test" element={<TestPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
