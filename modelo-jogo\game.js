/* =========================================================
   PÊNALTI RELÂMPAGO - Lógica do Jogo
   Autora: Emanuelly Feriato (Turma 9C - Matemática)
   ========================================================= */

// Opções de personalização dos jogadores e da bola
const OPCOES_CABELO = [
  { nome: "Curto Preto", cor: "#1e293b", estilo: "curto" },
  { nome: "Moicano Azul", cor: "#3b82f6", estilo: "moicano" },
  { nome: "Black Power", cor: "#451a03", estilo: "black" },
  { nome: "Loiro Tigela", cor: "#facc15", estilo: "curto" },
  { nome: "Coque Roxo", cor: "#a855f7", estilo: "coque" }
];

const OPCOES_UNIFORME = [
  { nome: "Verde Brasil", camisa: "#16a34a", calcao: "#1d4ed8" },
  { nome: "Vermelho Fogo", camisa: "#dc2626", calcao: "#0f172a" },
  { nome: "Azul Celeste", camisa: "#0284c7", calcao: "#f8fafc" },
  { nome: "Roxo Relâmpago", camisa: "#7e22ce", calcao: "#facc15" },
  { nome: "Preto Noturno", camisa: "#1e293b", calcao: "#22c55e" }
];

const OPCOES_CHUTEIRA = [
  { nome: "Neon", cor: "#a3e635" },
  { nome: "Dourada", cor: "#f59e0b" },
  { nome: "Rosa Choque", cor: "#ec4899" },
  { nome: "Branca Clássica", cor: "#f8fafc" }
];

const OPCOES_LUVA = [
  { nome: "Laranja Pro", cor: "#f97316" },
  { nome: "Ciano Elétrico", cor: "#06b6d4" },
  { nome: "Verde Limão", cor: "#84cc16" },
  { nome: "Vermelha", cor: "#ef4444" }
];

const OPCOES_BOLA = [
  { nome: "Clássica", fundo: "#ffffff", detalhe: "#0f172a" },
  { nome: "Ouro", fundo: "#facc15", detalhe: "#854d0e" },
  { nome: "Estelar", fundo: "#38bdf8", detalhe: "#1e3a8a" },
  { nome: "Fogo", fundo: "#f97316", detalhe: "#7f1d1d" }
];

// Estado geral da partida
const estado = {
  modo: "robo", // "robo" ou "amigos"
  somAtivo: true,
  tempoInicio: 0,
  visualJ1: { cabelo: 0, uniforme: 0, chuteira: 0, luva: 0 },
  visualJ2: { cabelo: 1, uniforme: 1, chuteira: 1, luva: 1 },
  bolaSelecionada: 0,

  // Controle das cobranças
  cobrancaAtual: 1, // De 1 a 10 (5 para cada) e depois alternadas
  emAlternadas: false,
  golsJ1: 0,
  golsJ2: 0,
  historicoJ1: [],
  historicoJ2: [],
  acertosContaJ1: 0,
  totalTentativasJ1: 0,

  // Dados da rodada atual
  quemChuta: 1, // 1 ou 2
  contaAtual: null,
  jogadaEncerrada: false,
  timerRobo: null,
  ultimoCliqueJ1: null,
  ultimoCliqueJ2: null
};

// Contexto de áudio para efeitos sonoros simples sem precisar de arquivos externos
let contextoAudio = null;

function tocarSom(tipo) {
  if (!estado.somAtivo) return;
  try {
    if (!contextoAudio) {
      contextoAudio = new (window.AudioContext || window.webkitAudioContext)();
    }
    const oscilador = contextoAudio.createOscillator();
    const ganho = contextoAudio.createGain();
    oscilador.connect(ganho);
    ganho.connect(contextoAudio.destination);

    const agora = contextoAudio.currentTime;
    if (tipo === "gol") {
      oscilador.type = "triangle";
      oscilador.frequency.setValueAtTime(440, agora);
      oscilador.frequency.exponentialRampToValueAtTime(880, agora + 0.35);
      ganho.gain.setValueAtTime(0.2,