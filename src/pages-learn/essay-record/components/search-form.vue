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
        <view class="yd-search-form-label">学生ID</view>
        <wd-input v-model="formData.studentId" type="number" placeholder="请输入学生ID" clearable />
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
const formData = reactive({ studentId: undefined as number | undefined })
const placeholder = computed(() => formData.studentId ? `学生:${formData.studentId}` : '搜索作文记录')

function handleSearch() { visible.value = false; emit('search', { ...formData }) }
function handleReset() { formData.studentId = undefined; visible.value = false; emit('reset') }
</script>
