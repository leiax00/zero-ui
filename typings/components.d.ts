// For this project development
import '@vue/runtime-core'

declare global {
  declare function loadlive2d(t, i, e?): void
}

declare module '@vue/runtime-core' {
  // GlobalComponents for Volar
  export interface GlobalComponents {
    SzIcon: typeof import('../packages/zero-ui')['SzIcon']
  }
}
export {}
