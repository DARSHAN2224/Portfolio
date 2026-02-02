/**
 * Kernel Command Handler
 * Parses and executes system commands from AI responses
 */
import { useSystemStore } from '../stores/useSystemStore.js';

export const handleKernelCommand = (command) => {
  if (!command) return;

  const { addLog, setActiveModule, startSimulation, stopSimulation } = useSystemStore.getState();

  switch (command.cmd) {
    case 'NAVIGATE':
      setActiveModule(command.target);
      addLog(`SYSTEM: Navigating to ${command.target}`, 'command');
      break;

    case 'RUN_SIMULATION':
      startSimulation(command.type, command.payload);
      addLog(`SYSTEM: Launching simulation ${command.type}`, 'command');
      break;

    case 'STOP_SIMULATION':
      stopSimulation();
      addLog('SYSTEM: Simulation terminated', 'command');
      break;

    case 'EXPLAIN_PROJECT':
      // Would load project explanation mode
      addLog(`SYSTEM: Loading explanation for project ${command.projectId}`, 'command');
      break;

    default:
      console.warn('Unknown command:', command.cmd);
  }
};

export default handleKernelCommand;
