import React from 'react';

const GlowBorder = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            {/* Blue Vignette / Inset Glow */}
            <div
                className="absolute inset-0 transition-all duration-500 ease-in-out"
                style={{
                    boxShadow: 'inset 0 0 50px 10px rgba(23, 112, 255, 0.3), inset 0 0 20px 0px rgba(6, 182, 212, 0.2)',
                    animation: 'pulse-glow 4s infinite alternate'
                }}
            />
            <style>{`
                @keyframes pulse-glow {
                    0% { box-shadow: inset 0 0 40px 5px rgba(32, 113, 242, 0.2); }
                    100% { box-shadow: inset 0 0 70px 15px rgba(59, 130, 246, 0.4), inset 0 0 30px 5px rgba(6, 182, 212, 0.3); }
                }
            `}</style>
        </div>
    );
};

export default GlowBorder;
