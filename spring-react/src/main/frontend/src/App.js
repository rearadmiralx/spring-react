import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ExcelUploader from './components/ExcelUploader';
import TestPage from './components/TestPage';


const App = () => {
    return (
           <Router>
               <div>
                   <nav>
                       <Link to="/testing/csv-to-excel">
                           <button>Go to CSV to Excel</button>
                       </Link>
                       <Link to="/testing/gthelper">
                           <button>Go to Gthelper</button>
                       </Link>
                   </nav>
                   <Routes>
                    <Route path="/testing" element={<h1>Welcome to the Home Page</h1>} />
                    <Route path="/testing/csv-to-excel" element={<ExcelUploader />} />
                    <Route path="/testing/gthelper" element={<TestPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
