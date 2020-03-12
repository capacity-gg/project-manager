<template>
  <div class="content">
    <div class="content__container">  
    <div class="toolbar">
      <h2 class="toolbar__title">{{ project.name }}</h2>
      <div class="toolbar__buttons">
        <div class="button button__primary button__icon tooltip" @click.prevent="$emit('displayModal', project)">
          <span class="icon">
            <font-awesome-icon icon="cog"/>
          </span>
          <span class="tooltip__text">Settings</span>
        </div>
        <csvImport v-model="parseCSV" ref="csvImport"/>
        <div class="button button__primary button__icon tooltip" @click.prevent="exportTableToCSV">
          <span class="icon">
            <font-awesome-icon icon="file-download"/>
          </span>
          <span class="tooltip__text">Export</span>
        </div>
        <div 
          class="button button__primary button__icon tooltip" 
          :class="areUsersVisible ? 'inactive' : ''"
          @click.prevent="setUsersVisibility"
        >
          <span class="icon">
            <font-awesome-icon icon="user"/>
          </span>
          <span class="tooltip__text">Users</span>
        </div>
        <div 
          class="button button__primary button__icon tooltip"
          :class="areMilestonesVisible ? 'inactive' : ''"
          @click.prevent="setMilestonesVisibility"
        >
          <span class="icon">
            <font-awesome-icon icon="exclamation"/>
          </span>  
          <span class="tooltip__text">Milestones</span>
        </div>
      </div>
      <div id="event-toolbar" class="toolbar__events fc-unselectable">
        <div v-if="areMilestonesVisible">
          <div 
            class='button button__secondary fc-event button__secondary' 
            v-for="event in project.milestones" 
            :key="event.ID"
            :id="event.ID"
          >
            <span class="fc-event-name">{{ event.title }}</span>
          </div>
        </div>
        <div v-else-if="areUsersVisible">
          <div 
            class='button button__primary fc-event' 
            v-for="event in project.users" 
            :key="event.ID"
            :id="event.ID"
          >
            <span class="fc-event-name">{{ event.title }}</span>
            <span class="fc-event-count">{{ event.count }}</span>
          </div>
        </div>
      </div>
    </div>
    <fullCalendar 
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
      :eventOrder="handleEventOrder"
      @eventDrop="handleDrop"
      @eventReceive="handleReceive"
      @eventClick="handleClick"
    />
  </div>
  </div>
</template>

<script>

import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

import utils from '@/utils/utils.js';
import csvImport from './partials/csvImport.vue'
import fullCalendar from '@fullcalendar/vue'
import momentPlugin from '@fullcalendar/moment';
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';

export default {
  components: {
    fullCalendar,
    csvImport
  },
  data: () => ({
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
      importedCSV: [],
      areMilestonesVisible: false,
      areUsersVisible: true,
      eventToolbar: {
        draggable: null,
        isDragging: false,
        dragLeft: 0,
        dragStart: 0
      }
  }),
  mounted() {
    var self = this;

    self.$store.dispatch("projects/getProjects", {
      onSuccess: function(response) {
        self.$store.commit('projects/setProjects', response);

        self.$store.commit('projects/setActiveProject', { 
          ID: self.$route.params.ID
        });

        var projectEvents = self.project.events || [];

        projectEvents.forEach(function(projectEvent, index) {
            var calendarEvent = {
              id: projectEvent.ID,
              title: projectEvent.name,
              date: projectEvent.date
            }
            
            self.$refs.fullCalendar.getApi().addEvent(calendarEvent);
        });

        self.setupDraggable();

        self.calculateCount();
      },
      onError: function(err) {
        console.log(err);
      }
    });
  },
  computed: {
    ...mapGetters("projects", [
        "project"
    ]),
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
          let calendarEvent = { 
            id: eventEl.id,
            title: title
          };
          return calendarEvent;
        }
      });

      // Bind event listeners to handle scrolling on drag
      self.eventToolbar.draggable.addEventListener('mousedown', self.dragScrollStart);
      self.eventToolbar.draggable.addEventListener('mouseleave', self.dragScrollEnd);
      self.eventToolbar.draggable.addEventListener('mouseup', self.dragScrollEnd);
      self.eventToolbar.draggable.addEventListener('mousemove', self.dragScrollMove);
    },
    handleEventOrder(prevEvent, nextEvent) {
      var sortOrder = 1;

      var isPrevMilestone = this.isMilestoneEvent(prevEvent.title);
      var isNextMilestone = this.isMilestoneEvent(nextEvent.title);

      // Check whether both events are milestones or users
      if ((isPrevMilestone && isNextMilestone) || (!isPrevMilestone && !isNextMilestone)) {
        // Sort same-type events alphabetcally
        if (prevEvent.title <  nextEvent.title) { sortOrder = -1; }
      }
      // Sort events milestones first
      else if (!isNextMilestone) {
        sortOrder = -1;
      }

      return sortOrder;
    },
    isMilestoneEvent(eventTitle) {
      var self = this;
      var isMilestone = false;

      self.project.milestones.forEach(function(milestone) {
        if (milestone.title == eventTitle) {
          isMilestone = true;
          return;
        }
      });

      return isMilestone;
    },
    calculateCount() {
      var self = this;
      var users = self.project.users;
      var projectEvents = self.project.events;

      if (users) {
          users.forEach(function(unique_event) {
              unique_event.count = 0;

              projectEvents.forEach(function(new_event) {
                  if (unique_event.ID == new_event.ID) {
                      unique_event.count++;
                  }
              });
          });
      }
    },
    setUsersVisibility() {
      var self = this;

      self.areUsersVisible = true;
      self.areMilestonesVisible = false;

      self.$refs.fullCalendar.getApi().rerenderEvents();
    },
    setMilestonesVisibility() {
      var self = this;

      self.areUsersVisible = false;
      self.areMilestonesVisible = true;

      self.$refs.fullCalendar.getApi().rerenderEvents();
    },
    exportTableToCSV() {
      utils.exportTableToCSV(this.project.events, this.project.name);
    },
    importCSVRow(row) {
      var self = this;

      self.$refs.fullCalendar.getApi().addEvent(row);

      self.addEventTolist(row);
    },
    handleRender(info) {
      var self = this;
      var isRendered = true;

      // Ensure milestone class is added to relevant events
      if (self.isMilestoneEvent(info.event.title)) { info.el.classList.add('button__secondary'); }

      return isRendered;
    },
    handleDrop(info) {
      var self = this;

      var oldEvent = {
        id: info.oldEvent.id,
        title: info.oldEvent.title,
        date: utils.convertDate(new Date(info.oldEvent.start))
      };

      var newEvent = {
        id: info.event.id,
        title: info.event.title,
        date: utils.convertDate(new Date(info.event.start))
      };

      var projectEvents = self.project.events || [];

      for (var x = 0; x < projectEvents.length; x++) {
        if (projectEvents[x].date == oldEvent.date &&
            projectEvents[x].ID == oldEvent.id) {
            projectEvents[x].date = newEvent.date;
            break;
        }
      }

      if (self.getFilteredEvents(newEvent.id, newEvent.date).length > 1) { 
          self.removeEventFromList(newEvent); 
      }
      else {
          self.onEventsUpdated();
      }
    },
    handleReceive(info) {
      var self = this;

      var thisEvent = {
        id: info.event.id,
        title: info.event.title,
        date: utils.convertDate(new Date(info.event.start))
      };

      self.addEventTolist(thisEvent);
    },
    handleClick(info) {
      var self = this;

      var thisEvent = {
        id: info.event.id,
        title: info.event.title,
        date: utils.convertDate(new Date(info.event.start))
      }

      self.removeEventFromList(thisEvent)
    },
    addEventTolist(calendarEvent) {
      var self = this;

      // Ensure this event is not a duplicate
      if (self.getFilteredEvents(calendarEvent.id, calendarEvent.date).length > 1) { 
          self.removeEventFromList(calendarEvent); 
      }

      var projectEvent = {
        ID: calendarEvent.id,
        name: calendarEvent.title,
        date: calendarEvent.date
      }
      
      self.project.events.push(projectEvent);

      self.onEventsUpdated();
    },
    removeEventFromList(calendarEvent) {
      var self = this;
      var calendarEvents = self.$refs.fullCalendar.getApi().getEvents();
      
      for (var x = 0; x < calendarEvents.length; x++) {
        // Find event with matching name
        if (calendarEvents[x].id == calendarEvent.id) {
          var thisDate = utils.convertDate(new Date(calendarEvents[x].start));

          // Ensure matching event is on the same day
          if (thisDate == calendarEvent.date) {
            self.project.events.splice(x, 1);
            calendarEvents[x].remove();
            break;
          }
        }
      }

      self.onEventsUpdated();
    },
    getFilteredEvents(id, date) {
      var self = this;
      var calendarEvents = self.$refs.fullCalendar.getApi().getEvents();
      var foundEvents = [];

      for (var x = 0; x < calendarEvents.length; x++) {
        // Find event with matching name
        if (calendarEvents[x].id == id) {
          var thisDate = utils.convertDate(new Date(calendarEvents[x].start));

          // Ensure matching event is on the same day
          if (thisDate == date) { foundEvents.push(calendarEvents[x]); }
        }
      }

      return foundEvents;
    },
    onEventsUpdated() {
      var self = this;

      var project = utils.objPlus({
        "events": self.project.events
      }, self.project);
            
      self.$store.dispatch("projects/updateProject", {
          project: project
      });

      // Updated unique events count after adding/removing event in calendar
      self.$nextTick(() => { self.calculateCount(); });
    }
  }
}
</script>
