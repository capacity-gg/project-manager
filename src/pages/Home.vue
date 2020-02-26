<template>
  <div class="home">
    <div class="nav-bar">
      <h1 class="title">Project Management Tool</h1>
      <div class="nav-bar__buttons">
        <div class="button button--icon" @click.prevent="setSettingsVisibility(true)">
          <span class="icon">
            <font-awesome-icon icon="cog"/>
          </span>  
        </div>
      </div>
    </div>
    <div class="project-header">
      <h2 class="project-title">{{ projectName }}</h2>
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
          <div class="button button--large" @click.prevent="exportTableToCSV">Export</div>
        </div>
      </div>
    </div>
    <div class="top-bar">
      <div class="calendar-toggle-container">
        <div class="button button--icon" @click.prevent="toggleMilestonesVisibility">
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
            class='button button--primary fc-event event-milestone' 
            v-for="event in milestoneEvents" 
            :key="event.title"
          >
            <span class="fc-event-name">{{ event.title }}</span>
          </div>
        </div>
        <div v-else>
          <div 
            class='button button--primary fc-event' 
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
  <div class="footer">
    <span class="copyright">Copyright © Capacity 2020</span>
  </div>
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

/**
 * Variable
 */

$color-primary-lightest: #ebf3fb;
$color-primary-light: #3788d8;
$color-primary-mid: #2c6cac;
$color-primary-dark: #1b446c;
$color-primary-darkest: #102840;

$color-secondary-light: #fef8f5;
$color-secondary-mid: #fbe4d8;
$color-secondary-dark: #f4b493;

$color-gray-lightest: #f9f9f9;
$color-gray-light: #f1f1f1;
$color-gray-mid: #dddddd;
$color-gray-dark: #555555;
$color-gray-darkest: #333333;

$button-size-small: 22px;
$button-size-default: 30px;
$button-size-large: 44px;
$button-radius: 3px;

$button-color: $color-gray-lightest;
$button-bg-color: $color-primary-light;
$button-bg-color-hover: $color-primary-dark;
$button-bg-color-disabled: $color-primary-darkest;
$button-border-color: $color-primary-mid;

/**
 * General
 */

h1 {
  font-size: 28px !important;
}
h2 {
  font-size: 24px !important;
}
h3 {
  font-size: 22px !important;
}
h4 {
  font-size: 18px !important;
}
h5 {
  font-size: 16px !important;
}
h6 {
  font-size: 12px !important;
}


body,
div,
span {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 12px;
}

.home {
  height: 100vh;
  overflow: hidden;
  position: relative;
  width: 100vw;
}

/**
 * Modal
 */

.modal__background {
  background: rgba(0, 0, 0, 0.5);
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
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
    color: $color-gray-dark;
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

/**
 * Navigation Bar
 */

.nav-bar {
  background: $color-gray-darkest;
  height: 66px;
  width: 100%;

  .title {
    color: $color-gray-lightest;
    display: inline-block;
    margin: 0 0 0 20px;
    height: 100%;
    line-height: 66px;
    text-align: left;
    vertical-align: middle;
    width: calc(100% - 90px);
  }

  .nav-bar__buttons {
    display: inline-block;
    height: auto;
    margin: 0px 12px;

    .button {
      vertical-align: middle;
    }
  }
}

/**
 * Header
 */

.project-header,
.fc-toolbar.fc-header-toolbar {
  margin: 0;
  overflow: hidden;
  position: absolute;
  top: 80px;
  width: calc(100% - 384px);
}

.project-header {
  .project-title {
    display: inline-block;
    line-height: 44px;
    margin: 0 0 0 18px;
    text-align: left;
    width: calc(100% - 18px);
    white-space: nowrap;
  }
}

.fc-toolbar.fc-header-toolbar {
  right: 12px;
  text-transform: uppercase;
  width: 360px;
}

/**
 * Footer
 */

.footer {
  background: $color-gray-darkest;
  height: 44px;

  .copyright {
    color: white;
    line-height: 44px;
  }
}

/**
 * Top Bar 
 */

.top-bar {
  margin: 68px 0 10px;

  .calendar-toggle-container,
  .event-toolbar {
    background: $color-gray-mid;
    display: inline-block;
    height: 56px;
    vertical-align: middle;
  }
  
  .calendar-toggle-container {
    width: 60px;
    padding: 10px;
  }

  .event-toolbar {
    overflow-x: auto;
    overflow-y: hidden;
    padding: 10px 0;
    position: relative;
    white-space: nowrap;
    width: calc(100% - 80px);
  }
}

/**
 * Buttons
 */

.fc-event,
.fc-event-container .fc-event,
.fc-button.fc-button-primary,
.button {
  background: $button-bg-color;
  border: 1px solid $button-border-color;
  color: $button-color !important;

  &:hover,
  &:focus,
  &:active {
    background-color: $button-bg-color-hover;
    border-color: $button-bg-color-hover;
    box-shadow: none;
    cursor: pointer;
  } 

  &.disabled {
    background-color: $button-bg-color-disabled;
    border-color: $button-bg-color-disabled;
    box-shadow: none;
    cursor: not-allowed;
  }
}

.button--primary {
  font-size: 18px;
  height: $button-size-default;
  line-height: $button-size-default;
  margin: 10px 0;
  width: 200px;
}

.button--large {
  border-radius: $button-radius;
  display: inline-block;
  font-size: 18px;
  height: $button-size-large;
  line-height: $button-size-large;
  padding: 5px;
  text-transform: uppercase;
  width: 200px;
}

.fc-button.fc-button-primary,
.button--icon {
  border-radius: $button-radius;
  display: inline-block;
  height: $button-size-large;
  padding: 0;
  width: $button-size-large;

  .fc-icon,
  .icon {
    font-weight: 600;
    margin: 0;
    padding: 0;
    vertical-align: middle;
  }

  .icon {
    font-size: $button-size-small;
    line-height: $button-size-large;
  }

  .fc-icon {
    font-size: $button-size-default;
  }
}

/**
 * Toolbar
 */

.fc-dragging.fc-event,
.event-toolbar .fc-event {
  display: inline-block;
  margin: 0 10px 0 0;
  width: 200px;

  .fc-event-name,
  .fc-event-count {
    display: inline-block;
    font-size: 18px;
    font-weight: 600;
  }

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
  
  .fc-left,
  .fc-right {
    &:focus {
      outline: none;
    }
  }
}

/**
 * Calendar
 */

.fc-view-container {
  overflow: hidden;
}

.fc-unthemed .fc-content-skeleton {
  height: 100vh;
  max-height: calc(100vh - 311px);
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0;
}

.fc-event .fc-title {
  font-size: 18px;
  font-weight: 600;
}

.fc-event,
.fc-day-header {
  height: $button-size-large;
  line-height: $button-size-large;
  margin-bottom: 5.5px;
  text-align: center;
}

.fc-day-header {
  position: relative;

  span {    
    background: $color-gray-darkest;
    color: $color-gray-lightest;
    font-size: 24px;
    height: $button-size-large;
    line-height: $button-size-large;
    position: absolute;
    right: 0;
    top: 0;
    width: $button-size-large;
  }  
}

.fc-day-header.fc-today span {
  background: $color-secondary-dark;
}

.fc-today {
  background: $color-secondary-light !important;
}

.fc-sun,
.fc-sat {
  background: $color-gray-light;
}

.fc-dragging,
.dragging {
  cursor: grabbing !important;
}

/**
 * Scrollbars 
 */

div {
  &::-webkit-scrollbar {
    background-color: $color-gray-light;
    border-radius: 10px;
    height: 6px;
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background-color: $color-gray-light;
  }
  &::-webkit-scrollbar-thumb {
    background-color: $color-gray-dark;
  }

  &::-webkit-scrollbar-track,
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  }
}




</style>