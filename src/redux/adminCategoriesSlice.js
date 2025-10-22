import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks para operações das categorias
export const loadCategories = createAsyncThunk(
  'adminCategories/loadCategories',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      
      const response = await fetch('https://atelie-juliabrandao-backend-production.up.railway.app/api/admin/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Falha ao carregar categorias');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateCategoryImage = createAsyncThunk(
  'adminCategories/updateCategoryImage',
  async ({ categoryNumber, formData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://atelie-juliabrandao-backend-production.up.railway.app/api/admin/categories/${categoryNumber}/image`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao atualizar imagem da categoria');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleCategoryStatus = createAsyncThunk(
  'adminCategories/toggleCategoryStatus',
  async ({ categoryNumber, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://atelie-juliabrandao-backend-production.up.railway.app/api/admin/categories/${categoryNumber}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao alterar status da categoria');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCategoryImage = createAsyncThunk(
  'adminCategories/deleteCategoryImage',
  async ({ categoryNumber, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://atelie-juliabrandao-backend-production.up.railway.app/api/admin/categories/${categoryNumber}/image`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao remover imagem da categoria');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  categories: [],
  loading: false,
  error: null,
  itemLoading: {} // Para controlar loading individual de categorias
};

const adminCategoriesSlice = createSlice({
  name: 'adminCategories',
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
      // Load categories
      .addCase(loadCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(loadCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update category image
      .addCase(updateCategoryImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategoryImage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(cat => cat.categoryNumber === action.payload.categoryNumber);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategoryImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Toggle status
      .addCase(toggleCategoryStatus.pending, (state, action) => {
        const categoryNumber = action.meta.arg.categoryNumber;
        state.itemLoading[categoryNumber] = true;
      })
      .addCase(toggleCategoryStatus.fulfilled, (state, action) => {
        const categoryNumber = action.meta.arg.categoryNumber;
        state.itemLoading[categoryNumber] = false;
        const index = state.categories.findIndex(cat => cat.categoryNumber === categoryNumber);
        if (index !== -1) {
          state.categories[index].isActive = action.payload.isActive;
        }
      })
      .addCase(toggleCategoryStatus.rejected, (state, action) => {
        const categoryNumber = action.meta.arg.categoryNumber;
        state.itemLoading[categoryNumber] = false;
        state.error = action.payload;
      })
      
      // Delete category image
      .addCase(deleteCategoryImage.pending, (state, action) => {
        const categoryNumber = action.meta.arg.categoryNumber;
        state.itemLoading[categoryNumber] = true;
      })
      .addCase(deleteCategoryImage.fulfilled, (state, action) => {
        const categoryNumber = action.meta.arg.categoryNumber;
        state.itemLoading[categoryNumber] = false;
        const index = state.categories.findIndex(cat => cat.categoryNumber === categoryNumber);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategoryImage.rejected, (state, action) => {
        const categoryNumber = action.meta.arg.categoryNumber;
        state.itemLoading[categoryNumber] = false;
        state.error = action.payload;
      });
  }
});

export const { setItemLoading, clearError } = adminCategoriesSlice.actions;
export default adminCategoriesSlice.reducer;
