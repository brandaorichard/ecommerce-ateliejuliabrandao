import { createSlice } from '@reduxjs/toolkit';

// Função para recuperar o estado inicial do localStorage
const getInitialState = () => {
  try {
    const saved = localStorage.getItem('maintenanceMode');
    return { enabled: saved ? JSON.parse(saved) : false };
  } catch {
    return { enabled: false };
  }
};

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState: getInitialState(),
  reducers: {
    toggleMaintenance: (state) => {
      state.enabled = !state.enabled;
      localStorage.setItem('maintenanceMode', JSON.stringify(state.enabled));
    },
    setMaintenance: (state, action) => {
      state.enabled = action.payload;
      localStorage.setItem('maintenanceMode', JSON.stringify(action.payload));
    }
  }
});

export const { toggleMaintenance, setMaintenance } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;