import React from 'react';
import LoyaltySystem from '../components/LoyaltySystem'

export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Sistema de Fidelidade - Instagram Bar</h1>
      <p>Aplicação está funcionando corretamente!</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>APIs Disponíveis:</h2>
        <ul>
          <li>/api/instagram - API do Instagram</li>
          <li>/api/sheets - API do Google Sheets</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Componentes:</h2>
        <ul>
          <li>/components/LoyaltySystem - Sistema de fidelidade</li>
        </ul>
      </div>
    </div>
  );
}
