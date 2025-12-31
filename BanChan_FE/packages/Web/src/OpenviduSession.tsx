// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { OpenVidu } from "openvidu-browser";

// const OPENVIDU_SERVER_SECRET = "YOUR_SECRET";

// interface Meeting {
//   id: number;
//   roomName: string;
//   startDate: string;
//   startTime: string;
//   session: string | null;
//   createdAt: string | null;
//   active: boolean;
// }

// const OpenViduSession: React.FC = () => {
//   const [session, setSession] = useState<any>(null);
//   const [token, setToken] = useState<string>("");
//   const [subscribers, setSubscribers] = useState<any[]>([]);
//   const videoRef = useRef<HTMLVideoElement>(null);

//   const meeting: Meeting = {
//     id: 1,
//     roomName: "Test Room",
//     startDate: "2023-01-01",
//     startTime: "10:00",
//     session: null,
//     createdAt: null,
//     active: true,
//   };

//   useEffect(() => {
//     if (token && !session) {
//       joinSession();
//     }
//   }, [token]);

//   const getToken = async (meeting: Meeting) => {
//     try {
//       const sessionId = await createSession(meeting.id);
//       console.log("Session ID:", sessionId);
//       const token = await createToken(sessionId);
//       console.log("Token:", token);
//       setToken(token);
//     } catch (error) {
//       console.error("Error getting token:", error);
//     }
//   };

//   const createSession = async (meetingId: number) => {
//     try {
//       const response = await axios.post(
//         `http://localhost:8080/api/session/${meetingId}`,
//         {},
//         {
//           headers: {
//             Authorization: `Basic ${btoa(
//               "OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET
//             )}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       console.log("Create Session Response:", response.data);
//       return response.data; // Assuming the response contains an 'id' field
//     } catch (error) {
//       console.error("Error creating session:", error);
//       throw error;
//     }
//   };

//   const createToken = async (sessionId: string) => {
//     try {
//       const response = await axios.post(
//         `http://localhost:8080/api/session/${sessionId}/token`,
//         { session: sessionId },
//         {
//           headers: {
//             Authorization: `Basic ${btoa(
//               "OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET
//             )}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       console.log("Create Token Response:", response.data);
//       return response.data; // Assuming the response contains a 'token' field
//     } catch (error) {
//       console.error("Error creating token:", error);
//       throw error;
//     }
//   };

//   const joinSession = () => {
//     const OV = new OpenVidu();
//     const session = OV.initSession();

//     session.on("streamCreated", (event: any) => {
//       const subscriber = session.subscribe(event.stream, undefined);
//       setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
//     });

//     session
//       .connect(token)
//       .then(() => {
//         const publisher = OV.initPublisher(videoRef.current, {
//           insertMode: "APPEND",
//           width: "100%",
//           height: "100%",
//         });
//         session.publish(publisher);
//       })
//       .catch((error: any) => {
//         console.error(
//           "There was an error connecting to the session:",
//           error.message
//         );
//       });

//     setSession(session);
//   };

//   useEffect(() => {
//     console.log("Number of subscribers:", subscribers.length);
//   }, [subscribers]);

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//       <h1 className="text-2xl font-bold mb-4">OpenVidu React Demo</h1>
//       <button
//         onClick={() => getToken(meeting)}
//         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//       >
//         Join Session
//       </button>
//       <div className="mt-4">
//         <video
//           ref={videoRef}
//           autoPlay={true}
//           className="rounded shadow-md"
//         ></video>
//       </div>
//     </div>
//   );
// };

// export default OpenViduSession;

import React from "react";

const OpenViduSession: React.FC = () => {
  return <div>MeetingPage</div>;
};

export default OpenViduSession;
