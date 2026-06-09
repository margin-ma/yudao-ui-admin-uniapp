<template>
  <view class="yd-page-container">
    <wd-navbar
      title="题库管理"
      left-arrow placeholder safe-area-inset-top fixed
      @click-left="handleBack"
    />
    <SearchForm @search="handleQuery" @reset="handleReset" />
    <view class="p-24rpx">
      <view
        v-for="item in list"
        :key="item.id"
        class="mb-24rpx rounded-12rpx bg-white"
        @click="handleDetail(item)"
      >
        <view class="p-24rpx">
          <view class="flex items-center justify-between">
            <view class="flex items-center gap-8rpx">
              <wd-tag :type="questionTypeTagType(item.questionType)" size="small">
                {{ questionTypeLabel(item.questionType) }}
              </wd-tag>
              <wd-tag :type="difficultyTagType(item.difficulty)" size="small">
                {{ difficultyLabel(item.difficulty) }}
              </wd-tag>
              <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="item.status" />
            </view>
            <text class="text-22rpx text-[#999]">{{ item.subject }} {{ item.grade }}</text>
          </view>
          <view class="mt-12rpx line-clamp-2 text-28rpx text-[#333]">{{ item.stem }}</view>
          <view class="mt-8rpx flex items-center gap-16rpx text-22rpx text-[#999]">
            <text v-if="item.chapter">{{ item.chapter }} / {{ item.section }}</text>
            <text v-if="item.errorRate != null">错误率: {{ (item.errorRate * 100).toFixed(1) }}%</text>
          </view>
        </view>
      </view>
      <view v-if="loadMoreState !== 'loading' && list.length === 0" class="py-100rpx text-center">
        <wd-empty icon="content" tip="暂无题目数据" />
      </view>
      <wd-loadmore
        v-if="list.length > 0"
        :state="loadMoreState"
        @reload="loadMore"
      />
    </view>
    <wd-fab
      v-if="hasAccessByCodes(['learn:question:create'])"
      position="right-bottom"
      type="primary"
      :expandable="false"
      @click="handleAdd"
    />
  </view>
</template>

<script lang="ts" setup>
import type { QuestionBank } from '@/api/learn'
import type { LoadMoreState } from '@/http/types'
import { onReachBottom } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { getQuestionBankPage } from '@/api/learn/question-bank'
import { useAccess } from '@/hooks/useAccess'
import { navigateBackPlus } from '@/utils'
import { DICT_TYPE } from '@/utils/constants'
import { DifficultyLevelEnum, QuestionTypeEnum } from '@/utils/constants/biz-learn-enum'
import SearchForm from './components/search-form.vue'

definePage({
  style: { navigationBarTitleText: '', navigationStyle: 'custom' },
})

const { hasAccessByCodes } = useAccess()
const total = ref(0)
const list = ref<QuestionBank[]>([])
const loadMoreState = ref<LoadMoreState>('loading')
const queryParams = ref({ pageNo: 1, pageSize: 10 })

function handleBack() { navigateBackPlus() }

const questionTypeLabel = (t: number) => {
  const map: Record<number, string> = { [QuestionTypeEnum.SINGLE_CHOICE]: '单选', [QuestionTypeEnum.MULTIPLE_CHOICE]: '多选', [QuestionTypeEnum.JUDGE]: '判断', [QuestionTypeEnum.FILL_BLANK]: '填空', [QuestionTypeEnum.SHORT_ANSWER]: '简答' }
  return map[t] || '未知'
}
const questionTypeTagType = (t: number) => {
  const map: Record<number, string> = { [QuestionTypeEnum.SINGLE_CHOICE]: 'primary', [QuestionTypeEnum.MULTIPLE_CHOICE]: 'info', [QuestionTypeEnum.JUDGE]: 'warning', [QuestionTypeEnum.FILL_BLANK]: 'success', [QuestionTypeEnum.SHORT_ANSWER]: 'danger' }
  return map[t] || ''
}
const difficultyLabel = (d: number) => {
  const map: Record<number, string> = { [DifficultyLevelEnum.EASY]: '简单', [DifficultyLevelEnum.MEDIUM]: '中等', [DifficultyLevelEnum.HARD]: '困难' }
  return map[d] || '未知'
}
const difficultyTagType = (d: number) => {
  const map: Record<number, string> = { [DifficultyLevelEnum.EASY]: 'success', [DifficultyLevelEnum.MEDIUM]: 'warning', [DifficultyLevelEnum.HARD]: 'danger' }
  return map[d] || ''
}

async function getList() {
  loadMoreState.value = 'loading'
  try {
    const data = await getQuestionBankPage(queryParams.value)
    list.value = [...list.value, ...data.list]
    total.value = data.total
    loadMoreState.value = list.value.length >= total.value ? 'finished' : 'loading'
  } catch {
    queryParams.value.pageNo = queryParams.value.pageNo > 1 ? queryParams.value.pageNo - 1 : 1
    loadMoreState.value = 'error'
  }
}

function handleQuery(data?: Record<string, any>) {
  queryParams.value = { ...data, pageNo: 1, pageSize: queryParams.value.pageSize }
  list.value = []
  getList()
}
function handleReset() { handleQuery() }
function loadMore() {
  if (loadMoreState.value === 'finished') return
  queryParams.value.pageNo++
  getList()
}
function handleAdd() { uni.navigateTo({ url: '/pages-learn/question-bank/form/index' }) }
function handleDetail(item: QuestionBank) { uni.navigateTo({ url: `/pages-learn/question-bank/detail/index?id=${item.id}` }) }
onReachBottom(() => { loadMore() })
onMounted(() => { getList() })
</script>
