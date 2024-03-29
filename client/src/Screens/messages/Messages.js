import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Loading from "../../Components/Loading";
import Message from "../../Components/message/Message";
import { useAuth } from "../../Contexts/AuthContext";
import "./messages.css";
import { io } from "socket.io-client";
import { Container } from "@material-ui/core";
import AlertBox from "../../Components/AlertBox";

const Messages = (props) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [membersData, setMembersData] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  const scrollRef = useRef();

  const socket = useRef();

  const ENDPOINT = process.env.REACT_APP_API_BASE_URL;

  const currTask = props.location.state;

  useEffect(() => {
    socket.current = io(ENDPOINT, {
      transports: ["websocket", "polling", "flashsocket"],
    });
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, [ENDPOINT]);

  useEffect(() => {
    arrivalMessage &&
      currTask?.members.includes(arrivalMessage.sender) &&
      auth._id !== arrivalMessage.sender &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currTask, auth]);

  useEffect(() => {
    socket.current?.emit("addUser", { userId: auth._id, room: currTask._id });
  }, [auth, currTask]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const getMessages = async () => {
      try {
        const res = await axios.get("/api/messages/" + currTask?._id, {
          headers: {
            Authorization: auth?.token,
          },
        });
        if (mounted) {
          setMessages(res.data);
          setLoading(false);
        }
      } catch (err) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        );
        setLoading(false);
      }
    };
    getMessages();

    return () => {
      mounted = false;
    };
  }, [auth, currTask]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const getMembers = async () => {
      try {
        const { data } = await axios.post(
          "/api/messages/taskmembers",
          currTask.members
        );
        if (mounted) {
          setMembersData(data);
          setLoading(false);
        }
      } catch (err) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        );
        setLoading(false);
      }
    };
    getMembers();

    return () => {
      mounted = false;
    };
  }, [currTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: auth._id,
      text: newMessage,
      taskId: currTask._id,
    };

    socket.current?.emit("sendMessage", {
      message: newMessage,
      userId: auth._id,
    });

    try {
      const res = await axios.post("/api/messages/newmessage", message, {
        headers: {
          Authorization: auth?.token,
        },
      });
      setMessages([...messages, res.data.savedMessage]);
      setNewMessage("");
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return <Loading />;
  } else if (error) {
    return <AlertBox severity="error" errorMessage={error} />;
  } else {
    return (
      <Container>
        <div className="messenger">
          <div className="chatBox">
            <div className="chatBoxTop">
              {messages.map((message) => {
                const own = message.sender === auth._id ? true : false;
                const senderInfo = membersData.find(
                  (mem) => mem._id === message.sender
                );
                return (
                  <div
                    ref={scrollRef}
                    key={`${message._id}_${message.createdAt}`}
                  >
                    <Message message={message} own={own} sender={senderInfo} />
                  </div>
                );
              })}
            </div>
            <form className="chatBoxBottom" onSubmit={handleSubmit}>
              <input
                className="chatMessageInput"
                placeholder="write something..."
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
              ></input>
              <button type="submit" className="chatSubmitButton">
                Send
              </button>
            </form>
          </div>
        </div>
      </Container>
    );
  }
};

export default Messages;
