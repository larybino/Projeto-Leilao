import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import personService from "../service/PersonService";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';

function ChangePassword() {
    const [form, setForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.newPassword !== form.confirmPassword) {
            toast.current.show({
                severity: 'warn', summary: 'Atenção', detail: 'A nova senha e a confirmação não coincidem.', life: 3000
            });
            return;
        }

        setLoading(true);
        try {
            await personService.changePassword({
                oldPassword: form.oldPassword,
                newPassword: form.newPassword,
            });
            toast.current.show({
                severity: 'success', summary: 'Sucesso', detail: 'Senha alterada! Por favor, faça o login novamente.', life: 3000
            });
            setTimeout(() => navigate("/login"), 2500);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Não foi possível alterar a senha. Verifique sua senha antiga.";
            toast.current.show({
                severity: 'error', summary: 'Erro', detail: errorMessage, life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const passwordFooter = (
        <>
            <Divider />
            <p className="mt-2">Sugestões de segurança:</p>
            <ul className="pl-2 ml-2 mt-0 line-height-3">
                <li>Pelo menos uma letra minúscula</li>
                <li>Pelo menos uma letra maiúscula</li>
                <li>Pelo menos um número</li>
                <li>Mínimo de 8 caracteres</li>
            </ul>
        </>
    );

    return (
        <div className="change-password-page flex align-items-center justify-content-center">
            <Toast ref={toast} />
            <Card title="Alterar Senha" style={{ width: '100%', maxWidth: '450px' }}>
                <form onSubmit={handleSubmit} className="p-fluid flex flex-column gap-4">
                    <span className="p-float-label">
                        <Password
                            inputId="oldPassword"
                            name="oldPassword"
                            value={form.oldPassword}
                            onChange={handleChange}
                            toggleMask
                            required
                            feedback={false}
                        />
                        <label htmlFor="oldPassword">Senha Antiga</label>
                    </span>

                    <Password
                        inputId="newPassword"
                        name="newPassword"
                        value={form.newPassword}
                        onChange={handleChange}
                        toggleMask
                        required
                        header="Crie uma nova senha"
                        footer={passwordFooter}
                        promptLabel="Digite a nova senha"
                        weakLabel="Fraca"
                        mediumLabel="Média"
                        strongLabel="Forte"
                    />

                    <span className="p-float-label">
                        <Password
                            inputId="confirmPassword"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            toggleMask
                            required
                            feedback={false}
                        />
                         <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                    </span>

                    <div className="flex justify-content-end gap-2 mt-3">
                         <Button
                            type="button"
                            label="Cancelar"
                            severity="secondary"
                            outlined
                            onClick={() => navigate("/home")}
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            label="Alterar Senha"
                            loading={loading}
                        />
                    </div>
                </form>
            </Card>
        </div>
    );
}

export default ChangePassword;