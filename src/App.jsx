

import React, { useEffect, useState } from 'react';
import './App.css';




function App() {
  // Etapas: q1 (pergunta inicial), q2 (mês), q3 (fruta), q4 (anime vs série), final
  const [step, setStep] = useState('q1');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  const handleNao = () => alert('Ahhh, tenta de novo vai! 😜');

  const handleSimQ1 = () => {
    setError('');
    setAnswer('');
    setStep('q2');
  };

  const normalize = (s) => s
    .toLowerCase()
    .trim()
    .replace(/[\s\-_.]+/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const submitQ2 = () => {
    const norm = normalize(answer);
    const allowed = new Set(['fevereiro', 'fev', '02', '2', 'february']);
    if (allowed.has(norm)) {
      setError('');
      setAnswer('');
      setStep('q3');
    } else {
      setError('Quase! Tenta de novo 🥰');
    }
  };

  const submitQ3 = () => {
    const norm = normalize(answer);
    const allowed = new Set(['maca']); // aceita maçã/maça/"maca" via normalização
    if (allowed.has(norm)) {
      setError('');
      setAnswer('');
      setStep('q4');
    } else {
      setError('Hmm... não vale chutar, hein 😅');
    }
  };

  const chooseQ4 = (choice) => {
    const norm = normalize(choice);
    if (norm === 'anime') {
      setError('');
      setStep('final');
    } else {
      setError('Ih, essa não! Eu prefiro anime 🤓');
    }
  };

  const onKeyDownQ2 = (e) => { if (e.key === 'Enter') submitQ2(); };
  const onKeyDownQ3 = (e) => { if (e.key === 'Enter') submitQ3(); };

  return (
    <div>
      {step === 'q1' && (
        <div className="pergunta-card animate-3d">
          <h2 className="pergunta-titulo">Oi gatinha, você está pronta? Em Em</h2>
          <div className="botoes-pergunta">
            <button className="btn-sim" onClick={handleSimQ1}>Sim</button>
            <button className="btn-nao" onClick={handleNao}>Não</button>
          </div>
        </div>
      )}

      {step === 'q2' && (
        <div className="pergunta-card animate-3d">
          <h2 className="pergunta-titulo">Próxima pergunta, gatinha:</h2>
          <p className="pergunta-sub">Que mês começamos a namorar? Nada de olhar no IG, hein! Tô de olho, rum 😏</p>
          <div className="linha-input">
            <input
              className="input-pergunta"
              placeholder="Digite o mês (ex.: fevereiro, 02, fev)"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={onKeyDownQ2}
              inputMode="text"
              autoFocus
            />
            <button className="btn-enviar" onClick={submitQ2}>Enviar</button>
          </div>
          {error && <small className="erro-msg">{error}</small>}
        </div>
      )}

      {step === 'q3' && (
        <div className="pergunta-card animate-3d">
          <h2 className="pergunta-titulo">Desafio valendo beijo! 😘</h2>
          <p className="pergunta-sub">Se estamos juntos há 6 meses, você me conhece né? Qual é a minha fruta preferida?</p>
          <div className="linha-input">
            <input
              className="input-pergunta"
              placeholder="Digite a fruta (dica: tem acento 😉)"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={onKeyDownQ3}
              inputMode="text"
              autoFocus
            />
            <button className="btn-enviar" onClick={submitQ3}>Enviar</button>
          </div>
          {error && <small className="erro-msg">{error}</small>}
        </div>
      )}

      {step === 'q4' && (
        <div className="pergunta-card animate-3d">
          <h2 className="pergunta-titulo">Quase lá! Bora pra última:</h2>
          <p className="pergunta-sub">Entre série “normal” e série de anime, qual eu gosto mais?</p>
          <div className="opcoes">
            <button className="btn-opcao" onClick={() => chooseQ4('serie')}>Série normal</button>
            <button className="btn-opcao destaque" onClick={() => chooseQ4('anime')}>Anime</button>
          </div>
          {error && <small className="erro-msg">{error}</small>}
        </div>
      )}

      {step === 'final' && <FinalScreen />}
    </div>
  );
}

function FinalScreen() {
  const lines = [
    'OIee amorzaum, obrigado por estar 6 meses com euuzinho. ❤️',
    'Amo cada minuto que passei do seu lado, amo estar com voce, amo seu jeito, amo seu sorriso..',
    'Você é meu amor, minha paz e meu futuro. Te amo muit muitaumm...'
  ];
  const [typed, setTyped] = useState('');
  const [line, setLine] = useState(0);
  const [char, setChar] = useState(0);
  const [open, setOpen] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [display, setDisplay] = useState([]);
  const [idx, setIdx] = useState(0);
  const [hover, setHover] = useState(false);
  const [daysTogether, setDaysTogether] = useState(0);
  const [hasEnoughPhotos, setHasEnoughPhotos] = useState(false);

  useEffect(() => {
    if (line >= lines.length) return; // terminou
    const current = lines[line];
    const timer = setTimeout(() => {
      setTyped(prev => prev + current.charAt(char));
      const nextChar = char + 1;
      if (nextChar >= current.length) {
        // próxima linha
        setTyped(prev => prev + (line < lines.length - 1 ? '\n' : ''));
        setLine(l => l + 1);
        setChar(0);
      } else {
        setChar(nextChar);
      }
    }, 35);
    return () => clearTimeout(timer);
  }, [char, line]);

  // Carregar fotos da pasta opcional src/assets/photos
  useEffect(() => {
    // Busca fotos .jpg/.jpeg tanto em src/assets quanto em src/assets/photos
    const modules = import.meta.glob('./assets/**/*.{jpg,jpeg}', { eager: true });
    const entries = Object.entries(modules).sort(([a], [b]) => a.localeCompare(b));
    const loaded = entries
      .map(([, m]) => (m && m.default) ? m.default : m)
      .filter(Boolean);
    if (loaded.length >= 3) {
      setPhotos(loaded);
      setDisplay([loaded[0], loaded[1 % loaded.length], loaded[2 % loaded.length]]);
      setHasEnoughPhotos(true);
    } else {
      setHasEnoughPhotos(false);
    }
  }, []);

  // Rotação automática das fotos
  useEffect(() => {
    if (!photos.length || hover) return;
    const t = setInterval(() => {
      setIdx((i) => {
        const next = (i + 1) % photos.length;
        setDisplay([
          photos[next],
          photos[(next + 1) % photos.length],
          photos[(next + 2) % photos.length],
        ]);
        return next;
      });
    }, 4000);
    return () => clearInterval(t);
  }, [photos, hover]);

  // Contador de dias juntos desde 28/02/2025
  useEffect(() => {
    const start = new Date(2025, 1, 28); // mês 0-based (1 = Fev)
    const now = new Date();
    const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    setDaysTogether(diff);
  }, []);

  return (
    <div className="love-container fade-in">
      <header className="love-header">
        <h1>Gui <span className="heart">♥</span> Juh</h1>
        <p className="subtitle">6 meses juntos — 28/02/2025 a 28/08/2025 <span className="days">· {daysTogether} dias juntinhos</span></p>
      </header>
      <div className="bg-glow" aria-hidden="true" />
      <div className="typing" aria-label="Mensagem romântica digitando">
        {typed}
        <span className="caret"/>
      </div>

      <section>
        <div
          className={`photo-stack ${open ? 'open' : ''}`}
          role="button"
          tabIndex={0}
          aria-label="Toque para abrir ou fechar as fotos"
          onClick={() => setOpen((o) => !o)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setOpen((o) => !o);
          }}
        >
          <div className="photo-card c1">
            {hasEnoughPhotos ? (
              <img src={display[0]} alt="Nossa foto 1" className="photo-img" />
            ) : (
              <div className="photo-ph" aria-hidden="true" />
            )}
          </div>
          <div className="photo-card c2">
            {hasEnoughPhotos ? (
              <img src={display[1]} alt="Nossa foto 2" className="photo-img" />
            ) : (
              <div className="photo-ph" aria-hidden="true" />
            )}
          </div>
          <div className="photo-card c3">
            {hasEnoughPhotos ? (
              <img src={display[2]} alt="Nossa foto 3" className="photo-img" />
            ) : (
              <div className="photo-ph" aria-hidden="true" />
            )}
          </div>
        </div>
        <small className="stack-hint">
          {hasEnoughPhotos ? (
            <>Toque para {open ? 'fechar' : 'abrir'} 💞</>
          ) : (
            <>Adicione 3 fotos .jpg/.jpeg em <code>src/assets</code> ou <code>src/assets/photos</code> 💖</>
          )}
        </small>
      </section>

      <footer className="love-footer">
        <small>Feito com amor para Juh — 2025</small>
      </footer>

      <div className="hearts">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className={`heart-float h${i+1}`}>♥</span>
        ))}
      </div>
    </div>
  );
}

export default App;
