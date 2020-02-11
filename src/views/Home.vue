<template>
  <div class="home">
    <h1>Welcome</h1>
    <FullCalendar defaultView="dayGridMonth" :plugins="calendarPlugins" />
  </div>
</template>

<script>
//import HelloWorld from '@/components/HelloWorld'
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'

export default {
  components: {
    //HelloWorld,
    FullCalendar
  },
  data: function () {
    return {
      calendarPlugins: [ dayGridPlugin ]
    }
  },
  methods: {}
}
</script>

<style lang='scss'>

@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';

</style>