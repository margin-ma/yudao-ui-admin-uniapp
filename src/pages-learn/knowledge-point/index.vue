<template>
  <view class="yd-page-container">
    <wd-navbar
      title="知识点管理"
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
          <view class="text-32rpx font-semibold text-[#333]">{{ item.name }}</view>
          <view class="mt-8rpx text-24rpx text-[#999]">{{ item.subject }} | {{ item.grade }}</view>
          <view v-if="item.chapter" class="mt-4rpx text-24rpx text-[#999]">{{ item.chapter }} / {{ item.section }}</view>
          <view class="mt-12rpx flex items-center gap-16rpx text-22rpx">
            <text class="text-[#1890ff]">权重: {{ item.weight ?? '-' }}</text>
            <text class="text-[#faad14]">考频: {{ item.localFrequency ?? 0 }}次</text>
          </view>
        </view>
      </view>
      <view v-if="loadMoreState !== 'loading' && list.length === 0" class="py-100rpx text-center">
        <wd-empty icon="content" tip="暂无知识点数据" />
      </view>
      <wd-loadmore
        v-if="list.length > 0"
        :state="loadMoreState"
        @reload="loadMore"
      />
    </view>
    <wd-fab
      v-if="hasAccessByCodes(['learn:knowledge:create'])"
      position="right-bottom"
      type="primary"
      :expandable="false"
      @click="handleAdd"
    />
  </view>
</template>

<script lang="ts" setup>
import type { KnowledgePoint } from '@/api/learn'
import type { LoadMoreState } from '@/http/types'
import { onReachBottom } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { getKnowledgePointPage } from '@/api/learn/knowledge-point'
import { useAccess } from '@/hooks/useAccess'
import { navigateBackPlus } from '@/utils'
import { DICT_TYPE } from '@/utils/constants'
import SearchForm from './components/search-form.vue'

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const { hasAccessByCodes } = useAccess()
const total = ref(0)
const list = ref<KnowledgePoint[]>([])
const loadMoreState = ref<LoadMoreState>('loading')
const queryParams = ref({ pageNo: 1, pageSize: 10 })

function handleBack() { navigateBackPlus() }

async function getList() {
  loadMoreState.value = 'loading'
  try {
    const data = await getKnowledgePointPage(queryParams.value)
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

function handleAdd() {
  uni.navigateTo({ url: '/pages-learn/knowledge-point/form/index' })
}

function handleDetail(item: KnowledgePoint) {
  uni.navigateTo({ url: `/pages-learn/knowledge-point/detail/index?id=${item.id}` })
}

onReachBottom(() => { loadMore() })
onMounted(() => { getList() })
</script>
