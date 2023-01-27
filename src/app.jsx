import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.less';
import { useState } from 'react';
import Employees from './Employees';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
        <React.StrictMode>
            <Employees />
        </React.StrictMode>
        );