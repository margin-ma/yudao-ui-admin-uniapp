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
        <view class="yd-search-form-label">题干</view>
        <wd-input v-model="formData.stem" placeholder="请输入题干关键字" clearable />
      </view>
      <view class="yd-search-form-item">
        <view class="yd-search-form-label">学科</view>
        <wd-input v-model="formData.subject" placeholder="请输入学科" clearable />
      </view>
      <view class="yd-search-form-item">
        <view class="yd-search-form-label">年级</view>
        <wd-input v-model="formData.grade" placeholder="请输入年级" clearable />
      </view>
      <view class="yd-search-form-item">
        <view class="yd-search-form-label">题型</view>
        <wd-radio-group v-model="formData.questionType" type="button">
          <wd-radio :value="undefined">全部</wd-radio>
          <wd-radio :value="1">单选</wd-radio>
          <wd-radio :value="2">多选</wd-radio>
          <wd-radio :value="3">判断</wd-radio>
          <wd-radio :value="4">填空</wd-radio>
          <wd-radio :value="5">简答</wd-radio>
        </wd-radio-group>
      </view>
      <view class="yd-search-form-item">
        <view class="yd-search-form-label">难度</view>
        <wd-radio-group v-model="formData.difficulty" type="button">
          <wd-radio :value="undefined">全部</wd-radio>
          <wd-radio :value="1">简单</wd-radio>
          <wd-radio :value="2">中等</wd-radio>
          <wd-radio :value="3">困难</wd-radio>
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
const formData = reactive({
  stem: undefined as string | undefined,
  subject: undefined as string | undefined,
  grade: undefined as string | undefined,
  questionType: undefined as number | undefined,
  difficulty: undefined as number | undefined,
  status: undefined as number | undefined,
})
const placeholder = computed(() => {
  const c: string[] = []
  if (formData.stem) c.push(`题干:${formData.stem}`)
  if (formData.subject) c.push(`学科:${formData.subject}`)
  return c.length > 0 ? c.join(' | ') : '搜索题目'
})

function handleSearch() { visible.value = false; emit('search', { ...formData }) }
function handleReset() {
  formData.stem = undefined; formData.subject = undefined; formData.grade = undefined
  formData.questionType = undefined; formData.difficulty = undefined; formData.status = undefined
  visible.value = false; emit('reset')
}
</script>
