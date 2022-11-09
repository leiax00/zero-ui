<template>
  <div>
    <sz-icon />
  </div>
</template>

<script lang="ts" setup>
import { add, SzIcon } from '@leiax00/zero-ui'
import utils from '@leiax00/utils'
defineOptions({
  name: 'App',
})
console.log(utils.add(1, 2))
console.log(add(1, 2))
</script>

<style scoped></style>
