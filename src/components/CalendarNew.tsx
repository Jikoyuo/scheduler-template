import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Box,
  Button,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import useCalendarNew from "./useCalendarNew";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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
    handlePrev,
    handleNext,
    handleToday,
    selectedDate,
    handleDateChange,
    setSelectedDate,
  } = useCalendarNew();

  return (
    <div>
      <Box display={"flex"}>
        <Box display={"flex"} p={2} gap={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop" //node_modules
              value={dayjs(selectedDate)}
              onChange={handleDateChange} // This will handle the date change and update the calendar view
              // This will handle the month change and update the calendar view
              onMonthChange={(date) => {
                const calendarApi = calendarRef.current?.getApi();
                if (calendarApi) {
                  calendarApi.gotoDate(date.toDate());
                  setSelectedDate(date.toDate());
                }
              }}
              shouldDisableDate={(date) => date.isBefore(dayjs(), "day")} // Disable past dates
            />
          </LocalizationProvider>
        </Box>
        <Box
          width={"100%"}
          p={2}
          display={"flex"}
          flexDirection={"column"}
          gap={2}
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Stack direction={"row"} spacing={2}>
              <Button onClick={handlePrev}>Prev</Button>
              <Button onClick={handleToday}>Today</Button>
              <Button onClick={handleNext}>Next</Button>
            </Stack>

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
          </Box>
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
          // FullCalendar component
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
            dayCellClassNames={(date) => {
              return dayjs(date.date).isBefore(dayjs(), "day")
                ? "fc-past-day"
                : "fc-future-day";

              // if (dayjs(date.date).isBefore(dayjs(), "day")) {
              //   return "fc-past-day";
              // } else {
              //   return "fc-future-day";
              // }
            }}
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            eventOverlap={false}
            eventDisplay="block"
            eventClick={handleEventClick}
            dateClick={handleDateClick}
          />
          <style>
            {`
        .fc-past-day {
          background-color: #f0f0f0 !important;
          pointer-events: none;
          opacity: 0.5;
        }
      `}
          </style>
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
                  setEventDetails({
                    ...eventDetails,
                    startTime: e.target.value,
                  })
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
      </Box>
    </div>
  );
};

export default CalendarNew;
