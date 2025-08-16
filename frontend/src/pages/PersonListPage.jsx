import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import personService from '../service/PersonService';
import './styles.css';

function PersonListPage() {
    const [pessoas, setPessoas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPessoas = async () => {
            try {
                const response = await personService.getAll();
                setPessoas(response.data.content || []);
            } catch (error) {
                toast.error("Falha ao buscar pessoas.");
            } finally {
                setLoading(false);
            }
        };
        fetchPessoas();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja remover esta pessoa?")) {
            try {
                await personService.delete(id);
                setPessoas(pessoas.filter(p => p.id !== id));
                toast.success("Pessoa removida!");
            } catch (error) {
                toast.error("Falha ao remover.");
            }
        }
    };

    if (loading) return <p>Carregando...</p>;

    return (
        <div className="person-list-container">
            <div className="header">
                <h1>Gerenciar Pessoas</h1>
            </div>

            {pessoas.length === 0 ? (
                <p>Nenhuma pessoa cadastrada.</p>
            ) : (
                <table className="person-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pessoas.map(pessoa => (
                            <tr key={pessoa.id}>
                                <td>{pessoa.name}</td>
                                <td>{pessoa.email}</td>
                                <td>
                                    <Link to={`/pessoas/${pessoa.id}`} className="btn btn-edit">Editar</Link>
                                    <button onClick={() => handleDelete(pessoa.id)} className="btn btn-delete">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default PersonListPage;
