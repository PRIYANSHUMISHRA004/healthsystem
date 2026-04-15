"use client";

import { useState } from "react";
import Chat from "../../components/Chat";

export default function ChatPage() {
  const [chatRoomId, setChatRoomId] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [userType, setUserType] = useState<"user" | "hospital">("user");
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatRoomId.trim() && currentUserId.trim()) {
      setIsConnected(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Health Communication</h1>
          <p className="mt-2 text-gray-600">Connect with your doctor or patient in real-time.</p>
        </div>

        {!isConnected ? (
           <form onSubmit={handleConnect} className="bg-white shadow-sm rounded-lg p-6 space-y-4 max-w-md mx-auto border border-gray-200 flex flex-col">
             <div>
               <label className="block text-sm font-medium text-gray-700">Chat Room ID (MongoDB ObjectId)</label>
               <input
                 type="text"
                 required
                 className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                 value={chatRoomId}
                 onChange={(e) => setChatRoomId(e.target.value)}
                 placeholder="e.g. 60d5ecb8b392d7..."
               />
             </div>
             
             <div>
               <label className="block text-sm font-medium text-gray-700">Your User ID (MongoDB ObjectId)</label>
               <input
                 type="text"
                 required
                 className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                 value={currentUserId}
                 onChange={(e) => setCurrentUserId(e.target.value)}
                 placeholder="e.g. 60d5ecb8b392d8..."
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700">Login As</label>
               <select
                 className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                 value={userType}
                 onChange={(e) => setUserType(e.target.value as "user" | "hospital")}
               >
                 <option value="user">Patient</option>
                 <option value="hospital">Hospital / Doctor</option>
               </select>
             </div>

             <button
               type="submit"
               className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
             >
               Join Chat
             </button>
           </form>
        ) : (
          <div className="space-y-4">
             <button 
               onClick={() => setIsConnected(false)}
               className="text-sm text-blue-600 hover:text-blue-500 font-medium cursor-pointer"
             >
               &larr; Leave and Go Back
             </button>
             <Chat
               chatRoomId={chatRoomId}
               currentUserId={currentUserId}
               userType={userType}
             />
          </div>
        )}

      </div>
    </div>
  );
}
