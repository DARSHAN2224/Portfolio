import { create } from 'zustand';

/**
 * Global system state management
 * Manages active module, system status, terminal logs, and simulation state
 */
export const useSystemStore = create((set, get) => ({
  // Active module state
  activeModule: 'SYSTEM_CORE',
  activeProjectId: null,
  explanationMode: false,

  // System status
  systemStatus: 'OPTIMAL', // OPTIMAL, WARNING, ERROR
  systemUptime: '99.9%',

  // Terminal logs
  terminalLogs: [
    { timestamp: new Date(), message: 'DARSHAN-OS kernel initializing...', type: 'system' },
  ],

  // Simulation state
  isSimulationRunning: false,
  activeSimulation: null,
  simulationPayload: null,

  // Actions
  setActiveModule: (module) => set({ activeModule: module }),

  setActiveProjectId: (projectId) => set({ activeProjectId: projectId }),

  toggleExplanationMode: () =>
    set((state) => ({ explanationMode: !state.explanationMode })),

  setSystemStatus: (status) => set({ systemStatus: status }),

  addLog: (message, type = 'info') =>
    set((state) => ({
      terminalLogs: [
        ...state.terminalLogs,
        {
          timestamp: new Date(),
          message,
          type,
        },
      ],
    })),

  clearLogs: () =>
    set({
      terminalLogs: [
        { timestamp: new Date(), message: 'Logs cleared', type: 'system' },
      ],
    }),

  startSimulation: (simulationType, payload = {}) =>
    set({
      isSimulationRunning: true,
      activeSimulation: simulationType,
      simulationPayload: payload,
    }),

  stopSimulation: () =>
    set({
      isSimulationRunning: false,
      activeSimulation: null,
      simulationPayload: null,
    }),

  // Reset to defaults
  reset: () =>
    set({
      activeModule: 'SYSTEM_CORE',
      activeProjectId: null,
      explanationMode: false,
      systemStatus: 'OPTIMAL',
      isSimulationRunning: false,
      activeSimulation: null,
      simulationPayload: null,
    }),
}));

export default useSystemStore;
