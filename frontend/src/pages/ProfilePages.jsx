import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
// import { Rating } from 'primereact/rating';
import { TabView, TabPanel } from 'primereact/tabview';
import { Skeleton } from 'primereact/skeleton';
// import { Badge } from 'primereact/badge'; 
import profileService from '../service/ProfileService';
import { useAuth } from '../service/AuthContext';
import './styles.css';
import MyAuctionsPage from './MyAuctionsPage';
// import FeedbackList from './FeedbackList';
import { Tag } from 'primereact/tag';

function ProfilePage() {
    const { user: authUser } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        profileService.getMe()
            .then(response => setProfile(response.data))
            .catch(() => setError('Não foi possível carregar seu perfil.'))
            .finally(() => setLoading(false));
    }, []);

    const renderLoadingSkeleton = () => (
        <div>
            <Card>
                <div>
                    <Skeleton shape="circle" size="70px" />
                    <div className="flex-1">
                        <Skeleton width="10rem" height="1.5rem" className="mb-2" />
                        <Skeleton width="15rem" />
                    </div>
                </div>
            </Card>
        </div>
    );

    if (loading) return renderLoadingSkeleton();
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="profile-page-container">
                <div className="profile-header-content">
                    <Avatar
                        label={(profile.name?.[0] || profile.email?.[0])?.toUpperCase()}
                        size="xlarge"
                        shape="circle"
                        className="profile-avatar"
                    />
                    <div className="user-info">
                        <div className="user-name-roles">
                            <h2>{profile.name || 'Usuário'}</h2>
                            <div className="user-roles-container">
                                {profile.roles?.map((role, index) => (                                    
                                    <Tag className="auction-status-tag" value={role} key={index} />
                                ))}
                            </div>
                        </div>
                        <p className="user-email">{profile.email}</p>
                        {/* <div className="profile-rating">
                            <Rating value={profile.averageRating} readOnly cancel={false} />
                            <span>({profile.feedbackCount} avaliações)</span>
                        </div> */}
                    </div>
                </div>

            <div className="profile-tabs-card">
                <TabView>
                    {/* <TabPanel header="Meus Leilões" leftIcon="pi pi-shopping-cart mr-2">
                        <MyAuctionsPage />
                    </TabPanel> */}
                    <TabPanel header="Configurações" leftIcon="pi pi-cog mr-2">
                        <p>Opções para alterar senha e editar dados estarão aqui.</p>
                        <Button 
                            label="Alterar Senha" 
                            icon="pi pi-key" 
                            className="p-button-outlined mt-3" 
                            onClick={() => navigate('/change-password')} 
                        />
                    </TabPanel>
                </TabView>
            </div>
        </div>
    );
}

export default ProfilePage;