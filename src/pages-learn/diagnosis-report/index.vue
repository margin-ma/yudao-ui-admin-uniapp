<template>
  <view class="yd-page-container">
    <wd-navbar
      title="学情报告"
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
        <view class="relative p-24rpx">
          <view class="absolute right-24rpx top-24rpx">
            <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="item.status" />
          </view>
          <view class="flex items-center gap-8rpx">
            <wd-tag :type="item.reportType === 'weekly' ? 'primary' : 'warning'" size="small">
              {{ item.reportType === 'weekly' ? '周报' : '月报' }}
            </wd-tag>
            <text class="text-28rpx font-semibold text-[#333]">学生ID: {{ item.studentId }}</text>
          </view>
          <view class="mt-8rpx text-24rpx text-[#999]">报告日期: {{ item.reportDate }}</view>
          <view v-if="item.pushTime" class="mt-4rpx text-22rpx text-[#999]">推送时间: {{ formatDateTime(item.pushTime) }}</view>
          <view class="mt-12rpx line-clamp-2 text-24rpx text-[#666]">{{ item.reportContent?.slice(0, 100) }}</view>
        </view>
      </view>
      <view v-if="loadMoreState !== 'loading' && list.length === 0" class="py-100rpx text-center">
        <wd-empty icon="content" tip="暂无学情报告" />
      </view>
      <wd-loadmore
        v-if="list.length > 0"
        :state="loadMoreState"
        @reload="loadMore"
      />
    </view>
    <wd-fab
      v-if="hasAccessByCodes(['learn:report:create'])"
      position="right-bottom"
      type="primary"
      :expandable="false"
      @click="handleAdd"
    />
  </view>
</template>

<script lang="ts" setup>
import type { DiagnosisReport } from '@/api/learn'
import type { LoadMoreState } from '@/http/types'
import { onReachBottom } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { getDiagnosisReportPage } from '@/api/learn/diagnosis-report'
import { useAccess } from '@/hooks/useAccess'
import { navigateBackPlus } from '@/utils'
import { DICT_TYPE } from '@/utils/constants'
import { formatDateTime } from '@/utils/date'
import SearchForm from './components/search-form.vue'

definePage({
  style: { navigationBarTitleText: '', navigationStyle: 'custom' },
})

const { hasAccessByCodes } = useAccess()
const total = ref(0)
const list = ref<DiagnosisReport[]>([])
const loadMoreState = ref<LoadMoreState>('loading')
const queryParams = ref({ pageNo: 1, pageSize: 10 })

function handleBack() { navigateBackPlus() }

async function getList() {
  loadMoreState.value = 'loading'
  try {
    const data = await getDiagnosisReportPage(queryParams.value)
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
function handleAdd() { uni.navigateTo({ url: '/pages-learn/diagnosis-report/form/index' }) }
function handleDetail(item: DiagnosisReport) { uni.navigateTo({ url: `/pages-learn/diagnosis-report/detail/index?id=${item.id}` }) }
onReachBottom(() => { loadMore() })
onMounted(() => { getList() })
</script>
