import React, { useState, useRef, useEffect } from 'react';

import './ChatBot.css';
import { geminiChatAPI } from '../../services/api';

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'مرحباً! 👋 أنا مساعد Medicare الذكي. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    const questionText = inputValue;
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);


    // Call Gemini AI backend
    try {
      const reply = await geminiChatAPI.sendMessage(questionText);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: reply,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: 'عذراً، لا يمكن الاتصال بخدمة الذكاء الاصطناعي حالياً.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }

    // Call FastAPI backend (اتركه معطل للآن)
    /*
    try {
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: questionText })
      });

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: data.success ? data.answer : 'عذراً، حدث خطأ. حاول مرة أخرى.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot API Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: 'عذراً، لا يمكن الاتصال بخدمة الذكاء الاصطناعي حالياً.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
    */
  };

  const quickActions = [
    { icon: '📅', text: 'حجز موعد', action: 'book' },
    { icon: '📊', text: 'السجلات الطبية', action: 'records' },
    { icon: '💊', text: 'معلومات الأدوية', action: 'meds' },
    { icon: '❓', text: 'استشارة طبية', action: 'question' }
  ];

  const handleQuickAction = (action) => {
    const actionMessages = {
      book: 'أريد حجز موعد مع طبيب',
      records: 'أريد الاطلاع على سجلاتي الطبية',
      meds: 'عندي سؤال عن الأدوية',
      question: 'عندي استشارة طبية'
    };

    setInputValue(actionMessages[action]);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        className={`chat-fab ${isOpen ? 'chat-fab-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="فتح المساعد الذكي"
      >
        <i className="fas fa-robot"></i>
        {!isOpen && <span className="chat-fab-pulse"></span>}
      </button>

      {/* Chat Window */}
      <div className={`chat-window ${isOpen ? 'chat-window-open' : ''}`}>
        {/* Chat Header */}
        <div className="chat-header">
          <button 
            className="chat-minimize"
            onClick={() => setIsOpen(false)}
            aria-label="تصغير المحادثة"
          >
            <i className="fas fa-minus"></i>
          </button>
          <div className="chat-header-info">
            <div className="chat-header-text">
              <h3 className="chat-title">مساعد Medicare الذكي</h3>
              <p className="chat-subtitle">
                <span className="status-indicator"></span>
                متصل • جاهز للمساعدة
              </p>
            </div>
            <div className="chat-avatar">
              <i className="fas fa-robot"></i>
              <span className="chat-status-dot"></span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div className="chat-quick-actions">
            <p className="quick-actions-title">إجراءات سريعة:</p>
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="quick-action-btn"
                  onClick={() => handleQuickAction(action.action)}
                >
                  <span className="quick-action-text">{action.text}</span>
                  <span className="quick-action-icon">{action.icon}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages Container */}
        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${message.type === 'user' ? 'chat-message-user' : 'chat-message-bot'}`}
            >
              {message.type === 'user' && (
                <div className="message-avatar message-avatar-user">
                  <i className="fas fa-user"></i>
                </div>
              )}
              <div className="message-content">
                <div className="message-bubble">
                  {/* دعم تنسيق الأسطر الجديدة */}
                  <p className="message-text">
                    {String(message.text)
                      .split(/\r?\n/)
                      .map((line, idx, arr) => (
                        <React.Fragment key={idx}>
                          {line}
                          {idx < arr.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                  </p>
                </div>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString('ar-EG', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              {message.type === 'bot' && (
                <div className="message-avatar">
                  <i className="fas fa-robot"></i>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="chat-message chat-message-bot">
              <div className="message-content">
                <div className="message-bubble typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="message-avatar">
                <i className="fas fa-robot"></i>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <div className="chat-input-wrapper">
            <button 
              type="submit" 
              className="chat-send-btn"
              disabled={!inputValue.trim()}
              aria-label="إرسال الرسالة"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
            <input
              type="text"
              className="chat-input"
              placeholder="اكتب رسالتك هنا..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button 
              type="button" 
              className="chat-attachment-btn"
              aria-label="إرفاق ملف"
            >
              <i className="fas fa-paperclip"></i>
            </button>
          </div>
          <div className="chat-input-footer">
            <span className="chat-powered">
              <i className="fas fa-brain"></i>
              مدعوم بالذكاء الاصطناعي
            </span>
          </div>
        </form>
      </div>
    </>
  );
}

export default ChatBot;
