'use client';

import { useState, useRef, useEffect, useCallback, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import Link from 'next/link';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const GREETING =
  '¡Hola! Soy Ignacio, el asistente virtual de Grupo Rubio. Puedo ayudarte con nuestros servicios de limpieza, control de plagas, alquiler de maquinaria o productos de la tienda. ¿Qué necesitas?';

const SUGGESTIONS = [
  '¿Qué servicios ofrecéis?',
  'Quiero alquilar una fregadora',
  'Tengo un problema de plagas',
];

function BotText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const [, label, href] = link;
          const internal = href.startsWith('/');
          return internal ? (
            <Link key={i} href={href} style={{ color: '#1D4ED8', fontWeight: 600, textDecoration: 'underline' }}>
              {label}
            </Link>
          ) : (
            <a key={i} href={href} style={{ color: '#1D4ED8', fontWeight: 600, textDecoration: 'underline' }}>
              {label}
            </a>
          );
        }
        const bold = part.match(/^\*\*([^*]+)\*\*$/);
        if (bold) return <strong key={i}>{bold[1]}</strong>;
        return part.split('\n').map((line, j, arr) => (
          <Fragment key={`${i}-${j}`}>
            {line}
            {j < arr.length - 1 && <br />}
          </Fragment>
        ));
      })}
    </>
  );
}

const NUDGE_DELAY_MS = 8_000;
const NUDGE_KEY = 'gr-chat-nudge-shown';

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [feedback, setFeedback] = useState<Record<number, 'up' | 'down'>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(NUDGE_KEY)) return;
    const timer = setTimeout(() => {
      sessionStorage.setItem(NUDGE_KEY, '1');
      setNudge(true);
    }, NUDGE_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (open) setNudge(false);
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim().slice(0, 800);
      if (!content || loading) return;

      const userMsg: ChatMessage = { role: 'user', content };
      const history = [
        ...messages
          .filter(m => m.content.trim().length > 0)
          .map(m => ({ ...m, content: m.content.slice(0, 4000) }))
          .slice(-11),
        userMsg,
      ];
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setLoading(true);

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          const msg =
            data?.error ||
            'Ahora mismo no puedo responder. Llámanos al 948 82 50 25 y te atendemos encantados.';
          setMessages(prev => [...prev, { role: 'assistant', content: msg }]);
          return;
        }

        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let acc = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          const current = acc;
          setMessages(prev => {
            const next = [...prev];
            next[next.length - 1] = { role: 'assistant', content: current };
            return next;
          });
        }

        if (!acc.trim()) {
          setMessages(prev => {
            const next = [...prev];
            next[next.length - 1] = {
              role: 'assistant',
              content: 'Ahora mismo no puedo responder. Llámanos al 948 82 50 25 o inténtalo de nuevo en un momento.',
            };
            return next;
          });
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setMessages(prev => [
            ...prev,
            { role: 'assistant', content: 'Ha habido un problema de conexión. Inténtalo de nuevo o llámanos al 948 82 50 25.' },
          ]);
        }
      } finally {
        setLoading(false);
      }
    },
    [messages, loading]
  );

  const sendFeedback = useCallback((index: number, botMessage: string, rating: 'up' | 'down') => {
    setFeedback(prev => ({ ...prev, [index]: rating }));
    fetch('/api/chat/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ botMessage, rating }),
    }).catch(() => {});
  }, []);

  return (
    <>
      {/* Nudge popup */}
      <AnimatePresence>
        {nudge && !open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{
              position: 'fixed', bottom: 100, right: 24, maxWidth: 256,
              background: '#ffffff', border: '1px solid #e2e8f0',
              borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
              padding: '14px 16px', zIndex: 9990, cursor: 'pointer',
            }}
            onClick={() => setOpen(true)}
          >
            <button
              onClick={e => { e.stopPropagation(); setNudge(false); }}
              aria-label="Cerrar aviso"
              style={{
                position: 'absolute', top: -8, right: -8,
                width: 20, height: 20, borderRadius: '50%',
                background: '#0f172a', color: '#ffffff',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
              }}
            >
              <X size={10} />
            </button>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>
              ¿Necesitas ayuda con algo? 👋
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b', lineHeight: 1.45 }}>
              Pregúntame por servicios, alquiler de maquinaria o productos.
            </p>
            <div style={{
              position: 'absolute', bottom: -7, right: 20,
              width: 12, height: 12, background: '#ffffff',
              borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0',
              transform: 'rotate(45deg)',
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB — cuadrado redondeado */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? 'Cerrar chat' : 'Abrir chat'}
        style={{
          position: 'fixed', bottom: 24, right: 24,
          width: 56, height: 56,
          borderRadius: 16,
          background: '#0f172a',
          color: '#ffffff', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
          zIndex: 9990,
        }}
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={22} /></motion.span>
            : <motion.span key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><MessageCircle size={22} /></motion.span>
          }
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              position: 'fixed', bottom: 92, right: 24,
              width: 'min(380px, calc(100vw - 32px))',
              height: 'min(560px, calc(100vh - 120px))',
              background: '#ffffff',
              borderRadius: 16,
              boxShadow: '0 8px 48px rgba(0,0,0,0.2)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden', zIndex: 9991,
            }}
          >
            {/* Header oscuro */}
            <div style={{
              background: '#0f172a',
              padding: '16px 18px',
              display: 'flex', alignItems: 'center', gap: 12,
              flexShrink: 0,
            }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>I</span>
                </div>
                <span style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 10, height: 10, borderRadius: '50%',
                  background: '#22c55e', border: '2px solid #0f172a',
                }} />
              </div>

              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.3px' }}>Ignacio</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>
                  Asistente de Grupo Rubio · En línea
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar chat"
                style={{
                  background: 'rgba(255,255,255,0.1)', border: 'none',
                  borderRadius: 8, width: 30, height: 30,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#ffffff', flexShrink: 0,
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Mensajes */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 14px 8px', background: '#f8fafc' }}>
              <Bubble role="assistant">
                <BotText text={GREETING} />
              </Bubble>

              {messages.length === 0 && (
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: 6,
                  marginTop: 10, marginBottom: 4,
                }}>
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      style={{
                        fontSize: 12, fontWeight: 600, color: '#1e3a8a',
                        background: '#f0f4ff', border: '1.5px solid #c7d7fd',
                        borderRadius: 10, padding: '9px 14px',
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#dbeafe'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f0f4ff'; }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {messages
                .filter(m => m.content.length > 0)
                .map((m, i, arr) => {
                  const isLast = i === arr.length - 1;
                  const finished = m.role === 'assistant' && !(isLast && loading);
                  return (
                    <Fragment key={i}>
                      <Bubble role={m.role}>
                        {m.role === 'assistant' ? <BotText text={m.content} /> : m.content}
                      </Bubble>
                      {finished && (
                        <FeedbackButtons
                          rating={feedback[i]}
                          onRate={r => sendFeedback(i, m.content, r)}
                        />
                      )}
                    </Fragment>
                  );
                })}

              {loading && messages[messages.length - 1]?.content !== undefined &&
                (messages[messages.length - 1].role === 'user' ||
                  messages[messages.length - 1].content.length === 0) && (
                <Bubble role="assistant">
                  <TypingDots />
                </Bubble>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={e => { e.preventDefault(); send(input); }}
              style={{
                display: 'flex', gap: 8, padding: '10px 12px 12px',
                borderTop: '1px solid #f1f5f9',
                background: '#ffffff',
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                maxLength={800}
                onChange={e => setInput(e.target.value)}
                placeholder="Escribe tu consulta..."
                style={{
                  flex: 1, minWidth: 0,
                  border: '1.5px solid #e2e8f0', borderRadius: 12,
                  padding: '9px 14px', fontSize: 13,
                  outline: 'none', color: '#0f172a',
                  background: '#f8fafc',
                }}
                className="placeholder:text-[#94a3b8] focus:border-[#0f172a] focus:bg-white"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Enviar"
                style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: loading || !input.trim() ? '#e2e8f0' : '#1e3a8a',
                  color: loading || !input.trim() ? '#94a3b8' : '#ffffff',
                  border: 'none',
                  cursor: loading || !input.trim() ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s',
                }}
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function TypingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center', height: 16 }}>
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
          style={{ width: 5, height: 5, borderRadius: '50%', background: '#94a3b8', display: 'inline-block' }}
        />
      ))}
    </span>
  );
}

function FeedbackButtons({ rating, onRate }: { rating?: 'up' | 'down'; onRate: (r: 'up' | 'down') => void }) {
  if (rating) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: -4, marginBottom: 10, paddingLeft: 4 }}>
        <span style={{ fontSize: 11, color: '#94a3b8' }}>
          {rating === 'up' ? 'Gracias por tu valoración 🙂' : 'Gracias, lo tendremos en cuenta'}
        </span>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 4, marginTop: -4, marginBottom: 10, paddingLeft: 4 }}>
      <button
        onClick={() => onRate('up')}
        aria-label="Respuesta útil"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#cbd5e1', display: 'flex' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#16a34a')}
        onMouseLeave={e => (e.currentTarget.style.color = '#cbd5e1')}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
      </button>
      <button
        onClick={() => onRate('down')}
        aria-label="Respuesta no útil"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#cbd5e1', display: 'flex' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#dc2626')}
        onMouseLeave={e => (e.currentTarget.style.color = '#cbd5e1')}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>
      </button>
    </div>
  );
}

function Bubble({ role, children }: { role: 'user' | 'assistant'; children: React.ReactNode }) {
  const isUser = role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8, marginBottom: 8 }}>
      {!isUser && (
        <div style={{
          width: 24, height: 24, borderRadius: 8, flexShrink: 0,
          background: '#0f172a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: '#ffffff' }}>I</span>
        </div>
      )}
      <div
        style={{
          maxWidth: '78%',
          padding: '9px 13px',
          borderRadius: isUser ? '14px 14px 4px 14px' : '4px 14px 14px 14px',
          fontSize: 13,
          lineHeight: 1.55,
          background: isUser ? '#1e3a8a' : '#ffffff',
          color: isUser ? '#ffffff' : '#0f172a',
          border: isUser ? 'none' : '1px solid #e2e8f0',
          boxShadow: isUser ? 'none' : '0 1px 4px rgba(0,0,0,0.05)',
          wordBreak: 'break-word',
        }}
      >
        {children}
      </div>
    </div>
  );
}
