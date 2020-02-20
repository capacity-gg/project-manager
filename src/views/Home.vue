<template>
  <div class="home">
    <div class="project-header">
      <div class="button--primary" style="margin: 0 12px;" @click.prevent="setSettingsVisibility(true)">
        <span class="icon">
          <font-awesome-icon icon="cog"/>
        </span>  
      </div>
      <h1 class="project-title">{{ projectName }}</h1>
    </div>
    <div v-if="areSettingsVisible" class="modal__background" @click.prevent="setSettingsVisibility(false)">
      <div class="modal modal--settings" @click="stopPropagation">
        <div class="modal--header">Settings</div>
        <div class="modal--row">
          <div class="modal--label">Project Name</div>
          <input type="text" v-model="projectName" :val="projectName" placeholder="Example name">
        </div>
        <div class="modal--row">
          <div class="modal--label">Import</div>
          <csvImport v-model="parseCSV"/>
        </div>
        <div class="modal--row">
          <div class="modal--label">Export</div>
          <div class="fc-button fc-button--primary" @click.prevent="exportTableToCSV">Export</div>
        </div>
      </div>
    </div>
    <div class="top-bar">
      <div class="calendar-toggle-container">
        <div class="button--primary button--square" @click.prevent="toggleMilestonesVisibility">
          <span class="icon" v-if="areMilestonesVisible">
            <font-awesome-icon icon="exclamation"/>
          </span>  
          <span class="icon" v-else>
            <font-awesome-icon icon="user"/>
          </span>  
        </div>
      </div>
      <div id="event-toolbar" class="event-toolbar fc-unselectable">
        <div v-if="areMilestonesVisible">
          <div 
            class='fc-event event-milestone' 
            v-for="event in milestoneEvents" 
            :key="event.title"
          >
            <span class="fc-event-name">{{ event.title }}</span>
          </div>
        </div>
        <div v-else>
          <div 
            class='fc-event' 
            v-for="event in userEvents" 
            :key="event.title"
          >
            <span class="fc-event-name">{{ event.title }}</span>
            <span class="fc-event-count">{{ event.count }}</span>
          </div>
        </div>
      </div>
    </div>
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
      :eventRender="handleRender"
      @eventDrop="handleDrop"
      @eventReceive="handleReceive"
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
      projectName: "Example Project",
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
      userEvents: [
        { title: 'Melissa', count: '0' },
        { title: 'Dan', count: '0' },
        { title: 'Jamie', count: '0' },
        { title: 'Daryl', count: '0' },
        { title: 'Benji', count: '0' },
        { title: 'Ellerey', count: '0' }
      ],
      milestoneEvents: [
        { title: 'Presentation' },
        { title: 'Feedback' },
        { title: 'Delivery' }
      ],
      eventsNew: [],
      importedCSV: [],
      areSettingsVisible: false,
      areMilestonesVisible: false,
      eventToolbar: {
        draggable: null,
        isDragging: false,
        dragLeft: 0,
        dragStart: 0
      },
      fullCalendarApi: null
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
      } 
    }
  },
  methods: {
    dragScrollStart(e) {
      var self = this;

      self.eventToolbar.isDragging = true;
      self.eventToolbar.draggable.classList.add('dragging');
      self.eventToolbar.dragStart = e.pageX - self.eventToolbar.draggable.offsetLeft;
      self.eventToolbar.dragLeft = self.eventToolbar.draggable.scrollLeft;
    },
    dragScrollEnd() {
      var self = this;

      self.eventToolbar.isDragging = false;
      self.eventToolbar.draggable.classList.remove('dragging');
    },
    dragScrollMove(e) {
      var self = this;

      if (self.eventToolbar.isDragging == false) { return; }
      e.preventDefault();

      const x = e.pageX - self.eventToolbar.draggable.offsetLeft;
      const walk = (x - self.eventToolbar.dragStart) * 3;
      self.eventToolbar.draggable.scrollLeft = self.eventToolbar.dragLeft - walk;
    },
    setupDraggable() {
      var self = this;

      self.eventToolbar.draggable = document.getElementById("event-toolbar")

      new Draggable(self.eventToolbar.draggable, {
        itemSelector: ".fc-event",
        eventData: function(eventEl) {
          var elements = eventEl.getElementsByClassName("fc-event-name");
          var title = (elements.length > 0) ? elements[0].innerText : "";
          let event = { title: title };
          return event;
        }
      });

      // Bind event listeners to handle scrolling on drag
      self.eventToolbar.draggable.addEventListener('mousedown', self.dragScrollStart);
      self.eventToolbar.draggable.addEventListener('mouseleave', self.dragScrollEnd);
      self.eventToolbar.draggable.addEventListener('mouseup', self.dragScrollEnd);
      self.eventToolbar.draggable.addEventListener('mousemove', self.dragScrollMove);
    },
    calculateCount() {
      var self = this;

      self.userEvents.forEach(function(unique_event) {
        unique_event.count = 0;

        self.eventsNew.forEach(function(new_event) {
          if (unique_event.title == new_event.title) {
              unique_event.count++;
          }
        });
      });
    },
    stopPropagation(e) {
      e.stopPropagation();
    },
    toggleMilestonesVisibility() {
      var self = this;

      self.areMilestonesVisible = !self.areMilestonesVisible;

      self.$refs.fullCalendar.getApi().rerenderEvents();
    },
    setSettingsVisibility(IsVisible) {
      this.areSettingsVisible = IsVisible;
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
    handleRender(info) {
      //console.log(info);

      var self = this;
      var isRendered = true;

      if (self.areMilestonesVisible) {
        self.milestoneEvents.forEach(function(event) {
          if (event.title == info.event.title) {
            isRendered = true;
            return;
          }
        });
      }
      else {
        self.milestoneEvents.forEach(function(event) {
          if (event.title == info.event.title) {
            isRendered = false;
            return;
          }
        });
      }

      return isRendered;
    },
    handleDrop(info) {
      var self = this;

      var oldEvent = {
        title: info.oldEvent.title,
        date: self.convertDate(new Date(info.oldEvent.start))
      };

      var newEvent = {
        title: info.event.title,
        date: self.convertDate(new Date(info.event.start))
      };

      for (var x = 0; x < self.eventsNew.length; x++) {
        if (self.eventsNew[x].date == oldEvent.date &&
            self.eventsNew[x].title == oldEvent.title) {
            self.eventsNew[x].date = newEvent.date;
            break;
        }
      }

      if (self.getFilteredEvents(newEvent.title, newEvent.date).length > 1) { 
          self.removeEventFromList(newEvent); 
      }
    },
    handleReceive(info) {
      var self = this;

      var thisEvent = {
        title: info.event.title,
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
      if (self.getFilteredEvents(event.title, event.date).length > 1) { 
          self.removeEventFromList(event); 
      }
      
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
  height: 100vh;
  overflow: hidden;
  position: relative;
  width: 100vw;
}

.fc-view-container {
  overflow: hidden;
}

.project-header {
  left: 10px;
  margin: 0;
  position: absolute;
  top: 10px;
}

.project-title {
  display: inline-block;
  margin: 0 0 0 18px;
  text-align: left;
}

.modal__background {
  background: rgba(0, 0, 0, 0.5);
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 1000;
}

.modal {
  background: #ffffff;
  border-radius: 5px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  height: 400px;
  left: calc(50% - 300px);
  padding: 10px;
  position: relative;
  top: calc(50% - 200px);
  width: 600px;

  input[type="text"] {
    color: #333;
    height: 22px;
    line-height: 22px;
    padding: 0 4px;
    width: calc(100% - 10px);
  }
}

.modal--header {
  font-size: 24px;
  font-weight: 600;
  padding: 10px;
}

.modal--row {
  margin: 0 0 20px;
}

.modal--label {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 10px;
  padding: 4px 0;
}

.top-bar {
  margin: 60px 0 10px;

  .calendar-toggle-container,
  .event-toolbar {
    background: #333;
    display: inline-block;
    height: 56px;
    vertical-align: middle;
  }
  
  .calendar-toggle-container {
    width: 60px;
    padding: 10px;

    .button--primary,
    .icon {      
      height: 44px;
      line-height: 44px;
      padding: 0;
      width: 44px;
    }
  }

  .event-toolbar {
    overflow-x: auto;
    overflow-y: hidden;
    padding: 10px 0;
    position: relative;
    white-space: nowrap;
    width: calc(100% - 80px);

    &::-webkit-scrollbar {
      background-color: #eee;
      border-radius: 10px;
      height: 6px;
    }
    &::-webkit-scrollbar-track {
      background-color: #eee;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #777;
    }

    &::-webkit-scrollbar-track,
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    }
  }
}

.button--primary {
  display: inline-block;
  
  span {
    font-size: 22px !important;
  }
}

.button--primary,
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

.button--primary,
.fc-button-primary,
.fc-button {
  border-radius: 50%;
  padding: 0;

  span.icon,
  span.fc-icon {
    font-size: 32px;
    line-height: 32px;
    height: 32px;
    padding: 2px;
    width: 32px;
  }
}

.button--primary,
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

.button--square {
  border-radius: 5px;
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

.event-toolbar .event-milestone .fc-event-name {
    text-align: center;
}

.fc-toolbar.fc-header-toolbar {
  position: absolute;
  right: 10px;
  text-transform: uppercase;
  top: 10px;
  width: 400px;
}

.fc-unthemed .fc-content-skeleton {
  height: 100vh;
  overflow: hidden;
  padding: 0;
}

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

.fc-dragging,
.dragging {
  cursor: grabbing !important;
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