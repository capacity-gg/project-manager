<template>
  <div class="home">
    <h1 class="project-title">{{ projectName }}</h1>
    <div id="event-toolbar" class="event-toolbar">
      <div 
        class='fc-event' 
        v-for="event in eventsUnique" 
        :key="event.title"
      >
        <span class="fc-event-name">{{ event.title }}</span>
        <span class="fc-event-count">{{ event.count }}</span>
      </div>
    </div>
    <csvImport v-model="parseCSV" v-if="!hasImportedCSV"/>
    <div class="fc-button fc-button--primary" @click.prevent="exportTableToCSV">Export</div>
    <FullCalendar 
      defaultView="dayGridWeek" 
      ref="fullCalendar"
      :titleFormat="title"
      :header="calendarHeaders"
      :columnHeaderFormat="column"
      :plugins="calendarPlugins"
      :editable="true"
      :droppable="true"
      :height="height"
      @eventReceive="handleDrop"
      @eventClick="handleClick"
    />
  </div>
</template>

<script>

import csvImport from '@/components/CSV_Import'
import FullCalendar from '@fullcalendar/vue'
import momentPlugin from '@fullcalendar/moment';
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';

export default {
  components: {
    FullCalendar,
    csvImport
  },
  data: function() {
    return {
      projectName: "Project Name",
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
      eventsUnique: [
        { title: 'Melissa', count: '0' },
        { title: 'Dan', count: '0' },
        { title: 'Jamie', count: '0' },
        { title: 'Daryl', count: '0' },
        { title: 'Benji', count: '0' },
        { title: 'Ellerey', count: '0' }
      ],
      eventsNew: [],
      importedCSV: [],
      hasImportedCSV: false
    }
  },
  mounted() {
    var self = this;

    self.setupDraggable();

    self.calculateCount();
  },
  computed: {
    parseCSV: {
      get: function() {
        return this.importedCSV;
      },
      set: function(value) {
        var self = this;

        self.importedCSV = value;

        self.importedCSV.forEach(function(row) { self.importCSVRow(row); });

        self.hasImportedCSV = true;
      } 
    }
  },
  methods: {
    setupDraggable() {
      new Draggable(document.getElementById("event-toolbar"), {
        itemSelector: ".fc-event",
        eventData: function(eventEl) {
          var elements = eventEl.getElementsByClassName("fc-event-name");
          var title = (elements.length > 0) ? elements[0].innerText : "";
          let event = { title: title };
          return event;
        }
      });
    },
    calculateCount() {
      var self = this;

      self.eventsUnique.forEach(function(unique_event) {
        unique_event.count = 0;

        self.eventsNew.forEach(function(new_event) {
          if (unique_event.title == new_event.title) {
              unique_event.count++;
          }
        });
      });
    },
    exportTableToCSV() {
      var content = this.eventsNew;

      if (content == undefined || content.length == 0) { return; }

      var data = "data:text/csv;charset=utf-8," + [
        Object.keys(content[0]).join(","),
        ...content.map(item => Object.values(item).join(","))
      ]
      .join("\n")
      .replace(/(^\[)|(\]$)/gm, "");

      const link = document.createElement("a");

      link.setAttribute("href", encodeURI(data));
      link.setAttribute("download", this.projectName + ".csv");
      link.click();
    },
    importCSVRow(row) {
      var self = this;

      self.$refs.fullCalendar.getApi().addEvent(row);

      self.addEventTolist(row);
    },
    convertDate(date) {
      var date_month = date.getMonth() + 1;
      var date_day = date.getDate();

      var dateStr_month = (date_month < 10) ? ("0" + date_month) : date_month;
      var dateStr_day = (date_day < 10) ? ("0" + date_day) : date_day;
      
      return (date.getFullYear() + "-" + dateStr_month + "-" + dateStr_day);
    },
    handleDrop(info) {
      var self = this;

      var thisEvent = {
        title: info.draggedEl.firstElementChild.textContent,
        date: self.convertDate(new Date(info.event.start))
      };

      self.addEventTolist(thisEvent);
    },
    handleClick(info) {
      var self = this;

      var thisEvent = {
        title: info.event.title,
        date: self.convertDate(new Date(info.event.start))
      }

      self.removeEventFromList(thisEvent)
    },
    addEventTolist(event) {
      var self = this;

      // Ensure this event is not a duplicate
      if (self.getFilteredEvents(event.title, event.date).length > 1) { self.removeEventFromList(event); }

      self.eventsNew.push(event);
      
      self.onEventsUpdated();
    },
    removeEventFromList(event) {
      var self = this;
      var events = self.$refs.fullCalendar.getApi().getEvents();
      
      for (var x = 0; x < events.length; x++) {
        // Find event with matching name
        if (events[x].title == event.title) {
          var thisDate = self.convertDate(new Date(events[x].start));

          // Ensure matching event is on the same day
          if (thisDate == event.date) {
            self.eventsNew.splice(x, 1);
            events[x].remove();
            break;
          }
        }
      }

      self.onEventsUpdated();
    },
    getFilteredEvents(title, date) {
      var self = this;
      var events = self.$refs.fullCalendar.getApi().getEvents();
      var foundEvents = [];

      for (var x = 0; x < events.length; x++) {
        // Find event with matching name
        if (events[x].title == title) {
          var thisDate = self.convertDate(new Date(events[x].start));

          // Ensure matching event is on the same day
          if (thisDate == date) { foundEvents.push(events[x]); }
        }
      }

      return foundEvents;
    },
    onEventsUpdated() {
      var self = this;

      // Updated unique events count after adding/removing event in calendar
      self.$nextTick(() => { self.calculateCount(); });
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
}

.fc-button-primary,
.fc-event {
  span {
    color: #fff;
    display: inline-block;
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    padding: 0 10px;
  }
}
.fc-button-primary,
.fc-button {
  border-radius: 50%;
  height: 40px;
  padding: 0;
  width: 40px;

  span.fc-icon {
    font-size: 32px;
    line-height: 32px;
    height: 32px;
    padding: 0;
    width: 32px;
  }
}

.fc-button-primary,
.fc-button,
.fc-event {
  background: #3788d8;
  border-color: #3788d8;

  &:focus,
  &:active,
  &:hover {
    background-color: #1b446c;
    border-color: #1b446c;
    box-shadow: none;
    cursor: pointer;
  }
}

.fc-dragging.fc-event,
.event-toolbar .fc-event {
    display: inline-block;
    margin: 0 10px 0 0;
    width: 200px;

    .fc-event-name {
      text-align: left;
      width: calc(75% - 20px);
    }

    .fc-event-count {
      text-align: right;
      width: calc(25% - 20px);
    }
  }

.fc-toolbar.fc-header-toolbar {
  position: absolute;
  right: 10px;
  text-transform: uppercase;
  top: 10px;
  width: 400px;
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

.fc-button.fc-button--primary {
  color: #ffffff;
  height: 30px;
  line-height: 30px;
  margin: 10px 0;
  padding: 5px;
  text-transform: uppercase;
  width: 200px;

  &.disabled {
    background-color: #122f4b;
    cursor: not-allowed;
  }
}

</style>