import React from 'react';

export default function Success() {
    return (
        <div>
            <div className="card">
                <div style={{ borderRadius: '200px', height: '200px', width: '200px', background: '#F8FAF5', margin: '0 auto' }}>
                    <i className="checkmark">✓</i>
                </div>
                <h1>Success</h1>
                <p>We received your Verification Code;<br /> Congrats You are ✔ verified user!</p>
            </div>
        </div>
    )
}