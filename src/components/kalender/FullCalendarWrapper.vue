<template>
  <div class="bg-white dark:bg-gray-800 rounded-3xl p-1 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div class="p-2 sm:p-4">
      <div ref="calendar" class="w-full custom-calendar"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { id as idLocale } from 'date-fns/locale';

const props = defineProps({
  events: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['event-click']);

const calendar = ref(null);
let fullCalendarInstance = null;

const renderCalendar = () => {
  if (fullCalendarInstance) fullCalendarInstance.destroy();
  if (!calendar.value) return; 

  fullCalendarInstance = new Calendar(calendar.value, {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: props.events,
    locale: idLocale,
    buttonText: { 
      today: 'Hari Ini',
      month: 'Bulan',
      week: 'Minggu',
      day: 'Hari'
    },
    eventClick: (info) => {
      emit('event-click', info.event.id);
    },
    eventDidMount: (info) => {
      info.el.style.backgroundColor = info.event.extendedProps.backgroundColor;
      info.el.style.borderColor = info.event.extendedProps.borderColor;
      info.el.style.cursor = 'pointer';
      
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
          info.el.style.color = '#ffffff'; 
          const titleEl = info.el.querySelector('.fc-event-title');
          const timeEl = info.el.querySelector('.fc-event-time');
          if(titleEl) titleEl.style.color = '#ffffff';
          if(timeEl) timeEl.style.color = '#ffffff';
      }
    },
    slotMinTime: '07:00:00',
    slotMaxTime: '18:00:00',
    height: 'auto',
    windowResize: function(arg) {
        if (window.innerWidth < 768) {
            fullCalendarInstance.changeView('timeGridDay'); 
            fullCalendarInstance.setOption('headerToolbar', {
            left: 'prev,next',
            center: 'title',
            right: 'today' 
            });
        } else {
            fullCalendarInstance.changeView('dayGridMonth');
            fullCalendarInstance.setOption('headerToolbar', {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            });
        }
    }
  });
  fullCalendarInstance.render();
};

onMounted(() => {
  renderCalendar();
});

// Re-render saat events berubah
watch(() => props.events, () => {
  renderCalendar();
}, { deep: true });
</script>

<style>
/* FULLCALENDAR RESPONSIVE OVERRIDES */
.fc {
  --fc-border-color: #f3f4f6;
  --fc-button-bg-color: #ffffff;
  --fc-button-border-color: #e5e7eb;
  --fc-button-text-color: #374151;
  --fc-button-hover-bg-color: #f9fafb;
  --fc-today-bg-color: #f0f9ff;
  --fc-page-bg-color: #ffffff;
  font-family: inherit;
}

/* DARK MODE FULLCALENDAR AGGRESSIVE OVERRIDES */
.dark .fc {
  --fc-border-color: #374151;
  --fc-button-bg-color: #1f2937;
  --fc-button-border-color: #4b5563;
  --fc-button-text-color: #d1d5db;
  --fc-button-hover-bg-color: #374151;
  --fc-today-bg-color: #1e3a8a;
  --fc-page-bg-color: #1f2937;
  --fc-event-text-color: #ffffff !important;
  color: #e5e7eb !important;
}

.dark .fc-toolbar-title {
  color: #ffffff !important;
}
.dark .fc-col-header-cell-cushion {
  color: #e5e7eb !important;
}
.dark .fc-daygrid-day-number {
  color: #e5e7eb !important;
}
.dark .fc-timegrid-slot-label-cushion {
  color: #9ca3af !important;
}
.dark .fc-list-day-cushion {
    background-color: #374151 !important;
}
.dark .fc-event {
    color: #ffffff !important;
}
.dark .fc-event-title, 
.dark .fc-event-time {
    color: #ffffff !important;
}
.dark .fc-timegrid-event .fc-event-main {
    color: #ffffff !important;
}

/* MOBILE OPTIMIZATION */
@media (max-width: 640px) {
  .fc .fc-toolbar {
    flex-direction: column;
    gap: 1rem;
  }
  .fc .fc-toolbar-chunk {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .fc .fc-button {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }
  .fc .fc-toolbar-title {
    font-size: 1.1rem;
  }
}

.fc .fc-button {
  padding: 0.5rem 1rem;
  font-weight: 600;
  border-radius: 0.75rem;
  text-transform: capitalize;
  transition: all 0.2s;
}
.fc .fc-button-primary:not(:disabled).fc-button-active,
.fc .fc-button-primary:not(:disabled):active {
  background-color: #eff6ff;
  border-color: #bfdbfe;
  color: #2563eb;
}
.dark .fc .fc-button-primary:not(:disabled).fc-button-active {
  background-color: #1e40af;
  border-color: #1e3a8a;
  color: white;
}
</style>