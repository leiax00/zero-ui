import type { ExtractPropTypes } from 'vue'
import type LittleCute from './LittleCute.vue'

export const cuteProps = {
  className: {
    type: String,
    default: '',
  },
}

export const cuteEmits = {
  itemClick: (value: number) => value,
  itemEnter: (value: number) => value,
}
export type CuteProps = ExtractPropTypes<typeof cuteProps>
export type CuteEmits = ExtractPropTypes<typeof cuteEmits>
export type LittleCuteInstance = InstanceType<typeof LittleCute>
