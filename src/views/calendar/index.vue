<template>
  <div>
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script>
import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'

export default {
  name: 'MaintenanceCalendarview',
  components: {
    FullCalendar
  },
  data () {
    return {
      calendarOptions: {
        // 引入的插件，比如fullcalendar/daygrid，fullcalendar/timegrid引入后才可显示月，周，日
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
        initialView: 'timeGridWeek', // 默认为那个视图（月：dayGridMonth，周：timeGridWeek，日：timeGridDay）
        firstDay: 1, // 设置一周中显示的第一天是哪天，周日是0，周一是1，类推
        locale: 'zh-cn', // 切换语言，当前为中文
        eventColor: '#3BB2E3', // 全部日历日程背景色
        themeSystem: 'bootstrap', // 主题色(本地测试未能生效)
        // initialDate: moment().format('YYYY-MM-DD'), // 自定义设置背景颜色时一定要初始化日期时间
        timeGridEventMinHeight: '20', // 设置事件的最小高度
        aspectRatio: 1.65, // 设置日历单元格宽度与高度的比例。
        displayEventTime: true, // 是否显示时间
        allDaySlot: true, // 周，日视图时，all-day 不显示
        eventLimit: true, // 设置月日程，与all-day slot的最大显示数量，超过的通过弹窗显示,
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGrid'
          // right: 'agendaWeek,dayGridWeek,dayGrid'
        },
        // headerToolbar: { // 日历头部按钮位置
        //   left: '',
        //   center: 'prevYear,prev title next,nextYear',
        //   right: 'today dayGridMonth,timeGridWeek,timeGridDay'
        // },
        // buttonText: {
        //   today: '今天',
        //   month: '月',
        //   week: '周',
        //   day: '日'
        // },
        slotLabelFormat: {
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
          hour12: false // 设置时间为24小时
        },
        eventLimitNum: { // 事件显示数量限制(本地测试未能生效)
          dayGrid: {
            eventLimit: 5
          },
          timeGrid: {
            eventLimit: 2 // adjust to 6 only for timeGridWeek/timeGridDay
          }
        },
        // 事件
        // eventClick: this.handleEventClick, // 点击日历日程事件
        eventDblClick: this.handleEventDblClick, // 双击日历日程事件 (这部分是在源码中添加的)
        eventClickDelete: this.eventClickDelete, // 点击删除标签事件 (这部分是在源码中添加的)
        eventDrop: this.eventDrop, // 拖动日历日程事件
        eventResize: this.eventResize, // 修改日历日程大小事件
        select: this.handleDateSelect, // 选中日历格事件
        eventDidMount: this.eventDidMount, // 安装提示事件
        // loading: this.loadingEvent, // 视图数据加载中、加载完成触发（用于配合显示/隐藏加载指示器。）
        // selectAllow: this.selectAllow, //编程控制用户可以选择的地方，返回true则表示可选择，false表示不可选择
        eventMouseEnter: this.eventMouseEnter, // 鼠标滑过
        allowContextMenu: false,
        editable: true, // 是否可以进行（拖动、缩放）修改
        eventStartEditable: true, // Event日程开始时间可以改变，默认true，如果是false其实就是指日程块不能随意拖动，只能上下拉伸改变他的endTime
        eventDurationEditable: true, // Event日程的开始结束时间距离是否可以改变，默认true，如果是false则表示开始结束时间范围不能拉伸，只能拖拽
        selectable: true, // 是否可以选中日历格
        selectMirror: true,
        selectMinDistance: 0, // 选中日历格的最小距离
        dayMaxEvents: true,
        weekends: true,
        navLinks: true, // 天链接
        selectHelper: false,
        slotEventOverlap: false // 相同时间段的多个日程视觉上是否允许重叠，默认true允许
      }
    }
  },
  methods: {
    eventMouseEnter (event, jsEvent, view) { // 鼠标划过的事件
      if (event.event.classNames.length) {
        // console.log(event)
      }
    },
    eventDrop (event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
      console.log('event', event)
    },
    handleDateSelect (event) {
      console.log('handleDateSelect', event)
    }

  }
}
</script>

<style scoped>

</style>
