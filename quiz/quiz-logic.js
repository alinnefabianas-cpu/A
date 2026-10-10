/*
 * Dopamine Rewire — lógica do quiz "Descubra o que está atrapalhando seu foco".
 *
 * Funções puras, sem DOM, testáveis em Node (tests/quiz.test.js) e usadas no
 * navegador (window.QuizLogic).
 *
 * Classificação:
 *   cada alternativa soma 1 ponto a um perfil (A, B, C ou D);
 *   o perfil com mais pontos é o resultado;
 *   empate → entre os perfis empatados, vence o da resposta mais recente.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.QuizLogic = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const OPTION_KEYS = ['A', 'B', 'C', 'D'];

  const QUESTIONS = [
    {
      text: 'Quando você tenta se concentrar em uma tarefa, o que costuma acontecer?',
      options: {
        A: 'Acabo olhando notificações ou abrindo outros aplicativos.',
        B: 'Não sei exatamente qual tarefa deveria fazer primeiro.',
        C: 'Penso em tantas coisas que fica difícil organizar tudo.',
        D: 'Sei o que preciso fazer, mas tenho dificuldade para começar.',
      },
    },
    {
      text: 'O que mais costuma interromper sua produtividade?',
      options: {
        A: 'Redes sociais, mensagens e outras distrações.',
        B: 'Ficar em dúvida sobre o que merece minha atenção.',
        C: 'Ter muitas tarefas acumuladas ao mesmo tempo.',
        D: 'Adiar o início de tarefas mesmo quando tenho tempo.',
      },
    },
    {
      text: 'Quando você tem várias tarefas para fazer, como reage?',
      options: {
        A: 'Começo uma, me distraio e acabo mudando para outra.',
        B: 'Tenho dificuldade para decidir qual é a mais importante.',
        C: 'Fico sobrecarregado tentando pensar em tudo ao mesmo tempo.',
        D: 'Demoro para começar, mesmo sabendo o que precisa ser feito.',
      },
    },
    {
      text: 'Como costuma ser seu uso do celular durante os estudos ou o trabalho?',
      options: {
        A: 'Pego o celular automaticamente, mesmo sem precisar dele.',
        B: 'Acabo usando o celular quando não sei qual tarefa priorizar.',
        C: 'Uso o celular para escapar da sensação de estar sobrecarregado.',
        D: 'Uso o celular para adiar uma tarefa que estou evitando começar.',
      },
    },
    {
      text: 'O que acontece quando você planeja seu dia?',
      options: {
        A: 'Faço um plano, mas me distraio e não consigo segui-lo.',
        B: 'Coloco várias coisas no plano e não sei por onde começar.',
        C: 'Tento encaixar tarefas demais e termino o dia sobrecarregado.',
        D: 'Planejo bastante, mas tenho dificuldade para colocar o plano em prática.',
      },
    },
    {
      text: 'Qual destas situações mais se parece com sua rotina?',
      options: {
        A: 'Começo algo e logo minha atenção vai para outra coisa.',
        B: 'Passo muito tempo decidindo o que devo fazer.',
        C: 'Sinto que tenho mais tarefas do que consigo organizar.',
        D: 'Fico esperando o momento ideal para começar.',
      },
    },
    {
      text: 'Se pudesse melhorar apenas uma coisa na sua rotina agora, qual seria?',
      options: {
        A: 'Conseguir manter a atenção sem tantas interrupções.',
        B: 'Saber claramente o que fazer primeiro.',
        C: 'Organizar minhas responsabilidades sem me sentir tão sobrecarregado.',
        D: 'Conseguir começar minhas tarefas com mais facilidade.',
      },
    },
  ];

  const PROFILES = {
    A: {
      id: 'distracoes',
      name: 'Distrações constantes',
      title: 'Seu foco pode estar sendo interrompido com frequência.',
      description:
        'Suas respostas indicam que distrações externas ou mudanças frequentes de atenção podem estar dificultando a continuidade das suas tarefas.',
      nextStep:
        'Escolha uma tarefa, silencie notificações não essenciais durante um período curto e deixe apenas o necessário aberto.',
    },
    B: {
      id: 'prioridades',
      name: 'Falta de prioridades',
      title: 'Você não precisa fazer tudo. Precisa decidir o que vem primeiro.',
      description: 'Suas respostas indicam que decidir por onde começar pode estar consumindo tempo e energia.',
      nextStep: 'Escolha uma tarefa importante e escreva uma única ação concreta para iniciá-la.',
      example: 'Em vez de escrever ‘estudar matemática’, escreva ‘resolver a primeira questão da lista’.',
    },
    C: {
      id: 'sobrecarga',
      name: 'Sobrecarga de tarefas',
      title: 'Talvez você esteja tentando organizar coisas demais ao mesmo tempo.',
      description: 'Suas respostas indicam que o volume de tarefas pode estar dificultando a organização da rotina.',
      nextStep:
        'Anote suas tarefas e escolha apenas uma para trabalhar primeiro. Depois, divida as demais em etapas menores e realistas.',
    },
    D: {
      id: 'comecar',
      name: 'Dificuldade para começar',
      title: 'Transformar intenção em ação pode ser seu principal desafio.',
      description:
        'Suas respostas indicam que começar uma tarefa pode ser mais difícil do que saber o que precisa ser feito.',
      nextStep:
        'Defina uma primeira ação tão clara e pequena que você consiga começar sem precisar planejar tudo antes.',
    },
  };

  const isOptionKey = (v) => typeof v === 'string' && OPTION_KEYS.indexOf(v) !== -1;

  /** Respostas completas: exatamente uma alternativa válida por pergunta. */
  function isComplete(answers) {
    return Array.isArray(answers) && answers.length === QUESTIONS.length && answers.every(isOptionKey);
  }

  function countAnswers(answers) {
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    (answers || []).forEach((a) => {
      if (isOptionKey(a)) counts[a] += 1;
    });
    return counts;
  }

  /**
   * Perfil vencedor. Em empate, percorre as respostas da última para a
   * primeira e escolhe o primeiro perfil que esteja entre os empatados.
   * Retorna null se as respostas estiverem incompletas.
   */
  function classify(answers) {
    if (!isComplete(answers)) return null;
    const counts = countAnswers(answers);
    const max = Math.max.apply(null, OPTION_KEYS.map((k) => counts[k]));
    const tied = OPTION_KEYS.filter((k) => counts[k] === max);
    let key = tied[0];
    if (tied.length > 1) {
      for (let i = answers.length - 1; i >= 0; i--) {
        if (tied.indexOf(answers[i]) !== -1) {
          key = answers[i];
          break;
        }
      }
    }
    return { key, profile: PROFILES[key], counts, tie: tied.length > 1, tied };
  }

  /** Estado vazio do quiz (o que fica salvo na sessão). */
  function emptyState() {
    return { started: false, current: 0, answers: QUESTIONS.map(() => null) };
  }

  /** Valida um estado vindo do armazenamento; descarta o que não for reconhecido. */
  function sanitizeState(raw) {
    const s = emptyState();
    if (!raw || typeof raw !== 'object') return s;
    s.started = raw.started === true;
    if (Array.isArray(raw.answers)) {
      s.answers = QUESTIONS.map((_, i) => (isOptionKey(raw.answers[i]) ? raw.answers[i] : null));
    }
    const cur = Number.isInteger(raw.current) ? raw.current : 0;
    // Não deixa pular perguntas: no máximo a primeira sem resposta.
    const firstOpen = s.answers.indexOf(null);
    const maxCur = firstOpen === -1 ? QUESTIONS.length - 1 : firstOpen;
    s.current = Math.min(Math.max(cur, 0), maxCur);
    return s;
  }

  return {
    OPTION_KEYS,
    QUESTIONS,
    PROFILES,
    isComplete,
    countAnswers,
    classify,
    emptyState,
    sanitizeState,
  };
});
