import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import personService from '../service/PersonService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Card } from 'primereact/card';
import { Toolbar } from 'primereact/toolbar';

function PersonListPage() {
    const [pessoas, setPessoas] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPessoas = async () => {
            try {
                const response = await personService.getAll();
                setPessoas(response.data.content || []);
            } catch (error) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao buscar pessoas.',
                    life: 3000
                });
            } finally {
                setLoading(false);
            }
        };
        fetchPessoas();
    }, []);

    const handleDelete = async (id) => {
        try {
            await personService.delete(id);
            setPessoas(pessoas.filter(p => p.id !== id));
            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Pessoa removida!',
                life: 3000
            });
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao remover a pessoa.',
                life: 3000
            });
        }
    };

    const confirmDelete = (id) => {
        confirmDialog({
            message: 'Tem certeza que deseja remover esta pessoa?',
            header: 'Confirmação de Exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => handleDelete(id),
        });
    };

    const profilesBodyTemplate = (rowData) => {
        if (rowData.personProfile && rowData.personProfile.length > 0) {
            return rowData.personProfile.map(pp => pp.profile?.type).join(', ');
        }
        return '—';
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    className="p-button-text p-button-success mr-2"
                    onClick={() => navigate(`/pessoas/${rowData.id}`)}
                    tooltip="Editar"
                    tooltipOptions={{ position: 'top' }}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    className="p-button-text p-button-danger"
                    onClick={() => confirmDelete(rowData.id)}
                    tooltip="Excluir"
                    tooltipOptions={{ position: 'top' }}
                />
            </React.Fragment>
        );
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <h1 style={{ margin: 0 }}>Gerenciar Pessoas</h1>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <Button
                label="Novo"
                icon="pi pi-plus"
                className="p-button-success"
                onClick={() => navigate('/pessoas/novo')}
            />
        );
    };

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />

            <Card>
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable
                    value={pessoas}
                    loading={loading}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    emptyMessage="Nenhuma pessoa cadastrada."
                    responsiveLayout="scroll"
                    dataKey="id"
                >
                    <Column field="name" header="Nome" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="email" header="Email" sortable style={{ minWidth: '14rem' }}></Column>
                    <Column header="Perfis" body={profilesBodyTemplate} style={{ minWidth: '10rem' }}></Column>
                    <Column header="Ações" body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem', textAlign: 'center' }}></Column>
                </DataTable>
            </Card>
        </div>
    );
}

export default PersonListPage;