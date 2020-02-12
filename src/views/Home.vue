<template>
  <div class="home">
    <h1>Welcome</h1>
    <FullCalendar 
      defaultView="dayGridWeek" 
      :titleFormat="title"
      :header="calendarHeaders"
      :plugins="calendarPlugins"
      :editable="true"
      :weekends="true"
      :dragScroll="true"
      :droppable="true"
      :events="events"
    />
  </div>
</template>

<script>
//import HelloWorld from '@/components/HelloWorld'
import FullCalendar from '@fullcalendar/vue'
import momentPlugin from '@fullcalendar/moment';
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';

export default {
  components: {
    //HelloWorld,
    FullCalendar
  },
  data: function () {
    return {
      title: '{{MMM D}}',
      calendarHeaders: {
        left: 'prev, next',
        center: '',
        right: 'title'
      },
      calendarPlugins: [ 
        dayGridPlugin,
        interactionPlugin,
        momentPlugin
      ],
      events: [
        { title: 'event 1', date: '2020-02-14' },
        { title: 'event 2', date: '2020-02-19' }
      ]
    }
  },
  methods: {}
}
</script>

<style lang='scss'>

@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';

</style>