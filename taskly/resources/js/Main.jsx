import React from 'react';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Taskly } from './pages/Taskly';
import { BrowserRouter, Routes, Route, } from 'react-router-dom';


function AppRoutes() {

    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/accedi" element={<Login />} />
                <Route path="/registrati" element={<Register />} />
                <Route path="/taskly" element={<Taskly />} />
            </Routes>
        </>
    );
}

export function Main() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}

export default Main;
