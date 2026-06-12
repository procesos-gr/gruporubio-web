'use client';

import { useState, useRef, useEffect, useCallback, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const GREETING =
  '¡Hola! Soy el asistente de Grupo Rubio. Puedo ayudarte con nuestros servicios de limpieza, control de plagas, alquiler de maquinaria o productos de la tienda. ¿Qué necesitas?';

const SUGGESTIONS = [
  '¿Qué servicios ofrecéis?',
  'Quiero alquilar una fregadora',
  'Tengo un problema de plagas',
];

/** Renderiza texto del bot: [texto](/ruta) → links, **texto** → negrita, \n → <br> — sin HTML crudo */
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
        if (bold) {
          return <strong key={i}>{bold[1]}</strong>;
        }
        // saltos de línea
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

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

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
      // historial acotado: últimas 11 + nueva (la API admite máx. 12)
      const history = [...messages.slice(-11), userMsg];
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

        // Streaming de texto plano
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

  return (
    <>
      {/* Botón flotante */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? 'Cerrar chat' : 'Abrir chat'}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 12,
          background: '#0F1623',
          color: '#ffffff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(15,22,35,0.35)',
          zIndex: 9990,
        }}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              bottom: 92,
              right: 24,
              width: 'min(380px, calc(100vw - 32px))',
              height: 'min(560px, calc(100vh - 130px))',
              background: '#ffffff',
              borderRadius: 14,
              border: '1.5px solid #e5e7eb',
              boxShadow: '0 12px 40px rgba(0,0,0,0.16)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              zIndex: 9991,
            }}
          >
            {/* Header */}
            <div style={{ background: '#0F1623', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.10)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Sparkles size={18} color="#ffffff" />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#ffffff' }}>Asistente Grupo Rubio</p>
                <p style={{ margin: 0, fontSize: 11.5, color: '#9CA3AF' }}>Responde al instante</p>
              </div>
            </div>

            {/* Mensajes */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px', background: '#F9FAFB' }}>
              {/* Saludo */}
              <Bubble role="assistant">
                <BotText text={GREETING} />
              </Bubble>

              {/* Sugerencias iniciales */}
              {messages.length === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10, alignItems: 'flex-start' }}>
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      style={{
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: '#0F1623',
                        background: '#ffffff',
                        border: '1.5px solid #e5e7eb',
                        borderRadius: 8,
                        padding: '8px 12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m, i) => (
                <Bubble key={i} role={m.role}>
                  {m.role === 'assistant' ? <BotText text={m.content} /> : m.content}
                </Bubble>
              ))}

              {/* Indicador escribiendo */}
              {loading && messages[messages.length - 1]?.role === 'user' && (
                <Bubble role="assistant">
                  <span style={{ color: '#9CA3AF', fontSize: 13 }}>Escribiendo…</span>
                </Bubble>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={e => {
                e.preventDefault();
                send(input);
              }}
              style={{
                display: 'flex',
                gap: 8,
                padding: 12,
                borderTop: '1.5px solid #e5e7eb',
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
                  flex: 1,
                  minWidth: 0,
                  border: '1.5px solid #e5e7eb',
                  borderRadius: 8,
                  padding: '10px 14px',
                  fontSize: 13,
                  outline: 'none',
                  color: '#111827',
                }}
                className="placeholder:text-[#9CA3AF] focus:border-[#0F1623]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Enviar"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 8,
                  background: loading || !input.trim() ? '#9CA3AF' : '#0F1623',
                  color: '#ffffff',
                  border: 'none',
                  cursor: loading || !input.trim() ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background 0.15s',
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ role, children }: { role: 'user' | 'assistant'; children: React.ReactNode }) {
  const isUser = role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
      <div
        style={{
          maxWidth: '82%',
          padding: '10px 14px',
          borderRadius: 12,
          fontSize: 13,
          lineHeight: 1.55,
          background: isUser ? '#0F1623' : '#ffffff',
          color: isUser ? '#ffffff' : '#111827',
          border: isUser ? 'none' : '1.5px solid #e5e7eb',
          wordBreak: 'break-word',
        }}
      >
        {children}
      </div>
    </div>
  );
}
