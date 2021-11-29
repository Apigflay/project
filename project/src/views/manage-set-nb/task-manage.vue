<template>
  <div class="task-manage">
    <div class="page-common-header">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>管理设置</a-breadcrumb-item>
        <a-breadcrumb-item>任务管理</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="title">
        <span>任务管理</span>
        <a-button type="primary" style="margin-left: 24px" @click="clickAdd">创建任务</a-button>
      </div>
      <!-- 表头 -->
      <a-tabs v-model="type" :tabBarGutter="8" :animated="false">
        <a-tab-pane :key="0">
          <span slot="tab">待提交<a-badge :count="countArr[0]" /> </span>
        </a-tab-pane>

        <a-tab-pane :key="1">
          <span slot="tab">待领取<a-badge :count="countArr[1]" /> </span>
        </a-tab-pane>

        <a-tab-pane :key="2">
          <span slot="tab">待审批<a-badge :count="countArr[2]" /> </span>
        </a-tab-pane>

        <a-tab-pane :key="3">
          <span slot="tab">待发布<a-badge :count="countArr[3]" /> </span>
        </a-tab-pane>

        <a-tab-pane :key="4">
          <span slot="tab">进行中<a-badge :count="countArr[4]" /> </span>
        </a-tab-pane>

        <a-tab-pane :key="5">
          <span slot="tab">已关闭<a-badge :count="countArr[5]" /> </span>
        </a-tab-pane>

        <a-tab-pane :key="6">
          <span slot="tab">已完成<a-badge :count="countArr[6]" /> </span>
        </a-tab-pane>
      </a-tabs>
    </div>

    <div class="page-common-content">
      <h1 style="margin-bottom: 16px" v-if="type!=1">{{ type === 0 ? '子任务' : '任务组' }}</h1>

      <!-- 待提交表格 0 -->
      <a-table
        v-if="type === 0"
        :columns="columnsTaskToSubmit"
        :data-source="dataSource[0]"
        :pagination="page"
        :rowKey="(record) => record.id+type"
        :loading="tableLoading"
        @change="handleTableChange">
        <template slot="startTime" slot-scope="startTime">{{ startTime | unix2String }}</template>
        <template slot="stopTime" slot-scope="stopTime">{{ stopTime | unix2String }}</template>
        <template slot="taskTypeCustom" slot-scope="_, record">{{
          record.routineType == null ? '非常规任务' : '常规任务'
        }}</template>
        <template slot="taskTypeCustom1" slot-scope="_, record">
          {{record.routineType == 0 ? '功能区噪声测量' : ''}}
          {{record.routineType == 1 ? '区域噪声测量' : ''}}
          {{record.routineType == 2 ? '交通噪声测量' : ''}}
          {{record.routineType == null ? record.nonRoutineName : ''}}
        </template>
        <!-- <template slot="taskType" slot-scope="taskType">{{ taskType | taskTypeFormat }}</template> -->
        <!-- <template slot="taskStatus" slot-scope="taskStatus">{{ taskStatus | taskStatusFormat }}</template> -->
        <template slot="address" slot-scope="address">
          <a :href="`https://www.amap.com/search?query=${address}`" target="_blank">{{ address }}</a>
        </template>
        <template slot="action" slot-scope="text, record">
          <a-space>
            <!-- <a-button size="small" @click="handleMenuClick(record.id, '执行任务', record)">执行任务</a-button> -->
            <a-popconfirm
              v-if="record.routineType == null"
              :title="`你确定拒绝'${record.taskTitle}'任务吗?`"
              ok-text="拒绝"
              okType="danger"
              cancel-text="取消"
              @confirm="handleMenuClick(record.id, '拒绝')">
              <a-button size="small">拒绝任务</a-button>
            </a-popconfirm>
            <a-button v-else  size="small" disabled>拒绝任务</a-button>

            <!-- <a-popconfirm
              v-if="record.routineType == null"
              :title="`你确定拒绝'${record.taskTitle}'任务吗?`"
              ok-text="拒绝"
              okType="danger"
              cancel-text="取消"
              @confirm="handleMenuClick(record.id, '拒绝')"
            >
              <a-button size="small">拒绝任务</a-button>
            </a-popconfirm> -->

            <a-dropdown>
              <a-button size="small">· · ·</a-button>
              <a-menu slot="overlay">

                <a-menu-item @click="handleMenuClick(record.id, '详情')">
                  <a>任务详情</a>
                </a-menu-item>

                <a-menu-item @click="handleMenuClick(record.id, '审核记录')">
                  <a>审核记录</a>
                </a-menu-item>

                <a-menu-item @click="handleMenuClick(record.id, '操作记录')">
                  <a>操作记录</a>
                </a-menu-item>

                <a-menu-item>
                  <a-popconfirm
                    :title="`你确定撤销'${record.taskTitle}'任务吗?`"
                    ok-text="撤销任务"
                    okType="danger"
                    cancel-text="取消"
                    @confirm="handleMenuClick(record.id, '撤销')"
                  >
                    <a>撤销任务</a>
                  </a-popconfirm>
                </a-menu-item>

              </a-menu>
            </a-dropdown>
          </a-space>
        </template>
      </a-table>

      <!-- 待领取表格 1 -->
      <h1 style="margin-bottom: 16px" v-if="type==1">本部门任务</h1>
      <a-table
        v-if="type === 1"
        :columns="columnsSubTask11"
        :data-source="dataSource[7]"
        :pagination="page"
        :rowKey="(record) => record.id"
        :loading="tableLoading"
        @change="handleTableChange"
        @expand="handleExpand">>
        <template slot="startTime" slot-scope="startTime">{{ startTime | unix2String }}</template>
        <template slot="stopTime" slot-scope="stopTime">{{ stopTime | unix2String }}</template>
        <template slot="taskTypeCustom" slot-scope="_, record">{{
          record.routineType == null ? '非常规任务' : '常规任务'
        }}</template>
        <template slot="taskType" slot-scope="taskType">{{ taskType | taskTypeFormat }}</template>
        <template slot="taskStatus" slot-scope="taskStatus">{{ taskStatus | taskStatusFormat }}</template>
        <template slot="subTaskSummary" slot-scope="subTaskSummary">
          <a-popover title="子任务统计" v-if="subTaskSummary">
            <template slot="content">
              <span style="display: inline-block; width: 88px; color: #9b9b9b"
                >待审核:{{ subTaskSummary.auditing }}
              </span>
              <span style="color: #9b9b9b">待提交:{{ subTaskSummary.executing }}</span>
              <br />

              <span style="display: inline-block; width: 88px; color: #9b9b9b"
                >待指派:{{ subTaskSummary.waitDesignating }}
              </span>
              <span style="color: #9b9b9b">待接收:{{ subTaskSummary.waitReceiving }}</span>
              <br />

              <span style="display: inline-block; width: 88px; color: #9b9b9b"
                >已完成:{{ subTaskSummary.completed }}
              </span>
              <span style="color: #9b9b9b">已过期:{{ subTaskSummary.overdue }}</span>
              <br />

              <span style="display: inline-block; width: 88px; color: #9b9b9b"
                >已拒绝:{{ subTaskSummary.refused }}
              </span>
              <span style="color: #9b9b9b">已撤销:{{ subTaskSummary.revoked }}</span>
            </template>
            <span style="padding: 0px 19px; color: #1bd39b">{{ subTaskSummary.sum }}</span>
          </a-popover></template
        >

        <template slot="action" slot-scope="text, record">
          <a-space>
            <a-button size="small" v-if="record.routineType==null" @click="handleMenuClick(record.id, '领取任务', record)">领取任务</a-button>
            <a-button size="small" v-else disabled>领取任务</a-button>
            <a-popconfirm
              :title="`你确定指派'${record.taskTitle}'任务吗?`"
              ok-text="确定"
              okType="danger"
              cancel-text="取消"
              @confirm="handleMenuClick(record.id, '指派')">
              <a-button size="small">指派任务</a-button>
            </a-popconfirm>

            <a-dropdown>
              <a-button size="small">· · ·</a-button>
              <a-menu slot="overlay">

                <a-menu-item @click="handleMenuClick(record.id, '详情')">
                  <a>任务详情</a>
                </a-menu-item>

                <a-menu-item @click="handleMenuClick(record.id, '操作记录')">
                  <a>操作记录</a>
                </a-menu-item>

                <a-menu-item>
                  <a-popconfirm
                    :title="`你确定撤销'${record.taskTitle}'任务吗?`"
                    ok-text="撤销任务"
                    okType="danger"
                    cancel-text="取消"
                    @confirm="handleMenuClick(record.id, '撤销')"
                  >
                    <a>撤销任务</a>
                  </a-popconfirm>
                </a-menu-item>

              </a-menu>
            </a-dropdown>

          </a-space>
        </template>
      </a-table>
      <h1 style="margin-bottom: 16px" v-if="type==1">任务组</h1>
      <a-table
        v-if="type === 1"
        :columns="columnsTaskToGet"
        :data-source="dataSource[1]"
        :pagination="page"
        :rowKey="(record) => record.id+type"
        :loading="tableLoading"
        @change="handleTableChange"
        @expand="handleExpand">>
        <template slot="startTime" slot-scope="startTime">{{ startTime | unix2String }}</template>
        <template slot="stopTime" slot-scope="stopTime">{{ stopTime | unix2String }}</template>
        <template slot="taskTypeCustom" slot-scope="_, record">{{
          record.routineType == null ? '非常规任务' : '常规任务'
        }}</template>
        <template slot="taskTypeCustom1" slot-scope="_, record">
          {{record.routineType == 0 ? '功能区噪声测量' : ''}}
          {{record.routineType == 1 ? '区域噪声测量' : ''}}
          {{record.routineType == 2 ? '交通噪声测量' : ''}}
          {{record.routineType == null ? record.nonRoutineName : ''}}
        </template>
        <!-- <template slot="taskType" slot-scope="taskType">{{ taskType | taskTypeFormat }}</template> -->
        <!-- <template slot="taskStatus" slot-scope="taskStatus">{{ taskStatus | taskStatusFormat }}</template> -->
        <template slot="subTaskSummary" slot-scope="subTaskSummary">
          <a-popover title="子任务统计" v-if="subTaskSummary">
            <template slot="content">
              <span style="display: inline-block; width: 88px; color: #9b9b9b"
                >待审核:{{ subTaskSummary.auditing }}
              </span>
              <span style="color: #9b9b9b">待提交:{{ subTaskSummary.executing }}</span>
              <br />

              <span style="display: inline-block; width: 88px; color: #9b9b9b"
                >待指派:{{ subTaskSummary.waitDesignating }}
              </span>
              <span style="color: #9b9b9b">待接收:{{ subTaskSummary.waitReceiving }}</span>
              <br />

              <span style="display: inline-block; width: 88px; color: #9b9b9b"
                >已完成:{{ subTaskSummary.completed }}
              </span>
              <span style="color: #9b9b9b">已过期:{{ subTaskSummary.overdue }}</span>
              <br />

              <span style="display: inline-block; width: 88px; color: #9b9b9b"
                >已拒绝:{{ subTaskSummary.refused }}
              </span>
              <span style="color: #9b9b9b">已撤销:{{ subTaskSummary.revoked }}</span>
            </template>
            <span style="padding: 0px 19px; color: #1bd39b">{{ subTaskSummary.sum }}</span>
          </a-popover></template
        >

        <template slot="action" slot-scope="text, record">
          <a-space>
            <a-button size="small" @click="handleMenuClick(record.id, '接收')">全部确认</a-button>
            <a-popconfirm
              v-if="record.routineType == null"
              :title="`你确定拒绝'${record.taskTitle}'任务吗?`"
              ok-text="拒绝"
              okType="danger"
              cancel-text="取消"
              @confirm="handleMenuClick(record.id, '拒绝')">
              <a-button size="small">全部拒绝</a-button>
            </a-popconfirm>
            <a-button v-else size="small" disabled>全部拒绝</a-button>

            <!-- <a-button
              size="small"
              v-if="record.taskStatus === 'WAIT_DESIGNATING'"
              @click="handleMenuClick(record.id, '指派')"
              >指派任务</a-button
            >
            <a-button
              size="small"
              v-if="record.taskStatus === 'WAIT_RECEIVING'"
              @click="handleMenuClick(record.id, '接收')"
              >接收任务</a-button
            >
            <a-popconfirm
              v-if="record.routineType == null"
              :title="`你确定拒绝任务'${record.taskTitle}'任务吗?`"
              ok-text="拒绝任务"
              okType="danger"
              cancel-text="取消"
              @confirm="handleMenuClick(record.id, '拒绝')"
            >
              <a-button size="small">拒绝任务</a-button>
            </a-popconfirm> -->
            <a-dropdown>
              <a-button size="small">· · ·</a-button>
              <a-menu slot="overlay">

                <a-menu-item @click="handleMenuClick(record.id, '详情')">
                  <a>任务详情</a>
                </a-menu-item>

                <a-menu-item @click="handleMenuClick(record.id, '审核记录')">
                  <a>审核记录</a>
                </a-menu-item>

                <a-menu-item @click="handleMenuClick(record.id, '操作记录')">
                  <a>操作记录</a>
                </a-menu-item>

                <a-menu-item>
                  <a-popconfirm
                    :title="`你确定撤销'${record.taskTitle}'任务吗?`"
                    ok-text="撤销任务"
                    okType="danger"
                    cancel-text="取消"
                    @confirm="handleMenuClick(record.id, '撤销')"
                  >
                    <a>撤销任务</a>
                  </a-popconfirm>
                </a-menu-item>

              </a-menu>
            </a-dropdown>

          </a-space>
        </template>
        <!-- 子任务表格 -->
        <template slot="expandedRowRender" slot-scope="record">
          <div style="display: flex; justify-content: space-between">
            <h1>测点信息</h1>
          </div>
          <a-table
            :loading="subTableLoading"
            :columns="columnsSubTask1"
            :data-source="record.subTaskList"
            :rowKey="(record) => record.id"
            style="margin: 12px 0px"
            size="small">
            <template slot="taskStatus" slot-scope="taskStatus">{{ taskStatus | taskStatusFormat }}</template>

            <template slot="action" slot-scope="text, record">
              <a-space>
                <a-dropdown>
                  <a-button size="small">· · ·</a-button>
                  <a-menu slot="overlay">

                    <a-menu-item @click="handleMenuClick(record.id, '详情')">
                      <a>任务详情</a>
                    </a-menu-item>

                    <a-menu-item @click="handleMenuClick(record.id, '审核记录')">
                      <a>审核记录</a>
                    </a-menu-item>

                    <a-menu-item @click="handleMenuClick(record.id, '操作记录')">
                      <a>操作记录</a>
                    </a-menu-item>

                    <a-menu-item>
                      <a-popconfirm
                        :title="`你确定撤销'${record.taskTitle}'任务吗?`"
                        ok-text="撤销任务"
                        okType="danger"
                        cancel-text="取消"
                        @confirm="handleMenuClick(record.id, '撤销')"
                      >
                        <a>撤销任务</a>
                      </a-popconfirm>
                    </a-menu-item>

                  </a-menu>
                </a-dropdown>
              </a-space>
            </template>
          </a-table>
        </template>
      </a-table>

      <!-- 待发布表格 3 -->
      <a-table
        v-if="type === 3"
        :columns="columnsTaskToRelease"
        :data-source="dataSource[3]"
        :pagination="page"
        :rowKey="(record) => record.id+type+new Date().getTime()"
        :loading="tableLoading"
        @change="handleTableChange"
        @expand="handleExpand">
        <template slot="taskTypeCustom" slot-scope="_, record">{{
          record.routineType == null ? '非常规任务' : '常规任务'
        }}</template>
        <template slot="taskTypeCustom1" slot-scope="_, record">
          {{record.routineType == 0 ? '功能区噪声测量' : ''}}
          {{record.routineType == 1 ? '区域噪声测量' : ''}}
          {{record.routineType == 2 ? '交通噪声测量' : ''}}
          {{record.routineType == null ? record.nonRoutineName : ''}}
        </template>
        <template slot="startTime" slot-scope="startTime">{{ startTime | unix2String }}</template>
        <template slot="stopTime" slot-scope="stopTime">{{ stopTime | unix2String }}</template>
        <template slot="measurePoints" slot-scope="measurePoints">{{ measurePoints.length}}</template>
        <template slot="action" slot-scope="text, record">
          <a-space>
            <a-button size="small" @click="handleMenuClick(record.id, '发布', record)">发布任务</a-button>

            <a-dropdown>
              <a-button size="small">· · ·</a-button>
              <a-menu slot="overlay">
                <a-menu-item @click="handleMenuClick(record.id, '修改')">
                  <a>修改任务</a>
                </a-menu-item>

                <a-menu-item>
                  <a-popconfirm
                    :title="`你确定删除'${record.taskTitle}'任务吗?`"
                    ok-text="删除任务"
                    okType="danger"
                    cancel-text="取消"
                    @confirm="handleMenuClick(record.id, '删除')"
                  >
                    <a>删除任务</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-space>
        </template>
        <!-- 子任务表格 innerData record.subTaskList  -->
            <template slot="expandedRowRender" slot-scope="record">
            <div style="display: flex; justify-content: space-between">
            <h1>测点信息</h1>
            </div>
            <a-table
              :loading="subTableLoading"
              :columns="innerColumns"
              :data-source="record.subTaskList"
              :pagination="false"
              :rowKey="(record) => record.id"
              style="margin: 12px 0px"
              size="small"
            > 
              
              <template slot="action" slot-scope="text, record">
                  <a-popconfirm
                    :title="`你确定删除'${record.measureCode}'测点吗?`"
                    ok-text="删除"
                    okType="danger"
                    cancel-text="取消"
                    @confirm="handleMenuClick(record.id, '删除子任务')"
                  >
                    <a>删除</a>
                  </a-popconfirm>
              </template>
            </a-table>
            </template>
      </a-table>
      <!-- 进行中表格 4 -->
      <a-table
        v-if="type==4"
        :columns="columnsGroupTask4"
        :data-source="dataSource[type]"
        :pagination="page"
        :rowKey="(record) => record.id+type"
        :loading="tableLoading"
        @change="handleTableChange"
        @expand="handleExpand">
        <template slot="startTime" slot-scope="startTime">{{ startTime | unix2String }}</template>
        <template slot="stopTime" slot-scope="stopTime">{{ stopTime | unix2String }}</template>
        <template slot="taskTypeCustom" slot-scope="_, record">{{
          record.routineType == null ? '非常规任务' : '常规任务'
        }}</template>
        <template slot="taskTypeCustom1" slot-scope="_, record">
          {{record.routineType == 0 ? '功能区噪声测量' : ''}}
          {{record.routineType == 1 ? '区域噪声测量' : ''}}
          {{record.routineType == 2 ? '交通噪声测量' : ''}}
          {{record.routineType == null ? record.nonRoutineName : ''}}
        </template>
        <!-- <template slot="taskType" slot-scope="taskType">{{ taskType | taskTypeFormat }}</template> -->
        <!-- <template slot="taskStatus" slot-scope="taskStatus">{{ taskStatus | taskStatusFormat }}</template> -->
        <template slot="subTaskSummary" slot-scope="subTaskSummary">
          <a-popover title="子任务统计" v-if="subTaskSummary">
            <template slot="content">
              <span style="display: inline-block; width: 88px; color: #9b9b9b"
                >待审核:{{ subTaskSummary.auditing }}
              </span>
              <span style="color: #9b9b9b">待提交:{{ subTaskSummary.executing }}</span>
              <br />

              <span style="display: inline-block; width: 88px; color: #9b9b9b"
                >待指派:{{ subTaskSummary.waitDesignating }}
              </span>
              <span style="color: #9b9b9b">待接收:{{ subTaskSummary.waitReceiving }}</span>
              <br />

              <span style="display: inline-block; width: 88px; color: #9b9b9b"
                >已完成:{{ subTaskSummary.completed }}
              </span>
              <span style="color: #9b9b9b">已过期:{{ subTaskSummary.overdue }}</span>
              <br />

              <span style="display: inline-block; width: 88px; color: #9b9b9b"
                >已拒绝:{{ subTaskSummary.refused }}
              </span>
              <span style="color: #9b9b9b">已撤销:{{ subTaskSummary.revoked }}</span>
            </template>
            <span style="padding: 0px 19px; color: #1bd39b">{{ subTaskSummary.sum }}</span>
          </a-popover>
        </template>
        <!-- 按钮 -->
        <template slot="action" slot-scope="text, record">
          <a-space>
            <a-dropdown>
              <a-button size="small">· · ·</a-button>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a-popconfirm
                    :title="`你确定撤销'${record.taskTitle}'任务吗?`"
                    ok-text="撤销任务"
                    okType="danger"
                    cancel-text="取消"
                    @confirm="handleMenuClick(record.id, '撤销')"
                  >
                    <a>撤销任务组</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-space>
        </template>
        <!-- 子任务表格 -->
        <template slot="expandedRowRender" slot-scope="record">
          <div style="display: flex; justify-content: space-between">
            <h1>子任务</h1>
          </div>
          <a-table
            :loading="subTableLoading"
            :columns="columnsSubTask4"
            :data-source="record.subTaskList"
            :rowKey="(record) => record.id"
            style="margin: 12px 0px"
            :pagination="false"
            size="small">
            <template slot="taskStatus" slot-scope="taskStatus">{{ taskStatus | taskStatusFormat }}</template>

            <template slot="action" slot-scope="text, record">
              <a-space>
                <!-- <a-button size="small" @click="handleMenuClick(record.id, '详情')">查看详情</a-button> -->
                <a-dropdown>
                  <a-button size="small">· · ·</a-button>

                  <a-menu slot="overlay">
                    <a-menu-item @click="handleMenuClick(record.id, '测量数据',record)">
                      <a>测量数据</a>
                    </a-menu-item>

                    <a-menu-item @click="handleMenuClick(record.id, '详情')">
                      <a>任务详情</a>
                    </a-menu-item>
                    
                    <a-menu-item @click="handleMenuClick(record.id, '审核记录')">
                      <a>审核记录</a>
                    </a-menu-item>

                    <a-menu-item @click="handleMenuClick(record.id, '操作记录')">
                      <a>操作记录</a>
                    </a-menu-item>

                    <a-menu-item>
                      <a-popconfirm
                        :title="`你确定撤销'${record.taskTitle}'任务吗?`"
                        ok-text="撤销任务"
                        okType="danger"
                        cancel-text="取消"
                        @confirm="handleMenuClick(record.id, '撤销')">
                        <a>撤销任务</a>
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </a-space>
            </template>
          </a-table>
        </template>

        <!-- <template slot="action" slot-scope="text, record">
          <a-space>
            <a-button
              size="small"
              v-if="type === 5 && record.taskStatus === 'COMPLETED'"
              @click="handleMenuClick(record.id, '导出报表', record)"
              >导出报表</a-button
            >

            <a-button
              size="small"
              v-if="type === 2 && record.taskStatus === 'AUDITING'"
              @click="handleMenuClick(record.id, '审批', record)"
              >审批任务</a-button
            >
          </a-space>
        </template> -->
      </a-table>
      <!-- 已关闭表格 5 -->
      <a-table
        v-if="[5].includes(type)"
        :columns="columnsGroupTask5"
        :data-source="dataSource[type]"
        :pagination="page"
        :rowKey="(record) => record.id+type"
        :loading="tableLoading"
        @change="handleTableChange"
        @expand="handleExpand">
        <template slot="startTime" slot-scope="startTime">{{ startTime | unix2String }}</template>
        <template slot="stopTime" slot-scope="stopTime">{{ stopTime | unix2String }}</template>
        <template slot="taskTypeCustom" slot-scope="_, record">{{
          record.routineType == null ? '非常规任务' : '常规任务'
        }}</template>
        <template slot="taskTypeCustom1" slot-scope="_, record">
          {{record.routineType == 0 ? '功能区噪声测量' : ''}}
          {{record.routineType == 1 ? '区域噪声测量' : ''}}
          {{record.routineType == 2 ? '交通噪声测量' : ''}}
          {{record.routineType == null ? record.nonRoutineName : ''}}
        </template>
        <!-- <template slot="taskType" slot-scope="taskType">{{ taskType | taskTypeFormat }}</template> -->
        <!-- <template slot="taskStatus" slot-scope="taskStatus">{{ taskStatus | taskStatusFormat }}</template> -->
        <template slot="subTaskSummary" slot-scope="subTaskSummary">
          <a-popover title="子任务统计" v-if="subTaskSummary">
            <template slot="content">
              <span style="display: inline-block; width: 88px; color: #9b9b9b"
                >待审核:{{ subTaskSummary.auditing }}
              </span>
              <span style="color: #9b9b9b">待提交:{{ subTaskSummary.executing }}</span>
              <br />

              <span style="display: inline-block; width: 88px; color: #9b9b9b"
                >待指派:{{ subTaskSummary.waitDesignating }}
              </span>
              <span style="color: #9b9b9b">待接收:{{ subTaskSummary.waitReceiving }}</span>
              <br />

              <span style="display: inline-block; width: 88px; color: #9b9b9b"
                >已完成:{{ subTaskSummary.completed }}
              </span>
              <span style="color: #9b9b9b">已过期:{{ subTaskSummary.overdue }}</span>
              <br />

              <span style="display: inline-block; width: 88px; color: #9b9b9b"
                >已拒绝:{{ subTaskSummary.refused }}
              </span>
              <span style="color: #9b9b9b">已撤销:{{ subTaskSummary.revoked }}</span>
            </template>
            <span style="padding: 0px 19px; color: #1bd39b">{{ subTaskSummary.sum }}</span>
          </a-popover></template
        >
        <!-- 子任务表格 -->
        <template slot="expandedRowRender" slot-scope="record">
          <div style="display: flex; justify-content: space-between">
            <h1>子任务</h1>
          </div>
          <a-table
            :loading="subTableLoading"
            :columns="columnsSubTask5"
            :data-source="record.subTaskList"
            :rowKey="(record) => record.id"
            :pagination="false"
            style="margin: 12px 0px"
            size="small">
            <template slot="taskStatus" slot-scope="taskStatus">{{ taskStatus | taskStatusFormat }}</template>

            <template slot="action" slot-scope="text, record">
              <a-space>
                <!-- <a-button size="small" @click="handleMenuClick(record.id, '详情')">查看详情</a-button> -->
                <a-dropdown>
                  <a-button size="small">· · ·</a-button>
                  <a-menu slot="overlay">
                    <a-menu-item @click="handleMenuClick(record.id, '测量数据',record)">
                      <a>测量数据</a>
                    </a-menu-item>

                    <a-menu-item @click="handleMenuClick(record.id, '详情')">
                      <a>任务详情</a>
                    </a-menu-item>

                    <a-menu-item @click="handleMenuClick(record.id, '审核记录')">
                      <a>审核记录</a>
                    </a-menu-item>

                    <a-menu-item @click="handleMenuClick(record.id, '操作记录')">
                      <a>操作记录</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </a-space>
            </template>
          </a-table>
        </template>

        <!-- <template slot="action" slot-scope="text, record">
          <a-space>
            <a-button
              size="small"
              v-if="type === 5 && record.taskStatus === 'COMPLETED'"
              @click="handleMenuClick(record.id, '导出报表', record)"
              >导出报表</a-button
            >

            <a-button
              size="small"
              v-if="type === 2 && record.taskStatus === 'AUDITING'"
              @click="handleMenuClick(record.id, '审批', record)"
              >审批任务</a-button
            >
          </a-space>
        </template> -->
      </a-table> 
      <!-- 已完成表格 6 -->
      <a-table
        v-if="[6].includes(type)"
        :columns="columnsGroupTask6"
        :data-source="dataSource[type]"
        :pagination="page"
        :rowKey="(record) => record.id+type"
        :loading="tableLoading"
        @change="handleTableChange"
        @expand="handleExpand">
        <template slot="startTime" slot-scope="startTime">{{ startTime | unix2String }}</template>
        <template slot="stopTime" slot-scope="stopTime">{{ stopTime | unix2String }}</template>
        <template slot="taskTypeCustom" slot-scope="_, record">{{
          record.routineType == null ? '非常规任务' : '常规任务'
        }}</template>
        <template slot="taskTypeCustom1" slot-scope="_, record">
          {{record.routineType == 0 ? '功能区噪声测量' : ''}}
          {{record.routineType == 1 ? '区域噪声测量' : ''}}
          {{record.routineType == 2 ? '交通噪声测量' : ''}}
          {{record.routineType == null ? record.nonRoutineName : ''}}
        </template>
        <!-- <template slot="taskType" slot-scope="taskType">{{ taskType | taskTypeFormat }}</template> -->
        <!-- <template slot="taskStatus" slot-scope="taskStatus">{{ taskStatus | taskStatusFormat }}</template> -->
        <template slot="subTaskSummary" slot-scope="subTaskSummary">
          <a-popover title="子任务统计" v-if="subTaskSummary">
            <template slot="content">
              <span style="display: inline-block; width: 88px; color: #9b9b9b"
                >待审核:{{ subTaskSummary.auditing }}
              </span>
              <span style="color: #9b9b9b">待提交:{{ subTaskSummary.executing }}</span>
              <br />

              <span style="display: inline-block; width: 88px; color: #9b9b9b"
                >待指派:{{ subTaskSummary.waitDesignating }}
              </span>
              <span style="color: #9b9b9b">待接收:{{ subTaskSummary.waitReceiving }}</span>
              <br />

              <span style="display: inline-block; width: 88px; color: #9b9b9b"
                >已完成:{{ subTaskSummary.completed }}
              </span>
              <span style="color: #9b9b9b">已过期:{{ subTaskSummary.overdue }}</span>
              <br />

              <span style="display: inline-block; width: 88px; color: #9b9b9b"
                >已拒绝:{{ subTaskSummary.refused }}
              </span>
              <span style="color: #9b9b9b">已撤销:{{ subTaskSummary.revoked }}</span>
            </template>
            <span style="padding: 0px 19px; color: #1bd39b">{{ subTaskSummary.sum }}</span>
          </a-popover></template
        >
        <template slot="action" slot-scope="text, record">
          <a-space>
            <a-button
              size="small"
              v-if="type === 6 && record.taskStatus === 'COMPLETED'"
              @click="handleMenuClick(record.id, '导出报表', record)"
              >导出报表</a-button
            >

            <!-- <a-button
              size="small"
              v-if="type === 2 && record.taskStatus === 'AUDITING'"
              @click="handleMenuClick(record.id, '审批', record)"
              >审批任务</a-button
            > -->
          </a-space>
        </template>
        <!-- 子任务表格 -->
        <template slot="expandedRowRender" slot-scope="record">
          <div style="display: flex; justify-content: space-between">
            <h1>子任务</h1>
          </div>
          <a-table
            :loading="subTableLoading"
            :columns="columnsSubTask6"
            :data-source="record.subTaskList"
            :rowKey="(record) => record.id"
            :pagination="false"
            style="margin: 12px 0px"
            size="small">
            <template slot="taskStatus" slot-scope="taskStatus">{{ taskStatus | taskStatusFormat }}</template>

            <template slot="action" slot-scope="text, record">
              <a-space>
                <!-- <a-button size="small" @click="handleMenuClick(record.id, '详情')">查看详情</a-button> -->
                <a-dropdown>
                  <a-button size="small">· · ·</a-button>
                  <a-menu slot="overlay">
                    <a-menu-item @click="handleMenuClick(record.id, '测量数据',record)">
                      <a>测量数据</a>
                    </a-menu-item>

                    <a-menu-item @click="handleMenuClick(record.id, '详情')">
                      <a>任务详情</a>
                    </a-menu-item>

                    <a-menu-item @click="handleMenuClick(record.id, '审核记录')">
                      <a>审核记录</a>
                    </a-menu-item>

                    <a-menu-item @click="handleMenuClick(record.id, '操作记录')">
                      <a>操作记录</a>
                    </a-menu-item>
                    <a-menu-item v-if="type === 6 && record.taskStatus === 'COMPLETED'" @click="handleMenuClick(record.id, '导出报表',record)">
                      <a>导出报表</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </a-space>
            </template>
          </a-table>
        </template>

        
      </a-table> 
      <!-- 待审批  表格 -->
      <a-table
        v-if="[2].includes(type)"
        :columns="columnsGroupTask"
        :data-source="dataSource[type]"
        :pagination="page"
        :rowKey="(record) => record.id+type"
        :loading="tableLoading"
        @change="handleTableChange"
        @expand="handleExpand">
        <template slot="startTime" slot-scope="startTime">{{ startTime | unix2String }}</template>
        <template slot="stopTime" slot-scope="stopTime">{{ stopTime | unix2String }}</template>
        <template slot="taskTypeCustom" slot-scope="_, record">{{
          record.routineType == null ? '非常规任务' : '常规任务'
        }}</template>
        <template slot="taskTypeCustom1" slot-scope="_, record">
          {{record.routineType == 0 ? '功能区噪声测量' : ''}}
          {{record.routineType == 1 ? '区域噪声测量' : ''}}
          {{record.routineType == 2 ? '交通噪声测量' : ''}}
          {{record.routineType == null ? record.nonRoutineName : ''}}
        </template>
        <!-- <template slot="taskType" slot-scope="taskType">{{ taskType | taskTypeFormat }}</template> -->
        <!-- <template slot="taskStatus" slot-scope="taskStatus">{{ taskStatus | taskStatusFormat }}</template> -->
        <template slot="subTaskSummary" slot-scope="subTaskSummary">
          <a-popover title="子任务统计" v-if="subTaskSummary">
            <template slot="content">
              <span style="display: inline-block; width: 88px; color: #9b9b9b"
                >待审核:{{ subTaskSummary.auditing }}
              </span>
              <span style="color: #9b9b9b">待提交:{{ subTaskSummary.executing }}</span>
              <br />

              <span style="display: inline-block; width: 88px; color: #9b9b9b"
                >待指派:{{ subTaskSummary.waitDesignating }}
              </span>
              <span style="color: #9b9b9b">待接收:{{ subTaskSummary.waitReceiving }}</span>
              <br />

              <span style="display: inline-block; width: 88px; color: #9b9b9b"
                >已完成:{{ subTaskSummary.completed }}
              </span>
              <span style="color: #9b9b9b">已过期:{{ subTaskSummary.overdue }}</span>
              <br />

              <span style="display: inline-block; width: 88px; color: #9b9b9b"
                >已拒绝:{{ subTaskSummary.refused }}
              </span>
              <span style="color: #9b9b9b">已撤销:{{ subTaskSummary.revoked }}</span>
            </template>
            <span style="padding: 0px 19px; color: #1bd39b">{{ subTaskSummary.sum }}</span>
          </a-popover>
        </template>
        <template slot="action" slot-scope="text, record">
          <a-space>
            <a-button
              size="small"
              v-if="type === 2 && record.taskStatus === 'AUDITING'"
              @click="handleMenuClick(record.id, '审批', record)">全部审批
            </a-button>
            <a-dropdown>
              <a-button size="small">· · ·</a-button>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a-popconfirm
                    :title="`你确定撤销'${record.taskTitle}'任务吗?`"
                    ok-text="撤销任务"
                    okType="danger"
                    cancel-text="取消"
                    @confirm="handleMenuClick(record.id, '撤销')"
                  >
                    <a>撤销任务</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </a-dropdown>

          </a-space>
        </template>
        <!-- 子任务表格 -->
        <template slot="expandedRowRender" slot-scope="record">
          <div style="display: flex; justify-content: space-between">
            <h1>子任务</h1>
          </div>
          <div v-if="record.routineType==0&&measureTaskYearsList!=null" style="border:1px solid blue;padding:15px;border-radius:10px;">
            任务组昼夜等效声级均值dB：Ld：{{measureTaskYearsList.pointsSummaryList[0].currentFunAreaData.ld}} Ln：{{measureTaskYearsList.pointsSummaryList[0].currentFunAreaData.ln}}<br>
            部门历史等效声级均值dB：
            <span v-for="(item,index) in measureTaskYearsSummaryList" :key="index">
              {{item.year}}年Sd:{{item.dayEq}}

            </span>
          </div>

          <div v-if="record.routineType==1||record.routineType==2" style="border:1px solid blue;padding:15px;border-radius:10px;">
            任务组超标率：Ld：{{100-measureTaskYearsList.currentTaskSummary.dayComplianceRate}}% Ln：{{100-measureTaskYearsList.currentTaskSummary.nightComplianceRate}}%<br>
            部门历史超标率：
            <span v-for="(item,index) in measureTaskYearsSummaryList" :key="index">
              {{item.year}}年{{item.season}}季度Ld：{{item.dayComplianceRate}}%
              <span style="padding:5px;"></span>
              {{item.year}}年{{item.season}}季度Ln：{{item.nightComplianceRate}}%
            </span>
          </div>
          <a-table
            :loading="subTableLoading"
            :columns="columnsSubTask"
            :data-source="record.subTaskList"
            :rowKey="(record) => record.id"
            style="margin: 12px 0px"
            size="small"
          >
            <template slot="taskStatus" slot-scope="taskStatus">{{ taskStatus | taskStatusFormat }}</template>

            <template slot="action" slot-scope="text, record">
              <a-space>
                <a-button size="small" @click="handleMenuClick(record.id, '审批',record)">审批</a-button>
                <a-dropdown>
                  <a-button size="small">· · ·</a-button>
                  <a-menu slot="overlay">
                    <a-menu-item @click="handleMenuClick(record.id, '测量数据',record)">
                      <a>测量数据</a>
                    </a-menu-item>

                    <a-menu-item @click="handleMenuClick(record.id, '详情')">
                      <a>任务详情</a>
                    </a-menu-item>

                    <a-menu-item @click="handleMenuClick(record.id, '操作记录')">
                      <a>操作记录</a>
                    </a-menu-item>

                    <a-menu-item @click="handleMenuClick(record.id, '审核记录')">
                      <a>审核记录</a>
                    </a-menu-item>

                    <a-menu-item>
                      <a-popconfirm
                        :title="`你确定撤销'${record.taskTitle}'任务吗?`"
                        ok-text="撤销任务"
                        okType="danger"
                        cancel-text="取消"
                        @confirm="handleMenuClick(record.id, '撤销')"
                      >
                        <a>撤销任务</a>
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </a-space>
            </template>
          </a-table>
        </template>

        <!-- <template slot="action" slot-scope="text, record">
          <a-space>
            <a-button
              size="small"
              v-if="type === 5 && record.taskStatus === 'COMPLETED'"
              @click="handleMenuClick(record.id, '导出报表', record)"
              >导出报表</a-button
            >

            <a-button
              size="small"
              v-if="type === 2 && record.taskStatus === 'AUDITING'"
              @click="handleMenuClick(record.id, '审批', record)"
              >审批任务</a-button
            >
          </a-space>
        </template> -->
      </a-table>
    </div>
    <!-- 新建任务 -->
    <NewTask ref="newTask" :visible.sync="modalVisible" :pageKey="'任务'" :operate="operate" :recordId="recordId" :modalData="modalData" @goMeasPointPage="showMeasPointPage" @fetchData="fetchData"></NewTask>
    <!-- <CommonModal
      :visible.sync="modalVisible"
      :pageKey="'任务'"
      :operate="operate"
      :recordId="recordId"
      :modalData="modalData"
      @fetchData="fetchData"
    /> -->

    <!-- 全部测点 -->
    <DetailMeasPoint :visible.sync="detailMeasPoinTVisible" :hasChooseMeasuresList="hasChooseMeasuresList" @detailMeasPointClick="goDetailMeasPoint"></DetailMeasPoint>

    <SecondaryModal
      :visible.sync="secondaryModalVisible"
      :modalKey="modalKey"
      :recordId="recordId"
      @fetchData="fetchData"
    />
    <!-- 查看详情 -->
    <DetailDrawer :visible.sync="detailDrawerVisible" :recordId="recordId" />
    <!-- 操作记录 -->
    <OperateRecordDrawer :visible.sync="operateRecordDrawerVisible" :recordId="recordId" />
    <!-- 审核记录 -->
    <AuditRecordDrawer :visible.sync="auditRecordDrawerVisible" :recordId="recordId" />
    <!-- 执行任务 -->
    <ExecuteTaskDrawer :visible.sync="executeTaskDrawerVisible" :recordId="recordId" :record="record" />
    <!-- 查看数据 @closeMeasureData="closeMeasu" -->
    <MeasuredData ref="measuredData" :visible.sync="MeasuredDataVisible" :recordId="recordId" :measTaskStatus="measTaskStatus" :dataSubmitType="dataSubmitType" :routineType="routineType" :sonMearId="sonMearId" @goShowAllMeasureData='showAllMeasureData' :type="type"></MeasuredData> 
    <!-- 全部数据 -->
    <AllMeasurementData ref="allMeasurementData" :visible.sync="AllMeasurementDataVisible"></AllMeasurementData>
  </div>
</template>

<script>
import {
  //任务
  getHomeTaskList,
  deleteTask,
  deleteSonTask,//子任务删除
  getTaskDetail,
  revokeTask,
  publishTask,
  refuseTask,
  acceptTask,
  claimTask,
  exportReport,
  getAuditSubTaskList,
  taskGetYearsData,
} from '@/api/api'

import CommonModal from './components/CommonModal'
import SecondaryModal from './components/SecondaryModal'
import DetailDrawer from './components/DetailDrawer'
import OperateRecordDrawer from './components/OperateRecordDrawer'
import AuditRecordDrawer from './components/AuditRecordDrawer'
import ExecuteTaskDrawer from './components/ExecuteTaskDrawer'
import MeasuredData from './components/MeasuredData';//查看数据公共模块
import AllMeasurementData from './components/AllMeasurementData';//全部数据公共模块
import NewTask from './components/NewTask';//新建任务
import DetailMeasPoint from './components/DetailMeasPoint';//全部测点

const columnsGroupTask4 = [
  {
    dataIndex: 'taskTitle',
    title: '任务组名称',
    // scopedSlots: { customRender: 'taskTitle' },
  },

  {
    dataIndex: 'taskTypeCustom',
    title: '任务类型',
    scopedSlots: { customRender: 'taskTypeCustom' },
  },
  {
    dataIndex: 'taskTypeCustom1',
    title: '任务名称',
    scopedSlots: { customRender: 'taskTypeCustom1' },
  },
  // {
  //   dataIndex: 'taskStatus',
  //   title: '任务状态',
  //   scopedSlots: { customRender: 'taskStatus' },
  // },

  {
    dataIndex: 'startTime',
    title: '任务开始时间',
    scopedSlots: { customRender: 'startTime' },
  },
  {
    dataIndex: 'stopTime',
    title: '任务结束时间',
    scopedSlots: { customRender: 'stopTime' },
  },

  {
    dataIndex: 'subTaskSummary',
    title: '子任务总数',
    scopedSlots: { customRender: 'subTaskSummary' },
  },

  {
    dataIndex: 'action',
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]
const columnsSubTask4 = [
  {
    dataIndex: 'id',
    title: '任务编号',
  },
  {
    dataIndex: 'measure.measureName',
    title: '测点名称',
  },
  {
    dataIndex: 'measure.address',
    title: '测点地点',
  },
  {
    dataIndex: 'taskStatus',
    title: '任务状态',
    scopedSlots: { customRender: 'taskStatus' },
  },
  {
    dataIndex: 'action',
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]
const columnsGroupTask5 = [
  {
    dataIndex: 'taskTitle',
    title: '任务组名称',
  },

  {
    dataIndex: 'taskTypeCustom',
    title: '任务类型',
    scopedSlots: { customRender: 'taskTypeCustom' },
  },
  {
    dataIndex: 'taskTypeCustom1',
    title: '任务名称',
    scopedSlots: { customRender: 'taskTypeCustom1' },
  },
  // {
  //   dataIndex: 'taskType',
  //   title: '任务分类',
  //   scopedSlots: { customRender: 'taskType' },
  // },
  // {
  //   dataIndex: 'taskStatus',
  //   title: '任务状态',
  //   scopedSlots: { customRender: 'taskStatus' },
  // },

  {
    dataIndex: 'startTime',
    title: '任务开始时间',
    scopedSlots: { customRender: 'startTime' },
  },
  {
    dataIndex: 'stopTime',
    title: '任务结束时间',
    scopedSlots: { customRender: 'stopTime' },
  },

  {
    dataIndex: 'subTaskSummary',
    title: '子任务统计',
    scopedSlots: { customRender: 'subTaskSummary' },
  },

  // {
  //   dataIndex: 'action',
  //   title: '操作',
  //   scopedSlots: { customRender: 'action' },
  // },
]
const columnsSubTask5 = [
  {
    dataIndex: 'id',
    title: '任务id',
  },
  {
    dataIndex: 'measure.measureName',
    title: '测点名称',
  },
  {
    dataIndex: 'measure.address',
    title: '测点地址',
  },
  {
    dataIndex: 'taskStatus',
    title: '任务状态',
    scopedSlots: { customRender: 'taskStatus' },
  },
  {
    dataIndex: 'action',
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]
//已完成
const columnsGroupTask6 = [
  {
    dataIndex: 'taskTitle',
    title: '任务组名称',
  },

  {
    dataIndex: 'taskTypeCustom',
    title: '任务类型',
    scopedSlots: { customRender: 'taskTypeCustom' },
  },
  {
    dataIndex: 'taskTypeCustom1',
    title: '任务名称',
    scopedSlots: { customRender: 'taskTypeCustom1' },
  },
  // {
  //   dataIndex: 'taskType',
  //   title: '任务分类',
  //   scopedSlots: { customRender: 'taskType' },
  // },
  // {
  //   dataIndex: 'taskStatus',
  //   title: '任务状态',
  //   scopedSlots: { customRender: 'taskStatus' },
  // },

  {
    dataIndex: 'startTime',
    title: '任务开始时间',
    scopedSlots: { customRender: 'startTime' },
  },
  {
    dataIndex: 'stopTime',
    title: '任务结束时间',
    scopedSlots: { customRender: 'stopTime' },
  },

  {
    dataIndex: 'subTaskSummary',
    title: '子任务统计',
    scopedSlots: { customRender: 'subTaskSummary' },
  },

  {
    dataIndex: 'action',
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]
const columnsSubTask6 = [
  {
    dataIndex: 'id',
    title: '任务id',
  },
  {
    dataIndex: 'measure.measureName',
    title: '测点名称',
  },
  {
    dataIndex: 'measure.address',
    title: '测点地址',
  },
  {
    dataIndex: 'taskStatus',
    title: '任务状态',
    scopedSlots: { customRender: 'taskStatus' },
  },
  {
    dataIndex: 'action',
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]
//待审批 2
const columnsGroupTask = [
  {
    dataIndex: 'taskTitle',
    title: '任务组名称',
  },

  {
    dataIndex: 'taskTypeCustom',
    title: '任务类型',
    scopedSlots: { customRender: 'taskTypeCustom' },
  },
  {
    dataIndex: 'taskTypeCustom1',
    title: '任务名称',
    scopedSlots: { customRender: 'taskTypeCustom1' },
  },
  // {
  //   dataIndex: 'taskType',
  //   title: '任务分类',
  //   scopedSlots: { customRender: 'taskType' },
  // },
  // {
  //   dataIndex: 'taskStatus',
  //   title: '任务状态',
  //   scopedSlots: { customRender: 'taskStatus' },
  // },

  {
    dataIndex: 'startTime',
    title: '任务开始时间',
    scopedSlots: { customRender: 'startTime' },
  },
  {
    dataIndex: 'stopTime',
    title: '任务结束时间',
    scopedSlots: { customRender: 'stopTime' },
  },

  {
    dataIndex: 'subTaskSummary',
    title: '子任务统计',
    scopedSlots: { customRender: 'subTaskSummary' },
  },

  {
    dataIndex: 'action',
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]
//待审批  2 子任务
const columnsSubTask = [
  {
    dataIndex: 'id',
    title: '任务编号',
  },
  {
    dataIndex: 'measure.measureName',
    title: '测点名称',
  },
  {
    dataIndex: 'measure.address',
    title: '测点地点',
  },
  {
    dataIndex: 'taskStatus',
    title: '任务状态',
    scopedSlots: { customRender: 'taskStatus' },
  },
  {
    dataIndex: 'action',
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]
//待提交 0
const columnsTaskToSubmit = [
  {
    dataIndex: 'taskTitle',
    title: '任务标题',
  },

  {
    dataIndex: 'taskTypeCustom',
    title: '任务类型',
    scopedSlots: { customRender: 'taskTypeCustom' },
  },
  {
    dataIndex: 'taskTypeCustom1',
    title: '任务名称',
    scopedSlots: { customRender: 'taskTypeCustom1' },
  },
  // {
  //   dataIndex: 'taskType',
  //   title: '任务分类',
  //   scopedSlots: { customRender: 'taskType' },
  // },
  // {
  //   dataIndex: 'taskStatus',
  //   title: '任务状态',
  //   scopedSlots: { customRender: 'taskStatus' },
  // },

  {
    dataIndex: 'startTime',
    title: '任务开始时间',
    scopedSlots: { customRender: 'startTime' },
  },
  {
    dataIndex: 'stopTime',
    title: '任务结束时间',
    scopedSlots: { customRender: 'stopTime' },
  },

  {
    dataIndex: 'measure.address',
    title: '测量地点',
    scopedSlots: { customRender: 'address' },
  },

  {
    dataIndex: 'action',
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]
// 待领取 1
const columnsTaskToGet = [
  {
    dataIndex: 'taskTitle',
    title: '任务组名称',
  },

  {
    dataIndex: 'taskTypeCustom',
    title: '任务类型',
    scopedSlots: { customRender: 'taskTypeCustom' },
  },
  {
    dataIndex: 'taskTypeCustom1',
    title: '任务名称',
    scopedSlots: { customRender: 'taskTypeCustom1' },
  },
  // {
  //   dataIndex: 'taskType',
  //   title: '任务分类',
  //   scopedSlots: { customRender: 'taskType' },
  // },
  // {
  //   dataIndex: 'taskStatus',
  //   title: '任务状态',
  //   scopedSlots: { customRender: 'taskStatus' },
  // },

  {
    dataIndex: 'startTime',
    title: '任务开始时间',
    scopedSlots: { customRender: 'startTime' },
  },
  {
    dataIndex: 'stopTime',
    title: '任务结束时间',
    scopedSlots: { customRender: 'stopTime' },
  },
  {
    dataIndex: 'subTaskSummary',
    title: '子任务统计',
    scopedSlots: { customRender: 'subTaskSummary' },
  },

  {
    dataIndex: 'action',
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]
//待领取 1
const columnsSubTask1 = [
  {
    dataIndex: 'id',
    title: '任务编号',
  },
  {
    dataIndex: 'measure.measureName',
    title: '测点名称',
  },
  {
    dataIndex: 'measure.address',
    title: '测点地址',
  },
  {
    dataIndex: 'taskStatus',
    title: '任务状态',
    scopedSlots: { customRender: 'taskStatus' },
  },
  {
    dataIndex: 'action',
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]
//待领取 1 本部门任务
const columnsSubTask11 = [
  { title: '测点编号', dataIndex: 'measure.measureCode', scopedSlots: { customRender: 'measure.measureCode' }  },
  {
    dataIndex: 'taskTitle',
    title: '任务组名称',
    scopedSlots: { customRender: 'taskTitle' }
  },
  { title: '测点名称', dataIndex: 'measure.measureName',scopedSlots: { customRender: 'measure.measureName' } },
  { title: '测点地点', dataIndex: 'measure.address', scopedSlots: { customRender: 'measure.address' } },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
  },
];
//待发布 3
const columnsTaskToRelease = [
  {
    dataIndex: 'taskTitle',
    title: '任务组名称',
  },
  {
    dataIndex: 'taskTypeCustom',
    title: '任务类型',
    scopedSlots: { customRender: 'taskTypeCustom' },
  },
  {
    dataIndex: 'taskTypeCustom1',
    title: '任务名称',
    scopedSlots: { customRender: 'taskTypeCustom1' },//taskType
  },
  {
    dataIndex: 'startTime',
    title: '任务开始时间',
    scopedSlots: { customRender: 'startTime' },
  },
  {
    dataIndex: 'stopTime',
    title: '任务结束时间',
    scopedSlots: { customRender: 'stopTime' },
  },
  {
    dataIndex: 'measurePoints',
    title: '子任务总数',
    scopedSlots: { customRender: 'measurePoints' },
  },
  {
    dataIndex: 'action',
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]
//待发布嵌套表格 3
const innerColumns = [
  { title: '测点编号', dataIndex: 'measureCode', scopedSlots: { customRender: 'measureCode' }  },
  { title: '测点名称', dataIndex: 'measureName',scopedSlots: { customRender: 'measureName' } },
  { title: '测点地点', dataIndex: 'address', scopedSlots: { customRender: 'address' } },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
  },
];
export default {
  name: 'task-manage',

  components: {
    CommonModal,
    SecondaryModal,
    DetailDrawer,
    OperateRecordDrawer,
    AuditRecordDrawer,
    ExecuteTaskDrawer,
    MeasuredData,
    AllMeasurementData,
    NewTask,
    DetailMeasPoint
  },

  data() {
    return {
      modalVisible: false,
      operate: '',
      modalData: {},

      secondaryModalVisible: false,
      recordId: '',
      routineType:'',
      record: {},
      modalKey: '',

      detailDrawerVisible: false,
      operateRecordDrawerVisible: false,
      auditRecordDrawerVisible: false,
      executeTaskDrawerVisible: false,
      MeasuredDataVisible:false,//查看数据
      sonMearId:'',//查看数据id
      dataSubmitType:null,//查看数据所需 非常规任务需要
      measTaskStatus:'',//查看数据所需 非常规任务需要
      AllMeasurementDataVisible:false,//全部数据
      detailMeasPoinTVisible:false,//全部测点

      columnsGroupTask4,//进行中
      columnsGroupTask5,//已关闭
      columnsGroupTask6,//已完成
      columnsGroupTask,
      columnsSubTask4,//进行中子任务
      columnsSubTask5,//已关闭子任务
      columnsSubTask6,//已完成子任务
      columnsSubTask,
      columnsSubTask1,//带发布 1 子任务
      columnsSubTask11,//带发布 1 本部门任务
      columnsTaskToSubmit,
      columnsTaskToRelease,
      columnsTaskToGet,
      dataSource: [],
      countArr: [],
      type: 0,
      tableLoading: false,
      subTableLoading: false,
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total) => `共 ${total} 条`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '100', '500'],
      },

      subTaskList: [],
      selectedRowKeys: [],
      total: [],

      innerColumns,
      timer:null,//刷新
      innerData:[],//子任务
      outnerData:null,//当前激活父任务
      outnerIndex:null,//展开索引
      isTolongSub:false,//是否有展开
      measureTaskYearsList:null,//待审批子任务
      measureTaskYearsSummaryList:[],//功能区
      acParentId:'',//当前
      hasChooseMeasuresList:[],//全部测点展示

    }
  },

  created() {
    this.fetchData()
  },
  mounted(){
    this.refreshList()
  },
  watch: {
    type(value) {
      this.page.total = this.total[value]
    },
  },
  methods: {
    async fetchData(code) {
      if(code!=1){
        this.tableLoading = true
      }
      let promises = [0, 7, 2, 3, 4, 5, 6, 8].map((type) =>
        getHomeTaskList({
          page: {
            size: 100000,
            current: 1,
          },
          keys: {
            type,
          },
        },type),
      )
      let result = await Promise.all(promises)
      // console.log(result)
      result.forEach((item, index) => {
        if (item.error.code === 0) {
          if(code==1){
            this.countArr[index] = item.response.total
            // this.dataSource[index] = item.response.records
            // this.total[index] = item.response.total
          }else{
            this.countArr[index] = item.response.total
            this.dataSource[index] = item.response.records
            this.total[index] = item.response.total
          }
          
        }
      })
      this.tableLoading = false
      // if(this.isTolongSub){
      //   let index = this.dataSource[this.type].findIndex((item) => item.id === this.outnerIndex)
      //   if(index!=-1){
      //     this.handleExpand(true,result[this.type].response.records[index])
      //   }
      // }
    },
    clickAdd() {
      this.modalVisible = true
      this.operate = '创建'
    },
    handleTableChange(pagination) {
      this.page = { ...pagination }
      // this.fetchData()
    },

    async handleMenuClick(id, operate, record) {
      if (operate === '指派') {
        this.secondaryModalVisible = true
        this.modalKey = '指派'
        this.recordId = id
        return
      }

      if (operate === '详情') {
        this.detailDrawerVisible = true
        this.recordId = id
        return
      }

      if (operate === '操作记录') {
        this.operateRecordDrawerVisible = true
        this.recordId = id
        return
      }

      if (operate === '审核记录') {
        this.auditRecordDrawerVisible = true
        this.recordId = id
        return
      }

      if (operate === '执行任务') {
        this.executeTaskDrawerVisible = true
        this.recordId = id
        this.record = record
        return
      }

      if (operate === '修改') {
        getTaskDetail(id).then(({ error, response }) => {
          if (error.code === 0) {
            this.modalData = response
            this.modalVisible = true
            this.operate = '修改'
          }
        })
        return
      }

      if (operate === '审批') {
        this.secondaryModalVisible = true
        this.modalKey = '审批'
        this.recordId = id
        return
      }

      let response
      if (operate === '撤销') {
        response = await revokeTask([id])
      }

      if (operate === '拒绝') {
        response = await refuseTask(id)
      }

      if (operate === '删除') {
        response = await deleteTask([id])
      }

      if (operate === '接收') {
        response = await acceptTask(id)
      }

      if (operate === '发布') {
        response = await publishTask([id])
      }

      if (operate === '导出报表') {
        response = await exportReport(id)
        if (typeof response === 'string') {
          const url = window.URL.createObjectURL(new Blob([response]))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', `${record.taskTitle}.doc`)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
        return
      }
      if (operate === '删除子任务') {
        var obj ={"id": this.outnerData.id,
                  "action": 0,
                  "dataList": [id]}
        response = await deleteSonTask(obj)
      }
      if (operate === '领取任务') {
        var obj ={id:record.id}
        response = await claimTask(id)
      }
      if (operate === '测量数据') {
        // console.log(record.dataSubmitType)
        // console.log(record.taskStatus)
        // console.log(this.type)
        // this.type=this.type;
        this.MeasuredDataVisible = true;
        this.recordId = id;
        this.routineType=record.routineType;
        this.sonMearId=record.measure.id;
        this.dataSubmitType=record.dataSubmitType;
        this.measTaskStatus=record.taskStatus;

        this.$refs.measuredData.add(id,record.routineType)
        return
      }
      
      
      if (response.error.code === 0) {
        this.$message.success(operate + '成功')
        this.fetchData()
      }
    },

    handleExpand(expanded, record) {
      console.log(record)
      console.log(this.type)
      this.acParentId = record.id;
      this.isTolongSub = expanded;
      this.selectedRowKeys = [];

      var lastArray=[];
      function findSontask(objArray){//过滤子任务
        objArray.forEach(function(item,index){
          if(item.taskType==0){
            lastArray.push(item)
          }else{
            findSontask(item.subTaskList)
          }
        })
      }
      if (expanded) {//1 2 3 4 5 6 
        this.subTableLoading = true
        if (this.type === 2) {//待审批
          getAuditSubTaskList(record.id).then(({ error, response }) => {
            if (error.code === 0) {
              let index = this.dataSource[this.type].findIndex((item) => item.id === record.id)
              this.dataSource[this.type][index].subTaskList = response.dataList
            }
            this.subTableLoading = false
          })
          if(record.routineType!=null){
            taskGetYearsData(record.id).then(({ error, response }) => {
              if (error.code === 0) {
                this.measureTaskYearsList=response;
                this.measureTaskYearsSummaryList=response.yearsSummaryList;
              }
              this.subTableLoading = false
            })
          }
        }else if(this.type === 3){//待发布
          let index = this.dataSource[this.type].findIndex((item) => item.id === record.id)
          this.outnerIndex=record.id;
          this.dataSource[this.type][index].subTaskList = record.measurePointList;
          // this.innerData=record.measurePointList;
          this.outnerData=record;
          this.subTableLoading = false;
        }else if(this.type === 4){//进行中
          // console.log(record.id)
          getTaskDetail(record.id).then(({ error, response }) => {
            if (error.code === 0) {
              // console.log(response)
              findSontask(response.subTaskList)
              // console.log(lastArray)
              let index = this.dataSource[this.type].findIndex((item) => item.id === record.id);
              this.outnerIndex=record.id;
              this.dataSource[this.type][index].subTaskList = lastArray;
            }
            this.subTableLoading = false;
          })
          // this.outnerData=record;
          // this.subTableLoading = false;
        }else if(this.type === 1){//待领取
          getTaskDetail(record.id).then(({ error, response }) => {
            if (error.code === 0) {
              // console.log(response)
              findSontask(response.subTaskList)
              // console.log(lastArray)
              let index = this.dataSource[this.type].findIndex((item) => item.id === record.id);
              this.outnerIndex=record.id;
              this.dataSource[this.type][index].subTaskList = lastArray;
            }
            this.subTableLoading = false;
          })
        }else if(this.type === 6){
          getTaskDetail(record.id).then(({ error, response }) => {
            if (error.code === 0) {
              findSontask(response.subTaskList)
              let index = this.dataSource[this.type].findIndex((item) => item.id === record.id)
              this.dataSource[this.type][index].subTaskList = lastArray
            }
            this.subTableLoading = false
          })
        }else{
          getTaskDetail(record.id).then(({ error, response }) => {
            if (error.code === 0) {
              // console.log(response)
              findSontask(response.subTaskList)
              // console.log(lastArray)
              let index = this.dataSource[this.type].findIndex((item) => item.id === record.id)
              this.dataSource[this.type][index].subTaskList = lastArray;
            }
            this.subTableLoading = false
          })
        }
      }
    },
    showMeasPointPage:function(list){
      this.hasChooseMeasuresList=list;
      this.detailMeasPoinTVisible=true;
    },

    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    refreshList:function(){
      var that = this;
      this.timer = setInterval(function(){
        that.fetchData(1)
      },60000)
    },
    showAllMeasureData:function(status){
      // console.log(status)
      this.AllMeasurementDataVisible=true;
      this.$refs.allMeasurementData.add(status)
    },
    closeMeasu(status){
      // console.log(status)
      this.MeasurementDataVisible=false;
    },
    goDetailMeasPoint:function(list){
      this.$refs.newTask.add(list)
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);        
    this.timer = null;
  }
}
</script>


<style lang="less" scoped>
/deep/ .ant-tabs-bar {
  margin: 0;
  border-bottom: 1px solid #fff;
}
/deep/ .ant-badge {
  transform: translate(4px, -2px);
}

/deep/ .ant-table-expanded-row {
  background-color: white;
}
</style>