<template>
  <div class="home">
    <h1 class="project-title">Project Name</h1>
    <div id="event-toolbar" class="event-toolbar">
      <div 
        class='fc-event' 
        v-for="event in eventsUnique" 
        :key="event.title"
      >{{ event.title }}</div>
    </div>
    <FullCalendar 
      defaultView="dayGridWeek" 
      :titleFormat="title"
      :header="calendarHeaders"
      :columnHeaderFormat="column"
      :plugins="calendarPlugins"
      :editable="true"
      :droppable="true"
      :events="eventsScheduled"
      :height="height"
    />
  </div>
</template>

<script>

//import HelloWorld from '@/components/HelloWorld'
import FullCalendar from '@fullcalendar/vue'
import momentPlugin from '@fullcalendar/moment';
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';

export default {
  components: {
    //HelloWorld,
    FullCalendar,
    Draggable
  },
  data: function() {
    return {
      title: '{{MMM D}}',
      height: 'auto',
      column: '{{D}}',
      calendarHeaders: {
        left: 'prev',
        center: 'title',
        right: 'next'
      },
      calendarPlugins: [ 
        dayGridPlugin,
        interactionPlugin,
        momentPlugin
      ],
      eventsScheduled: [
        { title: 'Dan', date: '2020-02-10' },
        { title: 'Jamie', date: '2020-02-11' },
        { title: 'Dan', date: '2020-02-14' },
        { title: 'Jamie', date: '2020-02-14' },
        { title: 'Melissa', date: '2020-02-14' }
      ],
      eventsUnique: [
        { title: 'Melissa' },
        { title: 'Dan' },
        { title: 'Jamie' },
        { title: 'Daryl' },
        { title: 'Benji' },
        { title: 'Ellerey' }
      ]
    }
  },
  mounted() {
    this.setupDraggable();
  },
  methods: {
    setupDraggable() {
      new Draggable(document.getElementById("event-toolbar"), {
        itemSelector: ".fc-event",
        eventData: function(eventEl) {
          let event = {
            title: eventEl.innerText
          };
          console.log(event);
          return event;
        }
      });
    }
  }
}
</script>

<style lang='scss'>

@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';

.home {
  overflow: hidden;
  padding: 60px 0 0;
  position: relative;
}

.fc-view-container {
  overflow: hidden;
}

.project-title {
  left: 10px;
  margin: 0;
  position: absolute;
  top: 10px;
  text-align: left;
}

.event-toolbar {
  background: #333;
  height: 56px;
  margin: 10px 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 10px;
  position: relative;
  white-space: nowrap;
  width: 100%;

  .fc-event {
    display: inline-block;
    margin: 0 10px 0 0;
    width: 200px;
  }
}

.fc-toolbar.fc-header-toolbar {
  position: absolute;
  right: 10px;
  text-transform: uppercase;
  top: 10px;
  width: 400px;
}

.fc-button {
  background: #3788d8;
  border-color: #3788d8;
}

/*
.fc-unthemed th, 
.fc-unthemed td, 
.fc-unthemed thead, 
.fc-unthemed tbody, 
.fc-unthemed .fc-divider, 
.fc-unthemed .fc-row, 
.fc-unthemed .fc-content, 
.fc-unthemed .fc-popover, 
.fc-unthemed .fc-list-view, 
.fc-unthemed .fc-list-heading td {
  border: 0px;
}
*/

.fc-event,
.fc-day-header {
  height: 44px;
  line-height: 44px;
  margin-bottom: 5.5px;
  text-align: center;
}

.fc-day-header {
  position: relative;

  span {    
    background: #333;
    border-radius: 5px;
    color: #fff;
    display: inline-block;
    font-size: 24px;
    height: 33px;
    line-height: 33px;
    position: absolute;
    right: 5px;
    top: 5px;
    width: 33px;
  }
}

.fc-sun,
.fc-sat {
  background: #f1f1f1;
}

.fc-today {
  background: #fcf8e3 !important;
}

</style>