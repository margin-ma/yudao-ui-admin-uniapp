<template>
  <view class="yd-page-container">
    <wd-navbar
      title="作文批改记录"
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
            <view class="text-28rpx font-semibold text-[#333]">学生ID: {{ item.studentId }}</view>
            <wd-tag v-if="item.totalScore != null" type="primary" size="small">
              {{ item.totalScore }}分
            </wd-tag>
          </view>
          <view class="mt-8rpx line-clamp-2 text-26rpx text-[#666]">{{ item.essayContent?.slice(0, 120) }}</view>
          <view class="mt-8rpx text-22rpx text-[#999]">{{ formatDateTime(item.createTime) }}</view>
        </view>
      </view>
      <view v-if="loadMoreState !== 'loading' && list.length === 0" class="py-100rpx text-center">
        <wd-empty icon="content" tip="暂无作文记录" />
      </view>
      <wd-loadmore
        v-if="list.length > 0"
        :state="loadMoreState"
        @reload="loadMore"
      />
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { EssayRecord } from '@/api/learn'
import type { LoadMoreState } from '@/http/types'
import { onReachBottom } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { getEssayRecordPage } from '@/api/learn/essay-record'
import { useAccess } from '@/hooks/useAccess'
import { navigateBackPlus } from '@/utils'
import { formatDateTime } from '@/utils/date'
import SearchForm from './components/search-form.vue'

definePage({
  style: { navigationBarTitleText: '', navigationStyle: 'custom' },
})

const { hasAccessByCodes } = useAccess()
const total = ref(0)
const list = ref<EssayRecord[]>([])
const loadMoreState = ref<LoadMoreState>('loading')
const queryParams = ref({ pageNo: 1, pageSize: 10 })

function handleBack() { navigateBackPlus() }

async function getList() {
  loadMoreState.value = 'loading'
  try {
    const data = await getEssayRecordPage(queryParams.value)
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
function handleDetail(item: EssayRecord) { uni.navigateTo({ url: `/pages-learn/essay-record/detail/index?id=${item.id}` }) }
onReachBottom(() => { loadMore() })
onMounted(() => { getList() })
</script>
