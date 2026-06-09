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
      <view class="yd-search-form-item">
        <view class="yd-search-form-label">报告类型</view>
        <wd-radio-group v-model="formData.reportType" type="button">
          <wd-radio :value="undefined">全部</wd-radio>
          <wd-radio value="weekly">周报</wd-radio>
          <wd-radio value="monthly">月报</wd-radio>
        </wd-radio-group>
      </view>
      <view class="yd-search-form-item">
        <view class="yd-search-form-label">状态</view>
        <wd-radio-group v-model="formData.status" type="button">
          <wd-radio :value="undefined">全部</wd-radio>
          <wd-radio :value="0">草稿</wd-radio>
          <wd-radio :value="1">已发布</wd-radio>
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
const formData = reactive({ studentId: undefined as number | undefined, reportType: undefined as string | undefined, status: undefined as number | undefined })
const placeholder = computed(() => {
  const c: string[] = []
  if (formData.studentId) c.push(`学生:${formData.studentId}`)
  if (formData.reportType) c.push(formData.reportType === 'weekly' ? '周报' : '月报')
  return c.length > 0 ? c.join(' | ') : '搜索学情报告'
})

function handleSearch() { visible.value = false; emit('search', { ...formData }) }
function handleReset() { formData.studentId = undefined; formData.reportType = undefined; formData.status = undefined; visible.value = false; emit('reset') }
</script>
