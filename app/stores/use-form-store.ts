import { produce } from 'immer'
import { create } from 'zustand'

import { storeMiddleware } from './middleware'

export interface FormStore {
  watermarkData: {
    color: string;
    size: number;
    text: string;
    useWatermark: boolean;
    opacity: number;
    angle: number;
    space: number;
  };
  basicsData: {
    size: string;
    background: { key: string; color: string; customColor: string };
    renderingMethod: number;
    whiteningStrength: number;
    headMeasureRatio: number;
    headDistance: number;
    width: number;
    height: number;
  }
  url: string;
}

interface FormActions {
  updateField: <T extends keyof FormStore>(
    field: T,
    value: FormStore[T]
  ) => void
  updateAll: (fields: Partial<FormStore>) => void
  setHasHydrated: (value: boolean) => void
}

export const useFormStore = create<FormStore & FormActions>()(
  storeMiddleware<FormStore & FormActions>(
    (set) => ({
      watermarkData: {
        color: '#000',
        size: 20,
        text: '',
        useWatermark: false,
        opacity: 0.15,
        angle: 30,
        space: 25,
      },
      basicsData: {
        size: 'One inch',
        background: { key: 'blue', color: '#628bce', customColor: '#40c057' },
        renderingMethod: 0,
        whiteningStrength: 2,
        headMeasureRatio: 0.2,
        headDistance: 0.12,
        width: 0,
        height: 0,
      },
      url: '',
      updateField: (field, value) =>
        set(
          produce((state) => {
            state[field] = value
          })
        ),
      updateAll: (fields) =>
        set(
          produce((state) => {
            for (const [key, value] of Object.entries(fields)) {
              if (typeof value === 'object' && value !== null) {
                state[key as keyof FormStore] = {
                  ...state[key as keyof FormStore],
                  ...value,
                };
              } else {
                state[key as keyof FormStore] = value;
              }
            }
          })
        ),
      setHasHydrated: (value) =>
        set(
          produce((state) => {
            state._hasHydrated = value
          })
        ),
    }),
    'user_form_store_videosum'
  )
)
