import React, { useState, useEffect, useRef } from 'react';
import { Client } from "@stomp/stompjs"; 
import SockJS from 'sockjs-client';
import { Button } from 'primereact/button';
import { useAuth } from '../service/AuthContext';
import './styles.css';
import { formatCurrencyBRL } from '../utils/formatters';

function AuctionBidComponent({ auction }) {
    const { user } = useAuth();
    const [isConnected, setIsConnected] = useState(false);

    const [currentBid, setCurrentBid] = useState(auction?.currentPrice || auction?.minBid || 0);
    const [lastBidderEmail, setLastBidderEmail] = useState('Nenhum lance');

    const stompClientRef = useRef(null);

    useEffect(() => {
        if (!auction) {
            return;
        }

        setCurrentBid(auction.currentPrice || auction.minBid || 0);

        const socketFactory = () => new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: socketFactory,
            reconnectDelay: 5000, 
            debug: () => {}      
        });

        client.onConnect = () => {
            setIsConnected(true);
            
            client.subscribe(`/topic/auction/${auction.id}`, (message) => {
                handleNewBidMessage(message);
            });
            
            client.subscribe(`/user/topic/errors`, (message) => {
                alert(`Erro no lance: ${message.body}`);
            });
        };

        client.onStompError = (frame) => {
            console.error("Erro no WebSocket:", frame.headers['message']);
            setIsConnected(false);
        };
        
        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                setIsConnected(false);
            }
        };
    }, [auction]);

    const handleNewBidMessage = (message) => {
        const messageBody = JSON.parse(message.body);
        setCurrentBid(messageBody.newValue);
        setLastBidderEmail(messageBody.emailUser);
    };

    const handleSendBid = () => {
        if (stompClientRef.current && isConnected && user) {
            const bidMessage = {
                auctionId: auction.id,
                userToken: user.token 
            };
            
            stompClientRef.current.publish({
                destination: `/app/bid/${auction.id}`,
                body: JSON.stringify(bidMessage)
            });
        }
    };

    if (!auction) {
        return <div className="bid-container">Carregando dados do leilão...</div>;
    }

    const nextBidAmount = currentBid + auction.incrementValue;

    return (
        <div className="bid-container">
            <h3>Dar um Lance</h3>
            <div className="bid-info">
                <div className="bid-item">
                    <small>Lance Atual</small>
                    <strong className="current-bid">{formatCurrencyBRL(currentBid)}</strong>
                </div>
                <div className="bid-item">
                    <small>Último lance de</small>
                    <strong>{lastBidderEmail}</strong>
                </div>
            </div>
            
            <Button 
                label={`Dar Lance (${formatCurrencyBRL(nextBidAmount)})`}
                className="btn-enter" 
                onClick={handleSendBid}
                disabled={!isConnected}
            />
            { !isConnected && <small className="error-message">Conectando ao servidor de lances...</small> }
        </div>
    );
}

export default AuctionBidComponent;