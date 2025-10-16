import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks para operações do carrossel
export const loadCarouselItems = createAsyncThunk(
  'adminCarousel/loadCarouselItems',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      
      const response = await fetch('https://atelie-juliabrandao-backend-production.up.railway.app/api/carousel/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao carregar itens do carrossel');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCarouselItem = createAsyncThunk(
  'adminCarousel/createCarouselItem',
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch('https://atelie-juliabrandao-backend-production.up.railway.app/api/carousel/admin/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar item do carrossel');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCarouselItem = createAsyncThunk(
  'adminCarousel/updateCarouselItem',
  async ({ id, formData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://atelie-juliabrandao-backend-production.up.railway.app/api/carousel/admin/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao atualizar item do carrossel');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCarouselItem = createAsyncThunk(
  'adminCarousel/deleteCarouselItem',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://atelie-juliabrandao-backend-production.up.railway.app/api/carousel/admin/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao remover item do carrossel');
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleCarouselItemStatus = createAsyncThunk(
  'adminCarousel/toggleCarouselItemStatus',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://atelie-juliabrandao-backend-production.up.railway.app/api/carousel/admin/${id}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao alterar status do item');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeCarouselImage = createAsyncThunk(
  'adminCarousel/removeCarouselImage',
  async ({ id, imageUrl, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://atelie-juliabrandao-backend-production.up.railway.app/api/carousel/admin/${id}/remove-image`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageUrl })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao remover imagem');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  itemLoading: {} // Para controlar loading individual de itens
};

const adminCarouselSlice = createSlice({
  name: 'adminCarousel',
  initialState,
  reducers: {
    setItemLoading: (state, action) => {
      const { id, loading } = action.payload;
      state.itemLoading[id] = loading;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Load carousel items
      .addCase(loadCarouselItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCarouselItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadCarouselItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create carousel item
      .addCase(createCarouselItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCarouselItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createCarouselItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update carousel item
      .addCase(updateCarouselItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCarouselItem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateCarouselItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete carousel item
      .addCase(deleteCarouselItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCarouselItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      .addCase(deleteCarouselItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Toggle status
      .addCase(toggleCarouselItemStatus.pending, (state, action) => {
        const id = action.meta.arg.id;
        state.itemLoading[id] = true;
      })
      .addCase(toggleCarouselItemStatus.fulfilled, (state, action) => {
        const id = action.meta.arg.id;
        state.itemLoading[id] = false;
        const index = state.items.findIndex(item => item._id === id);
        if (index !== -1) {
          state.items[index].isActive = action.payload.isActive;
        }
      })
      .addCase(toggleCarouselItemStatus.rejected, (state, action) => {
        const id = action.meta.arg.id;
        state.itemLoading[id] = false;
        state.error = action.payload;
      })
      
      // Remove carousel image
      .addCase(removeCarouselImage.pending, (state, action) => {
        const id = action.meta.arg.id;
        state.itemLoading[id] = true;
      })
      .addCase(removeCarouselImage.fulfilled, (state, action) => {
        const id = action.meta.arg.id;
        state.itemLoading[id] = false;
        const index = state.items.findIndex(item => item._id === id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(removeCarouselImage.rejected, (state, action) => {
        const id = action.meta.arg.id;
        state.itemLoading[id] = false;
        state.error = action.payload;
      });
  }
});

export const { setItemLoading, clearError } = adminCarouselSlice.actions;
export default adminCarouselSlice.reducer;
