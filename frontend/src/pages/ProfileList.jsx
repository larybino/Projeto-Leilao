import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileService from '../service/ProfileService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Card } from 'primereact/card';
import { Toolbar } from 'primereact/toolbar';

function ProfileListPage() {
    const [perfis, setPerfis] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPerfis = async () => {
            try {
                const response = await ProfileService.getAll();
                setPerfis(response.data.content || []);
            } catch (error) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao buscar os perfis.',
                    life: 3000
                });
            } finally {
                setLoading(false);
            }
        };
        fetchPerfis();
    }, []);

    const handleDelete = async (id) => {
        try {
            await ProfileService.delete(id);
            setPerfis(perfis.filter(p => p.id !== id));
            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Perfil removido com sucesso!',
                life: 3000
            });
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao remover o perfil.',
                life: 3000
            });
        }
    };

    const confirmDelete = (id) => {
        confirmDialog({
            message: 'Tem a certeza que deseja remover este perfil?',
            header: 'Confirmação de Exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim, remover',
            rejectLabel: 'Não',
            acceptClassName: 'p-button-danger',
            accept: () => handleDelete(id),
        });
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex justify-content-center">
                <Button
                    icon="pi pi-trash"
                    rounded
                    className="p-button-text p-button-danger"
                    onClick={() => confirmDelete(rowData.id)}
                    tooltip="Excluir"
                    tooltipOptions={{ position: 'top' }}
                />
            </div>
        );
    };

    const leftToolbarTemplate = () => (
        <h1 style={{ margin: 0 }}>Gerir Perfis</h1>
    );

    const rightToolbarTemplate = () => (
        <Button
            label="Adicionar Perfil"
            icon="pi pi-plus"
            className="p-button-success"
            onClick={() => navigate('/profile/novo')} 
        />
    );

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />

            <Card>
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable
                    value={perfis}
                    loading={loading}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    emptyMessage="Nenhum perfil encontrado."
                    responsiveLayout="scroll"
                    dataKey="id"
                >
                    <Column field="type" header="Tipo de Perfil" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column header="Ações" body={actionBodyTemplate} exportable={false} style={{ width: '8rem', textAlign: 'center' }}></Column>
                </DataTable>
            </Card>
        </div>
    );
}

export default ProfileListPage;