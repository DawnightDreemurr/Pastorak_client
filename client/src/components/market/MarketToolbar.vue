<template>
  <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
    <div>
      <div class="text-2xl font-black text-gray-900 dark:text-gray-100">玉米市场行情</div>
      <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        展示近 7 次收购价（默认单位：元/吨）。
      </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
      <Select
        v-model="provinceProxy"
        :options="provinceOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="选择地区"
        class="w-full sm:w-[220px]"
      />

      <SelectButton
        v-model="unitProxy"
        :options="unitOptions"
        optionLabel="label"
        optionValue="value"
        class="w-full sm:w-auto"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Select from 'primevue/select'
import SelectButton from 'primevue/selectbutton'

const props = defineProps({
  province: { type: String, required: true },
  unit: { type: String, required: true },
  provinceOptions: { type: Array, required: true },
  unitOptions: { type: Array, required: true },
})

const emit = defineEmits(['update:province', 'update:unit'])

const provinceProxy = computed({
  get: () => props.province,
  set: (v) => emit('update:province', v),
})

const unitProxy = computed({
  get: () => props.unit,
  set: (v) => emit('update:unit', v),
})
</script>
