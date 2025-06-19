import dayjs, { Dayjs } from "dayjs";
import { useRef, useState } from "react";

export default function useCalendarNew() {
  const [events, setEvents] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<string>("timeGridDay");
  const calendarRef = useRef<any>(null);
  const [eventDetails, setEventDetails] = useState<any>({
    id: "",
    title: "",
    startTime: "",
    endTime: "",
  });

  const handleViewChange = (view: string) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(view);
    }
    setCurrentView(view);
  };

  const handleDateClick = (arg: any) => {
    setEventDetails({
      id: Date.now().toString(),
      title: "",
      startTime: arg.dateStr,
      endTime: arg.dateStr,
    });
    setModalOpen(true);
  };

  const handleEventClick = (arg: any) => {
    setEventDetails({
      id: arg.event.id,
      title: arg.event.title,
      startTime: arg.event.startStr,
      endTime: arg.event.endStr,
    });
    setModalOpen(true);
  };

  const handleSaveEvent = () => {
    const updatedEvents = events.filter(
      (event: { id: any }) => event.id !== eventDetails.id
    );
    updatedEvents.push(eventDetails);
    setEvents(updatedEvents);
    setModalOpen(false);
  };

  const handleDeleteEvent = () => {
    const updatedEvents = events.filter(
      (event: { id: any }) => event.id !== eventDetails.id
    );
    setEvents(updatedEvents);
    setModalOpen(false);
  };

  const handleAddEventForDays = (selectedDay: string) => {
    const eventStart = dayjs(eventDetails.startTime);
    const eventEnd = dayjs(eventDetails.endTime);
    const daysMap: { [key: string]: number } = {
      senin: 1,
      selasa: 2,
      rabu: 3,
      kamis: 4,
      jumat: 5,
      sabtu: 6,
      minggu: 0,
    };

    const selectedDayNumber = daysMap[selectedDay.toLowerCase()];
    const startOfWeek = dayjs().startOf("week");
    const endOfYear = dayjs().add(1, "year");
    let currentDate = startOfWeek;

    const newEvents = [];
    while (currentDate.isBefore(endOfYear)) {
      if (currentDate.day() === selectedDayNumber) {
        newEvents.push({
          ...eventDetails,
          id: `${eventDetails.id}-${currentDate.format("YYYY-MM-DD")}`,
          startTime: currentDate.format("YYYY-MM-DDTHH:mm:ss"),
          endTime: currentDate
            .add(eventEnd.diff(eventStart, "milliseconds"), "milliseconds")
            .format("YYYY-MM-DDTHH:mm:ss"),
        });
      }
      currentDate = currentDate.add(1, "week");
    }

    setEvents([...events, ...newEvents]);
    setModalOpen(false);
  };

  const handlePrev = () => {
    const api = calendarRef.current?.getApi();
    if (api) {
      api.prev();
      setSelectedDate(api.getDate());
    }
  };

  const handleNext = () => {
    const api = calendarRef.current?.getApi();
    if (api) {
      api.next();
      setSelectedDate(api.getDate());
    }
  };

  const handleToday = () => {
    const api = calendarRef.current?.getApi();
    if (api) {
      api.today();
      setSelectedDate(api.getDate());
    }
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const datePickerRef = useRef<any>(null);

  const handleDateChange = (date: Dayjs | null) => {
    if (!date) return;
    setSelectedDate(date.toDate());
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.gotoDate(date.toDate());
    }
  };

  return {
    handleViewChange,
    handleDateClick,
    handleEventClick,
    handleSaveEvent,
    handleDeleteEvent,
    modalOpen,
    currentView,
    calendarRef,
    events,
    setModalOpen,
    eventDetails,
    setEventDetails,
    handleAddEventForDays,
    handlePrev,
    handleNext,
    handleToday,
    datePickerRef,
    selectedDate,
    handleDateChange,
    setSelectedDate,
  };
}
