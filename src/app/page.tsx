"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  name: string;
  email: string;
  phone: string;
  price: number;
  timeSlot: string;
}

export default function Home() {
  const [ticketNumber, setTicketNumber] = useState<string>("");
  const [lastTicketNumber, setLastTicketNumber] = useState<number>(0);
  const [availableSlots, setAvailableSlots] = useState<{ id: string, time: string, available: boolean }[]>([]);
  const { register, handleSubmit, reset, watch } = useForm<FormData>();

  const userName = watch("name", "");
  const selectedTimeSlot = watch("timeSlot", "");

  // Generate time slots for the current day (10-minute intervals from 10 AM to 8 PM)
  useEffect(() => {
    const generateTimeSlots = () => {
      const slots = [];
      const today = new Date();
      const startHour = 10; // 10 AM
      const endHour = 20; // 8 PM

      // Get stored bookings
      const bookedSlots = JSON.parse(localStorage.getItem("bookedTimeSlots") || "[]");

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 10) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          const slotId = `${today.toDateString()}-${timeString}`;

          // Check if this slot is already booked
          const isBooked = bookedSlots.includes(slotId);

          slots.push({
            id: slotId,
            time: timeString,
            available: !isBooked
          });
        }
      }

      setAvailableSlots(slots);
    };

    generateTimeSlots();
  }, []);

  useEffect(() => {
    const storedLastTicket = localStorage.getItem("lastTicketNumber");
    if (storedLastTicket) {
      setLastTicketNumber(parseInt(storedLastTicket));
    }
  }, []);

  const generateTicketNumber = () => {
    const newTicketNum = lastTicketNumber + 1;
    localStorage.setItem("lastTicketNumber", newTicketNum.toString());
    setLastTicketNumber(newTicketNum);
    return `#${newTicketNum.toString().padStart(3, '0')}`;
  };

  const onSubmit = (data: FormData) => {
    const newTicketNumber = generateTicketNumber();
    setTicketNumber(newTicketNumber);



    // Use the newly generated ticket number
    fetch("https://script.google.com/macros/s/AKfycbxVos26wuxc0ls5wSmidpin2cHgtQqFvQ8J-rURrODw9U5WRAsWfk6Xc7O0ivN0Y7mA/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticketId: newTicketNumber,  // Use newTicketNumber instead of ticketNumber
        name: data.name,
        email: data.email,
        phone: data.phone,
        price: data.price,
        timeSlot: data.timeSlot
      }),
    })
      .then(response => response.text())
      .then(result => console.log("Google Sheet Response:", result))
      .catch(error => console.error("Fetch Error:", error));


    // Mark the time slot as booked
    if (data.timeSlot) {
      const bookedSlots = JSON.parse(localStorage.getItem("bookedTimeSlots") || "[]");
      bookedSlots.push(data.timeSlot);
      localStorage.setItem("bookedTimeSlots", JSON.stringify(bookedSlots));

      // Update available slots in the UI
      setAvailableSlots(currentSlots =>
        currentSlots.map(slot =>
          slot.id === data.timeSlot ? { ...slot, available: false } : slot
        )
      );
    }

    // Get the time for the selected slot
    const selectedSlot = availableSlots.find(slot => slot.id === data.timeSlot);
    const timeSlotText = selectedSlot ? selectedSlot.time : "Not specified";

    const message = `
*✨ WELCOME TO ETIHASAM ✨*

Hello ${data.name},

Thank you for booking the show with us! 🎭

*Booking Details:*
------------------------
🎫 Ticket ID: ${newTicketNumber}
⏰ Time Slot: ${timeSlotText} (10 minute show)
💰 Paid Amount: ₹${data.price}
------------------------

To know more about us:
🌐 https://www.etihasam.com

Have a wonderful day! 🎉
    `.trim();

    let formattedPhone = data.phone.replace(/\D/g, '');
    if (!formattedPhone.startsWith('91')) {
      formattedPhone = '91' + formattedPhone;
    }

    const whatsappLink = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
    reset();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-md shadow-md p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black">
            Ticket Booking
          </h1>
          <p className="text-gray-600 mt-2">Fill in the details below</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Name</label>
            <input
              {...register("name", { required: true })}
              className="w-full p-3 border border-gray-200 rounded-md focus:ring-1 focus:ring-black focus:border-black bg-white transition-all"
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Email</label>
            <input
              {...register("email", { required: true })}
              type="email"
              className="w-full p-3 border border-gray-200 rounded-md focus:ring-1 focus:ring-black focus:border-black bg-white transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Phone Number</label>
            <input
              {...register("phone", { required: true })}
              type="tel"
              className="w-full p-3 border border-gray-200 rounded-md focus:ring-1 focus:ring-black focus:border-black bg-white transition-all"
              placeholder="Enter your phone number (without +91)"
            />
            <p className="text-xs text-gray-500">+91 will be added automatically</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Select Time Slot (10 minutes)</label>
            <select
              {...register("timeSlot", { required: true })}
              className="w-full p-3 border border-gray-200 rounded-md focus:ring-1 focus:ring-black focus:border-black bg-white transition-all"
            >
              <option value="">Select a time slot</option>
              {availableSlots
                .filter(slot => slot.available)
                .map(slot => (
                  <option key={slot.id} value={slot.id}>
                    {slot.time} - {
                      // Calculate end time (10 minutes later)
                      (() => {
                        const [hours, minutes] = slot.time.split(':').map(Number);
                        const endMinutes = minutes + 10;
                        const endHours = hours + Math.floor(endMinutes / 60);
                        const formattedEndMinutes = (endMinutes % 60).toString().padStart(2, '0');
                        const formattedEndHours = endHours.toString().padStart(2, '0');
                        return `${formattedEndHours}:${formattedEndMinutes}`;
                      })()
                    }
                  </option>
                ))}
            </select>
            {availableSlots.filter(slot => slot.available).length === 0 && (
              <p className="text-xs text-red-500">All slots for today are booked</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Paid Amount</label>
            <input
              {...register("price", { required: true, min: 0 })}
              type="number"
              className="w-full p-3 border border-gray-200 rounded-md focus:ring-1 focus:ring-black focus:border-black bg-white transition-all"
              placeholder="Enter the paid amount"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white font-medium py-3 px-4 rounded-md transition duration-200 hover:bg-gray-800"
            disabled={availableSlots.filter(slot => slot.available).length === 0}
          >
            Generate Ticket & Send WhatsApp
          </button>
        </form>

        {ticketNumber && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Preview:</h2>
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-gray-800 font-medium mb-2">
                Ticket Generated: {ticketNumber}
              </p>
              <p className="text-gray-700 mb-1">
                For: {userName || "Customer"}
              </p>
              {selectedTimeSlot && (
                <p className="text-gray-700">
                  Time Slot: {availableSlots.find(slot => slot.id === selectedTimeSlot)?.time || "Not specified"} (10 minute show)
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500 text-center">
          Next ticket will be #{(lastTicketNumber + 1).toString().padStart(3, '0')}
        </div>
      </div>
    </div>
  );
}