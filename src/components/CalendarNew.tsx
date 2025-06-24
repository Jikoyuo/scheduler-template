import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, Button, MenuItem, Modal, Select, TextField } from "@mui/material";
import useCalendarNew from "./useCalendarNew"; // Menyertakan hook custom untuk logika
import shorthenedDays from "./shorthenedDays";

const CalendarNew = () => {
  const {
    handleViewChange,
    handleDateClick,
    handleEventClick,
    handleAddEventForDays,
    modalOpen,
    currentView,
    calendarRef,
    events,
    setModalOpen,
    eventDetails,
    setEventDetails,
    days,
    toggleDay,
    newEvent,
    handleTimeChange, // Fungsi untuk mengubah startTime dan endTime
  } = useCalendarNew(); // Menggunakan custom hook untuk menangani logika penjadwalan

  // Daftar pilihan waktu
  const timeOptions = [
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
  ];

  return (
    <Box>
      <Button
        onClick={() => setModalOpen(true)} // Tombol untuk menampilkan modal
        type="submit"
        variant="outlined"
      >
        Tambah Jadwal
      </Button>

      <Select
        value={currentView}
        onChange={(e) => handleViewChange(e.target.value as string)}
        sx={{
          minWidth: "200px",
          minHeight: "38px",
          borderRadius: "8px",
          border: "1px solid #A8A8BD",
        }}
      >
        <MenuItem value="dayGridMonth">Bulan</MenuItem>
        <MenuItem value="timeGridWeek">Minggu</MenuItem>
        <MenuItem value="timeGridDay">Hari</MenuItem>
      </Select>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={currentView}
        locale="id"
        events={events} // Pass the updated events state to FullCalendar
        selectable
        dayMaxEvents
        nowIndicator={true}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
      />

      {/* Modal untuk input event */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div
          style={{
            padding: "20px",
            backgroundColor: "white",
            margin: "50px auto",
            width: "300px",
          }}
        >
          <h3>{eventDetails.id ? "Edit Event" : "Tambah Event"}</h3>
          <TextField
            label="Title"
            value={eventDetails.title}
            onChange={(e) =>
              setEventDetails({ ...eventDetails, title: e.target.value })
            }
            fullWidth
          />

          {/* Pilihan Start Time dan End Time menggunakan button */}
          <div>
            <h4>Start Time</h4>
            {timeOptions.map((time) => (
              <Button
                key={time}
                onClick={() => handleTimeChange("startTime", time)}
                sx={{
                  margin: "5px",
                  padding: "5px 10px",
                  border: "1px solid #8F85F3",
                  color: eventDetails.startTime === time ? "#fff" : "#8F85F3",
                  backgroundColor:
                    eventDetails.startTime === time ? "#8F85F3" : "transparent",
                  borderRadius: "8px",
                }}
              >
                {time}
              </Button>
            ))}
          </div>

          <div>
            <h4>End Time</h4>
            {timeOptions.map((time) => (
              <Button
                key={time}
                onClick={() => handleTimeChange("endTime", time)}
                sx={{
                  margin: "5px",
                  padding: "5px 10px",
                  border: "1px solid #8F85F3",
                  color: eventDetails.endTime === time ? "#fff" : "#8F85F3",
                  backgroundColor:
                    eventDetails.endTime === time ? "#8F85F3" : "transparent",
                  borderRadius: "8px",
                }}
              >
                {time}
              </Button>
            ))}
          </div>

          {/* Pilihan Hari */}
          {days.map((day) => (
            <Button
              key={day.value}
              onClick={() => toggleDay(day.value)}
              sx={{
                width: "50%",
                minWidth: "0px",
                border: "1px solid #8F85F3",
                color: newEvent[day.value as keyof typeof newEvent]
                  ? "#fff"
                  : "#8F85F3",
                backgroundColor: newEvent[day.value as keyof typeof newEvent]
                  ? "#8F85F3"
                  : "transparent",
                borderRadius: "16px",
                padding: 1,
                "&:hover": {
                  bgcolor: "#8F85F3",
                  color: "white",
                },
                transition: "background-color 0.3s, color 0.3s",
              }}
            >
              {day.label}
            </Button>
          ))}

          {/* Catatan / Deskripsi */}
          <TextField
            label="Catatan"
            value={eventDetails.notes}
            onChange={(e) =>
              setEventDetails({ ...eventDetails, notes: e.target.value })
            }
            fullWidth
            style={{ marginTop: "10px" }}
          />

          {/* Tombol Simpan */}
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Button
              onClick={handleAddEventForDays} // Menambahkan event berdasarkan hari yang dipilih
              color="primary"
              variant="contained"
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </Box>
  );
};

export default CalendarNew;
