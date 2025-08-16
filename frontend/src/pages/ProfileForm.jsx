import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProfileService from '../service/ProfileService';
import { toast } from 'react-toastify';

const PROFILE_TYPES = ['ADMIN', 'BUYER', 'SELLER']; 

function ProfileFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    
    const [type, setType] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditing) {
            setLoading(true);
            ProfileService.getById(id)
                .then(response => {
                    setType(response.data.type);
                })
                .catch(() => {
                    toast.error("Perfil não encontrado.");
                    navigate('/perfis');
                })
                .finally(() => setLoading(false));
        }
    }, [id, isEditing, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!type) {
            toast.error("Por favor, selecione um tipo de perfil.");
            return;
        }
        setLoading(true);
        
        const profileData = { type };
        const action = isEditing 
            ? ProfileService.update({ ...profileData, id }) 
            : ProfileService.create(profileData);

        try {
            await action;
            toast.success(`Perfil ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
            navigate('/profile');
        } catch (error) {
            toast.error(error.response?.data?.message || "Ocorreu um erro ao guardar o perfil.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing) return <p>A carregar dados do perfil...</p>;

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Editar Perfil' : 'Adicionar Novo Perfil'}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Perfil</label>
                    <select 
                        value={type} 
                        onChange={(e) => setType(e.target.value)} 
                        required 
                        className="w-full mt-1 p-2 border rounded-md"
                    >
                        <option value="">Selecione um tipo</option>
                        {PROFILE_TYPES.map(profileType => (
                            <option key={profileType} value={profileType}>
                                {profileType}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => navigate('/profile')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">
                        Cancelar
                    </button>
                    <button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-blue-300">
                        {loading ? 'A guardar...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProfileFormPage;
