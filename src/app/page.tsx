"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  name: string;
  email: string;
  phone: string;
  price: number;
}

export default function Home() {
  const [ticketNumber, setTicketNumber] = useState<string>("");
  const [lastTicketNumber, setLastTicketNumber] = useState<number>(0);
  const { register, handleSubmit, reset, watch } = useForm<FormData>();
  
  // Watch the name field to use in preview
  const userName = watch("name", "");

  // Load the last ticket number from localStorage on component mount
  useEffect(() => {
    const storedLastTicket = localStorage.getItem("lastTicketNumber");
    if (storedLastTicket) {
      setLastTicketNumber(parseInt(storedLastTicket));
    }
  }, []);

  const generateTicketNumber = () => {
    // Increment the last ticket number
    const newTicketNum = lastTicketNumber + 1;
    
    // Save the new ticket number to localStorage
    localStorage.setItem("lastTicketNumber", newTicketNum.toString());
    setLastTicketNumber(newTicketNum);
    
    // Format with leading zeros to ensure 3 digits
    return `#${newTicketNum.toString().padStart(3, '0')}`;
  };

  const onSubmit = (data: FormData) => {
    const newTicketNumber = generateTicketNumber();
    setTicketNumber(newTicketNumber);
    
    // Format WhatsApp message with improved formatting and personalization
    const message = `
*✨ WELCOME TO ETIHASAM ✨*

Hello ${data.name},

Thank you for booking the show with us! 🎭

*Booking Details:*
------------------------
🎫 Ticket ID: ${newTicketNumber}
💰 Paid Amount: ₹${data.price}
------------------------

To know more about us:
🌐 https://www.etihasam.com

Have a wonderful day! 🎉
    `.trim();

    // Add +91 prefix to the phone number if it doesn't already have it
    let formattedPhone = data.phone.replace(/\D/g, '');
    if (!formattedPhone.startsWith('91')) {
      formattedPhone = '91' + formattedPhone;
    }
    
    // Create WhatsApp link
    const whatsappLink = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;
    
    // Open in a new tab
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
              <p className="text-gray-700">
                For: {userName || "Customer"}
              </p>
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