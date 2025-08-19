import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import personService from '../service/PersonService';

function PersonEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    
    const [form, setForm] = React.useState({ name: '', email: '' });
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (isEditing) {
            setLoading(true);
            personService.getById(id)
                .then(response => {
                    setForm({ name: response.data.name, email: response.data.email });
                })
                .catch(() => {
                    toast.error("Pessoa não encontrada.");
                    navigate('/pessoas');
                })
                .finally(() => setLoading(false));
        }
    }, [id, isEditing, navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const action = isEditing 
            ? personService.update({ ...form, id }) 
            : personService.create(form);

        try {
            await action;
            toast.success(`Pessoa ${isEditing ? 'atualizada' : 'criada'} com sucesso!`);
            navigate('/pessoas');
        } catch (error) {
            toast.error(error.response?.data?.message || "Ocorreu um erro.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing) return <p>Carregando dados da pessoa...</p>;

    return (
        <div className="person-edit">
            <h1>{isEditing ? 'Editar Pessoa' : 'Adicionar Nova Pessoa'}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label>Nome</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required/>
                </div>
                <div className="form-button">
                    <button type="button" onClick={() => navigate('/pessoas')}>
                        Cancelar
                    </button>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PersonEdit;
