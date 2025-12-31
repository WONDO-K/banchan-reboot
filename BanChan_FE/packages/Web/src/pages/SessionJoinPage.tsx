import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

const baseUrl = import.meta.env.VITE_BASE_API_URL;

const SessionJoinPage: React.FC = () => {
  const [sessionId, setSessionId] = useState("");
  const navigate = useNavigate();
  const [cookies] = useCookies();

  const handleJoinSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await createToken(sessionId);

      navigate(`/meetingPage/${sessionId}`, {
        state: { token, sessionId },
      });
    } catch (error) {
      console.error("Error joining session:", error);
    }
  };

  const createToken = async (sessionId: string): Promise<string> => {
    const response = await axios.post(
      `${baseUrl}/api/session/${sessionId}/token`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.Token}`,

          // Authorization: "Basic " + btoa("OPENVIDUAPP:YOUR_SECRET"),
        },
      }
    );

    const token = response.data;

    return token;
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Join a Session</h2>
        <form onSubmit={handleJoinSession}>
          <div className="mb-4">
            <label
              htmlFor="sessionId"
              className="block text-sm font-medium text-gray-700"
            >
              Session ID
            </label>
            <input
              type="text"
              id="sessionId"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Join Session
          </button>
        </form>
      </div>
    </div>
  );
};

export default SessionJoinPage;
