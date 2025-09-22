import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProfileService from '../service/ProfileService';
import { toast } from 'react-toastify';

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
        <div className="person-edit">
            <h1>{isEditing ? 'Editar Perfil' : 'Adicionar Novo Perfil'}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label>Perfil</label>
                    <input type="text" name="name" />
                </div>
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => navigate('/profile')} >
                        Cancelar
                    </button>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Guardando' : 'Guardar'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProfileFormPage;
