<template>
  <div>
    <sz-icon />
  </div>
</template>

<script lang="ts" setup>
import { add, SzIcon } from 'zero-ui'
import utils from '@zero-ui/utils'
defineOptions({
  name: 'App',
})
console.log(utils.add(1, 2))
console.log(add(1, 2))
</script>

<style scoped></style>
