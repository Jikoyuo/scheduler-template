import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, Button, MenuItem, Modal, Select, TextField } from "@mui/material";
import useCalendarNew from "./useCalendarNew";

const CalendarNew = () => {
  const {
    handleViewChange,
    handleDateClick,
    handleEventClick,
    handleAddEventForDays,
    handleDeleteEvent,
    modalOpen,
    currentView,
    calendarRef,
    events,
    setModalOpen,
    eventDetails,
    setEventDetails,
  } = useCalendarNew();

  return (
    <div>
      <Box>
        <Button
          value={currentView}
          onClick={(e) => {
            const target = e.target as HTMLButtonElement;
            console.log("hi ", target.value);
          }}
          type="submit"
          variant="outlined"
        >
          lupa
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
          timeZone="local"
          headerToolbar={false}
          height="85vh"
          events={[...events]}
          selectable
          dayMaxEvents
          nowIndicator={true}
          views={{
            timeGridWeek: {
              titleFormat: { month: "long", year: "numeric" },
              slotDuration: "01:00:00",
              slotLabelInterval: "01:00",
            },
            timeGridDay: {
              titleFormat: {
                month: "long",
                year: "numeric",
                day: "numeric",
              },
              slotDuration: "01:00:00",
              slotLabelInterval: "01:00",
            },
          }}
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          eventOverlap={false}
          eventDisplay="block"
          eventClick={handleEventClick}
          dateClick={handleDateClick}
        />

        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <div
            style={{
              padding: "20px",
              backgroundColor: "white",
              margin: "50px auto",
              width: "300px",
            }}
          >
            <h3>{eventDetails.id ? "Edit Event" : "Add Event"}</h3>
            <TextField
              label="Title"
              value={eventDetails.title}
              onChange={(e) =>
                setEventDetails({ ...eventDetails, title: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Start Time"
              value={eventDetails.startTime}
              onChange={(e) =>
                setEventDetails({ ...eventDetails, startTime: e.target.value })
              }
              fullWidth
              style={{ marginTop: "10px" }}
            />
            <TextField
              label="End Time"
              value={eventDetails.endTime}
              onChange={(e) =>
                setEventDetails({ ...eventDetails, endTime: e.target.value })
              }
              fullWidth
              style={{ marginTop: "10px" }}
            />

            <Select
              value={eventDetails.id}
              onChange={(e) =>
                setEventDetails({ ...eventDetails, id: e.target.value })
              }
              sx={{
                minWidth: "200px",
                minHeight: "38px",
                borderRadius: "8px",
                border: "1px solid #A8A8BD",
              }}
            >
              <MenuItem value="senin">Senin</MenuItem>
              <MenuItem value="selasa">Selasa</MenuItem>
              <MenuItem value="rabu">Rabu</MenuItem>
              <MenuItem value="kamis">Kamis</MenuItem>
              <MenuItem value="jumat">Jumat</MenuItem>
              <MenuItem value="sabtu">Sabtu</MenuItem>
              <MenuItem value="minggu">Minggu</MenuItem>
            </Select>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <Button
                onClick={() => handleAddEventForDays(eventDetails.id)}
                color="primary"
                variant="contained"
              >
                Save
              </Button>
              {eventDetails.id && (
                <Button
                  onClick={handleDeleteEvent}
                  color="secondary"
                  variant="contained"
                  style={{ marginLeft: "10px" }}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </Modal>
      </Box>
    </div>
  );
};

export default CalendarNew;
