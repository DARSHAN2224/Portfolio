import { create } from 'zustand';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

interface ContactStore {
  form: ContactForm;
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  setForm: (form: Partial<ContactForm>) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setSuccess: (isSuccess: boolean) => void;
  setError: (error: string | null) => void;
  resetForm: () => void;
}

const initialForm: ContactForm = {
  name: '',
  email: '',
  message: '',
};

export const useContact = create<ContactStore>((set) => ({
  form: initialForm,
  isSubmitting: false,
  isSuccess: false,
  error: null,
  setForm: (formData) =>
    set((state) => ({
      form: { ...state.form, ...formData },
    })),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  setSuccess: (isSuccess) => set({ isSuccess }),
  setError: (error) => set({ error }),
  resetForm: () =>
    set({
      form: initialForm,
      isSubmitting: false,
      isSuccess: false,
      error: null,
    }),
}));