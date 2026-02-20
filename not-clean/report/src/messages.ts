import type PQueue from "p-queue";

export const messageStandards = {
  server: {
    running(port: string | number) {
      return `Servidor rodando na porta ${port}.`;
    },
  },

  app: {
    routesSetup() {
      return "Servidor configurado com rotas principais.";
    },

    debugConfig(appConfig: unknown) {
      return `Configurações carregadas: ${JSON.stringify(
        { appConfig },
        null,
        2,
      )}`;
    },
  },

  queues: {
    generateReport: {
      add: () => "Adicionando uma nova tarefa à fila...",

      empty: () => "Todas as tarefas na fila foram processadas.",

      pending: (queue: PQueue) => {
        return `Fila ativa. Tarefas pendentes: ${queue.pending}.`;
      },
    },
  },

  infrastructure: {
    jsReport: {
      init: {
        success: () => "O jsReport foi iniciado com sucesso.",

        error: (err: unknown) => {
          return `Erro ao iniciar o jsReport: ${err}`;
        },
      },
    },
  },
};
