import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { 
  fetchCoursesAdmin, 
  createCourse, 
  updateCourse, 
  deleteCourse,
  toggleCourseStatus,
  removeCourseImage
} from "../services/adminCourseService";
import { showToast } from "./toastSlice";

export const loadCourses = createAsyncThunk("adminCourses/load", async (_, { getState, dispatch, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    return await fetchCoursesAdmin(token);
  } catch (e) {
    dispatch(showToast({ type: "error", message: e.message }));
    return rejectWithValue(e.message);
  }
});

export const addCourse = createAsyncThunk("adminCourses/add", async (payload, { getState, dispatch, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const course = await createCourse(token, payload);
    dispatch(showToast({ type: "success", message: "Curso criado com sucesso!" }));
    return course;
  } catch (e) {
    dispatch(showToast({ type: "error", message: e.message }));
    return rejectWithValue(e.message);
  }
});

export const editCourse = createAsyncThunk("adminCourses/edit", async ({ id, data }, { getState, dispatch, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const course = await updateCourse(token, id, data);
    dispatch(showToast({ type: "success", message: "Curso atualizado com sucesso!" }));
    return course;
  } catch (e) {
    dispatch(showToast({ type: "error", message: e.message }));
    return rejectWithValue(e.message);
  }
});

export const removeCourse = createAsyncThunk("adminCourses/remove", async (id, { getState, dispatch, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    await deleteCourse(token, id);
    dispatch(showToast({ type: "success", message: "Curso removido com sucesso!" }));
    return id;
  } catch (e) {
    dispatch(showToast({ type: "error", message: e.message }));
    return rejectWithValue(e.message);
  }
});

export const toggleStatus = createAsyncThunk("adminCourses/toggleStatus", async (id, { getState, dispatch, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const course = await toggleCourseStatus(token, id);
    dispatch(showToast({ 
      type: "success", 
      message: course.isActive ? "Curso ativado com sucesso!" : "Curso desativado com sucesso!" 
    }));
    return course;
  } catch (e) {
    dispatch(showToast({ type: "error", message: e.message }));
    return rejectWithValue(e.message);
  }
});

export const removeImage = createAsyncThunk("adminCourses/removeImage", async ({ id, imageUrl }, { getState, dispatch, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const course = await removeCourseImage(token, id, imageUrl);
    dispatch(showToast({ type: "success", message: "Imagem removida com sucesso!" }));
    return course;
  } catch (e) {
    dispatch(showToast({ type: "error", message: e.message }));
    return rejectWithValue(e.message);
  }
});

const adminCoursesSlice = createSlice({
  name: "adminCourses",
  initialState: { items: [], loading: false, error: null },
  reducers: {
    setItemLoading: (state, action) => {
      const { id, loading } = action.payload;
      const item = state.items.find(i => (i._id === id || i.id === id));
      if (item) {
        item.loading = loading;
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(loadCourses.pending, s => { s.loading = true; s.error = null; })
      .addCase(loadCourses.fulfilled, (s, a) => { 
        s.loading = false; 
        s.items = Array.isArray(a.payload) ? a.payload : []; 
      })
      .addCase(loadCourses.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(addCourse.fulfilled, (s, a) => { 
        s.items.push(a.payload); 
      })
      .addCase(editCourse.fulfilled, (s, a) => {
        const idx = s.items.findIndex(c => (c._id === a.payload._id || c.id === a.payload._id || c.id === a.payload.id));
        if (idx >= 0) s.items[idx] = a.payload;
      })
      .addCase(removeCourse.fulfilled, (s, a) => {
        s.items = s.items.filter(c => (c._id !== a.payload && c.id !== a.payload));
      })
      .addCase(toggleStatus.fulfilled, (s, a) => {
        const idx = s.items.findIndex(c => (c._id === a.payload._id || c.id === a.payload._id || c.id === a.payload.id));
        if (idx >= 0) {
          s.items[idx].isActive = a.payload.isActive;
        }
      })
      .addCase(removeImage.fulfilled, (s, a) => {
        const idx = s.items.findIndex(c => (c._id === a.payload._id || c.id === a.payload._id || c.id === a.payload.id));
        if (idx >= 0) {
          s.items[idx].images = a.payload.images || [];
          s.items[idx].img = a.payload.img || null;
        }
      });
  }
});

export const { setItemLoading } = adminCoursesSlice.actions;

export default adminCoursesSlice.reducer;
