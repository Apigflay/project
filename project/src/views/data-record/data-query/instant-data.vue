<template>
  <div class="instant-data">
    <div class="page-common-content">
      <div class="search-config-wrapper">
        <div class="config-row">
          <div>
            <a-select
              v-model="datatype"
              style="width:110px;margin-right: 16px;"
              @change="datatypeChange"
            >
              <a-select-option value="LpData">Lp</a-select-option>
              <a-select-option value="Leq1s">Leq1s</a-select-option>
              <a-select-option value="OCT">OCT</a-select-option>
              <a-select-option value="OCT13">1/3OCT</a-select-option>
            </a-select>

            <a-select
              :value="displayType"
              style="margin-right: 16px;"
              @change="displayTypeChange"
            >
              <a-select-option value="list">列表显示</a-select-option>
              <a-select-option value="line">图形显示</a-select-option>
            </a-select>

            <a-button
              v-if="displayType === 'list'"
              style="margin-right: 16px;"
              @click="showModal"
            >列表配置</a-button>
          </div>

          <a-button
            icon="download"
            @click="clickDownload"
            :loading="loading_download"
          >导出</a-button>
        </div>
      </div>

      <!-- 列表 -->
      <div v-show="displayType === 'list'">
        <a-table
          v-show="datatype === 'LpData'"
          class="table"
          :dataSource="dataSource_list"
          :loading="loading"
          :pagination="false"
          :rowKey="(record, index) => index"
          :scroll="{ y: 560 }"
        >
          <a-table-column
            v-if="checkedList.includes('MeasureTime')"
            title="测量时间"
            data-index="MeasureTime"
            :sorter="(a, b) => Date.parse(a.MeasureTime) - Date.parse(b.MeasureTime)"
            width="200px"
          >
            <template slot-scope="MeasureTime,record">
              <!-- 异常 -->
              <a-popover v-if=" record.Normal == 1">
                <template slot="content">
                  <span class="lp-error">{{record.Sift}}</span>
                </template>
                <span class="lp-error">{{MeasureTime}}</span>
              </a-popover>
              <span v-else>{{MeasureTime}}</span>
            </template>
          </a-table-column>

          <a-table-column
            v-if="checkedList.includes('Lasp')"
            title="LASp"
            data-index="Lasp"
            width="100px"
          >
            <template slot-scope="Lasp,record">
              <!-- 异常 -->
              <a-popover v-if=" record.Normal == 1">
                <template slot="content">
                  <span class="lp-error">{{record.Sift}}</span>
                </template>
                <span class="lp-error">{{Lasp}}</span>
              </a-popover>
              <span v-else>{{Lasp}}</span>
            </template>
          </a-table-column>

          <a-table-column
            v-if="checkedList.includes('Lafp')"
            title="LAFp"
            data-index="Lafp"
            width="100px"
          >
            <template slot-scope="Lafp,record">
              <!-- 异常 -->
              <a-popover v-if="record.Normal == 1">
                <template slot="content">
                  <span class="lp-error">{{record.Sift}}</span>
                </template>
                <span class="lp-error">{{Lafp}}</span>
              </a-popover>
              <span v-else>{{Lafp}}</span>
            </template>
          </a-table-column>

          <a-table-column
            v-if="checkedList.includes('Laip')"
            title="LAIp"
            data-index="Laip"
            width="100px"
          >
            <template slot-scope="Laip,record">
              <!-- 异常 -->
              <a-popover v-if="record.Normal == 1">
                <template slot="content">
                  <span class="lp-error">{{record.Sift}}</span>
                </template>
                <span class="lp-error">{{Laip}}</span>
              </a-popover>
              <span v-else>{{Laip}}</span>
            </template>
          </a-table-column>

          <a-table-column
            v-if="checkedList.includes('Lcsp')"
            title="LCSp"
            data-index="Lcsp"
            width="100px"
          >
            <template slot-scope="Lcsp,record">
              <!-- 异常 -->
              <a-popover v-if="record.Normal == 1">
                <template slot="content">
                  <span class="lp-error">{{record.Sift}}</span>
                </template>
                <span class="lp-error">{{Lcsp}}</span>
              </a-popover>
              <span v-else>{{Lcsp}}</span>
            </template>
          </a-table-column>

          <a-table-column
            v-if="checkedList.includes('Lcfp')"
            title="LCFp"
            data-index="Lcfp"
            width="100px"
          >
            <template slot-scope="Lcfp,record">
              <!-- 异常 -->
              <a-popover v-if="record.Normal == 1">
                <template slot="content">
                  <span class="lp-error">{{record.Sift}}</span>
                </template>
                <span class="lp-error">{{Lcfp}}</span>
              </a-popover>
              <span v-else>{{Lcfp}}</span>
            </template>
          </a-table-column>

          <a-table-column
            v-if="checkedList.includes('Lcip')"
            title="LCIp"
            data-index="Lcip"
            width="100px"
          >
            <template slot-scope="Lcip,record">
              <!-- 异常 -->
              <a-popover v-if="record.Normal == 1">
                <template slot="content">
                  <span class="lp-error">{{record.Sift}}</span>
                </template>
                <span class="lp-error">{{Lcip}}</span>
              </a-popover>
              <span v-else>{{Lcip}}</span>
            </template>
          </a-table-column>

          <a-table-column
            v-if="checkedList.includes('Lzsp')"
            title="LZSp"
            data-index="Lzsp"
            width="100px"
          >
            <template slot-scope="Lzsp,record">
              <!-- 异常 -->
              <a-popover v-if="record.Normal == 1">
                <template slot="content">
                  <span class="lp-error">{{record.Sift}}</span>
                </template>
                <span class="lp-error">{{Lzsp}}</span>
              </a-popover>
              <span v-else>{{Lzsp}}</span>
            </template>
          </a-table-column>

          <a-table-column
            v-if="checkedList.includes('Lzfp')"
            title="LZFp"
            data-index="Lzfp"
            width="100px"
          >
            <template slot-scope="Lzfp,record">
              <!-- 异常 -->
              <a-popover v-if="record.Normal == 1">
                <template slot="content">
                  <span class="lp-error">{{record.Sift}}</span>
                </template>
                <span class="lp-error">{{Lzfp}}</span>
              </a-popover>
              <span v-else>{{Lzfp}}</span>
            </template>
          </a-table-column>

          <a-table-column
            v-if="checkedList.includes('Lzip')"
            title="LZIp"
            data-index="Lzip"
            width="100px"
          >
            <template slot-scope="Lzip,record">
              <!-- 异常 -->
              <a-popover v-if=" record.Normal == 1">
                <template slot="content">
                  <span class="lp-error">{{record.Sift}}</span>
                </template>
                <span class="lp-error">{{Lzip}}</span>
              </a-popover>
              <span v-else>{{Lzip}}</span>
            </template>
          </a-table-column>
        </a-table>

        <a-table
          v-show="datatype === 'Leq1s'"
          class="table"
          :dataSource="dataSource_list"
          :loading="loading"
          :pagination="false"
          :rowKey="(record, index) => index"
          :scroll="{ y: 560 }"
        >
          <a-table-column
            v-if="checkedList.includes('MeasureTime')"
            title="测量时间"
            data-index="MeasureTime"
            :sorter="(a, b) => Date.parse(a.MeasureTime) - Date.parse(b.MeasureTime)"
            width="200px"
          >
            <template slot-scope="MeasureTime">
              <span>{{MeasureTime}}</span>
            </template>
          </a-table-column>

          <a-table-column
            v-if="checkedList.includes('LeqA')"
            title="LeqA"
            data-index="LeqA"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('LeqC')"
            title="LeqC"
            data-index="LeqC"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('LeqZ')"
            title="LeqZ"
            data-index="LeqZ"
            width="100px"
          />
        </a-table>

        <a-table
          v-show="datatype === 'OCT'"
          class="table"
          :dataSource="dataSource_list"
          :loading="loading"
          :pagination="false"
          :rowKey="(record, index) => index"
          :scroll="{ x:1300,y: 560 }"
        >
          <a-table-column
            v-if="checkedList.includes('MeasureTime')"
            title="测量时间"
            data-index="MeasureTime"
            :sorter="(a, b) => Date.parse(a.MeasureTime) - Date.parse(b.MeasureTime)"
            width="200px"
          >
            <template slot-scope="MeasureTime">
              <span>{{MeasureTime}}</span>
            </template>
          </a-table-column>

          <a-table-column
            v-if="checkedList.includes('16')"
            title="16"
            data-index="16"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('31/5')"
            title="31.5"
            data-index="31/5"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('63')"
            title="63"
            data-index="63"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('125')"
            title="125"
            data-index="125"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('250')"
            title="250"
            data-index="250"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('500')"
            title="500"
            data-index="500"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('1000')"
            title="1000"
            data-index="1000"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('2000')"
            title="2000"
            data-index="2000"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('4000')"
            title="4000"
            data-index="4000"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('8000')"
            title="8000"
            data-index="8000"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('16000')"
            title="16000"
            data-index="16000"
            width="100px"
          />
        </a-table>

        <a-table
          v-show="datatype === 'OCT13'"
          class="table"
          :dataSource="dataSource_list"
          :loading="loading"
          :pagination="false"
          :rowKey="(record, index) => index"
          :scroll="{ x:2500,y: 560 }"
        >
          <a-table-column
            v-if="checkedList.includes('MeasureTime')"
            title="测量时间"
            data-index="MeasureTime"
            fixed="left"
            :sorter="(a, b) => Date.parse(a.MeasureTime) - Date.parse(b.MeasureTime)"
            width="200px"
          >
            <template slot-scope="MeasureTime">
              <span>{{MeasureTime}}</span>
            </template>
          </a-table-column>

          <a-table-column
            v-if="checkedList.includes('10')"
            title="10"
            data-index="10"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('12/5')"
            title="12.5"
            data-index="12/5"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('16')"
            title="16"
            data-index="16"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('20')"
            title="20"
            data-index="20"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('25')"
            title="25"
            data-index="25"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('31/5')"
            title="31.5"
            data-index="31/5"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('40')"
            title="40"
            data-index="40"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('50')"
            title="50"
            data-index="50"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('63')"
            title="63"
            data-index="63"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('80')"
            title="80"
            data-index="80"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('100')"
            title="100"
            data-index="100"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('125')"
            title="125"
            data-index="125"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('160')"
            title="160"
            data-index="160"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('200')"
            title="200"
            data-index="200"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('250')"
            title="250"
            data-index="250"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('315')"
            title="315"
            data-index="315"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('400')"
            title="400"
            data-index="400"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('500')"
            title="500"
            data-index="500"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('630')"
            title="630"
            data-index="630"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('800')"
            title="800"
            data-index="800"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('1000')"
            title="1000"
            data-index="1000"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('1250')"
            title="1250"
            data-index="1250"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('1600')"
            title="1600"
            data-index="1600"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('2000')"
            title="2000"
            data-index="2000"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('2500')"
            title="2500"
            data-index="2500"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('3150')"
            title="3150"
            data-index="3150"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('4000')"
            title="4000"
            data-index="4000"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('5000')"
            title="5000"
            data-index="5000"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('6300')"
            title="6300"
            data-index="6300"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('8000')"
            title="8000"
            data-index="8000"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('10000')"
            title="10000"
            data-index="10000"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('12500')"
            title="12500"
            data-index="12500"
            width="100px"
          />

          <a-table-column
            v-if="checkedList.includes('16000')"
            title="16000"
            data-index="16000"
            width="100px"
          />
          <a-table-column
            v-if="checkedList.includes('20000')"
            title="20000"
            data-index="20000"
            width="100px"
          />
        </a-table>

        <a-pagination
          showSizeChanger
          :showTotal="total => `共 ${total} 条`"
          :pageSizeOptions="page.pageSizeOptions"
          v-model="page.currentpage"
          :pageSize.sync="page.pagesize"
          :total="page.total"
          @change="pageChange"
          @showSizeChange="pageSizeChange"
        />
      </div>

      <!-- 图表 -->
      <div
        v-show="displayType === 'line'  && (datatype === 'LpData' || datatype === 'Leq1s')"
        id="line"
        style="width: 100%; height: 665px;"
      ></div>
      <div
        v-show="displayType === 'line' && (datatype === 'OCT' || datatype === 'OCT13')"
        id="3D"
        style="width: 100%; height: 1200px;"
      ></div>

      <a-modal
        title="列表配置"
        v-model="modalVisible"
        :footer="null"
        style="top: 48px;"
      >
        <a-checkbox :checked="checkAll" @change="selectAll">全选</a-checkbox>
        <a-divider style="margin:12px 0px 20px 0px;"></a-divider>
        <a-checkbox-group
          v-model="checkedList"
          :options="columnsConfigOptions"
          @change="onChange"
        />
      </a-modal>
    </div>
  </div>
</template>


<script>
import //  getHisData,
// GetHisDataForPic,
// GetHisOCTDataForPic,
// GetHisDataForExcel
'@/api/data-record'
import { getHisData, GetHisDataForPic, GetHisOCTDataForPic, GetHisDataForExcel } from '@/api/api'
import moment from 'moment'

const columns_Lp = [
  {
    title: '测量时间',
    dataIndex: 'MeasureTime',
    sorter: (a, b) => Date.parse(a.MeasureTime) - Date.parse(b.MeasureTime)
  },
  {
    title: 'LASp',
    dataIndex: 'Lasp',
    sorter: (a, b) => a.Lasp - b.Lasp,
    scopedSlots: { customRender: 'Lasp' }
  },
  {
    title: 'LAFp',
    dataIndex: 'Lafp',
    sorter: (a, b) => a.Lafp - b.Lafp,
    scopedSlots: { customRender: 'Lafp' }
  },
  {
    title: 'LAIp',
    dataIndex: 'Laip',
    sorter: (a, b) => a.Laip - b.Laip,
    scopedSlots: { customRender: 'Laip' }
  },
  {
    title: 'LCSp',
    dataIndex: 'Lcsp',
    sorter: (a, b) => a.Lcsp - b.Lcsp,
    scopedSlots: { customRender: 'Lcsp' }
  },
  {
    title: 'LCFp',
    dataIndex: 'Lcfp',
    sorter: (a, b) => a.Lcfp - b.Lcfp,
    scopedSlots: { customRender: 'Lcfp' }
  },
  {
    title: 'LCIp',
    dataIndex: 'Lcip',
    sorter: (a, b) => a.Lcip - b.Lcip,
    scopedSlots: { customRender: 'Lcip' }
  },
  {
    title: 'LZSp',
    dataIndex: 'Lzsp',
    sorter: (a, b) => a.Lzsp - b.Lzsp,
    scopedSlots: { customRender: 'Lzsp' }
  },
  {
    title: 'LZFp',
    dataIndex: 'Lzfp',
    sorter: (a, b) => a.Lzfp - b.Lzfp,
    scopedSlots: { customRender: 'Lzfp' }
  },
  {
    title: 'LZIp',
    dataIndex: 'Lzip',
    sorter: (a, b) => a.Lzip - b.Lzip,
    scopedSlots: { customRender: 'Lzip' }
  }
]

const columns_Leq1S = [
  {
    title: '测量时间',
    dataIndex: 'MeasureTime',
    sorter: (a, b) => Date.parse(a.MeasureTime) - Date.parse(b.MeasureTime)
  },
  {
    title: 'LeqA',
    dataIndex: 'LeqA',
    sorter: (a, b) => a.LeqA - b.LeqA,
    scopedSlots: { customRender: 'LeqA' }
  },
  {
    title: 'LeqC',
    dataIndex: 'LeqC',
    sorter: (a, b) => a.LeqC - b.LeqC,
    scopedSlots: { customRender: 'LeqC' }
  },
  {
    title: 'LeqZ',
    dataIndex: 'LeqZ',
    sorter: (a, b) => a.LeqZ - b.LeqZ,
    scopedSlots: { customRender: 'LeqZ' }
  }
]

const columns_OCT = [
  {
    title: '测量时间',
    dataIndex: 'MeasureTime',
    sorter: (a, b) => Date.parse(a.MeasureTime) - Date.parse(b.MeasureTime)
  },
  {
    title: '16',
    dataIndex: '16',
    sorter: (a, b) => a['16'] - b['16'],
    scopedSlots: { customRender: '16' }
  },
  {
    title: '31.5',
    dataIndex: '31/5',
    sorter: (a, b) => a['31/5'] - b['31/5'],
    scopedSlots: { customRender: '31/5' }
  },
  {
    title: '63',
    dataIndex: '63',
    sorter: (a, b) => a['63'] - b['63'],
    scopedSlots: { customRender: '63' }
  },
  {
    title: '125',
    dataIndex: '125',
    sorter: (a, b) => a['125'] - b['125'],
    scopedSlots: { customRender: '125' }
  },
  {
    title: '250',
    dataIndex: '250',
    sorter: (a, b) => a['250'] - b['250'],
    scopedSlots: { customRender: '250' }
  },

  {
    title: '500',
    dataIndex: '500',
    sorter: (a, b) => a['500'] - b['500'],
    scopedSlots: { customRender: '500' }
  },
  {
    title: '1000',
    dataIndex: '1000',
    sorter: (a, b) => a['1000'] - b['1000'],
    scopedSlots: { customRender: '1000' }
  },
  {
    title: '2000',
    dataIndex: '2000',
    sorter: (a, b) => a['2000'] - b['2000'],
    scopedSlots: { customRender: '2000' }
  },

  {
    title: '4000',
    dataIndex: '4000',
    sorter: (a, b) => a['4000'] - b['4000'],
    scopedSlots: { customRender: '4000' }
  },

  {
    title: '8000',
    dataIndex: '8000',
    sorter: (a, b) => a['8000'] - b['8000'],
    scopedSlots: { customRender: '8000' }
  },

  {
    title: '16000',
    dataIndex: '16000',
    sorter: (a, b) => a['16000'] - b['16000'],
    scopedSlots: { customRender: '16000' }
  }
]

const columns_OCT13 = [
  {
    title: '测量时间',
    dataIndex: 'MeasureTime',
    fixed: 'left',
    sorter: (a, b) => Date.parse(a.MeasureTime) - Date.parse(b.MeasureTime)
  },
  {
    title: '10',
    dataIndex: '10',
    sorter: (a, b) => a['10'] - b['10'],
    scopedSlots: { customRender: '10' }
  },
  {
    title: '12.5',
    dataIndex: '12/5',
    sorter: (a, b) => a['12/5'] - b['12/5'],
    scopedSlots: { customRender: '12/5' }
  },
  {
    title: '16',
    dataIndex: '16',
    sorter: (a, b) => a['16'] - b['16'],
    scopedSlots: { customRender: '16' }
  },
  {
    title: '20',
    dataIndex: '20',
    sorter: (a, b) => a['20'] - b['20'],
    scopedSlots: { customRender: '20' }
  },
  {
    title: '25',
    dataIndex: '25',
    sorter: (a, b) => a['25'] - b['25'],
    scopedSlots: { customRender: '25' }
  },

  {
    title: '31.5',
    dataIndex: '31/5',
    sorter: (a, b) => a['31/5'] - b['31/5'],
    scopedSlots: { customRender: '31/5' }
  },
  {
    title: '40',
    dataIndex: '40',
    sorter: (a, b) => a['40'] - b['40'],
    scopedSlots: { customRender: '40' }
  },
  {
    title: '50',
    dataIndex: '50',
    sorter: (a, b) => a['50'] - b['50'],
    scopedSlots: { customRender: '50' }
  },

  {
    title: '63',
    dataIndex: '63',
    sorter: (a, b) => a['63'] - b['63'],
    scopedSlots: { customRender: '63' }
  },

  {
    title: '80',
    dataIndex: '80',
    sorter: (a, b) => a['80'] - b['80'],
    scopedSlots: { customRender: '80' }
  },

  {
    title: '100',
    dataIndex: '100',
    sorter: (a, b) => a['100'] - b['100'],
    scopedSlots: { customRender: '100' }
  },

  {
    title: '125',
    dataIndex: '125',
    sorter: (a, b) => a['125'] - b['125'],
    scopedSlots: { customRender: '125' }
  },

  {
    title: '160',
    dataIndex: '160',
    sorter: (a, b) => a['160'] - b['160'],
    scopedSlots: { customRender: '160' }
  },

  {
    title: '200',
    dataIndex: '200',
    sorter: (a, b) => a['200'] - b['200'],
    scopedSlots: { customRender: '200' }
  },

  {
    title: '250',
    dataIndex: '250',
    sorter: (a, b) => a['250'] - b['250'],
    scopedSlots: { customRender: '250' }
  },

  {
    title: '315',
    dataIndex: '315',
    sorter: (a, b) => a['315'] - b['315'],
    scopedSlots: { customRender: '315' }
  },

  {
    title: '400',
    dataIndex: '400',
    sorter: (a, b) => a['400'] - b['400'],
    scopedSlots: { customRender: '400' }
  },

  {
    title: '500',
    dataIndex: '500',
    sorter: (a, b) => a['500'] - b['500'],
    scopedSlots: { customRender: '500' }
  },

  {
    title: '630',
    dataIndex: '630',
    sorter: (a, b) => a['630'] - b['630'],
    scopedSlots: { customRender: '630' }
  },

  {
    title: '800',
    dataIndex: '800',
    sorter: (a, b) => a['800'] - b['800'],
    scopedSlots: { customRender: '800' }
  },

  {
    title: '1000',
    dataIndex: '1000',
    sorter: (a, b) => a['1000'] - b['1000'],
    scopedSlots: { customRender: '1000' }
  },

  {
    title: '1250',
    dataIndex: '1250',
    sorter: (a, b) => a['1250'] - b['1250'],
    scopedSlots: { customRender: '1250' }
  },

  {
    title: '1600',
    dataIndex: '1600',
    sorter: (a, b) => a['1600'] - b['1600'],
    scopedSlots: { customRender: '1600' }
  },

  {
    title: '2000',
    dataIndex: '2000',
    sorter: (a, b) => a['2000'] - b['2000'],
    scopedSlots: { customRender: '2000' }
  },

  {
    title: '2500',
    dataIndex: '2500',
    sorter: (a, b) => a['2500'] - b['2500'],
    scopedSlots: { customRender: '2500' }
  },

  {
    title: '3150',
    dataIndex: '3150',
    sorter: (a, b) => a['3150'] - b['3150'],
    scopedSlots: { customRender: '3150' }
  },

  {
    title: '4000',
    dataIndex: '4000',
    sorter: (a, b) => a['4000'] - b['4000'],
    scopedSlots: { customRender: '4000' }
  },

  {
    title: '5000',
    dataIndex: '5000',
    sorter: (a, b) => a['5000'] - b['5000'],
    scopedSlots: { customRender: '5000' }
  },

  {
    title: '6300',
    dataIndex: '6300',
    sorter: (a, b) => a['6300'] - b['6300'],
    scopedSlots: { customRender: '6300' }
  },

  {
    title: '8000',
    dataIndex: '8000',
    sorter: (a, b) => a['8000'] - b['8000'],
    scopedSlots: { customRender: '8000' }
  },

  {
    title: '10000',
    dataIndex: '10000',
    sorter: (a, b) => a['10000'] - b['10000'],
    scopedSlots: { customRender: '10000' }
  },

  {
    title: '12500',
    dataIndex: '12500',
    sorter: (a, b) => a['12500'] - b['12500'],
    scopedSlots: { customRender: '12500' }
  },

  {
    title: '16000',
    dataIndex: '16000',
    sorter: (a, b) => a['16000'] - b['16000'],
    scopedSlots: { customRender: '16000' }
  },

  {
    title: '20000',
    dataIndex: '20000',
    sorter: (a, b) => a['20000'] - b['20000'],
    scopedSlots: { customRender: '20000' }
  }
]

export default {
  props: ['pointCode', 'dateRange'],

  data() {
    return {
      loading: false,
      loading_download: false,
      columns: [],
      dataSource_list: [],
      dataSource_line: [],
      dataSource_3D: [],
      datatype: 'LpData',
      displayType: 'list',
      chart: null,
      page: {
        currentpage: 1,
        pagesize: 10,
        total: 0,
        pageSizeOptions: ['10', '100', '1000']
      },
      modalVisible: false,
      checkAll: false,
      legendDataSelected: {}
    }
  },

  computed: {
    checkedList: {
      get() {
        if (this.datatype === 'LpData') {
          return this.$store.getters.lpCheckedList
        } else if (this.datatype === 'Leq1s') {
          return this.$store.getters.leq1sCheckedList
        } else if (this.datatype === 'OCT') {
          return this.$store.getters.octCheckedList
        } else if (this.datatype === 'OCT13') {
          return this.$store.getters.oct13CheckedList
        }
      },
      set(val) {
        if (this.datatype === 'LpData') {
          this.$store.commit('SET_LPCHECKEDLIST', val)
        } else if (this.datatype === 'Leq1s') {
          this.$store.commit('SET_LEQ1SCHECKEDLIST', val)
        } else if (this.datatype === 'OCT') {
          this.$store.commit('SET_OCTCHECKEDLIST', val)
        } else if (this.datatype === 'OCT13') {
          this.$store.commit('SET_OCT13CHECKEDLIST', val)
        }
      }
    },

    columnsConfigOptions() {
      if (this.datatype === 'LpData') {
        return columns_Lp.map(item => {
          return {
            label: item.title,
            value: item.dataIndex
          }
        })
      } else if (this.datatype === 'Leq1s') {
        return columns_Leq1S.map(item => {
          return {
            label: item.title,
            value: item.dataIndex
          }
        })
      } else if (this.datatype === 'OCT') {
        return columns_OCT.map(item => {
          return {
            label: item.title,
            value: item.dataIndex
          }
        })
      } else if (this.datatype === 'OCT13') {
        return columns_OCT13.map(item => {
          return {
            label: item.title,
            value: item.dataIndex
          }
        })
      }
    }
  },

  created() {
    this.columns = columns_Lp
    if (this.pointCode) {
      this.fetchData()
    }
  },

  mounted() {
    this.drawLine()

    window.onresize = () => {
      this.chart.resize()
    }
  },

  methods: {
    moment,

    fetchData() {
      if (!this.pointCode) {
        this.$message.warning('请选择测点')
        return
      }
      if (this.displayType === 'list') {
        this.loading = true
        let params = {
          measurecode: this.pointCode.split('-')[0],
          noisemeasureid: this.pointCode.split('-')[1],
          datatype: this.datatype,
          stime: this.dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
          etime: this.dateRange[1].format('YYYY-MM-DD HH:mm:ss'),
          currentpage: this.page.currentpage,
          pagesize: this.page.pagesize
        }

        getHisData(params).then(res => {
          let result = JSON.parse(res.d)
          if (!result.Error) {
            this.dataSource_list = result.DataInfo
            this.page.total = result.count
          } else {
            this.dataSource_list = []
            this.page.total = 0
          }
          this.loading = false
        })
      } else if (this.displayType === 'line') {
        this.chart.showLoading({
          text: '',
          color: '#1BD39B',
          textColor: '#000',
          maskColor: 'rgba(255, 255, 255, 0.8)',
          zlevel: 0
        })

        let params = {
          measurecode: this.pointCode.split('-')[0],
          noisemeasureid: this.pointCode.split('-')[1],
          datatype: this.datatype,
          stime: this.dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
          etime: this.dateRange[1].format('YYYY-MM-DD HH:mm:ss')
        }

        if (this.datatype === 'LpData' || this.datatype === 'Leq1s') {
          let diffSecond = moment(params.etime).diff(moment(params.stime), 'second')
          params.interval = this.getInterVal(diffSecond)

          GetHisDataForPic(params).then(res => {
            let result = JSON.parse(res.d)
            if (!result.Error) {
              this.dataSource_line = result
            } else {
              this.dataSource_line = []
              // this.$message.error('获取数据出错')
            }
            this.drawLine()
          })
        }

        if (this.datatype === 'OCT' || this.datatype === 'OCT13') {
          params.total = 50
          GetHisOCTDataForPic(params).then(res => {
            let result = JSON.parse(res.d)
            if (!result.Error) {
              this.dataSource_3D = result
            } else {
              this.dataSource_3D = []
              // this.$message.error('获取数据出错')
            }
            this.draw3D()
          })
        }
      }
    },

    drawLine() {
      let dom = document.getElementById('line')
      // dom.style.width = document.querySelector('.page-common-content').offsetWidth - 48 + 'px'
      this.chart = this.$echarts.init(dom)

      let legendData = this.columns.map((item, index) => {
        if (index > 0) {
          return item.title
        }
      })
      legendData = legendData.slice(1) //去掉第一个item因为是undefined，引入echarts-gl会报错

      let series = this.columns.map((item, index) => {
        if (index > 0) {
          return {
            name: item.title,
            showSymbol: false,
            connectNulls: false,
            type: 'line',
            lineStyle: {
              normal: {
                width: 1
              }
            },
            data: this.dataSource_line.map(item2 => {
              return item2[item.dataIndex]
            })
          }
        }
      })
      series = series.slice(1)

      let options = {
        animation: false,

        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            var relVal = params[0].name
            for (var i = 0, l = params.length; i < l; i++) {
              if (params[i].value === undefined) {
                continue
              }
              relVal += `<br/><i style="display:inline-block;width:10px;height:10px;background:${params[i].color};border-radius:50%;margin-right:4px;"></i>${params[i].seriesName}: ${params[i].value}dB`
            }
            return relVal
          }
        },

        color: [
          '#FF0000',
          '#00BFFF',
          '#FF00FF',
          '#1ce322',
          '#bf686d',
          '#EE7942',
          '#99FF00',
          '#4400FF',
          '#0856FF',
          '#2ae0c8',
          '#585858',
          '#800080'
        ],

        legend: {
          data: legendData,
          selected: this.legendDataSelected
        },

        grid: {
          left: '50px',
          right: '80px',
          bottom: '20px',
          containLabel: true
        },

        xAxis: {
          axisLabel: {
            lineHeight: 24,
            showMaxLabel: true,
            showMinLabel: true
          },
          type: 'category',
          boundaryGap: false,
          data: this.dataSource_line.map(item => {
            return item.MeasureTime
          })
        },

        yAxis: [
          {
            min: 0,
            max: 120
          }
        ],

        series: series
      }

      this.chart.clear()
      this.chart.setOption(options, true)
      this.chart.resize()
      this.chart.hideLoading()

      // let that = this
      // this.chart.on('legendselectchanged', function(params) {
      //   that.checkedList = ['MeasureTime']
      //   Object.keys(params.selected).forEach(key => {
      //     if (params.selected[key] === true) {
      //       that.checkedList.push(key.toUpperCase()[0] + key.toLowerCase().slice(1))
      //     }
      //   })
      // })
    },

    draw3D() {
      let dom = document.getElementById('3D')
      this.chart = this.$echarts.init(dom)
      let options = {
        tooltip: {
          formatter: function(params) {
            return `${params.marker}<br/>
                    X: ${params.data[0]}<br/>
                    Y: ${params.data[1]}Hz<br/>
                    Z: ${params.data[2]}dB`
          }
        },
        grid3D: {
          top: 0,
          boxHeight: 100,
          boxDepth: 100,
          boxWidth: 100
          // light: {
          //   main: {
          //     shadow: true,
          //     quality: 'ultra',
          //     intensity: 1.5
          //   }
          // }
        },
        xAxis3D: {
          type: 'category'
        },
        yAxis3D: {
          type: 'category',
          axisLabel: {
            //  interval:0
          },
          data: this.columns.map(item => item.title).slice(1)
        },
        zAxis3D: {},

        // color: [
        //   '#313695',
        //   '#4575b4',
        //   '#74add1',
        //   '#abd9e9',
        //   '#e0f3f8',
        //   '#ffffbf',
        //   '#fee090',
        //   '#fdae61',
        //   '#f46d43',
        //   '#d73027',
        //   '#a50026'
        // ],

        visualMap: {
          show: false,
          pieces: [
            {
              gt: 0,
              lte: 10,
              color: '#313695'
            },
            {
              gt: 10,
              lte: 20,
              color: '#4575b4'
            },
            {
              gt: 20,
              lte: 30,
              color: '#74add1'
            },
            {
              gt: 30,
              lte: 40,
              color: '#abd9e9'
            },
            {
              gt: 40,
              lte: 50,
              color: '#e0f3f8'
            },
            {
              gt: 50,
              lte: 60,
              color: '#ffffbf'
            },
            {
              gt: 60,
              lte: 70,
              color: '#fee090'
            },
            {
              gt: 70,
              lte: 80,
              color: '#fdae61'
            },
            {
              gt: 80,
              lte: 90,
              color: '#f46d43'
            }
          ]
        },

        series: [
          {
            name: '',
            type: 'bar3D',
            barSize: 2,

            // symbol :'circle',
            // symbolSize :4,

            data: this.dataSource_3D
          }
        ]
      }

      this.chart.clear()
      this.chart.setOption(options, true)
      this.chart.resize()
      this.chart.hideLoading()
    },

    pageSizeChange(current, size) {
      this.page.pagesize = size
      this.page.currentpage = 1
      this.fetchData()
    },

    pageChange(page, pageSize) {
      this.page.currentpage = page
      this.fetchData()
    },

    datatypeChange(value) {
      switch (value) {
        case 'LpData':
          this.columns = columns_Lp
          break
        case 'Leq1s':
          this.columns = columns_Leq1S
          break
        case 'OCT':
          this.columns = columns_OCT
          break
        case 'OCT13':
          this.columns = columns_OCT13
          break
      }
      this.page.currentpage = 1
      this.fetchData()
    },

    displayTypeChange(value) {
      this.displayType = value
      this.page.currentpage = 1
      this.fetchData()
    },

    getInterVal(diffSecond) {
      let param7 = 1
      if (diffSecond < 3600) {
        param7 = 1
      } else if (diffSecond < 86400) {
        param7 = 60 * 1
      } else if (diffSecond < 86400 * 2) {
        param7 = 60 * 2
      } else {
        param7 = 60 * 3
      }
      return param7
    },

    showModal() {
      this.modalVisible = true
      this.checkAll = this.checkedList.length === this.columnsConfigOptions.length
    },

    selectAll(e) {
      this.checkAll = e.target.checked

      if (this.checkAll) {
        this.checkedList = this.columnsConfigOptions.map(item => item.value)

        // this.columnsConfigOptions.forEach(item => {
        //   this.legendDataSelected[item.label] = true
        // })
        // if (this.datatype === 'LpData' || this.datatype === 'Leq1s') {
        //   this.drawLine()
        // }
      } else {
        this.checkedList = []

        // this.columnsConfigOptions.forEach(item => {
        //   this.legendDataSelected[item.label] = false
        // })
        // if (this.datatype === 'LpData' || this.datatype === 'Leq1s') {
        //   this.drawLine()
        // }
      }
    },

    onChange() {
      this.checkAll = this.checkedList.length === this.columnsConfigOptions.length

      // this.columnsConfigOptions.forEach(item => {
      //   if (this.checkedList.includes(item.value)) {
      //     this.legendDataSelected[item.label] = true
      //   } else {
      //     this.legendDataSelected[item.label] = false
      //   }
      // })
      // if (this.datatype === 'LpData' || this.datatype === 'Leq1s') {
      //   this.drawLine()
      // }
    },

    clickDownload() {
      if (!this.pointCode) {
        this.$message.warning('请选择测点')
        return
      }
      this.loading_download = true
      let params = {
        measurecode: this.pointCode.split('-')[0],
        noisemeasureid: this.pointCode.split('-')[1],
        datatype: this.datatype,
        stime: this.dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
        etime: this.dateRange[1].format('YYYY-MM-DD HH:mm:ss'),
        eventtype: ''
      }

      GetHisDataForExcel(params).then(res => {
        let result = JSON.parse(res.d)
        if (!result.Error) {
          window.open(`/static-file/docs/res/${result.Msg}`, '_self')
        }
        this.loading_download = false
      })
    }
  }
}
</script>


<style lang="less" scoped>
.lp-error {
  color: red;
}
</style>