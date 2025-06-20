import dayjs from "dayjs";
import { useState, useRef } from "react";
import shorthenedDays from "./shorthenedDays";

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
    notes: "", // Catatan ditambahkan
  });

  interface NewEvent {
    type: string;
    categoryType: string;
    typeName: string;
    quota: string;
    sessionDuration: string;
    startTime: string;
    endTime: string;
    notes: string;
    senin: boolean;
    selasa: boolean;
    rabu: boolean;
    kamis: boolean;
    jumat: boolean;
    sabtu: boolean;
    minggu: boolean;
    [key: string]: boolean | string;
  }

  const [newEvent, setNewEvent] = useState<NewEvent>({
    type: "Praktek",
    categoryType: "",
    typeName: "",
    quota: "",
    sessionDuration: "",
    startTime: "",
    endTime: "",
    notes: "",
    senin: false,
    selasa: false,
    rabu: false,
    kamis: false,
    jumat: false,
    sabtu: false,
    minggu: false,
  });

  const days = shorthenedDays;

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
      startTime: "07:00", // Default value for demonstration
      endTime: "07:30", // Default value for demonstration
      notes: "", // Reset catatan
    });
    setModalOpen(true);
  };

  const handleEventClick = (arg: any) => {
    setEventDetails({
      id: arg.event.id,
      title: arg.event.title,
      startTime: dayjs(arg.event.startStr).format("HH:mm"),
      endTime: dayjs(arg.event.endStr).format("HH:mm"),
      notes: arg.event.extendedProps.notes || "", // Ambil catatan jika ada
    });
    setModalOpen(true);
  };

  // Fungsi untuk mengubah startTime dan endTime
  const handleTimeChange = (type: "startTime" | "endTime", time: string) => {
    if (time) {
      setEventDetails({ ...eventDetails, [type]: time });
    }
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

  const handleAddEventForDays = () => {
    const eventStart = eventDetails.startTime; // Format 'HH:mm'
    const eventEnd = eventDetails.endTime; // Format 'HH:mm'

    if (!eventStart || !eventEnd) {
      console.error("Start time or end time is missing");
      return;
    }

    // Mapping nama hari ke angka yang digunakan oleh dayjs
    const daysMap: { [key: string]: number } = {
      senin: 1,
      selasa: 2,
      rabu: 3,
      kamis: 4,
      jumat: 5,
      sabtu: 6,
      minggu: 0,
    };

    // Menyiapkan event baru yang akan dibuat
    const newEvents: any[] = [];
    const existingEventIds = new Set(); // Set untuk menghindari duplikasi event

    // Mulai minggu dari Senin
    let currentDate = dayjs().startOf("week").add(1, "day"); // Senin sebagai hari pertama dalam minggu
    console.log("Starting week at:", currentDate.format("YYYY-MM-DD"));

    // Pastikan setidaknya ada satu hari yang dipilih
    let isAnyDaySelected = false;

    // Proses setiap hari yang dipilih
    for (let day in newEvent) {
      if (newEvent[day] && daysMap[day]) {
        const selectedDayNumber = daysMap[day];

        console.log(`Processing day: ${day} with number: ${selectedDayNumber}`);

        // Proses event selama setahun untuk setiap hari yang dipilih
        let tempDate = currentDate.clone();
        while (tempDate.isBefore(dayjs().add(1, "year"))) {
          console.log("Checking currentDate:", tempDate.format("YYYY-MM-DD"));

          // Cek apakah hari ini sesuai dengan hari yang dipilih
          if (tempDate.day() === selectedDayNumber) {
            const eventStartDateTime = tempDate
              .set("hour", parseInt(eventStart.split(":")[0]))
              .set("minute", parseInt(eventStart.split(":")[1]))
              .set("second", 0);

            const eventEndDateTime = tempDate
              .set("hour", parseInt(eventEnd.split(":")[0]))
              .set("minute", parseInt(eventEnd.split(":")[1]))
              .set("second", 0);

            // Membuat session ID berdasarkan event ID dan tanggal
            const eventId = `${eventDetails.id}`; // Menjaga ID event utama tetap sama
            const sessionId = `${eventId}-${tempDate.format("YYYY-MM-DD")}`; // Session ID berdasarkan tanggal

            // Pastikan tidak ada duplikasi ID
            if (!existingEventIds.has(sessionId)) {
              existingEventIds.add(sessionId);
              newEvents.push({
                id: sessionId, // ID unik untuk setiap sesi
                parentEventId: eventId, // Mengaitkan sesi dengan event utama
                title: eventDetails.title,
                start: eventStartDateTime.format("YYYY-MM-DDTHH:mm:ss"),
                end: eventEndDateTime.format("YYYY-MM-DDTHH:mm:ss"),
                description: newEvent.notes, // Menyertakan catatan
              });

              isAnyDaySelected = true; // Menandakan bahwa ada hari yang dipilih
            }
          }

          // Lanjutkan ke minggu berikutnya
          tempDate = tempDate.add(1, "week");
        }
      }
    }

    // Cek apakah ada event yang berhasil dibuat
    if (isAnyDaySelected) {
      console.log("Generated events:", newEvents); // Debugging: Menampilkan generated events
      setEvents((prevEvents) => [...prevEvents, ...newEvents]);
      setModalOpen(false);
    } else {
      console.log("No events were added.");
    }
  };

  const handleEventChange = (
    field: keyof NewEvent,
    value: string | boolean
  ) => {
    setNewEvent({ ...newEvent, [field]: value });
  };

  const toggleDay = (day: string) => {
    handleEventChange(day as keyof NewEvent, !newEvent[day as keyof NewEvent]);
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
    handleTimeChange,
    days,
    toggleDay,
    newEvent,
  };
}
