import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import './stylesComponents.css'; 

function PublicHeader() {
    const navigate = useNavigate();

    return (
        <header className="public-header">
            <div className="header-container">
                <div className="logo" onClick={() => navigate('/')}>
                    App Leilão
                </div>
                <nav className="header-actions">
                    <Button 
                        label="Entrar" 
                        className="btn-enter" 
                        onClick={() => navigate('/login')} 
                    />
                    <Button 
                        label="Cadastrar" 
                        className="btn-enter" 
                        onClick={() => navigate('/register')} 
                    />
                </nav>
            </div>
        </header>
    );
}

export default PublicHeader;