import { useState, useEffect } from 'react';

export default function LiveChatPreview({ dark, C, onOpen }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! 👋 How can we help you today?", sender: 'bot', time: 'Just now' },
    { id: 2, text: "I have a project idea I'd like to discuss", sender: 'user', time: 'Just now' },
    { id: 3, text: "Great! We'd love to hear about it. Would you like to schedule a free consultation?", sender: 'bot', time: 'Just now' }
  ]);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    // Auto-scroll to bottom
    const chatContainer = document.getElementById('chat-preview');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 24,
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 25px',
        background: `linear-gradient(135deg, #00e5ff, #bf5fff)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24
          }}>
            💬
          </div>
          <div>
            <h3 style={{ color: '#07071a', fontSize: 18, fontWeight: 800 }}>Live Chat</h3>
            <p style={{ color: '#07071a', fontSize: 12, opacity: 0.8 }}>
              <span style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#25d366',
                marginRight: 5,
                animation: 'pulse 2s ease infinite'
              }} />
              Online · Average response 2min
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowVideo(!showVideo)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: 8,
            padding: '8px 12px',
            color: '#07071a',
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            backdropFilter: 'blur(10px)'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          {showVideo ? 'Hide Preview' : 'Show Preview'}
        </button>
      </div>

      {showVideo ? (
        // Video Preview
        <div style={{
          position: 'relative',
          paddingBottom: '56.25%',
          background: '#000'
        }}>
          <video
            src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            autoPlay
            loop
            muted
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#fff'
          }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              margin: '0 auto 10px',
              cursor: 'pointer'
            }}>
              ▶️
            </div>
            <p style={{ fontSize: 14 }}>Live Chat Demo</p>
          </div>
        </div>
      ) : (
        // Chat Preview
        <div style={{ padding: 20 }}>
          <div
            id="chat-preview"
            style={{
              height: 200,
              overflowY: 'auto',
              marginBottom: 15,
              padding: '0 5px'
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'bot' ? 'flex-start' : 'flex-end',
                  marginBottom: 10,
                  animation: `fadeIn 0.3s ease ${index * 0.1}s both`
                }}
              >
                <div style={{
                  maxWidth: '70%',
                  background: msg.sender === 'bot'
                    ? (dark ? '#00e5ff20' : '#00e5ff10')
                    : 'linear-gradient(135deg, #00e5ff, #0095ff)',
                  borderRadius: msg.sender === 'bot'
                    ? '0 12px 12px 12px'
                    : '12px 0 12px 12px',
                  padding: '10px 15px',
                  color: msg.sender === 'bot' ? C.text : '#07071a'
                }}>
                  <p style={{ fontSize: 13, marginBottom: 3 }}>{msg.text}</p>
                  <span style={{
                    fontSize: 9,
                    opacity: 0.7,
                    display: 'block',
                    textAlign: 'right'
                  }}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Reply Chips */}
          <div style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            marginBottom: 15
          }}>
            {['Pricing', 'Services', 'Timeline', 'Portfolio'].map(quick => (
              <button
                key={quick}
                style={{
                  background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  border: `1px solid ${C.border}`,
                  borderRadius: 20,
                  padding: '6px 12px',
                  fontSize: 11,
                  color: C.text,
                  cursor: 'pointer'
                }}
              >
                {quick}
              </button>
            ))}
          </div>

          {/* Input Simulation */}
          <div style={{
            display: 'flex',
            gap: 10,
            alignItems: 'center'
          }}>
            <div style={{
              flex: 1,
              background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: '10px 12px',
              color: C.muted,
              fontSize: 13
            }}>
              Type your message...
            </div>
            <button
              onClick={onOpen}
              style={{
                background: 'linear-gradient(135deg,#00e5ff,#0095ff)',
                border: 'none',
                borderRadius: 8,
                padding: '10px 16px',
                color: '#07071a',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              Start Chat
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}