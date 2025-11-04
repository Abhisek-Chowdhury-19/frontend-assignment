import { useState, useEffect } from "react";
import "./App.css";
import { DateTime } from "luxon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [selectedSlot, setSelectedSlot] = useState({});
  const [ukToMyTime, setUkToMyTime] = useState([]);
  const [weekCount, setWeekCount] = useState(0);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [dates, setDates] = useState([]);
  const [slots, setSlots] = useState([]);

  const ukTimeSlots = {
    Sat: { slots: ["10:00", "10:30", "11:00"] },
    Sun: { slots: ["14:00", "14:30", "15:00"] },
    Mon: { slots: ["18:00", "18:30", "19:00"] },
  };

  function convertUKToMyTime(year, month, day, time) {
    const [hours, minutes] = time.split(":").map(Number);
    const ukTime = DateTime.fromObject(
      { year, month, day, hours, minutes },
      { zone: "Europe/London" }
    );
    const userTime = ukTime.toLocal();
    return userTime.toFormat("ccc HH:mm");
  }

  useEffect(() => {
    const datesq = [];
    const slotstemp = [];
    for (let i = 1; i <= 7; i++) {
      const nextDate = new Date(
        Date.now() + i * 24 * 60 * 60 * 1000 + 7 * 24 * 60 * 60 * 1000 * weekCount
      );
      const dayName = nextDate.toLocaleString("en-GB", { weekday: "short" });
      const monthName = nextDate.toLocaleString("en-GB", { month: "short" });
      const month = nextDate.getMonth() + 1;
      const day = nextDate.toLocaleString("en-GB", { day: "2-digit" });
      const year = nextDate.getFullYear();
      if (ukTimeSlots[dayName]) {
        ukTimeSlots[dayName].slots.forEach((time) => {
          const convertedTime = convertUKToMyTime(year, month, day, time);
          const [datePart, timePart] = convertedTime.split(" ");
          slotstemp.push({ day: datePart, time: timePart });
        });
      }
      datesq.push({ dayName, monthName, day, year, month });
    }
    setDates(datesq);
    setSlots(slotstemp);
  }, [weekCount]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedSlot.date || !selectedSlot.data) {
      alert("Please select a slot before submitting!");
      return;
    }

    setBookedSlots((prevBookedSlots) => {
      const updatedSlots = [...prevBookedSlots, selectedSlot];
      console.log("✅ Updated Booked Slots:", updatedSlots);
      return updatedSlots;
    });

    setSelectedSlot({});
  };

  return (
    <>
      <div className="bg-zinc-800 w-full text-white min-h-screen flex justify-center items-center p-4">
        <div className="w-full max-w-5xl bg-white rounded-lg text-black shadow-lg p-4 sm:p-6 md:p-8 flex flex-col">
          {/* Header */}
          <h1 className="text-xl sm:text-2xl font-bold text-center mb-4">
            Select Date & Time
          </h1>

          {/* Week Navigation */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <button
              onClick={() => setWeekCount((prev) => Math.max(prev - 1, 0))}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm sm:text-base"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Previous
            </button>

            <h2 className="text-base sm:text-lg font-semibold">
              Week {weekCount + 1}
            </h2>

            <button
              onClick={() => setWeekCount((prev) => Math.min(prev + 1, 7))}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm sm:text-base"
            >
              Next <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
     <div className="w-full overflow-x-auto">
  <div className="min-w-max">
    {/* Dates Row */}
    <div className="flex border-b border-gray-300 pb-2 mb-4">
      {dates.map((date, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-[120px] flex flex-col items-center text-center"
        >
          <span className="text-sm font-semibold">{date.dayName}</span>
          <span className="text-lg font-bold">{date.day}</span>
        </div>
      ))}
    </div>

    {/* Slots Row */}
    <div className="flex border-b border-gray-300 pb-2 mb-4">
      {dates.map((date, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-[120px] flex flex-col items-center text-center"
        >
          {slots.filter((slot) => slot.day === date.dayName).length > 0 ? (
            slots
              .filter((slot) => slot.day === date.dayName)
              .map((slot, idx) => {
                const isBooked = bookedSlots.some(
                  (b) =>
                    b.date === `${date.day}-${date.month}-${date.year}` &&
                    b.data?.[slot.time]
                );

                const isSelected =
                  selectedSlot?.date ===
                    `${date.day}-${date.month}-${date.year}` &&
                  selectedSlot?.data?.[slot.time]?.status === "selected";

                return (
                  <span
                    key={idx}
                    onClick={() => {
                      if (isBooked) return;

                      if (isSelected) {
                        setSelectedSlot({});
                      } else {
                        setSelectedSlot({
                          date: `${date.day}-${date.month}-${date.year}`,
                          data: { [slot.time]: { status: "selected" } },
                        });
                      }
                    }}
                    className={`text-xs sm:text-sm text-center px-2 py-1 border rounded my-1 w-full ${
                      isBooked
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : isSelected
                        ? "bg-black text-white cursor-pointer"
                        : "cursor-pointer hover:bg-sky-800 hover:text-white"
                    }`}
                  >
                    {slot.time} {isBooked && "(Booked)"}
                  </span>
                );
              })
          ) : (
            <span className="text-xs sm:text-sm w-full text-center px-2 py-1 border rounded my-1 text-gray-400 bg-gray-100 cursor-not-allowed">
              No Slots
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
</div>


          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
            <span className="text-sm sm:text-base">
              {selectedSlot?.date
                ? `${selectedSlot?.date} ${Object.keys(
                    selectedSlot?.data ?? {}
                  ).join(", ")}`
                : ""}
            </span>

            <button
              onClick={handleSubmit}
              className="w-full sm:w-auto px-4 py-2 rounded border border-gray-300 bg-sky-800 text-white hover:bg-sky-700 text-sm sm:text-base"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
