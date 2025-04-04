// // pages/api/submit-ticket.js
// export default async function handler(req, res) {
//     if (req.method === 'POST') {
//       try {
//         const response = await fetch(
//           'https://script.google.com/macros/s/AKfycbxVos26wuxc0ls5wSmidpin2cHgtQqFvQ8J-rURrODw9U5WRAsWfk6Xc7O0ivN0Y7mA/exec',
//           {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(req.body),
//           }
//         );
        
//         const data = await response.text();
//         res.status(200).json({ success: true, data });
//       } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//       }
//     } else {
//       res.setHeader('Allow', ['POST']);
//       res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
//   }

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch("https://script.google.com/macros/s/AKfycbwlPjV-vOhuDmAuhs4AGrPy36QlWyGJ9Og5MfgE8-uklJfdzhRLGT847F9PwUN50LaV/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.text();
    return NextResponse.json({ message: "Success", data });
  } catch {
    return NextResponse.json({ error: "Failed to submit data" }, { status: 500 });
  }
}

