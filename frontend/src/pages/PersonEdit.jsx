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
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Editar Pessoa' : 'Adicionar Nova Pessoa'}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md" />
                </div>
                 {/* O campo senha só deve aparecer na criação, que já é feita na tela de Register */}
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => navigate('/pessoas')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">
                        Cancelar
                    </button>
                    <button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-blue-300">
                        {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PersonEdit;
