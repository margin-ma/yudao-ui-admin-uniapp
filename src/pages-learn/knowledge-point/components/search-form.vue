<template>
  <view @click="visible = true">
    <wd-search :placeholder="placeholder" hide-cancel disabled />
  </view>
  <wd-popup
    v-model="visible"
    position="top"
    :custom-style="getTopPopupStyle()"
    :modal-style="getTopPopupModalStyle()"
    @close="visible = false"
  >
    <view class="yd-search-form-container">
      <view class="yd-search-form-item">
        <view class="yd-search-form-label">知识点名称</view>
        <wd-input v-model="formData.name" placeholder="请输入知识点名称" clearable />
      </view>
      <view class="yd-search-form-item">
        <view class="yd-search-form-label">学科</view>
        <wd-input v-model="formData.subject" placeholder="请输入学科" clearable />
      </view>
      <view class="yd-search-form-item">
        <view class="yd-search-form-label">状态</view>
        <wd-radio-group v-model="formData.status" type="button">
          <wd-radio :value="undefined">全部</wd-radio>
          <wd-radio :value="0">启用</wd-radio>
          <wd-radio :value="1">禁用</wd-radio>
        </wd-radio-group>
      </view>
      <view class="yd-search-form-actions">
        <wd-button class="flex-1" variant="plain" @click="handleReset">重置</wd-button>
        <wd-button class="flex-1" type="primary" @click="handleSearch">搜索</wd-button>
      </view>
    </view>
  </wd-popup>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { getTopPopupModalStyle, getTopPopupStyle } from '@/utils'

const emit = defineEmits<{ search: [data: Record<string, any>]; reset: [] }>()
const visible = ref(false)
const formData = reactive({ name: undefined as string | undefined, subject: undefined as string | undefined, status: undefined as number | undefined })
const placeholder = computed(() => {
  const c: string[] = []
  if (formData.name) c.push(`名称:${formData.name}`)
  if (formData.subject) c.push(`学科:${formData.subject}`)
  return c.length > 0 ? c.join(' | ') : '搜索知识点'
})

function handleSearch() { visible.value = false; emit('search', { ...formData }) }
function handleReset() { formData.name = undefined; formData.subject = undefined; formData.status = undefined; visible.value = false; emit('reset') }
</script>
