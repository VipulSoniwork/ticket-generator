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
    const newTicketNum = lastTicketNumber + 1;
    localStorage.setItem("lastTicketNumber", newTicketNum.toString());
    setLastTicketNumber(newTicketNum);
    return `#${newTicketNum.toString().padStart(3, '0')}`;
  };

  const onSubmit = (data: FormData) => {
    const newTicketNumber = generateTicketNumber();
    setTicketNumber(newTicketNumber);
    
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

    let formattedPhone = data.phone.replace(/\D/g, '');
    if (!formattedPhone.startsWith('91')) {
      formattedPhone = '91' + formattedPhone;
    }
    
    const whatsappLink = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
    
    reset();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-amber-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-sm mx-4">
        <h1 className="text-2xl font-medium text-amber-800 mb-6 text-center">Etihasam Ticket</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <input
              {...register("name", { required: true })}
              className="w-full p-3 border-0 bg-amber-50 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-amber-900"
              placeholder="Name"
            />
          </div>

          <div>
            <input
              {...register("email", { required: true })}
              type="email"
              className="w-full p-3 border-0 bg-amber-50 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-amber-900"
              placeholder="Email"
            />
          </div>

          <div>
            <input
              {...register("phone", { required: true })}
              type="tel"
              className="w-full p-3 border-0 bg-amber-50 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-amber-900"
              placeholder="Phone Number (without +91)"
            />
          </div>

          <div>
            <input
              {...register("price", { required: true, min: 0 })}
              type="number"
              className="w-full p-3 border-0 bg-amber-50 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-amber-900"
              placeholder="Paid Amount (₹)"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md transition duration-200"
          >
            Generate Ticket
          </button>
        </form>

        {ticketNumber && (
          <div className="mt-6 p-4 bg-amber-50 rounded-md text-center">
            <p className="text-amber-800 font-medium">
              Ticket {ticketNumber} for {userName || "Customer"}
            </p>
          </div>
        )}
        
        <div className="mt-4 text-xs text-center text-amber-600">
          Next: #{(lastTicketNumber + 1).toString().padStart(3, '0')}
        </div>
      </div>
    </div>
  );
}