import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfileService from '../service/ProfileService';
import { toast } from 'react-toastify';
import './styles.css';

function ProfileListPage() {
    const [perfis, setPerfis] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ProfileService.getAll()
            .then(response => {
                setPerfis(response.data.content || []);
            })
            .catch(() => toast.error("Falha ao buscar os perfis."))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Tem a certeza que deseja remover este perfil?")) {
            try {
                await ProfileService.delete(id);
                setPerfis(perfis.filter(p => p.id !== id));
                toast.success("Perfil removido com sucesso!");
            } catch (error) {
                toast.error("Falha ao remover o perfil.");
            }
        }
    };

    if (loading) return <p>A carregar perfis...</p>;

    return (
        <div className="person-list-container">
            <div className="header">
                <h1>Gerir Perfis</h1>
                <Link to="/profile/novo" className="btn-add">
                    Adicionar Perfil
                </Link>
            </div>

            {perfis.length === 0 ? (
                <p className="empty-message">Nenhum perfil encontrado.</p>
            ) : (
                <table className="profile-table">
                    <thead>
                        <tr>
                            <th>Tipo de Perfil</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {perfis.map(perfil => (
                            <tr key={perfil.id}>
                                <td>{perfil.type}</td>
                                <td>
                                    <button onClick={() => handleDelete(perfil.id)} className="btn btn-delete">Remover</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ProfileListPage;
