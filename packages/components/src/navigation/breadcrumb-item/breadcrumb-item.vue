<template>
  <li v-bind="$attrs" class="mg-breadcrumb-item">
    <RouterLink v-if="to" class="mg-breadcrumb-item__inner is-link" :to="to" :replace="replace"><slot /></RouterLink>
    <a v-else-if="href" class="mg-breadcrumb-item__inner is-link" :href="href"><slot /></a>
    <span v-else class="mg-breadcrumb-item__inner"><slot /></span>
    <span class="mg-breadcrumb-item__separator" aria-hidden="true">
      <component :is="breadcrumb?.separatorIcon" v-if="breadcrumb?.separatorIcon && typeof breadcrumb.separatorIcon !== 'string'" />
      <template v-else>{{ breadcrumb?.separatorIcon || breadcrumb?.separator || '/' }}</template>
    </span>
  </li>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import { mgBreadcrumbKey } from '../breadcrumb/context'

defineOptions({ name: 'MgBreadcrumbItem', inheritAttrs: false })
withDefaults(defineProps<{ to?: RouteLocationRaw; replace?: boolean; href?: string }>(), { replace: false, href: '' })
const breadcrumb = inject(mgBreadcrumbKey, undefined)
</script>

<style scoped>
.mg-breadcrumb-item { display: inline-flex; align-items: center; list-style: none; }
.mg-breadcrumb-item__inner { color: var(--mg-color-text-regular, #4e5669); text-decoration: none; transition: color .15s ease; }
.mg-breadcrumb-item__inner.is-link { font-weight: 500; cursor: pointer; }
.mg-breadcrumb-item__inner.is-link:hover { color: var(--mg-color-primary, #0052d9); }
.mg-breadcrumb-item__separator { display: inline-flex; align-items: center; margin: 0 9px; color: var(--mg-color-text-placeholder, #a6abb6); }
</style>
