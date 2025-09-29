import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import personService from '../service/PersonService';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';

function PersonEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useRef(null);
    const isEditing = Boolean(id);

    const [form, setForm] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(false); 
    const [pageLoading, setPageLoading] = useState(isEditing); 

    useEffect(() => {
        if (isEditing) {
            personService.getById(id)
                .then(response => {
                    setForm({ name: response.data.name, email: response.data.email });
                })
                .catch(() => {
                    toast.current.show({
                        severity: 'error', summary: 'Erro', detail: 'Pessoa não encontrada.', life: 3000
                    });
                    navigate('/pessoas');
                })
                .finally(() => setPageLoading(false));
        }
    }, [id, isEditing, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const personData = isEditing ? { ...form, id: parseInt(id) } : form;
        const action = isEditing
            ? personService.update(personData)
            : personService.create(personData);

        try {
            await action;
            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Pessoa ${isEditing ? 'atualizada' : 'criada'} com sucesso!`,
                life: 3000
            });
            navigate('/pessoas');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao salvar os dados.';
            toast.current.show({
                severity: 'error', summary: 'Erro', detail: errorMessage, life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const formFooter = (
        <div className="flex justify-content-end gap-2">
            <Button
                label="Cancelar"
                icon="pi pi-times"
                severity="secondary"
                outlined
                onClick={() => navigate('/pessoas')}
                disabled={loading}
            />
            <Button
                type="submit"
                label={isEditing ? 'Salvar' : 'Criar'}
                icon="pi pi-check"
                loading={loading} // Indicador de loading no próprio botão
            />
        </div>
    );

    const formContent = (
        <form onSubmit={handleSubmit} className="p-fluid">
            <div className="field">
                <label htmlFor="name">Nome</label>
                <InputText
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    autoFocus
                />
            </div>
            <div className="field">
                <label htmlFor="email">Email</label>
                <InputText
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
            </div>
        </form>
    );

    return (
        <div className="p-d-flex p-jc-center p-ai-center">
            <Toast ref={toast} />
            <Card
                title={isEditing ? 'Editar Pessoa' : 'Adicionar Nova Pessoa'}
                footer={!pageLoading && formFooter}
                style={{ width: '100%', maxWidth: '600px' }}
            >
                {pageLoading ? (
                    <div className="flex justify-content-center p-5">
                        <ProgressSpinner />
                    </div>
                ) : (
                    formContent
                )}
            </Card>
        </div>
    );
}

export default PersonEdit;